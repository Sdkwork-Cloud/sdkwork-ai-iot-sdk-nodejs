<template>
  <div class="category-section">
    <van-tabs 
      v-model:active="activeCategory"
      :type="type"
      :shrink="shrink"
      @change="handleCategoryChange"
    >
      <van-tab 
        v-for="category in categories" 
        :key="category.id"
        :title="category.name"
        :name="category.id"
      />
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface CategoryItem {
  id: string
  name: string
}

interface Props {
  categories: CategoryItem[]
  type?: 'line' | 'card'
  shrink?: boolean
  defaultActive?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'card',
  shrink: true,
  defaultActive: 'all'
})

const emit = defineEmits<{
  change: [categoryId: string]
}>()

const activeCategory = ref(props.defaultActive)

const handleCategoryChange = (categoryId: string) => {
  emit('change', categoryId)
}

// 监听默认激活项的变化
watch(() => props.defaultActive, (newValue) => {
  activeCategory.value = newValue
})
</script>

<style scoped lang="scss">
.category-section { 
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); 
  overflow: hidden;
  
  :deep(.van-tabs) {
    width: 100%;
    
    .van-tabs__wrap {
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      
      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
      }
    }
    
    .van-tabs__nav--card {
      border: none;
      background: transparent;
      flex-wrap: nowrap;
      min-width: max-content;
      width: max-content;
      
      .van-tab {
        border: 1px solid #e8e8e8;
        border-radius: 8px;
        margin: 0 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        background: #f8f9fa;
        transition: all 0.3s ease;
        white-space: nowrap;
        flex-shrink: 0;
        
        &:hover {
          background: #f0f2f5;
          border-color: #d0d7de;
          transform: translateY(-1px);
        }
        
        &.van-tab--active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transform: translateY(-1px);
        }
      }
    }
  }
  
  :deep(.van-tabs__line) {
    display: none;
  }
}

@media (max-width: 768px) {
  .category-section {
    padding: 8px 12px; 
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    
    :deep(.van-tabs) {
      .van-tabs__nav--card {
        .van-tab {
          padding: 6px 12px;
          font-size: 13px;
          margin: 0 2px;
        }
      }
    }
  }
}

/* 小屏幕优化 */
@media (max-width: 480px) {
  .category-section {
    padding: 6px 8px;
    
    :deep(.van-tabs) {
      .van-tabs__nav--card {
        .van-tab {
          padding: 4px 8px;
          font-size: 12px;
          margin: 0 1px;
        }
      }
    }
  }
}

/* 强制水平滚动优化 */
.category-section {
  :deep(.van-tabs__nav) {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    
    .van-tab {
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
    }
  }
}
</style>