import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { createForm } from '@formily/core'
import { FormProvider, Field } from '@formily/react'
import { createDesigner } from '@thienvu18/designable-core'
import { Designer, Workbench } from '@thienvu18/designable-react'
import {
  DataSourceSetter,
  ReactionsSetter,
  ValidatorSetter,
} from '../index'

describe('@thienvu18/designable-formily-setters', () => {
  let engine: ReturnType<typeof createDesigner>
  let form: ReturnType<typeof createForm>

  beforeEach(() => {
    engine = createDesigner()
    form = createForm()
  })

  afterEach(() => {
    engine.unmount()
  })

  it('opens, cancels, submits, and destroys the DataSourceSetter modal', async () => {
    const onChange = jest.fn()
    const value = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ]
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <DataSourceSetter
            value={value}
            onChange={onChange}
          />
        </Workbench>
      </Designer>
    )

    const btn = container.querySelector('button')
    expect(btn).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(btn!)
    })

    expect(document.querySelector('.ant-modal')).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(document.querySelector('.ant-modal .ant-btn-default')!)
    })
    expect(document.querySelector('.ant-modal')).toHaveStyle({ display: 'none' })
    expect(onChange).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.click(btn!)
    })
    await act(async () => {
      fireEvent.click(document.querySelector('.ant-modal .ant-btn-primary')!)
    })
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining(value.map((item) => expect.objectContaining(item)))
    )
    expect(document.querySelector('.ant-modal')).toHaveStyle({ display: 'none' })

    unmount()
    expect(document.querySelector('.ant-modal')).not.toBeInTheDocument()
  })

  it('should render ReactionsSetter and open modal on button click', async () => {
    const onChange = jest.fn()
    const { container, unmount } = render(
      <Designer engine={engine}>
        <Workbench>
          <ReactionsSetter onChange={onChange} />
        </Workbench>
      </Designer>
    )

    const btn = container.querySelector('button')
    expect(btn).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(btn!)
    })

    const modal = document.querySelector('.ant-modal')
    expect(modal).toBeInTheDocument()

    unmount()
  })

  it('should render ValidatorSetter inside FormProvider', () => {
    const { container, unmount } = render(
      <Designer engine={engine}>
        <FormProvider form={form}>
          <Field name="validator" component={[ValidatorSetter]} />
        </FormProvider>
      </Designer>
    )

    expect(container).toBeInTheDocument()
    unmount()
  })
})
