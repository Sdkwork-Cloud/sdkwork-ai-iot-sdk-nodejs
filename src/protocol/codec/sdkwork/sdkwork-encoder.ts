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
    return JSON.stringify(protocol);
  }
}
