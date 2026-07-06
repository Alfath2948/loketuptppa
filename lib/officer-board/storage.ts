"use client"

export type Officer = {
  id: string
  name: string
  position: string
  imageSrc: string
  isOnDuty: boolean
}

export const OFFICER_STORAGE_KEY = "officer-duty-status"
export const ADMIN_AUTH_KEY = "admin-authenticated"
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_OFFICER_BOARD_PASSWORD ?? "admin123"

export const DEFAULT_OFFICERS: Officer[] = [
  {
    id: "aghnis-fauziah",
    name: "AGHNIS FAUZIAH, S.Psi, M.Psi",
    position: "Psikolog Klinis",
    imageSrc: "/petugas/Aghnis.png",
    isOnDuty: false,
  },
  {
    id: "ajeng-hp",
    name: "AJENG Harlika, S.Psi, M.Psi",
    position: "Psikolog Klinis",
    imageSrc: "/petugas/Ajeng.png",
    isOnDuty: false,
  },
  {
    id: "ode-dasrun",
    name: "ODE DASRUN, SH, M.H.Kes",
    position: "Pendamping Hukum",
    imageSrc: "/petugas/Ode.png",
    isOnDuty: false,
  },
  {
    id: "fajar-kurniawan",
    name: "FAJAR KURNIAWAN, SH",
    position: "Pendamping Hukum",
    imageSrc: "/petugas/Fajar.png",
    isOnDuty: false,
  },
  {
    id: "wahyu-kurniansyah",
    name: "WAHYU KURNIANSYAH",
    position: "Operator Layanan Operasional",
    imageSrc: "/petugas/Wahyu.png",
    isOnDuty: false,
  },
  {
    id: "annisa-putri-karlina",
    name: "ANNISA PUTRI KARLINA, A.Md. Kom",
    position: "Pengelola PPA",
    imageSrc: "/petugas/Annisa.png",
    isOnDuty: false,
  },
  {
    id: "ailsa-bianda",
    name: "AILSA BIANDA F, S.Tr.Sos",
    position: "Penyuluh Sosial",
    imageSrc: "/petugas/Ailsa.png",
    isOnDuty: false,
  },
]

function isOfficer(value: unknown): value is Officer {
  if (!value || typeof value !== "object") return false

  const officer = value as Partial<Officer>
  return (
    typeof officer.id === "string" &&
    typeof officer.name === "string" &&
    typeof officer.position === "string" &&
    typeof officer.imageSrc === "string" &&
    typeof officer.isOnDuty === "boolean"
  )
}

function mergeWithDefaults(officers: Officer[]) {
  return DEFAULT_OFFICERS.map((defaultOfficer) => {
    const storedOfficer = officers.find((officer) => officer.id === defaultOfficer.id)

    return storedOfficer
      ? {
          ...defaultOfficer,
          isOnDuty: storedOfficer.isOnDuty,
        }
      : defaultOfficer
  })
}

export function readOfficers(): Officer[] {
  try {
    const raw = localStorage.getItem(OFFICER_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(DEFAULT_OFFICERS))
      return DEFAULT_OFFICERS
    }

    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every(isOfficer)) {
      const officers = mergeWithDefaults(parsed)
      localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(officers))
      return officers
    }
  } catch {}

  localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(DEFAULT_OFFICERS))
  return DEFAULT_OFFICERS
}

export function writeOfficers(officers: Officer[]) {
  localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(officers))
  window.dispatchEvent(new Event("officer-duty-status-change"))
}
