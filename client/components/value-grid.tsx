"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter, ShieldCheck, Cpu, Link2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Section } from "@/components/site/Section"
import { copy } from "@/constants/copy"

const items = [
  { icon: Twitter,     title: copy.values[0].title, desc: copy.values[0].desc },
  { icon: ShieldCheck, title: copy.values[1].title, desc: copy.values[1].desc },
  { icon: Cpu,         title: copy.values[2].title, desc: copy.values[2].desc },
  { icon: Link2,       title: copy.values[3].title, desc: copy.values[3].desc },
]

export function ValueGrid() {
  const shouldReduce = useReducedMotion()
  return (
    <Section id="values" label="Core Values">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.25, delay: 0.05 * i }}
          >
            <Card className="group relative rounded-2xl border border-white/12 bg-white/[0.02] transition-colors hover:border-[#C3F53B]/30">
              {/* soft inner ring for matte depth */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-[#C3F53B]/20"
              />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center size-9 rounded-lg bg-[#C3F53B]/12 text-[#C3F53B]">
                      <it.icon className="size-5" />
                    </span>
                    <CardTitle className="text-off/95 font-semibold tracking-tight">
                      {it.title}
                    </CardTitle>
                  </div>
                  {/* tiny chevron accent */}
                  <svg viewBox="0 0 24 24" className="size-5 text-[#C3F53B] opacity-80">
                    <path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{it.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
