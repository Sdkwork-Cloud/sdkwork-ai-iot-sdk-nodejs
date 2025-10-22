import { RequestProtocol } from '../../types/protocol';

export interface ProtocolEncoder {
  encode(protocol: RequestProtocol): string;
}
export class BaseProtocolEncoder implements ProtocolEncoder {
  public encode(protocol: RequestProtocol): string {
    return JSON.stringify(protocol);
  }
}
