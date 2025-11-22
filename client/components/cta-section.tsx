"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <div className="w-full py-8 md:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight text-off/95 px-2 md:px-0">
          Ready to turn tweets into trustless wagers?
        </h2>
        <p className="text-white/70 text-sm md:text-base lg:text-lg px-4 md:px-0">
          Join the waitlist and be among the first to experience the future of decentralized betting.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90 text-sm md:text-base px-6 md:px-8 py-5 md:py-6 min-h-[44px]"
          >
            <Link href="https://app.youform.com/forms/r18v0jef" target="_blank" rel="noreferrer">
              Join Waitlist
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
