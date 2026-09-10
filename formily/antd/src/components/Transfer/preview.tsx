import { Transfer as AntdTransfer } from 'antd'
import { Transfer as FormilyTransfer } from '@thienvu18/formily-antd-v6'
import { useField } from '@formily/react'
import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Transfer: DnFC<React.ComponentProps<typeof FormilyTransfer>> = (
  props
) => {
  const field = useField()
  if (!field) {
    return (
      <AntdTransfer
        {...(props as React.ComponentProps<typeof AntdTransfer>)}
        render={props.render || ((item: any) => item?.title ?? null)}
        dataSource={props.dataSource || []}
      />
    )
  }
  return <FormilyTransfer {...props} />
}

Transfer.Behavior = createBehavior({
  name: 'Transfer',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Transfer',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Transfer),
  },
  designerLocales: AllLocales.Transfer,
})

Transfer.Resource = createResource({
  icon: 'TransferSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Transfer',
        'x-decorator': 'FormItem',
        'x-component': 'Transfer',
      },
    },
  ],
})
