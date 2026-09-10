import { TreeNode } from '@thienvu18/designable-core'
import { useDesigner } from './useDesigner'
import { useTreeNode } from './useTreeNode'

export const useNodeIdProps = (node?: TreeNode) => {
  const target = useTreeNode()
  const designer = useDesigner()
  const id = node ? node.id : target ? target.id : undefined
  if (!designer || !id) return {}
  return {
    [designer.props.nodeIdAttrName]: id,
  }
}
