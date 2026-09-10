import { ICustomEvent } from '@thienvu18/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class HoverNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'hover:node'
}
