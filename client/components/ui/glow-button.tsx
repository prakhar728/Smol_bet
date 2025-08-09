"use client"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GlowButton({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "relative group overflow-hidden bg-lime text-charcoal hover:bg-lime/90 focus-visible:ring-lime",
        "shadow-[0_0_40px_rgba(195,245,59,0.10)]",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          boxShadow: "0 0 40px rgba(195,245,59,0.35) inset",
        }}
      />
    </Button>
  )
}

GlowButton.defaultProps = {
  variant: "default",
}
