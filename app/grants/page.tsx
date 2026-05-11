import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Building2, GraduationCap, Home, Heart, Lightbulb, Users } from "lucide-react"

const grantPrograms = [
  {
    icon: Building2,
    title: "Small Business Grant",
    amount: "Up to $500,000",
    description: "Start or expand your business with funding for equipment, inventory, marketing, and operations.",
    eligibility: ["US Citizen or Permanent Resident", "Business plan required", "Annual income under $150,000"],
  },
  {
    icon: GraduationCap,
    title: "Education Grant",
    amount: "Up to $150,000",
    description: "Cover tuition, books, and living expenses while pursuing your educational goals.",
    eligibility: ["Enrolled or accepted in accredited institution", "US Citizen or Permanent Resident", "Demonstrate financial need"],
  },
  {
    icon: Home,
    title: "First-Time Home Buyer Grant",
    amount: "Up to $850,000",
    description: "Make homeownership achievable with down payment assistance and closing cost coverage.",
    eligibility: ["First-time home buyer", "Income below area median", "Primary residence only"],
  },
  {
    icon: Heart,
    title: "Medical Assistance Grant",
    amount: "Up to $20,000",
    description: "Cover medical expenses, treatments, and healthcare costs not covered by insurance.",
    eligibility: ["Documented medical need", "US Citizen or Permanent Resident", "Insurance gaps or uninsured"],
  },
  {
    icon: Lightbulb,
    title: "Innovation & Technology Grant",
    amount: "Up to $30,000",
    description: "Fund your innovative project or technology startup with seed capital.",
    eligibility: ["Working prototype or detailed plan", "Technology-focused venture", "US-based development"],
  },
  {
    icon: Users,
    title: "Community Development Grant",
    amount: "Up to $35,000",
    description: "Support community initiatives, non-profits, and social impact projects.",
    eligibility: ["Registered non-profit or community org", "Clear community benefit", "Detailed budget plan"],
  },
]

export default function GrantsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl text-balance">
                Grant Programs
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                Explore our comprehensive range of grant programs designed to help you achieve your personal and professional goals. 
                Grants do not need to be repaid.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8 font-semibold">
                <Link href="/grants/eligibility">
                  Apply for Grant
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Grant Programs Grid */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {grantPrograms.map((program) => (
                <Card key={program.title} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <program.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-primary">
                      {program.amount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-4">{program.description}</p>
                    <div className="mt-auto">
                      <p className="text-sm font-medium text-foreground mb-2">Eligibility:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {program.eligibility.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Ready to Apply?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your application today. {"It's"} free, takes only 5 minutes, and {"won't"} affect your credit score.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/grants/eligibility">
                Apply for Grant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
