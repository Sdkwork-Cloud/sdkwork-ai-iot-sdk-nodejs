import { RequestProtocol } from '../../base'; 
import { ChatFeatures, DeviceAudioParams } from '../../../common';
import { TransportType } from 'sdkwork-sdk-api-typescript';

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
