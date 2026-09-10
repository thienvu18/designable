import React from 'react'
import { render } from '@testing-library/react'
import { createDesigner, TreeNode } from '@thienvu18/designable-core'
import { Designer, Workbench, TreeNodeContext } from '@thienvu18/designable-react'
import {
  Form,
  FormLayout,
  FormGrid,
  Card,
  Space,
  Input,
  Select,
  Radio,
  Checkbox,
  Switch,
  DatePicker,
  TimePicker,
  NumberPicker,
  Slider,
  Rate,
  Cascader,
  TreeSelect,
  Password,
  Upload,
  Transfer,
  FormTab,
  FormCollapse,
} from '../index'

describe('@thienvu18/designable-formily-antd preview components', () => {
  let engine: ReturnType<typeof createDesigner>

  beforeEach(() => {
    engine = createDesigner()
  })

  afterEach(() => {
    engine.unmount()
  })

  it('should render Form preview component with default layout', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <Form>
            <div>Form Content</div>
          </Form>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render FormLayout, FormGrid, Card, and Space', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <FormLayout labelCol={6} wrapperCol={18}>
            <FormGrid maxColumns={3}>
              <Card title="Card Title">
                <Space>
                  <span>Item 1</span>
                  <span>Item 2</span>
                </Space>
              </Card>
            </FormGrid>
          </FormLayout>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render basic input preview components', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <Input placeholder="Input" />
          <Password placeholder="Password" />
          <NumberPicker placeholder="Number" />
          <Select placeholder="Select" />
          <TreeSelect placeholder="TreeSelect" />
          <Cascader placeholder="Cascader" />
          <DatePicker />
          <TimePicker />
          <Switch />
          <Radio value={1}>Radio</Radio>
          <Checkbox value={1}>Checkbox</Checkbox>
          <Slider defaultValue={30} />
          <Rate defaultValue={3} />
          <Upload>
            <button type="button">Upload</button>
          </Upload>
          <Transfer dataSource={[]} titles={['Source', 'Target']} />
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render FormTab with items array API in Ant Design 6', () => {
    const rootNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormTab',
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: 'Tab 1',
            },
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: 'Tab 2',
            },
          },
        },
      ],
    })

    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <TreeNodeContext.Provider value={rootNode}>
            <FormTab />
          </TreeNodeContext.Provider>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render FormCollapse with items array API in Ant Design 6', () => {
    const rootNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse',
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: 'Panel 1',
            },
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormCollapse.CollapsePanel',
            'x-component-props': {
              header: 'Panel 2',
            },
          },
        },
      ],
    })

    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <TreeNodeContext.Provider value={rootNode}>
            <FormCollapse />
          </TreeNodeContext.Provider>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should expose Behavior and Resource for all Formily preview components', () => {
    expect(Form.Behavior).toBeDefined()
    expect(Form.Resource).toBeDefined()
    expect(Input.Behavior).toBeDefined()
    expect(Input.Resource).toBeDefined()
    expect(Select.Behavior).toBeDefined()
    expect(Select.Resource).toBeDefined()
    expect(FormTab.Behavior).toBeDefined()
    expect(FormTab.Resource).toBeDefined()
    expect(FormCollapse.Behavior).toBeDefined()
    expect(FormCollapse.Resource).toBeDefined()
  })
})
