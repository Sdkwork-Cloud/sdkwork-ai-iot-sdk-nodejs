# SdkworkPlayerSlides 智能幻灯片播放组件

一个功能强大的智能幻灯片播放组件，支持多媒体同步播放、语音讲解、字幕显示等功能。

## 功能特性

- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎵 **多媒体同步** - 语音、视频与幻灯片精准同步
- 🎯 **智能切换** - 根据播放时间自动切换幻灯片
- 🎨 **多种模式** - 支持普通模式、演示模式、预览模式
- 🔧 **高度可配置** - 丰富的配置选项满足不同需求
- ♿ **无障碍支持** - 良好的键盘导航和屏幕阅读器支持

## 安装与使用

### 基本使用

```vue
<template>
  <sdkwork-player-slides
    :slides="slidesData"
    :autoplay="true"
    :show-controls="true"
    mode="presentation"
    @slide-change="handleSlideChange"
    @play="handlePlay"
    @pause="handlePause"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slidesData = ref({
  title: "演示文稿",
  items: [
    {
      sequence: 1,
      title: "第一页",
      content: "这是第一页的内容",
      startTime: 0,
      endTime: 5000,
      image: {
        url: "/images/slide1.jpg"
      }
    },
    {
      sequence: 2,
      title: "第二页", 
      content: "这是第二页的内容",
      startTime: 5000,
      endTime: 10000,
      html: "<div>自定义HTML内容</div>"
    }
  ],
  audio: {
    url: "/audio/presentation.mp3"
  }
})

const handleSlideChange = (slide, index) => {
  console.log(`切换到第${index + 1}页:`, slide.title)
}

const handlePlay = () => {
  console.log('开始播放')
}

const handlePause = () => {
  console.log('暂停播放')
}
</script>
```

### 完整配置示例

```vue
<template>
  <sdkwork-player-slides
    :slides="slidesData"
    :autoplay="false"
    :loop="false"
    :show-controls="true"
    :show-progress="true"
    :show-indicators="true"
    :show-audio-controls="true"
    :show-video-controls="true"
    :enable-audio="true"
    :enable-video="true"
    :enable-subtitles="true"
    :touchable="true"
    mode="normal"
    slides-mode="player"
    custom-class="custom-slides"
    @slide-change="handleSlideChange"
    @play="handlePlay"
    @pause="handlePause"
    @ended="handleEnded"
    @timeupdate="handleTimeUpdate"
    @error="handleError"
    @loaded="handleLoaded"
  />
</template>
```

## Props 配置

### 幻灯片数据

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `slides` | `Slides` | `null` | 幻灯片数据对象 |

### 播放控制

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `autoplay` | `boolean` | `false` | 是否自动播放 |
| `loop` | `boolean` | `false` | 是否循环播放 |

### 显示控制

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showControls` | `boolean` | `true` | 是否显示控制栏 |
| `showProgress` | `boolean` | `true` | 是否显示进度条 |
| `showIndicators` | `boolean` | `true` | 是否显示指示器 |
| `showAudioControls` | `boolean` | `true` | 是否显示音频控制 |
| `showVideoControls` | `boolean` | `true` | 是否显示视频控制 |

### 功能开关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enableAudio` | `boolean` | `true` | 是否启用音频 |
| `enableVideo` | `boolean` | `true` | 是否启用视频 |
| `enableSubtitles` | `boolean` | `true` | 是否启用字幕 |

### 交互控制

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `touchable` | `boolean` | `true` | 是否支持触摸操作 |

### 模式配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | `'normal' \| 'presentation' \| 'preview'` | `'normal'` | 播放器模式 |
| `slidesMode` | `SlidesHandlerMode` | `'player'` | 幻灯片处理器模式 |
| `customClass` | `string` | `''` | 自定义CSS类名 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `slide-change` | `(slide: SlideItem, index: number)` | 幻灯片切换时触发 |
| `play` | `()` | 开始播放时触发 |
| `pause` | `()` | 暂停播放时触发 |
| `ended` | `()` | 播放完成时触发 |
| `timeupdate` | `(time: number)` | 播放时间更新时触发 |
| `error` | `(error: string)` | 发生错误时触发 |
| `loaded` | `()` | 幻灯片加载完成时触发 |

## Methods 方法

通过模板引用可以调用以下方法：

```vue
<template>
  <sdkwork-player-slides ref="slidesPlayer" :slides="slidesData" />
  <button @click="slidesPlayer.play()">播放</button>
  <button @click="slidesPlayer.pause()">暂停</button>
  <button @click="slidesPlayer.goToSlide(2)">跳转到第3页</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slidesPlayer = ref()
</script>
```

### 可用方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `play()` | - | 开始播放 |
| `pause()` | - | 暂停播放 |
| `stop()` | - | 停止播放 |
| `goToSlide(index: number)` | `index` - 幻灯片索引 | 跳转到指定幻灯片 |
| `goToPreviousSlide()` | - | 跳转到上一页 |
| `goToNextSlide()` | - | 跳转到下一页 |
| `toggleFullscreen()` | - | 切换全屏模式 |

## 数据结构

### Slides 幻灯片数据

```typescript
interface Slides {
  title: string;
  audio?: AudioMediaResource;
  video?: VideoMediaResource;
  description?: string;
  author?: string;
  createdAt?: Date;
  updateAt?: Date;
  totalDuration?: number;
  language?: string;
  items: SlideItem[];
  format?: 'ppt' | 'pptx' | 'pdf' | 'image' | 'custom';
}
```

### SlideItem 幻灯片项

```typescript
interface SlideItem {
  sequence: number;
  title: string;
  content: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  image?: ImageMediaResource;
  video?: VideoMediaResource;
  html?: string;
  link?: string;
  notes?: string;
  transition?: 'fade' | 'slide' | 'zoom' | 'none';
  transitionDuration?: number;
  keywords?: string[];
  semanticTags?: string[];
}
```

## 样式定制

组件支持通过CSS变量进行样式定制：

```css
.sdkwork-player-slides {
  /* 主容器样式 */
  --slides-bg-color: #000;
  --slides-controls-bg: rgba(0, 0, 0, 0.8);
  --slides-controls-color: #fff;
  
  /* 控制按钮样式 */
  --control-btn-color: #fff;
  --control-btn-hover-bg: rgba(255, 255, 255, 0.1);
  --control-btn-active-color: #1989fa;
  
  /* 进度条样式 */
  --progress-bar-bg: rgba(255, 255, 255, 0.3);
  --progress-fill-bg: #1989fa;
  --progress-thumb-bg: #1989fa;
}

/* 自定义主题 */
.custom-slides {
  --slides-bg-color: #1a1a1a;
  --control-btn-active-color: #ff6b6b;
}
```

## 与 Store 集成

组件与 `useSlidesStore` 深度集成，支持状态同步：

```typescript
import { useSlidesStore } from '@/stores/modules/slides'

const slidesStore = useSlidesStore()

// 状态同步
watch(() => slidesStore.isPlaying, (playing) => {
  // 播放状态同步
})

watch(() => slidesStore.currentSlideIndex, (index) => {
  // 当前幻灯片索引同步
})
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 移动端支持

组件已针对移动端进行优化：
- 触摸手势支持
- 响应式布局
- 移动端友好的控制界面

## 无障碍支持

- 键盘导航支持（方向键、空格键、回车键）
- 屏幕阅读器兼容
- 高对比度模式支持
- 焦点管理

## 故障排除

### 常见问题

1. **幻灯片不显示**：检查 `slides` 数据格式是否正确
2. **音频/视频无法播放**：检查媒体文件路径和格式
3. **同步问题**：确保幻灯片时间戳设置正确

### 调试技巧

```javascript
// 启用调试模式
const slidesPlayer = ref()

// 检查组件状态
console.log('当前状态:', {
  isPlaying: slidesPlayer.value?.isPlaying,
  currentSlide: slidesPlayer.value?.currentSlide,
  currentTime: slidesPlayer.value?.currentMediaTime
})
```

## 更新日志

### v1.0.0 (2024-10-21)
- 初始版本发布
- 基础幻灯片播放功能
- 多媒体同步支持
- 响应式设计

## 许可证

MIT License