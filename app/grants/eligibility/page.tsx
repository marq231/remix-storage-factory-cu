"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, ClipboardCheck, FileText, ArrowRight } from "lucide-react"

export default function EligibilityPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Check eligibility form data
  const [checkFormData, setCheckFormData] = useState({
    fullName: "",
    ssn: "",
    phone: "",
    email: "",
  })

  // Apply with code form data
  const [applicationCode, setApplicationCode] = useState("")

  const validateCheckForm = () => {
    const newErrors: Record<string, string> = {}

    if (!checkFormData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!checkFormData.ssn.trim()) {
      newErrors.ssn = "SSN is required"
    } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(checkFormData.ssn.replace(/\s/g, ""))) {
      newErrors.ssn = "Please enter a valid SSN (XXX-XX-XXXX)"
    }

    if (!checkFormData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-()]+$/.test(checkFormData.phone) || checkFormData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!checkFormData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkFormData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateCheckForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/grants/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkFormData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/grants/eligibility/status?code=${data.applicationCode}`)
      } else {
        setErrors({ submit: data.error || "Something went wrong. Please try again." })
      }
    } catch {
      setErrors({ submit: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const code = applicationCode.trim().toUpperCase()
    
    if (!code) {
      setErrors({ code: "Application code is required" })
      return
    }

    if (!code.match(/^NF-\d{6}$/)) {
      setErrors({ code: "Application code must be in format NF-XXXXXX (e.g., NF-123456)" })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch(`/api/grants/eligibility/status?code=${code}`)
      const data = await response.json()

      if (response.ok) {
        if (data.status === "approved") {
          router.push(`/grants/apply?code=${code}`)
        } else if (data.status === "pending") {
          setErrors({ code: "Your eligibility is still under review. Please wait for approval before applying." })
        } else if (data.status === "rejected") {
          setErrors({ code: "This application was not approved. You may reapply after 6 months." })
        }
      } else {
        setErrors({ code: "Application code not found. Please check and try again." })
      }
    } catch {
      setErrors({ code: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9)
    if (digits.length <= 3) return digits
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Apply for Grant
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              New applicant or already have a code? Choose your option below.
            </p>
          </div>

          {/* Tabs for Both Options - Visible at Once */}
          <Tabs defaultValue="check" className="w-full" onValueChange={() => setErrors({})}>
            <TabsList className="grid w-full grid-cols-2 mb-8 h-auto">
              <TabsTrigger value="check" className="flex flex-col items-center gap-2 py-4 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ClipboardCheck className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">Check Eligibility</p>
                  <p className="text-xs opacity-80">New Applicant</p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex flex-col items-center gap-2 py-4 px-4 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <FileText className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">Apply for Grant</p>
                  <p className="text-xs opacity-80">Have Application Code</p>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Check Eligibility Tab */}
            <TabsContent value="check">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <ClipboardCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Check Your Eligibility</CardTitle>
                      <CardDescription>
                        New to NextFund US? Start here to verify your eligibility for our grant programs.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
                      <span>Takes only 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
                      <span>{"Won't"} affect credit score</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
                      <span>Get instant app code</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckSubmit} className="space-y-5">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="fullName">Full Legal Name</FieldLabel>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Michael Smith"
                          value={checkFormData.fullName}
                          onChange={(e) => setCheckFormData({ ...checkFormData, fullName: e.target.value })}
                          className={errors.fullName ? "border-destructive" : ""}
                        />
                        {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="ssn">Social Security Number</FieldLabel>
                        <Input
                          id="ssn"
                          type="text"
                          placeholder="XXX-XX-XXXX"
                          value={checkFormData.ssn}
                          onChange={(e) => setCheckFormData({ ...checkFormData, ssn: formatSSN(e.target.value) })}
                          className={errors.ssn ? "border-destructive" : ""}
                        />
                        {errors.ssn && <FieldError>{errors.ssn}</FieldError>}
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Lock className="w-3 h-3" />
                          Encrypted and secure
                        </p>
                      </Field>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={checkFormData.phone}
                            onChange={(e) => setCheckFormData({ ...checkFormData, phone: formatPhone(e.target.value) })}
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && <FieldError>{errors.phone}</FieldError>}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="email">Email Address</FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="yourname@email.com"
                            value={checkFormData.email}
                            onChange={(e) => setCheckFormData({ ...checkFormData, email: e.target.value })}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && <FieldError>{errors.email}</FieldError>}
                        </Field>
                      </div>
                    </FieldGroup>

                    {errors.submit && (
                      <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        {errors.submit}
                      </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Spinner className="mr-2" />
                          Checking Eligibility...
                        </>
                      ) : (
                        "Check Eligibility"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apply with Code Tab */}
            <TabsContent value="apply">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle>Continue Your Application</CardTitle>
                      <CardDescription>
                        Already have an approved application code? Enter it below to proceed.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold">1</span>
                      <span>Must be approved</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold">2</span>
                      <span>Enter 8-digit code</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold">3</span>
                      <span>Complete application</span>
                    </div>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-5">
                    <Field>
                      <FieldLabel htmlFor="applicationCode">Application Code</FieldLabel>
                      <Input
                        id="applicationCode"
                        type="text"
                        placeholder="NF-123456"
                        value={applicationCode}
                        onChange={(e) => setApplicationCode(e.target.value.toUpperCase().slice(0, 9))}
                        className={`font-mono text-xl tracking-widest text-center ${errors.code ? "border-destructive" : ""}`}
                        maxLength={9}
                      />
                      {errors.code && <FieldError>{errors.code}</FieldError>}
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Your code (e.g., NF-123456) was provided after your eligibility check.
                      </p>
                    </Field>

                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                      size="lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="mr-2" />
                          Verifying Code...
                        </>
                      ) : (
                        <>
                          Proceed to Application
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 rounded-lg bg-muted text-center">
                    <p className="text-sm text-muted-foreground">
                      {"Don't"} have an application code? Switch to the <span className="font-medium text-foreground">{'"'}Check Eligibility{'"'}</span> tab above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Your data is protected</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
