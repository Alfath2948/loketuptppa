"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function QueueDisplay({
  number,
  label = "Current Queue",
  className,
}: {
  number: number
  label?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="text-sm md:text-base text-muted-foreground">{label}</div>
      <div className="relative grid place-items-center rounded-xl bg-card px-8 py-6 md:px-12 md:py-8 shadow-sm border">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={number}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="font-mono tabular-nums text-6xl md:text-8xl lg:text-9xl font-semibold text-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            {number}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
