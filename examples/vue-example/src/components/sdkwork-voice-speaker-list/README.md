# SDKWork Speaker List 组件

基于Vue 3、setup语法糖和TypeScript的AI智能语音发音人列表组件，支持Spring Boot分页标准，专为语音合成应用设计。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 发音人选择和收藏功能
- ✅ 语音示例试听播放
- ✅ 多维度筛选（语言、性别、类型等）
- ✅ 发音人状态显示（在线、离线、实时、情感等）
- ✅ 多种插槽自定义
- ✅ 响应式布局设计
- ✅ 完整的TypeScript类型支持
- ✅ 自动主题颜色适配（light/dark/auto）

## 安装依赖

确保项目中已安装Vant 4.x：

```bash
npm install vant@^4.9.21
```

## 基础用法

```vue
<template>
  <sdkwork-speaker-list
    :api="getSpeakerList"
    :params="{ language: 'zh-CN', gender: 'female' }"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @play-sample="handlePlaySample"
    @favorite="handleFavorite"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义空状态 -->
    <template #empty>
      <van-empty description="暂无发音人" image="search">
        <template #description>
          <div class="empty-description">
            <p>暂时没有可用的发音人</p>
            <p class="empty-tip">您可以调整搜索条件或联系管理员添加</p>
          </div>
        </template>
      </van-empty>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载发音人数据...</van-loading>
    </template>
  </sdkwork-speaker-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Speaker, SpeakerPage, SpeakerPageable } from './types'

// API方法
const getSpeakerList = async (params: SpeakerPageable): Promise<SpeakerPage> => {
  const response = await fetch('/api/speakers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (speaker: Speaker) => {
  console.log('选中发音人:', speaker)
}

const handlePlaySample = (speaker: Speaker) => {
  console.log('播放示例:', speaker)
  // 播放音频逻辑
}

const handleFavorite = (speaker: Speaker) => {
  console.log('收藏发音人:', speaker)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: SpeakerPage) => {
  console.log('数据加载完成:', pageData)
}
</script>

<style scoped>
.empty-description {
  text-align: center;
}

.empty-description p {
  margin: 4px 0;
  color: #969799;
  font-size: 14px;
}

.empty-description .empty-tip {
  font-size: 12px;
  color: #c8c9cc;
}
</style>
```

## API 接口规范

### 输入参数 (SpeakerPageable)

```typescript
interface SpeakerPageable extends Pageable {
  filters?: {
    gender?: 'male' | 'female' | 'neutral'
    language?: 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' | 'ja-JP' | 'ko-KR'
    type?: 'standard' | 'premium' | 'custom'
    status?: 'active' | 'disabled' | 'testing'
    keyword?: string
    realtime?: boolean
    offline?: boolean
    emotional?: boolean
    multilingual?: boolean
    tags?: string[]
    favorite?: boolean
    minRating?: number
    minUsageCount?: number
  }
}
```

### 输出结果 (SpeakerPage)

```typescript
type SpeakerPage = Page<Speaker>
```

### 发音人实体 (Speaker)

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

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: SpeakerPageable) => Promise<SpeakerPage>` | - | 必传，API请求方法 |
| params | `SpeakerQueryParams` | `{}` | 发音人查询参数 |
| selectable | `boolean` | `false` | 是否支持行选择 |
| deletable | `boolean` | `false` | 是否支持行删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| itemKey | `string` | `'id'` | 列表项唯一键字段名 |
| itemTitleField | `string` | `'displayName'` | 列表项标题字段名 |
| itemDescriptionField | `string` | `'description'` | 列表项描述字段名 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(speaker: Speaker) => void` | 发音人选择事件 |
| play-sample | `(speaker: Speaker) => void` | 播放示例音频事件 |
| favorite | `(speaker: Speaker) => void` | 收藏发音人事件 |
| delete | `(speaker: Speaker) => void` | 发音人删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: SpeakerPage) => void` | 数据加载完成事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ speaker: Speaker, index: number, selected: boolean }` | 自定义发音人项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-speaker-list ref="speakerListRef" :api="getSpeakers" />
  <van-button @click="handleRefresh">刷新</van-button>
  <van-button @click="handleSelectFavorite">选择收藏</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const speakerListRef = ref()

const handleRefresh = () => {
  speakerListRef.value?.refresh()
}

const handleSelectFavorite = () => {
  const favorites = speakerListRef.value?.getFavoriteSpeakers()
  console.log('收藏的发音人:', favorites)
}
</script>
```

## 主题配置

组件支持自动主题适配，支持三种模式：

```vue
<template>
  <!-- 自动主题（跟随系统） -->
  <sdkwork-speaker-list 
    :api="getSpeakers"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <sdkwork-speaker-list 
    :api="getSpeakers"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <sdkwork-speaker-list 
    :api="getSpeakers"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 自定义发音人项

```vue
<template>
  <sdkwork-speaker-list :api="getSpeakers">
    <template #default="{ speaker, index, selected }">
      <div class="custom-speaker-item" :class="{ selected }">
        <img :src="speaker.avatar" class="avatar" />
        <div class="info">
          <h3>{{ speaker.displayName }}</h3>
          <p>{{ speaker.description }}</p>
          <div class="tags">
            <span class="tag language">{{ speaker.language }}</span>
            <span class="tag gender">{{ speaker.gender }}</span>
          </div>
        </div>
      </div>
    </template>
  </sdkwork-speaker-list>
</template>

<style scoped>
.custom-speaker-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.custom-speaker-item.selected {
  background-color: #f0f8ff;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 16px;
}

.info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.tag.language {
  background: #e6f7ff;
  color: #1890ff;
}

.tag.gender {
  background: #f6ffed;
  color: #52c41a;
}
</style>
```

### 筛选功能

```vue
<template>
  <div>
    <!-- 筛选条件 -->
    <div class="filters">
      <van-dropdown-menu>
        <van-dropdown-item v-model="language" :options="languageOptions" />
        <van-dropdown-item v-model="gender" :options="genderOptions" />
        <van-dropdown-item v-model="type" :options="typeOptions" />
      </van-dropdown-menu>
    </div>
    
    <!-- 发音人列表 -->
    <sdkwork-speaker-list 
      :api="getSpeakers" 
      :params="filterParams"
      ref="speakerListRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const language = ref('zh-CN')
const gender = ref('female')
const type = ref('standard')

const languageOptions = [
  { text: '中文', value: 'zh-CN' },
  { text: '英语', value: 'en-US' },
  { text: '日语', value: 'ja-JP' }
]

const genderOptions = [
  { text: '男声', value: 'male' },
  { text: '女声', value: 'female' },
  { text: '中性', value: 'neutral' }
]

const typeOptions = [
  { text: '标准', value: 'standard' },
  { text: '高级', value: 'premium' },
  { text: '定制', value: 'custom' }
]

const filterParams = computed(() => ({
  language: language.value,
  gender: gender.value,
  type: type.value
}))
</script>
```