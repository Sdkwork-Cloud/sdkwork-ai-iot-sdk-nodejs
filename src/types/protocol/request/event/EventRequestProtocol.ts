import { IotEventType } from 'sdkwork-sdk-api-typescript';
import { BaseRequestProtocol, EventProtocol } from '../../base'; 
import { EventPayload } from '../../event';

export interface EventRequestProtocol extends BaseRequestProtocol, EventProtocol {
  /** Event type */
  event_type?: IotEventType;
  /** Event data */
  payload?: EventPayload;
}
