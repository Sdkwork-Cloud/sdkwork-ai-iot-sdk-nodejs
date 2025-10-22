<template>
  <div class="tabbar-layout">
    <!-- 页面头部 -->
    <app-header v-if="!hideHeader" :title="pageTitle" />
    
    <!-- 主要内容区域 -->
    <main class="layout-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏 -->
    <app-bottom-tabbar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBottomTabbar from '@/components/layout/app-bottom-tabbar/app-bottom-tabbar.vue'

const route = useRoute()

// 定义路由元数据类型
interface RouteMeta {
  title?: string
  layout?: string
  hideHeader?: boolean
}

// 从路由元数据获取页面标题
const pageTitle = computed(() => {
  const meta = route.meta as RouteMeta
  return meta.title || 'SDKWork AIoT'
})
// 检查是否需要隐藏 header
const hideHeader = computed(() => {
  const meta = route.meta as RouteMeta
  return meta.hideHeader || false
})
</script>

<style scoped lang="scss">
.tabbar-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  
  .layout-content {
    flex: 1;
    padding-bottom: 60px; // 为底部导航栏留出空间
  }
}
</style>