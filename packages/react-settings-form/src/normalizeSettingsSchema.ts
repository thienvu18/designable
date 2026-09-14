const normalizeOptions = (options: unknown[]): unknown[] =>
  options.map((option) => {
    if (option === null) return { label: '', value: null }
    if (!option || typeof option !== 'object') return option

    const normalized = { ...(option as Record<string, unknown>) }
    if (Array.isArray(normalized.options)) {
      normalized.options = normalizeOptions(normalized.options)
    }
    return normalized
  })

/**
 * Ant Design 6 expects every Select option to be an object. Formily keeps a
 * JSON-Schema null enum member as a literal null, while designable uses that
 * member for inherited/default values.
 */
export const normalizeSettingsSchema = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeSettingsSchema)
  if (!value || typeof value !== 'object') return value

  const source = value as Record<string, unknown>
  const normalized = { ...source }

  if (Array.isArray(source.enum)) normalized.enum = normalizeOptions(source.enum)
  if (Array.isArray(source.options)) {
    normalized.options = normalizeOptions(source.options)
  }
  if (Array.isArray(source.dataSource)) {
    normalized.dataSource = normalizeOptions(source.dataSource)
  }

  for (const key of [
    'properties',
    'patternProperties',
    'definitions',
    '$defs',
  ]) {
    const child = source[key]
    if (child && typeof child === 'object') {
      normalized[key] = Object.fromEntries(
        Object.entries(child as Record<string, unknown>).map(
          ([childKey, childValue]) => [
            childKey,
            normalizeSettingsSchema(childValue),
          ]
        )
      )
    }
  }

  for (const key of ['items', 'additionalProperties', 'additionalItems']) {
    if (source[key] !== undefined) {
      normalized[key] = normalizeSettingsSchema(source[key])
    }
  }

  for (const key of ['allOf', 'anyOf', 'oneOf']) {
    const alternatives = source[key]
    if (Array.isArray(alternatives)) {
      normalized[key] = alternatives.map(normalizeSettingsSchema)
    }
  }

  const componentProps = source['x-component-props']
  if (componentProps && typeof componentProps === 'object') {
    const nextProps = { ...(componentProps as Record<string, unknown>) }
    if (Array.isArray(nextProps.options)) {
      nextProps.options = normalizeOptions(nextProps.options)
    }
    if (Array.isArray(nextProps.dataSource)) {
      nextProps.dataSource = normalizeOptions(nextProps.dataSource)
    }
    normalized['x-component-props'] = nextProps
  }

  return normalized
}
