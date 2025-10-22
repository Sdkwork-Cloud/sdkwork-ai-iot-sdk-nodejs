import { BaseResponseProtocol } from '../../base';
import { IotEventType } from '../../../enums';
import { EventPayload } from '../../event';
export interface EventResponseProtocol extends BaseResponseProtocol {
  /** Event type */
  event_type?: IotEventType;
  /** Event data */
  payload?: EventPayload;
}
