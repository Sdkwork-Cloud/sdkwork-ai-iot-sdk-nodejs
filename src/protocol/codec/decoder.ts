import { ResponseProtocol } from '../../types/protocol';

export interface ProtocolDecoder {
  decode(content: string): ResponseProtocol;
}

export class BaseProtocolDecoder implements ProtocolDecoder {
  public decode(content: string): ResponseProtocol {
    return JSON.parse(content);
  }
}
