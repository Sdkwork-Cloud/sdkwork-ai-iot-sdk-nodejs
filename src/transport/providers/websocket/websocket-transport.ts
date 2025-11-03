import { createUnifiedWebSocket, UnifiedWebSocket, WebSocketReadyState } from '../../websocket';
import { BaseTransportProvider, TransportProvider, TransportConfig } from '../../transport';
import { ConnectionStateEnum, DeviceState } from '../../../types/enums';
import {
  type RequestProtocol,
  type ResponseProtocol,
  type HelloRequestProtocol 
} from '../../../types/protocol';
import { ConnectionState } from '../../../types';
import { ChatContext } from 'sdkwork-sdk-api-typescript';

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
  private heartbeatTimer: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private heartbeatInterval = 30000; // 30秒心跳间隔
  private isManualDisconnect = false;
  private pendingMessages: Array<{message: RequestProtocol, timestamp: number}> = [];
  private maxPendingMessageAge = 30000; // 30秒
  private maxPendingMessages = 100; // 最大待处理消息数量
  private lastHeartbeatTime: number = 0;
  private connectionMetrics = {
    totalConnections: 0,
    successfulConnections: 0,
    failedConnections: 0,
    averageLatency: 0,
    lastLatency: 0
  }; 

  constructor() {
    super();
  }

  /**
   * 检查WebSocket是否已连接
   */
  isConnected(): boolean {
    return this.ws ? this.ws.isOpen() : false;
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

    // 检查是否已经在连接中，避免重复连接
    if (this.ws && this.ws.readyState === WebSocketReadyState.CONNECTING) {
      console.log('WebSocket is already connecting, waiting for current connection attempt...');
      return;
    }

    // 清除之前的连接和事件监听器
    if (this.ws) {
      // 直接销毁连接，事件监听器会自动清理
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

    // 绑定事件监听器（使用箭头函数确保正确的this上下文）
    this.ws.on('open', (event: Event) => this.handleConnectionOpen(event));
    this.ws.on('message', (event: MessageEvent) => this.handleMessage(event.data));
    this.ws.on('error', (event: Event) => this.handleConnectionError(event));
    this.ws.on('close', (event: CloseEvent) => this.handleConnectionClose(event));

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

    // 更新连接统计
    this.connectionMetrics.totalConnections++;
    this.connectionMetrics.successfulConnections++;

    this.updateConnectionState(ConnectionStateEnum.CONNECTED, true);
    this.emit('connected');

    // 启动心跳检测
    this.startHeartbeat();

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
    
    // 更新连接统计（只在连接相关错误时更新）
    if (this._state.state === ConnectionStateEnum.CONNECTING || 
        this._state.state === ConnectionStateEnum.CONNECTED) {
      this.connectionMetrics.totalConnections++;
      this.connectionMetrics.failedConnections++;
    }

    // 分类处理不同类型的错误
    const errorType = this.classifyConnectionError(error);
    
    this.updateConnectionState(ConnectionStateEnum.ERROR, false, `${errorType}: ${String(errorMsg)}`);
    this.emit('error', `${errorType}: ${String(errorMsg)}`);

    // 停止心跳检测
    this.stopHeartbeat();

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
    
    // 停止心跳检测
    this.stopHeartbeat();
    
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

    // 检查当前是否已经连接，避免不必要的重连
    if (this.ws && this.ws.readyState === WebSocketReadyState.OPEN) {
      console.log('WebSocket is already connected, skipping reconnection');
      this.reconnectAttempts = 0; // 重置重连计数器
      return;
    }

    // 检查网络状态
    if (!this.checkNetworkStatus()) {
      console.log('Network is offline, delaying reconnection...');
      // 网络离线时延迟重连
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.scheduleReconnect();
      }, 5000); // 5秒后重试
      return;
    }

    const delay = this.calculateReconnectDelay();

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(async () => {
      // 清除定时器引用
      this.reconnectTimer = null;
      
      try {
        if (this.config && !this.isManualDisconnect) {
          // 再次检查连接状态，避免重复连接
          if (this.ws && this.ws.readyState === WebSocketReadyState.OPEN) {
            console.log('WebSocket is already connected, skipping reconnection');
            this.reconnectAttempts = 0; // 重置重连计数器
            return;
          }
          
          // 检查是否已经在连接中
          if (this.ws && this.ws.readyState === WebSocketReadyState.CONNECTING) {
            console.log('WebSocket is already connecting, waiting...');
            return;
          }
          
          // 增加重连尝试次数
          this.reconnectAttempts++;
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

    // 停止心跳检测
    this.stopHeartbeat();

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

  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): void {
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
        
        // 检查是否是心跳响应
        if (this.isHeartbeatResponse(message)) {
          this.handleHeartbeatResponse();
          return;
        }
        
        this.emit('message', message)
      } else {
        // 二进制音频数据处理
        this.emit('audio-data', data);
      }
    } catch (error) {
      this.emit('error', `Failed to parse message: ${error}`);
    }
  }

  /**
   * 检查是否是心跳响应
   */
  private isHeartbeatResponse(message: any): boolean {
    return message && message.type === 'heartbeat' && message.timestamp;
  }

  /**
   * 处理心跳响应
   */
  private handleHeartbeatResponse(): void {
    // 更新最后心跳时间
    this.lastHeartbeatTime = Date.now();
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

  /**
   * 启动心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // 先停止可能存在的旧定时器
    
    this.lastHeartbeatTime = Date.now();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        // 发送心跳消息
        this.sendHeartbeat();
        
        // 检查心跳响应超时
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
        if (timeSinceLastHeartbeat > this.heartbeatInterval * 2) {
          console.warn('Heartbeat timeout detected, connection may be stale');
          this.handleHeartbeatTimeout();
        }
      }
    }, this.heartbeatInterval);
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 发送心跳消息
   */
  private sendHeartbeat(): void {
    if (this.isConnected() && this.protocolEncoder) {
      try {
        const heartbeatMessage = {
          type: 'heartbeat',
          timestamp: Date.now(),
          sequence: Math.random().toString(36).substring(7)
        };
        
        const json = this.protocolEncoder.encode(heartbeatMessage as any);
        this.ws?.send(json);
        
        // 记录心跳发送时间
        this.lastHeartbeatTime = Date.now();
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    }
  }

  /**
   * 处理心跳超时
   */
  private handleHeartbeatTimeout(): void {
    console.warn('Heartbeat timeout detected, connection may be stale');
    
    // 先尝试发送一次心跳来验证连接是否真的断开
    if (this.isConnected()) {
      try {
        this.sendHeartbeat();
        // 给服务器一点时间响应
        setTimeout(() => {
          const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime;
          if (timeSinceLastHeartbeat > this.heartbeatInterval * 3) {
            // 确认连接确实断开
            console.log('Heartbeat timeout confirmed, attempting to reconnect...');
            this.stopHeartbeat();
            this.updateConnectionState(ConnectionStateEnum.ERROR, false, 'Heartbeat timeout confirmed');
            
            if (!this.isManualDisconnect) {
              this.scheduleReconnect();
            }
          }
        }, 2000); // 等待2秒确认
      } catch (error) {
        // 发送心跳失败，确认连接断开
        console.log('Heartbeat send failed, connection is broken');
        this.stopHeartbeat();
        this.updateConnectionState(ConnectionStateEnum.ERROR, false, 'Heartbeat send failed');
        
        if (!this.isManualDisconnect) {
          this.scheduleReconnect();
        }
      }
    }
  }

  /**
   * 分类连接错误类型
   */
  private classifyConnectionError(error: any): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 网络相关错误
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'NETWORK_TIMEOUT';
    }
    
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection refused')) {
      return 'CONNECTION_REFUSED';
    }
    
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('not found')) {
      return 'DNS_RESOLUTION_FAILED';
    }
    
    if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
      return 'CORS_ERROR';
    }
    
    // 认证相关错误
    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return 'AUTHENTICATION_FAILED';
    }
    
    if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      return 'AUTHORIZATION_FAILED';
    }
    
    // WebSocket特定错误
    if (errorMessage.includes('WebSocket') || errorMessage.includes('websocket')) {
      return 'WEBSOCKET_ERROR';
    }
    
    // 默认错误类型
    return 'UNKNOWN_ERROR';
  }

  /**
   * 获取连接质量指标
   */
  getConnectionMetrics(): any {
    const successRate = this.connectionMetrics.totalConnections > 0 
      ? (this.connectionMetrics.successfulConnections / this.connectionMetrics.totalConnections) * 100 
      : 0;
    
    return {
      ...this.connectionMetrics,
      successRate: Math.round(successRate * 100) / 100, // 保留两位小数
      uptime: this._state.connectTime ? Date.now() - this._state.connectTime.getTime() : 0,
      isStable: successRate > 80 && this.connectionMetrics.totalConnections > 5
    };
  }

  /**
   * 检查网络连接状态
   */
  private checkNetworkStatus(): boolean {
    // 浏览器环境检查网络状态
    if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
      return navigator.onLine;
    }
    
    // Node.js环境或其他环境，默认返回true
    return true;
  }

  /**
   * 优化重连策略
   */
  private optimizeReconnectStrategy(): void {
    // 根据连接质量调整重连参数
    const metrics = this.getConnectionMetrics();
    
    if (metrics.successRate < 50) {
      // 连接质量差，增加重连间隔
      this.reconnectInterval = Math.min(this.reconnectInterval * 1.5, 10000);
      this.maxReconnectAttempts = Math.min(this.maxReconnectAttempts + 2, 10);
    } else if (metrics.successRate > 90) {
      // 连接质量好，减少重连间隔
      this.reconnectInterval = Math.max(this.reconnectInterval * 0.8, 1000);
    }
  }

  /**
   * 优雅降级：尝试备用连接方案
   */
  private async tryFallbackConnection(): Promise<boolean> {
    console.log('Attempting fallback connection...');
    
    // 这里可以实现备用连接方案，比如：
    // 1. 尝试不同的服务器地址
    // 2. 切换到长轮询或其他传输方式
    // 3. 使用本地缓存模式
    
    // 目前返回false表示没有可用的备用方案
    return false;
  }
}

export default WebSocketTransportProvider;
