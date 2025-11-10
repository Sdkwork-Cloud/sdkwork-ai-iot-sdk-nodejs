<template>
  <div class="image-style">
    <div class="style-header">
      <van-icon name="palette" class="header-icon" />
      <span>图片风格</span>
    </div>
    
    <div class="style-grid">
      <div 
        v-for="style in styles" 
        :key="style.value"
        class="style-item"
        :class="{ active: selectedStyle === style.value }"
        @click="selectStyle(style.value)"
      >
        <div class="style-icon">{{ style.icon }}</div>
        <span class="style-label">{{ style.label }}</span>
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

const selectedStyle = ref(props.modelValue)

const styles = [
  { value: 'realistic', label: '写实', icon: '🎨' },
  { value: 'cartoon', label: '卡通', icon: '🖼️' },
  { value: 'anime', label: '动漫', icon: '🎭' },
  { value: 'oil_painting', label: '油画', icon: '🖌️' },
  { value: 'watercolor', label: '水彩', icon: '💧' },
  { value: 'sketch', label: '素描', icon: '✏️' },
  { value: 'minimalist', label: '极简', icon: '⬜' },
  { value: 'cyberpunk', label: '赛博朋克', icon: '🤖' }
]

const selectStyle = (style: string) => {
  selectedStyle.value = style
  emit('update:modelValue', style)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== selectedStyle.value) {
    selectedStyle.value = newValue
  }
})
</script>

<style scoped>
.image-style {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.style-header {
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

.style-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.style-item {
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

.style-item:hover {
  border-color: var(--accent-blue);
}

.style-item.active {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.style-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.style-label {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}
</style>