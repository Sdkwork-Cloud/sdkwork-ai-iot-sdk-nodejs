<template>
  <div v-if="images.length > 0" class="image-preview">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="image-item"
    >
      <img :src="image" alt="预览图" />
      <div class="delete-btn" @click="handleDelete(index)">
        <Icon icon="ri:close-line" />
      </div>
    </div>
    
    <!-- 添加更多图片按钮 -->
    <div v-if="showAddMoreButton" class="image-item add-more-btn" @click="handleAddMore">
      <Icon icon="ri:image-add-line" width="24" height="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  images: string[]
  maxImages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxImages: 9
})

const emit = defineEmits<{
  delete: [index: number]
  addMore: []
}>()

const handleDelete = (index: number) => {
  emit('delete', index)
}

const handleAddMore = () => {
  emit('addMore')
}

const showAddMoreButton = computed(() => {
  return props.images.length > 0 && props.images.length < props.maxImages
})
</script>

<style scoped>
.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-item:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.image-item:hover img {
  transform: scale(1.1);
  filter: brightness(1.05);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-more-btn {
  border: 2px dashed var(--color-primary, #1989fa);
  background: var(--bg-page, #f7f8fa);
  color: var(--color-primary, #1989fa);
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-more-btn::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 1px dashed var(--color-primary, #1989fa);
  border-radius: var(--radius, 8px);
  opacity: 0.3;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.add-more-btn:hover {
  border-color: var(--color-primary, #1989fa);
  color: var(--color-primary, #1989fa);
  background: var(--color-primary-light, #e6f7ff);
  transform: scale(1.05);
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 1;
}

.delete-btn:hover {
  background: rgba(255, 59, 48, 0.8);
  transform: scale(1.1);
}
</style>