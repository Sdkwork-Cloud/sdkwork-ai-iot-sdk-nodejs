import {
  EventRequestProtocol,
  HelloRequestProtocol,
  ImMessageRequestProtocol,
  RequestProtocol,
} from '../../../types/protocol';
import { XiaozhiProtocolEncoder } from '../xiaozhi';

// Implementation class
export class SDKWorkProtocolEncoder extends XiaozhiProtocolEncoder {
  encode(protocol: RequestProtocol): string {
    // Empty implementation, to be implemented later
    throw new Error('Method not implemented.');
  }
}
