"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QueueDisplay } from "@/components/queue-display"
import { useQueue } from "@/hooks/use-queue"
import { motion } from "framer-motion"

export default function AdminPage() {
  const { value, next, reset, dateDisplay } = useQueue()

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="w-full border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Admin · Loket UPT PPA</div>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/history"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Riwayat Antrian
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Publik
            </Link>
            <Link
              href="/papan-petugas"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Papan Petugas
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 grid place-items-center">
        <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
          <div className="flex flex-col items-center text-center gap-8">
            <QueueDisplay number={value} label="Antrian Saat Ini" />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <Button size="lg" onClick={() => next()} className="px-6 py-5 text-base">
                  Berikutnya
                </Button>
                <Button size="lg" variant="secondary" onClick={() => reset(0)} className="px-6 py-5 text-base">
                  Reset Antrian
                </Button>
              </div>

              <p className="text-sm md:text-base text-muted-foreground">
                Tanggal: <span className="font-medium text-foreground">{dateDisplay}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
