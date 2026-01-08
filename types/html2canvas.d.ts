declare module 'html2canvas' {
  export interface Html2CanvasOptions {
    scale?: number
    backgroundColor?: string
    useCORS?: boolean
    logging?: boolean
    width?: number
    height?: number
    x?: number
    y?: number
    scrollX?: number
    scrollY?: number
    windowWidth?: number
    windowHeight?: number
  }

  function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>

  // Export both named and default
  export { html2canvas }
  export default html2canvas
}

