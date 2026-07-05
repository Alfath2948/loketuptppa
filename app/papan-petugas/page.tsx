"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  Smile,
  UserRound,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  HeartHandshake,
  BadgeCheck,
  Gem,
} from "lucide-react"
import { useOfficers } from "@/hooks/use-officers"
import { FloralFrame } from "./floral-frame"
import { CornerBloom } from "./corner-bloom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

export default function OfficerBoardPage() {
  const { officers, isReady, setOfficerDuty } = useOfficers()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateDisplay = useMemo(() => {
    if (!now) return ""
    return now.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [now])

  const timeDisplay = useMemo(() => {
    if (!now) return "--:--:--"
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }, [now])

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#F3F4F6] text-[#111827]">
      <CornerBloom className="pointer-events-none absolute -left-10 top-[34%] z-0 w-52 opacity-70 md:w-64" />
      <CornerBloom className="pointer-events-none absolute -right-12 top-[22%] z-0 w-52 -scale-x-100 opacity-70 md:w-64" />
      <CornerBloom className="pointer-events-none absolute -bottom-10 -left-12 z-0 w-48 -scale-y-100 opacity-60 md:w-56" />
      <CornerBloom className="pointer-events-none absolute -bottom-12 -right-12 z-0 w-48 -scale-100 opacity-60 md:w-56" />
      <CornerBloom className="pointer-events-none absolute left-[42%] top-[52%] z-0 w-40 opacity-40 md:w-48" />
      <header className="relative z-10 overflow-hidden bg-[#6D28D9] text-white">
        <CornerBloom className="pointer-events-none absolute -right-6 -top-8 w-40 opacity-40 md:w-52" />
        <CornerBloom className="pointer-events-none absolute -bottom-10 left-[30%] w-36 -scale-y-100 opacity-25 md:w-44" />
        <div className="mx-auto flex max-w-[1600px] items-center justify-end px-6 pt-1 md:px-10">
          <Link
            href="/"
            className="text-sm font-medium text-violet-100 underline-offset-4 hover:underline"
          >
            Loket Antrian
          </Link>
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 pb-5 pt-1 md:flex-nowrap md:gap-6 md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-2 rounded-md bg-white p-2.5">
              <Image
                src="/logo/LOGO_PROVINSI JAWA TIMUR.png"
                alt="Logo Provinsi Jawa Timur"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
              <Image
                src="/logo/Logo DP3AK trace Baru.png"
                alt="Logo DP3AK Jawa Timur"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-base font-bold uppercase tracking-wide">UPT PPA</span>
              <span className="text-base font-bold uppercase tracking-wide">Provinsi Jawa Timur</span>
              <span className="mt-1 max-w-44 text-[11px] font-medium uppercase leading-snug text-violet-100">
                Melindungi Perempuan dan Anak Adalah Tugas Kita Bersama
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center text-center">
            <h1 className="flex items-center gap-3 font-[family-name:var(--font-script)] text-3xl font-bold leading-tight text-white sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
              Papan Nama Petugas Pelayanan
              <Heart className="size-6 shrink-0 fill-pink-300 text-pink-300 md:size-7 lg:size-8" aria-hidden="true" />
            </h1>
            <p className="flex items-center gap-2 text-sm font-medium text-violet-100 sm:text-base md:text-base lg:text-lg xl:text-xl">
              <Heart className="size-3 shrink-0 fill-pink-300 text-pink-300 md:size-4" aria-hidden="true" />
              Kami siap memberikan pelayanan terbaik untuk Anda
              <Heart className="size-3 shrink-0 fill-pink-300 text-pink-300 md:size-4" aria-hidden="true" />
            </p>
          </div>

          <div className="flex flex-col items-center rounded-md bg-white px-5 py-2.5 leading-tight text-[#6D28D9]">
            <span className="text-sm font-semibold capitalize">{dateDisplay || " "}</span>
            <span className="font-mono text-2xl font-bold tabular-nums md:text-3xl">{timeDisplay}</span>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-6 md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-full bg-[#DCFCE7] py-3 pl-3 pr-6">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white">
              <Smile className="size-9" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-xl font-extrabold uppercase tracking-wide text-[#15803D] md:text-2xl">Siap Melayani</p>
              <p className="text-sm font-medium text-[#166534]">Petugas siap memberikan pelayanan</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-full bg-[#FEF3C7] py-3 pl-3 pr-6">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white">
              <UserRound className="size-9" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-xl font-extrabold uppercase tracking-wide text-[#B45309] md:text-2xl">Sedang Bertugas</p>
              <p className="text-sm font-medium text-[#92400E]">Petugas sedang melayani penerima layanan</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-8 md:px-10">
        {!isReady ? (
          <div className="rounded-md border bg-white p-6 text-center text-[#4B5563]">Memuat data petugas...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
            {officers.map((officer, index) => (
              <article
                key={officer.id}
                className="relative flex flex-col rounded-3xl border border-violet-100 bg-white p-3 shadow-[0_1px_3px_rgba(109,40,217,0.08)]"
              >
                <span className="absolute left-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-[#6D28D9] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <div className="relative aspect-square w-full">
                  <FloralFrame className="absolute inset-0 size-full" />
                  <div className="absolute inset-[10%] overflow-hidden rounded-full border-4 border-white bg-[#EDE9FE] ring-1 ring-violet-100">
                    <Image
                      src={officer.imageSrc}
                      alt={officer.name}
                      fill
                      sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover object-top"
                      priority={officer.isOnDuty}
                    />
                  </div>
                </div>

                <div className="mt-2 flex flex-1 flex-col gap-3">
                  <div className="flex min-h-16 flex-col items-center justify-center space-y-0.5 px-0.5 text-center">
                    <h2 className="text-[13px] font-bold uppercase leading-snug text-[#4C1D95]">{officer.name}</h2>
                    <p className="text-[11px] font-medium leading-tight text-[#6B7280]">{officer.position}</p>
                  </div>

                  <Select
                    value={officer.isOnDuty ? "on-duty" : "ready"}
                    onValueChange={(value) => setOfficerDuty(officer.id, value === "on-duty")}
                  >
                    <SelectTrigger
                      aria-label={`Ubah status ${officer.name}`}
                      className={
                        officer.isOnDuty
                          ? "h-auto min-h-8 w-full justify-center gap-1 whitespace-normal rounded-full border-none bg-[#F59E0B] px-2 py-1 text-[10px] font-bold uppercase leading-tight text-white [&>svg:last-child]:hidden [&_svg]:shrink-0 [&_svg]:text-white lg:min-h-9 lg:text-[11px]"
                          : "h-auto min-h-8 w-full justify-center gap-1 whitespace-normal rounded-full border-none bg-[#16A34A] px-2 py-1 text-[10px] font-bold uppercase leading-tight text-white [&>svg:last-child]:hidden [&_svg]:shrink-0 [&_svg]:text-white lg:min-h-9 lg:text-[11px]"
                      }
                    >
                      {officer.isOnDuty ? (
                        <UserRound className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Smile className="size-3.5" aria-hidden="true" />
                      )}
                      <span className="whitespace-normal text-center">
                        {officer.isOnDuty ? "Sedang Bertugas" : "Siap Melayani"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-duty">
                        <UserRound className="size-4 text-[#B45309]" aria-hidden="true" />
                        Sedang Bertugas
                      </SelectItem>
                      <SelectItem value="ready">
                        <Smile className="size-4 text-[#16A34A]" aria-hidden="true" />
                        Siap Melayani
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-8 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_1px_3px_rgba(109,40,217,0.08)]">
          <CornerBloom className="pointer-events-none absolute -left-8 -top-8 w-32 opacity-50 md:w-40" />
          <CornerBloom className="pointer-events-none absolute -bottom-8 -right-8 w-32 -scale-100 opacity-50 md:w-40" />
          <div className="relative grid items-center gap-6 p-6 md:grid-cols-3 md:gap-8 md:p-8">
          <div className="space-y-1.5">
            <h3 className="font-[family-name:var(--font-script)] text-2xl font-bold text-[#6D28D9] md:text-3xl">
              Butuh Bantuan?
            </h3>
            <p className="text-sm text-[#4B5563]">
              Silakan sampaikan kepada petugas atau hubungi kami. Pengaduan dapat dilakukan melalui:
            </p>
            <ul className="space-y-1 text-sm text-[#374151]">
              <li>&bull; Pengaduan langsung ke Kantor UPT PPA Jatim</li>
              <li>
                &bull; Pengaduan online di{" "}
                <span className="font-semibold text-[#7C3AED] underline underline-offset-2">
                  https://intip.in/laporpak
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <p className="flex items-center gap-2 font-[family-name:var(--font-script)] text-2xl font-bold text-[#6D28D9] md:text-3xl">
              <Heart className="size-4 shrink-0 fill-pink-400 text-pink-400" aria-hidden="true" />
              Melayani dengan Hati
              <Heart className="size-4 shrink-0 fill-pink-400 text-pink-400" aria-hidden="true" />
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#374151]">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="size-5 shrink-0 text-[#7C3AED]" aria-hidden="true" />
                Empati
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="size-5 shrink-0 text-[#EC4899]" aria-hidden="true" />
                Profesional
              </div>
              <div className="flex items-center gap-1.5">
                <Gem className="size-5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                Integritas
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-5 shrink-0 text-[#3B82F6]" aria-hidden="true" />
                Amanah
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 rounded-2xl bg-[#6D28D9] px-6 py-4 text-white">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Phone className="size-7" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-100">Layanan Pengaduan</p>
              <p className="text-2xl font-extrabold tabular-nums">0895-3487-71070</p>
              <p className="text-xs text-violet-200">(WA Only)</p>
            </div>
          </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#6D28D9] text-white">
        <div className="mx-auto flex max-w-[1600px] flex-col flex-wrap items-start justify-between gap-4 px-6 py-5 md:flex-row md:items-center md:px-10">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>Jl. Arjuno No.88, Sawahan, Sawahan, Surabaya, Jawa Timur 60251</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Instagram className="size-4 shrink-0" aria-hidden="true" />
            <span>@uptppaprovjatim</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>0895-3487-71070</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
