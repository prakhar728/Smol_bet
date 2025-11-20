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
    // Sections themselves are not scrollable (overflow-hidden), but reset any nested scrollable containers
    const scrollableChildren = Array.from(targetSection.querySelectorAll('*')).filter(
      (el) => {
        const htmlEl = el as HTMLElement
        return htmlEl.scrollHeight > htmlEl.clientHeight && 
               (getComputedStyle(htmlEl).overflowY === 'auto' || 
                getComputedStyle(htmlEl).overflowY === 'scroll' ||
                getComputedStyle(htmlEl).overflow === 'auto' ||
                getComputedStyle(htmlEl).overflow === 'scroll')
      }
    ) as HTMLElement[]
    scrollableChildren.forEach(child => {
      child.scrollTop = 0
    })
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

      if (isAnimatingRef.current) return

      const delta = e.deltaY
      const threshold = 10 // ignore tiny trackpad jitters
      if (Math.abs(delta) < threshold) return

      const sections = Array.from(
        el.querySelectorAll<HTMLElement>(".snap-section,[data-snap-section='true']")
      )
      if (sections.length === 0) {
        // Fallback to smooth horizontal scroll
        e.preventDefault()
        el.scrollLeft += delta
        return
      }

      const currentIndex = Math.round(el.scrollLeft / el.clientWidth)
      const currentSection = sections[currentIndex]

      if (!currentSection) return

      // Check if there are any nested scrollable elements that need to be scrolled first
      // Sections themselves are not scrollable (overflow-hidden), but nested components might be
      const scrollThreshold = 5 // Small threshold to account for rounding

      // Helper function to check if nested scrollable children can scroll
      const canNestedElementScroll = (element: HTMLElement, direction: 'down' | 'up'): boolean => {
        // Check all scrollable children (nested components like carousels)
        const scrollableChildren = Array.from(element.querySelectorAll('*')).filter(
          (el) => {
            const htmlEl = el as HTMLElement
            return htmlEl.scrollHeight > htmlEl.clientHeight && 
                   (getComputedStyle(htmlEl).overflowY === 'auto' || 
                    getComputedStyle(htmlEl).overflowY === 'scroll' ||
                    getComputedStyle(htmlEl).overflow === 'auto' ||
                    getComputedStyle(htmlEl).overflow === 'scroll')
          }
        ) as HTMLElement[]

        for (const child of scrollableChildren) {
          if (direction === 'down') {
            const atBottom = child.scrollTop + child.clientHeight >= child.scrollHeight - scrollThreshold
            if (!atBottom) return true
          } else {
            const atTop = child.scrollTop <= scrollThreshold
            if (!atTop) return true
          }
        }

        return false
      }

      // Check if scrolling down (positive delta)
      if (delta > 0) {
        // Check if nested scrollable elements can scroll
        const nestedCanScroll = canNestedElementScroll(currentSection, 'down')
        
        // If nested elements can still scroll, allow normal vertical scrolling
        if (nestedCanScroll) {
          return // Don't prevent default, allow normal vertical scroll
        }
      } else {
        // Scrolling up (negative delta)
        // Check if nested scrollable elements can scroll
        const nestedCanScroll = canNestedElementScroll(currentSection, 'up')
        
        // If nested elements can still scroll, allow normal vertical scrolling
        if (nestedCanScroll) {
          return // Don't prevent default, allow normal vertical scroll
        }
      }

      // No vertical scrolling needed, allow horizontal scrolling
      e.preventDefault()

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

  // Prevent body scroll on desktop and set fixed height
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.matchMedia("(min-width: 768px)").matches) return

    // Set body and html to fixed height to prevent document-level scrolling
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyHeight = document.body.style.height
    const originalHtmlHeight = document.documentElement.style.height

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.body.style.height = "100vh"
    document.documentElement.style.height = "100vh"

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.height = originalBodyHeight
      document.documentElement.style.height = originalHtmlHeight
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onWheel={onWheel}
      className={cn(
        // Mobile: vertical stack with normal vertical scrolling
        // Desktop (md+): horizontal row with snapping and hidden scrollbars, takes remaining height after header and footer
        "flex-1 flex flex-col overflow-y-auto md:flex-row md:overflow-hidden md:overflow-x-auto md:snap-x md:snap-mandatory scroll-smooth md:[&::-webkit-scrollbar]:hidden md:[scrollbar-width:none] md:[-ms-overflow-style:'none']",
        className
      )}
    >
      {children}
    </div>
  )}


