<template>
  <div class="auth-layout">
    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from '@/hooks/usePageTitle';

const { pageTitle, setPageTitle } = usePageTitle()
onMounted(() => {
  // 设置页面标题
  setPageTitle() 
})
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100dvh;
  height: 100dvh;
  max-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-content {
  width: 100%; 
}
</style>