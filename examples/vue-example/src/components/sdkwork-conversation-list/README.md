# SDKWork Conversation List 组件

基于Vue 3、setup语法糖和TypeScript的聊天会话列表组件，支持Spring Boot分页标准。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 行选择和删除功能
- ✅ 会话状态显示（在线、置顶、静音、未读）
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
  <sdkwork-conversation-list
    :api="getConversationList"
    :params="{ status: 'active' }"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义空状态 -->
    <template #empty>
      <van-empty description="暂无聊天会话" image="search">
        <template #description>
          <div class="empty-description">
            <p>暂时没有聊天会话</p>
            <p class="empty-tip">您可以开始新的对话或调整搜索条件</p>
          </div>
        </template>
      </van-empty>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载会话数据...</van-loading>
    </template>
  </sdkwork-conversation-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Conversation, ConversationPage, ConversationPageable } from './types'

// API方法
const getConversationList = async (params: ConversationPageable): Promise<ConversationPage> => {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (conversation: Conversation) => {
  console.log('选中会话:', conversation)
}

const handleDelete = (conversation: Conversation) => {
  console.log('删除会话:', conversation)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: ConversationPage) => {
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

### 输入参数 (ConversationPageable)

```typescript
interface ConversationPageable extends Pageable {
  filters?: {
    status?: 'active' | 'archived' | 'deleted'
    type?: 'text' | 'voice' | 'video'
    keyword?: string
    agentId?: string
    pinned?: boolean
    muted?: boolean
    startTime?: string
    endTime?: string
  }
}
```

### 输出结果 (ConversationPage)

```typescript
type ConversationPage = Page<Conversation>
```

### 会话实体 (Conversation)

```typescript
interface Conversation {
  id: string
  title: string
  description?: string
  type: 'text' | 'voice' | 'video'
  status: 'active' | 'archived' | 'deleted'
  participants: ConversationParticipant[]
  lastMessage?: ConversationMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
  agentId?: string
  agentName?: string
  tags?: string[]
  pinned: boolean
  muted: boolean
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: ConversationPageable) => Promise<ConversationPage>` | - | 必传，API请求方法 |
| params | `ConversationQueryParams` | `{}` | 会话查询参数 |
| selectable | `boolean` | `false` | 是否支持行选择 |
| deletable | `boolean` | `false` | 是否支持行删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| itemKey | `string` | `'id'` | 列表项唯一键字段名 |
| itemTitleField | `string` | `'title'` | 列表项标题字段名 |
| itemDescriptionField | `string` | `'description'` | 列表项描述字段名 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(conversation: Conversation) => void` | 会话选择事件 |
| delete | `(conversation: Conversation) => void` | 会话删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: ConversationPage) => void` | 数据加载完成事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ conversation: Conversation, index: number, selected: boolean }` | 自定义会话项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-conversation-list ref="conversationListRef" :api="getConversations" />
  <van-button @click="handleRefresh">刷新</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const conversationListRef = ref()

const handleRefresh = () => {
  conversationListRef.value.refresh()
}

const getSelectedConversations = () => {
  const selected = conversationListRef.value.getSelectedItems()
  console.log('选中会话:', selected)
}
</script>
```

### 可用方法

- `refresh()`: 刷新数据
- `loadMore()`: 加载更多数据
- `getData()`: 获取当前数据
- `getSelectedItems()`: 获取选中项
- `clearSelected()`: 清空选中项
- `setSelectedItems(items: Conversation[])`: 设置选中项

## 会话项特性

### 状态显示
- **在线状态**: 头像右下角显示在线/离线标识
- **置顶会话**: 标题前显示置顶图标，背景色区分
- **静音会话**: 标题前显示静音图标，透明度降低
- **未读消息**: 标题加粗显示，显示未读消息计数

### 时间格式化
- 今天：显示时间（如：14:30）
- 昨天：显示"昨天"
- 7天内：显示天数（如：3天前）
- 7天外：显示日期（如：12-15）

### 消息预览
- 显示最后一条消息内容
- 智能截断长消息
- 区分用户和AI发送的消息

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-conversation-list {
  --conversation-bg-color: #fff;
  --conversation-border-color: #f0f0f0;
  --selected-bg-color: #e6f7ff;
  --pinned-bg-color: #fffaf0;
  --primary-color: #1890ff;
  --unread-color: #ff4d4f;
}
```

## 响应式设计

组件自动适配移动端和PC端：
- 移动端：紧凑布局，适合触摸操作
- PC端：宽松布局，更好的可读性

## 注意事项

1. API方法必须返回符合Spring Boot Page结构的Promise
2. 会话参与者数组至少包含一个参与者
3. 时间格式化基于本地时区
4. 组件会自动处理分页逻辑，无需手动管理页码

## 故障排除

### 数据不显示
- 检查API方法是否正确返回Page结构
- 确认会话数据格式符合Conversation接口
- 查看浏览器控制台错误信息

### 状态显示异常
- 确认participants数组不为空
- 检查online状态字段是否正确
- 验证时间字段格式是否为ISO字符串

### 搜索不生效
- 确认searchable属性设置为true
- 检查API是否支持keyword参数
- 验证防抖函数是否正常工作