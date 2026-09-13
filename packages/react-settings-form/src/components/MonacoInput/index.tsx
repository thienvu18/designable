import { IconWidget, TextWidget, usePrefix } from '@thienvu18/designable-react'
import { Input, Tooltip } from 'antd'
import cls from 'classnames'
import React, { useEffect, useState } from 'react'
import './styles.less'

/**
 * Offline replacement for the former Monaco-backed editor.
 *
 * The settings form is embedded in desktop applications where loading an
 * editor worker or formatter from a CDN is not acceptable. Keep the public
 * value/onChange surface used by the setters, but use the host's native
 * textarea instead. `language`, `options`, and `extraLib` are accepted for
 * compatibility and intentionally have no network/runtime effect.
 */
export interface MonacoInputProps {
  className?: string
  style?: React.CSSProperties
  language?: string
  defaultLanguage?: string
  width?: number | string
  height?: number | string
  helpLink?: string | boolean
  helpCode?: string
  helpCodeViewWidth?: number | string
  extraLib?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  options?: Record<string, unknown>
  onChange?: (value: string) => void
}

export type Monaco = never

const formatInitialValue = (language: string | undefined, value: string) => {
  if (language !== 'json' || !value.trim()) return value
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

export const MonacoInput: React.FC<MonacoInputProps> = ({
  className,
  style,
  language,
  defaultLanguage,
  width,
  height,
  helpLink,
  helpCode,
  helpCodeViewWidth,
  value,
  defaultValue,
  extraLib,
  options,
  onChange,
  ...props
}) => {
  const prefix = usePrefix('monaco-input')
  void extraLib
  void options
  const [content, setContent] = useState(() =>
    formatInitialValue(language || defaultLanguage, value ?? defaultValue ?? '')
  )

  useEffect(() => {
    if (value !== undefined) setContent(value)
  }, [value])

  const helpHref = typeof helpLink === 'string' ? helpLink : undefined
  const input = (
    <Input.TextArea
      {...props}
      value={content}
      onChange={(event) => {
        const next = event.target.value
        setContent(next)
        onChange?.(next)
      }}
      autoSize={false}
      style={{
        height: '100%',
        resize: 'none',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    />
  )

  return (
    <div
      className={cls(prefix, className, 'loaded')}
      style={{ ...style, width, height }}
    >
      {helpHref && (
        <Tooltip
          title={<TextWidget token="SettingComponents.MonacoInput.helpDocument" />}
        >
          <div className={prefix + '-helper'}>
            <a target="_blank" href={helpHref} rel="noreferrer">
              <IconWidget infer="Help" />
            </a>
          </div>
        </Tooltip>
      )}
      <div className={prefix + '-view'}>{input}</div>
      {helpCode && (
        <pre
          className={prefix + '-help-code'}
          style={{ width: helpCodeViewWidth || '50%' }}
        >
          <code>{helpCode}</code>
        </pre>
      )}
    </div>
  )
}
