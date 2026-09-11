import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/react'
import { render } from '@testing-library/react'
import { TreeNode, createDesigner } from '@thienvu18/designable-core'
import { Designer, Workbench } from '@thienvu18/designable-react'
import {
  BorderRadiusStyleSetter,
  BorderStyleSetter,
  BoxStyleSetter,
  ColorInput,
  CornerInput,
  DisplayStyleSetter,
  FlexStyleSetter,
  FoldItem,
  FontStyleSetter,
  InputItems,
  SettingsForm,
  SizeInput,
  ValueInput,
} from '../index'

describe('@thienvu18/designable-react-settings-form', () => {
  let engine: ReturnType<typeof createDesigner>
  let form: ReturnType<typeof createForm>

  beforeEach(() => {
    engine = createDesigner()
    form = createForm()
  })

  afterEach(() => {
    engine.unmount()
  })

  it('should render SettingsForm in empty state when no node is selected', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <SettingsForm />
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render SettingsForm with propsSchema when a node is selected', () => {
    const workspace = engine.workbench.ensureWorkspace({ id: 'default' })
    const node = new TreeNode({
      componentName: 'Input',
      props: { placeholder: 'Type here' },
      designerProps: {
        propsSchema: {
          type: 'object',
          properties: {
            placeholder: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    })
    workspace.operation.tree.append(node)
    workspace.operation.selection.select(node)

    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <SettingsForm />
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  describe('style setters & inputs with Formily context', () => {
    it('should render BoxStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="box" component={[BoxStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render BorderRadiusStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="borderRadius" component={[BorderRadiusStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render BorderStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="border" component={[BorderStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render ColorInput', () => {
      const onChange = jest.fn()
      const { container, unmount } = render(
        <ColorInput value="#ff0000" onChange={onChange} />
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render CornerInput', () => {
      const onChange = jest.fn()
      const { container, unmount } = render(
        <CornerInput value="10px" onChange={onChange} />
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render DisplayStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="display" component={[DisplayStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render FlexStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="flex" component={[FlexStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render FontStyleSetter inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <Field name="font" component={[FontStyleSetter]} />
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render FoldItem inside FormProvider', () => {
      const { container, unmount } = render(
        <Designer engine={engine}>
          <FormProvider form={form}>
            <FoldItem label="Fold Label">
              <div>Fold Body</div>
            </FoldItem>
          </FormProvider>
        </Designer>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render InputItems and SizeInput', () => {
      const { container, unmount } = render(
        <InputItems vertical>
          <InputItems.Item>
            <SizeInput value="100%" />
          </InputItems.Item>
        </InputItems>
      )
      expect(container).toBeInTheDocument()
      unmount()
    })

    it('should render ValueInput', () => {
      const onChange = jest.fn()
      const { container, unmount } = render(
        <ValueInput value="100px" onChange={onChange} />
      )
      expect(container).toBeInTheDocument()
      unmount()
    })
  })
})
