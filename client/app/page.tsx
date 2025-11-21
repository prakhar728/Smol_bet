import type { Metadata } from "next"

import { Hero } from "@/components/hero"
import { SocialProof } from "@/components/social-proof"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Section } from "@/components/section"
import { ValueCarousel } from "@/components/value-carousel"
import { CTASection } from "@/components/cta-section"
import { TweetSection } from "@/components/tweet-section"
import HowItWorksPage from "../components/how-it-works"
import { DesktopHorizontalScroll } from "@/components/desktop-horizontal-scroll"

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
    images: ["/logo.png"],
  },
}

export default function Page() {
  return (
    <div className="min-h-[100dvh] md:h-screen bg-charcoal text-off flex flex-col">
      <SiteHeader />

      <DesktopHorizontalScroll>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Hero />
        </section>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Section id="how-it-works" className="p-0">
            <div className="h-full flex items-center">
              <div className="container px-4 md:px-6 space-y-6">
                <HowItWorksPage />
              </div>
            </div>
          </Section>
        </section>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Section id="values" className="p-0">
            <div className="h-full flex items-center">
              <div className="container px-4 md:px-6">
                <ValueCarousel />
              </div>
            </div>
          </Section>
        </section>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Section className="p-0">
            <div className="h-full flex items-center">
              <div className="container px-4 md:px-6">
                <SocialProof />
              </div>
            </div>
          </Section>
        </section>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Section className="p-0">
            <div className="h-full flex items-center">
              <div className="container px-4 md:px-6">
                <TweetSection />
              </div>
            </div>
          </Section>
        </section>

        <section
          className="snap-section md:snap-start md:shrink-0 md:w-screen md:h-full md:overflow-hidden md:min-h-0"
          data-snap-section
        >
          <Section className="p-0">
            <div className="h-full flex items-center">
              <div className="container px-4 md:px-6">
                <CTASection />
              </div>
            </div>
          </Section>
        </section>

      </DesktopHorizontalScroll>

      <SiteFooter />
    </div>
  )
}
