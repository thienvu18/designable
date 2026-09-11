import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import { Switch as AntdSwitch } from 'antd'
import React from 'react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { createFieldSchema } from '../Field'

export const Switch: DnFC<React.ComponentProps<typeof AntdSwitch>> = AntdSwitch

Switch.Behavior = createBehavior({
  name: 'Switch',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Switch',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Switch),
  },
  designerLocales: AllLocales.Switch,
})

Switch.Resource = createResource({
  icon: 'SwitchSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'boolean',
        title: 'Switch',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
      },
    },
  ],
})
