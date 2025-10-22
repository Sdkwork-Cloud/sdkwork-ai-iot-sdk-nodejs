# SDKWork Chat 使用示例

## 🚀 快速开始

### 1. 基础使用

```vue
<template>
  <div class="chat-container">
    <sdkwork-chat
      :current-user="currentUser"
      :messages="messages"
      :config="chatConfig"
      @send-message="handleSendMessage"
      @revoke-message="handleRevokeMessage"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { User, Message, ChatConfig } from './types'

// 当前用户信息
const currentUser = ref<User>({
  id: 'user-1',
  name: '张三',
  avatar: '/avatars/user1.jpg'
})

// 消息列表
const messages = ref<Message[]>([
  {
    id: 'msg-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: '你好！',
    type: 'text',
    status: 'read',
    timestamp: Date.now() - 300000,
    isOwn: false
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: '你好，很高兴认识你！',
    type: 'text',
    status: 'read',
    timestamp: Date.now() - 200000,
    isOwn: true
  }
])

// 聊天配置
const chatConfig = reactive<ChatConfig>({
  showTimestamp: true,
  showReadStatus: true,
  enableRevoke: true,
  enableFileUpload: true,
  maxFileSize: 10,
  allowedFileTypes: ['image/*', 'application/pdf']
})

// 处理消息发送
const handleSendMessage = (message: Omit<Message, 'id' | 'status' | 'timestamp'>) => {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    status: 'sending',
    timestamp: Date.now()
  }
  
  messages.value.push(newMessage)
  
  // 模拟发送到服务器
  setTimeout(() => {
    newMessage.status = 'sent'
  }, 1000)
}

// 处理消息撤回
const handleRevokeMessage = (messageId: string) => {
  const message = messages.value.find(msg => msg.id === messageId)
  if (message) {
    message.status = 'revoked'
  }
}

// 加载更多消息
const handleLoadMore = () => {
  // 实现加载更多逻辑
  console.log('加载更多消息')
}
</script>

<style scoped>
.chat-container {
  height: 600px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

### 2. 自定义消息类型

```vue
<template>
  <sdkwork-chat
    :current-user="currentUser"
    :messages="messages"
    :config="chatConfig"
    @send-message="handleSendMessage"
  >
    <!-- 自定义消息渲染 -->
    <template #message-content="{ message }">
      <div v-if="message.type === 'custom'">
        <custom-message :message="message" />
      </div>
    </template>
    
    <!-- 自定义工具栏 -->
    <template #toolbar>
      <custom-toolbar @custom-action="handleCustomAction" />
    </template>
  </sdkwork-chat>
</template>

<script setup lang="ts">
import CustomMessage from './components/CustomMessage.vue'
import CustomToolbar from './components/CustomToolbar.vue'

const handleCustomAction = (action: string) => {
  console.log('自定义操作:', action)
}
</script>
```

## 📱 移动端适配

### 响应式配置

```vue
<template>
  <sdkwork-chat
    :current-user="currentUser"
    :messages="messages"
    :config="mobileConfig"
    class="mobile-chat"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const mobileConfig = computed(() => ({
  showTimestamp: false, // 移动端简化时间显示
  showReadStatus: true,
  enableRevoke: true,
  enableFileUpload: true,
  maxFileSize: 5, // 移动端限制文件大小
  allowedFileTypes: ['image/*'] // 移动端主要支持图片
}))
</script>

<style scoped>
.mobile-chat {
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 移动端样式优化 */
@media (max-width: 768px) {
  .mobile-chat {
    --chat-bubble-padding: 8px 12px;
    --chat-font-size: 14px;
  }
}
</style>
```

## 🔌 API 集成示例

### 1. 与后端 API 集成

```typescript
// api/chat.ts
import type { Message, User } from './types'

export class ChatAPI {
  private baseURL = '/api'
  
  // 发送消息
  async sendMessage(message: Omit<Message, 'id' | 'status' | 'timestamp'>): Promise<Message> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    })
    
    if (!response.ok) {
      throw new Error('发送消息失败')
    }
    
    return response.json()
  }
  
  // 获取消息历史
  async getMessages(conversationId: string, page = 1, limit = 20): Promise<Message[]> {
    const response = await fetch(
      `${this.baseURL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    )
    
    if (!response.ok) {
      throw new Error('获取消息失败')
    }
    
    return response.json()
  }
  
  // 撤回消息
  async revokeMessage(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/messages/${messageId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('撤回消息失败')
    }
  }
}
```

### 2. Vue 组合式函数

```typescript
// composables/useChat.ts
import { ref, reactive, computed } from 'vue'
import { ChatAPI } from '../api/chat'
import type { Message, User, ChatConfig } from '../types'

export function useChat(currentUser: User, conversationId: string) {
  const api = new ChatAPI()
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  
  const chatConfig = reactive<ChatConfig>({
    showTimestamp: true,
    showReadStatus: true,
    enableRevoke: true,
    enableFileUpload: true
  })
  
  // 加载消息
  const loadMessages = async (page = 1) => {
    if (loading.value) return
    
    loading.value = true
    try {
      const newMessages = await api.getMessages(conversationId, page)
      if (page === 1) {
        messages.value = newMessages
      } else {
        messages.value = [...newMessages, ...messages.value]
      }
      hasMore.value = newMessages.length === 20
    } catch (error) {
      console.error('加载消息失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 发送消息
  const sendMessage = async (content: string) => {
    const messageData = {
      senderId: currentUser.id,
      receiverId: conversationId,
      content,
      type: 'text' as const
    }
    
    // 乐观更新
    const tempMessage: Message = {
      ...messageData,
      id: `temp-${Date.now()}`,
      status: 'sending',
      timestamp: Date.now(),
      isOwn: true
    }
    
    messages.value.push(tempMessage)
    
    try {
      const sentMessage = await api.sendMessage(messageData)
      // 替换临时消息
      const index = messages.value.findIndex(msg => msg.id === tempMessage.id)
      if (index !== -1) {
        messages.value.splice(index, 1, sentMessage)
      }
    } catch (error) {
      // 发送失败，更新状态
      tempMessage.status = 'failed'
      console.error('发送消息失败:', error)
    }
  }
  
  return {
    messages,
    loading,
    hasMore,
    chatConfig,
    loadMessages,
    sendMessage
  }
}
```

## 🎨 主题定制

### 1. 自定义主题

```vue
<template>
  <sdkwork-chat
    :current-user="currentUser"
    :messages="messages"
    :class="themeClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const theme = ref<'light' | 'dark'>('light')

const themeClass = computed(() => ({
  'chat-theme-light': theme.value === 'light',
  'chat-theme-dark': theme.value === 'dark'
}))
</script>

<style>
.chat-theme-light {
  --chat-primary-color: #007aff;
  --chat-bg-color: #ffffff;
  --chat-text-color: #333333;
}

.chat-theme-dark {
  --chat-primary-color: #0a84ff;
  --chat-bg-color: #1c1c1e;
  --chat-text-color: #ffffff;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .chat-theme-auto {
    --chat-primary-color: #0a84ff;
    --chat-bg-color: #1c1c1e;
    --chat-text-color: #ffffff;
  }
}
</style>
```

### 2. 国际化支持

```typescript
// locales/chat.ts
export const chatLocales = {
  'zh-CN': {
    send: '发送',
    placeholder: '输入消息...',
    revoke: '撤回',
    sending: '发送中',
    sent: '已发送',
    read: '已读'
  },
  'en-US': {
    send: 'Send',
    placeholder: 'Type a message...',
    revoke: 'Revoke',
    sending: 'Sending',
    sent: 'Sent',
    read: 'Read'
  }
}

// 在组件中使用
const { t } = useI18n()
const placeholder = computed(() => t('chat.placeholder'))
```

## 🔧 高级功能

### 1. 消息搜索

```vue
<template>
  <div>
    <chat-search 
      v-model="searchKeyword"
      @search="handleSearch"
    />
    <sdkwork-chat
      :current-user="currentUser"
      :messages="filteredMessages"
      :highlight="searchKeyword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const allMessages = ref<Message[]>([])

const filteredMessages = computed(() => {
  if (!searchKeyword.value) return allMessages.value
  
  return allMessages.value.filter(message =>
    message.content.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
}
</script>
```

### 2. 消息状态同步

```typescript
// 使用 WebSocket 实时同步消息状态
const setupWebSocket = (conversationId: string) => {
  const ws = new WebSocket(`ws://localhost:8080/chat/${conversationId}`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    
    switch (data.type) {
      case 'message_sent':
        // 更新消息状态
        updateMessageStatus(data.messageId, 'sent')
        break
      case 'message_read':
        // 更新已读状态
        updateMessageStatus(data.messageId, 'read')
        break
      case 'new_message':
        // 接收新消息
        messages.value.push(data.message)
        break
    }
  }
  
  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      message.status = status
    }
  }
}
```

## 🐛 常见问题解决

### 1. 消息重复问题

```typescript
// 使用 Set 或 Map 避免消息重复
const messageMap = new Map<string, Message>()

const addMessage = (message: Message) => {
  if (!messageMap.has(message.id)) {
    messageMap.set(message.id, message)
    messages.value = Array.from(messageMap.values())
      .sort((a, b) => a.timestamp - b.timestamp)
  }
}
```

### 2. 性能优化

```typescript
// 使用虚拟滚动处理大量消息
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(messages, {
  itemHeight: 80,
  overscan: 10
})
```

## 📋 最佳实践

1. **状态管理**: 使用 Pinia 或 Vuex 管理全局聊天状态
2. **错误处理**: 实现完整的错误边界和重试机制
3. **性能监控**: 添加性能监控和日志记录
4. **测试覆盖**: 编写单元测试和集成测试
5. **文档维护**: 保持 API 文档和示例代码的更新

---

*示例文档版本: v1.0.0*
*最后更新: 2025-09-29*