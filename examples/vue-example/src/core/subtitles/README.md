# 字幕处理器 (Subtitles Handler)

一个功能完善的字幕处理库，支持多种字幕格式、多源加载、流式字幕处理和播放器同步。

## 特性

- ✅ **多格式支持**: SRT, VTT, LRC, ASS, SSA 等主流字幕格式
- ✅ **多源加载**: URL、文件、Blob、字符串等多种加载方式
- ✅ **双模式支持**: PLAYER模式（播放器）和 STREAM模式（实时流）
- ✅ **流式字幕**: 支持实时语音转文字、AI对话等场景
- ✅ **播放器同步**: 精确的时间同步和字幕显示控制
- ✅ **事件系统**: 完善的事件监听机制
- ✅ **类型安全**: 完整的 TypeScript 类型定义

## 安装

```bash
npm install @your-org/subtitles-handler
# 或
yarn add @your-org/subtitles-handler
```

## 快速开始

### 基本使用

```typescript
import { createSubtitlesHandler } from './subtitles';

// 创建字幕处理器
const handler = createSubtitlesHandler();

// 加载字幕文件
await handler.loadFromUrl('https://example.com/subtitles.srt');

// 监听字幕变化
handler.onDisplayChange((event) => {
    console.log(`[${event.currentTime}ms] ${event.entry?.text}`);
});

// 开始同步播放
handler.startSync();
```

### 播放器模式示例

```typescript
import { SubtitlesHandlerFactory } from './subtitles-handler';

// 创建播放器模式的处理器
const handler = SubtitlesHandlerFactory.createPlayerHandler({
    syncInterval: 100,      // 同步间隔100ms
    preloadTime: 200,       // 提前200ms预加载
    smoothTransition: true  // 启用平滑过渡
});

// 加载字幕
await handler.loadFromFile(subtitleFile);

// 模拟播放进度
setInterval(() => {
    const currentTime = Date.now();
    handler.updatePlaybackTime(currentTime);
}, 100);
```

### 流模式示例

```typescript
import { SubtitlesHandlerFactory } from './subtitles-handler';

// 创建流模式的处理器
const handler = SubtitlesHandlerFactory.createStreamHandler({
    displayDuration: 5000,    // 字幕显示5秒
    maxDisplayCount: 3,       // 最多同时显示3条字幕
    autoClearExpired: true    // 自动清除过期字幕
});

// 添加实时字幕
handler.addStreamSubtitle(
    "这是实时字幕",
    Date.now(),
    Date.now() + 3000
);
```

## API 文档

### SubtitlesHandler 接口

#### 加载方法

- `loadFromUrl(url: string): Promise<Subtitles>` - 从URL加载字幕
- `loadFromFile(file: File): Promise<Subtitles>` - 从文件加载字幕
- `loadFromBlob(blob: Blob): Promise<Subtitles>` - 从Blob加载字幕
- `loadFromString(content: string): Promise<Subtitles>` - 从字符串加载字幕

#### 流式字幕处理

- `addStreamSubtitle(text: string, startTime: number, endTime: number): SubtitleEntry` - 添加流式字幕

#### 播放器同步

- `startSync(): void` - 开始播放器同步
- `stopSync(): void` - 停止播放器同步
- `updatePlaybackTime(currentTime: number): SubtitleEntry | null` - 更新播放时间
- `getCurrentSubtitle(): SubtitleEntry | null` - 获取当前显示的字幕

#### 事件监听

- `onDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void` - 监听字幕显示变化
- `offDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void` - 移除监听
- `on(event: SubtitlesHandlerEvent, callback): void` - 通用事件监听
- `off(event: SubtitlesHandlerEvent, callback): void` - 移除通用事件监听

#### 管理方法

- `clear(): void` - 清除所有字幕

### 模式说明

#### PLAYER 模式（播放器模式）

**适用场景**: 视频播放器、音乐播放器

**特点**:
- 通过播放进度时间触发字幕显示
- 字幕按时间顺序显示
- 支持预加载和延迟显示
- 支持跳转、暂停等播放控制

**配置选项**:
```typescript
interface PlayerModeConfig {
    syncInterval?: number;      // 同步间隔（毫秒）
    preloadTime?: number;        // 提前显示时间（毫秒）
    delayTime?: number;         // 延迟显示时间（毫秒）
    smoothTransition?: boolean; // 是否启用平滑过渡
    maxCachedEntries?: number;   // 最大缓存字幕数
}
```

#### STREAM 模式（流模式）

**适用场景**: 实时语音转文字、AI对话、直播字幕

**特点**:
- 根据时间获取最新的字幕
- 字幕按接收顺序显示
- 支持实时更新和自动清除
- 可配置显示持续时间和最大显示数量

**配置选项**:
```typescript
interface StreamModeConfig {
    displayDuration?: number;    // 显示持续时间（毫秒）
    maxDisplayCount?: number;   // 最大同时显示字幕数
    autoClearExpired?: boolean;  // 是否自动清除过期字幕
    expireThreshold?: number;   // 过期时间阈值（毫秒）
    allowOverwrite?: boolean;   // 是否支持字幕覆盖
}
```

### 事件类型

```typescript
export enum SubtitlesHandlerEvent {
    LOAD_START = 'loadStart',      // 字幕加载开始
    LOAD_COMPLETE = 'loadComplete', // 字幕加载完成
    LOAD_ERROR = 'loadError',      // 字幕加载错误
    DISPLAY_CHANGE = 'displayChange', // 字幕显示变化
    STREAM_ADDED = 'streamAdded',  // 流字幕添加
    SYNC_START = 'syncStart',      // 字幕同步开始
    SYNC_STOP = 'syncStop',        // 字幕同步停止
    CLEARED = 'cleared'           // 字幕清空
}
```

### 数据结构

#### SubtitleEntry（字幕条目）
```typescript
interface SubtitleEntry {
    sequence?: number;    // 字幕序号
    startTime?: number;   // 开始时间（毫秒）
    endTime?: number;     // 结束时间（毫秒）
    text?: string;       // 字幕文本内容
    texts?: string[];     // 字幕文本内容（多行）
}
```

#### Subtitles（字幕对象）
```typescript
interface Subtitles {
    entries?: SubtitleEntry[]; // 字幕条目列表
    format?: SubtitleFormat;   // 字幕格式类型
    language?: string;         // 字幕语言
    duration?: number;         // 媒体时长（秒）
}
```

## 使用场景

### 视频播放器

```typescript
class VideoPlayer {
    private handler: SubtitlesHandler;
    
    constructor() {
        this.handler = SubtitlesHandlerFactory.createHandlerForScenario('video');
        this.setupSubtitles();
    }
    
    private setupSubtitles() {
        this.handler.onDisplayChange((event) => {
            this.updateSubtitleDisplay(event.entry?.text || '');
        });
    }
    
    async loadVideoWithSubtitles(videoUrl: string, subtitleUrl: string) {
        await this.handler.loadFromUrl(subtitleUrl);
        this.handler.startSync();
    }
    
    onTimeUpdate(currentTime: number) {
        this.handler.updatePlaybackTime(currentTime * 1000);
    }
}
```

### 音乐播放器（歌词显示）

```typescript
class MusicPlayer {
    private handler: SubtitlesHandler;
    
    constructor() {
        this.handler = SubtitlesHandlerFactory.createHandlerForScenario('music');
    }
    
    async loadLyrics(lyricsContent: string) {
        await this.handler.loadFromString(lyricsContent);
        this.handler.startSync();
    }
    
    onPlaybackProgress(currentTime: number) {
        this.handler.updatePlaybackTime(currentTime * 1000);
    }
}
```

### 实时语音转文字

```typescript
class SpeechToText {
    private handler: SubtitlesHandler;
    
    constructor() {
        this.handler = SubtitlesHandlerFactory.createHandlerForScenario('speech');
    }
    
    onSpeechResult(text: string, startTime: number, endTime: number) {
        this.handler.addStreamSubtitle(text, startTime, endTime);
    }
    
    getCurrentSubtitles(): string {
        return this.handler.getCurrentSubtitle()?.text || '';
    }
}
```

### AI对话系统

```typescript
class AIChatSystem {
    private handler: SubtitlesHandler;
    
    constructor() {
        this.handler = SubtitlesHandlerFactory.createHandlerForScenario('ai');
    }
    
    onAIResponse(text: string) {
        const startTime = Date.now();
        const endTime = startTime + 5000; // 显示5秒
        this.handler.addStreamSubtitle(text, startTime, endTime);
    }
}
```

## 配置示例

### 视频播放器配置

```typescript
const videoHandler = SubtitlesHandlerFactory.createPlayerHandler({
    syncInterval: 100,      // 100ms同步一次
    preloadTime: 200,        // 提前200ms预加载字幕
    delayTime: 0,           // 无延迟
    smoothTransition: true,  // 启用平滑过渡
    maxCachedEntries: 1000    // 最多缓存1000条字幕
});
```

### 实时语音配置

```typescript
const speechHandler = SubtitlesHandlerFactory.createStreamHandler({
    displayDuration: 3000,    // 每条字幕显示3秒
    maxDisplayCount: 1,      // 只显示最新的一条字幕
    autoClearExpired: true,  // 自动清除过期字幕
    expireThreshold: 5000,   // 5秒后过期
    allowOverwrite: false    // 不允许覆盖
});
```

### AI对话配置

```typescript
const aiHandler = SubtitlesHandlerFactory.createStreamHandler({
    displayDuration: 5000,    // 每条字幕显示5秒
    maxDisplayCount: 3,      // 最多同时显示3条字幕
    autoClearExpired: true,  // 自动清除过期字幕
    expireThreshold: 10000,  // 10秒后过期
    allowOverwrite: true     // 允许覆盖旧字幕
});
```

## 工具函数

```typescript
import { SubtitleUtils } from './subtitles';

// 格式化时间
const formattedTime = SubtitleUtils.formatTime(1234567); // "20:34.567"

// 解析时间字符串
const milliseconds = SubtitleUtils.parseTime("01:23.456"); // 83456

// 清理字幕文本
const cleanText = SubtitleUtils.cleanText("<b>Hello</b> {color:red}World"); // "Hello World"

// 验证字幕条目
const isValid = SubtitleUtils.validateEntry(subtitleEntry); // boolean
```

## 错误处理

```typescript
try {
    await handler.loadFromUrl('invalid-url.srt');
} catch (error) {
    console.error('字幕加载失败:', error);
    
    // 监听加载错误事件
    handler.on(SubtitlesHandlerEvent.LOAD_ERROR, (event) => {
        console.error('字幕加载错误事件:', event);
    });
}
```

## 性能优化建议

1. **合理配置同步间隔**: 视频播放器建议100ms，实时语音建议30-50ms
2. **限制缓存数量**: 避免内存泄漏，设置合理的最大缓存条目数
3. **及时清理资源**: 使用完毕后调用 `clear()` 方法
4. **合理使用事件监听**: 及时移除不需要的事件监听器

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发指南

### 添加新的字幕格式

1. 实现 `SubtitleParser` 接口
2. 实现 `SubtitleGenerator` 接口  
3. 在 `SubtitleProcessorFactory` 中注册

### 自定义事件处理

```typescript
class CustomSubtitlesHandler extends DefaultSubtitlesHandler {
    override updatePlaybackTime(currentTime: number): SubtitleEntry | null {
        // 自定义时间更新逻辑
        const result = super.updatePlaybackTime(currentTime);
        // 自定义处理
        return result;
    }
}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本字幕格式
- 实现双模式字幕处理器
- 完善的事件系统