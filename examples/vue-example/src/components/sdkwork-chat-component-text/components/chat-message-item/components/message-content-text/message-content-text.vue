<template>
  <div class="message-content-text">
    <div class="text-content" v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessageVO } from '@/services'

interface Props {
  message: ChatMessageVO
}

const props = defineProps<Props>()

// 格式化文本内容（支持链接识别、表情等）
const formattedContent = computed(() => {
  let content = window.$chat.getText(props.message) || ''
  
  // 识别并转换URL为链接
  content = content.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-link">$1</a>'
  )
  
  // 识别并转换邮箱
  content = content.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" class="text-link">$1</a>'
  )
  
  // 保留换行符
  content = content.replace(/\n/g, '<br>')
  
  return content
})
</script>

<style scoped>
.message-content-text {
  line-height: 1.5;
}

.text-content {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.text-content :deep(.text-link) {
  color: inherit;
  text-decoration: underline;
  opacity: 0.8;
}

.text-content :deep(.text-link:hover) {
  opacity: 1;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .text-content {
    color: #fff;
  }
}
</style>