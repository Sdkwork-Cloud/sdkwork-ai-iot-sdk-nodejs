/**
 * 环境检测工具
 */
export class EnvironmentDetector {
  /**
   * 检测当前运行环境
   */
  static detectEnvironment(): 'browser' | 'miniprogram' | 'uniapp' | 'node' | 'unknown' {
    // 检测浏览器环境
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return 'browser';
    }

    // 检测小程序环境（微信、支付宝等）
    if (typeof wx !== 'undefined' && typeof wx.connectSocket === 'function') {
      return 'miniprogram';
    }

    // 检测uniapp环境
    if (typeof uni !== 'undefined' && typeof uni.connectSocket === 'function') {
      return 'uniapp';
    }

    // 检测Node.js环境
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      return 'node';
    }

    return 'unknown';
  }

  /**
   * 检查是否支持原生WebSocket
   */
  static supportsNativeWebSocket(): boolean {
    return typeof WebSocket !== 'undefined';
  }

  /**
   * 检查是否支持小程序WebSocket
   */
  static supportsMiniProgramWebSocket(): boolean {
    return typeof wx !== 'undefined' && typeof wx.connectSocket === 'function';
  }

  /**
   * 检查是否支持uniapp WebSocket
   */
  static supportsUniappWebSocket(): boolean {
    return typeof uni !== 'undefined' && typeof uni.connectSocket === 'function';
  }
}
