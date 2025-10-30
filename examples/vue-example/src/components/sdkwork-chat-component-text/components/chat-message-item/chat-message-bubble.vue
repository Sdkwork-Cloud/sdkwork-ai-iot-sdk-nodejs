<template>
  <div 
    class="chat-message-bubble"
    :class="{
      'bubble-own': isOwn,
      'bubble-other': !isOwn,
      'bubble-sending': false, // ChatMessageVO没有status属性
      'bubble-failed': false,
      'bubble-revoked': false
    }"
    @click="handleClick"
  >
    <!-- 撤回消息提示 -->
    <div v-if="false" class="revoked-message">
      <Icon icon="mdi:delete" width="16" height="16" class="revoked-icon" />
      <span class="revoked-text">该消息已被撤回</span>
    </div>

    <!-- 正常消息内容 -->
    <div v-else class="bubble-content">
      <slot>
        <!-- 默认插槽内容 -->
        <div class="default-content">
          {{ message.content }}
        </div>
      </slot>
    </div>

    <!-- 消息状态指示器 -->
    <div v-if="isOwn" class="message-status-indicator">
      <div v-if="false" class="status-sending">
        <div class="sending-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div v-else-if="false" class="status-failed">
        <Icon icon="mdi:alert" width="14" height="14" class="failed-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageVO } from '@/services'
import { Icon } from '@iconify/vue'

interface Props {
  message: ChatMessageVO & { isOwn?: boolean }
  isOwn: boolean
}

const props = defineProps<Props>()

interface Emits {
  'bubble-click': [message: ChatMessageVO]
}

const emit = defineEmits<Emits>()

// 处理点击事件
const handleClick = () => {
  emit('bubble-click', props.message)
}
</script>

<style scoped>
.chat-message-bubble {
  position: relative;
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 100%;
  word-wrap: break-word;
  transition: all 0.2s ease;
  cursor: pointer;
}

.bubble-own {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble-other {
  background: #ffffff;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.bubble-sending {
  opacity: 0.7;
}

.bubble-failed {
  background: #ffebee;
  border-color: #ffcdd2;
}

.bubble-revoked {
  background: #f5f5f5;
  color: #999;
  font-style: italic;
}

.revoked-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.revoked-icon {
  font-size: 16px;
}

.revoked-text {
  opacity: 0.8;
}

.bubble-content {
  min-height: 20px;
}

.default-content {
  line-height: 1.4;
}

.message-status-indicator {
  position: absolute;
  bottom: 4px;
  right: 8px;
}

.status-sending {
  display: flex;
  align-items: center;
}

.sending-dots {
  display: flex;
  gap: 2px;
}

.sending-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  animation: bounce 1.4s infinite ease-in-out;
}

.sending-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.sending-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.status-failed {
  display: flex;
  align-items: center;
}

.failed-icon {
  font-size: 14px;
}

/* 悬停效果 */
.chat-message-bubble:not(.bubble-revoked):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.bubble-own:hover {
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.bubble-other:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-message-bubble {
    padding: 10px 14px;
    border-radius: 16px;
  }
  
  .bubble-own {
    border-bottom-right-radius: 3px;
  }
  
  .bubble-other {
    border-bottom-left-radius: 3px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .bubble-other {
    background: #2d2d2d;
    border-color: #404040;
    color: #fff;
  }
  
  .bubble-failed {
    background: #4a2a2a;
    border-color: #6a3a3a;
  }
  
  .bubble-revoked {
    background: #3a3a3a;
    color: #777;
  }
  
  .bubble-other:hover {
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
  }
}

/* 无障碍支持 */
.chat-message-bubble:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 触摸设备优化 */
@media (hover: none) {
  .chat-message-bubble:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>