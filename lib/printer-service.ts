"use client"

export interface TicketData {
  queueNumber: number
  date: string
  time: string
  companyName?: string
}

export class PrinterService {
  private port: SerialPort | null = null
  private writer: WritableStreamDefaultWriter | null = null
  private isConnected = false

  constructor() {
    this.checkWebSerialSupport()
  }

  private checkWebSerialSupport() {
    if (!('serial' in navigator)) {
      console.warn('Web Serial API not supported in this browser')
      this.isConnected = false
      return false
    }
    return true
  }

  private async initializePrinter() {
    if (!this.checkWebSerialSupport()) {
      return false
    }

    try {
      // Request access to serial port
      this.port = await (navigator as any).serial.requestPort()
      
      if (!this.port) {
        throw new Error('Failed to get serial port')
      }
      
      // Open the port with 9600 baud rate (common for thermal printers)
      await this.port.open({ baudRate: 9600 })
      
      // Get the writer
      if (this.port.writable) {
        this.writer = this.port.writable.getWriter()
      } else {
        throw new Error('Port writable stream not available')
      }
      
      this.isConnected = true
      console.log('Printer initialized successfully via Web Serial API')
      return true
    } catch (error) {
      console.error('Failed to initialize printer:', error)
      this.isConnected = false
      return false
    }
  }

  private async sendCommand(command: Uint8Array) {
    if (!this.writer) {
      throw new Error('Printer not connected')
    }
    await this.writer.write(command)
  }

  private async printText(text: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    await this.sendCommand(data)
  }

  async printTicket(ticketData: TicketData) {
    if (!this.isConnected) {
      // Try to initialize if not connected
      const initialized = await this.initializePrinter()
      if (!initialized) {
        throw new Error('Printer not connected and failed to initialize')
      }
    }

    try {
      const { queueNumber, date, time, companyName = 'LOKET UPT PPA' } = ticketData

      // ESC/POS commands for thermal printer
      const ESC = 0x1B
      const GS = 0x1D
      
      // Initialize printer
      await this.sendCommand(new Uint8Array([ESC, 0x40]))
      
      // Center alignment
      await this.sendCommand(new Uint8Array([ESC, 0x61, 0x01]))
      
      // Company name
      await this.printText(companyName + '\n')
      
      // Draw line
      await this.printText('================================\n')
      
      // Queue number (large)
      await this.sendCommand(new Uint8Array([GS, 0x21, 0x11])) // Double height and width
      await this.printText(`A${queueNumber}\n`)
      
      // Reset text size
      await this.sendCommand(new Uint8Array([GS, 0x21, 0x00]))
      
      // Draw line
      await this.printText('================================\n')
      
      // Date and time
      await this.printText(`Tanggal: ${date}\n`)
      await this.printText(`Waktu: ${time}\n`)
      await this.printText('\n')
      
      // Instructions
      await this.printText('Silakan tunggu nomor Anda\n')
      await this.printText('dipanggil oleh petugas\n')
      await this.printText('\n')
      
      // Footer
      await this.printText('================================\n')
      await this.printText('Terima kasih atas kunjungan Anda\n')
      await this.printText('\n\n\n')
      
      // Cut paper
      await this.sendCommand(new Uint8Array([GS, 0x56, 0x00]))
      
      console.log(`Ticket A${queueNumber} printed successfully`)
      return true
    } catch (error) {
      console.error('Print failed:', error)
      throw error
    }
  }

  async checkPrinterStatus() {
    return this.isConnected
  }

  async reconnect() {
    try {
      if (this.writer) {
        await this.writer.close()
      }
      if (this.port) {
        await this.port.close()
      }
    } catch (error) {
      console.warn('Error closing previous connection:', error)
    }
    
    this.isConnected = false
    this.port = null
    this.writer = null
    
    return await this.initializePrinter()
  }

  async disconnect() {
    try {
      if (this.writer) {
        await this.writer.close()
      }
      if (this.port) {
        await this.port.close()
      }
    } catch (error) {
      console.warn('Error disconnecting:', error)
    }
    
    this.isConnected = false
    this.port = null
    this.writer = null
  }
}

// Singleton instance
let printerInstance: PrinterService | null = null

export function getPrinterService(): PrinterService {
  if (!printerInstance) {
    printerInstance = new PrinterService()
  }
  return printerInstance
}

// Alternative method using browser's print API (fallback)
export async function printTicketFallback(ticketData: TicketData) {
  const { queueNumber, date, time, companyName = 'LOKET UPT PPA' } = ticketData
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket A${queueNumber}</title>
      <style>
        @media print {
          @page { margin: 0; size: 58mm auto; }
          body { margin: 0; padding: 10px; font-family: monospace; }
        }
        body {
          font-family: monospace;
          text-align: center;
          width: 58mm;
          margin: 0 auto;
          padding: 10px;
        }
        .header { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .line { border-top: 1px solid #000; margin: 10px 0; }
        .queue-number { font-size: 32px; font-weight: bold; margin: 20px 0; }
        .info { font-size: 12px; margin: 5px 0; }
        .footer { font-size: 10px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">${companyName}</div>
      <div class="line"></div>
      <div class="queue-number">A${queueNumber}</div>
      <div class="line"></div>
      <div class="info">Tanggal: ${date}</div>
      <div class="info">Waktu: ${time}</div>
      <br>
      <div class="info">Silakan tunggu nomor Anda</div>
      <div class="info">dipanggil oleh petugas</div>
      <div class="line"></div>
      <div class="footer">Terima kasih atas kunjungan Anda</div>
    </body>
    </html>
  `
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
