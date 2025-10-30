import { MessageRequestProtocol } from '../MessageRequestProtocol';
import { RequestProtocol } from '../../base';
import { Message } from '../../../im'; 
import { ListenMode, ListenState } from 'sdkwork-sdk-api-typescript';

export interface ImMessageRequestProtocol extends RequestProtocol, MessageRequestProtocol {
  /** Listening mode */
  mode?: ListenMode;
  /** Current listening state */
  state?: ListenState;
  /** Text content */
  text?: string;
  /** Message object */
  message?: Message;
}
