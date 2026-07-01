"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, CircleCheck, CircleMinus } from "lucide-react"
import { useMemo } from "react"
import { useOfficers } from "@/hooks/use-officers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OfficerBoardPage() {
  const { officers, isReady, setOfficerDuty } = useOfficers()

  const dateDisplay = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [])

  return (
    <main className="min-h-dvh bg-[#F3F4F6] text-[#111827]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-sm font-medium text-[#1E40AF] underline-offset-4 hover:underline">
            Loket Antrian
          </Link>
        </div>
      </header>

      <section className="bg-[#1E40AF] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex max-w-4xl flex-col gap-5">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold uppercase leading-tight md:text-5xl">
                Papan Nama Petugas Layanan
              </h1>
              <p className="max-w-3xl text-base font-medium text-blue-50 md:text-xl">
                Unit Pelaksana Teknis Perlindungan Perempuan dan Anak Provinsi Jawa Timur
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#1E40AF]">
              <CalendarDays className="size-4" aria-hidden="true" />
              {dateDisplay}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-none px-4 py-8 md:py-10">
        {!isReady ? (
          <div className="rounded-md border bg-white p-6 text-center text-[#4B5563]">Memuat data petugas...</div>
        ) : (
          <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto pb-3">
            {officers.map((officer) => (
              <article key={officer.id} className="overflow-hidden rounded-md border bg-white shadow-sm">
                <div className="relative aspect-[4/5] bg-[#E5E7EB]">
                  <Image
                    src={officer.imageSrc}
                    alt={officer.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                    priority={officer.isOnDuty}
                  />
                </div>

                <div className="flex min-h-52 flex-col justify-between gap-6 p-6">
                  <div className="space-y-2.5">
                    <h2 className="text-xl font-bold leading-snug text-[#111827]">{officer.name}</h2>
                    <p className="text-base font-medium text-[#4B5563]">{officer.position}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Status</p>
                    <Select
                      value={officer.isOnDuty ? "on-duty" : "ready"}
                      onValueChange={(value) => setOfficerDuty(officer.id, value === "on-duty")}
                    >
                      <SelectTrigger
                        aria-label={`Ubah status ${officer.name}`}
                        className={
                          officer.isOnDuty
                            ? "h-10 w-full justify-between border-[#BBF7D0] bg-[#DCFCE7] text-sm font-bold text-[#166534]"
                            : "h-10 w-full justify-between border-[#E5E7EB] bg-[#F3F4F6] text-sm font-bold text-[#4B5563]"
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-duty">
                          <CircleCheck className="size-4 text-[#166534]" aria-hidden="true" />
                          Sedang Bertugas
                        </SelectItem>
                        <SelectItem value="ready">
                          <CircleMinus className="size-4 text-[#4B5563]" aria-hidden="true" />
                          Siap Melayani
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
