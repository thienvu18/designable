import { GlobalRegistry, IDesignerRegistry } from '@thienvu18/designable-core'
import { globalThisPolyfill } from '@thienvu18/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
