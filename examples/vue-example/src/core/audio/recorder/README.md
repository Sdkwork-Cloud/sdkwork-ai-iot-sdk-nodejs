# Audio Recorder Module

基于 recorder-core 库的音频录制解决方案，支持文件录制和实时流式传输，提供可选的波形可视化功能。

## 🚀 特性

### 核心功能
- ✅ **文件录制** - 录制音频并生成 Blob 文件
- ✅ **实时流式传输** - 实时音频数据流处理
- ✅ **多格式支持** - PCM、MP3、WAV 格式
- ✅ **状态管理** - 完整的录制状态机
- ✅ **错误处理** - 完善的错误分类和处理

### 波形可视化（可选）
- ✅ **实时波形显示** - 录制过程中实时显示音频波形
- ✅ **样式自定义** - 可配置波形颜色、大小、样式
- ✅ **条件性启用** - 默认禁用，需要明确配置
- ✅ **错误隔离** - WaveView 错误不影响核心录制功能

## 📦 安装

```bash
# 确保已安装 recorder-core
npm install recorder-core
```

## 🎯 快速开始

### 基础录制（无波形显示）

```typescript
import { AudioRecorder } from './audio/recorder';

// 创建录制器实例
const recorder = new AudioRecorder({
  sampleRate: 16000,
  format: 'pcm'
});

// 初始化并录制
await recorder.initialize();
await recorder.startRecordToFile();

// 录制中...

// 停止录制并获取音频文件
const audioBlob = await recorder.stopRecord();

// 清理资源
recorder.destroy();
```

### 带波形显示的录制

```typescript
import { AudioRecorder } from './audio/recorder';

// 创建带波形显示的录制器
const recorder = new AudioRecorder({
  sampleRate: 16000,
  format: 'pcm',
  waveView: {
    enable: true,
    container: '#wave-container', // 或 HTMLElement
    width: 400,
    height: 120,
    lineColor: '#ff6b6b',
    lineWidth: 3
  }
});

await recorder.initialize();
await recorder.startRecordToFile();

// 录制过程中会实时显示波形

const audioBlob = await recorder.stopRecord();
recorder.destroy();
```

### 实时流式录制

```typescript
const recorder = new AudioRecorder({ sampleRate: 16000 });
await recorder.initialize();

await recorder.startRecordStream({
  onData: (audioData) => {
    // 处理实时音频数据
    console.log('Received audio chunk:', audioData.byteLength);
  },
  onError: (error) => {
    console.error('Stream error:', error);
  },
  onComplete: () => {
    console.log('Stream completed');
  }
});

// 流式录制中...

await recorder.stopRecord();
recorder.destroy();
```

## 📖 API 文档

### AudioRecorder 类

#### 构造函数
```typescript
new AudioRecorder(options?: AudioRecorderOptions)
```

#### 核心方法

**initialize()** - 初始化录制器
```typescript
async initialize(): Promise<void>
```

**startRecordToFile()** - 开始文件录制
```typescript
async startRecordToFile(): Promise<void>
```

**startRecordStream()** - 开始流式录制
```typescript
async startRecordStream(callback: RecordStreamCallback): Promise<void>
```

**stopRecord()** - 停止录制
```typescript
async stopRecord(): Promise<Blob | null>
```

**pauseRecord()** - 暂停录制
```typescript
pauseRecord(): void
```

**resumeRecord()** - 恢复录制
```typescript
resumeRecord(): void
```

**destroy()** - 销毁录制器
```typescript
destroy(): void
```

#### 状态查询方法

**getRecordingState()** - 获取录制状态
```typescript
getRecordingState(): boolean
```

**getState()** - 获取详细状态
```typescript
getState(): RecordingState
```

**getStats()** - 获取统计信息
```typescript
getStats(): RecordingStats
``` 

**isWaveViewEnabled()** - 检查波形显示是否启用
```typescript
isWaveViewEnabled(): boolean
```

**toggleWaveView()** - 动态启用/禁用波形显示
```typescript
async toggleWaveView(enable: boolean): Promise<boolean>
```

#### 遗留接口（向后兼容）

**start()** - 开始录制（文件模式）
```typescript
async start(): Promise<void>
```

**stop()** - 停止录制并返回结果
```typescript
async stop(): Promise<RecordResult>
```

**isRecording()** - 检查录制状态
```typescript
isRecording(): boolean
```

**dispose()** - 销毁录制器
```typescript
dispose(): void
```

### 工具函数

**isRecordingSupported()** - 检查浏览器支持
```typescript
function isRecordingSupported(): boolean
```

**createAudioRecorder()** - 工厂函数
```typescript
function createAudioRecorder(options?: AudioRecorderOptions): AudioRecorder
```

**getSupportedFormats()** - 获取支持的格式
```typescript
function getSupportedFormats(): string[]
```

**getDefaultOptions()** - 获取默认配置
```typescript
function getDefaultOptions(): AudioRecorderOptions
```

**getDefaultWaveViewOptions()** - 获取默认波形配置
```typescript
function getDefaultWaveViewOptions(): WaveViewOptions
```

**validateOptions()** - 验证配置选项
```typescript
function validateOptions(options: AudioRecorderOptions): { valid: boolean; errors: string[] }
```

## ⚙️ 配置选项

### AudioRecorderOptions

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| sampleRate | number | 16000 | 音频采样率 (Hz) |
| bitRate | number | 128 | 音频比特率 (kbps) |
| channels | number | 1 | 音频通道数 |
| format | 'pcm'\|'mp3'\|'wav' | 'pcm' | 音频格式 |
| waveView | WaveViewOptions | { enable: false } | 波形显示配置 |

### WaveViewOptions

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| enable | boolean | false | 是否启用波形显示 |
| container | HTMLElement\|string | - | 波形图容器 |
| width | number | 300 | 波形图宽度 |
| height | number | 100 | 波形图高度 |
| lineWidth | number | 2 | 线条宽度 |
| lineColor | string | '#409EFF' | 线条颜色 |
| backgroundColor | string | 'transparent' | 背景颜色 |

## 🎨 状态管理

### RecordingState 枚举

```typescript
export enum RecordingState {
  IDLE = 'idle',           // 空闲状态
  INITIALIZING = 'initializing', // 初始化中
  RECORDING = 'recording', // 录制中
  PAUSED = 'paused',       // 已暂停
  STOPPED = 'stopped',     // 已停止
  ERROR = 'error'         // 错误状态
}
```

### 状态转换图

```
IDLE → INITIALIZING → IDLE → RECORDING → PAUSED → RECORDING → STOPPED → IDLE
     ↓                           ↓
     ERROR ←---------------------←
```

## 🚨 错误处理

### AudioRecorderErrorType 枚举

```typescript
export enum AudioRecorderErrorType {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RECORDING_IN_PROGRESS = 'RECORDING_IN_PROGRESS',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  WAVEVIEW_INIT_FAILED = 'WAVEVIEW_INIT_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

### 错误处理示例

```typescript
try {
  await recorder.initialize();
} catch (error) {
  if (error instanceof AudioRecorderError) {
    switch (error.type) {
      case AudioRecorderErrorType.PERMISSION_DENIED:
        console.error('麦克风权限被拒绝');
        break;
      case AudioRecorderErrorType.INITIALIZATION_FAILED:
        console.error('录制器初始化失败');
        break;
    }
  }
}
```

## 🔧 高级用法

### 动态控制波形显示

```typescript
// 创建录制器（初始禁用波形）
const recorder = new AudioRecorder({
  sampleRate: 16000,
  waveView: { enable: false }
});

await recorder.initialize();

// 录制过程中动态启用波形显示
await recorder.toggleWaveView(true);

// 录制...

// 动态禁用波形显示
await recorder.toggleWaveView(false);
```

### 获取详细统计信息

```typescript
const stats = recorder.getStats();
console.log('录制状态:', stats.state);
console.log('录制时长:', stats.duration + '秒');
console.log('数据大小:', stats.dataSize + '字节');
console.log('波形显示:', stats.waveViewEnabled ? '启用' : '禁用');
console.log('波形可用:', stats.waveViewAvailable ? '是' : '否');
```

### 配置验证

```typescript
import { validateOptions } from './audio/recorder';

const options = {
  sampleRate: 44100,
  format: 'mp3',
  waveView: { enable: true }
};

const validation = validateOptions(options);
if (!validation.valid) {
  console.error('配置错误:', validation.errors);
} else {
  const recorder = new AudioRecorder(options);
}
```

## 🐛 常见问题

### Q: 波形显示不工作怎么办？
A: 检查以下事项：
1. 确保 `waveView.enable` 设置为 `true`
2. 确保容器元素存在且可见
3. 检查浏览器控制台是否有错误信息 

### Q: 录制权限被拒绝？
A: 确保：
1. 网站使用 HTTPS（生产环境）
2. 用户已授权麦克风权限
3. 浏览器支持 Web Audio API

### Q: 如何选择合适的采样率？
A: 推荐配置：
- 语音识别：16000 Hz
- 音乐录制：44100 Hz
- 高质量音频：48000 Hz

## 📋 浏览器兼容性

| 浏览器 | 录制支持 | 波形显示 | 备注 |
|--------|----------|----------|------|
| Chrome | ✅ | ✅ | 完全支持 |
| Firefox | ✅ | ✅ | 完全支持 |
| Safari | ✅ | ⚠️ | 部分波形功能可能受限 |
| Edge | ✅ | ✅ | 完全支持 |

## 🔄 更新日志

### v2.0.0 (当前版本)
- ✅ 新增波形可视化功能
- ✅ 完善的状态管理系统
- ✅ 增强的错误处理机制
- ✅ 向后兼容的 API 设计
- ✅ 完整的 TypeScript 类型定义

### v1.0.0 (基础版本)
- ✅ 基础音频录制功能
- ✅ 文件录制和流式传输
- ✅ 多格式音频支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 使用前请确保已正确安装 `recorder-core` 依赖，并在支持的环境中运行。