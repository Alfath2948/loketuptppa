"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserRoundCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useOfficers } from "@/hooks/use-officers"
import { ADMIN_AUTH_KEY } from "@/lib/officer-board/storage"

export default function OfficerBoardAdminManagePage() {
  const router = useRouter()
  const { officers, isReady, setOfficerDuty } = useOfficers()

  useEffect(() => {
    if (localStorage.getItem(ADMIN_AUTH_KEY) !== "true") {
      router.replace("/papan-petugas/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY)
    router.replace("/papan-petugas/admin")
  }

  return (
    <main className="min-h-dvh bg-[#F3F4F6] text-[#111827]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-lg font-bold">Kelola Papan Petugas</h1>
            <p className="text-xs text-[#4B5563]">Perubahan disimpan di localStorage browser ini.</p>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/papan-petugas"
              className="text-sm font-medium text-[#1E40AF] underline-offset-4 hover:underline"
            >
              Lihat Papan
            </Link>
            <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-5 flex items-center gap-3 rounded-md border bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-md bg-[#1E40AF] text-white">
            <UserRoundCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold">Status Petugas Layanan</h2>
            <p className="text-sm text-[#4B5563]">Aktifkan toggle untuk petugas yang sedang berjaga.</p>
          </div>
        </div>

        {!isReady ? (
          <div className="rounded-md border bg-white p-6 text-center text-[#4B5563]">Memuat data petugas...</div>
        ) : (
          <div className="space-y-3">
            {officers.map((officer) => (
              <article
                key={officer.id}
                className="flex flex-col gap-4 rounded-md border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[#E5E7EB]">
                    <Image
                      src={officer.imageSrc}
                      alt={officer.name}
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{officer.name}</h3>
                    <p className="mt-1 text-sm font-medium text-[#4B5563]">{officer.position}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:min-w-64">
                  <span
                    className={
                      officer.isOnDuty
                        ? "rounded-md bg-[#DCFCE7] px-3 py-1.5 text-sm font-bold text-[#166534]"
                        : "rounded-md bg-[#F3F4F6] px-3 py-1.5 text-sm font-bold text-[#4B5563]"
                    }
                  >
                    {officer.isOnDuty ? "Sedang Berjaga" : "Tidak Berjaga"}
                  </span>
                  <Switch
                    checked={officer.isOnDuty}
                    onCheckedChange={(checked) => setOfficerDuty(officer.id, checked)}
                    className="h-6 w-11 data-[state=checked]:bg-[#16A34A]"
                    aria-label={`Ubah status ${officer.name}`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
