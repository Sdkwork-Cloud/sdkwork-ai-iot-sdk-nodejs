<template>
  <div class="chat-text-mode">
    
    <!-- 消息列表 -->
    <chat-message-list
      ref="messageListRef"
      :messages="messages"
      :loading="loading"
      :has-more="hasMore"
      @refresh="onRefresh"
      @message-click="handleMessageClick"
      @load-more="loadMoreMessages"
      @delete-message="handleDeleteMessage"
      @resend-message="handleResendMessage"
      @copy-message="handleCopyMessage"
    />
    
    <!-- 输入框 -->
    <chat-input 
      ref="inputRef"
      @send="handleSendMessage"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
    />
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { showToast, showImagePreview } from 'vant'
import ChatMessageList from '@/components/chat/chat-message-list/chat-message-list.vue'
import ChatInput from '@/components/chat/chat-input/chat-input.vue'
import type { ChatMessage } from '@/components/chat/chat-message-list/chat-message-list.vue'

interface Conversation {
  id: string
  title: string
  avatar?: string
  unreadCount: number
  lastMessage?: ChatMessage
  isPinned: boolean
  isMuted: boolean
}

interface Props {
  conversationId: string
}

const props = defineProps<Props>()

const messages = ref<ChatMessage[]>([])
const loading = ref(false)
const hasMore = ref(true)
const messageListRef = ref<InstanceType<typeof ChatMessageList>>()
const inputRef = ref<InstanceType<typeof ChatInput>>()

// 当前会话信息
const currentConversation = reactive<Conversation>({
  id: props.conversationId,
  title: 'AI助手',
  avatar: 'https://via.placeholder.com/40',
  unreadCount: 0,
  isPinned: false,
  isMuted: false
})

// 操作菜单选项


// 模拟消息数据
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'text',
    content: '您好，有什么可以帮助您的？',
    sender: {
      id: 'system',
      name: 'AI助手',
      avatar: 'https://via.placeholder.com/40'
    },
    timestamp: Date.now() - 300000,
    isOwn: false
  },
  {
    id: '2',
    type: 'text',
    content: '我想了解一下产品的功能',
    sender: {
      id: 'user',
      name: '用户',
      avatar: 'https://via.placeholder.com/40'
    },
    timestamp: Date.now() - 240000,
    isOwn: true
  },
  {
    id: '3',
    type: 'text',
    content: '我们的产品支持智能家居控制、语音助手、安防监控等功能',
    sender: {
      id: 'system',
      name: 'AI助手',
      avatar: 'https://via.placeholder.com/40'
    },
    timestamp: Date.now() - 180000,
    isOwn: false
  }
]

// 事件处理函数



const onRefresh = async () => {
  loading.value = true
  
  // 模拟刷新消息
  setTimeout(() => {
    messages.value = [...mockMessages]
    loading.value = false
    showToast('刷新成功')
  }, 1000)
}

const loadMoreMessages = async () => {
  if (!hasMore.value) return
  
  loading.value = true
  
  // 模拟加载更多消息
  setTimeout(() => {
    const moreMessages: ChatMessage[] = [
      {
        id: (messages.value.length + 1).toString(),
        type: 'text',
        content: '这是更早的消息',
        sender: {
          id: 'system',
          name: 'AI助手',
          avatar: 'https://via.placeholder.com/40'
        },
        timestamp: Date.now() - 600000,
        isOwn: false
      }
    ]
    
    messages.value = [...moreMessages, ...messages.value]
    loading.value = false
    hasMore.value = messages.value.length < 20 // 模拟限制
  }, 800)
}

const handleSendMessage = async (message: string) => {
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    type: 'text',
    content: message,
    sender: {
      id: 'user',
      name: '用户',
      avatar: 'https://via.placeholder.com/40'
    },
    timestamp: Date.now(),
    status: 'sending',
    isOwn: true
  }
  
  messages.value.push(newMessage)
  
  // 模拟发送中状态
  setTimeout(() => {
    const index = messages.value.findIndex(m => m.id === newMessage.id)
    if (index !== -1) {
      messages.value[index].status = 'sent'
    }
  }, 500)
  
  // 模拟回复
  setTimeout(() => {
    const replyMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'text',
      content: '收到您的消息，我们会尽快处理',
      sender: {
        id: 'system',
        name: 'AI助手',
        avatar: 'https://via.placeholder.com/40'
      },
      timestamp: Date.now() + 1000,
      status: 'sent',
      isOwn: false
    }
    messages.value.push(replyMessage)
  }, 1500)
}

const handleMessageClick = (message: ChatMessage) => {
  if (message.type === 'image') {
    showImagePreview([message.content])
  }
}

const handleDeleteMessage = (message: ChatMessage) => {
  messages.value = messages.value.filter(m => m.id !== message.id)
  showToast('消息已删除')
}

const handleResendMessage = (message: ChatMessage) => {
  const index = messages.value.findIndex(m => m.id === message.id)
  if (index !== -1) {
    messages.value[index].status = 'sending'
    
    // 模拟重新发送
    setTimeout(() => {
      messages.value[index].status = 'sent'
      showToast('发送成功')
    }, 1000)
  }
}

const handleCopyMessage = (message: ChatMessage) => {
  navigator.clipboard.writeText(message.content)
  showToast('已复制到剪贴板')
}

const handleInputFocus = () => {
  // 输入框获得焦点时的处理
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

const handleInputBlur = () => {
  // 输入框失去焦点时的处理
}



// 初始化消息
onMounted(() => {
  messages.value = [...mockMessages]
  
  // 自动滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
})
</script>

<style scoped lang="scss">
.chat-text-mode {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  position: relative;
  
  :deep(.chat-message-list) {
    flex: 1;
    overflow: hidden;
    padding-bottom: 120px; // 为固定输入框预留空间
    padding-top: 0; // 移除顶部padding以适配导航栏
  }
  
  :deep(.chat-input) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}
</style>