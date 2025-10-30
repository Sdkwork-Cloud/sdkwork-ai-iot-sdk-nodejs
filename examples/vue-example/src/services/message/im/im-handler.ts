import type { Ref } from 'vue'
import { 
  SdkworkAIotConfig,  
  ChatFeatures, 
  DeviceAudioParams,
  Message as SDKMessage,
  ConnectionStateEnum,
  IotEventType,
  EventPayload,
  RequestProtocol,
  ConnectionState
} from 'sdkwork-ai-iot-sdk'
import type { MessageHandler, MessageHandlerType } from '../types'
import { ChatContext } from 'sdkwork-sdk-api-typescript'

/**
 * IM消息处理器类定义
 * 基于即时消息协议实现的消息处理器
 */
export class ImMessageHandler implements MessageHandler {
  readonly name: string = 'ImMessageHandler'
  private connectionState: ConnectionState
  
  constructor(config: SdkworkAIotConfig) {
    this.connectionState = {
      state: ConnectionStateEnum.CONNECTED,  
      connected: false
    }
  }

  initialize(): Promise<void> {
    throw new Error('initialize方法实现待确认后添加')
  }

  disconnect(): void {
    throw new Error('disconnect方法实现待确认后添加')
  }

  startListening(): void {
    throw new Error('startListening方法实现待确认后添加')
  }

  stopListening(): void {
    throw new Error('stopListening方法实现待确认后添加')
  }

  send(message: SDKMessage | string, options: ChatContext): void {
    throw new Error('send方法实现待确认后添加')
  }

  sendAudioStream(audioData: ArrayBuffer|Blob, protocolVersion: number, options: ChatContext): void {
    throw new Error('sendAudioStream方法实现待确认后添加')
  }

  sendHello(content: string, options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }): void {
    throw new Error('sendHello方法实现待确认后添加')
  }

  sendEvent(type: IotEventType, payload: EventPayload): void {
    throw new Error('sendEvent方法实现待确认后添加')
  }

  sendProtocol(protocol: RequestProtocol): void {
    throw new Error('sendProtocol方法实现待确认后添加')
  }

  getConnectionState(): ConnectionState {
    throw new Error('getConnectionState方法实现待确认后添加')
  }

  isConnected(): boolean {
    throw new Error('isConnected方法实现待确认后添加')
  }

  onEvent(eventType: IotEventType, callback: (event: any) => void): void {
    throw new Error('onEvent方法实现待确认后添加')
  }

  onMessage(callback: (data: SDKMessage) => void): void {
    throw new Error('onMessage方法实现待确认后添加')
  }

  onAudioStream(callback: (data: SDKMessage) => void): void {
    throw new Error('onAudioStream方法实现待确认后添加')
  }

  onData(callback: (data: SDKMessage) => void): void {
    throw new Error('onData方法实现待确认后添加')
  }

  onToolCall(callback: (data: { name: string; args: Record<string, any> }) => void): void {
    throw new Error('onToolCall方法实现待确认后添加')
  }

  offData(callback: (data: SDKMessage) => void): void {
    throw new Error('offData方法实现待确认后添加')
  }

  offEvent(eventType: IotEventType, callback: (event: any) => void): void {
    throw new Error('offEvent方法实现待确认后添加')
  }

  onError(callback: (error: Error) => void): void {
    throw new Error('onError方法实现待确认后添加')
  }

  offError(callback: (error: Error) => void): void {
    throw new Error('offError方法实现待确认后添加')
  }

  destroy(): Promise<void> {
    throw new Error('destroy方法实现待确认后添加')
  }
}