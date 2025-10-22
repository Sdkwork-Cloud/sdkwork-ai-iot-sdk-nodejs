import { Message } from '../../..';
import { ResponseProtocol } from '../../base';
export interface ImMessageResponseProtocol extends ResponseProtocol {
  /** Message object */
  message?: Message;
}
