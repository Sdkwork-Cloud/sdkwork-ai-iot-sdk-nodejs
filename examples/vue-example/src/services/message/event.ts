
import type { 
  Message as SDKMessage,
  IotEventType,
  ConnectionState,
  AudioStreamPayload,
  DataPayload,
  ChatCompletionChunk
} from 'sdkwork-ai-iot-sdk'

/**
 * 统一消息事件类型
 */
export enum MessageEventType {
  /** 连接状态变化 */
  CONNECTION_CHANGE = 'connection-change',
  /** 收到消息 */
  MESSAGE_RECEIVED = 'message-received',
  /** 收到消息 */
  MESSAGE_CHUNK_RECEIVED = 'message-chunk-received',
  /** 收到音频流 */
  AUDIO_STREAM_RECEIVED = 'audio-stream-received',
  /** 收到数据 */
  DATA_RECEIVED = 'data-received',
  /** 工具调用 */
  TOOL_CALL_RECEIVED = 'tool-call-received',
  /** 错误事件 */
  ERROR_OCCURRED = 'error-occurred',
  /** IoT事件 */
  IOT_EVENT_RECEIVED = 'iot-event-received'
}

/**
 * 连接状态变化事件
 */
export interface ConnectionChangeEvent {
  type: MessageEventType.CONNECTION_CHANGE
  data: ConnectionState
  createdAt: number
}

/**
 * 消息接收事件
 */
export interface MessageReceivedEvent {
  type: MessageEventType.MESSAGE_RECEIVED
  data: SDKMessage
  createdAt: number
}
export interface MessageChunkReceivedEvent {
  type: MessageEventType.MESSAGE_CHUNK_RECEIVED
  data: ChatCompletionChunk
  createdAt: number
}
/**
 * 音频流接收事件
 */
export interface AudioStreamReceivedEvent {
  type: MessageEventType.AUDIO_STREAM_RECEIVED
  data: AudioStreamPayload
  createdAt: number
}

/**
 * 数据接收事件
 */
export interface DataReceivedEvent {
  type: MessageEventType.DATA_RECEIVED
  data: DataPayload
  createdAt: number
}

/**
 * 工具调用接收事件
 */
export interface ToolCallReceivedEvent {
  type: MessageEventType.TOOL_CALL_RECEIVED
  data: {
    name: string
    args: Record<string, any>
  }
  createdAt: number
}

/**
 * 错误事件
 */
export interface ErrorOccurredEvent {
  type: MessageEventType.ERROR_OCCURRED
  data: Error
  createdAt: number
}

/**
 * IoT事件接收事件
 */
export interface IotEventReceivedEvent {
  type: MessageEventType.IOT_EVENT_RECEIVED
  data: {
    eventType: IotEventType
    event: any
  }
  createdAt: number
}

/**
 * 统一消息事件
 */
export type MessageEvent =
  | ConnectionChangeEvent
  | MessageReceivedEvent
  | AudioStreamReceivedEvent
  | DataReceivedEvent
  | ToolCallReceivedEvent
  | ErrorOccurredEvent
  | IotEventReceivedEvent
  | MessageChunkReceivedEvent

/**
 * 事件监听器类型
 */
export type MessageEventListener = (event: MessageEvent) => void

/**
 * 事件发射器接口
 */
export interface MessageEventEmitter {
  /**
   * 注册事件监听器
   */
  on(eventType: MessageEventType, listener: MessageEventListener): void

  /**
   * 移除事件监听器
   */
  off(eventType: MessageEventType, listener: MessageEventListener): void

  /**
   * 触发事件
   */
  emit(event: MessageEvent): void

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(): void
}

/**
 * 事件适配器接口
 * 将不同处理器的原生事件转换为统一的消息事件
 */
export interface MessageEventAdapter {
  /**
   * 适配连接状态变化
   */
  adaptConnectionChange(state: ConnectionState): ConnectionChangeEvent
  /**
   * Message Chunk Received Event
   * @param message 
   */
  adaptMessageChunkReceived(chunk: {chunk: ChatCompletionChunk;channelMsgId: string;id?:string;}): MessageChunkReceivedEvent
  /**
   * 适配消息接收
   */
  adaptMessageReceived(message: SDKMessage): MessageReceivedEvent

  /**
   * 适配音频流接收
   */
  adaptAudioStreamReceived(message: AudioStreamPayload): AudioStreamReceivedEvent

  /**
   * 适配数据接收
   */
  adaptDataReceived(message: DataPayload): DataReceivedEvent

  /**
   * 适配工具调用接收
   */
  adaptToolCallReceived(data: { name: string; args: Record<string, any> }): ToolCallReceivedEvent

  /**
   * 适配错误事件
   */
  adaptErrorOccurred(error: Error): ErrorOccurredEvent

  /**
   * 适配IoT事件接收
   */
  adaptIotEventReceived(eventType: IotEventType, event: any): IotEventReceivedEvent
}

/**
 * 默认事件适配器实现
 */
export class DefaultMessageEventAdapter implements MessageEventAdapter {

  adaptConnectionChange(state: ConnectionState): ConnectionChangeEvent {
    return {
      type: MessageEventType.CONNECTION_CHANGE,
      data: state,
      createdAt: Date.now()
    }
  }
  adaptMessageChunkReceived(chunk: ChatCompletionChunk): MessageChunkReceivedEvent {
    return {
      type: MessageEventType.MESSAGE_CHUNK_RECEIVED,
      data: chunk,
      createdAt: Date.now()
    }
  }
  adaptMessageReceived(message: SDKMessage): MessageReceivedEvent {
    return {
      type: MessageEventType.MESSAGE_RECEIVED,
      data: message,
      createdAt: Date.now()
    }
  }

  adaptAudioStreamReceived(message: AudioStreamPayload): AudioStreamReceivedEvent {
    return {
      type: MessageEventType.AUDIO_STREAM_RECEIVED,
      data: message,
      createdAt: Date.now()
    }
  }

  adaptDataReceived(message: AudioStreamPayload): DataReceivedEvent {
    return {
      type: MessageEventType.DATA_RECEIVED,
      data: message,
      createdAt: Date.now()
    }
  }

  adaptToolCallReceived(data: { name: string; args: Record<string, any> }): ToolCallReceivedEvent {
    return {
      type: MessageEventType.TOOL_CALL_RECEIVED,
      data,
      createdAt: Date.now()
    }
  }

  adaptErrorOccurred(error: Error): ErrorOccurredEvent {
    return {
      type: MessageEventType.ERROR_OCCURRED,
      data: error,
      createdAt: Date.now()
    }
  }

  adaptIotEventReceived(eventType: IotEventType, event: any): IotEventReceivedEvent {
    return {
      type: MessageEventType.IOT_EVENT_RECEIVED,
      data: { eventType, event },
      createdAt: Date.now()
    }
  }
}

/**
 * 简单事件发射器实现
 */
export class SimpleMessageEventEmitter implements MessageEventEmitter {
  private listeners: Map<MessageEventType, Set<MessageEventListener>> = new Map()

  on(eventType: MessageEventType, listener: MessageEventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(listener)
  }

  off(eventType: MessageEventType, listener: MessageEventListener): void {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }

  emit(event: MessageEvent): void {
    const listeners = this.listeners.get(event.type)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error)
        }
      })
    }
  }

  removeAllListeners(): void {
    this.listeners.clear()
  }
}