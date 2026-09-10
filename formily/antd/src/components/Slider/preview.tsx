import React from 'react'
import { Slider as AntdSlider } from 'antd'
import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Slider: DnFC<React.ComponentProps<typeof AntdSlider>> = AntdSlider

Slider.Behavior = createBehavior({
  name: 'Slider',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Slider',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Slider),
  },
  designerLocales: AllLocales.Slider,
})

Slider.Resource = createResource({
  icon: 'SliderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Slider',
        'x-decorator': 'FormItem',
        'x-component': 'Slider',
      },
    },
  ],
})
