import React from 'react'
import { usePrefix } from '../hooks'

export interface IWorkspaceItemProps {
  style?: React.CSSProperties
  flexable?: boolean
  children?: React.ReactNode
}

export interface IWorkspacePanelProps {
  children?: React.ReactNode
}

export const WorkspacePanel: React.FC<IWorkspacePanelProps> & {
  Item?: React.FC<IWorkspaceItemProps>
} = (props) => {
  const prefix = usePrefix('workspace-panel')
  return <div className={prefix}>{props.children}</div>
}

WorkspacePanel.Item = (props) => {
  const prefix = usePrefix('workspace-panel-item')
  return (
    <div
      className={prefix}
      style={{
        ...props.style,
        flexGrow: props.flexable ? 1 : 0,
        flexShrink: props.flexable ? 1 : 0,
      }}
    >
      {props.children}
    </div>
  )
}
