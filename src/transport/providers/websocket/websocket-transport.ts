import { createUnifiedWebSocket, UnifiedWebSocket, WebSocketReadyState } from '../../websocket';
import { BaseTransportProvider, TransportProvider, TransportConfig } from '../../transport';
import { ConnectionStateEnum, DeviceState } from '../../../types/enums';
import {
  type RequestProtocol,
  type ResponseProtocol,
  type HelloRequestProtocol 
} from '../../../types/protocol';
import { ConnectionState } from '../../../types';

/**
 * WebSocket传输提供者实现
 * 支持浏览器、小程序、uniapp等不同平台
 */
export class WebSocketTransportProvider extends BaseTransportProvider implements TransportProvider {
  public readonly name = 'websocket';
  public readonly version = '1.0.0';
  public readonly supported = true;

  private ws: UnifiedWebSocket | null = null;
  private reconnectTimer: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private isManualDisconnect = false;
  private pendingMessages: Array<{message: RequestProtocol, timestamp: number}> = [];
  private maxPendingMessageAge = 30000; // 30秒
  private maxPendingMessages = 100; // 最大待处理消息数量 

  constructor() {
    super();
  }

  /**
   * 检查WebSocket是否已连接
   */
  isConnected(): boolean {
    return this._state.connected && this.ws?.readyState === WebSocketReadyState.OPEN;
  }

  /**
   * 更新连接状态
   */
  private updateConnectionState(
    state: ConnectionStateEnum,
    connected: boolean,
    error?: string
  ): void {
    this.updateState({
      state,
      connected,
      session: connected ? this._state.session : undefined,
      lastError: error ? new Error(error) : undefined,
      connectTime: connected ? new Date() : this._state.connectTime,
    });
  }

  async connect(config: TransportConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;
    this.protocolEncoder = config.protocolEncoder;
    this.protocolDecoder = config.protocolDecoder;

    // 设置重连参数
    this.maxReconnectAttempts = config.reconnectAttempts || 5;
    this.reconnectInterval = config.reconnectInterval || 3000;
    this.reconnectAttempts = 0;
    this.isManualDisconnect = false;

    this.updateConnectionState(ConnectionStateEnum.CONNECTING, false);

    try {
      await this.createWebSocketConnection();
    } catch (error) {
      this.handleConnectionError(error);
      throw error;
    }
  }

  /**
   * 创建WebSocket连接
   */
  private async createWebSocketConnection(): Promise<void> {
    if (!this.config) {
      throw new Error('Config is not set');
    }

    // 清除之前的连接
    if (this.ws) {
      this.ws.destroy();
      this.ws = null;
    }

    // 使用统一的WebSocket封装创建连接
    this.ws = createUnifiedWebSocket({
      url: this.config.url,
      timeout: this.config.timeout || 10000,
      headers: {
        Authorization: `Bearer ${this.config.authorization || ''}`,
        'Protocol-Version': (this.config.version || 1).toString(),
        'Device-Id': this.config.deviceId || '',
        'Client-Id': this.config.clientId || '',
      },
    });

    // 监听连接事件
    this.ws.on('open', (event: Event) => {
      this.handleConnectionOpen(event);
    });

    // 监听消息事件
    this.ws.on('message', (event: MessageEvent) => {
      this.handleMessage(event.data);
    });

    // 监听错误事件
    this.ws.on('error', (event: Event) => {
      this.handleConnectionError(event);
    });

    // 监听关闭事件
    this.ws.on('close', (event: CloseEvent) => {
      this.handleConnectionClose(event);
    });

    await this.ws.connect({
      url: this.config.url,
      timeout: this.config.timeout || 10000,
      headers: {
        Authorization: `Bearer ${this.config.authorization || ''}`,
        'Protocol-Version': (this.config.version || 1).toString(),
        'Device-Id': this.config.deviceId || '',
        'Client-Id': this.config.clientId || '',
      },
    });
  }

  /**
   * 处理连接成功
   */
  private handleConnectionOpen(event: Event): void {
    // 重置重连计数器
    this.reconnectAttempts = 0;
    
    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.updateConnectionState(ConnectionStateEnum.CONNECTED, true);
    this.emit('connected');

    // 重连成功后发送待处理的消息
    this.sendPendingMessages();
  }

  /**
   * 处理连接错误
   */
  private handleConnectionError(error: any): void {
    const errorMsg = error instanceof ErrorEvent ? error.error : 
                    error instanceof Error ? error.message : 
                    'WebSocket error occurred';
    this.updateConnectionState(ConnectionStateEnum.ERROR, false, String(errorMsg));
    this.emit('error', String(errorMsg));

    // 如果不是手动断开连接，则尝试重连
    if (!this.isManualDisconnect) {
      this.scheduleReconnect();
    }
  }

  /**
   * 处理连接关闭
   */
  private handleConnectionClose(event: CloseEvent): void {
    const closeReason = `Connection closed: ${event.code} - ${event.reason}`;
    
    // 如果不是手动断开连接，则更新状态为重连中
    if (!this.isManualDisconnect) {
      this.updateConnectionState(ConnectionStateEnum.RECONNECTING, false, closeReason);
      this.scheduleReconnect();
    } else {
      this.updateConnectionState(ConnectionStateEnum.DISCONNECTED, false, closeReason);
    }
    
    this.emit('disconnected');
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    // 防止重复安排重连
    if (this.reconnectTimer || this.isManualDisconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      // 达到最大重连次数或手动断开连接，不再重连
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('error', `Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = this.calculateReconnectDelay();

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(async () => {
      // 清除定时器引用
      this.reconnectTimer = null;
      
      try {
        if (this.config && !this.isManualDisconnect) {
          await this.createWebSocketConnection();
        }
      } catch (error) {
        console.error('Reconnection failed:', error);
        // 只有在不是手动断开连接的情况下才继续重连
        if (!this.isManualDisconnect) {
          this.scheduleReconnect();
        }
      }
    }, delay);
  }

  /**
   * 计算重连延迟（指数退避算法）
   */
  private calculateReconnectDelay(): number {
    // 指数退避算法，最大延迟为30秒
    const baseDelay = this.reconnectInterval;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempts - 1), maxDelay);
    return delay;
  }

  /**
   * 发送待处理的消息
   */
  private sendPendingMessages(): void {
    const now = Date.now();
    const validMessages = this.pendingMessages.filter(msg => 
      now - msg.timestamp < this.maxPendingMessageAge
    );

    validMessages.forEach(msg => {
      try {
        this.sendMessage(msg.message);
      } catch (error) {
        console.error('Failed to send pending message:', error);
      }
    });

    // 更新待处理消息列表
    this.pendingMessages = validMessages;
  }

  disconnect(): void {
    // 标记为手动断开连接，避免自动重连
    this.isManualDisconnect = true;
    
    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // 清除待处理消息
    this.pendingMessages = [];

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.updateConnectionState(ConnectionStateEnum.DISCONNECTED, false);
    this.emit('disconnected');
  }

  sendMessage(message: RequestProtocol): void {
    // 如果连接未建立，将消息加入待处理队列
    if (!this.isConnected()) {
      if (this._state.state === ConnectionStateEnum.RECONNECTING) {
        // 检查队列容量
        if (this.pendingMessages.length >= this.maxPendingMessages) {
          // 队列已满，移除最旧的消息
          this.pendingMessages.shift();
        }
        
        // 重连过程中，将消息加入队列等待重连成功后发送
        this.pendingMessages.push({
          message,
          timestamp: Date.now()
        });
        console.log(`Message queued for later delivery (reconnecting, queue size: ${this.pendingMessages.length}/${this.maxPendingMessages})`);
        return;
      } else {
        throw new Error('WebSocket is not connected');
      }
    }

    try {
      const json: string = this.protocolEncoder?.encode(message) as string;
      this.ws?.send(json);
    } catch (error) {
      this.emit('error', `Failed to send message: ${error}`);
    }
  }

  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number): void {
    // 音频数据通常不需要队列，直接检查连接状态
    if (!this.isConnected()) {
      throw new Error('WebSocket not connected');
    }

    if (protocolVersion === 2 || protocolVersion === 3) {
      // 使用二进制协议版本
      const buffer = this.createBinaryProtocolData(audioData, protocolVersion);
      this.ws?.send(buffer);
    } else {
      // 直接发送音频数据
      this.ws?.send(audioData);
    }
  }

  /** 发送 Hello 消息 */
  sendHello(message: HelloRequestProtocol): void {
    // 如果连接未建立，将Hello消息加入待处理队列
    if (!this.isConnected()) {
      if (this._state.state === ConnectionStateEnum.RECONNECTING) {
        // 重连过程中，将Hello消息加入队列等待重连成功后发送
        this.pendingMessages.push({
          message: message as any, // HelloRequestProtocol兼容RequestProtocol
          timestamp: Date.now()
        });
        console.log('Hello message queued for later delivery (reconnecting)');
        return;
      } else {
        throw new Error('WebSocket is not connected');
      }
    }
    
    const json: string = this.protocolEncoder?.encode(message) as string;
    this.ws?.send(json);
  }

  private handleMessage(data: any): void {
    try {
      if (typeof data === 'string') {
        // JSON消息处理
        const message: ResponseProtocol = this.protocolDecoder?.decode(data) as ResponseProtocol;
        this.emit('message', message)
      } else {
        // 二进制音频数据处理
        this.emit('audio-data', data);
      }
    } catch (error) {
      this.emit('error', `Failed to parse message: ${error}`);
    }
  }

  private createBinaryProtocolData(audioData: ArrayBuffer, protocolVersion: number): ArrayBuffer {
    if (protocolVersion !== 2 && protocolVersion !== 3) {
      return audioData;
    }

    const headerSize = protocolVersion === 2 ? 16 : 4;
    const buffer = new ArrayBuffer(headerSize + audioData.byteLength);
    const view = new DataView(buffer);

    if (protocolVersion === 2) {
      view.setUint16(0, protocolVersion, false);
      view.setUint16(2, 0, false); // type: OPUS
      view.setUint32(4, 0, false); // reserved
      view.setUint32(8, Date.now(), false); // timestamp
      view.setUint32(12, audioData.byteLength, false); // payload_size
    } else {
      view.setUint8(0, 0); // type: OPUS
      view.setUint8(1, 0); // reserved
      view.setUint16(2, audioData.byteLength, false); // payload_size
    }

    const payload = new Uint8Array(buffer, headerSize);
    payload.set(new Uint8Array(audioData));

    return buffer;
  }

  destroy(): void {
    // 标记为手动断开连接
    this.isManualDisconnect = true;
    
    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // 清除待处理消息
    this.pendingMessages = [];

    // 断开连接
    if (this.ws) {
      this.ws.destroy();
      this.ws = null;
    }

    // 移除所有监听器
    this.removeAllListeners();

    // 重置状态
    this.updateConnectionState(ConnectionStateEnum.DISCONNECTED, false);
  }

  /**
   * 获取当前连接状态详情
   */
  getConnectionState(): ConnectionState {
    return { ...this._state };
  }

  /**
   * 获取WebSocket就绪状态
   */
  getReadyState(): WebSocketReadyState {
    return this.ws?.readyState || WebSocketReadyState.CLOSED;
  }
}

export default WebSocketTransportProvider;
