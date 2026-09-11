import { ResizeObserver } from '@juggle/resize-observer'
import { EventDriver, globalThisPolyfill } from '@thienvu18/designable-shared'
import { ViewportResizeEvent } from '../events'
import { Engine } from '../models/Engine'

export class ViewportResizeDriver extends EventDriver<Engine> {
  request: number | null = null

  resizeObserver: ResizeObserver = null

  resizeTarget: EventTarget | null = null

  onResize = (event: UIEvent | ResizeObserverEntry[]) => {
    const target = Array.isArray(event) ? event[0]?.target : event.target
    this.resizeTarget = target ?? this.container
    if (this.request !== null) return

    this.request = globalThisPolyfill.requestAnimationFrame(() => {
      this.request = null
      const target = this.resizeTarget ?? this.container
      this.resizeTarget = null
      this.dispatch(
        new ViewportResizeEvent({
          scrollX: this.contentWindow.scrollX,
          scrollY: this.contentWindow.scrollY,
          width: this.contentWindow.innerWidth,
          height: this.contentWindow.innerHeight,
          innerHeight: this.contentWindow.innerHeight,
          innerWidth: this.contentWindow.innerWidth,
          view: this.contentWindow,
          target,
        })
      )
    })
  }

  attach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.addEventListener('resize', this.onResize)
    } else {
      if (this.container && this.container !== document) {
        const ResizeObserverImpl =
          (
            globalThisPolyfill as typeof globalThisPolyfill & {
              ResizeObserver?: typeof ResizeObserver
            }
          ).ResizeObserver || ResizeObserver
        this.resizeObserver = new ResizeObserverImpl(this.onResize)
        this.resizeObserver.observe(this.container as HTMLElement)
      }
    }
  }

  detach() {
    if (this.request !== null) {
      globalThisPolyfill.cancelAnimationFrame(this.request)
      this.request = null
    }
    this.resizeTarget = null
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.removeEventListener('resize', this.onResize)
    } else if (this.resizeObserver) {
      if (this.container && this.container !== document) {
        this.resizeObserver.unobserve(this.container as HTMLElement)
        this.resizeObserver.disconnect()
      }
      this.resizeObserver = null
    }
  }
}
