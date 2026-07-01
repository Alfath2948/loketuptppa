"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, CircleCheck, CircleMinus, ShieldCheck } from "lucide-react"
import { useMemo } from "react"
import { useOfficers } from "@/hooks/use-officers"

export default function OfficerBoardPage() {
  const { officers, isReady } = useOfficers()

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
          <Link
            href="/papan-petugas/admin"
            className="text-sm font-medium text-[#4B5563] underline-offset-4 hover:text-[#1E40AF] hover:underline"
          >
            Admin Petugas
          </Link>
        </div>
      </header>

      <section className="bg-[#1E40AF] text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="flex max-w-4xl flex-col gap-5">
            <div className="flex size-12 items-center justify-center rounded-md bg-white/15">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
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

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {!isReady ? (
          <div className="rounded-md border bg-white p-6 text-center text-[#4B5563]">Memuat data petugas...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    <div
                      className={
                        officer.isOnDuty
                          ? "inline-flex items-center gap-2 rounded-md bg-[#DCFCE7] px-3 py-2 text-sm font-bold text-[#166534]"
                          : "inline-flex items-center gap-2 rounded-md bg-[#F3F4F6] px-3 py-2 text-sm font-bold text-[#4B5563]"
                      }
                    >
                      {officer.isOnDuty ? (
                        <CircleCheck className="size-4" aria-hidden="true" />
                      ) : (
                        <CircleMinus className="size-4" aria-hidden="true" />
                      )}
                      {officer.isOnDuty ? "Sedang Berjaga" : "Tidak Berjaga"}
                    </div>
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
