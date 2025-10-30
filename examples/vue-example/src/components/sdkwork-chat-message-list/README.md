# SDKWork Chat Message List 组件

基于 `sdkwork-api-list` 构建的高可扩展聊天消息列表组件，支持完整的属性和 API。

## 特性

- ✅ 基于 `sdkwork-api-list` 构建，继承所有基础功能
- ✅ 支持完整的属性和事件系统
- ✅ 自动消息归属判断和时间格式化
- ✅ 支持时间分隔线和消息状态显示
- ✅ 完整的暗色主题支持
- ✅ 移动端适配
- ✅ 高度可自定义的插槽系统

## 安装和使用

### 基本使用

```vue
<template>
  <sdkwork-chat-message-list
    :api="fetchMessages"
    :current-user-id="currentUserId"
    :receiver="receiver"
    :conversation-id="conversationId"
    @message-click="handleMessageClick"
    @load-more="handleLoadMore"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChatMessageVO, UserVO } from '@/services'

const currentUserId = ref('user123')
const receiver = ref<UserVO>({
  id: 'user456',
  nickname: '张三',
  avatar: '/avatars/user456.jpg'
})
const conversationId = ref('conv123')

// API 方法
const fetchMessages = async (params: any, pageableParams: any) => {
  const response = await fetch(`/api/messages/${conversationId.value}`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      ...pageableParams
    })
  })
  return await response.json()
}

// 事件处理
const handleMessageClick = (message: ChatMessageVO) => {
  console.log('消息点击:', message)
}

const handleLoadMore = () => {
  console.log('加载更多消息')
}
</script>
```

### 使用 Service

```vue
<template>
  <sdkwork-chat-message-list
    :service="messageService"
    :params="{ conversationId }"
    :current-user-id="currentUserId"
    :show-avatar="true"
    :show-time-divider="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageService } from '@/services'

const messageService = new MessageService()
const currentUserId = ref('user123')
const conversationId = ref('conv123')
</script>
```

## Props

### 基础 API Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `api` | `Function` | - | API 请求方法 |
| `service` | `CURDService` | - | CRUD 服务实例 |
| `params` | `Object` | `{}` | 查询参数 |
| `pageableParams` | `Object` | `{}` | 分页排序参数 |
| `pageSize` | `number` | `20` | 每页显示条数 |

### 聊天消息特定 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currentUserId` | `string\|number` | - | 当前用户ID |
| `currentUser` | `UserVO` | - | 当前用户信息 |
| `receiver` | `UserVO` | - | 接收者信息 |
| `conversationId` | `string` | - | 会话ID |
| `showAvatar` | `boolean` | `true` | 是否显示头像 |
| `autoScrollToBottom` | `boolean` | `true` | 是否自动滚动到底部 |
| `showTimeDivider` | `boolean` | `true` | 是否显示时间分隔线 |
| `showMessageStatus` | `boolean` | `true` | 是否显示消息状态 |
| `enableLongPress` | `boolean` | `true` | 是否支持消息长按 |
| `enableClick` | `boolean` | `true` | 是否支持消息点击 |

### 列表配置 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selectable` | `boolean` | `false` | 是否支持项选择 |
| `deletable` | `boolean` | `false` | 是否支持项删除 |
| `searchable` | `boolean` | `false` | 是否支持搜索 |
| `showNoMoreData` | `boolean` | `true` | 是否显示没有更多数据提示 |
| `themeMode` | `'dark'\|'light'\|'auto'` | `'auto'` | 主题模式 |

## Events

### 基础事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `select` | `message: ChatMessageVO` | 项选择事件 |
| `delete` | `message: ChatMessageVO` | 项删除事件 |
| `search` | `keyword: string` | 搜索事件 |
| `load` | `pageData: Page<ChatMessageVO>` | 数据加载完成事件 |

### 聊天消息特定事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `message-click` | `message: ChatMessageVO` | 消息点击事件 |
| `message-long-press` | `message: ChatMessageVO` | 消息长按事件 |
| `load-more` | - | 加载更多消息 |
| `scroll-to-bottom` | - | 滚动到底部事件 |
| `scroll-to-top` | - | 滚动到顶部事件 |

## Slots

### 基础插槽

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| `default` | `{ message, index, isOwn }` | 自定义消息项内容 |
| `empty` | - | 空状态内容 |
| `loading` | - | 加载状态内容 |

### 聊天消息特定插槽

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| `message-header` | `{ message, index }` | 消息头部内容 |
| `message-content` | `{ message, index, isOwn }` | 消息内容区域 |
| `message-footer` | `{ message, index }` | 消息尾部内容 |
| `time-divider` | `{ time, messages }` | 时间分隔线内容 |
| `load-more` | `{ loading, hasMore }` | 加载更多内容 |

## 方法

通过 `ref` 可以调用以下方法：

```vue
<template>
  <sdkwork-chat-message-list ref="messageList" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const messageList = ref()

// 滚动到底部
messageList.value.scrollToBottom()

// 添加消息
messageList.value.addMessage(newMessage)

// 获取消息列表
const messages = messageList.value.getMessages()

// 标记消息为已读
messageList.value.markAsRead()
</script>
```

### 可用方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `scrollToBottom()` | - | - | 滚动到底部 |
| `scrollToTop()` | - | - | 滚动到顶部 |
| `scrollToMessage(messageId)` | `messageId: string\|number` | - | 滚动到指定消息 |
| `addMessage(message)` | `message: ChatMessageVO` | - | 添加消息 |
| `updateMessage(messageId, updates)` | `messageId: string\|number`, `updates: Partial<ChatMessageVO>` | - | 更新消息 |
| `deleteMessage(messageId)` | `messageId: string\|number` | - | 删除消息 |
| `clearMessages()` | - | - | 清空消息列表 |
| `getMessages()` | - | `ChatMessageVO[]` | 获取消息列表 |
| `getUnreadCount()` | - | `number` | 获取未读消息数量 |
| `markAsRead(messageId?)` | `messageId?: string\|number` | - | 标记消息为已读 |

## 自定义样式

组件支持完整的 CSS 自定义，可以通过以下类名进行样式覆盖：

```css
.sdkwork-chat-message-list {
  /* 容器样式 */
}

.sdkwork-chat-message-list .message-item-wrapper {
  /* 消息项容器 */
}

.sdkwork-chat-message-list .message-bubble {
  /* 消息气泡 */
}

.sdkwork-chat-message-list .time-divider {
  /* 时间分隔线 */
}

/* 暗色主题 */
.sdkwork-chat-message-list.dark-mode {
  /* 暗色主题样式 */
}
```

## 高级用法

### 自定义消息渲染

```vue
<template>
  <sdkwork-chat-message-list :api="fetchMessages">
    <template #message-content="{ message, isOwn }">
      <div class="custom-message">
        <div v-if="message.type === 'image'" class="image-message">
          <img :src="message.content" :alt="message.fileName" />
        </div>
        <div v-else-if="message.type === 'file'" class="file-message">
          <FileIcon />
          <span>{{ message.fileName }}</span>
        </div>
        <div v-else class="text-message">
          {{ message.content }}
        </div>
      </div>
    </template>
  </sdkwork-chat-message-list>
</template>
```

### 自定义时间分隔线

```vue
<template>
  <sdkwork-chat-message-list :api="fetchMessages">
    <template #time-divider="{ time, messages }">
      <div class="custom-time-divider">
        <div class="divider-line"></div>
        <span class="time-text">{{ time }}</span>
        <div class="divider-line"></div>
      </div>
    </template>
  </sdkwork-chat-message-list>
</template>
```

## 注意事项

1. 组件需要 `ChatMessageVO` 类型定义，请确保项目中已定义
2. 消息的 `isOwn` 属性会自动根据 `currentUserId` 和消息的 `senderId` 计算
3. 时间格式化会自动处理今天、昨天、一周内等时间显示
4. 组件支持响应式设计，会自动适配移动端

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+