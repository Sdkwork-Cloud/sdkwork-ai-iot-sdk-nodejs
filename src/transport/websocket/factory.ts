import { WebSocketConfig, UnifiedWebSocket } from './types';
import { EnvironmentDetector } from './environment';
import BrowserWebSocket from './browser';
import MiniProgramWebSocket from './miniprogram';
import UniappWebSocket from './uniapp';

/**
 * 统一的WebSocket工厂类
 * 根据环境自动选择对应的实现
 */
export class UnifiedWebSocketFactory {
  /**
   * 创建适合当前环境的WebSocket实例
   */
  static create(config: WebSocketConfig): UnifiedWebSocket {
    const env = EnvironmentDetector.detectEnvironment();

    switch (env) {
      case 'browser':
        return new BrowserWebSocket();

      case 'miniprogram':
        return new MiniProgramWebSocket();

      case 'uniapp':
        return new UniappWebSocket();

      case 'node':
        // Node.js环境可以使用ws库，这里返回浏览器实现作为fallback
        return new BrowserWebSocket();

      default:
        // 未知环境，尝试使用浏览器实现
        if (EnvironmentDetector.supportsNativeWebSocket()) {
          return new BrowserWebSocket();
        }
        throw new Error(`Unsupported environment: ${env}`);
    }
  }

  /**
   * 检查当前环境是否支持WebSocket
   */
  static isSupported(): boolean {
    const env = EnvironmentDetector.detectEnvironment();

    switch (env) {
      case 'browser':
        return EnvironmentDetector.supportsNativeWebSocket();

      case 'miniprogram':
        return EnvironmentDetector.supportsMiniProgramWebSocket();

      case 'uniapp':
        return EnvironmentDetector.supportsUniappWebSocket();

      case 'node':
        return true; // Node.js可以通过ws库支持

      default:
        return false;
    }
  }
}
