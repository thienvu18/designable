# Migrating to Designable 2.0

Designable 2.0 supports React 19, Ant Design 6, Node.js 20–24, and modern browsers. It ships CJS and ESM packages only; UMD bundles, React 16/17, Ant Design 4, and legacy AntD Less-variable customization are no longer supported.

## Package names

| 1.x package                       | 2.0 package                                 |
| --------------------------------- | ------------------------------------------- |
| `@designable/shared`              | `@thienvu18/designable-shared`              |
| `@designable/core`                | `@thienvu18/designable-core`                |
| `@designable/react`               | `@thienvu18/designable-react`               |
| `@designable/react-sandbox`       | `@thienvu18/designable-react-sandbox`       |
| `@designable/react-settings-form` | `@thienvu18/designable-react-settings-form` |
| `@designable/formily-transformer` | `@thienvu18/designable-formily-transformer` |
| `@designable/formily-setters`     | `@thienvu18/designable-formily-setters`     |
| `@designable/formily-antd`        | `@thienvu18/designable-formily-antd`        |
| `@designable/formily-next`        | No 2.0 release                              |

`formily/next` remains a preserved, private Alibaba Fusion source tree. It is not part of Designable 2.0 and is not verified with React 19.

## Install

```sh
npm uninstall @designable/shared @designable/core @designable/react @designable/react-sandbox @designable/react-settings-form @designable/formily-transformer @designable/formily-setters @designable/formily-antd
npm install react@19.2.8 react-dom@19.2.8 react-is@19.2.8 antd@6.6.3 @ant-design/icons@6.3.4 @formily/core@2.3.7 @formily/react@2.3.7 @thienvu18/formily-antd-v6@2.0.0 @thienvu18/designable-react@2.0.0
```

Install the other renamed Designable packages when their APIs are used. Use React 19-compatible types, TypeScript 5.2+, and the automatic JSX transform (`jsx: "react-jsx"`).

## Imports and rendering

```tsx | pure
// Before
import { createDesigner } from '@designable/core'
import { Designer } from '@designable/react'
import { Form } from '@formily/antd'

// After
import { createDesigner } from '@thienvu18/designable-core'
import { Designer } from '@thienvu18/designable-react'
import { Form } from '@thienvu18/formily-antd-v6'
```

Render with `createRoot`, retain a root for the lifetime of its container, and call `root.unmount()` during cleanup. Use nullable initial values for refs, for example `useRef<HTMLDivElement>(null)`. Extensions must not use legacy context, string refs, `findDOMNode`, `react-dom/test-utils`, React internals, or `ReactDOM.render`.

```tsx | pure
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
// later
root.unmount()
```

## Ant Design and styles

Update owned APIs such as `visible` to `open`, `destroyOnClose` to `destroyOnHidden`, and `bodyStyle` to `styles.body`. Use `Tabs.items` and `Collapse.items` rather than deprecated child APIs. Do not import `antd/lib`, `antd/es`, `antd/dist`, or AntD Less theme files.

Designable now uses its own CSS custom properties, including `--dn-color-primary`, `--dn-color-text`, `--dn-color-border`, `--dn-color-border-secondary`, and `--dn-color-bg-container`. Prefer wrapper classes and AntD semantic styling APIs over internal `.ant-*` DOM selectors. Verify popups and overlay positioning in both light and dark themes.

The Formily adapter is `@thienvu18/formily-antd-v6`; it replaces `@formily/antd` in both application code and peer dependencies.

## Examples

```tsx | pure
// Basic designer
const engine = createDesigner()
root.render(<Designer engine={engine}><Workbench /></Designer>)

// Settings form
<SettingsForm components={components} />

// Formily preview
<Form form={form}><Field name="title" component={[Input]} /></Form>

// Sandbox
<Sandbox scope={scope} cssAssets={assets} />
```

## Troubleshooting and release checklist

- Deduplicate React, React DOM, React Is, AntD, icons, and the Formily adapter; all must resolve to one supported version.
- Replace stale `@designable/*` and `@formily/antd` imports, then restart the bundler.
- Ensure the package CSS is loaded and replace old Less variables with Designable CSS variables.
- Check popup containers, DOM selectors, and React/AntD runtime warnings after upgrading.
- Run `corepack yarn install --immutable` and `yarn verify` before publishing.
- Install packed tarballs into a clean React 19/AntD 6 consumer, typecheck CJS/ESM imports, render, interact, and unmount.
- Do not publish `formily/next`.
