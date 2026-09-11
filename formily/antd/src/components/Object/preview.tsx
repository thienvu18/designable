import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import React from 'react'
import { Container } from '../../common/Container'
import { AllLocales } from '../../locales'
import { createFieldSchema } from '../Field'

export const ObjectContainer: DnFC<React.ComponentProps<typeof Container>> =
  Container
ObjectContainer.Behavior = createBehavior({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props.type === 'object',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(),
  },
  designerLocales: AllLocales.ObjectLocale,
})

ObjectContainer.Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
      },
    },
  ],
})
