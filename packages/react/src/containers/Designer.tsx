import { Engine, GlobalRegistry } from '@thienvu18/designable-core'
import React, { useEffect, useRef } from 'react'
import { DesignerEngineContext } from '../context'
import { useDesigner } from '../hooks'
import * as icons from '../icons'
import { IDesignerProps } from '../types'
import { GhostWidget } from '../widgets'
import { Layout } from './Layout'

GlobalRegistry.registerDesignerIcons(icons)

export const Designer: React.FC<React.PropsWithChildren<IDesignerProps>> = (
  props
) => {
  const {
    prefixCls = 'dn-',
    theme = 'light',
    engine: engineProp,
    children,
    ...rest
  } = props
  const existingEngine = useDesigner()
  const ref = useRef<Engine | null>(null)

  useEffect(() => {
    if (engineProp) {
      if (ref.current && engineProp !== ref.current) {
        ref.current.unmount()
      }
      engineProp.mount()
      ref.current = engineProp
    }
    return () => {
      if (engineProp) {
        engineProp.unmount()
      }
    }
  }, [engineProp])

  if (existingEngine) {
    throw new Error(
      'There can only be one Designable Engine Context in the React Tree'
    )
  }

  return (
    <Layout prefixCls={prefixCls} theme={theme} {...rest}>
      <DesignerEngineContext.Provider value={engineProp}>
        {children}
        <GhostWidget />
      </DesignerEngineContext.Provider>
    </Layout>
  )
}
