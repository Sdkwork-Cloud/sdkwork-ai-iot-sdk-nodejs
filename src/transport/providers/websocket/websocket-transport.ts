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

    this.updateConnectionState(ConnectionStateEnum.CONNECTING, false);

    try {
      // 使用统一的WebSocket封装创建连接
      this.ws = createUnifiedWebSocket({
        url: config.url,
        timeout: config.timeout || 10000,
        headers: {
          Authorization: `Bearer ${config.authorization || ''}`,
          'Protocol-Version': (config.version || 1).toString(),
          'Device-Id': config.deviceId || '',
          'Client-Id': config.clientId || '',
        },
      });

      // 监听连接事件
      this.ws.on('open', (event: Event) => {
        this.updateConnectionState(ConnectionStateEnum.CONNECTED, true);
        this.emit('connected');
      });

      // 监听消息事件
      this.ws.on('message', (event: MessageEvent) => {
        this.handleMessage(event.data);
      });

      // 监听错误事件
      this.ws.on('error', (event: Event) => {
        const error = event instanceof ErrorEvent ? event.error : 'WebSocket error occurred';
        this.updateConnectionState(ConnectionStateEnum.DISCONNECTED, false, String(error));
        this.emit('error', String(error));
      });

      // 监听关闭事件
      this.ws.on('close', (event: CloseEvent) => {
        this.updateConnectionState(
          ConnectionStateEnum.DISCONNECTED,
          false,
          `Connection closed: ${event.code} - ${event.reason}`
        );
        this.emit('disconnected');
      });

      await this.ws.connect({
        url: config.url,
        timeout: config.timeout || 10000,
        headers: {
          Authorization: `Bearer ${config.authorization || ''}`,
          'Protocol-Version': (config.version || 1).toString(),
          'Device-Id': config.deviceId || '',
          'Client-Id': config.clientId || '',
        },
      });
    } catch (error) {
      this.updateConnectionState(
        ConnectionStateEnum.DISCONNECTED,
        false,
        error instanceof Error ? error.message : String(error)
      );
      this.emit('error', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateConnectionState(ConnectionStateEnum.DISCONNECTED, false);
    this.emit('disconnected');
  }

  sendMessage(message: RequestProtocol): void {
    if (!this.isConnected()) {
      throw new Error('WebSocket is not connected');
    }

    try {
      const json: string = this.protocolEncoder?.encode(message) as string;
      this.ws?.send(json);
    } catch (error) {
      this.emit('error', `Failed to send message: ${error}`);
    }
  }

  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number): void {
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
    if (!this.isConnected()) {
      throw new Error('WebSocket is not connected');
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
    this.disconnect();
    this.removeAllListeners();
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
