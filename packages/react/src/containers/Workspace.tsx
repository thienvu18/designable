import React, { Fragment, useMemo, useRef } from 'react'
import { WorkspaceContext } from '../context'
import { useDesigner } from '../hooks'

export interface IWorkspaceProps {
  id?: string
  title?: string
  description?: string
}

export const Workspace: React.FC<React.PropsWithChildren<IWorkspaceProps>> = ({
  id,
  title,
  description,
  children,
}) => {
  const oldId = useRef<string | null>(null)
  const designer = useDesigner()
  const workspace = useMemo(() => {
    if (!designer) return
    if (oldId.current && oldId.current !== id) {
      const old = designer.workbench.findWorkspaceById(oldId.current)
      if (old) old.viewport.detachEvents()
    }
    const workspace = {
      id: id || 'index',
      title,
      description,
    }
    designer.workbench.ensureWorkspace(workspace)
    oldId.current = workspace.id
    return workspace
  }, [id, title, description, designer])

  return (
    <Fragment>
      <WorkspaceContext.Provider value={workspace}>
        {children}
      </WorkspaceContext.Provider>
    </Fragment>
  )
}
