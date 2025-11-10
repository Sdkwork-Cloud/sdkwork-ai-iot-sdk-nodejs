<template>
  <div class="image-tabs">
    <div class="tabs-container">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: modelValue === tab.value }"
        @click="handleTabClick(tab.value)"
      >
        <van-icon :name="tab.icon" class="tab-icon" />
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: 'text' | 'reference' | 'portrait' | 'idphoto'
}

interface Emits {
  (e: 'update:modelValue', value: 'text' | 'reference' | 'portrait' | 'idphoto'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tabs:any = [
  { value: 'text', label: '文生图片', icon: 'edit' },
  { value: 'reference', label: '参考图生成', icon: 'photo' },
  { value: 'portrait', label: '写真', icon: 'user-circle-o' },
  { value: 'idphoto', label: '证件照', icon: 'idcard' }
]

const handleTabClick = (value: 'text' | 'reference' | 'portrait' | 'idphoto') => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.image-tabs {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tabs-container {
  display: flex;
  padding: 2px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 12px;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tab-item.active {
  background: var(--accent-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.tab-icon {
  font-size: 16px;
  margin-bottom: 4px;
}

.tab-label {
  font-weight: 500;
  line-height: 1.2;
}
</style>