"use client"

import type React from "react"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Section({
  className,
  children,
  id,
}: {
  className?: string
  children: React.ReactNode
  id?: string
}) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.section
      id={id}
      initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
      whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.25 }}
      className={cn("relative", className)}
    >
      {children}
    </motion.section>
  )
}

Section.defaultProps = {
  className: "",
  id: undefined,
}
