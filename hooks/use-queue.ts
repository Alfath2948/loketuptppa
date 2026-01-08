"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { doc, getDoc, runTransaction, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

type QueueState = {
  date: string // YYYY-MM-DD in user's local timezone
  value: number // current queue number
}

const STORAGE_KEY = "loket_queue_state"
const MY_TICKET_KEY = "loket_my_ticket" // stored per-day
const QUEUE_DOC_PATH = ["queue_state", "current"] as const

function getTodayKey(): string {
  // Local YYYY-MM-DD
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function readState(): QueueState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as QueueState
      const today = getTodayKey()
      if (parsed.date !== today) {
        // New day → reset to 0
        const fresh = { date: today, value: 0 }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
        return fresh
      }
      return parsed
    }
  } catch {}
  const today = getTodayKey()
  const initial = { date: today, value: 0 }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function writeState(next: QueueState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

async function readRemoteState(today = getTodayKey()): Promise<QueueState> {
  try {
    const queueDoc = doc(db, ...QUEUE_DOC_PATH)
    const snap = await getDoc(queueDoc)
    if (!snap.exists()) {
      const initial = { date: today, value: 0 }
      await setDoc(queueDoc, { ...initial, updatedAt: serverTimestamp() })
      return initial
    }
    const data = snap.data() as { date?: string; value?: number }
    if (data.date !== today) {
      const resetState = { date: today, value: 0 }
      await setDoc(queueDoc, { ...resetState, updatedAt: serverTimestamp() })
      return resetState
    }
    const value = typeof data.value === "number" ? data.value : 0
    return { date: today, value }
  } catch (err) {
    console.warn("readRemoteState failed, fallback to local:", err)
    return readState()
  }
}

async function incrementRemote(): Promise<number> {
  const today = getTodayKey()
  const queueDoc = doc(db, ...QUEUE_DOC_PATH)

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(queueDoc)
    const currentData = snap.exists() ? (snap.data() as any) : {}
    const currentDate = currentData.date
    const currentValue = typeof currentData.value === "number" ? currentData.value : 0
    const baseValue = currentDate === today ? currentValue : 0
    const nextValue = baseValue + 1
    tx.set(queueDoc, { date: today, value: nextValue, updatedAt: serverTimestamp() })
    return nextValue
  })
}

async function resetRemote(to = 0): Promise<QueueState> {
  const today = getTodayKey()
  const queueDoc = doc(db, ...QUEUE_DOC_PATH)
  const next = { date: today, value: to }
  await setDoc(queueDoc, { ...next, updatedAt: serverTimestamp() })
  return next
}

export function useQueue() {
  const [state, setState] = useState<QueueState>({ date: getTodayKey(), value: 0 })
  const initialized = useRef(false)

  // Initialize: fetch remote first, fallback to local
  useEffect(() => {
    let active = true
    readRemoteState().then((remote) => {
      if (!active) return
      setState(remote)
      writeState(remote)
      initialized.current = true
    })
    return () => {
      active = false
    }
  }, [])

  // Cross-tab sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as QueueState
          setState(parsed)
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const dateDisplay = useMemo(() => {
    try {
      const d = new Date(state.date)
      // If state.date is YYYY-MM-DD, constructing new Date(state.date) treats it as UTC in some browsers.
      // For display, prefer user's local date using current day components:
      const [y, m, day] = state.date.split("-").map(Number)
      const local = new Date(y, (m ?? 1) - 1, day ?? 1)
      return local.toLocaleDateString('id-ID', {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return state.date
    }
  }, [state.date])

  const next = useCallback(async () => {
    // Increase the global queue number by 1 (remote authoritative)
    const issuedNumber = await incrementRemote()
    const nextState = { date: getTodayKey(), value: issuedNumber }
    writeState(nextState)
    setState(nextState)
    return issuedNumber
  }, [])

  const reset = useCallback(async (to = 0) => {
    // Admin reset: update remote and local
    const updated = await resetRemote(to)
    writeState(updated)
    setState(updated)

    // Clear all user tickets for today when reset
    try {
      localStorage.removeItem(`${MY_TICKET_KEY}:${updated.date}`)
    } catch {}
  }, [])

  const takeTicket = useCallback(async () => {
    // For user: increment remotely, persist locally "my ticket" for today
    const issuedNumber = await incrementRemote()
    const updated = { date: getTodayKey(), value: issuedNumber }
    writeState(updated)
    setState(updated)
    try {
      const my = { date: updated.date, value: issuedNumber }
      localStorage.setItem(`${MY_TICKET_KEY}:${updated.date}`, JSON.stringify(my))
    } catch {}
    return issuedNumber
  }, [])

  const readMyTicket = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem(`${MY_TICKET_KEY}:${getTodayKey()}`)
      if (!raw) return null
      const parsed = JSON.parse(raw) as { date: string; value: number }
      if (parsed.date !== getTodayKey()) return null
      return parsed.value
    } catch {
      return null
    }
  }, [])

  return {
    date: state.date,
    dateDisplay,
    value: state.value,
    next,
    reset,
    takeTicket,
    readMyTicket,
    initialized: initialized.current,
  }
}
