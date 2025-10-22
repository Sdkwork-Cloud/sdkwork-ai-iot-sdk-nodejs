<template>
  <div class="chat-message-content">
    <!-- 文本内容 -->
    <div class="message-text">{{ message.text }}</div>
    
    <!-- 用户消息的样式标签 -->
    <div v-if="message.type === 'user' && message.style" class="message-meta">
      <span class="music-style-tag">{{ getStyleLabel(message.style) }}</span>
    </div>
    
    <!-- AI消息的音乐卡片 -->
    <div v-if="message.type === 'ai' && message.music" class="music-card">
      <div class="music-info">
        <h3 class="music-title">{{ message.music.title }}</h3>
        <span class="music-style">{{ getStyleLabel(message.music.style) }}</span>
      </div>
      <div class="audio-player">
        <audio
          :src="message.music.url"
          controls
          class="audio-element"
        ></audio>
      </div>
      <div class="music-actions">
        <button class="action-btn" @click="$emit('regenerate', message)">🔄 重新生成</button>
        <button class="action-btn" @click="$emit('download', message)">💾 下载</button>
      </div>
    </div>
    
    <!-- 生成进度消息 -->
    <div v-if="message.type === 'generating'" class="generating-indicator">
      <div class="generating-text">
        <span class="spinner"></span>
        {{ message.status }}
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: message.progress + '%' }"></div>
      </div>
      <div class="progress-percent">{{ message.progress }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
interface Props {
  message: {
    id: string | number
    type: 'user' | 'ai' | 'system' | 'generating'
    text: string
    avatar: string
    style?: string
    music?: {
      title: string
      url: string
      style: string
    }
    status?: string
    progress?: number
    timestamp?: number
  }
  styleOptions: Array<{
    label: string
    value: string
    icon: string
  }>
}

const props = defineProps<Props>()

// Emit 事件定义
const emit = defineEmits<{
  'regenerate': [message: any]
  'download': [message: any]
}>()

// 计算属性
const getStyleLabel = (styleValue: string) => {
  const style = props.styleOptions.find(s => s.value === styleValue)
  return style?.label || '流行'
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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