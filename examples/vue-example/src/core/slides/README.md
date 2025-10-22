# 智能PPT语音同步播放器

## 🎯 项目概述

**SmartSlidesHandler** 是一个高度优化的PPT语音同步播放器，能够根据语音播放时间自动切换幻灯片页面。支持播放器模式和实时模式，提供精确的时间同步和智能的幻灯片切换功能。

## ✨ 核心特性

### 🎮 双模式支持
- **播放器模式**：适用于预录制语音讲解，按时间线自动切换
- **实时模式**：适用于实时语音讲解，根据语音内容动态切换

### ⚡ 高性能算法
- 智能时间同步机制
- 高效的幻灯片查找算法
- 支持预加载和延迟切换
- 内存优化和垃圾回收

### 🔧 易用性设计
- 简洁的API接口
- 完善的事件系统
- 详细的错误处理
- 类型安全的TypeScript支持

### 🚀 扩展性架构
- 模块化设计
- 插件化扩展支持
- 多数据源加载
- 自定义配置

## 📦 快速开始

### 安装依赖
```bash
npm install
```

### 基础使用
```typescript
import { SmartSlidesHandler, SlidesHandlerMode } from './slides';

// 创建播放器实例
const handler = new SmartSlidesHandler({
    mode: SlidesHandlerMode.PLAYER,
    syncConfig: {
        syncInterval: 100,
        preloadTime: 200,
        delayTime: 0,
        smoothTransition: true
    }
});

// 加载幻灯片数据
const slides = await handler.loadFromString(JSON.stringify({
    title: "我的演示文稿",
    items: [
        {
            sequence: 1,
            title: "第一页",
            content: "这是第一页内容",
            duration: 5000
        },
        {
            sequence: 2,
            title: "第二页", 
            content: "这是第二页内容",
            duration: 3000
        }
    ]
}));

// 监听幻灯片切换事件
handler.onDisplayChange((event) => {
    console.log('幻灯片切换:', {
        当前: event.currentSlide?.title,
        上一个: event.previousSlide?.title,
        时间: event.currentTime
    });
});

// 开始同步
handler.startSync();

// 更新播放时间（模拟语音播放进度）
handler.updatePlaybackTime(2000); // 2秒
```

## 🔧 API 文档

### 构造函数
```typescript
new SmartSlidesHandler(config?: SlidesHandlerConfig)
```

**配置参数：**
- `mode`: 播放模式（PLAYER/REALTIME）
- `syncConfig`: 同步配置
- `defaultLanguage`: 默认语言

### 核心方法

#### 数据加载
- `loadFromUrl(url)`: 从URL加载
- `loadFromFile(file)`: 从文件加载  
- `loadFromBlob(blob)`: 从Blob加载
- `loadFromString(content)`: 从JSON字符串加载

#### 播放控制
- `startSync()`: 开始同步
- `stopSync()`: 停止同步
- `updatePlaybackTime(time)`: 更新播放时间
- `goToSlide(index)`: 跳转到指定幻灯片
- `goToPreviousSlide()`: 上一页
- `goToNextSlide()`: 下一页

#### 实时模式
- `addRealtimeSlide(slide, startTime, endTime)`: 添加实时幻灯片
- `processSpeechRecognition(text, confidence, timestamp)`: 处理语音识别

#### 状态查询
- `getCurrentSlide()`: 获取当前幻灯片
- `getCurrentSlideIndex()`: 获取当前索引
- `getTotalSlides()`: 获取总页数
- `isPlaying()`: 是否在播放中

### 事件系统

#### 事件监听
```typescript
// 显示变化事件
handler.onDisplayChange((event) => {
    // 处理幻灯片切换
});

// 特定事件监听
handler.on(SlidesHandlerEvent.LOAD_COMPLETE, (event) => {
    // 加载完成处理
});
```

#### 支持的事件类型
- `LOAD_START`: 加载开始
- `LOAD_COMPLETE`: 加载完成  
- `LOAD_ERROR`: 加载错误
- `DISPLAY_CHANGE`: 显示变化
- `SYNC_START`: 同步开始
- `SYNC_STOP`: 同步停止
- `RECOGNITION_RESULT`: 识别结果
- `CLEARED`: 清除完成

## 🎯 使用场景

### 1. 预录制语音讲解
```typescript
// 播放器模式 - 适合录播课程
const handler = new SmartSlidesHandler({
    mode: SlidesHandlerMode.PLAYER
});

// 加载带时间线的幻灯片
await handler.loadFromUrl('/api/slides/123');

// 开始播放
handler.startSync();

// 随着语音播放更新进度
audioPlayer.onTimeUpdate((time) => {
    handler.updatePlaybackTime(time);
});
```

### 2. 实时语音讲解
```typescript
// 实时模式 - 适合直播讲解
const handler = new SmartSlidesHandler({
    mode: SlidesHandlerMode.REALTIME
});

// 处理语音识别结果
speechRecognizer.onResult((text, confidence, timestamp) => {
    handler.processSpeechRecognition(text, confidence, timestamp);
});
```

### 3. 混合模式应用
```typescript
// 结合预录制和实时讲解
const handler = new SmartSlidesHandler({
    mode: SlidesHandlerMode.PLAYER
});

// 基础幻灯片时间线
await handler.loadFromFile(slidesFile);

// 实时添加补充内容
handler.addRealtimeSlide({
    sequence: 99,
    title: "实时补充",
    content: "这是实时添加的内容",
    keywords: ["补充", "实时"]
}, currentTime, currentTime + 3000);
```

## 🔍 高级功能

### 智能时间同步
播放器采用智能时间同步算法，支持：
- **预加载时间**：提前加载下一张幻灯片
- **延迟切换**：延迟切换避免频繁跳动
- **平滑过渡**：支持动画过渡效果

### 语音识别集成
内置语音识别关键词匹配：
- 关键词优先匹配
- 内容模糊匹配
- 置信度阈值控制

### 性能优化
- **内存管理**：自动清理无用数据
- **算法优化**：高效的时间查找算法
- **事件防抖**：避免频繁事件触发

## 🛠️ 开发指南

### 自定义扩展
```typescript
// 继承基类实现自定义功能
class CustomSlidesHandler extends SmartSlidesHandler {
    // 添加自定义方法
    async loadFromPowerPoint(file: File): Promise<Slides> {
        // 实现PPT文件解析
    }
    
    // 重写时间同步逻辑
    protected handlePlayerModeTimeUpdate(currentTime: number): SlideItem | null {
        // 自定义时间同步算法
    }
}
```

### 错误处理
```typescript
try {
    await handler.loadFromUrl(invalidUrl);
} catch (error) {
    if (error instanceof Error) {
        console.error('加载失败:', error.message);
    }
}
```

### 性能监控
```typescript
// 监控幻灯片切换性能
const startTime = performance.now();
handler.goToSlide(targetIndex);
const endTime = performance.now();
console.log(`切换耗时: ${endTime - startTime}ms`);
```

## 📊 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 加载时间 | < 100ms | 小型幻灯片文件 |
| 切换响应 | < 50ms | 幻灯片切换延迟 |
| 内存占用 | < 10MB | 100页幻灯片 |
| CPU使用率 | < 5% | 正常播放状态 |

## 🔮 未来规划

### 短期目标
- [ ] 支持PPT/PDF原生格式
- [ ] 添加动画效果配置
- [ ] 集成更多语音识别引擎

### 长期愿景  
- [ ] 云端同步支持
- [ ] AI智能内容推荐
- [ ] 多语言国际化
- [ ] 插件生态系统

## 🤝 贡献指南

我们欢迎各种形式的贡献！请参考：
1. 提交Issue报告问题
2. 发起Pull Request
3. 完善文档
4. 分享使用案例

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

## 📞 技术支持

如有问题或建议，请通过以下方式联系：
- GitHub Issues: 提交技术问题
- 文档: 查看详细使用说明
- 示例: 参考示例代码

---

**让语音与幻灯片完美同步，创造流畅的演示体验！** 🎤📊