# SdkworkSpeakerListItem 发音人列表项组件

专为AI智能语音发音人设计的列表项组件，支持完整的发音人展示功能，包括头像、名称、语言、性别、特性标签、试听播放和收藏功能。

## 特性

- ✅ 专为AI语音发音人设计
- ✅ 支持 light/dark/auto 主题模式
- ✅ 发音人头像显示与性别标识
- ✅ 多语言和性别标签
- ✅ 发音人特性展示（实时、离线、情感、多语言）
- ✅ 示例音频试听播放
- ✅ 收藏功能
- ✅ 发音人类型标识（标准/高级/定制）
- ✅ 选中状态高亮
- ✅ 响应式移动端适配
- ✅ TypeScript 完整支持

## 基础用法

```vue
<template>
  <SdkworkSpeakerListItem 
    :speaker="speaker"
    :is-selected="selected"
    @click="handleClick"
    @select="handleSelect"
    @play-sample="handlePlaySample"
    @favorite="handleFavorite"
  />
</template>

<script setup>
import { ref } from 'vue'

const speaker = ref({
  id: '1',
  name: 'xiaoyan',
  displayName: '小燕',
  description: '清晰自然的女声发音人',
  gender: 'female',
  language: 'zh-CN',
  type: 'standard',
  status: 'active',
  avatar: '/speaker-avatar.jpg',
  voice: {
    speed: 50,
    pitch: 50,
    volume: 80
  },
  sampleAudio: '/sample-audio.mp3',
  realtime: true,
  offline: false,
  emotional: true,
  multilingual: false,
  favorite: false,
  rating: 4.5,
  usageCount: 1000
})

const selected = ref(false)

const handleClick = (speaker) => {
  console.log('点击发音人:', speaker)
}

const handleSelect = (speaker) => {
  console.log('选中发音人:', speaker)
}

const handlePlaySample = (speaker) => {
  console.log('播放示例音频:', speaker)
}

const handleFavorite = (speaker) => {
  console.log('收藏发音人:', speaker)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `speaker` | `Speaker` | - | **必需**，发音人数据对象 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `isSelected` | `boolean` | `false` | 是否选中 |
| `showBorderBottom` | `boolean` | `true` | 是否显示底部边框 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

### Speaker 数据结构

```typescript
interface Speaker {
  id: string
  name: string
  displayName: string
  description?: string
  gender: 'male' | 'female' | 'neutral'
  language: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' | 'ja-JP' | 'ko-KR'
  type: 'standard' | 'premium' | 'custom'
  status: 'active' | 'disabled' | 'testing'
  avatar?: string
  voice: {
    speed: number
    pitch: number
    volume: number
    emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'calm'
  }
  sampleAudio?: string
  realtime: boolean
  offline: boolean
  emotional: boolean
  multilingual: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
  selected?: boolean
  favorite?: boolean
  usageCount?: number
  rating?: number
}
```

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `speaker: Speaker` | 点击发音人项 |
| `select` | `speaker: Speaker` | 选中发音人项 |
| `play-sample` | `speaker: Speaker` | 播放示例音频 |
| `favorite` | `speaker: Speaker` | 收藏发音人 |

## 主题配置

```vue
<template>
  <!-- 自动主题（跟随系统） -->
  <SdkworkSpeakerListItem 
    :speaker="speaker"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <SdkworkSpeakerListItem 
    :speaker="speaker"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <SdkworkSpeakerListItem 
    :speaker="speaker"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 在发音人列表中使用

```vue
<template>
  <div class="speaker-list">
    <SdkworkSpeakerListItem 
      v-for="speaker in speakers"
      :key="speaker.id"
      :speaker="speaker"
      :is-selected="selectedId === speaker.id"
      @click="selectSpeaker(speaker)"
      @play-sample="playSpeakerSample(speaker)"
      @favorite="toggleSpeakerFavorite(speaker)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const speakers = ref([
  {
    id: '1',
    displayName: '小燕',
    gender: 'female',
    language: 'zh-CN',
    type: 'standard',
    description: '清晰自然的女声发音人',
    realtime: true,
    emotional: true,
    favorite: true,
    rating: 4.5
  },
  {
    id: '2',
    displayName: '小明',
    gender: 'male',
    language: 'zh-CN',
    type: 'premium',
    description: '沉稳有力的男声发音人',
    realtime: true,
    offline: true,
    emotional: true,
    favorite: false,
    rating: 4.8
  }
])

const selectedId = ref('1')

const selectSpeaker = (speaker) => {
  selectedId.value = speaker.id
}

const playSpeakerSample = (speaker) => {
  // 播放音频逻辑
  console.log('播放:', speaker.displayName)
}

const toggleSpeakerFavorite = (speaker) => {
  speaker.favorite = !speaker.favorite
}
</script>
```

### 自定义样式

```vue
<template>
  <SdkworkSpeakerListItem 
    :speaker="speaker"
    class="custom-speaker-item"
  />
</template>

<style scoped>
.custom-speaker-item {
  border-radius: 12px;
  margin: 8px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.custom-speaker-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.custom-speaker-item.sdkwork-voice-speaker-list-item--selected {
  border-left: 4px solid #1989fa;
  background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
}
</style>
```

### 响应式设计

组件自动适配移动端，在屏幕宽度小于768px时自动调整布局：

- 减小内边距
- 调整字体大小
- 优化按钮布局
- 压缩间距

### 主题变量

组件使用CSS变量实现主题切换，支持以下变量：

```css
/* 浅色主题变量 */
--sdkwork-speaker-bg: #ffffff;
--sdkwork-speaker-bg-hover: #f8f9fa;
--sdkwork-speaker-bg-active: #f0f2f5;
--sdkwork-speaker-bg-selected: #f0f8ff;
--sdkwork-speaker-selected-color: #1989fa;
--sdkwork-speaker-favorite-color: #ff976a;
--sdkwork-speaker-text: #333333;
--sdkwork-speaker-text-secondary: #666666;
--sdkwork-speaker-text-muted: #999999;
--sdkwork-speaker-border-color: #f0f0f0;
--sdkwork-speaker-tag-bg: #f0f2f5;

/* 深色主题变量 */
--sdkwork-speaker-bg: #1a1a1a;
--sdkwork-speaker-bg-hover: #2d2d2d;
--sdkwork-speaker-bg-active: #3d3d3d;
--sdkwork-speaker-bg-selected: #1a2a3a;
--sdkwork-speaker-selected-color: #1989fa;
--sdkwork-speaker-favorite-color: #ff976a;
--sdkwork-speaker-text: #ffffff;
--sdkwork-speaker-text-secondary: #cccccc;
--sdkwork-speaker-text-muted: #888888;
--sdkwork-speaker-border-color: #2d2d2d;
--sdkwork-speaker-tag-bg: #2d2d2d;
```

## 设计特色

### 1. 专业语音发音人设计
- 性别标识图标（男性/女性/中性）
- 语言和性别标签
- 发音人类型徽章（标准/高级/定制）
- 特性标签展示（实时、离线、情感、多语言）

### 2. 交互体验优化
- 试听播放按钮
- 收藏功能
- 悬停效果和点击反馈
- 选中状态高亮

### 3. 主题适配
- 自动检测系统主题
- 平滑的主题切换
- 完整的深色模式支持

### 4. 移动端优化
- 响应式布局
- 触摸友好的交互
- 移动端专属样式调整