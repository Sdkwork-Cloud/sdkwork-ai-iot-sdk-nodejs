<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <SdkworkAuthReset
      @reset-success="handleResetSuccess"
      @reset-failed="handleResetFailed"
      @back="goToLogin"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SdkworkAuthReset from '@/components/sdkwork-auth-reset/sdkwork-auth-reset.vue'

definePage({
  meta: {
    title: '重置密码',
    layout: 'auth',
    hideHeader: true, 
  }
})

const router = useRouter()

const handleResetSuccess = () => {
  console.log('密码重置成功')
  router.push('/auth/login')
}

const handleResetFailed = (error: Error) => {
  console.error('重置密码失败:', error)
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.reset-password-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .reset-password-form {
    padding: 20px;
    
    .back-link {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>