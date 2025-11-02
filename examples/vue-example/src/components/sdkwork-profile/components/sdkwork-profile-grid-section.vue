<template>
  <sdkwork-section :bordered="true" :round="true" contentPadding="0px" class="profile-grid-section">
    <sdkwork-grid :columns="4" :gutter="3" :bordered="false" :clickable="true" align="center" square>
      <sdkwork-grid-item
        v-for="item in gridItems"
        :key="item.id"
        :text="item.text"
        :icon="item.icon" 
        :badge="item.badge"
        @click="handleGridItemClick(item)"
      />
    </sdkwork-grid>
  </sdkwork-section>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme' 

// 定义props
interface GridItem {
  id: number
  text: string
  icon: string
  badge?: string
  route?: string
}

interface Props {
  items?: GridItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

// 使用主题hook - 确保主题系统正常工作
const { isDarkMode } = useTheme() 

// 定义emits
const emit = defineEmits<{
  itemClick: [item: GridItem]
}>()

// 网格项配置
const gridItems = ref<GridItem[]>([

])

// 如果传入了自定义items，则使用自定义items
if (props.items && props.items.length > 0) {
  gridItems.value = props.items
}

// 处理网格项点击
const handleGridItemClick = (item: GridItem) => {
  showToast(`点击了：${item.text}`)
  
  // 如果有路由配置，则进行页面跳转
  if (item.route) {
    // 这里需要根据实际的路由系统进行跳转
    // 例如：router.push(item.route)
    console.log(`跳转到：${item.route}`)
  }
  
  // 触发itemClick事件
  emit('itemClick', item)
}

// 暴露方法给父组件
defineExpose({
  refreshGridItems: (newItems: GridItem[]) => {
    gridItems.value = newItems
  }
})
</script>

<style scoped lang="scss">
.profile-grid-section {
  margin: 16px 0;
  background: var(--profile-section-bg, #fff);
  
  :deep(.sdkwork-grid-item) {
    background: transparent !important;
    border: none !important;
    
    .sdkwork-grid-item__icon {
      color: var(--profile-grid-icon-color, #1989fa);
    }
    
    .sdkwork-grid-item__text {
      font-size: 12px;
      margin-top: 4px;
      color: var(--profile-grid-text-color, #323233);
    }
    
    .sdkwork-grid-item__badge {
      position: absolute !important;
      top: var(--sdkwork-grid-item-badge-top, 4px) !important;
      right: var(--sdkwork-grid-item-badge-right, 4px) !important;
      z-index: 10 !important;
      
      .sdkwork-grid-item__badge-text {
        background: var(--profile-badge-bg, #ee0a24) !important;
        color: var(--profile-badge-text, #fff) !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        line-height: 1 !important;
        min-width: 16px !important;
        text-align: center !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      }
    }
  }
}

// 浅色主题
:root[data-theme="light"] {
  .profile-grid-section {
    --profile-section-bg: #fff;
    --profile-grid-icon-color: #1989fa;
    --profile-grid-text-color: #323233;
    --profile-badge-bg: #ee0a24;
    --profile-badge-text: #fff;
  }
}

// 暗色主题
:root[data-theme="dark"] {
  .profile-grid-section {
    --profile-section-bg: #2d3748;
    --profile-grid-icon-color: #60a5fa;
    --profile-grid-text-color: #e2e8f0;
    --profile-badge-bg: #dc2626;
    --profile-badge-text: #fef2f2;
  }
}

// 自动主题适配（兼容旧版CSS）
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    .profile-grid-section {
      background: #2d3748;
      
      :deep(.sdkwork-grid-item) {
        .sdkwork-grid-item__icon {
          color: #60a5fa;
        }
        
        .sdkwork-grid-item__text {
          color: #e2e8f0;
        }
        
        .sdkwork-grid-item__badge {
          position: absolute !important;
          top: var(--sdkwork-grid-item-badge-top, 4px) !important;
          right: var(--sdkwork-grid-item-badge-right, 4px) !important;
          z-index: 10 !important;
          
          .sdkwork-grid-item__badge-text {
            background: #dc2626 !important;
            color: #fef2f2 !important;
            font-size: 10px !important;
            font-weight: 600 !important;
            padding: 2px 6px !important;
            border-radius: 10px !important;
            line-height: 1 !important;
            min-width: 16px !important;
            text-align: center !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }
        }
      }
    }
  }
}
</style>