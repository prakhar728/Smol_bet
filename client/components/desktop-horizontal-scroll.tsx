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
  const currentSectionIndexRef = React.useRef(0)

  // Reset vertical scroll when section changes
  const resetVerticalScroll = React.useCallback((targetSection: HTMLElement) => {
    // Reset window scroll position
    window.scrollTo({ top: 0, behavior: "smooth" })
    // Also reset any scrollable containers within the section
    targetSection.scrollTop = 0
  }, [])

  // Listen for horizontal scroll changes to detect section switches
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      if (typeof window === "undefined") return
      if (!window.matchMedia("(min-width: 768px)").matches) return

      const sections = Array.from(
        el.querySelectorAll<HTMLElement>(".snap-section,[data-snap-section='true']")
      )
      if (sections.length === 0) return

      const currentIndex = Math.round(el.scrollLeft / el.clientWidth)
      
      if (currentIndex !== currentSectionIndexRef.current) {
        const targetSection = sections[currentIndex]
        if (targetSection) {
          resetVerticalScroll(targetSection)
          currentSectionIndexRef.current = currentIndex
        }
      }
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [resetVerticalScroll])

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

      // Reset vertical scroll when switching sections
      if (nextIndex !== currentSectionIndexRef.current) {
        resetVerticalScroll(target)
        currentSectionIndexRef.current = nextIndex
      }

      isAnimatingRef.current = true
      el.scrollTo({ left: target.offsetLeft, behavior: "smooth" })
      // unlock after animation ends
      window.setTimeout(() => {
        isAnimatingRef.current = false
      }, 650)
    }
  }, [resetVerticalScroll])

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


