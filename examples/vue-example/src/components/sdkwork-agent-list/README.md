# SDKWork Agent List 组件

基于Vue 3、setup语法糖和TypeScript的智能体列表组件，支持Spring Boot分页标准，专为智能体管理场景设计。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 下拉刷新和上拉加载更多
- ✅ 智能体专属搜索功能（300ms防抖）
- ✅ 智能体选择和删除功能
- ✅ 智能体状态显示（在线/离线/忙碌）
- ✅ 智能体评分和使用次数展示
- ✅ 多种插槽自定义
- ✅ 响应式布局设计
- ✅ 完整的TypeScript类型支持

## 安装依赖

确保项目中已安装Vant 4.x：

```bash
npm install vant@^4.9.21
```

## 基础用法

```vue
<template>
  <sdkwork-agent-list
    :api="getAgentList"
    :params="{ category: 'assistant' }"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
    @click="handleClick"
  >
    <!-- 自定义智能体列表项 -->
    <template #default="{ agent, index, selected }">
      <div class="custom-agent-item" :class="{ selected }">
        <div class="agent-avatar">
          <img :src="agent.avatar" :alt="agent.name" />
          <div class="status" :class="agent.status"></div>
        </div>
        <div class="agent-info">
          <div class="agent-name">{{ agent.name }}</div>
          <div class="agent-description">{{ agent.description }}</div>
          <div class="agent-meta">
            <span class="rating">⭐ {{ agent.rating }}</span>
            <span class="usage">使用 {{ agent.usageCount }} 次</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <template #empty>
      <van-empty description="暂无智能体数据" />
    </template>

    <!-- 加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载智能体数据...</van-loading>
    </template>
  </sdkwork-agent-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { Agent } from './types'

// API方法
const getAgentList = async (params: Pageable): Promise<Page<Agent>> => {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (agent: Agent) => {
  console.log('选中智能体:', agent)
}

const handleDelete = (agent: Agent) => {
  console.log('删除智能体:', agent)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<Agent>) => {
  console.log('数据加载完成:', pageData)
}

const handleClick = (agent: Agent) => {
  console.log('点击智能体:', agent)
}
</script>

<style scoped>
.custom-agent-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.custom-agent-item.selected {
  background: #e6f7ff;
}

.agent-avatar {
  position: relative;
  margin-right: 12px;
}

.agent-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status.online {
  background: #52c41a;
}

.status.offline {
  background: #d9d9d9;
}

.status.busy {
  background: #faad14;
}

.agent-info {
  flex: 1;
}

.agent-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.agent-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.agent-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}
</style>
```

## API 接口规范

### 输入参数 (Pageable)

```typescript
interface Pageable {
  page?: number      // 页码（从0开始）
  size?: number      // 每页条数
  sort?: string[]    // 排序字段 ["field,asc", "field,desc"]
  keyword?: string   // 搜索关键词
  filters?: Record<string, any> // 自定义过滤参数
}
```

### 输出结果 (Page<Agent>)

```typescript
interface Page<T> {
  content: T[]                    // 数据列表
  empty: boolean                  // 是否为空
  first: boolean                 // 是否第一页
  last: boolean                  // 是否最后一页
  number: number                 // 当前页码
  numberOfElements: number       // 当前页元素数量
  size: number                   // 每页大小
  sort: Sort                     // 排序信息
  totalElements: number          // 总记录数
  totalPages: number             // 总页数
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: Pageable) => Promise<Page<Agent>>` | - | 必传，API请求方法 |
| params | `Record<string, any>` | `{}` | 请求参数对象 |
| selectable | `boolean` | `false` | 是否支持智能体选择 |
| deletable | `boolean` | `false` | 是否支持智能体删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| agentKey | `string` | `'id'` | 智能体唯一键字段名 |
| agentNameField | `string` | `'name'` | 智能体名称字段名 |
| agentDescriptionField | `string` | `'description'` | 智能体描述字段名 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(agent: Agent) => void` | 智能体选择事件 |
| delete | `(agent: Agent) => void` | 智能体删除事件 |
| click | `(agent: Agent) => void` | 智能体点击事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: Page<Agent>) => void` | 数据加载完成事件 |
| create | `() => void` | 创建智能体事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ agent: Agent, index: number, selected: boolean }` | 自定义智能体列表项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-agent-list ref="agentListRef" :api="getAgentList" />
  <van-button @click="handleRefresh">刷新</van-button>
  <van-button @click="getSelectedAgents">获取选中</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const agentListRef = ref()

const handleRefresh = () => {
  agentListRef.value.refresh()
}

const getSelectedAgents = () => {
  const selected = agentListRef.value.getSelectedAgents()
  console.log('选中智能体:', selected)
}
</script>
```

### 可用方法

- `refresh()`: 刷新数据
- `loadMore()`: 加载更多数据
- `getAgents()`: 获取当前智能体数据
- `getSelectedAgents()`: 获取选中智能体
- `clearSelected()`: 清空选中智能体
- `setSelectedAgents(agents: Agent[])`: 设置选中智能体

## 智能体数据格式

```typescript
interface Agent {
  id: string                    // 唯一标识
  name: string                  // 智能体名称
  description: string           // 智能体描述
  avatar: string                // 头像URL
  status: 'online' | 'offline' | 'busy'  // 状态
  category: string              // 分类
  tags: string[]                // 标签
  createdTime: string           // 创建时间
  updatedTime: string           // 更新时间
  usageCount: number            // 使用次数
  rating: number               // 评分（0-5）
  isPublic: boolean             // 是否公开
  owner: string                 // 所有者
}
```

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-agent-list {
  --agent-bg-color: #fff;
  --agent-border-color: #f0f0f0;
  --selected-bg-color: #e6f7ff;
  --primary-color: #1890ff;
  --online-color: #52c41a;
  --offline-color: #d9d9d9;
  --busy-color: #faad14;
}
```

## 响应式设计

组件自动适配移动端和PC端：
- 移动端：紧凑布局，适合触摸操作
- PC端：宽松布局，更好的可读性

## 注意事项

1. API方法必须返回符合Spring Boot Page结构的Promise
2. 搜索功能默认使用300ms防抖，避免频繁请求
3. 上拉加载基于IntersectionObserver，确保浏览器兼容性
4. 组件会自动处理分页逻辑，无需手动管理页码
5. 确保Vant组件已正确注册或使用自动导入

## 故障排除

### 数据不显示
- 检查API方法是否正确返回Page结构
- 确认网络请求是否成功
- 查看浏览器控制台错误信息

### 搜索不生效
- 确认searchable属性设置为true
- 检查API是否支持keyword参数
- 验证防抖函数是否正常工作

### 分页异常
- 确认pageSize设置合理
- 检查API返回的totalPages和number字段
- 验证hasMore逻辑是否正确

### 智能体状态显示异常
- 确认status字段值为'online'、'offline'或'busy'
- 检查CSS样式是否正确加载
- 验证状态指示器DOM结构