"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { StepDialog } from "@/components/step-dialog"

const steps = [
  { key: "create", title: "Step 1: Create", desc: "Reply on X to define a bet." },
  { key: "lock", title: "Step 2: Lock", desc: "Escrow is created and funded." },
  { key: "resolve", title: "Step 3: Resolve", desc: "AI/TEE determines outcome." },
  { key: "payout", title: "Step 4: Payout", desc: "Auto distribution with fee." },
] as const

export function Timeline() {
  const shouldReduce = useReducedMotion()
  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.key}
            initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.25, delay: 0.05 * i }}
          >
            <Card className="rounded-2xl bg-charcoal/60 border-white/10 hover:border-lime/20 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-off">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted">{s.desc}</p>
                <StepDialog
                  step={s.key as any}
                  trigger={
                    <Button variant="outline" className="border-white/15 hover:bg-white/5 bg-transparent">
                      View Flow
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
