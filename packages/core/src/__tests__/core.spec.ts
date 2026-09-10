import {
  createDesigner,
  TreeNode,
  GlobalRegistry,
  createBehavior,
  createResource,
  Shortcut,
  KeyCode,
  SelectNodeEvent,
} from '../index'
import { globalThisPolyfill } from '@thienvu18/designable-shared'
import { ViewportResizeDriver } from '../drivers/ViewportResizeDriver'

describe('@thienvu18/designable-core', () => {
  describe('Engine & createDesigner', () => {
    it('should create an engine instance with default workbench', () => {
      const engine = createDesigner()
      expect(engine).toBeDefined()
      expect(engine.workbench).toBeDefined()
      engine.unmount()
    })

    it('should dispatch and subscribe to custom events using subscribeTo', () => {
      const engine = createDesigner()
      const subscriber = jest.fn()
      engine.subscribeTo(SelectNodeEvent, subscriber)

      const node = new TreeNode({ componentName: 'Test' })
      const event = new SelectNodeEvent({ source: node, target: node })
      engine.dispatch(event)

      expect(subscriber).toHaveBeenCalledWith(event)
      engine.unmount()
    })

    it('should dispatch and subscribe to custom events using subscribeWith', () => {
      const engine = createDesigner()
      const subscriber = jest.fn()
      engine.subscribeWith('select:node', subscriber)

      const node = new TreeNode({ componentName: 'Test' })
      const event = new SelectNodeEvent({ source: node, target: node })
      engine.dispatch(event)

      expect(subscriber).toHaveBeenCalledWith(event)
      engine.unmount()
    })

    it('coalesces resize observer notifications and cancels pending work on detach', () => {
      const engine = createDesigner()
      const driver = new ViewportResizeDriver(engine)
      const container = document.createElement('div')
      driver.container = container
      driver.contentWindow = globalThisPolyfill

      let frame: FrameRequestCallback | undefined
      const requestFrame = jest
        .spyOn(globalThisPolyfill, 'requestAnimationFrame')
        .mockImplementation((callback) => {
          frame = callback
          return 1
        })
      const cancelFrame = jest
        .spyOn(globalThisPolyfill, 'cancelAnimationFrame')
        .mockImplementation(() => undefined)
      const dispatch = jest.spyOn(engine, 'dispatch')
      const entries = [{ target: container }] as unknown as ResizeObserverEntry[]

      driver.onResize(entries)
      driver.onResize(entries)
      expect(requestFrame).toHaveBeenCalledTimes(1)

      frame?.(0)
      expect(dispatch).toHaveBeenCalledTimes(1)

      driver.onResize(entries)
      driver.detach()
      expect(cancelFrame).toHaveBeenCalledWith(1)

      requestFrame.mockRestore()
      cancelFrame.mockRestore()
      engine.unmount()
    })
  })

  describe('TreeNode', () => {
    it('should create a tree node with props and children', () => {
      const root = new TreeNode({
        componentName: 'Root',
        props: { title: 'Root Node' },
        children: [
          {
            componentName: 'Card',
            props: { bordered: true },
            children: [
              {
                componentName: 'Input',
                props: { placeholder: 'Enter name' },
              },
            ],
          },
        ],
      })

      expect(root.componentName).toBe('Root')
      expect(root.props.title).toBe('Root Node')
      expect(root.children.length).toBe(1)

      const card = root.children[0]
      expect(card.componentName).toBe('Card')
      expect(card.parent).toBe(root)
      expect(card.children.length).toBe(1)

      const input = card.children[0]
      expect(input.componentName).toBe('Input')
      expect(input.parent).toBe(card)
    })

    it('should support append, prepend, insertAfter, insertBefore', () => {
      const root = new TreeNode({ componentName: 'Root', children: [] })
      const child1 = new TreeNode({ componentName: 'Child1' })
      const child2 = new TreeNode({ componentName: 'Child2' })
      const child3 = new TreeNode({ componentName: 'Child3' })

      root.append(child1)
      expect(root.children).toEqual([child1])

      root.prepend(child2)
      expect(root.children).toEqual([child2, child1])

      child1.insertBefore(child3)
      expect(root.children).toEqual([child2, child3, child1])

      expect(child3.parent).toBe(root)
    })

    it('should remove node from tree', () => {
      const root = new TreeNode({
        componentName: 'Root',
        children: [{ componentName: 'Child' }],
      })
      const child = root.children[0]
      child.remove()
      expect(root.children.length).toBe(0)
    })

    it('should find node by id', () => {
      const root = new TreeNode({
        componentName: 'Root',
        children: [{ componentName: 'Child' }],
      })
      const child = root.children[0]
      const found = root.findById(child.id)
      expect(found).toBe(child)
    })

    it('should clone tree node', () => {
      const root = new TreeNode({
        componentName: 'Root',
        props: { a: 1 },
        children: [{ componentName: 'Child', props: { b: 2 } }],
      })
      const cloned = root.clone()
      expect(cloned.id).not.toBe(root.id)
      expect(cloned.props).toEqual(root.props)
      expect(cloned.children.length).toBe(1)
      expect(cloned.children[0].id).not.toBe(root.children[0].id)
    })
  })

  describe('Operation & Selection', () => {
    it('should select and clear selection of tree nodes', () => {
      const engine = createDesigner()
      const workspace = engine.workbench.ensureWorkspace({ id: 'default' })
      const child1 = new TreeNode({ componentName: 'Child1' })
      const child2 = new TreeNode({ componentName: 'Child2' })
      workspace.operation.tree.append(child1)
      workspace.operation.tree.append(child2)

      workspace.operation.selection.select(child1)
      expect(workspace.operation.selection.selected).toEqual([child1.id])
      expect(workspace.operation.selection.first).toBe(child1.id)

      workspace.operation.selection.add(child2)
      expect(workspace.operation.selection.selected).toContain(child1.id)
      expect(workspace.operation.selection.selected).toContain(child2.id)

      workspace.operation.selection.clear()
      expect(workspace.operation.selection.selected).toEqual([])
      engine.unmount()
    })

    it('should handle hover operations', () => {
      const engine = createDesigner()
      const workspace = engine.workbench.ensureWorkspace({ id: 'default' })
      const child = new TreeNode({ componentName: 'Child' })
      workspace.operation.tree.append(child)

      workspace.operation.hover.setHover(child)
      expect(workspace.operation.hover.node).toBe(child)

      workspace.operation.hover.clear()
      expect(workspace.operation.hover.node).toBeNull()
      engine.unmount()
    })
  })

  describe('GlobalRegistry & Behaviors / Resources', () => {
    it('should register and retrieve designer locales', () => {
      GlobalRegistry.setDesignerLanguage('en-US')
      GlobalRegistry.registerDesignerLocales({
        'en-US': {
          sources: {
            inputs: 'Inputs',
          },
        },
      })
      expect(GlobalRegistry.getDesignerMessage('sources.inputs')).toBe('Inputs')
    })

    it('should create behavior and resource descriptors', () => {
      const behavior = createBehavior({
        name: 'CustomInput',
        selector: 'CustomInput',
        designerProps: {
          droppable: false,
        },
      })
      expect(behavior[0].name).toBe('CustomInput')

      const resource = createResource({
        title: 'Custom Button',
        elements: [{ componentName: 'Button' }],
      })
      expect(resource[0].title).toBe('Custom Button')
      expect(resource[0].elements).toEqual([{ componentName: 'Button' }])
    })
  })

  describe('Shortcut', () => {
    it('should initialize shortcut with key codes and handler', () => {
      const handler = jest.fn()
      const shortcut = new Shortcut({
        codes: [
          [KeyCode.Meta, KeyCode.Z],
          [KeyCode.Control, KeyCode.Z],
        ],
        handler,
      })
      expect(shortcut.codes.length).toBe(2)
      expect(shortcut.handler).toBe(handler)
    })
  })
})
