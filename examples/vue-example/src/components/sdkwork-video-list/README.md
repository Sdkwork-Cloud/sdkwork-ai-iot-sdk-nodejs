# SDKWork Video List Component

专业的视频列表组件，支持卡片式展示、分页加载、搜索筛选等功能。

## 功能特性

- 🎬 专业的视频卡片展示（封面、标题、作者、时长等）
- 🔍 支持关键词搜索和筛选
- 📱 响应式设计，适配移动端和桌面端
- ⚡ 基于 sdkwork-api-list 实现，支持标准分页接口
- 🎯 支持单选、多选、批量操作
- 🔄 支持下拉刷新和上拉加载更多
- 🎨 丰富的自定义插槽和事件

## 安装和使用

```vue
<template>
  <SdkworkVideoList
    :selectable="true"
    :deletable="true"
    :searchable="true"
    :page-size="12"
    @click="handleVideoClick"
    @select="handleVideoSelect"
    @delete="handleVideoDelete"
  />
</template>

<script setup>
import SdkworkVideoList from '@/components/sdkwork-video-list/sdkwork-video-list.vue'

const handleVideoClick = (video) => {
  // 跳转到视频播放页面
  router.push(`/video/${video.id}`)
}

const handleVideoSelect = (video) => {
  console.log('选中视频:', video)
}

const handleVideoDelete = (video) => {
  console.log('删除视频:', video)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| selectable | boolean | false | 是否支持选择 |
| deletable | boolean | false | 是否支持删除 |
| searchable | boolean | true | 是否支持搜索 |
| pageSize | number | 10 | 每页显示数量 |
| itemKey | string | 'id' | 视频项唯一键字段 |
| itemTitleField | string | 'title' | 视频标题字段 |
| itemDescriptionField | string | 'description' | 视频描述字段 |
| params | Record<string, any> | {} | 查询参数 |
| autoLoad | boolean | true | 是否自动加载数据 |
| defaultKeyword | string | '' | 默认搜索关键词 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | VideoVO | 点击视频项事件 |
| select | VideoVO | 选择视频项事件 |
| delete | VideoVO | 删除视频项事件 |
| search | string | 搜索事件 |
| load | Page<VideoVO> | 数据加载完成事件 |
| batch-action | VideoVO[] | 批量操作事件 |
| refresh | - | 刷新事件 |

## Slots

### default
自定义视频项内容
```vue
<template #default="{ item, index, selected }">
  <div class="custom-video-item">
    <img :src="item.thumbnailUrl" alt="封面" />
    <h3>{{ item.title }}</h3>
  </div>
</template>
```

### empty
自定义空状态
```vue
<template #empty>
  <div class="custom-empty">
    <van-icon name="video-o" size="64" />
    <p>暂无视频内容</p>
  </div>
</template>
```

### loading
自定义加载状态
```vue
<template #loading>
  <div class="custom-loading">
    <van-loading type="spinner" size="24px" />
    <span>正在加载视频...</span>
  </div>
</template>
```

### header
自定义头部区域
```vue
<template #header>
  <div class="custom-header">
    <van-tag type="primary">视频管理</van-tag>
    <van-button type="primary" size="small">上传视频</van-button>
  </div>
</template>
```

### footer
自定义底部区域
```vue
<template #footer>
  <div class="custom-footer">
    <van-button type="primary" block>查看更多</van-button>
  </div>
</template>
```

## Methods (Expose)

通过 ref 调用组件方法：

```vue
<template>
  <SdkworkVideoList ref="videoListRef" />
</template>

<script setup>
import { ref } from 'vue'

const videoListRef = ref()

// 刷新数据
videoListRef.value.refresh()

// 加载更多数据
videoListRef.value.loadMore()

// 获取当前数据
const data = videoListRef.value.getData()

// 获取选中项
const selectedItems = videoListRef.value.getSelectedItems()

// 清空选中项
videoListRef.value.clearSelected()

// 设置搜索关键词
videoListRef.value.setKeyword('搜索关键词')

// 手动触发搜索
videoListRef.value.search('关键词')
```

## VideoVO 数据结构

```typescript
interface VideoVO {
  id?: string | number
  title?: string
  description?: string
  thumbnailUrl?: string
  contentUrl?: string
  duration?: number
  width?: number
  height?: number
  resolution?: string
  aspectRatio?: string
  fileSize?: string | number
  format?: string
  status?: VideoStatus
  createdAt?: string
  updatedAt?: string
  uuid?: string
  version?: string | number
}
```

## VideoStatus 枚举

```typescript
enum VideoStatus {
  DEFAULT = "DEFAULT",
  PROCESSING = "PROCESSING", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  DELETED = "DELETED"
}
```

## 样式定制

组件使用 SCSS 编写，支持主题定制：

```scss
// 自定义主题
.video-list-item {
  border-radius: 8px;
  background: #ffffff;
  
  .video-thumbnail {
    padding-bottom: 60%; // 自定义宽高比
  }
  
  .video-title {
    font-size: 16px;
    color: #333333;
  }
}
```

## 响应式断点

- `768px` 以下：移动端优化
- `480px` 以下：小屏幕优化

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 依赖组件

- `sdkwork-api-list` - 基础列表组件
- `vant` - UI 组件库
- Vue 3.x

## 注意事项

1. 确保后端 API 支持 Spring Boot 标准分页接口
2. 视频封面图建议使用 16:9 比例
3. 组件会自动处理加载状态和错误状态
4. 支持 TypeScript 类型提示

## 示例代码

完整的使用示例：

```vue
<template>
  <div class="video-page">
    <SdkworkVideoList
      ref="videoListRef"
      :selectable="true"
      :deletable="true"
      :searchable="true"
      :page-size="12"
      :default-keyword="searchKeyword"
      @click="handleVideoClick"
      @select="handleVideoSelect"
      @batch-action="handleBatchAction"
    >
      <template #header>
        <div class="page-header">
          <h2>视频列表</h2>
          <van-button type="primary" @click="handleUpload">
            上传视频
          </van-button>
        </div>
      </template>
    </SdkworkVideoList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SdkworkVideoList from '@/components/sdkwork-video-list/sdkwork-video-list.vue'
import type { VideoVO } from '@/services/src/service/video/types'

const router = useRouter()
const videoListRef = ref()
const searchKeyword = ref('')

const handleVideoClick = (video: VideoVO) => {
  router.push(`/video/${video.id}`)
}

const handleVideoSelect = (video: VideoVO) => {
  console.log('选中视频:', video.title)
}

const handleBatchAction = (videos: VideoVO[]) => {
  console.log('批量操作:', videos.length, '个视频')
}

const handleUpload = () => {
  // 处理上传逻辑
}
</script>
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的视频列表功能
- 支持搜索、筛选、分页
- 支持单选、多选、删除操作
- 响应式设计适配多端