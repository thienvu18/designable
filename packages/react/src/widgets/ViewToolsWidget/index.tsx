import { observer } from '@formily/reactive-react'
import { WorkbenchTypes } from '@thienvu18/designable-core'
import { Button, Space } from 'antd'
import cls from 'classnames'
import React from 'react'
import { usePrefix, useWorkbench } from '../../hooks'
import { IconWidget } from '../IconWidget'

export interface IViewToolsWidget {
  use?: WorkbenchTypes[]
  style?: React.CSSProperties
  className?: string
}

export const ViewToolsWidget: React.FC<IViewToolsWidget> = observer(
  ({ use = ['DESIGNABLE', 'JSONTREE', 'PREVIEW'], style, className }) => {
    const workbench = useWorkbench()
    const prefix = usePrefix('view-tools')
    return (
      <Space.Compact style={style} className={cls(prefix, className)}>
        {use.includes('DESIGNABLE') && (
          <Button
            disabled={workbench?.type === 'DESIGNABLE'}
            onClick={() => {
              if (workbench) workbench.type = 'DESIGNABLE'
            }}
            size="small"
          >
            <IconWidget infer="Design" />
          </Button>
        )}
        {use.includes('JSONTREE') && (
          <Button
            disabled={workbench?.type === 'JSONTREE'}
            onClick={() => {
              if (workbench) workbench.type = 'JSONTREE'
            }}
            size="small"
          >
            <IconWidget infer="JSON" />
          </Button>
        )}
        {use.includes('MARKUP') && (
          <Button
            disabled={workbench?.type === 'MARKUP'}
            onClick={() => {
              if (workbench) workbench.type = 'MARKUP'
            }}
            size="small"
          >
            <IconWidget infer="Code" />
          </Button>
        )}
        {use.includes('PREVIEW') && (
          <Button
            disabled={workbench?.type === 'PREVIEW'}
            onClick={() => {
              if (workbench) workbench.type = 'PREVIEW'
            }}
            size="small"
          >
            <IconWidget infer="Play" />
          </Button>
        )}
      </Space.Compact>
    )
  }
)
