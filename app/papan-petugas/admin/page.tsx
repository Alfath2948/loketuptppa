"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ADMIN_AUTH_KEY, ADMIN_PASSWORD } from "@/lib/officer-board/storage"

export default function OfficerBoardAdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (localStorage.getItem(ADMIN_AUTH_KEY) === "true") {
      router.replace("/papan-petugas/admin/board")
    }
  }, [router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true")
      router.replace("/papan-petugas/admin/board")
      return
    }

    setError("Password admin tidak sesuai.")
  }

  return (
    <main className="min-h-dvh bg-[#F3F4F6] text-[#111827]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/papan-petugas" className="text-sm font-medium text-[#1E40AF] underline-offset-4 hover:underline">
            Papan Petugas
          </Link>
          <Link href="/" className="text-sm font-medium text-[#4B5563] underline-offset-4 hover:text-[#1E40AF] hover:underline">
            Loket Antrian
          </Link>
        </div>
      </header>

      <section className="grid min-h-[calc(100dvh-65px)] place-items-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#1E40AF] text-white">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Papan Petugas</h1>
              <p className="mt-1 text-sm text-[#4B5563]">Masukkan password admin untuk mengubah status berjaga.</p>
            </div>
          </div>

          <label className="space-y-2 text-sm font-semibold">
            <span>Password</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError("")
              }}
              placeholder="Masukkan password admin"
              className="h-11"
            />
          </label>

          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

          <Button type="submit" className="mt-5 h-11 w-full bg-[#1E40AF] hover:bg-[#1E3A8A]">
            Masuk
          </Button>
        </form>
      </section>
    </main>
  )
}

