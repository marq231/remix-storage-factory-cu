"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Shield, Upload, CheckCircle } from "lucide-react"

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

function GrantApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [idFile, setIdFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
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
    reasonForGrant: "",
    idType: "",
  })

  useEffect(() => {
    const checkEligibility = async () => {
      if (!code) {
        router.push("/grants/eligibility")
        return
      }

      try {
        const response = await fetch(`/api/grants/eligibility/status?code=${code}`)
        const data = await response.json()

        if (response.ok && data.status === "approved") {
          setIsEligible(true)
          setFormData(prev => ({
            ...prev,
            fullName: data.fullName || "",
          }))
        } else {
          router.push(`/grants/eligibility/status?code=${code}`)
        }
      } catch {
        router.push("/grants/eligibility")
      } finally {
        setIsLoading(false)
      }
    }

    checkEligibility()
  }, [code, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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
    if (!formData.reasonForGrant.trim()) newErrors.reasonForGrant = "Reason for grant is required"
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
        uploadFormData.append("folder", "grant-applications")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          idDocumentUrl = uploadData.url
        }
      }

      const response = await fetch("/api/grants/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationCode: code,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="w-8 h-8" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!isEligible) {
    return null
  }

  if (submitted) {
    const firstName = formData.fullName.split(" ")[0]
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
                <CardTitle className="text-2xl">Congratulations, {firstName}!</CardTitle>
                <CardDescription className="text-base">
                  Application Code: <span className="font-mono font-semibold">{code}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-foreground">
                  You have successfully completed the grant application process. Our team will review your application and get back to you shortly via email.
                </p>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-foreground">
                    This process takes 3-5 working days.
                  </p>
                </div>
                <Button asChild className="mt-4">
                  <a href="/">Return to Home</a>
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
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Complete Your Grant Application
            </h1>
            <p className="mt-4 text-muted-foreground">
              Application Code: <span className="font-mono font-semibold">{code}</span>
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
                      <FieldLabel htmlFor="reasonForGrant">Reason for Grant Application</FieldLabel>
                      <Textarea
                        id="reasonForGrant"
                        rows={4}
                        placeholder="Please explain why you are applying for this grant and how you plan to use the funds..."
                        value={formData.reasonForGrant}
                        onChange={(e) => setFormData({ ...formData, reasonForGrant: e.target.value })}
                        className={errors.reasonForGrant ? "border-destructive" : ""}
                      />
                      {errors.reasonForGrant && <FieldError>{errors.reasonForGrant}</FieldError>}
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
                      "Submit Application"
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

export default function GrantApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    }>
      <GrantApplicationForm />
    </Suspense>
  )
}
