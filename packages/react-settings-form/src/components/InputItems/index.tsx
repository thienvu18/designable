import { IconWidget, usePrefix } from '@thienvu18/designable-react'
import cls from 'classnames'
import React, { useContext } from 'react'
import './styles.less'

export interface IInputItemsContext {
  width?: string | number
  vertical?: boolean
}

export interface IInputItemsProps {
  className?: string
  style?: React.CSSProperties
  width?: string | number
  vertical?: boolean
}

export interface IInputItemProps {
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  width?: string | number
  vertical?: boolean
  title?: React.ReactNode
}

const InputItemsContext = React.createContext<IInputItemsContext | null>(null)

export const InputItems: React.FC<React.PropsWithChildren<IInputItemsProps>> & {
  Item: React.FC<React.PropsWithChildren<IInputItemProps>>
} = (props) => {
  const { width = '100%', className, style, children } = props
  const prefix = usePrefix('input-items')
  return (
    <InputItemsContext.Provider value={{ width, vertical: props.vertical }}>
      <div className={cls(prefix, className)} style={style}>
        {children}
      </div>
    </InputItemsContext.Provider>
  )
}

InputItems.Item = (props) => {
  const prefix = usePrefix('input-items-item')
  const ctx = useContext(InputItemsContext)
  return (
    <div
      className={cls(prefix, props.className, {
        vertical: props.vertical || ctx?.vertical,
      })}
      style={{ width: props.width || ctx?.width, ...props.style }}
    >
      {props.icon && (
        <div className={prefix + '-icon'}>
          {typeof props.icon === 'string' ? (
            <IconWidget infer={props.icon} size={16} />
          ) : (
            props.icon
          )}
        </div>
      )}
      {props.title && <div className={prefix + '-title'}>{props.title}</div>}
      <div className={prefix + '-controller'}>{props.children}</div>
    </div>
  )
}
