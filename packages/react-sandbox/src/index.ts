import React, { useRef, useEffect } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { isFn, globalThisPolyfill } from '@thienvu18/designable-shared'
import {
  useDesigner,
  useWorkspace,
  useLayout,
  usePrefix,
} from '@thienvu18/designable-react'

const ROOT_INSTANCE_KEY = '__DESIGNABLE_SANDBOX_ROOT_INSTANCE__'
const ROOT_CONTAINER_KEY = '__DESIGNABLE_SANDBOX_ROOT_CONTAINER__'
const UNMOUNT_KEY = '__DESIGNABLE_SANDBOX_UNMOUNT__'

export interface ISandboxProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  style?: React.CSSProperties
  cssAssets?: string[]
  jsAssets?: string[]
  scope?: any
}

export const useSandbox = (props: React.PropsWithChildren<ISandboxProps>) => {
  const ref = useRef<HTMLIFrameElement>(null)
  const appCls = usePrefix('app')
  const designer = useDesigner()
  const workspace = useWorkspace()
  const layout = useLayout()
  const cssAssets = props.cssAssets || []
  const jsAssets = props.jsAssets || []
  const getCSSVar = (name: string) => {
    const el = document.querySelector(`.${appCls}`)
    return el ? getComputedStyle(el).getPropertyValue(name) : ''
  }

  useEffect(() => {
    if (ref.current && workspace) {
      const styles = cssAssets
        ?.map?.((css) => {
          return `<link media="all" rel="stylesheet" href="${css}" />`
        })
        .join('\n')
      const scripts = jsAssets
        ?.map?.((js) => {
          return `<script src="${js}" type="text/javascript" ></script>`
        })
        .join('\n')

      const contentWindow = ref.current.contentWindow
      const contentDocument = ref.current.contentDocument
      if (contentWindow && contentDocument) {
        contentWindow[UNMOUNT_KEY]?.()
        contentWindow['__DESIGNABLE_SANDBOX_SCOPE__'] = props.scope
        contentWindow['__DESIGNABLE_LAYOUT__'] = layout
        contentWindow['__DESIGNABLE_ENGINE__'] = designer
        contentWindow['__DESIGNABLE_WORKSPACE__'] = workspace
        contentWindow['Formily'] = globalThisPolyfill['Formily']
        contentWindow['Designable'] = globalThisPolyfill['Designable']
        contentDocument.open()
        contentDocument.write(`
        <!DOCTYPE html>
          <head>
            ${styles}
          </head>
          <style>
            html{
              overflow: overlay;
            }
            ::-webkit-scrollbar {
              width: 5px;
              height: 5px;
            }
            ::-webkit-scrollbar-thumb {
              background-color:${getCSSVar('--dn-scrollbar-color')};
              border-radius: 0;
              transition: all .25s ease-in-out;
            }
            ::-webkit-scrollbar-thumb:hover {
              background-color: ${getCSSVar('--dn-scrollbar-hover-color')};
            }
            body{
              margin:0;
              padding:0;
              overflow-anchor: none;
              user-select:none;
              background-color:${
                layout?.theme === 'light' ? '#fff' : 'transparent'
              } !important;
            }
            html{
              overflow-anchor: none;
            }
            .inherit-cusor * {
              cursor: inherit !important;
            }
          </style>
          <body>
            <div id="__SANDBOX_ROOT__"></div>
            ${scripts}
          </body>
        </html>
        `)
        contentDocument.close()

        return () => {
          contentWindow[UNMOUNT_KEY]?.()
        }
      }
    }
  }, [workspace, layout, props.scope, cssAssets, jsAssets, designer])
  return ref
}

export const unmountSandboxContent = () => {
  const root: Root | undefined = globalThisPolyfill[ROOT_INSTANCE_KEY]
  if (!root || typeof root.unmount !== 'function') return

  // Clear the references first so repeated unload events remain idempotent.
  globalThisPolyfill[ROOT_INSTANCE_KEY] = undefined
  globalThisPolyfill[ROOT_CONTAINER_KEY] = undefined
  root.unmount()
}

if (globalThisPolyfill.frameElement) {
  globalThisPolyfill.addEventListener('unload', () => {
    unmountSandboxContent()
  })
}

globalThisPolyfill[UNMOUNT_KEY] = unmountSandboxContent

export const useSandboxScope = () => {
  return globalThisPolyfill['__DESIGNABLE_SANDBOX_SCOPE__']
}

export const renderSandboxContent = (render: (scope?: any) => React.ReactNode) => {
  if (isFn(render)) {
    const container = document.getElementById('__SANDBOX_ROOT__')
    if (!container) return
    let root: Root | undefined = globalThisPolyfill[ROOT_INSTANCE_KEY]
    const rootContainer: HTMLElement | undefined = globalThisPolyfill[ROOT_CONTAINER_KEY]
    if (root && rootContainer !== container) {
      unmountSandboxContent()
      root = undefined
    }
    if (!root) {
      root = createRoot(container)
      globalThisPolyfill[ROOT_INSTANCE_KEY] = root
      globalThisPolyfill[ROOT_CONTAINER_KEY] = container
    }
    root.render(render(useSandboxScope()))
  }
}

export const Sandbox: React.FC<ISandboxProps> = (props) => {
  const { style } = props
  const iframeProps = { ...props }
  delete iframeProps.cssAssets
  delete iframeProps.jsAssets
  delete iframeProps.scope
  delete iframeProps.style
  const ref = useSandbox(props)
  return React.createElement('iframe', {
    ...iframeProps,
    ref,
    style: {
      height: '100%',
      width: '100%',
      border: 'none',
      display: 'block',
      ...style,
    },
  })
}
