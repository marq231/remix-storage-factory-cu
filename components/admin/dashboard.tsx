"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  DollarSign, 
  LogOut, 
  FileText, 
  Users, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

interface GrantEligibility {
  id: string
  application_code: string
  full_name: string
  ssn: string
  phone: string
  email: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface GrantApplication {
  id: string
  application_code: string
  full_name: string
  home_address: string
  state: string
  city: string
  country: string
  date_of_birth: string
  phone: string
  email: string
  is_immigrant: boolean
  marital_status: string
  annual_income: number
  reason_for_grant: string
  id_type: string
  id_document_url: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface LoanApplication {
  id: string
  loan_tier: string
  loan_amount: number
  interest_rate: number
  full_name: string
  home_address: string
  state: string
  city: string
  country: string
  date_of_birth: string
  phone: string
  email: string
  is_immigrant: boolean
  marital_status: string
  annual_income: number
  reason_for_loan: string
  collateral: string
  id_type: string
  id_document_url: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface AdminDashboardProps {
  grantEligibility: GrantEligibility[]
  grantApplications: GrantApplication[]
  loanApplications: LoanApplication[]
}

export function AdminDashboard({
  grantEligibility,
  grantApplications,
  loanApplications,
}: AdminDashboardProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<GrantEligibility | GrantApplication | LoanApplication | null>(null)
  const [dialogType, setDialogType] = useState<"eligibility" | "grant" | "loan" | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const stats = {
    totalEligibility: grantEligibility.length,
    pendingEligibility: grantEligibility.filter(e => e.status === "pending").length,
    totalGrants: grantApplications.length,
    pendingGrants: grantApplications.filter(g => g.status === "pending").length,
    totalLoans: loanApplications.length,
    pendingLoans: loanApplications.filter(l => l.status === "pending").length,
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin")
  }

  const handleStatusUpdate = async (
    id: string,
    type: "eligibility" | "grant" | "loan",
    newStatus: "approved" | "rejected"
  ) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
        setSelectedItem(null)
        setDialogType(null)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredEligibility = grantEligibility.filter(
    e => e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.application_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGrants = grantApplications.filter(
    g => g.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         g.application_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLoans = loanApplications.filter(
    l => l.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         l.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <DollarSign className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">NextFund Admin</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Grant Eligibility</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEligibility}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingEligibility} pending review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Grant Applications</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGrants}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingGrants} pending review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Loan Applications</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLoans}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingLoans} pending review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => router.refresh()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="eligibility">
          <TabsList className="mb-6">
            <TabsTrigger value="eligibility">
              Grant Eligibility ({filteredEligibility.length})
            </TabsTrigger>
            <TabsTrigger value="grants">
              Grant Applications ({filteredGrants.length})
            </TabsTrigger>
            <TabsTrigger value="loans">
              Loan Applications ({filteredLoans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle>Grant Eligibility Applications</CardTitle>
                <CardDescription>Review and approve/reject eligibility applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEligibility.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm">{item.application_code}</td>
                          <td className="py-3 px-4">{item.full_name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.email}</td>
                          <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setDialogType("eligibility")
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredEligibility.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grants">
            <Card>
              <CardHeader>
                <CardTitle>Grant Applications</CardTitle>
                <CardDescription>Review full grant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Income</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrants.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm">{item.application_code}</td>
                          <td className="py-3 px-4">{item.full_name}</td>
                          <td className="py-3 px-4 text-sm">{formatCurrency(item.annual_income)}</td>
                          <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setDialogType("grant")
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredGrants.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>Review loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tier</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 capitalize">{item.loan_tier}</td>
                          <td className="py-3 px-4">{item.full_name}</td>
                          <td className="py-3 px-4 text-sm">{formatCurrency(item.loan_amount)}</td>
                          <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(item.created_at)}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setDialogType("loan")
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredLoans.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => { setSelectedItem(null); setDialogType(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the application details and update status
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && dialogType === "eligibility" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Application Code</p>
                  <p className="font-mono font-medium">{(selectedItem as GrantEligibility).application_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge((selectedItem as GrantEligibility).status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{(selectedItem as GrantEligibility).full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SSN</p>
                  <p className="font-mono">{(selectedItem as GrantEligibility).ssn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{(selectedItem as GrantEligibility).phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{(selectedItem as GrantEligibility).email}</p>
                </div>
              </div>
              
              {(selectedItem as GrantEligibility).status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "eligibility", "approved")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "eligibility", "rejected")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedItem && dialogType === "grant" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Application Code</p>
                  <p className="font-mono font-medium">{(selectedItem as GrantApplication).application_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge((selectedItem as GrantApplication).status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{(selectedItem as GrantApplication).full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{(selectedItem as GrantApplication).date_of_birth}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{(selectedItem as GrantApplication).home_address}, {(selectedItem as GrantApplication).city}, {(selectedItem as GrantApplication).state}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{(selectedItem as GrantApplication).phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{(selectedItem as GrantApplication).email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Immigrant</p>
                  <p>{(selectedItem as GrantApplication).is_immigrant ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Marital Status</p>
                  <p className="capitalize">{(selectedItem as GrantApplication).marital_status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Income</p>
                  <p>{formatCurrency((selectedItem as GrantApplication).annual_income)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Type</p>
                  <p className="capitalize">{(selectedItem as GrantApplication).id_type.replace("_", " ")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Reason for Grant</p>
                  <p className="text-sm">{(selectedItem as GrantApplication).reason_for_grant}</p>
                </div>
                {(selectedItem as GrantApplication).id_document_url && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">ID Document</p>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="mb-3">
                        <img 
                          src={(selectedItem as GrantApplication).id_document_url!} 
                          alt="ID Document"
                          className="max-w-full h-auto max-h-64 rounded-lg border object-contain mx-auto"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open((selectedItem as GrantApplication).id_document_url!, "_blank")}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Size
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a 
                            href={(selectedItem as GrantApplication).id_document_url!} 
                            download
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {(selectedItem as GrantApplication).status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "grant", "approved")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "grant", "rejected")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedItem && dialogType === "loan" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Tier</p>
                  <p className="font-medium capitalize">{(selectedItem as LoanApplication).loan_tier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge((selectedItem as LoanApplication).status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="font-medium text-lg">{formatCurrency((selectedItem as LoanApplication).loan_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p>{(selectedItem as LoanApplication).interest_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{(selectedItem as LoanApplication).full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{(selectedItem as LoanApplication).date_of_birth}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{(selectedItem as LoanApplication).home_address}, {(selectedItem as LoanApplication).city}, {(selectedItem as LoanApplication).state}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{(selectedItem as LoanApplication).phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{(selectedItem as LoanApplication).email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Income</p>
                  <p>{formatCurrency((selectedItem as LoanApplication).annual_income)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Marital Status</p>
                  <p className="capitalize">{(selectedItem as LoanApplication).marital_status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Reason for Loan</p>
                  <p className="text-sm">{(selectedItem as LoanApplication).reason_for_loan}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Collateral</p>
                  <p className="text-sm">{(selectedItem as LoanApplication).collateral}</p>
                </div>
                {(selectedItem as LoanApplication).id_document_url && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">ID Document</p>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="mb-3">
                        <img 
                          src={(selectedItem as LoanApplication).id_document_url!} 
                          alt="ID Document"
                          className="max-w-full h-auto max-h-64 rounded-lg border object-contain mx-auto"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open((selectedItem as LoanApplication).id_document_url!, "_blank")}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Size
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a 
                            href={(selectedItem as LoanApplication).id_document_url!} 
                            download
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {(selectedItem as LoanApplication).status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "loan", "approved")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedItem.id, "loan", "rejected")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner className="mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
