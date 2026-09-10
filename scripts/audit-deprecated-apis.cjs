const { readdirSync, readFileSync, statSync } = require('fs')
const { join } = require('path')

const sourceRoots = ['packages', 'formily/antd', 'formily/setters', 'formily/transformer', 'examples']
const outputRoots = [
  'packages/shared/lib', 'packages/shared/esm',
  'packages/core/lib', 'packages/core/esm',
  'packages/react/lib', 'packages/react/esm',
  'packages/react-sandbox/lib', 'packages/react-sandbox/esm',
  'packages/react-settings-form/lib', 'packages/react-settings-form/esm',
  'formily/transformer/lib', 'formily/transformer/esm',
  'formily/setters/lib', 'formily/setters/esm',
  'formily/antd/lib', 'formily/antd/esm',
]
const emitted = process.argv.includes('--emitted')
const roots = emitted ? outputRoots : sourceRoots
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.ejs'])
const forbidden = [
  /(?:from|import|require|@import)\s*['"]~?antd\/(?:lib|es|dist)\//,
  /__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/,
  /react-dom\/test-utils/,
  /react-test-renderer/,
  /ReactDOM\.(render|hydrate|unmountComponentAtNode)/,
  /\bfindDOMNode\s*\(/,
  /\bReact\.createFactory\s*\(/,
  /\b(childContextTypes|contextTypes|getChildContext)\b/,
  /\bref\s*=\s*['"][^'"]+['"]/,
  /@formily\/antd(?!\-v6)/,
  /@designable\/(shared|core|react|react-sandbox|react-settings-form|formily-transformer|formily-setters|formily-antd)/,
  /dropdownMatchSelectWidth/,
  /\bButton\.Group\b/,
  /\bBreadcrumb\.(?:Item|Separator)\b/,
  /https?:\/\/(?:unpkg\.com|cdn\.[^/]+)\/(?:react(?:-dom)?|antd|@formily\/reactive)(?:\/|$)/,
]
const sourceOnlyForbidden = [
  /\b(?:React\.)?useRef\s*\(\s*\)/,
  /\b[A-Za-z_$][\w$]*\.defaultProps\s*=/,
]

function files(path) {
  try {
    return readdirSync(path).flatMap((entry) => {
      const target = join(path, entry)
      const stat = statSync(target)
      if (stat.isDirectory()) {
        if (['dist', 'build', 'node_modules', ...(emitted ? [] : ['esm', 'lib'])].includes(entry)) return []
        return files(target)
      }
      return extensions.has(target.slice(target.lastIndexOf('.'))) ? [target] : []
    })
  } catch (err) {
    return []
  }
}

const violations = []
for (const root of roots) {
  for (const file of files(root)) {
    const source = readFileSync(file, 'utf8')
    for (const pattern of emitted ? forbidden : [...forbidden, ...sourceOnlyForbidden]) {
      if (pattern.test(source)) {
        violations.push(`${file}: matches forbidden pattern ${pattern}`)
      }
    }
  }
}

if (violations.length) {
  console.error('Deprecated React, Ant Design, or old package APIs found:\n' + violations.join('\n'))
  process.exitCode = 1
} else {
  console.log(`✅ ${emitted ? 'Emitted-code' : 'Static'} audit passed: no deprecated React, Ant Design, or old package APIs found.`)
}
