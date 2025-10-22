import { RequestProtocol } from '../../base';

export interface IotThingUpdateRequestProtocol extends RequestProtocol {
  /** Update flag */
  update?: boolean;
}
