import { Operation } from '@thienvu18/designable-core'
import { onFieldInputValueChange } from '@formily/core'

let timeRequest = null

export const useSnapshot = (operation: Operation) => {
  onFieldInputValueChange('*', () => {
    clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
    }, 1000)
  })
}
