import { ProtocolType } from '@/types';
import { ProtocolDecoder } from './decoder';
import { ProtocolEncoder } from './encoder';
import { XiaozhiProtocolDecoder } from './xiaozhi/xiaozhi-decoder';
import { XiaozhiProtocolEncoder } from './xiaozhi/xiaozhi-encoder';
import { SDKWorkProtocolDecoderImpl } from './sdkwork/sdkwork-decoder';
import { SDKWorkProtocolEncoder } from './sdkwork/sdkwork-encoder';

export class ProtocolCodecFactory {
  static createDecoder(protocolType: ProtocolType): ProtocolDecoder {
    switch (protocolType) {
      case 'xiaozhi':
        return new XiaozhiProtocolDecoder();
      case 'sdkwork':
        return new SDKWorkProtocolDecoderImpl();
      default:
        throw new Error(`Unsupported protocol type: ${protocolType}`);
    }
  }

  static createEncoder(protocolType: ProtocolType): ProtocolEncoder {
    switch (protocolType) {
      case 'xiaozhi':
        return new XiaozhiProtocolEncoder();
      case 'sdkwork':
        return new SDKWorkProtocolEncoder();
      default:
        throw new Error(`Unsupported protocol type: ${protocolType}`);
    }
  }
}
