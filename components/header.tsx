"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo size="md" variant="full" theme="light" />
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/grants" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Grants
          </Link>
          <Link href="/loans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Loans
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button asChild variant="outline">
            <Link href="/grants/eligibility">Check Eligibility</Link>
          </Button>
          <Button asChild>
            <Link href="/loans">Apply for Loan</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="flex flex-col gap-4 px-4 py-6">
            <Link href="/" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/grants" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Grants
            </Link>
            <Link href="/loans" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Loans
            </Link>
            <Link href="/about" className="text-base font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full">
                <Link href="/grants/eligibility">Check Eligibility</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/loans">Apply for Loan</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
