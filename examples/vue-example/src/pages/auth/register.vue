<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <SdkworkAuthRegister
      @register-success="handleRegisterSuccess"
      @register-failed="handleRegisterFailed"
      @login-click="goToLogin"
    />
  </sdkwork-page-container>
</template>
 
<script setup lang="ts">
import { useRouter } from 'vue-router'
import SdkworkAuthRegister from '@/components/sdkwork-auth-register/sdkwork-auth-register.vue'

definePage({
    meta: {
        title: '注册',
        hideHeader: true, 
    }
})

const router = useRouter()

const handleRegisterSuccess = (user: any) => {
  console.log('注册成功:', user)
  router.push('/auth/login')
}

const handleRegisterFailed = (error: Error) => {
  console.error('注册失败:', error)
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100dvh;
}
</style>
