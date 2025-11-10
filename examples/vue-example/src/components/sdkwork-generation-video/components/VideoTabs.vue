<template>
  <div class="video-tabs">
    <van-tabs v-model:active="activeTab" @change="handleTabChange">
      <van-tab title="文生视频" name="text" />
      <van-tab title="图生视频" name="image" />
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: 'text' | 'image'
}

interface Emits {
  (e: 'update:modelValue', value: 'text' | 'image'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref(props.modelValue)

const handleTabChange = (name: string) => {
  emit('update:modelValue', name as 'text' | 'image')
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue
})
</script>

<style scoped>
.video-tabs {
  margin-bottom: 16px;
}

:deep(.van-tabs) {
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-tabs__wrap) {
  background: var(--bg-card);
}

:deep(.van-tab) {
  color: var(--text-secondary);
  background: var(--bg-card);
}

:deep(.van-tab--active) {
  color: var(--accent-blue);
  font-weight: 600;
}

:deep(.van-tabs__line) {
  background-color: var(--accent-blue);
}

:deep(.van-tabs__nav) {
  background: var(--bg-card);
}
</style>