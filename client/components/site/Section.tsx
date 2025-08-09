// components/site/Section.tsx
"use client"
import { cn } from "@/lib/utils"

type Props = React.PropsWithChildren<{
  id?: string
  label?: string
  className?: string
  innerClassName?: string
}>

/**
 * Matte section with faint lime tints + dotted grid.
 * Keep it subtle so the content stays matte, not neon.
 */
export function Section({ id, label, className, innerClassName, children }: Props) {
  return (
    <section id={id} className={cn("relative isolate overflow-hidden", className)}>
      {/* Matte base */}
      <div aria-hidden className="absolute inset-0 bg-[#1B1B1B]" />
      {/* Faint lime tints + dotted grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: [
            "radial-gradient(720px 280px at 16% -8%, rgba(195,245,59,0.06), rgba(0,0,0,0))",
            "radial-gradient(520px 220px at 84% 14%, rgba(195,245,59,0.04), rgba(0,0,0,0))",
            "radial-gradient(#222 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "auto, auto, 22px 22px",
        }}
      />
      {/* Tiny top-right label (optional) */}
      {label && (
        <div className="pointer-events-none absolute top-3 right-4 text-right">
          <span className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
            {label}
          </span>
        </div>
      )}

      <div className={cn("relative z-10 container px-4 md:px-8 py-16 md:py-24", innerClassName)}>
        {children}
      </div>
    </section>
  )
}
