<template>
  <div class="chat-message-content">
    <component :is="getMessageContentComponent(message.type || 'TEXT')" :message="message" :is-own="isOwn" />
  </div>
</template>

<script setup lang="ts">
import MessageContentText from './components/message-content-text/message-content-text.vue'
import MessageContentImage from './components/message-content-image/message-content-image.vue'
import MessageContentFile from './components/message-content-file/message-content-file.vue'
import MessageContentAudio from './components/message-content-audio/message-content-audio.vue'
import MessageContentVideo from './components/message-content-video/message-content-video.vue'
import { ChatMessageVO } from '@/services'
// Props 定义
interface Props {
  message: ChatMessageVO
  isOwn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOwn: false
})

// Emit 事件定义
const emit = defineEmits<{
  'regenerate': [message: any]
  'download': [message: any]
}>()
// 获取消息内容组件
const getMessageContentComponent = (type: string) => {
  const componentMap = {
    TEXT: MessageContentText,
    IMAGE: MessageContentImage,
    FILE: MessageContentFile,
    AUDIO: MessageContentAudio,
    VIDEO: MessageContentVideo,
    VOICE: MessageContentAudio // 语音消息也使用音频组件
  }
  return componentMap[type as keyof typeof componentMap] || MessageContentText
}
</script>

<style scoped>
.chat-message-content {
  flex: 1;
}

.message-text {
  background: #1a1a1a;
  border-radius: 18px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
}

/* 消息元数据 */
.message-meta {
  margin-top: 8px;
  text-align: right;
}

.music-style-tag {
  background: rgba(0, 153, 255, 0.2);
  color: #0099ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 音乐卡片 */
.music-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
  border: 1px solid #333;
}

.music-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.music-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.music-style {
  background: rgba(0, 153, 255, 0.2);
  color: #0099ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.audio-player {
  margin-bottom: 12px;
}

.audio-element {
  width: 100%;
  height: 40px;
  border-radius: 8px;
}

.music-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  background: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-btn:active {
  background: #444;
}

/* 生成进度指示器 */
.generating-indicator {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #333;
}

.generating-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #ffffff;
  font-size: 14px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #0099ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #0099ff;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-percent {
  text-align: right;
  color: #666;
  font-size: 12px;
}

/* 动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .message-text {
    font-size: 14px;
    padding: 10px 14px;
  }

  .music-card {
    padding: 12px;
  }

  .music-title {
    font-size: 14px;
  }

  .action-btn {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-top-color: #666;
  }
}
</style>