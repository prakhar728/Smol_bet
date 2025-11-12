"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type DesktopHorizontalScrollProps = {
  className?: string
  children: React.ReactNode
}

export function DesktopHorizontalScroll({ className, children }: DesktopHorizontalScrollProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const isAnimatingRef = React.useRef(false)

  const onWheel = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Only translate wheel to horizontal on md+ screens
    if (!containerRef.current) return
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      const el = containerRef.current
      const canScrollHorizontally = el.scrollWidth > el.clientWidth
      if (!canScrollHorizontally) return
      e.preventDefault()

      if (isAnimatingRef.current) return

      const delta = e.deltaY
      const threshold = 10 // ignore tiny trackpad jitters
      if (Math.abs(delta) < threshold) return

      const sections = Array.from(
        el.querySelectorAll<HTMLElement>(".snap-section,[data-snap-section='true']")
      )
      if (sections.length === 0) {
        // Fallback to smooth horizontal scroll
        el.scrollLeft += delta
        return
      }

      const currentIndex = Math.round(el.scrollLeft / el.clientWidth)
      const nextIndex = delta > 0 ? Math.min(currentIndex + 1, sections.length - 1) : Math.max(currentIndex - 1, 0)
      const target = sections[nextIndex]

      if (!target) return

      isAnimatingRef.current = true
      el.scrollTo({ left: target.offsetLeft, behavior: "smooth" })
      // unlock after animation ends
      window.setTimeout(() => {
        isAnimatingRef.current = false
      }, 650)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      className={cn(
        // Mobile: vertical stack with normal vertical scrolling
        // Desktop (md+): horizontal row with snapping and hidden scrollbars
        "flex-1 flex flex-col overflow-y-auto md:flex-row md:overflow-y-hidden md:overflow-x-auto md:snap-x md:snap-mandatory scroll-smooth md:[&::-webkit-scrollbar]:hidden md:[scrollbar-width:none] md:[-ms-overflow-style:'none']",
        className
      )}
    >
      {children}
    </div>
  )}


