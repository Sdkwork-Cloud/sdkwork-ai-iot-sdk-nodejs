import type { Ref } from 'vue'
import { ref } from 'vue'
import {
  SdkworkAIotConfig, 
  ChatFeatures,
  DeviceAudioParams,
  Message as SDKMessage,
  ConnectionStateEnum,
  IotEventType,
  EventPayload,
  RequestProtocol,
  ConnectionState,
  AudioStreamPayload,
  DataPayload
} from 'sdkwork-ai-iot-sdk'
import { ChatCompletionChunk, ChatCompletionParam, ChatCompletionRole, ChatContext } from 'sdkwork-sdk-api-typescript'
import type { MessageHandler } from '../types'
import type { MessageEventEmitter, MessageEventAdapter } from '../event'
import { MessageEventType } from '../event'
import { AgentChatService } from '@/services/src'
import { MessageBuilder } from '../builder'
import { SdkStream } from 'sdkwork-commons-typescript'

/**
 * SSE消息处理器类定义
 * 基于Server-Sent Events实现的消息处理器
 */
export class SseMessageHandler implements MessageHandler {
  readonly name: string = 'SseMessageHandler'
  private connectionState: ConnectionState

  private eventEmitter: MessageEventEmitter
  private eventAdapter: MessageEventAdapter
  private config: SdkworkAIotConfig

  constructor(config: SdkworkAIotConfig, eventEmitter: MessageEventEmitter, eventAdapter: MessageEventAdapter) {
    this.config = config
    this.eventEmitter = eventEmitter
    this.eventAdapter = eventAdapter
    this.connectionState = {
      state: ConnectionStateEnum.DISCONNECTED,
      connected: false
    }
  }

  async initialize(): Promise<void> {
    try {
      // SSE连接初始化逻辑
      await this.setupSseConnection()

      // 设置事件监听器
      this.setupEventListeners()

      // 更新连接状态
      this.updateConnectionState({
        state: ConnectionStateEnum.CONNECTED,
        connected: true
      })

    } catch (error) {
      this.eventEmitter.emit(this.eventAdapter.adaptErrorOccurred(error as Error))
      throw error
    }
  }

  disconnect(): void {
    // SSE断开连接逻辑
    this.updateConnectionState({
      state: ConnectionStateEnum.DISCONNECTED,
      connected: false
    })
  }

  startListening(): void {
    // SSE开始监听逻辑
    console.log('SSE开始监听')
  }

  stopListening(): void {
    // SSE停止监听逻辑
    console.log('SSE停止监听')
  }

  async send(message: SDKMessage | string, options: ChatContext): Promise<void> {
    // SSE发送消息逻辑
    console.log('SSE发送消息:', message)
    const chatService: AgentChatService = new AgentChatService()
    let data: ChatCompletionParam;
    if (typeof message === 'string') {
      data = {
        messages: [
          {
            role: ChatCompletionRole.user,
            content: message
          }
        ],
        stream: true
      }
    } else {
      data = MessageBuilder.toCompletionParam(message as any)
    }
    const chunkStream: SdkStream<ChatCompletionChunk> = await chatService.create(data, { conversationId: options.conversation_id, id: options.agent_id as any }) as any
    for await (const chunk of chunkStream) {
      // 为每个chunk触发消息chunk接收事件
      this.eventEmitter.emit(this.eventAdapter.adaptMessageChunkReceived({ chunk, channelMsgId: chunk.id as any, id: chunk.id }))
    }
  }

  sendAudioStream(audioData: ArrayBuffer | Blob, protocolVersion: number, options: ChatContext): void {
    // SSE发送音频流逻辑
    console.log('SSE发送音频流')
  }

  sendHello(content: string, options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }): void {
    // SSE发送Hello消息逻辑
    console.log('SSE发送Hello消息:', content)
  }

  sendEvent(type: IotEventType, payload: EventPayload): void {
    // SSE发送事件逻辑
    console.log('SSE发送事件:', type, payload)
  }

  sendProtocol(protocol: RequestProtocol): void {
    // SSE发送协议逻辑
    console.log('SSE发送协议:', protocol)
  }

  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  isConnected(): boolean {
    return this.connectionState.connected
  }

  onEvent(eventType: IotEventType, callback: (event: any) => void): void {
    // SSE事件监听器
    console.log('SSE注册事件监听器:', eventType)
  }

  onMessage(callback: (data: SDKMessage) => void): void {
    // SSE消息监听器
    console.log('SSE注册消息监听器')
  }

  onAudioStream(callback: (data: SDKMessage) => void): void {
    // SSE音频流监听器
    console.log('SSE注册音频流监听器')
  }

  onData(callback: (data: SDKMessage) => void): void {
    // SSE数据监听器
    console.log('SSE注册数据监听器')
  }

  onToolCall(callback: (data: { name: string; args: Record<string, any> }) => void): void {
    // SSE工具调用监听器
    console.log('SSE注册工具调用监听器')
  }

  offData(callback: (data: SDKMessage) => void): void {
    // SSE移除数据监听器
    console.log('SSE移除数据监听器')
  }

  offEvent(eventType: IotEventType, callback: (event: any) => void): void {
    // SSE移除事件监听器
    console.log('SSE移除事件监听器:', eventType)
  }

  onError(callback: (error: Error) => void): void {
    // SSE错误监听器
    console.log('SSE注册错误监听器')
  }

  offError(callback: (error: Error) => void): void {
    // SSE移除错误监听器
    console.log('SSE移除错误监听器')
  }

  async destroy(): Promise<void> {
    // SSE销毁逻辑
    this.disconnect()
    console.log('SSE处理器已销毁')
  }

  async reconnect(): Promise<void> {
    console.log('SSE重新连接...')
    // 先断开连接
    this.disconnect()
    // 然后重新初始化
    await this.initialize()
  }

  /**
   * 设置SSE连接
   */
  private async setupSseConnection(): Promise<void> {
    // SSE连接实现逻辑
    console.log('设置SSE连接')
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // SSE事件监听器设置逻辑
    console.log('设置SSE事件监听器')
  }

  /**
   * 更新连接状态并触发事件
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.eventEmitter.emit(this.eventAdapter.adaptConnectionChange(state))
  }
}