# SDKWork AIoT SDK

[![npm version](https://img.shields.io/npm/v/sdkwork-ai-iot-sdk.svg)](https://www.npmjs.com/package/sdkwork-ai-iot-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

一个基于 TypeScript 的 AIoT（人工智能物联网）SDK，支持 WebSocket、MQTT、悟空IM等多种传输协议，提供设备连接、语音交互、数据收发等核心功能。

## ✨ 特性

- 🚀 **多协议支持**: 支持 WebSocket、MQTT、悟空IM等多种传输协议
- 📦 **多平台兼容**: 支持浏览器、Node.js、小程序、UniApp等环境
- 🛡️ **类型安全**: 完整的 TypeScript 类型定义
- 🎯 **设备管理**: 设备连接、状态监控、控制命令发送
- 🔊 **语音交互**: 支持语音识别、语音合成、实时音频传输
- 🔔 **事件系统**: 完善的事件监听和错误处理
- 🎨 **模块化设计**: 高度抽象的Transport接口，易于扩展

## 📦 安装

### NPM 安装
```bash
npm install sdkwork-ai-iot-sdk
# 或
yarn add sdkwork-ai-iot-sdk
```

### CDN 引入 (浏览器环境)
```html
<!-- 使用最新版本 -->
<script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>

<!-- 或指定版本 -->
<script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@1.0.0/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>
```

## 🚀 快速开始

### 浏览器环境使用

#### 通过 CDN 引入
```html
<!DOCTYPE html>
<html>
<head>
    <title>SDKWork AIoT Demo</title>
</head>
<body>
    <button id="connectBtn">连接设备</button>
    <button id="listenBtn" disabled>开始监听</button>
    <div id="status">状态: 未连接</div>
    <div id="messages"></div>

    <script src="https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/umd/sdkwork-ai-iot-sdk.min.js"></script>
    <script>
        // 使用全局变量 SDKWorkAIoT
        const { SdkworkAIoTClient } = SDKWorkAIoT;
        
        // 方案1: 使用API Key认证 (适合前端应用)
        const client = new SDKWorkAIoT.SdkworkAIoTClient({
            apiKey: 'your-api-key',
            deviceId: 'device-001',
            baseUrl: 'wss://api.sdkwork.com/aiot',
            protocol: 'websocket'
        });

        // 方案2: 使用Authorization认证 (适合后端应用，更安全)
        // const client = new SDKWorkAIoT.SdkworkAIoTClient({
        //     authorization: 'Bearer your-jwt-token',
        //     deviceId: 'device-001',
        //     baseUrl: 'wss://api.sdkwork.com/aiot',
        //     authType: 'authorization'
        // });

        // 连接设备
        document.getElementById('connectBtn').addEventListener('click', async () => {
            try {
                await client.initialize();
                document.getElementById('status').textContent = '状态: 已连接';
                document.getElementById('listenBtn').disabled = false;
            } catch (error) {
                console.error('连接失败:', error);
            }
        });

        // 开始语音监听
        document.getElementById('listenBtn').addEventListener('click', () => {
            client.startListening();
        });

        // 监听事件
        client.onEvent('stt_result', (event) => {
            const messages = document.getElementById('messages');
            messages.innerHTML += `<div>语音识别: ${event.data.text}</div>`;
        });

        client.onEvent('llm_response', (event) => {
            const messages = document.getElementById('messages');
            messages.innerHTML += `<div>AI回复: ${event.data.text}</div>`;
        });
    </script>
</body>
</html>
```

#### 通过 ES Module 引入
```html
<!DOCTYPE html>
<html>
<head>
    <title>SDKWork AIoT ES Module Demo</title>
    <script type="module">
        import { SdkworkAIoTClient } from 'https://cdn.jsdelivr.net/npm/sdkwork-ai-iot-sdk@latest/dist/esm/sdkwork-ai-iot-sdk.min.js';
        
        const client = new SdkworkAIoTClient({
            apiKey: 'your-api-key',
            deviceId: 'device-001',
            baseUrl: 'wss://api.sdkwork.com/aiot'
        });

        // 使用方式同上
    </script>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### Node.js 环境使用

#### 基本使用
```typescript
import { SdkworkAIoTClient } from 'sdkwork-ai-iot-sdk';

// 方案1: 使用API Key认证 (适合前端应用)
const client = new SdkworkAIoTClient({
    apiKey: 'your-api-key',
    deviceId: 'device-001',
    baseUrl: 'wss://api.sdkwork.com/aiot',
    protocol: 'websocket',
    timeout: 10000
});

// 方案2: 使用Authorization认证 (适合后端应用，更安全)
// const client = new SdkworkAIoTClient({
//     authorization: 'Bearer your-jwt-token',
//     deviceId: 'device-001',
//     baseUrl: 'wss://api.sdkwork.com/aiot',
//     authType: 'authorization',
//     timeout: 10000
// });

// 初始化连接
await client.initialize();

// 开始语音监听
client.startListening();

// 发送控制命令
client.sendControlCommand({
    deviceId: 'device-001',
    command: 'light_on',
    parameters: { brightness: 80 },
    timestamp: new Date()
});

// 监听语音识别结果
client.onEvent('stt_result', (event) => {
    console.log('语音识别结果:', event.data.text);
});

// 监听AI回复
client.onEvent('llm_response', (event) => {
    console.log('AI回复:', event.data.text);
});

// 监听错误
client.onError((error) => {
    console.error('发生错误:', error);
});
```

### 高级用法

#### 使用不同的传输协议
```typescript
import { SdkworkAIoTClient } from 'sdkwork-ai-iot-sdk';

// 使用 WebSocket 协议
const wsClient = new SdkworkAIoTClient({
    protocol: 'websocket',
    baseUrl: 'wss://api.sdkwork.com/aiot'
});

// 使用 MQTT 协议 (待实现)
const mqttClient = new SdkworkAIoTClient({
    protocol: 'mqtt',
    baseUrl: 'mqtt://api.sdkwork.com:1883'
});

// 使用悟空IM协议 (待实现)
const wukongClient = new SdkworkAIoTClient({
    protocol: 'wukongim',
    baseUrl: 'wss://im.sdkwork.com'
});
```

#### 自定义传输提供者
```typescript
import { BaseTransportProvider, TransportProvider, TransportConfig } from 'sdkwork-ai-iot-sdk';

class CustomTransportProvider extends BaseTransportProvider implements TransportProvider {
    public readonly name = 'custom';
    public readonly version = '1.0.0';
    public readonly supported = true;

    async connect(config: TransportConfig): Promise<void> {
        // 实现自定义连接逻辑
        console.log('连接到自定义传输协议...');
    }

    disconnect(): void {
        // 实现断开连接逻辑
    }

    sendMessage(message: any): void {
        // 实现消息发送逻辑
    }

    sendAudioData(audioData: ArrayBuffer, protocolVersion?: number): void {
        // 实现音频数据传输逻辑
    }

    destroy(): void {
        // 实现销毁逻辑
    }
}
```

## 📚 API 参考

### SdkworkAIoTClient

#### 构造函数
```typescript
new SdkworkAIoTClient(config: SdkworkAIotConfig)
```

**配置参数:**
- `deviceId: string` - **必需** 设备ID
- `apiKey?: string` - API 密钥 (方案1: 前端应用)
- `authorization?: string` - 认证令牌 (方案2: 后端应用，更安全)
- `authType?: AuthType` - 认证类型，自动检测或手动指定 ('apiKey' | 'authorization')
- `baseUrl?: string` - 服务器地址
- `protocol?: TransportProtocol` - 传输协议，默认 'websocket'
- `timeout?: number` - 超时时间，默认 10000ms
- `audioParams?: AudioParams` - 音频参数
- `features?: DeviceFeatures` - 设备特性

**认证方案说明:**
- **API Key方案**: 适合前端应用，简单易用，但API Key暴露在客户端
- **Authorization方案**: 适合后端应用，通过JWT等令牌认证，更安全
- **自动检测**: 当同时提供apiKey和authorization时，优先使用authorization

#### 核心方法

##### initialize()
初始化客户端并建立连接
```typescript
await client.initialize();
```

##### disconnect()
断开连接
```typescript
client.disconnect();
```

##### startListening()
开始语音监听
```typescript
client.startListening();
```

##### stopListening()
停止语音监听
```typescript
client.stopListening();
```

##### sendAudioData(audioData: ArrayBuffer, protocolVersion?: number)
发送音频数据
```typescript
// 从麦克风获取音频数据后发送
const audioData = await getAudioFromMicrophone();
client.sendAudioData(audioData);
```

##### sendControlCommand(command: ControlCommand)
发送控制命令
```typescript
client.sendControlCommand({
    deviceId: 'light-001',
    command: 'toggle',
    parameters: { state: 'on' },
    timestamp: new Date()
});
```

##### getConnectionState(): ConnectionState
获取连接状态
```typescript
const state = client.getConnectionState();
console.log('连接状态:', state);
```

##### isConnected(): boolean
检查是否已连接
```typescript
if (client.isConnected()) {
    // 执行需要连接的操作
}
```

#### 事件监听

##### onEvent(eventType: string, callback: EventCallback)
监听事件
```typescript
client.onEvent('stt_result', (event) => {
    console.log('语音识别结果:', event.data.text);
});

client.onEvent('llm_response', (event) => {
    console.log('AI回复:', event.data.text);
});

client.onEvent('tts_control', (event) => {
    console.log('语音合成控制:', event.data);
});
```

##### onData(callback: DataCallback)
监听数据回调
```typescript
client.onData((sensorData) => {
    console.log('传感器数据:', sensorData);
});
```

##### onError(callback: ErrorCallback)
错误处理
```typescript
client.onError((error) => {
    console.error('发生错误:', error);
});
```

### 事件类型

- `connected` - 连接建立
- `disconnected` - 连接断开
- `stt_result` - 语音识别结果
- `llm_response` - AI回复
- `tts_control` - 语音合成控制
- `error` - 错误事件

## 🏗️ 项目结构

```
sdkwork-ai-iot-sdk/
├── src/
│   ├── client/              # 客户端实现
│   │   └── client.ts        # 主客户端类 SdkworkAIoTClient
│   ├── transport/           # 传输层
│   │   ├── transport.ts     # Transport 接口和基础实现
│   │   ├── protocol.ts      # 协议定义
│   │   ├── providers/       # 传输提供者
│   │   │   ├── websocket/   # WebSocket 提供者
│   │   │   ├── mqtt/        # MQTT 提供者
│   │   │   └── wukong/      # 悟空IM提供者
│   │   ├── websocket/       # WebSocket 多平台封装
│   │   │   ├── browser/     # 浏览器环境实现
│   │   │   ├── miniprogram/ # 小程序环境实现
│   │   │   ├── uniapp/      # UniApp环境实现
│   │   │   └── index.ts     # 统一入口
│   │   └── codec/           # 编解码器
│   ├── types/               # 类型定义
│   │   ├── index.ts         # 核心类型定义
│   │   └── globals.d.ts     # 全局类型声明
│   ├── __tests__/           # 单元测试
│   └── index.ts             # 入口文件
├── examples/                # 示例代码
│   ├── browser-example/     # 浏览器示例
│   ├── vue-example/         # Vue 示例
│   ├── react-example/       # React 示例
│   ├── react-native-example/ # React Native 示例
│   ├── miniprogram-example/ # 小程序示例
│   ├── uniapp-example/      # UniApp 示例
│   └── harmonyos-example/   # HarmonyOS 示例
├── docs/                    # 协议文档
│   ├── websocket.md         # WebSocket协议文档
│   ├── mqtt-udp.md          # MQTT/UDP协议文档
│   ├── mcp-protocol.md      # MCP协议文档
│   └── mcp-usage.md         # MCP使用指南
├── prompts/                 # 需求文档
├── dist/                    # 构建输出
└── package.json            # 项目配置
```

## 🔧 开发指南

### 环境要求

- Node.js 16+
- npm 或 yarn
- TypeScript 5.0+

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建项目
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 添加新的传输协议

1. 在 `src/transport/providers/` 下创建新的提供者目录
2. 实现 TransportProvider 接口
3. 在 `src/transport/providers/index.ts` 中导出
4. 更新类型定义
5. 添加单元测试

## 📋 示例项目

项目包含完整的示例代码，支持多种开发框架和平台：

### 浏览器示例 (Browser Example)
位于 `examples/browser-example/`
- 纯 HTML/CSS/JavaScript 实现
- CDN 直接引入方式演示
- 设备连接和语音交互界面
- 实时事件日志显示

### Vue 示例
位于 `examples/vue-example/`
- Vue 3 + TypeScript
- Composition API 状态管理
- 设备连接状态监控
- 实时语音识别和AI回复界面

### React 示例  
位于 `examples/react-example/`
- React 18 + TypeScript
- Hooks 状态管理
- 响应式 UI 组件设计
- 事件驱动的交互逻辑

### React Native 示例
位于 `examples/react-native-example/`
- React Native 跨平台移动应用
- 原生组件集成
- 移动端优化界面

### 小程序示例 (Miniprogram Example)
位于 `examples/miniprogram-example/`
- 微信小程序原生开发
- 小程序环境适配
- 平台特定API集成

### UniApp 示例
位于 `examples/uniapp-example/`
- UniApp 跨端开发框架
- 一套代码多端运行
- 支持H5、小程序、App等多平台

### HarmonyOS 示例
位于 `examples/harmonyos-example/`
- HarmonyOS 原生应用开发
- 鸿蒙生态系统集成
- 原生性能优化

## 🔧 构建配置

项目支持多种输出格式：

- **CommonJS** (.cjs) - Node.js 环境
- **ES Module** (.mjs) - 现代打包工具
- **UMD** (.umd.js) - 浏览器全局变量
- **Minified** (.min.js) - 生产环境压缩版

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 技术支持

- 📧 邮箱: support@sdkwork.com
- 🐛 Bug 报告: [GitHub Issues](https://github.com/sdkwork/ai-iot-sdk/issues)
- 💬 讨论区: [GitHub Discussions](https://github.com/sdkwork/ai-iot-sdk/discussions)

## 🔄 更新日志

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- ✨ 多协议传输支持
- 📦 浏览器和Node.js兼容
- 🛡️ 完整TypeScript类型定义
- 🔊 语音交互功能
- 🎯 设备控制命令

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！