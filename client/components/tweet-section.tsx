"use client"

import * as React from "react"
import Image from "next/image"

export function TweetSection() {
  return (
    <div className="w-full py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Heading */}
        <div className="text-center px-4 md:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-off/95">
            Yes it's that easy
          </h2>
        </div>

        {/* Tweet Image */}
        <div className="relative flex justify-center px-4 md:px-0">
          <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-white/[0.02] p-3 md:p-4 lg:p-6 w-full max-w-full">
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
            {/* Soft inner ring for depth */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5"
            />
            <div className="relative z-10">
              <Image
                src="/example_bet.png"
                alt="Example bet tweet"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

