"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { StepDialog } from "@/components/step-dialog"

export function HowStepCard({
  icon,
  title,
  desc,
  step,
}: {
  icon?: React.ReactNode
  title: string
  desc: string
  step: "create" | "lock" | "resolve" | "payout"
}) {
  return (
    <Card className="rounded-2xl bg-charcoal/60 border-white/10 hover:border-lime/20 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-off">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted">{desc}</p>
        <StepDialog
          step={step}
          trigger={
            <Button variant="outline" className="border-white/15 hover:bg-white/5 bg-transparent">
              View Flow
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          }
        />
      </CardContent>
    </Card>
  )
}

HowStepCard.defaultProps = {
  icon: null,
}
