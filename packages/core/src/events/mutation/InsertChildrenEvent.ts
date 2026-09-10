import { ICustomEvent } from '@thienvu18/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class InsertChildrenEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'insert:children'
}
