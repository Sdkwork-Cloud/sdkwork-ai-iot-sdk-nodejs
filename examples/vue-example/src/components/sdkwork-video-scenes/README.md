# 人工智能视频创作工具

这是一个基于Vue 3和Vant 4组件库的专业人工智能视频创作工具，支持分镜管理、图片处理和视频生成等功能。

## 功能概述

### 1. 分镜列表管理组件 (SdkworkVideoScenes)

- **可排序的列表结构**：支持拖拽排序，灵活调整分镜顺序
- **分镜项增删改查**：完整的CRUD操作，支持添加、编辑、删除分镜
- **自动保存草稿**：定期自动保存项目进度，防止数据丢失
- **撤销/重做支持**：完整的历史记录功能，支持撤销和重做操作
- **响应式设计**：适配PC、平板等不同设备屏幕

### 2. 分镜项组件 (VideoSceneItem)

- **图片卡片列表**：展示当前分镜的所有图片，支持类型标注和点击预览
- **视频生成描述输入框**：支持文本编辑和AI自动生成建议，字数限制500字以内
- **口播台词输入框**：支持多语言输入和语音转文字功能，字数限制300字以内
- **视频生成控制**：支持初次生成和重新生成，显示生成进度状态

### 3. 图片弹窗组件 (VideoSceneImagePopup)

- **图生视频模式**：支持本地上传图片和集成AI图片生成功能
- **首尾帧视频模式**：分别上传/生成首帧和尾帧图片，支持文生图AI生成
- **素材库选择**：从作品库选择现有素材，支持分类和搜索功能
- **实时预览效果**：支持图片预览和设置保存到分镜项

## 组件结构

```
sdkwork-video-scenes/
├── index.ts                    # 导出文件
├── types.ts                    # 类型定义
├── sdkwork-video-scenes.vue   # 主组件
├── components/
│   ├── video-scene-item.vue   # 分镜项组件
│   └── video-scene-image-popup.vue # 图片弹窗组件
└── README.md                   # 组件说明文档
```

## 使用方法

### 基本用法

```vue
<template>
  <div class="app">
    <SdkworkVideoScenes
      v-model:project="project"
      :auto-save-interval="30000"
      @save-project="handleSaveProject"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SdkworkVideoScenes } from './components/sdkwork-video-scenes'
import type { VideoProject } from './components/sdkwork-video-scenes'

const project = ref<VideoProject>({
  id: 'project-1',
  name: '我的视频项目',
  description: '这是一个示例项目',
  scenes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isDraft: true,
  version: 1
})

const handleSaveProject = (savedProject) => {
  // 处理项目保存逻辑
  console.log('项目已保存:', savedProject)
}
</script>
```

### 单独使用子组件

```vue
<template>
  <div class="app">
    <!-- 使用分镜项组件 -->
    <VideoSceneItem
      :scene="scene"
      :index="0"
      @update-scene="updateScene"
      @delete-scene="deleteScene"
      @generate-video="generateVideo"
      @regenerate-video="regenerateVideo"
    />
    
    <!-- 使用图片弹窗组件 -->
    <VideoSceneImagePopup
      v-model:show="showPopup"
      :scene="scene"
      @update:scene="updateScene"
      @save-image="saveImage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  VideoSceneItem, 
  VideoSceneImagePopup 
} from './components/sdkwork-video-scenes'
import type { VideoSceneItem } from './components/sdkwork-video-scenes'

const scene = ref<VideoSceneItem>({
  id: 'scene-1',
  order: 0,
  videoDescription: '',
  script: '',
  duration: 5,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

const showPopup = ref(false)

const updateScene = (updatedScene) => {
  scene.value = updatedScene
}

// 其他事件处理函数...
</script>
```

## API 文档

### SdkworkVideoScenes Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| project | `VideoProject` | - | 视频项目对象 |
| autoSaveInterval | `number` | `30000` | 自动保存间隔，单位：毫秒 |

### SdkworkVideoScenes Events

| 事件名 | 参数 | 描述 |
|--------|------|------|
| update:project | `(project: VideoProject)` | 项目更新时触发 |
| save-project | `(project: VideoProject)` | 保存项目时触发 |

### VideoSceneItem Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| scene | `VideoSceneItem` | - | 分镜对象 |
| index | `number` | - | 分镜索引 |

### VideoSceneItem Events

| 事件名 | 参数 | 描述 |
|--------|------|------|
| update-scene | `(scene: VideoSceneItem)` | 分镜更新时触发 |
| delete-scene | `(sceneId: string)` | 删除分镜时触发 |
| generate-video | `(sceneId: string)` | 生成视频时触发 |
| regenerate-video | `(sceneId: string)` | 重新生成视频时触发 |

### VideoSceneImagePopup Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| show | `boolean` | - | 是否显示弹窗 |
| scene | `VideoSceneItem` | - | 当前分镜对象 |

### VideoSceneImagePopup Events

| 事件名 | 参数 | 描述 |
|--------|------|------|
| update:show | `(value: boolean)` | 显示状态改变时触发 |
| update:scene | `(scene: VideoSceneItem)` | 分镜更新时触发 |
| save-image | `(image: SceneImage)` | 保存图片时触发 |

## 数据结构

### VideoSceneItem

```typescript
interface VideoSceneItem {
  id: string                       // 分镜唯一标识
  order: number                    // 分镜排序权重
  videoDescription: string         // 视频描述文字
  script: string                   // 口播台词
  duration: number                 // 分镜时长（秒）
  images: SceneImage[]             // 参考图片列表
  video?: string                   // 生成的视频URL
  videoStatus?: 'pending' | 'generating' | 'completed' | 'failed' // 视频生成状态
  videoProgress?: number           // 视频生成进度
  createdAt: Date                  // 创建时间
  updatedAt: Date                  // 更新时间
}
```

### SceneImage

```typescript
interface SceneImage {
  id: string                       // 图片唯一标识
  url: string                      // 图片URL
  type: 'startFrame' | 'endFrame' | 'product' | 'reference' // 图片类型
  title?: string                   // 图片标题
  prompt?: string                  // 图片生成提示词
  width?: number                   // 图片宽度
  height?: number                  // 图片高度
  size?: number                    // 文件大小
}
```

### VideoProject

```typescript
interface VideoProject {
  id: string                       // 项目ID
  name: string                     // 项目名称
  description?: string             // 项目描述
  scenes: VideoSceneItem[]         // 分镜列表
  createdAt: Date                  // 项目创建时间
  updatedAt: Date                  // 项目更新时间
  isDraft: boolean                 // 项目草稿状态
  version: number                  // 项目版本
}
```

## 特性说明

### 响应式设计

组件采用响应式设计，能够自动适配不同设备屏幕：

- **桌面端**：完整功能展示，支持多列布局
- **平板端**：适配中等屏幕，调整布局间距
- **移动端**：优化触摸操作，调整元素大小和位置

### 自动保存功能

- **定期保存**：按设定的时间间隔自动保存项目
- **状态提示**：实时显示保存状态和最后保存时间
- **错误处理**：保存失败时提供错误提示

### 撤销/重做功能

- **历史记录**：记录所有操作历史，支持50步撤销
- **操作类型**：支持创建、更新、删除和重排序操作
- **状态管理**：智能管理历史记录，避免冗余数据

## 注意事项

1. 图片上传限制为JPG/PNG格式，最大10MB
2. 视频描述限制500字以内，口播台词限制300字以内
3. 语音转文字功能需要浏览器支持Web Speech API
4. AI生成功能需要后端API支持，此处仅为模拟实现

## 更新日志

### v1.0.0

- 初始版本发布
- 实现基本的分镜管理功能
- 添加图片处理和视频生成功能
- 支持自动保存和撤销/重做操作
- 实现响应式设计