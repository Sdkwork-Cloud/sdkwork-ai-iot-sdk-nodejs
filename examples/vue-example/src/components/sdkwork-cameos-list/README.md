# SDKWork Cameos List 组件

基于Vue 3、setup语法糖和TypeScript的角色扮演视频角色列表组件，支持分类筛选、搜索、选择等功能，专为AI角色扮演应用设计。

## 功能特性

- ✅ 支持分类筛选（虚拟角色、名人角色、定制角色、AI生成）
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 角色选择和收藏功能
- ✅ 角色播放和Remix功能
- ✅ 完整的角色统计数据展示（客串、Remix、观看、点赞等）
- ✅ 角色特性标签（语音、视频、实时、多语言等）
- ✅ 创建角色功能
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
  <sdkwork-cameos-list
    :api="getCameoList"
    :params="{ type: 'character' }"
    selectable
    searchable
    @select="handleSelect"
    @play="handlePlay"
    @favorite="handleFavorite"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义空状态 -->
    <template #empty>
      <div class="cameo-empty">
        <van-icon name="user-circle-o" size="64" color="#ccc" />
        <div class="empty-text">暂无角色</div>
        <div class="empty-tip">您可以创建新角色或调整搜索条件</div>
      </div>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="cameo-loading">
        <van-loading size="24px" />
        <span>加载角色中...</span>
      </div>
    </template>
  </sdkwork-cameos-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Cameo, CameoPage, CameoPageable } from './types'

// API方法
const getCameoList = async (params: CameoPageable): Promise<CameoPage> => {
  const response = await fetch('/api/cameos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (cameo: Cameo) => {
  console.log('选中角色:', cameo)
}

const handlePlay = (cameo: Cameo) => {
  console.log('播放角色:', cameo)
}

const handleFavorite = (cameo: Cameo) => {
  console.log('收藏角色:', cameo)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: CameoPage) => {
  console.log('数据加载完成:', pageData)
}
</script>
```

## API 接口规范

### 输入参数 (CameoPageable)

```typescript
interface CameoPageable extends Pageable {
  filters?: {
    category?: string
    type?: 'character' | 'celebrity' | 'custom' | 'ai-generated'
    status?: 'active' | 'draft' | 'archived' | 'banned'
    permission?: 'public' | 'private' | 'shared'
    keyword?: string
    tags?: string[]
    creatorId?: string
    isFavorite?: boolean
    features?: {
      voiceEnabled?: boolean
      videoEnabled?: boolean
      realtimeEnabled?: boolean
      multilingual?: boolean
      emotional?: boolean
    }
    sortBy?: 'createdAt' | 'updatedAt' | 'lastUsedAt' | 'cameoCount' | 'remixCount' | 'viewCount' | 'averageRating'
    sortOrder?: 'asc' | 'desc'
    minCameoCount?: number
    minRemixCount?: number
    minRating?: number
  }
}
```

### 输出结果 (CameoPage)

```typescript
type CameoPage = Page<Cameo>
```

### 角色实体 (Cameo)

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
  voiceSettings?: {
    voiceType: string
    speed: number
    pitch: number
    volume: number
  }
  personality?: {
    type: string
    emotion: string
    speakingStyle: string
  }
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: CameoPageable) => Promise<CameoPage>` | - | API请求方法 |
| params | `CameoQueryParams` | `{}` | 角色查询参数 |
| searchable | `boolean` | `true` | 是否支持搜索 |
| selectable | `boolean` | `true` | 是否支持选择 |
| deletable | `boolean` | `false` | 是否支持删除 |
| pageSize | `number` | `12` | 每页显示条数 |
| categoryApi | `() => Promise<CameoCategory[]>` | - | 分类数据API方法 |
| categorys | `CameoCategory[]` | `[]` | 分类数据列表 |
| categoryKey | `string` | `'id'` | 分类项唯一键字段名 |
| categoryNameField | `string` | `'name'` | 分类项名称字段名 |
| categoryCountField | `string` | `'count'` | 分类项数量字段名 |
| defaultCategoryId | `string` | - | 默认选中的分类ID |
| showBorderBottom | `boolean` | `true` | 是否显示底部边框 |
| borderBottomLeftOffset | `number` | `60` | 底部边框距离左边的偏移量 |
| showCreateButton | `boolean` | `true` | 是否显示创建按钮 |
| themeMode | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(cameo: Cameo) => void` | 角色选择事件 |
| play | `(cameo: Cameo) => void` | 播放角色事件 |
| remix | `(cameo: Cameo) => void` | Remix角色事件 |
| favorite | `(cameo: Cameo) => void` | 收藏角色事件 |
| share | `(cameo: Cameo) => void` | 分享角色事件 |
| edit | `(cameo: Cameo) => void` | 编辑角色事件 |
| delete | `(cameo: Cameo) => void` | 删除角色事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| select-category | `(category: CameoCategory) => void` | 分类选择事件 |
| load | `(pageData: CameoPage) => void` | 数据加载完成事件 |
| create | `(data: any) => void` | 创建角色事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ cameo: Cameo, index: number, selected: boolean }` | 自定义角色项内容 |
| category | `{ category: CameoCategory, index: number }` | 自定义分类项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-cameos-list ref="cameoListRef" :api="getCameos" />
  <van-button @click="handleRefresh">刷新</van-button>
  <van-button @click="handleSelectFavorite">选择收藏</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cameoListRef = ref()

const handleRefresh = () => {
  cameoListRef.value?.refresh()
}

const handleSelectFavorite = () => {
  const favorites = cameoListRef.value?.getFavoriteCameos()
  console.log('收藏的角色:', favorites)
}

const handleSetCategory = () => {
  cameoListRef.value?.setCategory('character')
}
</script>
```

## 主题配置

组件支持自动主题适配，支持三种模式：

```vue
<template>
  <!-- 自动主题（跟随系统） -->
  <sdkwork-cameos-list 
    :api="getCameos"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <sdkwork-cameos-list 
    :api="getCameos"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <sdkwork-cameos-list 
    :api="getCameos"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 自定义角色项

```vue
<template>
  <sdkwork-cameos-list :api="getCameos">
    <template #default="{ cameo, index, selected }">
      <div class="custom-cameo-item" :class="{ selected }">
        <img :src="cameo.avatar" class="avatar" />
        <div class="info">
          <h3>{{ cameo.displayName }}</h3>
          <p>{{ cameo.description }}</p>
          <div class="stats">
            <span class="stat">客串: {{ cameo.stats.cameoCount }}</span>
            <span class="stat">Remix: {{ cameo.stats.remixCount }}</span>
          </div>
        </div>
      </div>
    </template>
  </sdkwork-cameos-list>
</template>

<style scoped>
.custom-cameo-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.custom-cameo-item.selected {
  background-color: #f0f8ff;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
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

.stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 12px;
  color: #999;
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
        <van-dropdown-item v-model="type" :options="typeOptions" title="类型" />
        <van-dropdown-item v-model="permission" :options="permissionOptions" title="权限" />
        <van-dropdown-item v-model="sortBy" :options="sortOptions" title="排序" />
      </van-dropdown-menu>
      
      <div class="feature-filters">
        <van-checkbox-group v-model="featureFilters" direction="horizontal">
          <van-checkbox name="voiceEnabled">语音</van-checkbox>
          <van-checkbox name="videoEnabled">视频</van-checkbox>
          <van-checkbox name="realtimeEnabled">实时</van-checkbox>
          <van-checkbox name="multilingual">多语言</van-checkbox>
        </van-checkbox-group>
      </div>
    </div>
    
    <!-- 角色列表 -->
    <sdkwork-cameos-list 
      :api="getCameos" 
      :params="filterParams"
      ref="cameoListRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const type = ref('')
const permission = ref('')
const sortBy = ref('createdAt')
const featureFilters = ref<string[]>([])

const typeOptions = [
  { text: '全部类型', value: '' },
  { text: '虚拟角色', value: 'character' },
  { text: '名人角色', value: 'celebrity' },
  { text: '定制角色', value: 'custom' },
  { text: 'AI生成', value: 'ai-generated' }
]

const permissionOptions = [
  { text: '全部权限', value: '' },
  { text: '公开', value: 'public' },
  { text: '私有', value: 'private' },
  { text: '共享', value: 'shared' }
]

const sortOptions = [
  { text: '最新创建', value: 'createdAt' },
  { text: '客串最多', value: 'cameoCount' },
  { text: 'Remix最多', value: 'remixCount' },
  { text: '评分最高', value: 'averageRating' }
]

const filterParams = computed(() => ({
  type: type.value,
  permission: permission.value,
  sortBy: sortBy.value,
  sortOrder: 'desc',
  features: featureFilters.value.reduce((acc, feature) => {
    acc[feature] = true
    return acc
  }, {} as any)
}))
</script>
```