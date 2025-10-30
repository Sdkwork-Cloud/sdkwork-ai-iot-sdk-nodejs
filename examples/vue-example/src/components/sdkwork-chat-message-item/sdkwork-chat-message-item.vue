<template>
  <div class="chat-message-item" :class="{
    'message-own': isOwn,
    'message-other': !isOwn,
    'message-sending': message.status === 'PROCESSING',
    'message-failed': message.status === 'FAILED',
    'message-revoked': message.status === 'DELETED',
    'show-avatar': props.showAvatar
  }" @click="handleClick" @contextmenu="handleContextMenu" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
    <!-- 对方消息头像（左侧） -->
    <div v-if="!isOwn && showAvatar" class="message-avatar avatar-left" @click="handleAvatarClick(receiver)">
      <img v-if="receiver?.faceImage?.url" 
           :src="receiver.faceImage.url" 
           :alt="receiver.nickname"
           class="avatar-image"
           loading="lazy"
           @error="handleImageError" />
      <div v-else class="avatar-placeholder">
        {{ getAvatarText(receiver?.nickname) }}
      </div>
      <!-- 在线状态指示器 -->
      <div v-if="receiver?.onlineStatus === 'ONLINE'" class="online-indicator"></div>
    </div>

    <!-- 消息内容区域 -->
    <div class="message-content">
      <!-- 消息气泡 -->
      <sdkwork-chat-message-bubble :message="message" :is-own="isOwn" @bubble-click="$emit('message-click', message)">
        <!-- 消息内容插槽 -->
        <sdkwork-chat-message-content :message="message" />
      </sdkwork-chat-message-bubble>

      <!-- 消息状态和时间 -->
      <div class="message-meta">
        <!-- 时间戳 -->
        <span v-if="showTimestamp" class="message-time">
          {{ formatTime(message.createdAt || Date.now()) }}
        </span>

        <!-- 消息状态 -->
        <div v-if="isOwn" class="message-status">
          <span v-if="message.status === 'PROCESSING'" class="status-sending">发送中</span>
          <span v-else-if="message.status === 'FAILED'" class="status-failed">发送失败</span>
          <span v-else-if="message.status === 'SENT'" class="status-sent">已发送</span>
          <span v-else-if="message.status === 'DELIVERED'" class="status-delivered">已送达</span>
          <span v-else-if="message.status === 'READ'" class="status-read">已读</span>
          <span v-else-if="message.status === 'DELETED'" class="status-revoked">已撤回</span>
        </div>
      </div>
    </div>

    <!-- 自己消息头像（右侧） -->
    <div v-if="isOwn && showAvatar" class="message-avatar avatar-right" @click="handleAvatarClick(currentUser)">
      <img v-if="currentUser?.faceImage?.url" 
           :src="currentUser.faceImage.url" 
           :alt="currentUser.nickname"
           class="avatar-image"
           loading="lazy"
           @error="handleImageError" />
      <div v-else class="avatar-placeholder">
        {{ getAvatarText(currentUser?.nickname) }}
      </div>
      <!-- 在线状态指示器 -->
      <div v-if="currentUser?.onlineStatus === 'ONLINE'" class="online-indicator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChatMessageVO } from '@/services'
import type { UserVO } from '@/services/src/service/user/types'
import { useAuthStore } from '@/stores/modules/auth'



interface Props {
  message: ChatMessageVO & { isOwn?: boolean }
  currentUserId: string|number
  receiver?: UserVO
  conversationId?: string
  showAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true
})

interface Emits {
  'message-click': [message: ChatMessageVO]
  'message-long-press': [message: ChatMessageVO]
}

const emit = defineEmits<Emits>()

// 响应式数据
const touchStartTime = ref(0)
const longPressThreshold = 500 // 长按阈值（毫秒）

// 计算属性
const showTimestamp = computed(() => {
  return true // 可根据配置动态调整
})

const authStore = useAuthStore()

const currentUser = computed<UserVO>(() => {
  return authStore.currentUser || {
    id: props.currentUserId,
    nickname: '当前用户',
    faceImage: undefined
  }
})

const isOwn = computed(() => {
  return props.message.senderId === currentUser.value?.id
})



// 格式化时间
const formatTime = (timestamp: string | number) => {
  // 使用window.$date.parse处理可能的时间字符串格式
  const date = (window as any).$date.parse(timestamp.toString())
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return (window as any).$date.format(date, 'YYYY-MM-DD HH:mm')
  }
}

// 处理点击事件
const handleClick = () => {
  emit('message-click', props.message)
}

// 处理右键菜单
const handleContextMenu = (event: Event) => {
  event.preventDefault()
  // 这里可以显示自定义菜单
}

// 处理触摸开始
const handleTouchStart = () => {
  touchStartTime.value = Date.now()
  // 可以在这里设置长按定时器
}

// 处理触摸结束
const handleTouchEnd = () => {
  const touchDuration = Date.now() - touchStartTime.value
  if (touchDuration >= longPressThreshold) {
    emit('message-long-press', props.message)
  }
}

// 处理鼠标按下
const handleMouseDown = () => {
  touchStartTime.value = Date.now()
}

// 处理鼠标释放
const handleMouseUp = () => {
  const mouseDuration = Date.now() - touchStartTime.value
  if (mouseDuration >= longPressThreshold) {
    emit('message-long-press', props.message)
  }
}

// 处理鼠标离开
const handleMouseLeave = () => {
  // 重置计时器，防止误触发长按
  touchStartTime.value = 0
}

// 处理头像点击
const handleAvatarClick = (user: UserVO | undefined) => {
  if (user) {
    // 可以触发头像点击事件，用于显示用户信息等
    console.log('Avatar clicked:', user.nickname)
    // emit('avatar-click', user)
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 可以显示默认头像或占位符
}

// 获取头像显示文本
const getAvatarText = (nickname?: string) => {
  if (!nickname) return 'U'
  
  // 处理中文昵称，取最后两个字符
  const chineseMatch = nickname.match(/[\u4e00-\u9fa5]/g)
  if (chineseMatch && chineseMatch.length >= 2) {
    return chineseMatch.slice(-2).join('')
  }
  
  // 处理英文昵称，取首字母大写
  return nickname.charAt(0).toUpperCase()
}
</script>

<style scoped>
.chat-message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 0 16px;
  transition: all 0.3s ease;
  min-height: 48px;
}

.message-own {
  flex-direction: row;
  justify-content: flex-end;
}

.message-other {
  flex-direction: row;
  justify-content: flex-start;
}

.message-sending {
  opacity: 0.7;
}

.message-failed {
  opacity: 0.7;
}

.message-revoked {
  opacity: 0.5;
}

.message-avatar {
  flex-shrink: 0;
  margin: 0 8px;
  transition: transform 0.2s ease;
  position: relative;
  cursor: pointer;
}

.avatar-left {
  order: 1;
}

.avatar-right {
  order: 3;
}

.avatar-image {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 在线状态指示器 */
.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4cd964;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 头像悬停效果 */
.message-avatar:hover .avatar-image {
  border-color: #007aff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.message-avatar:hover .avatar-placeholder {
  border-color: #007aff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

/* 头像点击效果 */
.message-avatar:active .avatar-image {
  transform: scale(0.95);
}

.message-avatar:active .avatar-placeholder {
  transform: scale(0.95);
}

.message-content {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 85%;
  min-width: 0;
  order: 2;
}

/* 不显示头像时的样式 */
.chat-message-item:not(.show-avatar) .message-content {
  max-width: 95%;
}

.message-own .message-content {
  align-items: flex-end;
  margin-right: 8px;
}

.message-other .message-content {
  align-items: flex-start;
  margin-left: 8px;
}

.message-meta {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
  color: #666;
  line-height: 1.2;
}

.message-own .message-meta {
  flex-direction: row-reverse;
}

.message-time {
  margin: 0 6px;
  font-size: 10px;
  opacity: 0.8;
}

.message-status {
  display: flex;
  align-items: center;
  font-size: 10px;
}

.status-sending {
  color: #ff9500;
}

.status-failed {
  color: #ff3b30;
}

.status-sent {
  color: #8e8e93;
}

.status-delivered {
  color: #8e8e93;
}

.status-read {
  color: #007aff;
}

.status-revoked {
  color: #8e8e93;
  font-style: italic;
}

/* 交互效果 */
.chat-message-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.chat-message-item:hover .avatar-image {
  border-color: rgba(0, 122, 255, 0.3);
}

.chat-message-item:hover .avatar-placeholder {
  border-color: rgba(0, 122, 255, 0.3);
  transform: scale(1.05);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-message-item {
    padding: 0 12px;
    margin-bottom: 12px;
  }

  .message-content {
    max-width: 75%;
  }

  .avatar-image,
  .avatar-placeholder {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .message-own .message-content {
    margin-right: 6px;
  }

  .message-other .message-content {
    margin-left: 6px;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .chat-message-item {
    padding: 0 8px;
  }

  .message-content {
    max-width: 80%;
  }

  .avatar-image,
  .avatar-placeholder {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .chat-message-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .message-meta {
    color: #8e8e93;
  }

  .avatar-placeholder {
    background: linear-gradient(135deg, #5ac8fa 0%, #007aff 100%);
  }

  .status-sending {
    color: #ff9500;
  }

  .status-failed {
    color: #ff453a;
  }

  .status-sent,
  .status-delivered {
    color: #8e8e93;
  }

  .status-read {
    color: #0a84ff;
  }

  .status-revoked {
    color: #636366;
  }
}

/* 动画效果 */
@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message-item {
  animation: message-appear 0.3s ease-out;
}
</style>