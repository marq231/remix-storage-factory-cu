import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SuccessStories } from "@/components/success-stories"
import { VideoSection } from "@/components/video-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, 
  Shield, 
  Clock, 
  Users, 
  DollarSign, 
  FileText, 
  ArrowRight,
  Building2,
  GraduationCap,
  Home,
  Briefcase
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
                  Financial Assistance for Every American
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90 max-w-2xl">
                  Access grants up to $850,000 and low-interest loans to help you achieve your goals. 
                  Whether {"you're"} starting a business, pursuing education, or buying a home, {"we're"} here to help.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button asChild size="lg" variant="secondary" className="font-semibold">
                    <Link href="/grants/eligibility">
                      Apply for Grant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href="/loans">View Loan Options</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary-foreground/10 rounded-2xl blur-2xl"></div>
                  <Image
                    src="/images/hero-family.jpg"
                    alt="Happy American family achieving their dream of homeownership through NextFund US financial assistance"
                    width={600}
                    height={400}
                    className="relative rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">50,000+</p>
                <p className="text-sm text-muted-foreground">Approved Applications</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">$2.5B+</p>
                <p className="text-sm text-muted-foreground">Funds Distributed</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Secure & Confidential</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">24-48hrs</p>
                <p className="text-sm text-muted-foreground">Application Review</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Our Financial Programs
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our range of financial assistance programs designed to support your personal and professional growth.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Small Business Grants</CardTitle>
                  <CardDescription>Up to $500,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Start or expand your business with our small business grant program. No repayment required.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Education Grants</CardTitle>
                  <CardDescription>Up to $150,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pursue your educational goals with grants for tuition, books, and living expenses.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Home Buyer Assistance</CardTitle>
                  <CardDescription>Up to $850,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make your dream of homeownership a reality with down payment assistance and grants.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Personal Loans</CardTitle>
                  <CardDescription>Low Interest Rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access affordable personal loans with competitive interest rates and flexible terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Help With - Image Showcase */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Empowering Americans Across All Walks of Life
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                From homeownership to education, medical expenses to business growth - we provide financial assistance for every milestone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-family.jpg"
                  alt="Family achieving homeownership dream"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
                  <h3 className="font-semibold text-lg">Home Buyer Grants</h3>
                  <p className="text-sm text-card/80">Up to $850,000</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl">
                <Image
                  src="/images/business-owner.jpg"
                  alt="Small business owner success story"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
                  <h3 className="font-semibold text-lg">Small Business Grants</h3>
                  <p className="text-sm text-card/80">Up to $500,000</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl">
                <Image
                  src="/images/graduate-student.jpg"
                  alt="Graduate student celebrating educational achievement"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
                  <h3 className="font-semibold text-lg">Education Grants</h3>
                  <p className="text-sm text-card/80">Up to $150,000</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl">
                <Image
                  src="/images/medical-relief.jpg"
                  alt="Couple relieved from medical expense burden"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-card">
                  <h3 className="font-semibold text-lg">Medical Assistance</h3>
                  <p className="text-sm text-card/80">Coverage Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <VideoSection />

        {/* Success Stories */}
        <SuccessStories />

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our simple 3-step process makes it easy to access the financial assistance you need.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Check Eligibility</h3>
                <p className="text-muted-foreground">
                  Complete our simple eligibility form to see which programs you qualify for.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Submit Application</h3>
                <p className="text-muted-foreground">
                  Complete your full application with required documentation and personal details.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Receive Funds</h3>
                <p className="text-muted-foreground">
                  Once approved, receive your funds directly to your bank account within days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                  Why Choose NextFund US?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {"We're"} committed to making financial assistance accessible to all Americans with transparent processes and dedicated support.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">No Credit Check Required</p>
                      <p className="text-sm text-muted-foreground">Eligibility is based on various factors, not just your credit score.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Fast Application Process</p>
                      <p className="text-sm text-muted-foreground">Complete your application in under 15 minutes from anywhere.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Dedicated Support Team</p>
                      <p className="text-sm text-muted-foreground">Our experts are available to guide you through every step.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Secure & Confidential</p>
                      <p className="text-sm text-muted-foreground">Your personal information is protected with bank-level security.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ready to Get Started?</h3>
                    <p className="text-sm text-muted-foreground">Check your eligibility in minutes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/grants/eligibility">
                      Apply for Grant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/loans">Explore Loan Options</Link>
                  </Button>
                </div>

                <p className="mt-6 text-xs text-center text-muted-foreground">
                  Checking eligibility {"won't"} affect your credit score
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Start Your Application Today
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of Americans who have already received financial assistance through our programs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link href="/grants/eligibility">Apply for a Grant</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/loans">Apply for a Loan</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
