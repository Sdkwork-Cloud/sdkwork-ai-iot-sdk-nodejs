import { ResponseProtocol } from '../../base';

export interface SttMessageResponseProtocol extends ResponseProtocol {
  /** Recognized text */
  text?: string;
}
