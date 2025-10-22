# SdkworkConversationListItem 会话列表项组件

仿微信风格的会话列表项组件，支持完整的会话展示功能，包括头像、标题、时间、消息预览、未读计数等。

## 特性

- ✅ 仿微信聊天会话列表设计
- ✅ 支持 light/dark/auto 主题模式
- ✅ 头像显示与在线状态指示
- ✅ 会话标题和时间格式化
- ✅ 最后消息预览与截断
- ✅ 未读消息计数徽章
- ✅ 置顶会话标识
- ✅ 选中状态高亮
- ✅ 响应式移动端适配
- ✅ TypeScript 完整支持

## 基础用法

```vue
<template>
  <SdkworkConversationListItem 
    :conversation="conversation"
    :is-selected="selected"
    @click="handleClick"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const conversation = ref({
  id: '1',
  title: '张三',
  participants: [
    {
      id: 'user1',
      name: '张三',
      avatar: '/avatar.jpg',
      online: true
    }
  ],
  lastMessage: {
    content: '你好，最近怎么样？',
    timestamp: '2024-01-20T10:30:00Z'
  },
  unreadCount: 3,
  pinned: false,
  updatedAt: '2024-01-20T10:30:00Z'
})

const selected = ref(false)

const handleClick = (conversation) => {
  console.log('点击会话:', conversation)
}

const handleSelect = (conversation) => {
  console.log('选中会话:', conversation)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `conversation` | `Conversation` | - | **必需**，会话数据对象 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `isSelected` | `boolean` | `false` | 是否选中 |
| `border` | `boolean` | `true` | 是否显示底部边框 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

### Conversation 数据结构

```typescript
interface Conversation {
  id: string
  title: string
  participants: Participant[]
  lastMessage?: {
    content: string
    timestamp: string
  }
  unreadCount: number
  pinned: boolean
  updatedAt: string
}

interface Participant {
  id: string
  name: string
  avatar?: string
  online?: boolean
}
```

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `conversation: Conversation` | 点击会话项 |
| `select` | `conversation: Conversation` | 选中会话项 |

## 主题配置

```vue
<template>
  <!-- 自动主题（跟随系统） -->
  <SdkworkConversationListItem 
    :conversation="conversation"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <SdkworkConversationListItem 
    :conversation="conversation"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <SdkworkConversationListItem 
    :conversation="conversation"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 在会话列表中使用

```vue
<template>
  <div class="conversation-list">
    <SdkworkConversationListItem 
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
      :is-selected="selectedId === conversation.id"
      @click="selectConversation(conversation)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const conversations = ref([
  {
    id: '1',
    title: '张三',
    participants: [{ id: '1', name: '张三', avatar: '/avatar1.jpg', online: true }],
    lastMessage: { content: '你好！', timestamp: '2024-01-20T10:30:00Z' },
    unreadCount: 2,
    pinned: true,
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    title: '李四',
    participants: [{ id: '2', name: '李四', avatar: '/avatar2.jpg', online: false }],
    lastMessage: { content: '明天见！', timestamp: '2024-01-19T15:20:00Z' },
    unreadCount: 0,
    pinned: false,
    updatedAt: '2024-01-19T15:20:00Z'
  }
])

const selectedId = ref('1')

const selectConversation = (conversation) => {
  selectedId.value = conversation.id
}
</script>
```

### 自定义样式

```vue
<template>
  <SdkworkConversationListItem 
    :conversation="conversation"
    class="custom-conversation-item"
  />
</template>

<style scoped>
.custom-conversation-item {
  border-radius: 8px;
  margin: 4px 0;
}

.custom-conversation-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

## 响应式设计

组件已针对移动端进行优化：
- 在小屏幕设备上自动调整间距和字体大小
- 触摸友好的交互区域
- 优化的文本截断处理

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. **必需属性**: `conversation` 属性是必需的，必须提供有效的会话数据
2. **头像加载**: 组件会自动处理头像加载失败的情况，显示默认图标
3. **时间格式化**: 时间会自动格式化为相对时间（如"昨天"、"2天前"）
4. **主题适配**: 默认使用 `auto` 模式，会自动检测系统主题偏好

## 相关组件

- [SdkworkConversationList](../sdkwork-conversation-list/) - 会话列表容器组件
- [SdkworkCell](../sdkwork-cell/) - 基础单元格组件
- [SdkworkIcon](../sdkwork-icon/) - 图标组件