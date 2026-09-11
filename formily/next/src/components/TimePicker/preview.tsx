import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
import { TimePicker as FormilyTimePicker } from '@formily/next'
import React from 'react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { createFieldSchema } from '../Field'

export const TimePicker: DnFC<React.ComponentProps<typeof FormilyTimePicker>> =
  FormilyTimePicker

TimePicker.Behavior = createBehavior({
  name: 'TimePicker',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'TimePicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TimePicker),
  },
  designerLocales: AllLocales.TimePicker,
})

TimePicker.Resource = createResource({
  icon: 'TimePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'TimePicker',
        'x-decorator': 'FormItem',
        'x-component': 'TimePicker',
      },
    },
  ],
})
