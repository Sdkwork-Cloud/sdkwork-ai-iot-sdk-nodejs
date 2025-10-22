<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <SdkworkAuthLogin
      @login-success="handleLoginSuccess"
      @login-failed="handleLoginFailed"
      @register-click="goToRegister"
      @forgot-password="goToForgotPassword"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SdkworkAuthLogin from '@/components/sdkwork-auth-login/sdkwork-auth-login.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'

definePage({
    meta: {
        title: '登录',
    }
})

const router = useRouter()

// 页面加载处理
const handlePageLoad = () => {
  console.log('登录页面已加载')
}

const handleLoginSuccess = (user: any) => {
  console.log('登录成功:', user)
  router.push('/')
}

const handleLoginFailed = (error: Error) => {
  console.error('登录失败:', error)
}

const goToRegister = () => {
  router.push('/auth/register')
}

const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100dvh;
}
</style>

