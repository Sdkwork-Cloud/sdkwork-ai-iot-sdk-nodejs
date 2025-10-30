<template>
  <div class="message-content-image">
    <div class="image-container" @click="handleImageClick">
      <img :src="imageUrl" :alt="'图片消息'" class="message-image" @load="handleImageLoad" @error="handleImageError" />
      <div v-if="loading" class="image-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-if="showError" class="image-error">
        <Icon icon="mdi:close-circle" width="24" height="24" class="error-icon" />
        <span class="error-text">图片加载失败</span>
      </div>
    </div>
    <div v-if="false" class="image-description">
      <!-- ChatMessageVO没有description属性 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'

interface Props {
  message: ChatMessageVO
}

const props = defineProps<Props>()

// 响应式数据
const loading = ref(true)
const showError = ref(false)

// 计算属性
const imageUrl = computed(() => {
  const payload = window.$chat.getPayload(props.message)
  return payload?.image?.resource?.url
})

// 处理图片加载完成
const handleImageLoad = () => {
  loading.value = false
  showError.value = false
}

// 处理图片加载错误
const handleImageError = () => {
  loading.value = false
  showError.value = true
}

// 处理图片点击
const handleImageClick = () => {
  // 这里可以触发图片预览
  console.log('图片点击:', imageUrl.value)
}
</script>

<style scoped>
.message-content-image {
  max-width: 300px;
}

.image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f5f5f5;
}

.message-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.2s ease;
}

.image-container:hover .message-image {
  transform: scale(1.02);
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  color: #666;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.error-text {
  font-size: 12px;
}

.image-description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-content-image {
    max-width: 250px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .image-container {
    background-color: #2d2d2d;
  }

  .image-loading {
    background-color: rgba(45, 45, 45, 0.8);
  }

  .image-error {
    background-color: rgba(45, 45, 45, 0.9);
    color: #aaa;
  }

  .image-description {
    color: #aaa;
  }
}
</style>