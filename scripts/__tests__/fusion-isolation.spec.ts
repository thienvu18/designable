import fs from 'fs'
import path from 'path'

describe('Fusion Next Isolation Guard', () => {
  const rootDir = path.resolve(__dirname, '../..')
  const nextPkgPath = path.join(rootDir, 'formily/next/package.json')
  const nextReadmePath = path.join(rootDir, 'formily/next/README.md')
  const rootPkgPath = path.join(rootDir, 'package.json')

  test('formily/next package.json must be marked private', () => {
    const nextPkg = JSON.parse(fs.readFileSync(nextPkgPath, 'utf8'))
    expect(nextPkg.private).toBe(true)
    expect(nextPkg.name).toBe('@designable/formily-next')
    expect(nextPkg.version).toBe('1.0.0-beta.45')
  })

  test('root package.json workspaces must not wildcard formily or include formily/next', () => {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'))
    const workspaces: string[] = rootPkg.workspaces || []
    expect(workspaces).not.toContain('formily/*')
    expect(workspaces).not.toContain('formily/next')
    expect(workspaces).toContain('formily/antd')
    expect(workspaces).toContain('formily/setters')
    expect(workspaces).toContain('formily/transformer')
  })

  test('formily/next README must contain legacy isolation banner', () => {
    const readme = fs.readFileSync(nextReadmePath, 'utf8')
    expect(readme).toContain('Preserved Legacy Community Source')
    expect(readme).toContain('**not** part of Designable 2.0')
  })
})
