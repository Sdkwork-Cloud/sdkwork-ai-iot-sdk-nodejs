// 统一的WebSocket封装入口
// 支持浏览器、小程序、uniapp等环境，自动选择对应的实现

export * from './types';
export * from './environment';
export * from './factory';
export { default as BrowserWebSocket } from './browser';
export { default as MiniProgramWebSocket } from './miniprogram';
export { default as UniappWebSocket } from './uniapp';

import { WebSocketConfig, UnifiedWebSocket } from './types';
import { UnifiedWebSocketFactory } from './factory';

/**
 * 创建统一的WebSocket实例
 */
export function createUnifiedWebSocket(config: WebSocketConfig): UnifiedWebSocket {
  return UnifiedWebSocketFactory.create(config);
}

/**
 * 检查WebSocket支持情况
 */
export function isWebSocketSupported(): boolean {
  return UnifiedWebSocketFactory.isSupported();
}

// 默认导出
export default {
  createUnifiedWebSocket,
  isWebSocketSupported,
  UnifiedWebSocketFactory,
  EnvironmentDetector: import('./environment').then(m => m.EnvironmentDetector),
  BrowserWebSocket: import('./browser').then(m => m.default),
  MiniProgramWebSocket: import('./miniprogram').then(m => m.default),
  UniappWebSocket: import('./uniapp').then(m => m.default),
};
