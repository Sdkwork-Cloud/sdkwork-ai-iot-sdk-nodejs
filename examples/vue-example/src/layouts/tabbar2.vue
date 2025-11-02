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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppBottomTabbar from '@/components/layout/app-bottom-tabbar/app-bottom-tabbar.vue'
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
.tabbar-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  // 移动端安全区域适配
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  // 主要内容区域（自动计算高度，为tabbar预留空间）
  .layout-content { 
    overflow-x: hidden;
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    -webkit-overflow-scrolling: touch; // iOS平滑滚动

    // 移动端滚动优化
    &::-webkit-scrollbar {
      display: none; // 隐藏滚动条
    }
 

    // 确保内容可以滚动
    min-height: 0; // 重要：允许flex容器缩小

    // 滚动容器样式
    scroll-behavior: smooth;
  }
}
</style>