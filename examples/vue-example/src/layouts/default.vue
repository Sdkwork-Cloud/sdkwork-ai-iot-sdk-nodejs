<template>
  <div class="default-layout">
    <app-header v-if="!hideHeader" :title="pageTitle" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
.default-layout {
  min-height: 100dvh;
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