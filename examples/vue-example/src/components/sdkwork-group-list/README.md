# SdkworkGroupList 群组列表组件

一个功能完善的群组列表组件，基于 sdkwork-api-list 组件封装，类似微信群组列表功能，支持群组搜索、筛选、排序和加入等功能。

## 功能特性

- ✅ 基于成熟的 sdkwork-api-list 组件，复用其分页、加载、下拉刷新等核心功能
- ✅ 群组基本信息展示（名称、描述、头像）
- ✅ 群组标签显示
- ✅ 入群价格显示（免费/付费）
- ✅ 群组成员数量和活跃度统计
- ✅ 官方认证和热门标识
- ✅ 搜索功能（支持按名称、描述、标签搜索）
- ✅ 多种筛选方式（全部、免费、付费、官方、热门、已加入）
- ✅ 多种排序方式（热门、最新、成员数量、价格）
- ✅ 分页加载和下拉刷新
- ✅ 加入群组功能
- ✅ 响应式设计

## 安装和使用

### 基本用法

```vue
<template>
  <div>
    <sdkwork-group-list
      :api="fetchGroups"
      @group-click="handleGroupClick"
      @join="handleJoinGroup"
      @search="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SdkworkGroupList from '@/components/sdkwork-group-list/sdkwork-group-list.vue'
import type { Group } from '@/components/sdkwork-group-list/types'

// API函数示例
const fetchGroups = async (params, pageableParams) => {
  // 这里调用你的API获取群组列表
  // 返回格式: { content: Group[], totalElements: number, totalPages: number }
  return await api.getGroups(params, pageableParams)
}

// 事件处理
const handleGroupClick = (group) => {
  console.log('点击群组:', group)
}

const handleJoinGroup = (group) => {
  console.log('加入群组:', group)
}

const handleSearch = (keyword) => {
  console.log('搜索关键词:', keyword)
}
</script>
```

### 使用本地数据

```vue
<template>
  <sdkwork-group-list
    :groups="groups"
    @group-click="handleGroupClick"
    @join="handleJoinGroup"
  />
</template>

<script setup>
import { ref } from 'vue'
import SdkworkGroupList from '@/components/sdkwork-group-list/sdkwork-group-list.vue'
import type { Group } from '@/components/sdkwork-group-list/types'

// 群组数据
const groups = ref<Group[]>([
  {
    id: '1',
    name: '前端技术交流群',
    description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。',
    avatar: 'https://picsum.photos/seed/frontend/200/200.jpg',
    tags: ['前端', '技术', '交流'],
    memberCount: 3586,
    messageCount: 128560,
    price: 0,
    isOfficial: true,
    isVerified: true,
    isHot: true,
    type: 'official',
    createdAt: '2022-01-15',
  }
  // ...更多群组
])
</script>
```

### 高级配置

```vue
<template>
  <sdkwork-group-list
    :api="fetchGroups"
    :params="{ category: 'tech' }"
    :page-size="20"
    :searchable="true"
    :show-filter="true"
    :show-sort="true"
    :show-join-button="true"
    :theme-mode="'light'"
    custom-class="custom-group-list"
    @group-click="handleGroupClick"
    @join="handleJoinGroup"
    @filter="handleFilter"
    @sort="handleSort"
  />
</template>
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| api | API请求方法（与service互斥） | `(params, pageableParams) => Promise` | - |
| service | CRUD服务实例（与api互斥） | `any` | - |
| params | 查询参数 | `Record<string, any>` | `{}` |
| pageableParams | 分页排序参数 | `Record<string, any>` | `{}` |
| selectable | 是否支持项选择 | `boolean` | `false` |
| deletable | 是否支持项删除 | `boolean` | `false` |
| searchable | 是否支持搜索 | `boolean` | `true` |
| pageSize | 每页显示条数 | `number` | `20` |
| itemKey | 项唯一键字段名 | `string` | `'id'` |
| itemTitleField | 项标题字段名 | `string` | `'name'` |
| itemDescriptionField | 项描述字段名 | `string` | `'description'` |
| themeMode | 主题模式 | `'light' | 'dark' | 'auto'` | `'auto'` |
| showBorderBottom | 是否显示底部边框 | `boolean` | `true` |
| showFilter | 是否显示筛选功能 | `boolean` | `true` |
| showSort | 是否显示排序功能 | `boolean` | `true` |
| showJoinButton | 是否显示加入按钮 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|---------|
| select | 项选择事件 | `(item: Group) => void` |
| delete | 项删除事件 | `(item: Group) => void` |
| search | 搜索事件 | `(keyword: string) => void` |
| filter | 筛选事件 | `(value: string) => void` |
| sort | 排序事件 | `(value: string) => void` |
| group-click | 点击群组项时触发 | `(group: Group) => void` |
| join | 点击加入群组时触发 | `(group: Group) => void` |
| load | 数据加载完成事件 | `(data: any) => void` |

### Group 数据结构

```typescript
interface Group {
  id: string | number                    // 群组ID
  name: string                          // 群组名称
  description: string                    // 群组描述
  avatar?: string                       // 群组头像URL
  tags?: string[]                      // 群组标签
  memberCount: number                  // 成员数量
  maxMembers?: number                  // 最大成员数
  messageCount: number                 // 消息数量
  price: number                        // 入群价格
  originalPrice?: number               // 原价（用于折扣显示）
  isOfficial?: boolean                 // 是否为官方群组
  isVerified?: boolean                 // 是否已认证
  isHot?: boolean                     // 是否为热门群组
  isJoined?: boolean                  // 是否已加入
  joining?: boolean                   // 是否正在加入
  type?: 'public' | 'private' | 'official'  // 群组类型
  createdAt?: string | Date           // 创建时间
}
```

## 组件结构

本组件基于 sdkwork-api-list 构建，具有以下优势：

1. **复用成熟功能**：直接继承 sdkwork-api-list 的分页、加载、刷新等核心功能
2. **一致的API**：与其他列表组件保持一致的API和事件
3. **强大的扩展性**：可以通过插槽完全自定义列表项的渲染
4. **灵活的筛选**：内置群组特有的筛选条件

## 自定义样式

组件提供了以下CSS变量，可以通过覆盖这些变量来自定义样式：

```css
:root {
  --bg-page: #f7f8fa;          /* 页面背景色 */
  --bg-card: #ffffff;          /* 卡片背景色 */
  --bg-gray: #f5f5f5;          /* 灰色背景 */
  --text-primary: #323233;     /* 主要文字颜色 */
  --text-secondary: #969799;   /* 次要文字颜色 */
  --text-light: #999999;       /* 浅色文字 */
  --color-primary: #1989fa;    /* 主题色 */
  --color-success: #07c160;    /* 成功色 */
  --color-danger: #ee0a24;     /* 危险色 */
  --border-color: #ebedf0;     /* 边框色 */
}
```

## 注意事项

1. 群组头像建议使用正方形图片，比例 1:1
2. 价格为0时会显示"免费"标签，大于0时会显示价格
3. 群组标签最多显示3个，多余的会显示"+n"的数量提示
4. 成员数量超过10000会显示为"x.xw"，超过1000会显示为"x.xk"
5. 组件依赖Vant组件库和sdkwork-api-list组件，使用前请确保已正确安装和引入