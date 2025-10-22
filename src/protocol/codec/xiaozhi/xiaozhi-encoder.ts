import {
  EventRequestProtocol,
  HelloRequestProtocol,
  ImMessageRequestProtocol,
  McpRequestProtocol,
  RequestProtocol,
} from '../../../types/protocol';
import { BaseProtocolEncoder, ProtocolEncoder } from '../encoder';

// 实现类
export class XiaozhiProtocolEncoder extends BaseProtocolEncoder {
  encode(protocol: RequestProtocol): string {
    if (this.isEventRequestProtocol(protocol)) {
      return this.encodeEvent(protocol);
    }
    const type = protocol.type;
    switch (type) {
      case 'hello':
        return this.encodeHello(protocol as HelloRequestProtocol);
      case 'mcp':
        return this.encodeMcp(protocol as McpRequestProtocol);
      case 'im':
      case 'chat':
        return this.encodeMessage(protocol as ImMessageRequestProtocol);
      default:
        throw new Error(`Unsupported protocol type: ${type}`);
    }
  }

  encodeHello(protocol: HelloRequestProtocol): string {
    const json: any = {
      type: 'hello',
      version: protocol.version,
      features: protocol.features,
      transport: 'websocket',
      audio_params: protocol.audio_params,
    };
    // 添加可选字段
    if (protocol.text) {
      json['text'] = protocol.text;
    }
    if (protocol.chat_context) {
      json['chat_context'] = protocol.chat_context;
    }
    return JSON.stringify(json);
  }
  encodeMcp(protocol: McpRequestProtocol): string {
    const json = {
      session_id: protocol.session_id,
      type: 'mcp',
      payload: this.createMcpPayload(protocol),
    };

    return JSON.stringify(json);
  }
  createMcpPayload(protocol: McpRequestProtocol): any {
    return {
      jsonrpc: '2.0',
      id: 1,
      result: {
        content: [{ type: 'text', text: 'true' }],
        isError: false,
      },
    };
  }
  encodeMessage(protocol: ImMessageRequestProtocol): string {
    const json: any = {
      type: 'im',
      session_id: protocol.session_id,
      message: protocol.message,
    };
    return JSON.stringify(json);
  }
  private isEventRequestProtocol(protocol: RequestProtocol): protocol is EventRequestProtocol {
    return 'event_type' in protocol;
  }

  encodeEvent(protocol: EventRequestProtocol): string {
    switch (protocol.type) {
      case 'abort':
        return this.encodeAbortEvent(protocol);
      case 'listen':
        return this.encodeListenEvent(protocol);
      default:
        throw new Error(`Unsupported protocol type: ${protocol.type}`);
    }
  }
  encodeAbortEvent(protocol: EventRequestProtocol): string {
    let data: any = {};
    if (protocol.payload) {
      data = protocol.payload.abort;
    }
    const eventPayload = {
      session_id: protocol.session_id,
      version: protocol.version || 1,
      type: protocol.type,
      event_type: protocol.event_type,
      ...data,
    };
    return JSON.stringify(eventPayload);
  }
  encodeListenEvent(protocol: EventRequestProtocol): string {
    let data: any = {};
    if (protocol.payload) {
      data = protocol.payload.abort;
    }
    const eventPayload = {
      session_id: protocol.session_id,
      version: protocol.version || 1,
      type: protocol.type,
      event_type: protocol.event_type,
      ...data,
    };
    return JSON.stringify(eventPayload);
  }
}
