import { ViewportResizeEvent, ViewportScrollEvent } from '../events'
import { Engine } from '../models'

export const useViewportEffect = (engine: Engine) => {
  engine.subscribeTo(ViewportResizeEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport()
    }
  })
  engine.subscribeTo(ViewportScrollEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    if (viewport.matchViewport(event.data.target)) {
      viewport.digestViewport()
    }
    if (outline.matchViewport(event.data.target)) {
      outline.digestViewport()
    }
  })
}
