import React from 'react'
import { readFileSync } from 'fs'
import path from 'path'
import { render } from '@testing-library/react'
import { createDesigner } from '@thienvu18/designable-core'
import { Designer, Workbench } from '../index'

const readSource = (...parts: string[]) =>
  readFileSync(path.resolve(__dirname, '..', ...parts), 'utf8')

describe('@thienvu18/designable-react visual regression contracts', () => {
  it('mounts light and dark layout roots with their custom variables', () => {
    const engine = createDesigner()
    const { container, rerender, unmount } = render(
      <Designer engine={engine} theme="light" variables={{ 'visual-accent': '#123456' }}>
        <Workbench />
      </Designer>
    )

    const app = container.querySelector('.dn-app') as HTMLDivElement
    expect(app).toHaveClass('dn-light')
    expect(app.style.getPropertyValue('--visual-accent')).toBe('#123456')

    rerender(
      <Designer engine={engine} theme="dark" variables={{ 'visual-accent': '#654321' }}>
        <Workbench />
      </Designer>
    )
    expect(app).toHaveClass('dn-dark')
    expect(app.style.getPropertyValue('--visual-accent')).toBe('#654321')

    unmount()
    engine.unmount()
  })

  it('keeps theme tokens and overlay pointer-event boundaries in the emitted stylesheet source', () => {
    const theme = readSource('theme.less')
    const overlays = readSource('widgets', 'AuxToolWidget', 'styles.less')
    const ghost = readSource('widgets', 'GhostWidget', 'styles.less')

    for (const selector of ['.@{prefix-cls}-light', '.@{prefix-cls}-dark']) {
      expect(theme).toContain(selector)
    }
    for (const token of [
      '--dn-aux-cover-rect-dragging-color',
      '--dn-aux-free-selection-background-color',
      '--dn-ghost-bg-color',
    ]) {
      expect(theme).toContain(token)
    }

    expect(overlays).toMatch(/\.@\{prefix-cls\}-auxtool[\s\S]*?pointer-events:\s*none/)
    expect(overlays).toMatch(/\.@\{prefix-cls\}-aux-helpers[\s\S]*?pointer-events:\s*all/)
    expect(ghost).toMatch(/pointer-events:\s*none/)
  })
})
