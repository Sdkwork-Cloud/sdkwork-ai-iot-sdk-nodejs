# SDKWork Subtitles 字幕组件

一个功能完善的字幕显示组件，支持多种字幕格式、显示模式和实时字幕处理。

## 功能特性

### 🎯 核心功能
- **多格式支持**: SRT、LRC、VTT 等主流字幕格式
- **多种显示模式**: 全屏、卡片、行模式自由切换
- **实时字幕处理**: 支持语音识别、实时翻译等场景
- **播放器集成**: 完整的播放控制和时间同步

### 🎨 显示模式
- **全屏模式**: 沉浸式全屏字幕显示
- **卡片模式**: 优雅的卡片式字幕展示
- **行模式**: 多行历史字幕滚动显示

### ⚡ 高级特性
- **动态字幕**: 实时添加和更新字幕内容
- **智能动画**: 平滑的字幕切换和过渡效果
- **响应式设计**: 完美适配各种屏幕尺寸
- **无障碍支持**: 完整的键盘导航和屏幕阅读器支持

## 快速开始

### 安装依赖

确保项目中已安装必要的依赖：

```bash
npm install pinia vue@3
```

### 基本使用

```vue
<template>
  <div class="video-player">
    <!-- 视频播放器 -->
    <video ref="videoRef" @timeupdate="handleTimeUpdate">
      <source src="video.mp4" type="video/mp4">
    </video>
    
    <!-- 字幕组件 -->
    <sdkwork-subtitles
      :content="subtitleContent"
      :current-time="currentTime"
      :is-playing="isPlaying"
      @entry-change="handleEntryChange"
      @load-complete="handleLoadComplete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SdkworkSubtitles from '@/components/sdkwork-subtitles/sdkwork-subtitles.vue'

const videoRef = ref()
const currentTime = ref(0)
const isPlaying = ref(false)
const subtitleContent = ref(`
1
00:00:01,000 --> 00:00:04,000
这是第一条字幕

2
00:00:05,000 --> 00:00:08,000
这是第二条字幕
`)

const handleTimeUpdate = () => {
  currentTime.value = videoRef.value.currentTime * 1000
}

const handleEntryChange = (entry, time) => {
  console.log('字幕切换:', entry, time)
}

const handleLoadComplete = (time) => {
  console.log('字幕加载完成:', time)
}
</script>
```

## 属性说明

### 字幕输入
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string` | - | 字幕内容字符串 |
| `url` | `string` | - | 字幕文件URL |
| `subtitles` | `Subtitles` | - | Subtitles对象 |

### 显示配置
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `displayMode` | `SubtitleDisplayMode` | `'card'` | 显示模式：`fullscreen`、`card`、`line` |
| `lineCount` | `number` | `3` | 行模式下的显示行数 |
| `fontSize` | `number` | `16` | 字体大小(px) |
| `fontColor` | `string` | `'#ffffff'` | 字体颜色 |
| `backgroundColor` | `string` | `'rgba(0,0,0,0.7)'` | 背景颜色 |
| `showBackground` | `boolean` | `true` | 是否显示背景 |
| `position` | `string` | `'bottom'` | 位置：`top`、`center`、`bottom` |

### 播放控制
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currentTime` | `number` | `0` | 当前播放时间(毫秒) |
| `isPlaying` | `boolean` | `false` | 是否正在播放 |
| `duration` | `number` | - | 媒体总时长(秒) |

## 事件说明

### 字幕事件
- `load-start`: 字幕加载开始
- `load-complete`: 字幕加载完成
- `load-error`: 字幕加载错误
- `entry-change`: 字幕条目切换
- `mode-change`: 显示模式变化
- `content-update`: 字幕内容更新

### 控制事件
- `fullscreen-change`: 全屏状态变化
- `seek-to`: 跳转到指定时间

## 方法说明

### 字幕操作
```typescript
// 获取组件实例
const subtitleRef = ref()

// 加载字幕
subtitleRef.value.loadFromString(content)
subtitleRef.value.loadFromUrl(url)
subtitleRef.value.loadFromObject(subtitles)

// 清除字幕
subtitleRef.value.clearSubtitles()
```

### 动态字幕
```typescript
// 添加动态字幕（实时语音识别）
subtitleRef.value.addDynamicSubtitle('识别结果', startTime, endTime)

// 批量添加
subtitleRef.value.addDynamicSubtitles([
  { text: '第一条', startTime: 0, endTime: 1000 },
  { text: '第二条', startTime: 1000, endTime: 2000 }
])

// 清除动态字幕
subtitleRef.value.clearDynamicSubtitles()
```

### 播放控制
```typescript
// 播放控制
subtitleRef.value.startPlayback()
subtitleRef.value.pausePlayback()
subtitleRef.value.resumePlayback()
subtitleRef.value.stopPlayback()

// 时间控制
subtitleRef.value.seekTo(5000) // 跳转到5秒
subtitleRef.value.updatePlaybackTime(3000) // 更新到3秒
```

### 显示模式
```typescript
// 切换显示模式
subtitleRef.value.switchDisplayMode('fullscreen')
subtitleRef.value.switchDisplayMode('card', { fontSize: 20 })
subtitleRef.value.toggleFullscreen()
```

## 使用场景示例

### 音乐播放器字幕
```vue
<template>
  <div class="music-player">
    <audio ref="audioRef" @timeupdate="handleTimeUpdate">
      <source src="music.mp3" type="audio/mpeg">
    </audio>
    
    <sdkwork-subtitles
      :content="lyricsContent"
      :current-time="currentTime"
      :is-playing="isPlaying"
      display-mode="line"
      :line-count="5"
      font-color="#ff6b6b"
    />
  </div>
</template>
```

### 实时语音识别
```vue
<template>
  <div class="speech-recognition">
    <sdkwork-subtitles
      ref="subtitleRef"
      display-mode="card"
      :show-controls="false"
    />
    
    <button @click="startRecognition">开始识别</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const subtitleRef = ref()

const startRecognition = () => {
  // 模拟实时语音识别结果
  setInterval(() => {
    const text = '识别到的语音内容'
    const startTime = Date.now()
    const endTime = startTime + 3000 // 显示3秒
    
    subtitleRef.value.addDynamicSubtitle(text, startTime, endTime)
  }, 1000)
}
</script>
```

### 实时翻译
```vue
<template>
  <div class="translation-app">
    <sdkwork-subtitles
      ref="translationRef"
      display-mode="fullscreen"
      font-size="24"
      :show-background="false"
    />
    
    <input v-model="sourceText" @input="handleTranslation" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const translationRef = ref()
const sourceText = ref('')

const handleTranslation = async () => {
  // 模拟翻译API调用
  const translatedText = await translateText(sourceText.value)
  
  const startTime = Date.now()
  const endTime = startTime + 5000 // 显示5秒
  
  translationRef.value.addDynamicSubtitle(translatedText, startTime, endTime)
}
</script>
```

## 高级配置

### 自定义主题
```vue
<sdkwork-subtitles
  :config="{
    displayMode: 'card',
    fontSize: 18,
    fontColor: '#ff6b6b',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    showBackground: true
  }"
/>
```

### 响应式配置
```vue
<sdkwork-subtitles
  :config="{
    displayMode: isMobile ? 'line' : 'card',
    fontSize: isMobile ? 14 : 16,
    lineCount: isMobile ? 2 : 3
  }"
/>
```

## 技术架构

### 组件结构
```
sdkwork-subtitles/
├── sdkwork-subtitles.vue      # 主组件
├── types.ts                   # 类型定义
├── components/                # 子组件
│   ├── fullscreen-display.vue # 全屏显示
│   ├── card-display.vue       # 卡片显示
│   ├── line-display.vue       # 行模式显示
│   ├── settings-dialog.vue    # 设置对话框
│   └── subtitle-list-dialog.vue # 字幕列表
└── README.md                  # 文档
```

### 依赖关系
- **Vue 3**: 组件框架
- **Pinia**: 状态管理
- **TypeScript**: 类型支持
- **SDKWork Core**: 核心字幕处理

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持基本字幕功能
- 三种显示模式
- 动态字幕处理