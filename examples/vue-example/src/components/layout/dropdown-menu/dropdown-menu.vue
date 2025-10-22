<template>
  <div class="dropdown-menu">
    <!-- 触发按钮 -->
    <div 
      class="dropdown-trigger" 
      @click="toggleMenu"
      ref="triggerRef"
    >
      <slot name="trigger">
        <Icon icon="mingcute:more-2-fill" width="16" height="16" />
      </slot>
    </div>

    <!-- 下拉菜单 -->
    <div 
      v-if="isOpen" 
      class="dropdown-content"
      :style="menuStyle"
      ref="menuRef"
    >
      <div 
        v-for="item in items" 
        :key="item.value"
        class="dropdown-item"
        @click="handleItemClick(item)"
      >
        <Icon v-if="item.icon" :icon="item.icon" width="16" height="16" class="item-icon" />
        <span class="item-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

interface DropdownItem {
  text: string
  value: string
  icon?: string
  disabled?: boolean
}

interface Props {
  items: DropdownItem[]
  placement?: 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-end'
})

const emit = defineEmits<{
  itemClick: [item: DropdownItem]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()

// 计算菜单位置
const menuStyle = computed(() => {
  if (!triggerRef.value) return {}
  
  const rect = triggerRef.value.getBoundingClientRect()
  
  switch (props.placement) {
    case 'bottom-end':
      return {
        top: `${rect.bottom + 4}px`,
        right: `${window.innerWidth - rect.right}px`
      }
    case 'bottom-start':
      return {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`
      }
    case 'top-end':
      return {
        bottom: `${window.innerHeight - rect.top + 4}px`,
        right: `${window.innerWidth - rect.right}px`
      }
    case 'top-start':
      return {
        bottom: `${window.innerHeight - rect.top + 4}px`,
        left: `${rect.left}px`
      }
    default:
      return {}
  }
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleItemClick = (item: DropdownItem) => {
  if (item.disabled) return
  
  emit('itemClick', item)
  isOpen.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return
  
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) {
    return
  }
  
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.dropdown-menu {
  position: relative;
  display: inline-block;
  
  .dropdown-trigger {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  .dropdown-content {
    position: fixed;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    z-index: 1000;
    animation: slideDown 0.2s ease-out;
    
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f8f9fa;
      }
      
      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }
      
      .item-icon {
        margin-right: 8px;
        color: #666;
      }
      
      .item-text {
        font-size: 14px;
        color: #333;
      }
      
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>