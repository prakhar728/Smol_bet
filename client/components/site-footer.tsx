import type React from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="sticky bottom-0 z-40 border-t border-white/10 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80 bg-charcoal/70">
      <div className="container px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-sm text-muted">© {new Date().getFullYear()} SMOL BET</div>
          <nav className="flex items-center gap-6">
            <FooterLink href="#how-it-works">How it works</FooterLink>
            <FooterLink href="https://x.com/smol_bet" external>
              X Profile
            </FooterLink>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  external = false,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  const className =
    "relative text-sm text-off/80 hover:text-off focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-sm px-0.5 pb-0.5 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-lime after:transition-all after:duration-200 hover:after:w-full"
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
