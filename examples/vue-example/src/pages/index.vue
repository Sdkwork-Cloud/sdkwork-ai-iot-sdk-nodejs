<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 主内容区域 -->
    <div class="main-content">
      <router-view />
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
// 根路径页面 - 路由配置会自动重定向到 /home
definePage({
    meta: {
        title: '首页',
        hideHeader: true,
        hideBackButton: true
    }
})
</script>

<style scoped lang="scss">
.home-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  
  .app-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .main-content {
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>