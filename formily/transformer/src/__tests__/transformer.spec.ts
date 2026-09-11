import { ITreeNode } from '@thienvu18/designable-core'
import { transformToSchema, transformToTreeNode } from '../index'

describe('@thienvu18/designable-formily-transformer', () => {
  it('should transform TreeNode to Formily schema', () => {
    const tree: ITreeNode = {
      id: 'root-form',
      componentName: 'Form',
      props: {
        labelCol: 6,
        wrapperCol: 18,
      },
      children: [
        {
          id: 'field-input',
          componentName: 'Field',
          props: {
            name: 'username',
            title: 'Username',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          children: [],
        },
      ],
    }

    const result = transformToSchema(tree)
    expect(result.form).toEqual({
      labelCol: 6,
      wrapperCol: 18,
    })
    expect(result.schema.type).toBe('object')
    expect(result.schema.properties?.username).toBeDefined()
    expect(result.schema.properties?.username.title).toBe('Username')
    expect(result.schema.properties?.username['x-component']).toBe('Input')
  })

  it('should transform Formily schema to TreeNode', () => {
    const formilySchema = {
      form: {
        layout: 'vertical',
      },
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: 'Email Address',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
    }

    const tree = transformToTreeNode(formilySchema)
    expect(tree.componentName).toBe('Form')
    expect(tree.props.layout).toBe('vertical')
    expect(tree.children.length).toBe(1)
    expect(tree.children[0].componentName).toBe('Field')
    expect(tree.children[0].props.title).toBe('Email Address')
    expect(tree.children[0].props['x-component']).toBe('Input')
  })

  it('should support roundtrip conversion of nested schemas', () => {
    const originalSchema = {
      form: { labelCol: 8 },
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            title: 'User Profile',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            properties: {
              firstName: {
                type: 'string',
                title: 'First Name',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
        },
      },
    }

    const tree = transformToTreeNode(originalSchema)
    const convertedBack = transformToSchema(tree)

    expect(convertedBack.form).toEqual({ labelCol: 8 })
    expect(convertedBack.schema.properties?.user.title).toBe('User Profile')
    expect(
      convertedBack.schema.properties?.user.properties?.firstName.title
    ).toBe('First Name')
  })
})
