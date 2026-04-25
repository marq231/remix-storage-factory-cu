import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Shield, Award } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Our mission is to make financial assistance accessible to every American, regardless of their background or current financial situation.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "We believe in clear communication and honest practices. No hidden fees, no confusing terms, just straightforward financial assistance.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We are committed to strengthening communities by providing resources that help individuals and families achieve their financial goals.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from our application process to our customer service and fund distribution.",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "Chief Executive Officer",
    bio: "With over 20 years of experience in financial services, Sarah leads NextFund US with a vision of financial inclusion for all Americans.",
  },
  {
    name: "Michael Chen",
    role: "Chief Financial Officer",
    bio: "Michael oversees all financial operations and ensures that funds are distributed efficiently and transparently to approved applicants.",
  },
  {
    name: "Dr. Amanda Williams",
    role: "Director of Programs",
    bio: "Amanda designs and manages our grant and loan programs, ensuring they meet the diverse needs of American communities.",
  },
  {
    name: "James Rodriguez",
    role: "Head of Technology",
    bio: "James leads our technology team, ensuring our platform is secure, accessible, and user-friendly for all applicants.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl text-balance">
                About NextFund US
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                Founded in 2015, NextFund US has been at the forefront of connecting Americans with 
                financial assistance programs. Our mission is to break down barriers to financial 
                opportunity and help individuals and families achieve their dreams.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                  Our Story
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    NextFund US was born out of a simple observation: too many Americans were missing out 
                    on financial opportunities simply because they {"didn't"} know where to look or how to apply.
                  </p>
                  <p>
                    Our founders, a team of financial experts and technology innovators, set out to 
                    create a platform that would bridge this gap. We partner with government agencies, 
                    non-profits, and private foundations to aggregate and distribute grant funds and 
                    low-interest loans.
                  </p>
                  <p>
                    Today, {"we've"} helped over 50,000 Americans secure more than $2.5 billion in financial 
                    assistance. From first-time homebuyers to small business owners, students to healthcare 
                    seekers, {"we're"} proud to have played a role in countless success stories.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-primary">50K+</p>
                  <p className="text-sm text-muted-foreground mt-1">Approved Applications</p>
                </div>
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-primary">$2.5B</p>
                  <p className="text-sm text-muted-foreground mt-1">Funds Distributed</p>
                </div>
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-primary">50</p>
                  <p className="text-sm text-muted-foreground mt-1">States Served</p>
                </div>
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-primary">98%</p>
                  <p className="text-sm text-muted-foreground mt-1">Customer Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do at NextFund US.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Leadership Team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the people leading our mission to make financial assistance accessible to all.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Have Questions?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Our team is here to help. Contact us for any questions about our programs or the application process.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-primary-foreground/90">
              <div className="flex items-center justify-center gap-2">
                <span>Email:</span>
                <a href="mailto:support@nextfundus.com" className="font-medium hover:text-primary-foreground">
                  support@nextfundus.com
                </a>
              </div>
              <div className="hidden sm:block">|</div>
              <div className="flex items-center justify-center gap-2">
                <span>Phone:</span>
                <a href="tel:1-800-NEXTFUND" className="font-medium hover:text-primary-foreground">
                  1-800-NEXTFUND
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
