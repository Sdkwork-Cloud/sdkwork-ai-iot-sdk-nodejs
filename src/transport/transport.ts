import { ProtocolDecoder, ProtocolEncoder } from '../protocol/codec';
import {
  type RequestProtocol,
  type ResponseProtocol,
  type BinaryRequestProtocol,
  type BinaryResponseProtocol,
  type HelloRequestProtocol,
  type HelloResponseProtocol,
  type ImMessageRequestProtocol,
  type ImMessageResponseProtocol,
  type BinaryAudioMessageRequestProtocol,
  type AudioMessageResponseProtocol,
} from '../types/protocol';

import { ConnectionStateEnum, DeviceState } from '../types/enums';
import { ChatFeatures, ConnectionState, DeviceAudioParams } from '../types';
import { ChatContext } from 'sdkwork-sdk-api-typescript';

// Transport 通用接口定义
// 支持不同的传输协议提供者（WebSocket、MQTT、悟空IM等）

// ==================== 基础接口定义 ====================

/**
 * Transport 事件类型
 */
export interface TransportEvents {
  /** 连接状态变化 */
  'state-change': (state: any) => void;
  /** 收到消息 */
  message: (message: ResponseProtocol) => void;
  /** 连接成功 */
  connected: () => void;
  /** 连接断开 */
  disconnected: () => void;
  /** 错误发生 */
  error: (error: string) => void;
  /** 音频数据 */
  'audio-data': (buffer: ArrayBuffer) => void;
}

/**
 * Transport 配置接口
 */
export interface TransportConfig {
  /** 连接URL */
  url: string;
  /** 协议版本 */
  version?: number;
  /** 认证令牌 */
  authorization?: string;
  /** 设备ID */
  deviceId?: string;
  /** 客户端ID */
  clientId?: string;
  /** 连接超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retryCount?: number;
  /** 音频参数 */
  audioParams?: Partial<DeviceAudioParams>;
  /** 设备特性 */
  features?: ChatFeatures;
  protocolEncoder: ProtocolEncoder;
  protocolDecoder: ProtocolDecoder;
  /** 自定义配置 */
  [key: string]: any;
}

/**
 * Transport 提供者接口
 * 所有传输协议实现都必须实现此接口
 */
export interface TransportProvider {
  /** 提供者名称 */
  readonly name: string;
  /** 提供者版本 */
  readonly version: string;
  /** 是否支持连接 */
  readonly supported: boolean;

  /** 连接状态 */
  readonly state: ConnectionState;

  /** 连接到服务器 */
  connect(config: any): Promise<void>;

  /** 断开连接 */
  disconnect(): void;
  /** 发送 Hello 消息 */
  sendHello(params: HelloRequestProtocol): void;
  /** 发送消息 */
  sendMessage(message: ImMessageRequestProtocol): void;

  /** 发送二进制音频数据 */
  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): void;

  /** 获取连接状态详情 */
  getConnectionState(): ConnectionState;

  /** 检查是否已连接 */
  isConnected(): boolean;

  /** 添加事件监听器 */
  on<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void;

  /** 移除事件监听器 */
  off<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void;

  /** 一次性事件监听器 */
  once<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void;

  /** 移除所有事件监听器 */
  removeAllListeners(event?: keyof TransportEvents): void;

  /** 销毁实例 */
  destroy(): void;
}

/**
 * Transport 管理器接口
 * 管理多个传输提供者，提供统一的API接口
 */
export interface TransportManager {
  /** 当前激活的提供者 */
  readonly activeProvider: TransportProvider | null;

  /** 所有可用的提供者 */
  readonly providers: Map<string, TransportProvider>;

  /** 连接状态 */
  readonly state: ConnectionState;

  /** 设置默认提供者 */
  setDefaultProvider(name: string): void;

  /** 获取提供者 */
  getProvider(name: string): TransportProvider | null;

  /** 注册提供者 */
  registerProvider(provider: TransportProvider): void;

  /** 注销提供者 */
  unregisterProvider(name: string): void;

  /** 连接到服务器 */
  connect(config: TransportConfig, providerName?: string): Promise<void>;

  /** 断开连接 */
  disconnect(): void;

  /** 发送消息 */
  sendMessage(message: RequestProtocol): void;

  /** 发送二进制音频数据 */
  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): void;

  /** 添加事件监听器 */
  on<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void;

  /** 移除事件监听器 */
  off<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void;

  /** 销毁管理器 */
  destroy(): void;
}

// ==================== 抽象基类实现 ====================

/**
 * 基础 Transport 提供者抽象类
 * 提供通用的实现逻辑，具体提供者可以继承此类
 */
export abstract class BaseTransportProvider implements TransportProvider {
  sendHello(params: HelloRequestProtocol): void {
    console.error('sendHello method not implemented')
    throw new Error('Method not implemented.');
  }
  public abstract readonly name: string;
  public abstract readonly version: string;
  public abstract readonly supported: boolean;

  protected _state: ConnectionState = {
    state: ConnectionStateEnum.DISCONNECTED,
    connected: false,
  };

  protected listeners: Map<keyof TransportEvents, Set<Function>> = new Map();
  protected config: TransportConfig | null = null;
  protected protocolEncoder: ProtocolEncoder | null = null;
  protected protocolDecoder: ProtocolDecoder | null = null;

  public get state(): ConnectionState {
    return { ...this._state };
  }

  /**
   * 获取连接状态详情
   */
  getConnectionState(): ConnectionState {
    return this.state;
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this._state.connected;
  }

  abstract connect(config: TransportConfig): Promise<void>;
  abstract disconnect(): void;
  abstract sendMessage(message: RequestProtocol): void;
  abstract sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): void;
  abstract destroy(): void;

  /**
   * 更新连接状态
   */
  protected updateState(newState: Partial<ConnectionState>): void {
    const oldState = this._state.state;
    this._state = { ...this._state, ...newState };

    if (oldState !== this._state.state) {
      this.emit('state-change', this.state);
    }
  }

  /**
   * 触发事件
   */
  protected emit<K extends keyof TransportEvents>(
    event: K,
    ...args: Parameters<TransportEvents[K]>
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * 添加事件监听器
   */
  on<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * 一次性事件监听器
   */
  once<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void {
    const onceWrapper = ((...args: unknown[]) => {
      (listener as Function)(...args);
      this.off(event, onceWrapper as TransportEvents[K]);
    }) as TransportEvents[K];

    this.on(event, onceWrapper);
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(event?: keyof TransportEvents): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * 验证配置
   */
  protected validateConfig(config: TransportConfig): boolean {
    if (!config.url) {
      throw new Error('Transport config must include URL');
    }
    return true;
  }
}

/**
 * Transport 管理器实现
 */
export class DefaultTransportManager implements TransportManager {
  private _providers: Map<string, TransportProvider> = new Map();
  private _activeProvider: TransportProvider | null = null;
  private _defaultProviderName: string = 'websocket';

  private _state: ConnectionState = {
    state: ConnectionStateEnum.DISCONNECTED,
    connected: false,
    session: undefined,
    lastError: undefined,
    connectTime: undefined,
  };

  private listeners: Map<keyof TransportEvents, Set<Function>> = new Map();

  public get activeProvider(): TransportProvider | null {
    return this._activeProvider;
  }

  public get providers(): Map<string, TransportProvider> {
    return new Map(this._providers);
  }

  public get state(): ConnectionState {
    return this._activeProvider ? this._activeProvider.state : this._state;
  }

  /**
   * 设置默认提供者
   */
  setDefaultProvider(name: string): void {
    if (this._providers.has(name)) {
      this._defaultProviderName = name;
    } else {
      throw new Error(`Provider "${name}" not found`);
    }
  }

  /**
   * 获取提供者
   */
  getProvider(name: string): TransportProvider | null {
    return this._providers.get(name) || null;
  }

  /**
   * 注册提供者
   */
  registerProvider(provider: TransportProvider): void {
    this._providers.set(provider.name, provider);

    // 转发提供者的事件
    provider.on('state-change', state => this.emit('state-change', state));
    provider.on('message', message => this.emit('message', message));
    provider.on('connected', () => this.emit('connected'));
    provider.on('disconnected', () => this.emit('disconnected'));
    provider.on('error', error => this.emit('error', error));
    provider.on('audio-data', buffer => this.emit('audio-data', buffer));
  }

  /**
   * 注销提供者
   */
  unregisterProvider(name: string): void {
    const provider = this._providers.get(name);
    if (provider) {
      provider.removeAllListeners();
      this._providers.delete(name);

      if (this._activeProvider === provider) {
        this._activeProvider = null;
      }
    }
  }

  /**
   * 连接到服务器
   */
  async connect(config: TransportConfig, providerName?: string): Promise<void> {
    const name = providerName || this._defaultProviderName;
    const provider = this._providers.get(name);

    if (!provider) {
      throw new Error(`Transport provider "${name}" not found`);
    }

    this._activeProvider = provider;

    try {
      await provider.connect(config);
      this._state = provider.state;
    } catch (error) {
      this._state.lastError = error instanceof Error ? error : new Error(String(error));
      throw error;
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this._activeProvider) {
      this._activeProvider.disconnect();
    }
  }

  /**
   * 发送消息
   */
  sendMessage(message: RequestProtocol): void {
    if (!this._activeProvider) {
      throw new Error('No active transport provider');
    }
    this._activeProvider.sendMessage(message);
  }

  /**
   * 发送二进制音频数据
   */
  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): void {
    if (!this._activeProvider) {
      throw new Error('No active transport provider');
    }
    this._activeProvider.sendAudioStream(audioData, protocolVersion);
  }

  /**
   * 触发事件
   */
  private emit<K extends keyof TransportEvents>(
    event: K,
    ...args: Parameters<TransportEvents[K]>
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * 添加事件监听器
   */
  on<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof TransportEvents>(event: K, listener: TransportEvents[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.disconnect();

    // 销毁所有提供者
    this._providers.forEach(provider => {
      provider.destroy();
    });
    this._providers.clear();

    this._activeProvider = null;
    this.listeners.clear();
  }
}

// ==================== 工具函数和类型导出 ====================

/**
 * 创建 Transport 管理器
 */
export function createTransportManager(): TransportManager {
  return new DefaultTransportManager();
}

/**
 * 检查提供者是否可用
 */
export function isProviderAvailable(name: string): boolean {
  // 这里可以根据环境检测不同提供者的可用性
  switch (name) {
    case 'websocket':
      return typeof WebSocket !== 'undefined';
    case 'mqtt':
      // 检查MQTT客户端库是否可用
      return typeof window !== 'undefined' && 'mqtt' in window;
    case 'wukong':
      // 检查悟空协议是否可用
      return typeof window !== 'undefined' && 'wukong' in window;
    default:
      return false;
  }
}

// 默认导出
export default {
  createTransportManager,
  isProviderAvailable,
  BaseTransportProvider,
  DefaultTransportManager,
};
