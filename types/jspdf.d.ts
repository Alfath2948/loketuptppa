declare module 'jspdf' {
  export interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape'
    unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc'
    format?: string | number[] | [number, number]
    compress?: boolean
    precision?: number
    userUnit?: number
    hotfixes?: string[]
    encryption?: any
    putOnlyUsedFonts?: boolean
    floatPrecision?: number | 'smart'
  }

  export class jsPDF {
    constructor(options?: jsPDFOptions)
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): jsPDF
    addPage(): jsPDF
    save(filename: string): void
    setFontSize(size: number): jsPDF
    text(text: string, x: number, y: number): jsPDF
  }

  // Export both named and default
  export { jsPDF }
  export default jsPDF
}

