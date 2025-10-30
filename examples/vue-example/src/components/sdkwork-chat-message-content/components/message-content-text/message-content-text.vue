<template>
  <div class="message-content-text"> 
    <!-- Markdown 渲染模式 -->
    <sdkwork-markdown-content
      v-if="enableMarkdown"
      :content="rawContent"
      :safe="true"
      :render-options="markdownOptions"
      :style-config="styleConfig"
      :class="['is-chat-message', markdownClass]"
      @link-click="handleLinkClick"
      @image-click="handleImageClick"
      @code-copy="handleCodeCopy"
      @error="handleMarkdownError"
    />
    
    <!-- 普通文本模式 -->
    <div v-else class="text-content" v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessageVO } from '@/services'
import { chatMessageProcessor } from '@/core/chat'
import { MsgAudioContent, MsgPayload } from 'sdkwork-sdk-api-typescript'
import SdkworkMarkdownContent from '@/components/sdkwork-markdown-content/sdkwork-markdown-content.vue'
import type { MarkdownRenderOptions, MarkdownStyleConfig } from '@/components/sdkwork-markdown-content/types'

interface Props {
  message: ChatMessageVO
  /** 是否启用 Markdown 渲染，默认开启 */
  enableMarkdown?: boolean
  /** Markdown 渲染选项 */
  markdownOptions?: MarkdownRenderOptions
  /** Markdown 样式配置 */
  styleConfig?: MarkdownStyleConfig
  /** Markdown 容器类名 */
  markdownClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableMarkdown: true,
  markdownOptions: () => ({
    highlight: true,
    highlightTheme: 'github',
    tables: true,
    taskLists: true,
    breaks: false,
    codeCopyable: true
  }),
  styleConfig: () => ({
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'inherit',
    backgroundColor: 'transparent',
    codeBlockBackground: '#f6f8fa',
    codeBlockFontSize: '13px'
  }),
  markdownClass: ''
})

// 原始内容
const rawContent = computed(() => {
  return window.$chat.getText(props.message) || ''
})

// 格式化文本内容（支持链接识别、表情等）- 用于非 Markdown 模式
const formattedContent = computed(() => {
  let content = rawContent.value
  
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

// 事件处理
const handleLinkClick = (url: string, event: Event) => {
  console.log('Markdown 链接点击:', url)
  // 可以在这里添加自定义链接处理逻辑
  event.preventDefault()
}

const handleImageClick = (src: string, alt: string, event: Event) => {
  console.log('Markdown 图片点击:', src, alt)
  // 可以在这里实现图片预览功能
}

const handleCodeCopy = (code: string, language: string) => {
  console.log('Markdown 代码复制:', language, code)
  // 可以在这里添加复制成功提示
}

const handleMarkdownError = (error: Error) => {
  console.error('Markdown 渲染错误:', error)
}
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