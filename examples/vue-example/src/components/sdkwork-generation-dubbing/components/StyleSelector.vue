<template>
  <div class="style-selector">
    <div class="section-header">
      <h4>风格选择</h4>
      <div class="selected-style-info" v-if="selectedStyle">
        <span class="style-label">当前选择：</span>
        <span class="style-name">{{ selectedStyleName }}</span>
      </div>
    </div>

    <div class="style-grid">
      <div 
        v-for="style in availableStyles" 
        :key="style.id"
        :class="['style-card', { selected: selectedStyle === style.id }]"
        @click="selectStyle(style)"
        :style="{ borderColor: style.color }"
      >
        <div class="style-icon" :style="{ backgroundColor: style.color }">
          {{ style.icon }}
        </div>
        <div class="style-info">
          <div class="style-name">{{ style.name }}</div>
          <div class="style-description">{{ style.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  styles?: any[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  styles: () => []
})
const emit = defineEmits<Emits>()

const selectedStyle = ref(props.modelValue)

// 风格数据
const availableStyles = ref([
  {
    id: 'professional',
    name: '专业商务',
    icon: '💼',
    color: '#1890ff',
    description: '正式专业的商务风格'
  },
  {
    id: 'casual',
    name: '轻松日常',
    icon: '😊',
    color: '#52c41a',
    description: '轻松自然的日常风格'
  },
  {
    id: 'educational',
    name: '知识科普',
    icon: '📚',
    color: '#faad14',
    description: '专业严谨的知识分享'
  },
  {
    id: 'entertainment',
    name: '娱乐搞笑',
    icon: '😂',
    color: '#f5222d',
    description: '活泼有趣的娱乐风格'
  },
  {
    id: 'inspirational',
    name: '励志激励',
    icon: '💪',
    color: '#722ed1',
    description: '积极向上的激励风格'
  }
])

// 当前选择的风格名称
const selectedStyleName = computed(() => {
  const style = availableStyles.value.find(s => s.id === selectedStyle.value)
  return style ? style.name : '未选择'
})

// 选择风格
const selectStyle = (style: any) => {
  selectedStyle.value = style.id
  emit('update:modelValue', style.id)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedStyle.value = newValue
})
</script>

<style scoped>
.style-selector {
  background: var(--bg-card);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.selected-style-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.style-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.style-name {
  color: var(--accent-blue);
  font-weight: 600;
  font-size: 12px;
}

.style-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.style-card {
  display: flex;
  align-items: center;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.style-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.style-card.selected {
  background: rgba(24, 144, 255, 0.1);
  border-color: var(--accent-blue);
}

.style-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
}

.style-info {
  flex: 1;
}

.style-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 14px;
}

.style-description {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
}
</style>