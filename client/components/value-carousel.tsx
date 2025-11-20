"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter, ShieldCheck, Cpu, Link2 } from "lucide-react"
import { copy } from "@/constants/copy"

const items = [
  { icon: Twitter,     title: copy.values[0].title, desc: copy.values[0].desc },
  { icon: ShieldCheck, title: copy.values[1].title, desc: copy.values[1].desc },
  { icon: Cpu,         title: copy.values[2].title, desc: copy.values[2].desc },
  { icon: Link2,       title: copy.values[3].title, desc: copy.values[3].desc },
]

export function ValueCarousel() {
  return (
    <div className="w-full py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Heading + sub */}
        <div className="max-w-2xl">
          <div className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
            Features
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-off/95">
            Why SMOL BET
          </h1>
          <p className="text-white/70 mt-2">
            Trustless wagers powered by TEE and verifiable AI. No middlemen, no custody, just code.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {items.map((it, i) => (
            <Card
              key={it.title}
              className="relative border border-white/12 bg-white/[0.02] rounded-2xl hover:border-[#C3F53B]/30 hover:bg-white/[0.04] transition-all duration-300 group overflow-hidden h-full"
            >
              {/* subtle lime tint + grid */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60 rounded-2xl"
                style={{
                  backgroundImage: [
                    "radial-gradient(600px 200px at 20% -10%, rgba(195,245,59,0.08), rgba(0,0,0,0))",
                    "radial-gradient(#222 1px, transparent 1px)",
                  ].join(", "),
                  backgroundSize: "auto, 24px 24px",
                }}
              />
              {/* Hover glow effect */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: "radial-gradient(400px 200px at 50% 50%, rgba(195,245,59,0.05), rgba(0,0,0,0))",
                }}
              />
              {/* Soft inner ring for depth */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-[#C3F53B]/20 transition-all duration-300"
              />
              <CardHeader className="relative z-10 pb-3 pt-5 px-5 md:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center size-11 rounded-lg bg-[#C3F53B]/12 text-[#C3F53B] group-hover:bg-[#C3F53B]/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                      <it.icon className="size-5" />
                    </span>
                    <CardTitle className="text-off/95 font-semibold tracking-tight text-lg md:text-xl">
                      {it.title}
                    </CardTitle>
                  </div>
                  {/* Chevron accent */}
                  <svg 
                    viewBox="0 0 24 24" 
                    className="size-5 text-[#C3F53B] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M8 4l8 8-8 8" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-5 md:px-6 pb-5 md:pb-6">
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {it.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
