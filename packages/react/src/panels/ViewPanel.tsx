import { observer } from '@formily/reactive-react'
import { ITreeNode, TreeNode, WorkbenchTypes } from '@thienvu18/designable-core'
import { requestIdle } from '@thienvu18/designable-shared'
import React, { useEffect, useState } from 'react'
import { Viewport } from '../containers'
import { useTree, useWorkbench } from '../hooks'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    onChange: (tree: ITreeNode) => void
  ) => React.ReactElement
  scrollable?: boolean
  dragTipsDirection?: 'left' | 'right'
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const { type, children, scrollable = true, dragTipsDirection } = props
  const [visible, setVisible] = useState(true)
  const workbench = useWorkbench()
  const tree = useTree()

  useEffect(() => {
    if (workbench?.type === type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
    }
  }, [workbench?.type, type])

  if (workbench?.type !== type) return null

  const render = () => {
    return children(tree, (payload) => {
      tree.from(payload)
      tree.takeSnapshot()
    })
  }

  if (workbench?.type === 'DESIGNABLE') {
    return <Viewport dragTipsDirection={dragTipsDirection}>{render()}</Viewport>
  }

  return (
    <div
      style={{
        overflow: scrollable ? 'overlay' : 'hidden',
        height: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && render()}
    </div>
  )
})
