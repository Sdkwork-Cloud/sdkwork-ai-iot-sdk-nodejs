import { ResponseProtocol } from '../../base';
import { TransportType } from '../../../enums';
import { DeviceAudioParams } from '../../../common';

export interface HelloResponseProtocol extends ResponseProtocol {
  /** Transport type */
  transport?: TransportType;
  /** Audio parameters */
  audio_params?: DeviceAudioParams;
}
