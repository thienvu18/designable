import { observer, useField } from '@formily/react'
import { observable } from '@formily/reactive'
import { IconWidget, usePrefix } from '@thienvu18/designable-react'
import { FormItem, IFormItemProps } from '@thienvu18/formily-antd-v6'
import cls from 'classnames'
import React, { Fragment, useMemo, useRef } from 'react'
import './styles.less'

const ExpandedMap = new Map<string, boolean>()

export const FoldItem: React.FC<React.PropsWithChildren<IFormItemProps>> & {
  Base?: React.FC<React.PropsWithChildren<{}>>
  Extra?: React.FC<React.PropsWithChildren<{}>>
} = observer(({ className, style, children, ...props }) => {
  const prefix = usePrefix('fold-item')
  const field = useField()
  const expand = useMemo(
    () => observable.ref(ExpandedMap.get(field?.address?.toString() || '')),
    [field?.address]
  )
  const slots = useRef<{ base: React.ReactNode; extra: React.ReactNode }>({
    base: null,
    extra: null,
  })

  slots.current = { base: null, extra: null }
  React.Children.forEach(children, (node) => {
    if (React.isValidElement(node)) {
      if ((node?.type as any)?.displayName === 'FoldItem.Base') {
        slots.current.base = (node.props as any)?.children
      }
      if ((node?.type as any)?.displayName === 'FoldItem.Extra') {
        slots.current.extra = (node.props as any)?.children
      }
    }
  })
  return (
    <div className={cls(prefix, className)} style={style}>
      <div
        className={prefix + '-base'}
        onClick={() => {
          expand.value = !expand.value
          if (field?.address) {
            ExpandedMap.set(field.address.toString(), expand.value)
          }
        }}
      >
        <FormItem.BaseItem
          {...props}
          label={
            <span
              className={cls(prefix + '-title', {
                expand: expand.value,
              })}
            >
              {slots.current.extra && <IconWidget infer="Expand" size={10} />}
              {props.label}
            </span>
          }
        >
          <div
            style={{ width: '100%' }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {slots.current.base}
          </div>
        </FormItem.BaseItem>
      </div>
      {expand.value && slots.current.extra && (
        <div className={prefix + '-extra'}>{slots.current.extra}</div>
      )}
    </div>
  )
})

const Base: React.FC<React.PropsWithChildren<{}>> = () => {
  return <Fragment />
}

Base.displayName = 'FoldItem.Base'

const Extra: React.FC<React.PropsWithChildren<{}>> = () => {
  return <Fragment />
}

Extra.displayName = 'FoldItem.Extra'

FoldItem.Base = Base
FoldItem.Extra = Extra
