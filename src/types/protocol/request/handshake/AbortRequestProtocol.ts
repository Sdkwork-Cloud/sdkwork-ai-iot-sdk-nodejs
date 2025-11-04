import { RequestProtocol } from '../../base'; 
import { ChatFeatures, DeviceAudioParams } from '../../../common';
import { TransportType } from 'sdkwork-sdk-api-typescript';

export interface AbortRequestProtocol extends RequestProtocol {
   reason: string;
}
