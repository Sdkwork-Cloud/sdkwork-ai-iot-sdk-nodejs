import { WebSocketReadyState, WebSocketConfig, WebSocketEvents, UnifiedWebSocket } from '../types';

/**
 * 小程序环境WebSocket实现（微信小程序）
 */
export class MiniProgramWebSocket implements UnifiedWebSocket {
  private socketTask: any = null;
  private listeners: Map<keyof WebSocketEvents, Set<Function>> = new Map();
  private _readyState: WebSocketReadyState = WebSocketReadyState.CLOSED;
  private _url: string = '';
  private _protocol: string = '';

  public get readyState(): WebSocketReadyState {
    return this._readyState;
  }

  public get url(): string {
    return this._url;
  }

  public get protocol(): string {
    return this._protocol;
  }

  async connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._url = config.url;
        this._readyState = WebSocketReadyState.CONNECTING;

        this.socketTask = wx!.connectSocket({
          url: config.url,
          protocols: config.protocols,
          header: config.headers,
        });

        // 连接成功
        this.socketTask.onOpen(() => {
          this._readyState = WebSocketReadyState.OPEN;
          this.emit('open', new Event('open'));
          resolve();
        });

        // 收到消息
        this.socketTask.onMessage((res: any) => {
          const event = new MessageEvent('message', {
            data: res.data,
          });
          this.emit('message', event);
        });

        // 连接关闭
        this.socketTask.onClose((res: any) => {
          this._readyState = WebSocketReadyState.CLOSED;
          const event = new CloseEvent('close', {
            code: res.code,
            reason: res.reason,
          });
          this.emit('close', event);
        });

        // 发生错误
        this.socketTask.onError((res: any) => {
          this.emit('error', new Event('error'));
          reject(new Error(res.errMsg));
        });

        // 设置连接超时
        setTimeout(() => {
          if (this._readyState !== WebSocketReadyState.OPEN) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, config.timeout || 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  send(data: string | ArrayBuffer): void {
    if (this.socketTask && this._readyState === WebSocketReadyState.OPEN) {
      this.socketTask.send({
        data: data,
      });
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  close(code?: number, reason?: string): void {
    if (this.socketTask) {
      this.socketTask.close({
        code: code,
        reason: reason,
      });
    }
  }

  on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  destroy(): void {
    this.close();
    this.listeners.clear();
    this.socketTask = null;
    this._readyState = WebSocketReadyState.CLOSED;
  }

  private emit<K extends keyof WebSocketEvents>(
    event: K,
    ...args: Parameters<WebSocketEvents[K]>
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
}

export default MiniProgramWebSocket;
