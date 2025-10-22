// Transport 模块主入口文件
// 导出所有 transport 相关的接口和实现

// 导出基础接口和类型
export * from './transport';

// 导出提供者
export * from './providers';

// 导出编解码器
export * from './codec';

/**
 * 创建默认的 Transport 管理器
 */
export async function createDefaultTransportManager() {
  const { createTransportManager } = await import('./transport');
  const { WebSocketTransportProvider } = await import('./providers/websocket/websocket-transport');

  const manager = createTransportManager();
  const websocketProvider = new WebSocketTransportProvider();

  manager.registerProvider(websocketProvider);
  manager.setDefaultProvider('websocket');

  return manager;
}

/**
 * 快速创建 WebSocket Transport
 */
export async function createWebSocketTransport(config: any) {
  const { WebSocketTransportProvider } = await import('./providers/websocket/websocket-transport');
  const provider = new WebSocketTransportProvider();

  if (config) {
    await provider.connect(config);
  }

  return provider;
}

// 默认导出
export default {
  createDefaultTransportManager,
  createWebSocketTransport,
};
