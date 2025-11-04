import {
  SdkworkAIotConfig, 
  SensorData,
  ControlCommand, 
  ChatFeatures,
  DeviceAudioParams,
  AudioStreamPayload,
  DataPayload,
} from './common';
import { ChatContext, IotEvent, IotEventType } from 'sdkwork-sdk-api-typescript'
import { Message } from './im';
import { ConnectionStateEnum } from './enums';
import { EventPayload } from './protocol/event';
import { RequestProtocol } from './protocol'; 
// 回调函数类型
export type EventCallback = (event: IotEvent) => void;
export type DataCallback = (data: DataPayload) => void;
export type MessageCallback = (data: Message) => void;
export type MessageChunkCallback = (data: Message) => void;
export type AudioStreamCallback = (data: AudioStreamPayload) => void;
export type ToolCallback = (data: { name: string; args: Record<string, any> }) => void;
export type ErrorCallback = (error: Error) => void;
/**
 * AIoT客户端事件类型定义
 */
export interface AIoTClientEvents {
  connected: IotEvent;
  disconnected: IotEvent;
  'transport-connected': IotEvent;
  'transport-disconnected': IotEvent;
  message: any;
  'mcp-tool-call': any;
  event: any;
  data: any;
  audio: any;
  'audio-stream': AudioStreamPayload;
  image: any;
  video: any;
  music: any;
  error: Error;
  [key: string]: any;
  [key: symbol]: any;
}

/**
 * AIoT客户端主接口
 * 提供设备连接、语音交互、数据收发等核心功能
 */
export interface AIoTClient {
  /**
   * 初始化客户端
   */
  initialize(sdkConfig?: SdkworkAIotConfig): Promise<void>;
  /**
   * 重连
   */
  reconnect(sdkConfig?: SdkworkAIotConfig): Promise<void>;
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
   * 进入一个聊天，更换聊天上下文
   * @param chatContext 
   */
  enter(options:{chatContext: ChatContext}): void;
  /**
   * 退出一个聊天，通知服务端
   * @param chatContext 
   */
  exit(options:{chatContext: ChatContext}): void;
  /**
   * 发送消息
   * @param message 消息对象
   */
  send(message: Message | string, options: ChatContext): void;
  /**
   * 发送语音数据
   * @param audioData 音频数据
   * @param protocolVersion 协议版本（可选）
   */
  sendAudioStream(audioData: ArrayBuffer|Blob, protocolVersion?: number, chatContext?: ChatContext): void;
  /**
   * 发送Hello消息
   * @param content
   * @param chatContext
   */
  sendHello(
    content: string,
    options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }
  ): void;
  /**
   * 发送事件
   * @param command 控制命令
   */
  sendEvent(type: IotEventType, payload: EventPayload): void;
  /**

   * 发送协议   
   * @param protocol 协议
   **/
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
   * 注册事件监听器 
   * @param callback 回调函数
   */
  onEvent(callback: EventCallback): void;
  /**
   * 注册音频回调
   * @param callback 回调函数
   */
  onMessage(callback: MessageCallback): void;
  /**
   * 消息分片
   * @param callback 
   */
  onMessageChunk(callback: MessageChunkCallback): void;


  /**
   * 注册音频流回调
   * @param callback 回调函数
   */
  onAudioStream(callback: AudioStreamCallback): void;
  /**
   * 注册数据回调
   * @param callback 回调函数
   */
  onData(callback: DataCallback): void;
  /**
   * 注册工具回调
   * @param callback 回调函数
   */
  onToolCall(callback: ToolCallback): void;
  /**
   * 移除数据回调
   * @param callback 回调函数
   */
  offData(callback: DataCallback): void;

  /**
   * 移除事件监听器 
   * @param callback 回调函数
   */
  offEvent(callback: EventCallback): void;

  /**
   * 注册错误回调
   * @param callback 回调函数
   */
  onError(callback: ErrorCallback): void;

  /**
   * 移除错误回调
   * @param callback 回调函数
   */
  offError(callback: ErrorCallback): void;

  /**
   * 销毁客户端
   */
  destroy(): Promise<void>;
}
// 连接状态接口
export interface ConnectionState {
  state: ConnectionStateEnum;
  connected: boolean;
  session?: string;
  lastError?: Error;
  connectTime?: Date;
}
/**
 * AIoT客户端工厂函数类型
 */
export type AIoTClientFactory = (config: SdkworkAIotConfig) => AIoTClient;

/**
 * AIoT客户端构造器类型
 */
export interface AIoTClientConstructor {
  new (config: SdkworkAIotConfig): AIoTClient;
}
