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
  DataPayload,
  SdkworkAIoTClient
} from 'sdkwork-ai-iot-sdk'
import { ChatContext } from 'sdkwork-sdk-api-typescript'
import type { MessageHandler } from '../types'
import type { MessageEventEmitter, MessageEventAdapter } from '../event'
import { MessageEventType } from '../event'
import { useIotClient } from '@/hooks/client/useIotClient'
import { MessageBuilder } from '../builder'
/**
 * IoT Message Handler Implementation
 * IoT protocol message handler based on AIoTClient, integrated with unified event system
 */
export class IotMessageHandler implements MessageHandler {
  readonly name: string = 'IotMessageHandler'
  private connectionState: ConnectionState

  private client: SdkworkAIoTClient | null // AIoTClient instance
  private eventEmitter: MessageEventEmitter
  private eventAdapter: MessageEventAdapter
  private config: SdkworkAIotConfig

  constructor(config: SdkworkAIotConfig, eventEmitter: MessageEventEmitter, eventAdapter: MessageEventAdapter) {
    this.config = config
    this.eventEmitter = eventEmitter
    this.eventAdapter = eventAdapter
    const { sdkClient } = useIotClient()
    this.client = sdkClient as any
    this.connectionState = {
      state: ConnectionStateEnum.DISCONNECTED,
      connected: false
    }
  }

  async initialize(): Promise<void> {
    try {

      if (!this.client) {
        throw new Error('Failed to get SDK client from useIotClient')
      }
      // Set up event listeners
      this.setupEventListeners()

      // Update connection state
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

  sendAudioStream(audioData: ArrayBuffer, protocolVersion: number, options: ChatContext): void {
    if (this.client) {
      this.client.sendAudioStream(audioData, protocolVersion, options)
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
  isChunk(message: SDKMessage) {

  }
  /**
   * Set up event listeners to convert AIoTClient events to unified events
   */
  private setupEventListeners(): void {
    if (!this.client || this.client == null) return

    // Connection state change events
    this.client.onEvent((event: any) => {
      console.error('event received================================', event)
      if (IotEventType.CONNECTED === event.event_type) {
        const state = this.client!.getConnectionState()
        this.updateConnectionState(state)
        this.eventEmitter.emit(this.eventAdapter.adaptIotEventReceived(IotEventType.CONNECTED, event))
         return;
      }
      if (IotEventType.DISCONNECTED === event.event_type) {
        const state = this.client!.getConnectionState()
        this.updateConnectionState(state)
        this.eventEmitter.emit(this.eventAdapter.adaptIotEventReceived(IotEventType.DISCONNECTED, event))
        return;
      }
      if ("TTS_SENTENCE_START" === event.event_type) {
        const payload = event.payload;
        event.metadata = event.metadata || {}
        if (event.metadata) {
          const chunk = MessageBuilder.toCompletionChunk(payload.text, event.metadata)
          this.eventEmitter.emit(this.eventAdapter.adaptMessageChunkReceived({ ...event.metadata, chunk }))
        }
        return;
      }
      if (event.text) {
        console.error('event.text', event.text)
        event.metadata = event.metadata || {}
        if (event.metadata) {
          const chunk = MessageBuilder.toCompletionChunk(event.text, event.metadata)
          const id=event.id||event.channelMsgId||window.$uuid()
          chunk.id=id
          this.eventEmitter.emit(this.eventAdapter.adaptMessageChunkReceived({ ...event.metadata, chunk,id:chunk.id,channelMsgId:chunk.id }))
        }
        return;
      }


    })

    this.client.onMessageChunk((message: any) => {
      this.eventEmitter.emit(this.eventAdapter.adaptMessageChunkReceived(message))
    })

    // Message received event
    this.client.onMessage((message: SDKMessage) => {
      this.eventEmitter.emit(this.eventAdapter.adaptMessageReceived(message))
    })

    // Audio stream received event
    this.client.onAudioStream((audioData: AudioStreamPayload) => {
      this.eventEmitter.emit(this.eventAdapter.adaptAudioStreamReceived(audioData))
    })

    // Data received event
    this.client.onData((data: DataPayload) => {
      this.eventEmitter.emit(this.eventAdapter.adaptDataReceived(data))
    })

    // Tool call event
    this.client.onToolCall((toolData: { name: string; args: Record<string, any> }) => {
      this.eventEmitter.emit(this.eventAdapter.adaptToolCallReceived(toolData))
    })

    // Error event
    this.client.onError((error: Error) => {
      this.eventEmitter.emit(this.eventAdapter.adaptErrorOccurred(error))
    })
  }

  /**
   * Update connection state and trigger events
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.eventEmitter.emit(this.eventAdapter.adaptConnectionChange(state))
  }
}