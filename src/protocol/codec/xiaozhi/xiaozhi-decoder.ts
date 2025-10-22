import { ResponseProtocol } from '../../../types/protocol';
import { BaseProtocolDecoder, ProtocolDecoder } from '../decoder';

// 实现类
export class XiaozhiProtocolDecoder extends BaseProtocolDecoder {
  decode(content: string): ResponseProtocol {
    const jsonObj = JSON.parse(content);
    if (this.isEvent(jsonObj)) {
      return this.decodeEvent(jsonObj);
    }
    switch (jsonObj.type) {
      case 'tts':
        return this.decodeTts(jsonObj);
      default:
        return jsonObj;
    }
  }
  isEvent(jsonObj: any): boolean {
    return jsonObj.type === 'event';
  }
  decodeTts(jsonObj: any): ResponseProtocol {
    // 空实现，后续再具体实现
    throw new Error('Method not implemented.');
  }
  decodeEvent(jsonObj: any): ResponseProtocol {
    // 空实现，后续再具体实现
    throw new Error('Method not implemented.');
  }
}
