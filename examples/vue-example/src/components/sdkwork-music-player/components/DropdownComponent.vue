<template>
  <div class="dropdown-component">
    <!-- 触发器插槽 -->
    <div ref="triggerRef" @click="toggleDropdown">
      <slot name="trigger"></slot>
    </div>

    <!-- 下拉菜单 -->
    <Teleport to="body">
      <div 
        v-if="showDropdown" 
        class="dropdown-overlay" 
        @click="closeDropdown"
      >
        <div 
          ref="menuRef"
          class="dropdown-menu" 
          :style="menuStyle"
          @click.stop
        >
          <slot name="menu"></slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'

interface Props {
  placement?: 'bottom' | 'top' | 'left' | 'right'
  offset?: number
  autoPlacement?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  offset: 8,
  autoPlacement: true
})

const emit = defineEmits<{
  'open': []
  'close': []
}>()

const showDropdown = ref(false)
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()

// 使用VueUse获取元素位置和窗口尺寸
const triggerRect = useElementBounding(triggerRef)
const { width: windowWidth, height: windowHeight } = useWindowSize()

// 计算菜单位置
const menuStyle = computed(() => {
  if (!showDropdown.value || !triggerRect.width.value || !menuRef.value) {
    return {}
  }

  const menuRect = menuRef.value.getBoundingClientRect()
  const menuWidth = menuRect.width || 200
  const menuHeight = menuRect.height || 300
  
  let x = 0
  let y = 0
  let placement = props.placement

  // 如果启用自动位置调整，根据屏幕边界智能选择位置
  if (props.autoPlacement) {
    placement = calculateOptimalPlacement(
      triggerRect.left.value,
      triggerRect.top.value,
      triggerRect.width.value,
      triggerRect.height.value,
      menuWidth,
      menuHeight
    ) as any
  }

  // 根据placement计算位置
  switch (placement) {
    case 'top':
      x = triggerRect.left.value + triggerRect.width.value / 2 - menuWidth / 2
      y = triggerRect.top.value - menuHeight - props.offset
      break
    case 'bottom':
      x = triggerRect.left.value + triggerRect.width.value / 2 - menuWidth / 2
      y = triggerRect.bottom.value + props.offset
      break
    case 'left':
      x = triggerRect.left.value - menuWidth - props.offset
      y = triggerRect.top.value + triggerRect.height.value / 2 - menuHeight / 2
      break
    case 'right':
      x = triggerRect.right.value + props.offset
      y = triggerRect.top.value + triggerRect.height.value / 2 - menuHeight / 2
      break
  }

  // 边界检查，确保菜单不超出屏幕
  const adjustedPosition = adjustPositionForBoundaries(x, y, menuWidth, menuHeight)

  return {
    top: `${adjustedPosition.y}px`,
    left: `${adjustedPosition.x}px`,
    transformOrigin: getTransformOrigin(placement)
  }
})

// 计算最佳显示位置
function calculateOptimalPlacement(
  triggerX: number,
  triggerY: number,
  triggerWidth: number,
  triggerHeight: number,
  menuWidth: number,
  menuHeight: number
): string {
  const viewport = {
    width: windowWidth.value,
    height: windowHeight.value
  }

  const availableSpace = {
    top: triggerY,
    bottom: viewport.height - triggerY - triggerHeight,
    left: triggerX,
    right: viewport.width - triggerX - triggerWidth
  }

  // 检查各个方向的可用空间
  const canShowBottom = availableSpace.bottom >= menuHeight
  const canShowTop = availableSpace.top >= menuHeight
  const canShowRight = availableSpace.right >= menuWidth
  const canShowLeft = availableSpace.left >= menuWidth

  // 优先显示在下方
  if (canShowBottom) return 'bottom'
  // 下方空间不足时显示在上方
  if (canShowTop) return 'top'
  // 上下空间都不足时显示在右侧
  if (canShowRight) return 'right'
  // 最后显示在左侧
  if (canShowLeft) return 'left'
  
  // 如果所有方向空间都不足，默认显示在下方
  return 'bottom'
}

// 调整位置确保不超出屏幕边界
function adjustPositionForBoundaries(x: number, y: number, menuWidth: number, menuHeight: number) {
  const viewport = {
    width: windowWidth.value,
    height: windowHeight.value
  }

  // 水平边界检查
  if (x < 0) {
    x = 8
  } else if (x + menuWidth > viewport.width) {
    x = viewport.width - menuWidth - 8
  }

  // 垂直边界检查
  if (y < 0) {
    y = 8
  } else if (y + menuHeight > viewport.height) {
    y = viewport.height - menuHeight - 8
  }

  return { x, y }
}

// 获取transform origin用于动画
function getTransformOrigin(placement: string) {
  switch (placement) {
    case 'top': return 'center bottom'
    case 'bottom': return 'center top'
    case 'left': return 'right center'
    case 'right': return 'left center'
    default: return 'center top'
  }
}

// 切换下拉菜单
const toggleDropdown = async () => {
  showDropdown.value = !showDropdown.value
  
  if (showDropdown.value) {
    emit('open')
    // 等待DOM更新后重新计算位置
    await nextTick()
  } else {
    emit('close')
  }
}

// 关闭下拉菜单
const closeDropdown = () => {
  if (showDropdown.value) {
    showDropdown.value = false
    emit('close')
  }
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (showDropdown.value && triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// 添加全局点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法给父组件
defineExpose({
  open: () => {
    showDropdown.value = true
    emit('open')
  },
  close: closeDropdown,
  toggle: toggleDropdown
})
</script>

<style scoped>
.dropdown-component {
  display: inline-block;
  position: relative;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 9999;
  background: transparent;
}

.dropdown-menu {
  position: fixed;
  z-index: 10000;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dropdown-appear 0.2s ease-out;
  max-height: 400px;
  overflow-y: auto;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: #1c1c1e;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}
</style>