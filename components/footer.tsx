import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Logo size="md" variant="full" theme="dark" />
            </Link>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Empowering Americans with financial opportunities through grants and accessible loan programs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/grants" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Grant Programs
                </Link>
              </li>
              <li>
                <Link href="/loans" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Loan Options
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/grants/eligibility" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link href="/grants/apply" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Apply for Grant
                </Link>
              </li>
              <li>
                <Link href="/loans" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Apply for Loan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@nextfundus.com" className="hover:text-sidebar-foreground transition-colors">info@nextfundus.com</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                <Phone className="w-4 h-4" />
                <span>1-800-NEXTFUND</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-sidebar-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Financial District<br />New York, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              &copy; {new Date().getFullYear()} NextFund US. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
