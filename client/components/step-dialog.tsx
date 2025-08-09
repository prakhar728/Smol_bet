"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, ExternalLink } from "lucide-react"
import { copy } from "@/constants/copy"
import { cn } from "@/lib/utils"

type StepKey = "create" | "lock" | "resolve" | "payout"

export function StepDialog({
  step,
  trigger,
}: {
  step: StepKey
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)
  const [copiedHash, setCopiedHash] = React.useState(false)

  const onCopy = async (text: string, which: "code" | "hash") => {
    try {
      await navigator.clipboard.writeText(text)
      which === "code" ? setCopiedCode(true) : setCopiedHash(true)
      setTimeout(() => (which === "code" ? setCopiedCode(false) : setCopiedHash(false)), 1200)
    } catch {}
  }

  const content = copy.flow[step]

  // Try to find a full hash for the footer link (skip truncated ones with …)
  const stepWithHash = content.steps.find((s: any) => typeof s.hash === "string" && !s.hash.includes("…") && !s.hash.includes("..."))
  // const txHash = stepWithHash?.hash as string | undefined

  // Customize this if you switch chains; keeps the dialog generic.
  // const explorerUrl = txHash ? `https://sepolia.basescan.org/tx/${txHash}` : undefined

  const statusTone: Record<string, string> = {
    active: "bg-[#C3F53B] text-black",
    funded: "bg-white/12 text-off",
    initiated: "bg-white/12 text-off",
    done: "bg-white/12 text-off",
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="sm:max-w-2xl rounded-2xl bg-white/[0.02] border border-white/12 text-off">
        {/* subtle lime tint + grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-80"
          style={{
            backgroundImage: [
              "radial-gradient(900px 260px at 18% -12%, rgba(195,245,59,0.06), rgba(0,0,0,0))",
              "radial-gradient(#222 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "auto, 22px 22px",
          }}
        />
        <DialogHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-off/95">{content.title}</DialogTitle>
              <DialogDescription className="text-white/70">{content.desc}</DialogDescription>
            </div>
            <span className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
              {step}
            </span>
          </div>
        </DialogHeader>

        <div className="relative z-10 space-y-6">
          <TooltipProvider delayDuration={100}>
            <ol className="space-y-3">
              {content.steps.map((s: any, i: number) => (
                <li key={i} className="rounded-xl border border-white/12 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-off/95">{s.label}</span>
                    {s.status && (
                      <Badge variant="secondary" className={cn("capitalize", statusTone[s.status] ?? "bg-white/12 text-off")}>
                        {s.status}
                      </Badge>
                    )}
                  </div>

                  {s.code && (
                    <div className="mt-3 relative rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-xs">
                      <code className="block whitespace-pre-wrap">{s.code}</code>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => onCopy(s.code as string, "code")}
                            className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md p-1.5 border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3F53B]"
                            aria-label="Copy code"
                          >
                            {copiedCode ? <Check className="h-4 w-4 text-[#C3F53B]" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {s.choice && (
                    <div className="mt-3 text-xs text-white/60">
                      Outcome (demo): TRUE / FALSE
                    </div>
                  )}

                  {s.hash && (
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-white/80">Tx Hash: {s.hash}</span>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onCopy(s.hash as string, "hash")}
                              className="inline-flex items-center justify-center rounded-md p-1.5 border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3F53B]"
                              aria-label="Copy transaction hash"
                            >
                              {copiedHash ? <Check className="h-4 w-4 text-[#C3F53B]" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Copy hash</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </TooltipProvider>

          <Separator className="bg-white/10" />
        </div>

        {/* <DialogFooter className="relative z-10">
          <Button asChild variant="ghost" className="border-white/12">
            <a
              href={explorerUrl ?? "#"}
              target={explorerUrl ? "_blank" : undefined}
              rel={explorerUrl ? "noreferrer" : undefined}
              aria-disabled={!explorerUrl}
            >
              View on Explorer
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
