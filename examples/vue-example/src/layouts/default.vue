<template>
  <div class="default-layout">
    <app-header v-if="!hideHeader" :title="pageTitle" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePageTitle } from '@/hooks/usePageTitle'

const route = useRoute()

// 使用页面标题hook
const { pageTitle, setPageTitle } = usePageTitle()

// 定义路由元数据类型
interface RouteMeta {
  title?: string
  layout?: string
  hideHeader?: boolean
}
 
// 检查是否需要隐藏 header
const hideHeader = computed(() => {
  const meta = route.meta as RouteMeta
  return meta.hideHeader || false
}) 
onMounted(() => {
  // 设置页面标题
  setPageTitle() 
})
</script>

<style scoped lang="scss">
.default-layout {
  /* 微信浏览器兼容性处理 */
  min-height: 100vh; /* 基础兼容性 */
  min-height: -webkit-fill-available; /* 移动端浏览器兼容 */
  min-height: 100dvh; /* 动态视口高度 */
  
  height: 100vh; /* 基础兼容性 */
  height: -webkit-fill-available; /* 移动端浏览器兼容 */
  height: 100dvh; /* 动态视口高度 */
  
  max-height: 100vh; /* 基础兼容性 */
  max-height: 100dvh; /* 动态视口高度 */
  
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  padding: 16px;
  background-color: #f5f5f5;

  &.no-header {
    padding-top: 0;
  }
}
</style>