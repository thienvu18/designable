import { render, screen } from '@testing-library/react'
import { TreeNode, createDesigner } from '@thienvu18/designable-core'
import { StrictMode } from 'react'
import {
  CompositePanel,
  Designer,
  HistoryWidget,
  IconWidget,
  NodePathWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  TextWidget,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  Workbench,
  WorkspacePanel,
  useDesigner,
  useWorkbench,
  useWorkspace,
} from '../index'

describe('@thienvu18/designable-react', () => {
  let engine: ReturnType<typeof createDesigner>

  beforeEach(() => {
    engine = createDesigner()
  })

  afterEach(() => {
    engine.unmount()
  })

  it('should render Designer and Workbench under React 19 createRoot and StrictMode', () => {
    const TestComponent = () => {
      const designer = useDesigner()
      const workbench = useWorkbench()
      const workspace = useWorkspace()

      return (
        <div>
          <span data-testid="designer-status">
            {designer ? 'active' : 'inactive'}
          </span>
          <span data-testid="workbench-status">
            {workbench ? 'active' : 'inactive'}
          </span>
          <span data-testid="workspace-status">
            {workspace ? 'active' : 'inactive'}
          </span>
        </div>
      )
    }

    const { unmount } = render(
      <StrictMode>
        <Designer engine={engine}>
          <Workbench>
            <TestComponent />
          </Workbench>
        </Designer>
      </StrictMode>
    )

    expect(screen.getByTestId('designer-status')).toHaveTextContent('active')
    expect(screen.getByTestId('workbench-status')).toHaveTextContent('active')
    expect(screen.getByTestId('workspace-status')).toHaveTextContent('active')

    // Clean unmount check
    unmount()
  })

  it('should render StudioPanel layout cleanly', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <StudioPanel>
            <WorkspacePanel>
              <ToolbarPanel>
                <div>Toolbar Content</div>
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  {() => <div data-testid="canvas-content">Canvas Content</div>}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
            <SettingsPanel title="panels.PropertySettings">
              <div>Settings Content</div>
            </SettingsPanel>
          </StudioPanel>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Toolbar Content')).toBeInTheDocument()
    expect(screen.getByTestId('canvas-content')).toBeInTheDocument()
    expect(screen.getByText('Settings Content')).toBeInTheDocument()

    unmount()
  })

  it('should render CompositePanel with ResourceWidget and HistoryWidget', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget title="sources.Inputs" sources={[]} />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
        </Workbench>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })

  it('should render TextWidget and IconWidget without errors', () => {
    const { unmount } = render(
      <Designer engine={engine}>
        <TextWidget>Hello World</TextWidget>
        <IconWidget infer="Help" />
      </Designer>
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
    unmount()
  })

  it('renders the selected node path with Ant Design Breadcrumb items', () => {
    const workspace = engine.workbench.ensureWorkspace({ id: 'index' })
    const node = new TreeNode({
      componentName: 'Input',
      props: { title: 'Selected input' },
    })
    workspace.operation.tree.append(node)
    workspace.operation.selection.select(node)

    const { unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <NodePathWidget />
        </Workbench>
      </Designer>
    )

    expect(screen.getByText('Input')).toBeInTheDocument()
    expect(document.querySelectorAll('.ant-breadcrumb-item')).toHaveLength(2)
    unmount()
  })
})
