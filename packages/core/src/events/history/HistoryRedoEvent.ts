import { ICustomEvent } from '@thienvu18/designable-shared'
import { AbstractHistoryEvent } from './AbstractHistoryEvent'

export class HistoryUndoEvent
  extends AbstractHistoryEvent
  implements ICustomEvent
{
  type = 'history:undo'
}
