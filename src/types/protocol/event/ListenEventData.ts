import { BaseObject } from '../../common';
import { ListenMode, ListenState } from '../../enums';

/**
 * Listen event data
 */
export interface ListenEventData extends BaseObject {
  /**
   * Listen mode
   */
  mode: ListenMode;

  /**
   * Listen state
   */
  state: ListenState;
}
