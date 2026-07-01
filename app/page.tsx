"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { QueueDisplay } from "@/components/queue-display"
import { useQueue } from "@/hooks/use-queue"
import { motion } from "framer-motion"
import { getPrinterService, printTicketFallback } from "@/lib/printer-service"
import { toast } from "sonner"
import { PrinterStatus } from "@/components/printer-status"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
// Dynamic import untuk jspdf dan html2canvas (client-side only)

export default function UserPage() {
  const { value, takeTicket, readMyTicket, dateDisplay } = useQueue()
  const [myTicket, setMyTicket] = useState<number | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSavingPDF, setIsSavingPDF] = useState(false)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMyTicket(readMyTicket())
  }, [readMyTicket, value])

  const myTicketLabel = useMemo(() => {
    return myTicket != null ? `A${myTicket}` : "—"
  }, [myTicket])

  const handleTakeTicket = async () => {
    if (isPrinting) return

    setIsPrinting(true)
    try {
      const ticketNumber = await takeTicket()
      setMyTicket(ticketNumber)

      // Prepare ticket data
      const now = new Date()
      const ticketData = {
        queueNumber: ticketNumber,
        date: now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        companyName: "LOKET UPT PPA",
      }

      // Simpan tiket ke Firestore (client-side)
      try {
        await addDoc(collection(db, "tickets"), {
          ...ticketData,
          createdAt: serverTimestamp(),
        })
      } catch (firebaseError) {
        console.warn("Gagal menyimpan ke Firebase, lanjutkan tanpa simpan:", firebaseError)
      }

      // Try to print with thermal printer first
      try {
        const printerService = getPrinterService()
        const isConnected = await printerService.checkPrinterStatus()

        if (isConnected) {
          await printerService.printTicket(ticketData)
          toast.success(`Tiket A${ticketNumber} berhasil dicetak ke printer thermal!`)
          return // Exit early if thermal print succeeds
        } else {
          throw new Error("Printer tidak terhubung")
        }
      } catch (printError) {
        console.warn("Thermal printer failed, using browser print fallback:", printError)
        // Fallback to browser print
        await printTicketFallback(ticketData)
        toast.success(`Tiket A${ticketNumber} berhasil dicetak via browser!`)
      }
    } catch (error) {
      console.error("Failed to print ticket:", error)
      toast.error("Gagal mencetak tiket. Silakan coba lagi.")
    } finally {
      setIsPrinting(false)
    }
  }

  const handleSaveAsPDF = async () => {
    if (!ticketRef.current || !myTicket || isSavingPDF) return

    setIsSavingPDF(true)
    try {
      // Dynamic import untuk menghindari SSR issues
      // Menggunakan string literal untuk menghindari bundling issues
      const html2canvasModule = await import('html2canvas')
      const html2canvas = html2canvasModule.default || (html2canvasModule as any)
      
      const jsPDFModule = await import('jspdf')
      const jsPDF = (jsPDFModule as any).jsPDF || jsPDFModule.default || jsPDFModule

      // Clone element untuk menghindari perubahan pada DOM asli
      const clonedElement = ticketRef.current.cloneNode(true) as HTMLElement
      clonedElement.style.position = 'absolute'
      clonedElement.style.left = '-9999px'
      clonedElement.style.top = '0'
      document.body.appendChild(clonedElement)

      // Convert modern color functions (oklch, lab) ke rgb sebelum capture
      const style = window.getComputedStyle(clonedElement)
      const allElements = clonedElement.querySelectorAll('*')
      
      // Fungsi untuk convert oklch ke rgb (approximation)
      const convertOklchToRgb = (oklchValue: string): string => {
        if (!oklchValue.includes('oklch')) return oklchValue
        
        // Extract oklch values: oklch(L C H) or oklch(L C H / alpha)
        const match = oklchValue.match(/oklch\(([^)]+)\)/)
        if (!match) return '#000000'
        
        const values = match[1].split(/\s+/).map(v => parseFloat(v))
        const [L, C, H] = values
        
        // Approximation: convert oklch to rgb
        // This is a simplified conversion
        const h = (H || 0) * Math.PI / 180
        const a = C * Math.cos(h)
        const b = C * Math.sin(h)
        
        // Convert to linear RGB (simplified)
        const r = Math.round(Math.min(255, Math.max(0, (L + 0.3963377774 * a + 0.2158037573 * b) * 255)))
        const g = Math.round(Math.min(255, Math.max(0, (L - 0.1055613458 * a - 0.0638541728 * b) * 255)))
        const bl = Math.round(Math.min(255, Math.max(0, (L - 0.0894841775 * a - 1.2914855480 * b) * 255)))
        
        return `rgb(${r}, ${g}, ${bl})`
      }

      // Fungsi untuk convert lab ke rgb (approximation)
      const convertLabToRgb = (labValue: string): string => {
        if (!labValue.includes('lab')) return labValue
        
        // Extract lab values: lab(L a b) or lab(L a b / alpha)
        const match = labValue.match(/lab\(([^)]+)\)/)
        if (!match) return '#000000'
        
        const values = match[1].split(/\s+/).map(v => parseFloat(v))
        const [L, a, b] = values
        
        // Convert Lab to XYZ (D65 white point)
        const y = (L + 16) / 116
        const x = a / 500 + y
        const z = y - b / 200
        
        const x3 = x * x * x
        const y3 = y * y * y
        const z3 = z * z * z
        
        const xn = x3 > 0.008856 ? x3 : (x - 16/116) / 7.787
        const yn = y3 > 0.008856 ? y3 : (y - 16/116) / 7.787
        const zn = z3 > 0.008856 ? z3 : (z - 16/116) / 7.787
        
        // D65 white point
        const X = xn * 0.95047
        const Y = yn * 1.00000
        const Z = zn * 1.08883
        
        // Convert XYZ to RGB (sRGB)
        let r = X *  3.2406 + Y * -1.5372 + Z * -0.4986
        let g = X * -0.9689 + Y *  1.8758 + Z *  0.0415
        let bl = X *  0.0557 + Y * -0.2040 + Z *  1.0570
        
        // Apply gamma correction
        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g
        bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1/2.4) - 0.055 : 12.92 * bl
        
        // Clamp and convert to 0-255
        const r255 = Math.round(Math.min(255, Math.max(0, r * 255)))
        const g255 = Math.round(Math.min(255, Math.max(0, g * 255)))
        const b255 = Math.round(Math.min(255, Math.max(0, bl * 255)))
        
        return `rgb(${r255}, ${g255}, ${b255})`
      }

      // Fungsi universal untuk convert modern color functions
      const convertModernColor = (colorValue: string): string => {
        if (!colorValue) return colorValue
        if (colorValue.includes('oklch')) return convertOklchToRgb(colorValue)
        if (colorValue.includes('lab(')) return convertLabToRgb(colorValue)
        return colorValue
      }

      // Convert computed styles
      Array.from(allElements).forEach((el) => {
        const elem = el as HTMLElement
        const computed = window.getComputedStyle(elem)
        
        // Convert color properties (oklch, lab, etc)
        const color = computed.color
        const bgColor = computed.backgroundColor
        const borderColor = computed.borderColor
        
        if (color && (color.includes('oklch') || color.includes('lab('))) {
          elem.style.color = convertModernColor(color)
        }
        if (bgColor && (bgColor.includes('oklch') || bgColor.includes('lab('))) {
          elem.style.backgroundColor = convertModernColor(bgColor)
        }
        if (borderColor && (borderColor.includes('oklch') || borderColor.includes('lab('))) {
          elem.style.borderColor = convertModernColor(borderColor)
        }
      })

      // Capture element sebagai canvas dengan onclone untuk convert oklch
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Final pass: convert any remaining modern color functions (oklch, lab) to rgb
          const allElements = clonedDoc.querySelectorAll('*')
          Array.from(allElements).forEach((el) => {
            const elem = el as HTMLElement
            if (elem.style) {
              // Get computed style and convert modern color functions
              const computed = clonedDoc.defaultView?.getComputedStyle(elem)
              if (computed) {
                const color = computed.color
                const bgColor = computed.backgroundColor
                const borderColor = computed.borderColor
                
                if (color && (color.includes('oklch') || color.includes('lab('))) {
                  elem.style.color = convertModernColor(color)
                }
                if (bgColor && (bgColor.includes('oklch') || bgColor.includes('lab('))) {
                  elem.style.backgroundColor = convertModernColor(bgColor)
                }
                if (borderColor && (borderColor.includes('oklch') || borderColor.includes('lab('))) {
                  elem.style.borderColor = convertModernColor(borderColor)
                }
              }
              
              // Also check inline styles
              const inlineStyle = elem.getAttribute('style') || ''
              if (inlineStyle.includes('oklch') || inlineStyle.includes('lab(')) {
                // Replace modern color functions with rgb equivalent
                let updatedStyle = inlineStyle
                updatedStyle = updatedStyle.replace(/oklch\([^)]+\)/g, (match) => convertOklchToRgb(match))
                updatedStyle = updatedStyle.replace(/lab\([^)]+\)/g, (match) => convertLabToRgb(match))
                elem.style.cssText = updatedStyle
              }
            }
          })
        }
      } as any)

      // Remove cloned element
      document.body.removeChild(clonedElement)

      // Convert canvas ke image data
      const imgData = canvas.toDataURL('image/png')

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 120], // Ukuran seperti tiket thermal
      })

      // Calculate dimensions
      const imgWidth = 80
      const pageHeight = 120
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new page if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save PDF
      const now = new Date()
      pdf.save(`Tiket-A${myTicket}-${now.toISOString().split('T')[0]}.pdf`)

      toast.success('Nomor antrian berhasil disimpan sebagai PDF!')
    } catch (error) {
      console.error('Failed to save PDF:', error)
      toast.error('Gagal menyimpan PDF. Silakan coba lagi.')
    } finally {
      setIsSavingPDF(false)
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="w-full border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-pretty">Loket UPT PPA</div>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Admin
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
            <PrinterStatus />
            <QueueDisplay number={value} label="Antrian Saat Ini" />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={handleTakeTicket}
                  disabled={isPrinting}
                  className="px-8 py-6 text-lg"
                >
                  {isPrinting ? "Mencetak..." : "Ambil Nomor Antrian"}
                </Button>
                {myTicket && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSaveAsPDF}
                    disabled={isSavingPDF}
                    className="px-8 py-6 text-lg"
                  >
                    {isSavingPDF ? "Menyimpan..." : "Simpan sebagai PDF"}
                  </Button>
                )}
              </div>

              <p className="text-sm md:text-base text-muted-foreground">
                Tanggal: <span className="font-medium text-foreground">{dateDisplay}</span>
              </p>

              {myTicket && (
                <div
                  ref={ticketRef}
                  className="rounded-lg border bg-card px-6 py-5 text-center min-w-[300px]"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <div className="text-lg font-semibold mb-3">LOKET UPT PPA</div>
                  <div className="border-t border-b py-4 my-3">
                    <div className="text-5xl md:text-6xl font-mono tabular-nums font-bold">
                      A{myTicket}
                    </div>
                  </div>
                  <div className="text-base md:text-lg space-y-1">
                    <div>Tanggal: <span className="font-medium">{dateDisplay}</span></div>
                    <div>
                      Waktu:{" "}
                      <span className="font-medium">
                        {new Date().toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
                    Nomor Anda: <span className="font-mono tabular-nums font-semibold text-foreground">A{myTicket}</span>
                  </div>
                </div>
              )}
              {!myTicket && (
                <div className="rounded-lg border bg-card px-4 py-3 text-base md:text-lg">
                  Nomor Anda: <span className="font-mono tabular-nums font-semibold">—</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t">
        <div className="mx-auto max-w-3xl px-4 py-4 text-center text-xs text-muted-foreground">
          Loket UPT PPA - Sistem Antrian Digital
        </div>
      </footer>
    </main>
  )
}
