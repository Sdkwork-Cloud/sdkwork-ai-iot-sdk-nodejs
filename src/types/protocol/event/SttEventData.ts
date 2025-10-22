import { SttState } from '../../enums';
import { BaseObject } from '../../common';
/**
 * STT (Speech-To-Text) event data
 */
export interface SttEventData extends BaseObject {
  /**
   * STT state
   */
  state: SttState;
}
