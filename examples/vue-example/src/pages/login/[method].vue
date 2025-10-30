<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 动态切换登录组件 -->
    <component
      :is="currentLoginComponent"
      @login-success="handleLoginSuccess"
      @login-failed="handleLoginFailed"
      @register-click="goToRegister"
      @forgot-password="goToForgotPassword"
      @switch-to-account="switchToAccountLogin"
      @switch-to-register="goToRegister"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import SdkworkAuthLogin from '@/components/sdkwork-auth-login/sdkwork-auth-login.vue'
import SdkworkAuthOauthLogin from '@/components/sdkwork-auth-oauth-login/sdkwork-auth-oauth-login.vue'

// 定义支持的登录方法
const LOGIN_METHODS = {
  account: SdkworkAuthLogin,
  oauth: SdkworkAuthOauthLogin,
  // 可以继续添加其他登录方式
} as const

type LoginMethod = keyof typeof LOGIN_METHODS

definePage({
    meta: {
        title: '登录',
        hideHeader: true, 
    }
})

const router = useRouter()
const route:any = useRoute()

// 获取当前登录方法，默认为account
const currentMethod = computed<LoginMethod>(() => {
  const method = route.params.method as string
  return method && method in LOGIN_METHODS ? method as LoginMethod : 'account'
})

// 当前登录组件
const currentLoginComponent = computed(() => {
  return LOGIN_METHODS[currentMethod.value]
})

// 登录成功处理
const handleLoginSuccess = (user: any) => {
  console.log('登录成功:', user)
  router.push('/')
}

// 登录失败处理
const handleLoginFailed = (error: Error) => {
  console.error('登录失败:', error)
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/auth/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}

// 切换到账号密码登录
const switchToAccountLogin = () => {
  router.push('/login/account')
}

// 监听路由参数变化，动态更新组件
watch(() => route.params.method, (newMethod) => {
  console.log('登录方法已切换:', newMethod)
})
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100dvh;
}
</style>

