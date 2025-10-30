 
import {ChatContext} from 'sdkwork-sdk-api-typescript'; 
/**
 * Device Audio Parameters
 *
 * Contains audio configuration parameters for devices
 */
export interface DeviceAudioParams {
  /**
   * Audio format (e.g. "opus", "pcm")
   */
  format: string;

  /**
   * Sample rate in Hz (e.g. 16000)
   */
  sample_rate: number;

  /**
   * Number of channels (1 for mono, 2 for stereo)
   */
  channels: number;

  /**
   * Frame duration in milliseconds (e.g. 60)
   */
  frame_duration: number;
}

/**
 * Chat Features Interface
 *
 * Defines supported chat features for devices
 */
export interface ChatFeatures {
  /**
   * Whether Media Control Protocol (MCP) is supported
   */
  mcp: boolean;
}

// AIoT设备状态类型

// AIoT设备状态类型
export interface DeviceStatus {
  online: boolean;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: Date;
}

// AIoT设备信息类型
export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  status: DeviceStatus;
}

// AIoT传感器数据类型
export interface SensorData {
  timestamp: Date;
  value: number;
  unit: string;
  sensorType: string;
}

// AIoT控制命令类型
export interface ControlCommand {
  deviceId: string;
  command: string;
  parameters?: Record<string, any>;
  timestamp: Date;
}
 
export interface DataPayload {
  data: any;
}

export interface AudioData {
  channelData: Int16Array[];
  samplesDecoded: number;
  sampleRate: number;
}

export interface AudioStreamPayload {
  type: string;
  format: string;
  sample_rate: number;
  channels: number;
  frame_duration: number;
  data: AudioData;
}

// 传输协议类型
export type TransportProtocol = 'websocket' | 'mqtt' | 'wukongim' | 'http';
// 协议类型，sdkwork协议是小智协议的扩展，兼容小智协议
export type ProtocolType = 'sdkwork' | 'xiaozhi';

// 认证类型
export type AuthType = 'apiKey' | 'authorization';
// 基础对象类
export interface BaseObject {
  // 根据需要添加基础字段
}
// SDK配置选项
export interface SdkworkAIotConfig {
  // 认证信息 - 支持两种认证方案
  deviceId: string;
  // 客户端ID
  clientId: string;
  // 方案1: 客户端API Key (适合前端应用)
  apiKey?: string;

  // 方案2: 服务端Authorization (适合后端应用，更安全)
  authorization?: string;

  // 认证类型，自动检测或手动指定
  authType?: AuthType;

  // 连接配置
  baseUrl?: string;
  /**
   * 传输协议类型，默认为'websocket'
   * - 'websocket': 实时双向通信 (默认)
   * - 'mqtt': 轻量级IoT协议
   * - 'wukongim': 悟空IM协议
   * - 'http': 传统HTTP请求
   */
  transport?: TransportProtocol;
  /**
   * 协议类型，默认为'sdkwork'
   */
  protocol?: ProtocolType;
  timeout?: number;
  maxRetries?: number;

  // 音频配置
  audioParams?: DeviceAudioParams;

  // 设备特性
  features?: ChatFeatures;

  // 调试配置
  debug?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}
 