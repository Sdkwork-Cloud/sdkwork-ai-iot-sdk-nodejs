<template>
  <div 
    class="sdkwork-tabbar"
    :class="[
      {
        'sdkwork-tabbar--fixed': fixed,
        'sdkwork-tabbar--border': border,
        'sdkwork-tabbar--safe-area-inset-bottom': safeAreaInsetBottom
      },
      themeClass
    ]"
    :style="{
      zIndex: zIndex
    }"
  >
    <div class="sdkwork-tabbar__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch, computed, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  modelValue?: string | number
  fixed?: boolean
  border?: boolean
  zIndex?: number
  activeColor?: string
  inactiveColor?: string
  route?: boolean
  placeholder?: boolean
  safeAreaInsetBottom?: boolean
  iconOnly?: boolean
  /** 主题模式：light(浅色)、dark(深色)、auto(自动检测系统主题) */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  fixed: false,
  border: true,
  zIndex: 1,
  activeColor: '#1989fa',
  inactiveColor: '#7d7e80',
  route: false,
  placeholder: false,
  safeAreaInsetBottom: true,
  iconOnly: false,
  themeMode: 'auto'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

// Reactive state
const activeName = ref(props.modelValue)

// Dark mode support
const isDarkMode = ref(false)

// Provide data to tabbar items
const setActive = (name: string | number) => {
  if (activeName.value !== name) {
    activeName.value = name
    emit('update:modelValue', name)
    emit('change', name)
  }
}

// Provide context with proper typing
const tabbarContext = {
  activeName,
  setActive,
  activeColor: props.activeColor,
  inactiveColor: props.inactiveColor,
  route: props.route,
  iconOnly: props.iconOnly,
  isDarkMode
}

provide('sdkwork-tabbar', tabbarContext)

// Watch modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== activeName.value) {
    activeName.value = newValue
  }
})

// Watch activeName changes
watch(activeName, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
})

// Detect system dark mode preference
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// Update theme based on props.themeMode
const updateTheme = () => {
  if (props.themeMode === 'dark') {
    isDarkMode.value = true
  } else if (props.themeMode === 'light') {
    isDarkMode.value = false
  } else if (props.themeMode === 'auto') {
    isDarkMode.value = detectSystemDarkMode()
  }
}

// Watch theme mode changes
watch(() => props.themeMode, updateTheme)

// Theme class for styling
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-tabbar--dark' : 'sdkwork-tabbar--light'
})

// Listen to system theme changes
let mediaQuery: MediaQueryList | null = null

onMounted(() => {
  updateTheme()
  
  if (props.themeMode === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (props.themeMode === 'auto') {
        isDarkMode.value = mediaQuery?.matches || false
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    onUnmounted(() => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      }
    })
  }
})
</script>

<style scoped>
.sdkwork-tabbar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  background-color: var(--sdkwork-tabbar-background, #fff);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sdkwork-tabbar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
}

.sdkwork-tabbar--safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.sdkwork-tabbar__content {
  display: flex;
  width: 100%;
  height: 100%;
}

.sdkwork-tabbar::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--sdkwork-tabbar-border-color, #ebedf0);
  content: '';
  transition: background-color 0.3s ease;
}

.sdkwork-tabbar--border::before {
  display: block;
}

.sdkwork-tabbar:not(.sdkwork-tabbar--border)::before {
  display: none;
}

/* Light theme */
.sdkwork-tabbar--light {
  --sdkwork-tabbar-background: #fff;
  --sdkwork-tabbar-border-color: #ebedf0;
  --sdkwork-tabbar-item-color: #7d7e80;
  --sdkwork-tabbar-item-active-color: #1989fa;
}

/* Dark theme */
.sdkwork-tabbar--dark {
  --sdkwork-tabbar-background: #1a1a1a;
  --sdkwork-tabbar-border-color: #333;
  --sdkwork-tabbar-item-color: #999;
  --sdkwork-tabbar-item-active-color: #4a90e2;
}

/* System preference support */
@media (prefers-color-scheme: dark) {
  .sdkwork-tabbar:not(.sdkwork-tabbar--light):not(.sdkwork-tabbar--dark) {
    --sdkwork-tabbar-background: #1a1a1a;
    --sdkwork-tabbar-border-color: #333;
    --sdkwork-tabbar-item-color: #999;
    --sdkwork-tabbar-item-active-color: #4a90e2;
  }
}
</style>