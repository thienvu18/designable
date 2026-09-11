import { observer } from '@formily/reactive-react'
import { DroppableWidget } from '@thienvu18/designable-react'
import React from 'react'
import './styles.less'

export const Container: React.FC<React.PropsWithChildren> = observer(
  (props) => {
    return <DroppableWidget>{props.children}</DroppableWidget>
  }
)

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
