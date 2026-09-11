import React, { useRef } from 'react'
import { ColorPicker, Input } from 'antd'
import { usePrefix } from '@thienvu18/designable-react'
import './styles.less'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}

export const ColorInput: React.FC<IColorInputProps> = (props) => {
  const container = useRef<HTMLDivElement>(null)
  const prefix = usePrefix('color-input')
  const color = props.value as string
  return (
    <div ref={container} className={prefix}>
      <Input
        value={props.value}
        onChange={(e) => {
          props.onChange?.(e.target.value)
        }}
        placeholder="Color"
        prefix={
          <ColorPicker
            value={color}
            autoAdjustOverflow
            getPopupContainer={() => container.current || document.body}
            onChange={(nextColor) => {
              const { r, g, b, a } = nextColor.toRgb()
              props.onChange?.(`rgba(${r},${g},${b},${a})`)
            }}
          >
            <div
              className={prefix + '-color-tips'}
              style={{
                backgroundColor: color,
              }}
            ></div>
          </ColorPicker>
        }
      />
    </div>
  )
}
