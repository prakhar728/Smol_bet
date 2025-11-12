"use client"

import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoMark } from "./brand/logo-mark"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80 bg-charcoal/70 border-b border-white/10">
      <div className="container px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-md"
        >
          <Image
            src="/logo.png"
            alt="SMOL BET"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />

          <LogoMark />
          <span className="sr-only">SMOL BET</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/how-it-works"
            className={cn(
              "text-sm text-off/80 hover:text-off focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-sm px-1 py-0.5",
              pathname === "/how-it-works" && "text-off"
            )}
          >
            How it works
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-lime text-charcoal hover:bg-lime/90 focus-visible:ring-lime"
          >
            <a
              href="/bets"
              target="_blank"
              rel="noreferrer"
              aria-label="View the bets on X"
            >
              View the bets
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <Button
            asChild
            className="bg-lime text-charcoal hover:bg-lime/90 focus-visible:ring-lime"
          >
            <Link href="/waitlist" aria-label="waitlist">
              Waitlist
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
