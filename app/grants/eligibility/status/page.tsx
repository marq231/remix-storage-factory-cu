"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, Clock, XCircle, ArrowRight, Copy, Check } from "lucide-react"

type Status = "pending" | "approved" | "rejected" | "loading" | "error"

interface EligibilityData {
  status: Status
  fullName: string
  applicationCode: string
}

function StatusContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const [data, setData] = useState<EligibilityData | null>(null)
  const [status, setStatus] = useState<Status>("loading")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!code) {
      setStatus("error")
      return
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/grants/eligibility/status?code=${code}`)
        const result = await response.json()

        if (response.ok) {
          setData(result)
          setStatus(result.status)
        } else {
          setStatus("error")
        }
      } catch {
        setStatus("error")
      }
    }

    fetchStatus()
  }, [code])

  const copyToClipboard = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      title: "Application Under Review",
      description: "Your eligibility application is being reviewed by our team. You will receive an update within 24-48 hours.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    approved: {
      icon: CheckCircle,
      title: "Congratulations! You're Eligible",
      description: "Great news! You've been approved to apply for our grant programs. Proceed to complete your full application.",
      color: "text-accent",
      bgColor: "bg-green-100",
    },
    rejected: {
      icon: XCircle,
      title: "Application Not Approved",
      description: "Unfortunately, you do not meet the eligibility criteria at this time. You may reapply after 6 months.",
      color: "text-destructive",
      bgColor: "bg-red-100",
    },
    loading: {
      icon: Spinner,
      title: "Loading...",
      description: "Fetching your application status.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    error: {
      icon: XCircle,
      title: "Application Not Found",
      description: "We couldn't find an application with that code. Please check your code and try again.",
      color: "text-destructive",
      bgColor: "bg-red-100",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} mb-4`}>
                {status === "loading" ? (
                  <Spinner className={`w-8 h-8 ${config.color}`} />
                ) : (
                  <Icon className={`w-8 h-8 ${config.color}`} />
                )}
              </div>
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <CardDescription className="text-base">{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {status !== "loading" && status !== "error" && code && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-2">Application Code</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg font-semibold text-foreground">{code}</p>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        {copied ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Save this code to check your status or continue your application.
                    </p>
                  </div>

                  {data && (
                    <div className="p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Applicant Name</p>
                      <p className="font-medium text-foreground">{data.fullName}</p>
                    </div>
                  )}

                  {status === "approved" && (
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/grants/apply?code=${code}`}>
                          Continue to Full Application
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        You have 30 days to complete your full application.
                      </p>
                    </div>
                  )}

                  {status === "pending" && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        {"We'll"} notify you at your email when your status updates.
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/">Return to Home</Link>
                      </Button>
                    </div>
                  )}

                  {status === "rejected" && (
                    <div className="text-center">
                      <Button asChild variant="outline">
                        <Link href="/loans">Explore Loan Options Instead</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {status === "error" && (
                <div className="text-center space-y-4">
                  <Button asChild>
                    <Link href="/grants/eligibility">Start New Eligibility Check</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Or contact support if you believe this is an error.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    }>
      <StatusContent />
    </Suspense>
  )
}
