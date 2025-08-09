"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

type Logo = { alt: string; src: string; href?: string }

export function SocialProof({
  items = [
    { alt: "NEAR", src: "/Near.webp" },
    { alt: "Base", src: "/Base.jpeg" },
  ],
  speed = 18,   // seconds per loop
  size = 200,    // <-- logo height in px (try 64 or 72)
}: { items?: Logo[]; speed?: number; size?: number }) {
  const reduce = useReducedMotion()
  const [inView, setInView] = React.useState(true)
  const ref = React.useRef<HTMLDivElement>(null)
  const hoverRef = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const marquee = !reduce && items.length >= 3
  const track = marquee ? [...items, ...items] : items

  const maskStyle: React.CSSProperties = marquee
    ? {
      maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
    }
    : {}

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      aria-label="Partners & Ecosystem"
    >
      <div className="mb-4 text-center text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
        Partners & Ecosystem
      </div>

      <div className="relative overflow-hidden" style={maskStyle}>
        {marquee ? (
          <motion.div
            className="flex w-max gap-6 md:gap-10 px-2"
            animate={inView && !hoverRef.current ? { x: "-50%" } : { x: 0 }}
            transition={{ duration: speed, ease: "linear", repeat: inView && !hoverRef.current ? Infinity : 0 }}
          >
            {track.map((l, i) => (
              <LogoCard key={`${l.alt}-${i}`} logo={l} size={size} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {items.map((l) => (
              <LogoCard key={l.alt} logo={l} size={size} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LogoCard({ logo, size }: { logo: Logo; size: number }) {
  const [err, setErr] = React.useState(false)
  const inner = (
    <div
      className="group relative flex items-center justify-center rounded-xl border border-white/12 bg-white/[0.02]
                 px-5 py-3.5 md:px-6 md:py-4 transition
                 hover:border-[#C3F53B]/30 hover:bg-white/[0.04]"
      style={{ minHeight: size + 24 }} // breathing room around bigger logos
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-[#C3F53B]/15"
      />
      {err ? (
        <span className="px-3 text-sm text-white/60">{logo.alt}</span>
      ) : (
        <Image
          src={logo.src || "/placeholder.svg"}
          alt={`${logo.alt} logo`}
          width={size * 3}       // high-DPI buffer
          height={size * 2}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-auto"
          style={{ height: size }}  // <-- actual rendered height
          onError={() => setErr(true)}
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 160px, 40vw"
        />
      )}
    </div>
  )

  return logo.href ? (
    <a href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.alt} className="block">
      {inner}
    </a>
  ) : (
    inner
  )
}
