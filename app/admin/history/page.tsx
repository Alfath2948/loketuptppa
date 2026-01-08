"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

type TicketDoc = {
  id: string
  queueNumber: number
  date: string
  time: string
  companyName?: string
  createdAt?: { seconds: number; nanoseconds: number }
}

export default function AdminHistoryPage() {
  const [tickets, setTickets] = useState<TicketDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsRef = collection(db, "tickets")
        const q = query(ticketsRef, orderBy("createdAt", "desc"), limit(100))
        const snapshot = await getDocs(q)

        const data: TicketDoc[] = snapshot.docs.map((doc) => {
          const d = doc.data() as any
          return {
            id: doc.id,
            queueNumber: d.queueNumber,
            date: d.date,
            time: d.time,
            companyName: d.companyName,
            createdAt: d.createdAt,
          }
        })

        setTickets(data)
        setError(null)
      } catch (err) {
        console.error("Gagal membaca data antrian dari Firestore:", err)
        setError("Gagal memuat data antrian. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const formatCreatedAt = (createdAt?: { seconds: number; nanoseconds: number }) => {
    if (!createdAt) return "-"
    try {
      const date = new Date(createdAt.seconds * 1000)
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch {
      return "-"
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="w-full border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="text-lg font-semibold">Admin · Riwayat Antrian</div>
            <p className="text-xs text-muted-foreground">
              Menampilkan riwayat pengambilan nomor antrian dari Firestore
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Panel Admin
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Publik
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base md:text-lg font-semibold">Data Antrian</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Muat Ulang
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat data antrian...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data antrian yang tersimpan di Firestore.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-card">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-muted/60">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">No</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Nomor Antrian</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tanggal</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Waktu</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Waktu Simpan</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Layanan</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className="border-b last:border-0 odd:bg-background even:bg-muted/30"
                    >
                      <td className="px-3 py-2 align-top text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 align-top font-mono tabular-nums font-semibold">
                        A{ticket.queueNumber}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="whitespace-nowrap">{ticket.date}</div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="whitespace-nowrap">{ticket.time}</div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="whitespace-nowrap">
                          {formatCreatedAt(ticket.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        {ticket.companyName || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}


