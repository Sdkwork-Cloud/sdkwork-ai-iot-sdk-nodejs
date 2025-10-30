import { IotEventType } from 'sdkwork-sdk-api-typescript';
import { BaseResponseProtocol } from '../../base'; 
import { EventPayload } from '../../event';
export interface EventResponseProtocol extends BaseResponseProtocol {
  /** Event type */
  event_type?: IotEventType;
  /** Event data */
  payload?: EventPayload;
}
