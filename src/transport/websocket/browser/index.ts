import { WebSocketReadyState, WebSocketConfig, WebSocketEvents, UnifiedWebSocket } from '../types';

/**
 * 浏览器环境WebSocket实现
 */
export class BrowserWebSocket implements UnifiedWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<keyof WebSocketEvents, Set<Function>> = new Map();

  public get readyState(): WebSocketReadyState {
    return this.ws ? this.ws.readyState : WebSocketReadyState.CLOSED;
  }

  public get url(): string {
    return this.ws ? this.ws.url : '';
  }

  public get protocol(): string {
    return this.ws ? this.ws.protocol : '';
  }

  async connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Validate URL format
        if (!config.url || !/^wss?:\/\//i.test(config.url)) {
          throw new Error(`Invalid WebSocket URL: ${config.url}`);
        }

        console.log('Connecting to WebSocket:', config.url, 'Protocols:', config.protocols);

        // 处理headers - 转换为查询参数
        let finalUrl = config.url;
        if (config.headers) {
          const params = new URLSearchParams();
          Object.entries(config.headers).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
          });
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString();
        }

        this.ws = new WebSocket(finalUrl, config.protocols);

        // 设置连接超时
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, config.timeout || 10000);

        this.ws.onopen = event => {
          console.log('websocket onopen', event);
          clearTimeout(timeout);
          this.emit('open', event);
          resolve();
        };

        this.ws.onmessage = event => {
          this.emit('message', event);
        };

        this.ws.onclose = event => {
          this.emit('close', event);
        };

        this.ws.onerror = event => {
          let errorMsg = `WebSocket connection failed to ${config.url}`;
          const isLocalhost = config.url.includes('localhost') || config.url.includes('127.0.0.1');
          const isSecure = config.url.startsWith('wss://');
          const port = new URL(config.url).port;

          // Enhanced diagnostics
          if (this.ws?.readyState === WebSocketReadyState.CLOSED) {
            errorMsg += ` (Connection closed - Possible causes: `;
            errorMsg += isLocalhost
              ? `1. Server not running on port ${port} `
              : `1. Network blocked `;
            errorMsg += `2. Invalid endpoint 3. Server rejected connection)`;
          } else if (isLocalhost) {
            errorMsg += ` (Check: 1. Server running on port ${port} 2. CORS enabled 3. Correct endpoint path)`;
          } else if (isSecure && location.protocol === 'http:') {
            errorMsg += ` (Mixed content - cannot use wss:// on http page)`;
          }

          const error = new Error(errorMsg);
          console.error('WebSocket connection failed:', {
            url: config.url,
            readyState: this.ws?.readyState,
            error: event,
            environment: {
              isLocalhost,
              isSecure,
              currentProtocol: location.protocol,
              currentHost: location.host,
            },
            possibleSolutions: [
              isLocalhost ? 'Verify server is running and accessible' : '',
              isLocalhost ? 'Check server logs for connection attempts' : '',
              'Ensure CORS is properly configured on server',
              'Try wss:// if on HTTPS page',
              'Test with WebSocket client tool to isolate issue',
            ].filter(Boolean),
          });
          clearTimeout(timeout);
          this.emit('error', event);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  send(data: string | ArrayBuffer): void {
    if (this.ws && this.ws.readyState === WebSocketReadyState.OPEN) {
      this.ws.send(data);
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  close(code?: number, reason?: string): void {
    if (this.ws) {
      this.ws.close(code, reason);
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
    this.ws = null;
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

export default BrowserWebSocket;
