<template>
  <div v-if="images && images.length" class="feed-images">
    <div class="image-grid">
      <img
        v-for="(image, imgIndex) in displayImages"
        :key="imgIndex"
        :src="image"
        :alt="`图片${imgIndex + 1}`"
        class="feed-image"
        @click="handleImagePreview(imgIndex)"
      />
      <div v-if="images.length > displayLimit" class="more-images">
        <span>+{{ images.length - displayLimit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showImagePreview } from 'vant'

interface Props {
  images: string[]
  displayLimit?: number
}

const props = withDefaults(defineProps<Props>(), {
  displayLimit: 3
})

const emit = defineEmits<{
  imagePreview: [images: string[], index: number]
}>()

const displayImages = computed(() => {
  return props.images.slice(0, props.displayLimit)
})

const handleImagePreview = (index: number) => {
  emit('imagePreview', props.images, index)
  showImagePreview({
    images: props.images,
    startPosition: index,
  })
}
</script>

<style scoped>
.feed-images {
  margin-bottom: 12px;
}

.image-grid {
  display: grid;
  gap: 8px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  position: relative;
}

/* 根据图片数量调整网格布局 */
.image-grid:has(.feed-image:nth-child(1):nth-last-child(1)) {
  grid-template-columns: 1fr;
  max-width: 200px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr;
  max-width: 280px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(3)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(3):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 360px;
}

.feed-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-small, 6px);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.feed-image:hover {
  transform: scale(1.02);
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-small, 6px);
  backdrop-filter: blur(5px);
  transition: background 0.2s ease;
}

.more-images:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>