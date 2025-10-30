import type { Ref } from 'vue'
import {  
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
} from 'sdkwork-ai-iot-sdk';
import { ChatContext } from 'sdkwork-sdk-api-typescript';

/**
 * 消息处理器类型枚举
 */
export enum MessageHandlerType {
  IOT = 'iot',
  SSE = 'sse',
  IM = 'im'
}

/**
 * 消息处理器接口
 * 完全兼容AIoTClient标准，提供消息发送和接收处理功能
 */
export interface MessageHandler {
  /** 处理器名称 */
  readonly name: string 
  
  /**
   * 初始化处理器
   */
  initialize(): Promise<void>;
  
  /**
   * 断开连接
   */
  disconnect(): void;
  
  /**
   * 开始语音监听
   */
  startListening(): void;
  
  /**
   * 停止语音监听
   */
  stopListening(): void;
  
  /**
   * 发送消息
   * @param message 消息对象或字符串
   * @param options 聊天上下文选项
   */
  send(message: SDKMessage | string, options: ChatContext): void;
  
  /**
   * 发送语音数据
   * @param audioData 音频数据
   * @param protocolVersion 协议版本（可选）
   */
  sendAudioStream(audioData: ArrayBuffer|Blob, protocolVersion: number, options: ChatContext): void;
  
  /**
   * 发送Hello消息
   * @param content 消息内容
   * @param options 选项对象
   */
  sendHello(content: string, options: {
    features?: ChatFeatures;
    audioParams?: DeviceAudioParams;
    chatContext: ChatContext;
  }): void;
  
  /**
   * 发送事件
   * @param type 事件类型
   * @param payload 事件负载
   */
  sendEvent(type: IotEventType, payload: EventPayload): void;
  
  /**
   * 发送协议
   * @param protocol 协议对象
   */
  sendProtocol(protocol: RequestProtocol): void;
  
  /**
   * 获取连接状态
   */
  getConnectionState(): ConnectionState;
  
  /**
   * 检查是否已连接
   */
  isConnected(): boolean;
  
  /**
   * 销毁处理器
   */
  destroy(): Promise<void>;
}