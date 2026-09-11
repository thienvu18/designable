import { copy } from 'fs-extra'
import glob from 'glob'

export interface CopyBaseOptions {
  esStr?: string
  libStr?: string
}

export const runCopy = (
  opts?: CopyBaseOptions & { resolveForItem?: (filename: string) => unknown }
) => {
  return new Promise<void>((resolve, reject) => {
    glob('./src/**/*', (err, files) => {
      if (err) {
        return reject(err)
      }

      const all: Promise<void>[] = []

      for (let i = 0; i < files.length; i += 1) {
        const filename = files[i]

        opts?.resolveForItem?.(filename)

        if (/\.(less|scss|css|png|jpg|jpeg|gif|svg)$/.test(filename)) {
          all.push(copy(filename, filename.replace(/^(\.\/)?src\//, 'esm/')))
          all.push(copy(filename, filename.replace(/^(\.\/)?src\//, 'lib/')))
        }
      }

      Promise.all(all)
        .then(() => resolve())
        .catch(reject)
    })
  })
}
