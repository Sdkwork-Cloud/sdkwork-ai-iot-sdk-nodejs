import { ResponseProtocol } from '../../base';

export interface CustomMessageResponseProtocol extends ResponseProtocol {
  /** Custom content */
  content?: string;
}
