<template>
  <div v-if="linkUrl" class="feed-link" @click="handleLinkClick">
    <div class="link-preview">
      <div class="link-content">
        <div class="link-info">
          <div class="link-title">{{ title || getDomainFromUrl(linkUrl) }}</div>
          <div class="link-description" v-if="description">{{ description }}</div>
          <div class="link-url">{{ linkUrl }}</div>
        </div>
        <div class="link-image" v-if="image">
          <img :src="image" :alt="title || '链接预览图'" />
        </div>
        <div class="link-icon" v-else>
          <Icon icon="ri:external-link-line" width="24" height="24" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  linkUrl: string
  title?: string
  description?: string
  image?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  image: ''
})

const emit = defineEmits<{
  linkClick: [url: string]
}>()

const handleLinkClick = () => {
  emit('linkClick', props.linkUrl)
}

const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (e) {
    return url
  }
}
</script>

<style scoped>
.feed-link {
  margin-bottom: 12px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
}

.link-preview {
  border-radius: var(--radius, 8px);
  overflow: hidden;
  border: 1px solid var(--border-color, #ebedf0);
  background: var(--bg-page, #f7f8fa);
  transition: all 0.2s ease;
  cursor: pointer;
}

.link-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #1989fa);
}

.link-content {
  display: flex;
  padding: 12px;
}

.link-info {
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.link-title {
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.link-description {
  font-size: 12px;
  color: var(--text-secondary, #969799);
  line-height: 1.4;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.link-url {
  font-size: 12px;
  color: var(--text-secondary, #969799);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-image {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-small, 6px);
  overflow: hidden;
  flex-shrink: 0;
}

.link-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gray, #f0f2f5);
  border-radius: var(--radius-small, 6px);
  color: var(--text-secondary, #969799);
  flex-shrink: 0;
}
</style>