<template>
  <div class="image-size">
    <div class="size-header">
      <van-icon name="expand" class="header-icon" />
      <span>图片尺寸</span>
    </div>
    
    <div class="size-grid">
      <div 
        v-for="size in sizes" 
        :key="size.value"
        class="size-item"
        :class="{ active: selectedSize === size.value }"
        @click="selectSize(size.value)"
      >
        <div class="size-dimensions">{{ size.dimensions }}</div>
        <span class="size-label">{{ size.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedSize = ref(props.modelValue)

const sizes = [
  { value: '1024x1024', label: '正方形', dimensions: '1:1' },
  { value: '1024x1792', label: '竖版', dimensions: '9:16' },
  { value: '1792x1024', label: '横版', dimensions: '16:9' },
  { value: '1152x896', label: '肖像', dimensions: '4:3' },
  { value: '896x1152', label: '风景', dimensions: '3:4' },
  { value: '1216x832', label: '宽屏', dimensions: '3:2' },
  { value: '832x1216', label: '高屏', dimensions: '2:3' },
  { value: '1536x640', label: '横幅', dimensions: '12:5' }
]

const selectSize = (size: string) => {
  selectedSize.value = size
  emit('update:modelValue', size)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== selectedSize.value) {
    selectedSize.value = newValue
  }
})
</script>

<style scoped>
.image-size {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.size-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.header-icon {
  margin-right: 8px;
  color: var(--accent-blue);
  font-size: 16px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.size-item:hover {
  border-color: var(--accent-blue);
}

.size-item.active {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.size-dimensions {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.size-label {
  font-size: 11px;
  opacity: 0.8;
}
</style>