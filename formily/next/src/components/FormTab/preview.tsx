import { Tab } from '@alifd/next'
import { ItemProps as TabItemProps, TabProps } from '@alifd/next/types/tab'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useNodeIdProps,
  useTreeNode,
} from '@designable/react'
import { observer } from '@formily/react'
import React, { Fragment, useState } from 'react'
import { LoadTemplate } from '../../common/LoadTemplate'
import { useDropTemplate } from '../../hooks'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { matchComponent } from '../../shared'
import { createVoidFieldSchema } from '../Field'

const parseTabs = (parent: TreeNode) => {
  const tabs: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormTab.TabPane')) {
      tabs.push(node)
    }
  })
  return tabs
}

const getCorrectActiveKey = (activeKey: string, tabs: TreeNode[]) => {
  if (tabs.length === 0) return
  if (tabs.some((node) => node.id === activeKey)) return activeKey
  return tabs[tabs.length - 1].id
}

export const FormTab: DnFC<TabProps> & {
  TabPane?: React.FC<TabItemProps>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string>()
  const nodeId = useNodeIdProps()
  const node = useTreeNode()
  const designer = useDropTemplate('FormTab', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'FormTab.TabPane',
          'x-component-props': {
            title: `Unnamed Title`,
          },
        },
        children: source,
      }),
    ]
  })
  const tabs = parseTabs(node)
  const renderTabs = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <Tab
        {...props}
        activeKey={getCorrectActiveKey(activeKey, tabs)}
        onChange={(id: string) => {
          setActiveKey(id)
        }}
      >
        {tabs.map((tab) => {
          const props = tab.props['x-component-props'] || {}
          return (
            <Tab.Item
              {...props}
              style={{ ...props.style }}
              title={
                <span
                  data-content-editable="x-component-props.title"
                  data-content-editable-node-id={tab.id}
                >
                  {props.title}
                </span>
              }
              key={tab.id}
            >
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: tab.id,
                  style: {
                    padding: '20px 0',
                  },
                },
                tab.children.length ? (
                  <TreeNodeWidget node={tab} />
                ) : (
                  <DroppableWidget />
                )
              )}
            </Tab.Item>
          )
        })}
      </Tab>
    )
  }
  return (
    <div {...nodeId}>
      {renderTabs()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addTabPane'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormTab.TabPane',
                  'x-component-props': {
                    title: `Unnamed Title`,
                  },
                },
              })
              node.append(tabPane)
              setActiveKey(tabPane.id)
            },
          },
        ]}
      />
    </div>
  )
})

FormTab.TabPane = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormTab.Behavior = createBehavior(
  {
    name: 'FormTab',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTab',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every((node) => node.props['x-component'] === 'FormTab.TabPane'),
      propsSchema: createVoidFieldSchema(AllSchemas.FormTab),
    },
    designerLocales: AllLocales.FormTab,
  },
  {
    name: 'FormTab.TabPane',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTab.TabPane',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormTab',
      propsSchema: createVoidFieldSchema(AllSchemas.FormTab.TabPane),
    },
    designerLocales: AllLocales.FormTabPane,
  }
)

FormTab.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormTab',
      },
    },
  ],
})
