import { observer } from '@formily/reactive-react'
import { TreeNode } from '@thienvu18/designable-core'
import React from 'react'
import { useNodeIdProps, useTreeNode } from '../../hooks'
import {
  INodeActionsWidgetActionProps,
  NodeActionsWidget,
} from '../NodeActionsWidget'
import { NodeTitleWidget } from '../NodeTitleWidget'
import './styles.less'

export interface IDroppableWidgetProps {
  node?: TreeNode
  actions?: INodeActionsWidgetActionProps[]
  placeholder?: boolean
  height?: number
  style?: React.CSSProperties
  className?: string
  hasChildren?: boolean
}

export const DroppableWidget: React.FC<
  React.PropsWithChildren<IDroppableWidgetProps>
> = observer(
  ({
    node,
    actions,
    height,
    placeholder = true,
    style,
    className,
    hasChildren: hasChildrenProp,
    children,
    ...props
  }) => {
    const currentNode = useTreeNode()
    const nodeId = useNodeIdProps(node)
    const target = node ?? currentNode
    const hasChildren =
      hasChildrenProp ??
      (target?.children?.length ? target.children.length > 0 : false)
    return (
      <div {...nodeId} {...props} className={className} style={style}>
        {hasChildren ? (
          children
        ) : placeholder ? (
          <div style={{ height }} className="dn-droppable-placeholder">
            {target && <NodeTitleWidget node={target} />}
          </div>
        ) : (
          children
        )}
        {actions?.length ? (
          <NodeActionsWidget>
            {actions.map((action, key) => (
              <NodeActionsWidget.Action {...action} key={key} />
            ))}
          </NodeActionsWidget>
        ) : null}
      </div>
    )
  }
)
