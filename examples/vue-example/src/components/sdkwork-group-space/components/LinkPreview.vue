<template>
  <div v-if="previewData" class="link-preview">
    <div class="link-preview-title">{{ previewData.title || '链接预览' }}</div>
    <div class="link-preview-desc">{{ previewData.description || '暂无描述' }}</div>
    <div v-if="previewData.image" class="link-preview-image">
      <img :src="previewData.image" alt="链接预览图" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface LinkPreviewData {
  title?: string
  description?: string
  image?: string
  url?: string
}

interface Props {
  previewData: LinkPreviewData | null
}

const props = defineProps<Props>()
</script>

<style scoped>
.link-preview {
  background: var(--bg-page, #f7f8fa);
  border-radius: var(--radius, 8px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.link-preview:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.link-preview-title {
  font-weight: 600;
  color: var(--text-primary, #323233);
}

.link-preview-desc {
  font-size: 14px;
  color: var(--text-secondary, #969799);
  line-height: 1.4;
}

.link-preview-image {
  width: 100%;
  height: 120px;
  border-radius: var(--radius-small, 6px);
  overflow: hidden;
}

.link-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>