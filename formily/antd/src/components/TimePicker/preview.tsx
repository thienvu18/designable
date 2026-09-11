import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import { TimePicker as FormilyTimePicker } from '@thienvu18/formily-antd-v6'
import React from 'react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { createFieldSchema } from '../Field'

export const TimePicker: DnFC<React.ComponentProps<typeof FormilyTimePicker>> =
  FormilyTimePicker

TimePicker.Behavior = createBehavior(
  {
    name: 'TimePicker',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TimePicker',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker),
    },
    designerLocales: AllLocales.TimePicker,
  },
  {
    name: 'TimePicker.RangePicker',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TimePicker.RangePicker',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker.RangePicker),
    },
    designerLocales: AllLocales.TimeRangePicker,
  }
)

TimePicker.Resource = createResource(
  {
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
  },
  {
    icon: 'TimeRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'TimeRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'TimePicker.RangePicker',
        },
      },
    ],
  }
)
