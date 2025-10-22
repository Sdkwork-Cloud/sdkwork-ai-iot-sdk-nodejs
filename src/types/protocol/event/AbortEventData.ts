import { BaseObject } from '../../common';

/**
 * Abort event data
 */
export interface AbortEventData extends BaseObject {
  /**
   * Reason for abort
   */
  reason: string;
}
