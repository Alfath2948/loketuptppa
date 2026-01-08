"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPrinterService } from "@/lib/printer-service"
import { toast } from "sonner"
import { Printer, RefreshCw, AlertCircle } from "lucide-react"

export function PrinterStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const checkPrinterStatus = async () => {
    setIsChecking(true)
    try {
      const printerService = getPrinterService()
      const status = await printerService.checkPrinterStatus()
      setIsConnected(status)
      
      if (status) {
        toast.success("Printer thermal terhubung via Web Serial")
      } else {
        toast.warning("Printer thermal tidak terhubung - akan menggunakan browser print")
      }
    } catch (error) {
      console.error('Error checking printer status:', error)
      setIsConnected(false)
      toast.warning("Web Serial tidak tersedia - akan menggunakan browser print")
    } finally {
      setIsChecking(false)
    }
  }

  const reconnectPrinter = async () => {
    setIsChecking(true)
    try {
      const printerService = getPrinterService()
      const status = await printerService.reconnect()
      setIsConnected(status)
      
      if (status) {
        toast.success("Printer berhasil terhubung ulang via Web Serial")
      } else {
        toast.warning("Gagal menghubungkan printer - akan menggunakan browser print")
      }
    } catch (error) {
      console.error('Error reconnecting printer:', error)
      setIsConnected(false)
      toast.warning("Gagal menghubungkan printer - akan menggunakan browser print")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkPrinterStatus()
  }, [])

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        <span className="text-sm font-medium">Printer Status:</span>
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Web Serial" : "Browser Print"}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={checkPrinterStatus}
          disabled={isChecking}
          className="h-8 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        </Button>
        
        {!isConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={reconnectPrinter}
            disabled={isChecking}
            className="h-8 px-2"
          >
            <AlertCircle className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
