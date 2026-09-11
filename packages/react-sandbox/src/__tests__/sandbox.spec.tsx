import { render, screen } from '@testing-library/react'
import { createDesigner } from '@thienvu18/designable-core'
import { Designer, Workbench } from '@thienvu18/designable-react'
import React from 'react'
import {
  Sandbox,
  renderSandboxContent,
  unmountSandboxContent,
  useSandboxScope,
} from '../index'

describe('@thienvu18/designable-react-sandbox', () => {
  let engine: ReturnType<typeof createDesigner>

  beforeEach(() => {
    engine = createDesigner()
    document.body.innerHTML = ''
  })

  afterEach(async () => {
    await React.act(async () => {
      unmountSandboxContent()
    })
    delete globalThis['__DESIGNABLE_SANDBOX_SCOPE__']
    engine.unmount()
  })

  it('should render Sandbox iframe element inside Designer workbench', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <Sandbox
            title="test-sandbox"
            cssAssets={['http://localhost/style.css']}
            jsAssets={['http://localhost/script.js']}
            scope={{ customVar: 'hello' }}
          />
        </Workbench>
      </Designer>
    )

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe?.getAttribute('title')).toBe('test-sandbox')

    unmount()
  })

  it('should manage single createRoot lifecycle in renderSandboxContent', async () => {
    const rootDiv = document.createElement('div')
    rootDiv.id = '__SANDBOX_ROOT__'
    document.body.appendChild(rootDiv)

    globalThis['__DESIGNABLE_SANDBOX_SCOPE__'] = { greeting: 'Designable 2.0' }

    await React.act(async () => {
      renderSandboxContent((scope) => (
        <div data-testid="sandbox-inner">{scope?.greeting}</div>
      ))
    })

    expect(screen.getByTestId('sandbox-inner')).toHaveTextContent(
      'Designable 2.0'
    )

    // Re-render to verify reusing the single Root instance
    await React.act(async () => {
      renderSandboxContent((scope) => (
        <div data-testid="sandbox-inner">Updated {scope?.greeting}</div>
      ))
    })

    expect(screen.getByTestId('sandbox-inner')).toHaveTextContent(
      'Updated Designable 2.0'
    )
  })

  it('replaces the root when the sandbox document container changes and unmounts once', async () => {
    const first = document.createElement('div')
    first.id = '__SANDBOX_ROOT__'
    document.body.appendChild(first)

    await React.act(async () => {
      renderSandboxContent(() => <div>first document</div>)
    })

    const firstRoot = globalThis['__DESIGNABLE_SANDBOX_ROOT_INSTANCE__']
    const unmount = jest.spyOn(firstRoot, 'unmount')
    first.remove()

    const second = document.createElement('div')
    second.id = '__SANDBOX_ROOT__'
    document.body.appendChild(second)
    await React.act(async () => {
      renderSandboxContent(() => (
        <div data-testid="replacement">second document</div>
      ))
    })

    expect(unmount).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('replacement')).toHaveTextContent(
      'second document'
    )

    await React.act(async () => {
      unmountSandboxContent()
      unmountSandboxContent()
    })
    expect(unmount).toHaveBeenCalledTimes(1)
  })

  it('should return scope from useSandboxScope', () => {
    globalThis['__DESIGNABLE_SANDBOX_SCOPE__'] = { test: 123 }
    expect(useSandboxScope()).toEqual({ test: 123 })
  })
})
