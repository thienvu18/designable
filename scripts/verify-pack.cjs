const { execFileSync } = require('child_process')
const {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} = require('fs')
const { join } = require('path')
const { tmpdir } = require('os')

const packages = [
  '@thienvu18/designable-shared',
  '@thienvu18/designable-core',
  '@thienvu18/designable-react',
  '@thienvu18/designable-react-sandbox',
  '@thienvu18/designable-react-settings-form',
  '@thienvu18/designable-formily-transformer',
  '@thienvu18/designable-formily-setters',
  '@thienvu18/designable-formily-antd',
]

const root = process.cwd()
const workDir = mkdtempSync(join(tmpdir(), 'designable-pack-'))
const packDir = join(workDir, 'packs')
const consumerDir = join(workDir, 'consumer')
mkdirSync(packDir)
mkdirSync(consumerDir)

function run(command, args, cwd = root) {
  execFileSync(command, args, {
    cwd,
    env: npmEnvironment(),
    stdio: 'inherit',
  })
}

function npmEnvironment() {
  const environment = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !key.toLowerCase().startsWith('npm_config_')
    )
  )
  return {
    ...environment,
    npm_config_cache: join(tmpdir(), 'designable-npm-cache'),
    npm_config_audit: 'false',
    npm_config_fund: 'false',
  }
}

try {
  console.log('📦 Packing 8 Designable 2.0 packages...')
  const tarballs = packages.map((name) => {
    const output = execFileSync(
      'npm',
      ['pack', '--json', '--pack-destination', packDir, '--workspace', name],
      {
        cwd: root,
        env: npmEnvironment(),
      }
    )
    const packed = JSON.parse(output.toString())[0]
    const required = [
      'package.json',
      'lib/index.js',
      'lib/index.d.ts',
      'esm/index.js',
      'esm/index.d.ts',
      'README.md',
      'LICENSE.md',
    ]
    const paths = new Set(packed.files.map((file) => file.path))
    const missing = required.filter((file) => !paths.has(file))
    if (missing.length) {
      throw new Error(
        `${name} pack is missing required files: ${missing.join(', ')}`
      )
    }
    const forbidden = packed.files
      .map((file) => file.path)
      .filter((file) => /^(?:src|coverage|node_modules|\.cache)\//.test(file))
    if (forbidden.length) {
      throw new Error(
        `${name} pack contains unpublished source or cache files: ${forbidden.join(
          ', '
        )}`
      )
    }
    return join(packDir, packed.filename)
  })

  console.log('🏗️ Setting up clean React 19 / AntD 6 consumer...')
  writeFileSync(
    join(consumerDir, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'commonjs',
        dependencies: {
          '@ant-design/icons': '^6.3.4',
          '@formily/core': '^2.3.7',
          '@formily/react': '^2.3.7',
          '@formily/reactive': '^2.3.7',
          '@formily/reactive-react': '^2.3.7',
          '@thienvu18/formily-antd-v6': '^2.0.0',
          '@types/react': '^19.2.14',
          '@types/react-dom': '^19.2.3',
          antd: '^6.6.3',
          'happy-dom': '^17.0.0',
          react: '^19.2.8',
          'react-dom': '^19.2.8',
          'react-is': '^19.2.8',
          typescript: '5.2.2',
        },
      },
      null,
      2
    )
  )

  writeFileSync(
    join(consumerDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          noEmit: true,
          strict: true,
          skipLibCheck: true,
        },
      },
      null,
      2
    )
  )

  writeFileSync(
    join(consumerDir, 'index.tsx'),
    [
      "import React from 'react'",
      "import { createDesigner, GlobalRegistry } from '@thienvu18/designable-core'",
      "import { Designer, Workbench, StudioPanel, CompositePanel, WorkspacePanel } from '@thienvu18/designable-react'",
      "import { SettingsForm } from '@thienvu18/designable-react-settings-form'",
      "import { Form, Input } from '@thienvu18/designable-formily-antd'",
      '',
      'export const Consumer = () => {',
      '  const engine = React.useMemo(() => createDesigner(), [])',
      '  return (',
      '    <Designer engine={engine}>',
      '      <Workbench>',
      '        <StudioPanel>',
      '          <CompositePanel />',
      '          <WorkspacePanel />',
      '          <SettingsForm />',
      '        </StudioPanel>',
      '      </Workbench>',
      '    </Designer>',
      '  )',
      '}',
      '',
    ].join('\n')
  )

  writeFileSync(
    join(consumerDir, 'render.cjs'),
    [
      "const { Window } = require('happy-dom')",
      "const React = require('react')",
      "const { createRoot } = require('react-dom/client')",
      "const { flushSync } = require('react-dom')",
      "require.extensions['.less'] = () => {}",
      "const { createDesigner } = require('@thienvu18/designable-core')",
      "const { Designer, Workbench } = require('@thienvu18/designable-react')",
      '',
      'const window = new Window()',
      'global.window = window',
      'global.document = window.document',
      'global.navigator = window.navigator',
      'global.HTMLElement = window.HTMLElement',
      'global.Element = window.Element',
      'global.getComputedStyle = window.getComputedStyle',
      'global.addEventListener = window.addEventListener.bind(window)',
      'global.removeEventListener = window.removeEventListener.bind(window)',
      'global.dispatchEvent = window.dispatchEvent.bind(window)',
      'global.ResizeObserver = class { observe() {} disconnect() {} unobserve() {} }',
      'global.requestAnimationFrame = (fn) => setTimeout(fn, 0)',
      'global.cancelAnimationFrame = (id) => clearTimeout(id)',
      '',
      "const host = document.body.appendChild(document.createElement('div'))",
      'const root = createRoot(host)',
      'const engine = createDesigner()',
      '',
      'flushSync(() => {',
      '  root.render(React.createElement(Designer, { engine }, React.createElement(Workbench, null)))',
      '})',
      '',
      "if (!host.querySelector('.dn-app')) {",
      "  throw new Error('Packed Designable did not render expected DOM nodes')",
      '}',
      '',
      'root.unmount()',
      "if (host.innerHTML !== '') {",
      "  throw new Error('Packed Designable did not unmount cleanly')",
      '}',
      '',
      "console.log('✅ Packed consumer render and unmount verified successfully.')",
    ].join('\n')
  )

  console.log('📥 Installing packed tarballs into consumer...')
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-package-lock',
      '--no-progress',
      ...tarballs,
    ],
    consumerDir
  )

  console.log('🔍 Running TypeScript typecheck on consumer...')
  run(
    join(consumerDir, 'node_modules/.bin/tsc'),
    ['--project', 'tsconfig.json'],
    consumerDir
  )

  console.log('🧪 Running runtime test on packed consumer...')
  run(process.execPath, ['render.cjs'], consumerDir)

  console.log('🎉 All packed consumer checks passed!')
} finally {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true })
}
