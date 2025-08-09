import Link from "next/link"
import type { Metadata } from "next"
import { ArrowDownRight, ArrowRight, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Hero } from "@/components/hero"
import { ValueGrid } from "@/components/value-grid"
import { SocialProof } from "@/components/social-proof"
import { Timeline } from "@/components/timeline"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { copy } from "@/constants/copy"
import { ValueCarousel } from "@/components/value-carousel"
import HowItWorksPage from "../components/how-it-works"

export const metadata: Metadata = {
  title: "SMOL BET — Trustless wagers from tweets",
  description: "Turning tweets into trustless wagers — no middlemen, just TEE + verifiable AI.",
  openGraph: {
    title: "SMOL BET — Trustless wagers from tweets",
    description: "Turning tweets into trustless wagers — no middlemen, just TEE + verifiable AI.",
    url: "https://example.com/",
    siteName: "SMOL BET",
    images: [
      {
        url: "/smol-bet-og.png",
        width: 1200,
        height: 630,
        alt: "SMOL BET",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMOL BET — Trustless wagers from tweets",
    description: "Turning tweets into trustless wagers — no middlemen, just TEE + verifiable AI.",
    images: ["/smol-bet-og.png"],
  },
}

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-charcoal text-off flex flex-col">
      <SiteHeader />
      <main role="main" className="flex-1">
        <Hero />

        <Section id="values" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <ValueCarousel />
          </div>
        </Section>

        <Section className="py-10">
          <div className="container px-4 md:px-6">
            <SocialProof />
          </div>
        </Section>

        <Section id="how-it-works" className="py-16 md:py-24">
          <div className="container px-4 md:px-6 space-y-6">
            <HowItWorksPage />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
