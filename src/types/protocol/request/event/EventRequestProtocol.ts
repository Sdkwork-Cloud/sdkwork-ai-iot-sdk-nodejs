import { BaseRequestProtocol, EventProtocol } from '../../base';
import { IotEventType } from '../../../enums';
import { EventPayload } from '../../event';

export interface EventRequestProtocol extends BaseRequestProtocol, EventProtocol {
  /** Event type */
  event_type?: IotEventType;
  /** Event data */
  payload?: EventPayload;
}
