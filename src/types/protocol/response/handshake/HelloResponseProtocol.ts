import { ResponseProtocol } from '../../base'; 
import { DeviceAudioParams } from '../../../common';
import { TransportType } from 'sdkwork-sdk-api-typescript';

export interface HelloResponseProtocol extends ResponseProtocol {
  /** Transport type */
  transport?: TransportType;
  /** Audio parameters */
  audio_params?: DeviceAudioParams;
}
