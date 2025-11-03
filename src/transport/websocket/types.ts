/**
 * WebSocket连接状态
 */
export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

/**
 * WebSocket配置接口
 */
export interface WebSocketConfig {
  /** 连接URL */
  url: string;
  /** 协议数组 */
  protocols?: string[];
  /** 连接超时时间（毫秒） */
  timeout?: number;
  /** 重连次数 */
  reconnectAttempts?: number;
  /** 重连间隔（毫秒） */
  reconnectInterval?: number;
  /** 心跳间隔（毫秒） */
  heartbeatInterval?: number;
  /** 自定义头部 */
  headers?: Record<string, string>;
  /** 其他自定义配置 */
  [key: string]: any;
}

/**
 * WebSocket事件类型
 */
export interface WebSocketEvents {
  /** 连接打开 */
  open: (event: Event) => void;
  /** 收到消息 */
  message: (event: MessageEvent) => void;
  /** 连接关闭 */
  close: (event: CloseEvent) => void;
  /** 发生错误 */
  error: (event: Event) => void;
}

/**
 * 统一的WebSocket接口
 */
export interface UnifiedWebSocket {
  /** 当前连接状态 */
  readonly readyState: WebSocketReadyState;
  /** 连接URL */
  readonly url: string;
  /** 协议 */
  readonly protocol: string;

  /** 检查是否已连接 */
  isOpen(): boolean;
  /** 连接到服务器 */
  connect(config: WebSocketConfig): Promise<void>;
  /** 发送消息 */
  send(data: string | ArrayBuffer): void;
  /** 关闭连接 */
  close(code?: number, reason?: string): void;
  /** 添加事件监听器 */
  on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void;
  /** 移除事件监听器 */
  off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void;
  /** 销毁实例 */
  destroy(): void;
}
