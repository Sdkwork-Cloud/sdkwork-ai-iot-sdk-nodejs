import { IotEventType, TtsState } from 'sdkwork-sdk-api-typescript';
import { EventResponseProtocol, ResponseProtocol } from '../../../types/protocol';
import { BaseProtocolDecoder, ProtocolDecoder } from '../decoder';

// 实现类
export class XiaozhiProtocolDecoder extends BaseProtocolDecoder {
  decode(content: string): ResponseProtocol {
    const jsonObj = JSON.parse(content);
    if (this.isEvent(jsonObj)) {
      return this.decodeEvent(jsonObj);
    }
    return this.decodeMessage(jsonObj);
  }
  isEvent(jsonObj: any): boolean {
    return jsonObj.type === 'event' || jsonObj.type === 'tts' || jsonObj.type === 'stt';
  }
  decodeEvent(data: any): ResponseProtocol {
    if (data.type === 'tts') {
      return this.decodeTtsEvent(data);
    }
    if (data.type === 'stt') {
      return this.decodeSttEvent(data);
    }
    return data
  }
  decodeSttEvent(data: any): ResponseProtocol {
    return data
  }
  decodeTtsEvent(data: any): ResponseProtocol {
    const { state } = data
    let event: EventResponseProtocol = {
      event_type: IotEventType.TTS_START,
      type: 'tts',
      metadata: data.metadata,
    }
    switch (state) {
      case 'start':
        event.event_type = IotEventType.TTS_START
        event.payload = {
          text: data.text,
          tts: {
            state: TtsState.start
          }
        }
        break;
      case 'stop':
        event.event_type = IotEventType.TTS_STOP
        event.payload = {
          text: data.text,
          tts: {
            state: TtsState.stop
          }
        }
        break;
      case 'sentence_start':
        event.event_type = IotEventType.TTS_SENTENCE_START
        event.payload = {
          text: data.text,
          tts: {
            state: TtsState.sentence_start
          }
        }
        break;
      default:
        break;
    }
    return event;

  }
  decodeMessage(data: any): ResponseProtocol {
    return data
  }
}