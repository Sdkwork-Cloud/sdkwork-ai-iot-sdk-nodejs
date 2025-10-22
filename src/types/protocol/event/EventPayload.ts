import { AbortEventData } from './AbortEventData';
import { TtsEventData } from './TtsEventData';
import { SttEventData } from './SttEventData';
import { ListenEventData } from './ListenEventData';
import { ConnectRegisterEventData } from './ConnectRegisterEventData';
import { BaseObject } from '../../common';

/**
 * Event payload
 */
export interface EventPayload extends BaseObject {
  /**
   * Text content
   */
  text?: string;

  /**
   * Additional data
   */
  data?: Record<string, any>;

  /**
   * Abort event data
   */
  abort?: AbortEventData;

  /**
   * TTS event data
   */
  tts?: TtsEventData;

  /**
   * STT event data
   */
  stt?: SttEventData;

  /**
   * Listen event data
   */
  listen?: ListenEventData;

  /**
   * Connect register event data
   */
  connect_register?: ConnectRegisterEventData;
}
