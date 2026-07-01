"use client"

import { useCallback, useEffect, useState } from "react"
import { OFFICER_STORAGE_KEY, type Officer, readOfficers, writeOfficers } from "@/lib/officer-board/storage"

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setOfficers(readOfficers())
    setIsReady(true)
  }, [])

  useEffect(() => {
    const sync = () => setOfficers(readOfficers())
    const onStorage = (event: StorageEvent) => {
      if (event.key === OFFICER_STORAGE_KEY) sync()
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener("officer-duty-status-change", sync)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("officer-duty-status-change", sync)
    }
  }, [])

  const setOfficerDuty = useCallback((id: string, isOnDuty: boolean) => {
    setOfficers((current) => {
      const source = current.length > 0 ? current : readOfficers()
      const next = source.map((officer) =>
        officer.id === id ? { ...officer, isOnDuty } : officer,
      )
      writeOfficers(next)
      return next
    })
  }, [])

  return { officers, isReady, setOfficerDuty }
}

