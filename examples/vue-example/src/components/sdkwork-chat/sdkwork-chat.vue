<template>
  <div class="sdkwork-chat">
    <!-- 聊天头部 - 支持slot -->
    <div class="chat-header">
      <slot name="header">
        <!-- 默认使用vant nav-bar -->
        <van-nav-bar
          :title="receiver?.nickname || '聊天对象'"
          :left-arrow="showBackButton"
          @click-left="handleBack"
          @click-right="handleMoreAction"
        />
      </slot>
    </div>

    <!-- 消息列表区域 -->
    <div class="chat-body">
      <chat-message-list
        :messages="processedMessages"
        :current-user-id="currentUser.id as string"
        :current-user="currentUser"
        :receiver="receiver"
        @load-more="handleLoadMore"
        @message-click="handleMessageClick"
      />
    </div>

    <!-- 消息输入区域 -->
    <div class="chat-footer">
      <chat-input
        :placeholder="config?.placeholder || '输入消息...'"
        :max-length="config?.maxLength || 1000"
        :support-file="config?.enableFileUpload"
        :support-image="config?.enableFileUpload"
        :support-voice="true"
        @send-message="handleSendMessage"
        @upload-file="handleUploadFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import type { ChatMessageVO } from '@/services'
import type { UserVO } from '@/services/src/service/user/types'
import { useChatStore } from '@/stores/modules/chat'
import ChatMessageList from './components/chat-message-list/chat-message-list.vue'
import ChatInput from './components/chat-input/chat-input.vue'

// 定义组件属性
interface Props {
  currentUser: UserVO
  receiver?: UserVO
  messages: ChatMessageVO[]
  showBackButton?: boolean
  interlocutorStatus?: string
  config?: {
    showTimestamp?: boolean
    showReadStatus?: boolean
    enableRevoke?: boolean
    enableFileUpload?: boolean
    maxFileSize?: number
    allowedFileTypes?: string[]
    placeholder?: string
    maxLength?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: true,
  interlocutorStatus: '在线',
  config: () => ({
    showTimestamp: true,
    showReadStatus: true,
    enableRevoke: true,
    enableFileUpload: true,
    maxFileSize: 10,
    allowedFileTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
    placeholder: '输入消息...',
    maxLength: 1000
  })
})

// 定义组件事件
interface Emits {
  'send-message': [messageData: Omit<ChatMessageVO, 'id' | 'status' | 'timestamp'>]
  'upload-file': [file: File]
  'load-more': []
  'message-click': [message: ChatMessageVO]
  'back': []
}

const emit = defineEmits<Emits>()

// 使用chat store
const chatStore = useChatStore()

// 处理返回按钮点击
const handleBack = () => {
  emit('back')
}

// 处理更多操作点击
const handleMoreAction = () => {
  // 这里可以添加更多操作菜单的逻辑
  console.log('更多操作按钮被点击')
}

// 响应式数据
const messages = ref<ChatMessageVO[]>([])

// 计算属性：处理消息显示
const processedMessages = computed(() => {
  return messages.value.map(msg => ({
    ...msg,
    isOwn: msg.role === 'USER'
  }))
})

// 监听传入的消息列表变化
watch(() => props.messages, (newMessages) => {
  messages.value = [...newMessages.map(msg => ({...msg}))]
}, { immediate: true, deep: true })

// 处理发送消息
const handleSendMessage = async (messageData: Omit<ChatMessageVO, 'id' | 'status' | 'timestamp'>) => {
  try {
    // 确保content是字符串类型
    const content = typeof messageData.content === 'string' ? messageData.content : JSON.stringify(messageData.content)
    // 使用chat store发送消息
    await chatStore.sendMessage(content)
    emit('send-message', messageData)
  } catch (error) {
    console.error('发送消息失败:', error)
    // 可以添加错误处理逻辑
  }
}

// 处理文件上传
const handleUploadFile = async (file: File) => {
  try {
    const result = await emit('upload-file', file)
    return result
  } catch (error) {
    console.error('文件上传失败:', error)
    throw error
  }
}

// 处理加载更多消息
const handleLoadMore = () => {
  emit('load-more')
}

// 处理消息点击
const handleMessageClick = (message: ChatMessageVO) => {
  emit('message-click', message)
}
</script>

<style scoped>
.sdkwork-chat {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 默认使用 vh */
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 支持 dvh 的浏览器使用 dvh */
@supports (height: 100dvh) {
  .sdkwork-chat {
    height: 100dvh;
  }
}

.chat-header {
  /* vant nav-bar 会自带样式，这里主要处理自定义布局 */
}

.nav-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.status {
  font-size: 11px;
  color: #666;
  line-height: 1.2;
}

.chat-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.chat-footer {
  background-color: #fff;
  border-top: 1px solid #e0e0e0; 
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sdkwork-chat {
    height: 100vh; /* 默认使用 vh */
  }
  
  /* 支持 dvh 的浏览器使用 dvh */
  @supports (height: 100dvh) {
    .sdkwork-chat {
      height: 100dvh;
    }
  }
  
  .avatar {
    width: 28px;
    height: 28px;
  }
  
  .username {
    font-size: 13px;
  }
  
  .status {
    font-size: 10px;
  }
}

/* 暗色主题支持 */
:root[data-theme="dark"] .sdkwork-chat {
  background-color: #1a1a1a;
  color: #fff;
}

@media (prefers-color-scheme: dark) {
  .sdkwork-chat {
    background-color: #1a1a1a;
    color: #fff;
  }
  
  .chat-header {
    background-color: #2d2d2d;
    border-bottom-color: #404040;
  }
  
  .username {
    color: #fff;
  }
  
  .status {
    color: #aaa;
  }
  
  .icon-button {
    color: #aaa;
  }
  
  .icon-button:hover {
    background-color: #3a3a3a;
  }
  
  .chat-footer {
    background-color: #2d2d2d;
    border-top-color: #404040;
  }
  
  /* Vant NavBar 暗色主题适配 */
  .van-nav-bar {
    background-color: #2d2d2d !important;
    color: #fff !important;
  }
  
  .van-nav-bar__title {
    color: #ffffff !important;
    font-weight: 600;
  }
  
  .van-nav-bar__left,
  .van-nav-bar__right {
    color: #fff !important;
  }
  
  .van-icon {
    color: #fff !important;
  }
  
  .van-nav-bar__arrow {
    color: #fff !important;
  }
  
  /* 确保自定义内容在暗色主题下也正确显示 */
  .nav-bar-left .username {
    color: #fff !important;
  }
  
  .nav-bar-left .status {
    color: #aaa !important;
  }
}

/* 手动切换暗色主题 */
.sdkwork-chat.dark-mode {
  background-color: #1a1a1a;
  color: #fff;
}

.sdkwork-chat.dark-mode .chat-header {
  background-color: #2d2d2d;
  border-bottom-color: #404040;
}

.sdkwork-chat.dark-mode .username {
  color: #fff;
}

.sdkwork-chat.dark-mode .status {
  color: #aaa;
}

.sdkwork-chat.dark-mode .chat-footer {
  background-color: #2d2d2d;
  border-top-color: #404040;
}

.sdkwork-chat.dark-mode .van-nav-bar {
  background-color: #2d2d2d !important;
  color: #fff !important;
}

.sdkwork-chat.dark-mode .van-nav-bar__title {
  color: #fff !important;
  font-weight: 600;
}

.sdkwork-chat.dark-mode .van-nav-bar__left,
.sdkwork-chat.dark-mode .van-nav-bar__right {
  color: #fff !important;
}

.sdkwork-chat.dark-mode .van-icon {
  color: #fff !important;
}

.sdkwork-chat.dark-mode .van-nav-bar__arrow {
  color: #fff !important;
}

/* 确保自定义内容在手动暗色主题下也正确显示 */
.sdkwork-chat.dark-mode .nav-bar-left .username {
  color: #fff !important;
}

.sdkwork-chat.dark-mode .nav-bar-left .status {
  color: #aaa !important;
}
</style>