import { each } from '@thienvu18/designable-shared'
import cls from 'classnames'
import React, { Fragment, useContext, useLayoutEffect, useRef } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutProps } from '../types'

export const Layout: React.FC<React.PropsWithChildren<IDesignerLayoutProps>> = (
  props
) => {
  const {
    theme = 'light',
    prefixCls = 'dn-',
    position = 'fixed',
    variables,
    children,
  } = props
  const layout = useContext(DesignerLayoutContext)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      each(variables, (value, key) => {
        ref.current?.style.setProperty(`--${key}`, value)
      })
    }
  }, [variables])

  if (layout) {
    return <Fragment>{children}</Fragment>
  }
  return (
    <div
      ref={ref}
      className={cls({
        [`${prefixCls}app`]: true,
        [`${prefixCls}${theme}`]: theme,
      })}
    >
      <DesignerLayoutContext.Provider
        value={{
          theme,
          prefixCls,
          position,
        }}
      >
        {children}
      </DesignerLayoutContext.Provider>
    </div>
  )
}
