import { RequestProtocol } from '../../base';
import { TransportType } from '../../../enums';
import { ChatFeatures, DeviceAudioParams } from '../../../common';

export interface HelloRequestProtocol extends RequestProtocol {
  /** Transport type */
  transport?: TransportType;
  /** Chat features */
  features?: ChatFeatures;
  /**
   *  send text to say hello
   */
  text?: string;
  /** Audio parameters */
  audio_params?: DeviceAudioParams;
}
