"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Info } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { StepDialog } from "@/components/step-dialog"
import { Section } from "@/components/section"
import { copy } from "@/constants/copy"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HowItWorksInline } from "@/components/how-it-works-inline"

export default function HowItWorksPage() {
  const shouldReduce = useReducedMotion()

  const Diagram = ({
    stepKey,
  }: {
    stepKey: "create" | "lock" | "resolve" | "payout"
  }) => {
    const items = copy.flow[stepKey].diagram
    return (
      <Card className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.02]">
        {/* faint lime tint + grid (very subtle) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: [
              "radial-gradient(900px 260px at 18% -12%, rgba(195,245,59,0.06), rgba(0,0,0,0))",
              "radial-gradient(#222 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "auto, 22px 22px",
          }}
        />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-off/95 font-semibold tracking-tight">
              {copy.flow[stepKey].title}
            </CardTitle>
            <span className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
              {stepKey}
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {items.map((label, i) => (
              <motion.div
                key={label}
                initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                whileInView={shouldReduce ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.25, delay: 0.05 * i }}
                className="flex items-center"
              >
                <div className="rounded-xl border border-white/12 bg-white/[0.02] px-3.5 py-2 text-sm text-off/95">
                  {label}
                </div>
                {i < items.length - 1 && (
                  <motion.div
                    aria-hidden="true"
                    initial={shouldReduce ? {} : { opacity: 0, x: -8 }}
                    whileInView={shouldReduce ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.25, delay: 0.05 * i + 0.1 }}
                    className="mx-2 text-[#C3F53B]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-[#1B1B1B] text-off flex flex-col">
      <main className="flex-1">
        <Section className="py-16 md:py-10">
          <div className="container px-4 md:px-8 space-y-8">
            {/* Heading + sub */}
            <div className="max-w-2xl">
              <div className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">
                Flow
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-off/95">
                How it works
              </h1>
              <p className="text-white/70 mt-2">{copy.how.subtitle}</p>
            </div>

            <HowItWorksInline />

            {/* Demo alert */}
            <Alert className="bg-white/[0.02] border border-white/12">
              <Info className="h-4 w-4 text-white/75" />
              <AlertDescription className="text-white/75">
                This page demonstrates the onchain flow. UI is non-custodial and for illustration only.
              </AlertDescription>
            </Alert>
          </div>
        </Section>
      </main>
    </div>
  )
}
