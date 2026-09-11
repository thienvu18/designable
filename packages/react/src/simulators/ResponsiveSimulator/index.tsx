import { observer } from '@formily/reactive-react'
import {
  CursorDragType,
  DragMoveEvent,
  DragStartEvent,
  DragStopEvent,
  Engine,
} from '@thienvu18/designable-core'
import {
  calcSpeedFactor,
  createUniformSpeedAnimation,
} from '@thienvu18/designable-shared'
import React, { useRef } from 'react'
import { useDesigner, usePrefix } from '../../hooks'
import { IconWidget } from '../../widgets'
import { ResizeHandle, ResizeHandleType } from './handle'

import cls from 'classnames'
import './styles.less'

const useResizeEffect = (
  container: React.RefObject<HTMLDivElement | null>,
  content: React.RefObject<HTMLDivElement | null>,
  engine: Engine
) => {
  let status: ResizeHandleType = null
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let animationX = null
  let animationY = null

  const getStyle = (status: ResizeHandleType) => {
    if (status === ResizeHandleType.Resize) return 'nwse-resize'
    if (status === ResizeHandleType.ResizeHeight) return 'ns-resize'
    if (status === ResizeHandleType.ResizeWidth) return 'ew-resize'
  }

  const updateSize = (deltaX: number, deltaY: number) => {
    const containerRect = container.current?.getBoundingClientRect()
    if (!containerRect) return
    if (status === ResizeHandleType.Resize) {
      engine.screen.setSize(startWidth + deltaX, startHeight + deltaY)
      container.current?.scrollBy(
        containerRect.width + deltaX,
        containerRect.height + deltaY
      )
    } else if (status === ResizeHandleType.ResizeHeight) {
      engine.screen.setSize(startWidth, startHeight + deltaY)
      container.current?.scrollBy(
        container.current.scrollLeft,
        containerRect.height + deltaY
      )
    } else if (status === ResizeHandleType.ResizeWidth) {
      engine.screen.setSize(startWidth + deltaX, startHeight)
      container.current?.scrollBy(
        containerRect.width + deltaX,
        container.current.scrollTop
      )
    }
  }

  engine.subscribeTo(DragStartEvent, (e) => {
    if (!engine.workbench.currentWorkspace?.viewport) return
    const target = e.data.target as HTMLElement
    if (target) {
      const handler = target.closest(
        `*[${engine.props.screenResizeHandlerAttrName}]`
      )
      if (!handler) return
      const rect = handler.getBoundingClientRect()
      if (!rect) return
      status = handler.getAttribute(
        engine.props.screenResizeHandlerAttrName
      ) as ResizeHandleType
      engine.cursor.setStyle(getStyle(status))
      startX = e.data.topClientX
      startY = e.data.topClientY
      startWidth = rect.width
      startHeight = rect.height
      engine.cursor.setDragType(CursorDragType.Resize)
    }
  })
  engine.subscribeTo(DragMoveEvent, (e) => {
    if (!engine.workbench.currentWorkspace?.viewport) return
    if (!status) return
    const deltaX = e.data.topClientX - startX
    const deltaY = e.data.topClientY - startY
    const containerRect = container.current?.getBoundingClientRect()
    if (!containerRect) return
    const distanceX = Math.floor(containerRect.right - e.data.topClientX)
    const distanceY = Math.floor(containerRect.bottom - e.data.topClientY)
    const factorX = calcSpeedFactor(distanceX, 10)
    const factorY = calcSpeedFactor(distanceY, 10)
    updateSize(deltaX, deltaY)
    if (distanceX <= 10) {
      if (!animationX) {
        animationX = createUniformSpeedAnimation(1000 * factorX, (delta) => {
          updateSize(deltaX + delta, deltaY)
        })
      }
    } else {
      if (animationX) {
        animationX = animationX()
      }
    }

    if (distanceY <= 10) {
      if (!animationY) {
        animationY = createUniformSpeedAnimation(300 * factorY, (delta) => {
          updateSize(deltaX, deltaY + delta)
        })
      }
    } else {
      if (animationY) {
        animationY = animationY()
      }
    }
  })
  engine.subscribeTo(DragStopEvent, () => {
    if (!status) return
    status = null
    engine.cursor.setStyle('')
    engine.cursor.setDragType(CursorDragType.Move)
    if (animationX) {
      animationX = animationX()
    }
    if (animationY) {
      animationY = animationY()
    }
  })
}

export interface IResponsiveSimulatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: React.CSSProperties
}

export const ResponsiveSimulator: React.FC<
  React.PropsWithChildren<IResponsiveSimulatorProps>
> = observer((props) => {
  const container = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const prefix = usePrefix('responsive-simulator')
  useDesigner((engine) => {
    useResizeEffect(container, content, engine)
  })
  return (
    <div
      {...props}
      className={cls(prefix, props.className)}
      style={{
        height: '100%',
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        ...props.style,
      }}
      ref={container}
    >
      <div
        ref={content}
        style={{
          height: '100%',
          width: '100%',
          paddingRight: 4,
          paddingBottom: 4,
        }}
      >
        {props.children}
        <ResizeHandle type={ResizeHandleType.Resize}>
          <IconWidget infer="Corner" style={{ pointerEvents: 'none' }} />
        </ResizeHandle>
        <ResizeHandle type={ResizeHandleType.ResizeWidth} />
        <ResizeHandle type={ResizeHandleType.ResizeHeight} />
      </div>
    </div>
  )
})
