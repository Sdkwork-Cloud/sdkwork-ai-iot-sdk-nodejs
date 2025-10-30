<template>
  <div
    class="category-item"
    :class="[
      { 'active': active },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 分类项插槽 -->
    <slot :category="category" :index="index">
      <div class="default-category">
        <div class="category-name">{{ getCategoryName(category) }}</div>
        <div class="category-count" v-if="getCategoryCount(category)">
          {{ getCategoryCount(category) }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 使用共享类型定义
import type { Category } from '../types/shared'

interface Props {
  category: Category
  index: number
  active: boolean
  categoryKey?: string
  categoryNameField?: string
  categoryCountField?: string
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  (e: 'select', category: Category): void
}

const props = withDefaults(defineProps<Props>(), {
  categoryKey: 'id',
  categoryNameField: 'name',
  categoryCountField: 'count',
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

// Dark mode support - 参考 sdkwork-cell 的主题处理方式
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'category-item--dark' : 'category-item--light'
})

// 获取分类项名称
const getCategoryName = (category: Category): string => {
  return category[props.categoryNameField] || '未知分类'
}

// 获取分类项数量
const getCategoryCount = (category: Category): number | string => {
  return category[props.categoryCountField] || ''
}

// 点击处理
const handleClick = () => {
  emit('select', props.category)
}
</script>

<style scoped lang="scss">
.category-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--category-item-border-color, #f0f0f0);
  cursor: pointer;
  transition: background-color 0.2s;
  
  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --category-item-bg: transparent;
  --category-item-bg-hover: #f5f5f5;
  --category-item-bg-active: #f0f0f0;
  --category-item-border-color: #f0f0f0;
  --category-item-text-primary: #333333;
  --category-item-text-secondary: #666666;
  --category-item-text-meta: #999999;
  --category-item-active-color: #1890ff;
  --category-item-count-bg: #f0f0f0;
  --category-item-count-text: #999999;
  
  background: var(--category-item-bg);

  &:hover {
    background: var(--category-item-bg-hover);
  }

  &.active {
    background: var(--category-item-bg-active);
    border-right: 2px solid var(--category-item-active-color);
    
    .category-name {
      color: var(--category-item-active-color);
      font-weight: 600;
    }
  }

  .default-category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;

    .category-name {
      font-size: 13px;
      color: var(--category-item-text-secondary);
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .category-count {
      font-size: 11px;
      color: var(--category-item-count-text);
      background: var(--category-item-count-bg);
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 8px;
      flex-shrink: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .category-item {
    padding: 10px 12px;

    .default-category {
      .category-name {
        font-size: 13px;
      }

      .category-count {
        font-size: 11px;
      }
    }
  }
}

// 浅色主题
.category-item--light {
  --category-item-bg: transparent;
  --category-item-bg-hover: #f5f5f5;
  --category-item-bg-active: #f0f0f0;
  --category-item-border-color: #f0f0f0;
  --category-item-text-primary: #333333;
  --category-item-text-secondary: #666666;
  --category-item-text-meta: #999999;
  --category-item-active-color: #1890ff;
  --category-item-count-bg: #f0f0f0;
  --category-item-count-text: #999999;
}

// 深色主题
.category-item--dark {
  --category-item-bg: transparent;
  --category-item-bg-hover: #3a3a3a;
  --category-item-bg-active: #4a4a4a;
  --category-item-border-color: #3a3a3a;
  --category-item-text-primary: #e0e0e0;
  --category-item-text-secondary: #a0a0a0;
  --category-item-text-meta: #888888;
  --category-item-active-color: #1890ff;
  --category-item-count-bg: #3a3a3a;
  --category-item-count-text: #a0a0a0;
}
</style>