<template>
  <div class="app-header">
    <sdkwork-navbar
      :title="title"
      :left-arrow="showBack"
      :left-text="leftText"
      :right-text="rightText"
      :theme-mode="themeMode"
      :fixed="true"
      :border="true"
      :safe-area-inset-top="true"
      @click-left="handleLeftClick"
      @click-right="handleRightClick"
    >
      <template v-if="$slots.left" #left>
        <slot name="left"></slot>
      </template>
      
      <template v-if="$slots.title" #title>
        <slot name="title"></slot>
      </template>
      
      <template v-if="$slots.right" #right>
        <slot name="right"></slot>
      </template>
      
      <template v-if="$slots['left-arrow']" #left-arrow>
        <slot name="left-arrow"></slot>
      </template>
    </sdkwork-navbar>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, watchEffect, onMounted, computed } from 'vue'
import SdkworkNavbar from '../../sdkwork-navbar/sdkwork-navbar.vue'

interface Props {
  title?: string
  showBack?: boolean
  leftText?: string
  rightText?: string
  leftArrow?: boolean
  customLeft?: boolean
  customRight?: boolean
  darkMode?: boolean
  /** 主题模式：light(浅色)、dark(深色)、auto(自动检测系统主题) */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: false,
  leftText: '',
  rightText: '',
  leftArrow: true,
  customLeft: false,
  customRight: false,
  darkMode: true,
  themeMode: 'auto'
})

// 计算主题模式，兼容旧的darkMode属性
const themeMode = computed(() => {
  if (props.themeMode !== 'auto') {
    return props.themeMode
  }
  return props.darkMode ? 'dark' : 'light'
})

const emit = defineEmits<{
  leftClick: []
  rightClick: []
}>()

const router = useRouter()

const handleLeftClick = () => {
  if (props.customLeft) {
    emit('leftClick')
    return
  }
  
  if (props.showBack) {
    router.back()
  } else {
    emit('leftClick')
  }
}

const handleRightClick = () => {
  emit('rightClick')
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.sdkwork-navbar) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .sdkwork-navbar__title {
      font-size: 16px;
      font-weight: 600;
    }
    
    .sdkwork-navbar__left,
    .sdkwork-navbar__right {
      .sdkwork-navbar__text {
        font-size: 14px;
      }
    }
    
    .sdkwork-navbar__left {
      padding-left: 8px;
    }
    
    .sdkwork-navbar__right {
      padding-right: 8px;
    }
  }
}
</style>