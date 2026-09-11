/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import NpmImport from 'less-plugin-npm-import'
import { OutputOptions, rollup, RollupOptions } from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'

export const getRollupBasePlugin = () => [
  resolve(),
  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
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
]

export const build = async (
  rollupConfig: Omit<RollupOptions, 'output'> & { output: OutputOptions }
) => {
  const { output, ...input } = rollupConfig
  const bundle = await rollup(input)

  return bundle.write(output as OutputOptions)
}
