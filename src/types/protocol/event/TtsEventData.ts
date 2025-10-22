import { TtsState } from '../../enums';
import { BaseObject } from '../../common';
/**
 * TTS (Text-To-Speech) event data
 */
export interface TtsEventData extends BaseObject {
  /**
   * TTS state
   */
  state: TtsState;
}
