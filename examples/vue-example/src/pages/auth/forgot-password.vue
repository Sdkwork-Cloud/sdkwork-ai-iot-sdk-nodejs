<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <SdkworkAuthForgot
      @verify-success="handleVerifySuccess"
      @reset-success="handleResetSuccess"
      @back-to-login="goToLogin"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SdkworkAuthForgot from '@/components/sdkwork-auth-forgot/sdkwork-auth-forgot.vue'

definePage({
  meta: {
    title: '忘记密码',
    layout: 'auth'
  }
})

const router = useRouter()

const handleVerifySuccess = (identifier: string) => {
  console.log('身份验证成功:', identifier)
}

const handleResetSuccess = () => {
  console.log('密码重置成功')
  router.push('/auth/login')
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.forgot-password-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .forgot-password-form {
    padding: 20px;
    
    .back-link {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>