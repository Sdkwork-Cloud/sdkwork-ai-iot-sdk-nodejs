# SdkworkCameosListItem 角色列表项组件

专为角色扮演视频角色设计的列表项组件，支持完整的角色展示功能，包括头像、名称、描述、统计数据、特性标签、播放和收藏功能。

## 特性

- ✅ 专为角色扮演视频角色设计
- ✅ 支持 light/dark/auto 主题模式
- ✅ 角色头像显示与类型标识
- ✅ 完整的角色统计数据（客串、Remix、观看、点赞等）
- ✅ 角色特性展示（语音、视频、实时、多语言等）
- ✅ 播放和收藏功能
- ✅ 角色类型标识（虚拟角色/名人角色/定制角色/AI生成）
- ✅ 权限标识（公开/私有/共享）
- ✅ 选中状态高亮
- ✅ 响应式移动端适配
- ✅ TypeScript 完整支持

## 基础用法

```vue
<template>
  <SdkworkCameosListItem 
    :cameo="cameo"
    :is-selected="selected"
    @click="handleClick"
    @select="handleSelect"
    @play="handlePlay"
    @favorite="handleFavorite"
  />
</template>

<script setup>
import { ref } from 'vue'

const cameo = ref({
  id: '1',
  name: 'hero-character',
  displayName: '英雄角色',
  description: '勇敢无畏的英雄角色，适合动作场景',
  avatar: '/cameo-avatar.jpg',
  type: 'character',
  status: 'active',
  permission: 'public',
  category: '动作',
  features: {
    voiceEnabled: true,
    videoEnabled: true,
    realtimeEnabled: false,
    multilingual: false,
    emotional: true,
    trainable: true
  },
  stats: {
    cameoCount: 150,
    remixCount: 45,
    viewCount: 12000,
    likeCount: 850,
    shareCount: 120,
    favoriteCount: 200,
    averageRating: 4.7,
    usageDuration: 360
  },
  tags: ['英雄', '动作', '勇敢'],
  creatorId: 'user1',
  creatorName: '创作者A',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z',
  isFavorite: false
})

const selected = ref(false)

const handleClick = (cameo) => {
  console.log('点击角色:', cameo)
}

const handleSelect = (cameo) => {
  console.log('选中角色:', cameo)
}

const handlePlay = (cameo) => {
  console.log('播放角色:', cameo)
}

const handleFavorite = (cameo) => {
  console.log('收藏角色:', cameo)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cameo` | `Cameo` | - | **必需**，角色数据对象 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `isSelected` | `boolean` | `false` | 是否选中 |
| `selectable` | `boolean` | `true` | 是否支持选择 |
| `showBorderBottom` | `boolean` | `true` | 是否显示底部边框 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

### Cameo 数据结构

```typescript
interface Cameo {
  id: string
  name: string
  displayName: string
  description: string
  avatar: string
  coverImage?: string
  type: 'character' | 'celebrity' | 'custom' | 'ai-generated'
  status: 'active' | 'draft' | 'archived' | 'banned'
  permission: 'public' | 'private' | 'shared'
  category: string
  features: {
    voiceEnabled: boolean
    videoEnabled: boolean
    realtimeEnabled: boolean
    multilingual: boolean
    emotional: boolean
    trainable: boolean
  }
  stats: {
    cameoCount: number
    remixCount: number
    viewCount: number
    likeCount: number
    shareCount: number
    favoriteCount: number
    averageRating: number
    usageDuration: number
  }
  tags: string[]
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
  isFavorite?: boolean
  selected?: boolean
}
```

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `cameo: Cameo` | 点击角色项 |
| `select` | `cameo: Cameo` | 选中角色项 |
| `play` | `cameo: Cameo` | 播放角色 |
| `favorite` | `cameo: Cameo` | 收藏角色 |
| `remix` | `cameo: Cameo` | Remix角色 |
| `share` | `cameo: Cameo` | 分享角色 |

## 主题配置

```vue
<template>
  <!-- 自动主题（跟随系统） -->
  <SdkworkCameosListItem 
    :cameo="cameo"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <SdkworkCameosListItem 
    :cameo="cameo"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <SdkworkCameosListItem 
    :cameo="cameo"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 在角色列表中使用

```vue
<template>
  <div class="cameo-list">
    <SdkworkCameosListItem 
      v-for="cameo in cameos"
      :key="cameo.id"
      :cameo="cameo"
      :is-selected="selectedId === cameo.id"
      @click="selectCameo(cameo)"
      @play="playCameo(cameo)"
      @favorite="toggleCameoFavorite(cameo)"
      @remix="remixCameo(cameo)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cameos = ref([
  {
    id: '1',
    displayName: '英雄角色',
    type: 'character',
    description: '勇敢无畏的英雄角色',
    features: { voiceEnabled: true, videoEnabled: true },
    stats: { cameoCount: 150, remixCount: 45, viewCount: 12000, averageRating: 4.7 },
    isFavorite: true
  },
  {
    id: '2',
    displayName: '名人角色',
    type: 'celebrity',
    description: '知名演员的虚拟形象',
    features: { voiceEnabled: true, realtimeEnabled: true },
    stats: { cameoCount: 300, remixCount: 80, viewCount: 25000, averageRating: 4.8 },
    isFavorite: false
  }
])

const selectedId = ref('1')

const selectCameo = (cameo) => {
  selectedId.value = cameo.id
}

const playCameo = (cameo) => {
  // 播放角色逻辑
  console.log('播放:', cameo.displayName)
}

const toggleCameoFavorite = (cameo) => {
  cameo.isFavorite = !cameo.isFavorite
}

const remixCameo = (cameo) => {
  // Remix角色逻辑
  console.log('Remix:', cameo.displayName)
}
</script>
```

### 自定义样式

```vue
<template>
  <SdkworkCameosListItem 
    :cameo="cameo"
    class="custom-cameo-item"
  />
</template>

<style scoped>
.custom-cameo-item {
  border-radius: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.custom-cameo-item:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.custom-cameo-item.sdkwork-cameos-list-item--selected {
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
- 统计数据网格布局调整
- 移动端专属布局优化

### 主题变量

组件使用CSS变量实现主题切换，支持以下变量：

```css
/* 浅色主题变量 */
--sdkwork-cameo-bg: #ffffff;
--sdkwork-cameo-bg-hover: #f8f9fa;
--sdkwork-cameo-bg-active: #f0f2f5;
--sdkwork-cameo-bg-selected: #f0f8ff;
--sdkwork-cameo-selected-color: #1989fa;
--sdkwork-cameo-favorite-color: #ff976a;
--sdkwork-cameo-text: #333333;
--sdkwork-cameo-text-secondary: #666666;
--sdkwork-cameo-text-muted: #999999;
--sdkwork-cameo-border-color: #f0f0f0;
--sdkwork-cameo-tag-bg: #f0f2f5;

/* 深色主题变量 */
--sdkwork-cameo-bg: #1a1a1a;
--sdkwork-cameo-bg-hover: #2d2d2d;
--sdkwork-cameo-bg-active: #3d3d3d;
--sdkwork-cameo-bg-selected: #1a2a3a;
--sdkwork-cameo-selected-color: #1989fa;
--sdkwork-cameo-favorite-color: #ff976a;
--sdkwork-cameo-text: #ffffff;
--sdkwork-cameo-text-secondary: #cccccc;
--sdkwork-cameo-text-muted: #888888;
--sdkwork-cameo-border-color: #2d2d2d;
--sdkwork-cameo-tag-bg: #2d2d2d;
```

## 设计特色

### 1. 专业角色扮演设计
- 角色类型标识（虚拟角色/名人角色/定制角色/AI生成）
- 权限标识（公开/私有/共享）
- 完整的统计数据展示
- 特性标签系统

### 2. 交互体验优化
- 播放和收藏按钮
- 悬停效果和点击反馈
- 选中状态高亮
- 平滑的动画过渡

### 3. 主题适配
- 自动检测系统主题
- 平滑的主题切换
- 完整的深色模式支持

### 4. 移动端优化
- 响应式布局
- 触摸友好的交互
- 移动端专属样式调整

### 5. 数据展示
- 客串和Remix次数统计
- 观看和点赞数据
- 评分系统
- 使用时长统计