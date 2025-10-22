import type { Ref } from 'vue'
import { ref } from 'vue'
import { 
  SdkworkAIotConfig, 
  IoTEvent, 
  ChatContext, 
  ChatFeatures, 
  DeviceAudioParams,
  Message as SDKMessage,
  ConnectionStateEnum,
  IotEventType,
  EventPayload,
  RequestProtocol,
  ConnectionState,
  AudioStreamPayload,
  DataPayload,
  SdkworkAIoTClient
} from 'sdkwork-ai-iot-sdk'
import type { MessageHandler } from '../types'
import type { MessageEventEmitter, MessageEventAdapter } from '../event'
import { MessageEventType } from '../event' 
/**
 * IoT消息处理器实现
 * 基于AIoTClient实现的IoT协议消息处理器，集成统一事件系统
 */
export class IotMessageHandler implements MessageHandler {
  readonly name: string = 'IotMessageHandler'
  private connectionState: ConnectionState
  
  private client: any // AIoTClient实例
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
      // 动态导入AIoTClient 
      this.client = new SdkworkAIoTClient(this.config)
      
      // 设置事件监听器
      this.setupEventListeners()
      
      // 初始化客户端
      await this.client.initialize()
      
      // 更新连接状态
      this.updateConnectionState(this.client.getConnectionState())
      
    } catch (error) {
      this.eventEmitter.emit(this.eventAdapter.adaptErrorOccurred(error as Error))
      throw error
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect()
      this.updateConnectionState({
        state: ConnectionStateEnum.DISCONNECTED,
        connected: false
      })
    }
  }

  startListening(): void {
    if (this.client) {
      this.client.startListening()
    }
  }

  stopListening(): void {
    if (this.client) {
      this.client.stopListening()
    }
  }

  send(message: SDKMessage | string, options: ChatContext): void {
    if (this.client) {
      this.client.send(message, options)
    }
  }

  sendAudioData(audioData: ArrayBuffer, protocolVersion?: number): void {
    if (this.client) {
      this.client.sendAudioData(audioData, protocolVersion)
    }
  }

  sendHello(content: string, options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }): void {
    if (this.client) {
      this.client.sendHello(content, options)
    }
  }

  sendEvent(type: IotEventType, payload: EventPayload): void {
    if (this.client) {
      this.client.sendEvent(type, payload)
    }
  }

  sendProtocol(protocol: RequestProtocol): void {
    if (this.client) {
      this.client.sendProtocol(protocol)
    }
  }

  getConnectionState(): ConnectionState {
    if (this.client) {
      return this.client.getConnectionState()
    }
    return this.connectionState
  }

  isConnected(): boolean {
    if (this.client) {
      return this.client.isConnected()
    }
    return false
  }



  async destroy(): Promise<void> {
    if (this.client) {
      await this.client.destroy()
      this.client = null
    }
  }

  /**
   * 设置事件监听器，将AIoTClient事件转换为统一事件
   */
  private setupEventListeners(): void {
    if (!this.client) return

    // 连接状态变化事件
    this.client.onEvent(IotEventType.CONNECTED, (event: IoTEvent) => {
      const state = this.client.getConnectionState()
      this.updateConnectionState(state)
      this.eventEmitter.emit(this.eventAdapter.adaptIotEventReceived(IotEventType.CONNECTED, event))
    })

    this.client.onEvent(IotEventType.DISCONNECTED, (event: IoTEvent) => {
      const state = this.client.getConnectionState()
      this.updateConnectionState(state)
      this.eventEmitter.emit(this.eventAdapter.adaptIotEventReceived(IotEventType.DISCONNECTED, event))
    })

    // 消息接收事件
    this.client.onMessage((message: SDKMessage) => {
      this.eventEmitter.emit(this.eventAdapter.adaptMessageReceived(message))
    })

    // 音频流接收事件
    this.client.onAudioStream((audioData: AudioStreamPayload) => {
      this.eventEmitter.emit(this.eventAdapter.adaptAudioStreamReceived(audioData))
    })

    // 数据接收事件
    this.client.onData((data: DataPayload) => {
      this.eventEmitter.emit(this.eventAdapter.adaptDataReceived(data))
    })

    // 工具调用事件
    this.client.onToolCall((toolData: { name: string; args: Record<string, any> }) => {
      this.eventEmitter.emit(this.eventAdapter.adaptToolCallReceived(toolData))
    })

    // 错误事件
    this.client.onError((error: Error) => {
      this.eventEmitter.emit(this.eventAdapter.adaptErrorOccurred(error))
    })
  }

  /**
   * 更新连接状态并触发事件
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.eventEmitter.emit(this.eventAdapter.adaptConnectionChange(state))
  }
}