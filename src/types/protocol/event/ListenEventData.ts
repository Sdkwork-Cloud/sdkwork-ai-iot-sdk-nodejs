import { ListenMode, ListenState } from 'sdkwork-sdk-api-typescript';
import { BaseObject } from '../../common'; 

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
