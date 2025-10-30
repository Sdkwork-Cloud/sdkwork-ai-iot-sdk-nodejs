<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePageTitle } from '@/hooks/usePageTitle'

const route = useRoute()

// 使用页面标题hook
const { pageTitle, setPageTitle } = usePageTitle() 
onMounted(() => {
  // 设置页面标题
  setPageTitle() 
})
</script>

<style scoped lang="scss">
.empty-layout {
  /* 微信浏览器兼容性处理 */
  min-height: 100vh; /* 基础兼容性 */
  min-height: -webkit-fill-available; /* 移动端浏览器兼容 */
  min-height: 100dvh; /* 动态视口高度 */
  
  height: 100vh; /* 基础兼容性 */
  height: -webkit-fill-available; /* 移动端浏览器兼容 */
  height: 100dvh; /* 动态视口高度 */
  
  max-height: 100vh; /* 基础兼容性 */
  max-height: 100dvh; /* 动态视口高度 */
}
</style>