import { useState, useEffect, useMemo, useCallback } from 'react'
import { TreeNode, CursorStatus, CursorDragType } from '@thienvu18/designable-core'
import { LayoutObserver, IRect } from '@thienvu18/designable-shared'
import { useViewport } from './useViewport'
import { useDesigner } from './useDesigner'

const isEqualRect = (rect1: IRect | DOMRect, rect2: IRect | DOMRect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  )
}

export const useValidNodeOffsetRect = (node: TreeNode) => {
  const engine = useDesigner()
  const viewport = useViewport()
  const [, forceUpdate] = useState(null)
  const rectRef = useMemo(
    () => ({ current: viewport?.getValidNodeOffsetRect(node) }),
    [viewport, node]
  )

  const element = viewport?.findElementById(node?.id)

  const compute = useCallback(() => {
    if (
      engine.cursor.status !== CursorStatus.Normal &&
      engine.cursor.dragType === CursorDragType.Move
    )
      return
    const nextRect = viewport?.getValidNodeOffsetRect(node)
    if (!isEqualRect(rectRef.current, nextRect) && nextRect) {
      rectRef.current = nextRect
      forceUpdate([])
    }
  }, [viewport, node, engine])

  useEffect(() => {
    const layoutObserver = new LayoutObserver(compute)
    if (element) layoutObserver.observe(element)
    return () => {
      layoutObserver.disconnect()
    }
  }, [node, viewport, element, compute])
  return rectRef.current
}
