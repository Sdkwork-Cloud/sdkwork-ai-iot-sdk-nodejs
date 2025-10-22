<template>
  <div 
    class="chat-message-bubble"
    :class="[message.type + '-bubble', { 'system-bubble': message.type === 'system' }]"
  >
    <SdkworkChatMessageContent
      :message="message"
      :style-options="styleOptions"
      @regenerate="$emit('regenerate', $event)"
      @download="$emit('download', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import SdkworkChatMessageContent from '@/components/sdkwork-chat-message-content/sdkwork-chat-message-content.vue'

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
</script>

<style scoped>
.chat-message-bubble {
  flex: 1;
  max-width: calc(100% - 64px);
}

.user-bubble .message-text {
  background: linear-gradient(135deg, #0099ff 0%, #0066cc 100%);
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 153, 255, 0.2);
}

.ai-bubble .message-text {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.system-bubble .message-text {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .chat-message-bubble {
    max-width: calc(100% - 48px);
  }
}
</style>