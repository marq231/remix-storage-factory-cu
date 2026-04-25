"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Shield, Upload, CheckCircle, ArrowLeft } from "lucide-react"

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming", "District of Columbia"
]

const LOAN_TIERS = {
  starter: { name: "Starter Loan", min: 5000, max: 15000, rate: "8.9%" },
  growth: { name: "Growth Loan", min: 15000, max: 50000, rate: "6.5%" },
  premium: { name: "Premium Loan", min: 50000, max: 150000, rate: "4.9%" },
}

function LoanApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get("tier") as keyof typeof LOAN_TIERS
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [idFile, setIdFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  
  const loanInfo = LOAN_TIERS[tier] || LOAN_TIERS.starter

  const [formData, setFormData] = useState({
    loanAmount: "",
    fullName: "",
    homeAddress: "",
    state: "",
    city: "",
    country: "United States",
    dateOfBirth: "",
    phone: "",
    email: "",
    isImmigrant: "",
    maritalStatus: "",
    annualIncome: "",
    reasonForLoan: "",
    collateral: "",
    idType: "",
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.loanAmount.trim()) {
      newErrors.loanAmount = "Loan amount is required"
    } else {
      const amount = parseFloat(formData.loanAmount.replace(/[^0-9.]/g, ""))
      if (amount < loanInfo.min || amount > loanInfo.max) {
        newErrors.loanAmount = `Amount must be between $${loanInfo.min.toLocaleString()} and $${loanInfo.max.toLocaleString()}`
      }
    }

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.homeAddress.trim()) newErrors.homeAddress = "Home address is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.isImmigrant) newErrors.isImmigrant = "Please select an option"
    if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status is required"
    if (!formData.annualIncome.trim()) newErrors.annualIncome = "Annual income is required"
    if (!formData.reasonForLoan.trim()) newErrors.reasonForLoan = "Reason for loan is required"
    if (!formData.collateral.trim()) newErrors.collateral = "Collateral information is required"
    if (!formData.idType) newErrors.idType = "ID type is required"
    if (!idFile) newErrors.idFile = "ID document is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Upload ID document first
      let idDocumentUrl = ""
      if (idFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", idFile)
        uploadFormData.append("folder", "loan-applications")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          idDocumentUrl = uploadData.url
        }
      }

      const loanAmount = parseFloat(formData.loanAmount.replace(/[^0-9.]/g, ""))

      const response = await fetch("/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanTier: tier || "starter",
          loanAmount,
          interestRate: parseFloat(loanInfo.rate),
          ...formData,
          idDocumentUrl,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || "Something went wrong. Please try again." })
      }
    } catch {
      setErrors({ submit: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (!digits) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(parseInt(digits))
  }

  if (!tier || !LOAN_TIERS[tier]) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 lg:py-16">
          <div className="mx-auto max-w-2xl px-4 lg:px-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Please Select a Loan Tier
            </h1>
            <p className="text-muted-foreground mb-8">
              You need to select a loan tier before applying.
            </p>
            <Button asChild>
              <Link href="/loans">View Loan Options</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 lg:py-16">
          <div className="mx-auto max-w-2xl px-4 lg:px-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Loan Application Submitted!</CardTitle>
                <CardDescription className="text-base">
                  Your loan application has been submitted successfully. Our team will review it within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Loan Type</p>
                  <p className="font-semibold">{loanInfo.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">Amount: {formData.loanAmount}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {"We'll"} contact you at {formData.email} with updates on your application.
                </p>
                <Button asChild variant="outline">
                  <Link href="/">Return to Home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/loans">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Loan Options
            </Link>
          </Button>

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              {loanInfo.name} Application
            </h1>
            <p className="mt-4 text-muted-foreground">
              ${loanInfo.min.toLocaleString()} - ${loanInfo.max.toLocaleString()} at {loanInfo.rate} APR
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Please provide complete and accurate information. All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Loan Details */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Loan Details</h3>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="loanAmount">Desired Loan Amount</FieldLabel>
                      <Input
                        id="loanAmount"
                        placeholder={`$${loanInfo.min.toLocaleString()} - $${loanInfo.max.toLocaleString()}`}
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: formatCurrency(e.target.value) })}
                        className={errors.loanAmount ? "border-destructive" : ""}
                      />
                      {errors.loanAmount && <FieldError>{errors.loanAmount}</FieldError>}
                    </Field>
                  </FieldGroup>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="fullName">Full Legal Name</FieldLabel>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={errors.dateOfBirth ? "border-destructive" : ""}
                      />
                      {errors.dateOfBirth && <FieldError>{errors.dateOfBirth}</FieldError>}
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && <FieldError>{errors.phone}</FieldError>}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && <FieldError>{errors.email}</FieldError>}
                      </Field>
                    </div>
                  </FieldGroup>
                </div>

                {/* Address */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Address</h3>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="homeAddress">Home Address</FieldLabel>
                      <Input
                        id="homeAddress"
                        placeholder="123 Main Street, Apt 4B"
                        value={formData.homeAddress}
                        onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                        className={errors.homeAddress ? "border-destructive" : ""}
                      />
                      {errors.homeAddress && <FieldError>{errors.homeAddress}</FieldError>}
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className={errors.city ? "border-destructive" : ""}
                        />
                        {errors.city && <FieldError>{errors.city}</FieldError>}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="state">State</FieldLabel>
                        <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                          <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.state && <FieldError>{errors.state}</FieldError>}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                        <Input
                          id="country"
                          value={formData.country}
                          disabled
                          className="bg-muted"
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Additional Information</h3>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Are you an immigrant?</FieldLabel>
                      <RadioGroup
                        value={formData.isImmigrant}
                        onValueChange={(value) => setFormData({ ...formData, isImmigrant: value })}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="immigrant-yes" />
                          <Label htmlFor="immigrant-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="immigrant-no" />
                          <Label htmlFor="immigrant-no">No</Label>
                        </div>
                      </RadioGroup>
                      {errors.isImmigrant && <FieldError>{errors.isImmigrant}</FieldError>}
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="maritalStatus">Marital Status</FieldLabel>
                        <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                          <SelectTrigger className={errors.maritalStatus ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.maritalStatus && <FieldError>{errors.maritalStatus}</FieldError>}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="annualIncome">Annual Income</FieldLabel>
                        <Input
                          id="annualIncome"
                          placeholder="$50,000"
                          value={formData.annualIncome}
                          onChange={(e) => setFormData({ ...formData, annualIncome: formatCurrency(e.target.value) })}
                          className={errors.annualIncome ? "border-destructive" : ""}
                        />
                        {errors.annualIncome && <FieldError>{errors.annualIncome}</FieldError>}
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="reasonForLoan">Reason for Loan</FieldLabel>
                      <Textarea
                        id="reasonForLoan"
                        rows={3}
                        placeholder="Please explain why you need this loan and how you plan to use the funds..."
                        value={formData.reasonForLoan}
                        onChange={(e) => setFormData({ ...formData, reasonForLoan: e.target.value })}
                        className={errors.reasonForLoan ? "border-destructive" : ""}
                      />
                      {errors.reasonForLoan && <FieldError>{errors.reasonForLoan}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="collateral">Collateral / Assets</FieldLabel>
                      <Textarea
                        id="collateral"
                        rows={3}
                        placeholder="Describe any collateral or assets you can provide (property, vehicle, investments, etc.)"
                        value={formData.collateral}
                        onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
                        className={errors.collateral ? "border-destructive" : ""}
                      />
                      {errors.collateral && <FieldError>{errors.collateral}</FieldError>}
                    </Field>
                  </FieldGroup>
                </div>

                {/* ID Verification */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Identity Verification</h3>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="idType">ID Type</FieldLabel>
                      <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
                        <SelectTrigger className={errors.idType ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drivers_license">{"Driver's"} License</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="state_id">State ID</SelectItem>
                          <SelectItem value="military_id">Military ID</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.idType && <FieldError>{errors.idType}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel>Upload ID Document</FieldLabel>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.idFile ? "border-destructive" : "border-border"}`}>
                        <input
                          type="file"
                          id="idDocument"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                        />
                        <label htmlFor="idDocument" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          {idFile ? (
                            <p className="text-sm text-foreground font-medium">{idFile.name}</p>
                          ) : (
                            <>
                              <p className="text-sm text-foreground font-medium">Click to upload</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max 5MB)</p>
                            </>
                          )}
                        </label>
                      </div>
                      {errors.idFile && <FieldError>{errors.idFile}</FieldError>}
                    </Field>
                  </FieldGroup>
                </div>

                {errors.submit && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {errors.submit}
                  </div>
                )}

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Loan Application"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Your information is encrypted and secure</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function LoanApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    }>
      <LoanApplicationForm />
    </Suspense>
  )
}
