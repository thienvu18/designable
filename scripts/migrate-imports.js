const fs = require('fs')
const path = require('path')

const targetDirs = [
  'packages',
  'formily/antd',
  'formily/setters',
  'formily/transformer',
  'examples',
]

const root = path.resolve(__dirname, '..')

function walk(dir) {
  const list = fs.readdirSync(dir)
  for (const item of list) {
    if (['node_modules', 'dist', 'lib', 'esm', '.git'].includes(item)) continue
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (fullPath.includes(path.join('formily', 'next'))) continue
      walk(fullPath)
    } else if (/\.(ts|tsx|js|jsx|json|md)$/.test(item)) {
      if (fullPath.includes(path.join('formily', 'next'))) continue
      processFile(fullPath)
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  // 1. Rename @designable/* imports/dependencies to @thienvu18/designable-*
  content = content
    .replace(/@designable\/shared/g, '@thienvu18/designable-shared')
    .replace(/@designable\/core/g, '@thienvu18/designable-core')
    .replace(/@designable\/react-sandbox/g, '@thienvu18/designable-react-sandbox')
    .replace(/@designable\/react-settings-form/g, '@thienvu18/designable-react-settings-form')
    .replace(/@designable\/react/g, '@thienvu18/designable-react')
    .replace(/@designable\/formily-transformer/g, '@thienvu18/designable-formily-transformer')
    .replace(/@designable\/formily-setters/g, '@thienvu18/designable-formily-setters')
    .replace(/@designable\/formily-antd/g, '@thienvu18/designable-formily-antd')

  // 2. Replace active @formily/antd with @thienvu18/formily-antd-v6 (avoid duplicate v6 suffix if already done)
  content = content.replace(/(['"])@formily\/antd(?!\-v6)(['"])/g, '$1@thienvu18/formily-antd-v6$2')

  // 3. Replace AntD deep imports: from 'antd/lib/xxx' or 'antd/es/xxx' -> from 'antd'
  content = content
    .replace(/from\s+['"]antd\/(lib|es)\/([^'"]+)['"]/g, "from 'antd'")
    .replace(/import\s+['"]antd\/dist\/antd\.less['"];?/g, '')
    .replace(/import\s+['"]antd\/dist\/antd\.css['"];?/g, '')

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated: ${path.relative(root, filePath)}`)
  }
}

for (const dir of targetDirs) {
  const fullDir = path.join(root, dir)
  if (fs.existsSync(fullDir)) {
    walk(fullDir)
  }
}

console.log('Import and package rename pass complete.')
