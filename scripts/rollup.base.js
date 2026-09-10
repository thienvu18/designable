import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import NpmImport from 'less-plugin-npm-import'
import path from 'path'

const presets = () => {
  return [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
    }),
    resolve(),
    postcss({
      extract: true,
      minimize: true,
      // extensions: ['.css', '.less', '.sass'],
      use: {
        less: {
          plugins: [new NpmImport({ prefix: '~' })],
          javascriptEnabled: true,
        },
        sass: {},
        stylus: {},
      },
    }),
    commonjs(),
  ]
}

const inputFilePath = path.join(process.cwd(), 'src/index.ts')

export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '')
    }

    return code
  },
})

export default (...plugins) => [
  {
    input: 'src/index.ts',
    output: [
      { format: 'cjs', file: 'lib/index.js', exports: 'named' },
      { format: 'es', file: 'esm/index.js' },
    ],
    plugins: [...presets(), ...plugins],
  },
]
