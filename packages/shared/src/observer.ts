export class LayoutObserver {
  private resizeObserver?: ResizeObserver

  private performanceObserver?: PerformanceObserver

  private mutationObserver?: MutationObserver

  private connected = false

  constructor(observer: () => void = () => {}) {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => observer())
    }
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.performanceObserver = new PerformanceObserver(() => {
          observer()
        })
      } catch (e) {}
    }
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => observer())
    }
  }

  observe = (target: HTMLElement | Element) => {
    if (!target) return
    this.resizeObserver?.observe(target)
    try {
      this.performanceObserver?.observe({
        entryTypes: ['paint', 'element', 'layout-shift', 'event'],
      })
    } catch (e) {}
    this.mutationObserver?.observe(target, {
      attributeFilter: ['style'],
      attributes: true,
    })
    this.connected = true
  }

  disconnect = () => {
    if (this.connected) {
      this.resizeObserver?.disconnect()
      this.performanceObserver?.disconnect()
      this.mutationObserver?.disconnect()
    }
    this.connected = false
  }
}
