import React from 'react'
import { Upload as AntdUpload, Button } from 'antd'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons'
import { Upload as FormilyUpload } from '@thienvu18/formily-antd-v6'
import { useField } from '@formily/react'
import { createBehavior, createResource } from '@thienvu18/designable-core'
import { DnFC } from '@thienvu18/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Upload: DnFC<React.ComponentProps<typeof FormilyUpload>> & {
  Dragger?: React.FC<any>
} = (props: any) => {
  const field = useField()
  if (!field) {
    const placeholder =
      props.listType !== 'picture-card' ? (
        <Button icon={<UploadOutlined />}>{props.textContent || 'Upload'}</Button>
      ) : null
    return <AntdUpload {...props}>{props.children || placeholder}</AntdUpload>
  }
  return <FormilyUpload {...props} />
}

Upload.Dragger = (props: any) => {
  const field = useField()
  if (!field) {
    return (
      <AntdUpload.Dragger {...props}>
        {props.children || (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            {props.textContent && (
              <p className="ant-upload-text">{props.textContent}</p>
            )}
          </>
        )}
      </AntdUpload.Dragger>
    )
  }
  return <FormilyUpload.Dragger {...props} />
}

Upload.Behavior = createBehavior(
  {
    name: 'Upload',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Upload',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload),
    },
    designerLocales: AllLocales.Upload,
  },
  {
    name: 'Upload.Dragger',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Upload.Dragger',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload.Dragger),
    },
    designerLocales: AllLocales.UploadDragger,
  }
)

Upload.Resource = createResource(
  {
    icon: 'UploadSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Upload',
          'x-decorator': 'FormItem',
          'x-component': 'Upload',
          'x-component-props': {
            textContent: 'Upload',
          },
        },
      },
    ],
  },
  {
    icon: 'UploadDraggerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Drag Upload',
          'x-decorator': 'FormItem',
          'x-component': 'Upload.Dragger',
          'x-component-props': {
            textContent: 'Click or drag file to this area to upload',
          },
        },
      },
    ],
  }
)
