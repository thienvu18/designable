import '@testing-library/jest-dom'
import prettyFormat from 'pretty-format'

// Polyfills and DOM utilities
globalThis['prettyFormat'] = prettyFormat
globalThis['sleep'] = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
globalThis['requestAnimationFrame'] = (fn: FrameRequestCallback) => setTimeout(fn, 0) as unknown as number
globalThis['cancelAnimationFrame'] = (id: number) => clearTimeout(id)

if (typeof window !== 'undefined') {
  const getComputedStyle = window.getComputedStyle.bind(window)
  window.getComputedStyle = ((element: Element) => getComputedStyle(element)) as typeof window.getComputedStyle

  window.matchMedia ||= ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    }) as MediaQueryList)

  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

  if (document.documentElement) {
    document.documentElement.style['grid-column-gap'] = '0px'
  }
}

// Warning-fatal test setup: fail tests on unexpected console.error or console.warn
const originalError = console.error
const originalWarn = console.warn
const originalReportError = globalThis.reportError
let unhandledRejectionHandler: ((reason: unknown) => void) | undefined

const unexpectedMessage = (source: string, value: unknown) => {
  const message = typeof value === 'string' ? value : prettyFormat(value)
  return `Unexpected ${source} in test: ${message}`
}

beforeEach(() => {
  console.error = (...args: unknown[]) => {
    originalError(...args)
    throw new Error(unexpectedMessage('console.error', args))
  }

  console.warn = (...args: unknown[]) => {
    originalWarn(...args)
    throw new Error(unexpectedMessage('console.warn', args))
  }

  globalThis.reportError = (error: unknown) => {
    throw new Error(unexpectedMessage('reportError', error))
  }
  unhandledRejectionHandler = (reason: unknown) => {
    throw new Error(unexpectedMessage('unhandled rejection', reason))
  }
  process.on('unhandledRejection', unhandledRejectionHandler)
})

afterEach(() => {
  console.error = originalError
  console.warn = originalWarn
  globalThis.reportError = originalReportError
  if (unhandledRejectionHandler) {
    process.off('unhandledRejection', unhandledRejectionHandler)
    unhandledRejectionHandler = undefined
  }
})
