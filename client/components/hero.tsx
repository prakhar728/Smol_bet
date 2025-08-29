"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      {/* Matte background */}
      <div aria-hidden className="absolute inset-0 bg-[#1B1B1B]" />

      <div className="relative container px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: gigantic title */}
          <div className="space-y-8">
            <h1
              id="hero-heading"
              className="uppercase font-black tracking-tight leading-[0.82] text-[#C3F53B]"
            >
              <span className="block text-[22vw] md:text-[160px] lg:text-[240px]">SMOL</span>
              <span className="block text-[22vw] md:text-[160px] lg:text-[240px]">BET</span>
            </h1>

            {/* CTAs (matte, no glow) */}
            <div className="flex flex-wrap gap-3">
              {/* <Button asChild className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90">
                <Link href="https://x.com/funnyorfud" target="_blank" rel="noreferrer">Try the Bot</Link>
              </Button> */}

              <Button asChild className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90">
                <Link href="campaign" target="_blank" rel="noreferrer">Live Campaign</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="border border-white/15 text-white/90 hover:bg-white/5"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Right: label, big chevron, tagline */}
          <div className="relative min-h-[360px] md:min-h-[520px]">

            {/* Big matte chevron */}
            <div className="absolute inset-y-0 right-2 md:right-4 flex items-center">
              <svg
                viewBox="0 0 120 120"
                aria-hidden
                className="w-[90px] h-[90px] md:w-[140px] md:h-[140px]"
              >
                <path d="M20 15 L100 60 L20 105 Z" fill="#C3F53B" />
              </svg>
            </div>

            {/* Bottom-right tagline */}
            <p className="absolute bottom-0 right-0 max-w-[42ch] text-[#C3F53B]/85 text-base md:text-xl leading-snug">
              Turning tweets into trustless wagers — no middlemen, just TEE’s and verifiable AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
