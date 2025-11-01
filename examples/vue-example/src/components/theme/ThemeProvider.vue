<template>
  <div class="theme-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'

// 初始化主题系统
const { isDarkMode, currentTheme } = useTheme()

onMounted(() => {
  // 确保主题在组件挂载时正确应用
  // 主题系统会自动处理主题应用，这里只需要确保hook被正确初始化
  console.log('主题提供器已初始化，当前主题:', currentTheme.value)
})
</script>

<style scoped>
.theme-provider {
  min-height: 100vh;
  background-color: var(--theme-background-color);
  color: var(--theme-text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>