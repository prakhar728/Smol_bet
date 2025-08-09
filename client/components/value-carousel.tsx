"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter, ShieldCheck, Cpu, Link2, ChevronLeft, ChevronRight } from "lucide-react"
import { copy } from "@/constants/copy"

const items = [
  { icon: Twitter,     title: copy.values[0].title, desc: copy.values[0].desc },
  { icon: ShieldCheck, title: copy.values[1].title, desc: copy.values[1].desc },
  { icon: Cpu,         title: copy.values[2].title, desc: copy.values[2].desc },
  { icon: Link2,       title: copy.values[3].title, desc: copy.values[3].desc },
]

export function ValueCarousel({
  interval = 4500,
  autoplay = true,
}: { interval?: number; autoplay?: boolean }) {
  const [index, setIndex] = React.useState(0)
  const count = items.length
  const reduce = useReducedMotion()
  const hoverRef = React.useRef(false)

  const go = (n: number) => setIndex((p) => (p + n + count) % count)
  const to = (n: number) => setIndex(((n % count) + count) % count)

  // Autoplay (paused on hover / reduced motion / tab hidden)
  React.useEffect(() => {
    if (!autoplay || reduce) return
    const tick = () => {
      if (!hoverRef.current && document.visibilityState === "visible") go(1)
    }
    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [autoplay, reduce, interval])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Features"
      className="relative"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 36 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            const swipe = info.offset.x + info.velocity.x * 0.2
            if (swipe < -80) go(1)
            else if (swipe > 80) go(-1)
          }}
          style={{ touchAction: "pan-y" }}
        >
          {items.map((it, i) => (
            <div
              key={it.title}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className="min-w-full"
            >
              <Card className="relative mx-auto max-w-3xl border border-white/12 bg-white/[0.02] rounded-2xl">
                {/* subtle lime tint + grid */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-80 rounded-2xl"
                  style={{
                    backgroundImage: [
                      "radial-gradient(800px 240px at 18% -12%, rgba(195,245,59,0.06), rgba(0,0,0,0))",
                      "radial-gradient(#222 1px, transparent 1px)",
                    ].join(", "),
                    backgroundSize: "auto, 22px 22px",
                  }}
                />
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center size-9 rounded-lg bg-[#C3F53B]/12 text-[#C3F53B]">
                        <it.icon className="size-5" />
                      </span>
                      <CardTitle className="text-off/95 font-semibold tracking-tight">
                        {it.title}
                      </CardTitle>
                    </div>
                    <span className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
                      {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/75 text-base">{it.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="Previous feature"
          onClick={() => go(-1)}
          className="pointer-events-auto grid place-items-center size-9 rounded-xl border border-white/12 bg-white/[0.02] hover:bg-white/[0.06] transition"
        >
          <ChevronLeft className="size-5 text-[#C3F53B]" />
        </button>
        <button
          type="button"
          aria-label="Next feature"
          onClick={() => go(1)}
          className="pointer-events-auto grid place-items-center size-9 rounded-xl border border-white/12 bg-white/[0.02] hover:bg-white/[0.06] transition"
        >
          <ChevronRight className="size-5 text-[#C3F53B]" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => to(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-[#C3F53B]" : "w-3 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
