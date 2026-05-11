"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Star, Shield, Clock, TrendingUp } from "lucide-react"

const loanTiers = [
  {
    id: "starter",
    name: "Starter Loan",
    amount: "$5,000 - $20,000",
    interestRate: "8.9%",
    apr: "9.2% APR",
    term: "12-36 months",
    popular: false,
    features: [
      "Quick approval within 24 hours",
      "No prepayment penalties",
      "Flexible repayment terms",
      "Basic credit check required",
    ],
    requirements: [
      "Minimum credit score: 580",
      "Proof of income",
      "Valid government ID",
    ],
  },
  {
    id: "growth",
    name: "Growth Loan",
    amount: "$21,000 - $100,000",
    interestRate: "6.5%",
    apr: "6.9% APR",
    term: "24-60 months",
    popular: true,
    features: [
      "Competitive interest rates",
      "No prepayment penalties",
      "Dedicated account manager",
      "Flexible use of funds",
      "Lower monthly payments",
    ],
    requirements: [
      "Minimum credit score: 650",
      "Proof of stable income",
      "Valid government ID",
      "Employment verification",
    ],
  },
  {
    id: "premium",
    name: "Premium Loan",
    amount: "$100,000 - $500,000",
    interestRate: "4.9%",
    apr: "5.2% APR",
    term: "36-84 months",
    popular: false,
    features: [
      "Lowest interest rates available",
      "No prepayment penalties",
      "Priority processing",
      "Personal financial advisor",
      "Customizable payment schedule",
      "Collateral may be required",
    ],
    requirements: [
      "Minimum credit score: 720",
      "Proof of stable income",
      "Valid government ID",
      "Asset documentation",
      "Collateral evaluation",
    ],
  },
]

export default function LoansPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl text-balance">
                Personal Loan Options
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                Access affordable personal loans with competitive interest rates and flexible repayment terms. 
                Choose the loan tier that best fits your financial needs.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Fast Approval</p>
                  <p className="text-sm text-muted-foreground">24-48 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Secure Process</p>
                  <p className="text-sm text-muted-foreground">256-bit encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Low Rates</p>
                  <p className="text-sm text-muted-foreground">Starting at 4.9%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">No Hidden Fees</p>
                  <p className="text-sm text-muted-foreground">Transparent pricing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Tiers */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Choose Your Loan Tier
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the loan option that matches your needs. All loans include flexible terms and no prepayment penalties.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {loanTiers.map((tier) => (
                <Card 
                  key={tier.id} 
                  className={`relative flex flex-col ${tier.popular ? "border-primary shadow-lg" : ""} ${selectedTier === tier.id ? "ring-2 ring-primary" : ""}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-foreground mt-2">
                      {tier.amount}
                    </CardDescription>
                    <div className="mt-4">
                      <p className="text-3xl font-bold text-primary">{tier.interestRate}</p>
                      <p className="text-sm text-muted-foreground">{tier.apr}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Term: {tier.term}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div>
                        <p className="font-medium text-sm text-foreground mb-2">Features:</p>
                        <ul className="space-y-2">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-sm text-foreground mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {tier.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-muted-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button
                        className="w-full"
                        variant={tier.popular ? "default" : "outline"}
                        onClick={() => setSelectedTier(tier.id)}
                      >
                        {selectedTier === tier.id ? "Selected" : "Select This Loan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTier && (
              <div className="mt-12 text-center">
                <Button asChild size="lg">
                  <Link href={`/loans/apply?tier=${selectedTier}`}>
                    Continue with Application
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">How long does approval take?</h3>
                <p className="text-muted-foreground">
                  Most applications are reviewed within 24-48 hours. Once approved, funds are typically deposited within 1-3 business days.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">What documents do I need?</h3>
                <p className="text-muted-foreground">
                  {"You'll"} need a valid government-issued ID, proof of income (pay stubs or tax returns), and bank account information for fund deposits.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Are there prepayment penalties?</h3>
                <p className="text-muted-foreground">
                  No, all our loans come with no prepayment penalties. You can pay off your loan early without any additional fees.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">What affects my interest rate?</h3>
                <p className="text-muted-foreground">
                  Your interest rate depends on factors including credit score, income, loan amount, and term length. Better credit scores typically qualify for lower rates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
