 
import { TtsState } from 'sdkwork-sdk-api-typescript';
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
