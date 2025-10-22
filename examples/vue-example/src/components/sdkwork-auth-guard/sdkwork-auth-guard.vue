<template>
  <div class="sdkwork-auth-guard">
    <!-- 认证检查中 -->
    <div v-if="checkingAuth" class="auth-checking">
      <van-loading type="spinner" size="24px" />
      <p class="checking-text">检查认证状态...</p>
    </div>

    <!-- 未认证且需要认证 -->
    <div v-else-if="!isAuthenticated && requiresAuth" class="auth-required">
      <div class="auth-prompt">
        <van-icon name="warning" size="48" color="#ff976a" />
        <h3 class="prompt-title">需要登录</h3>
        <p class="prompt-message">您需要登录才能访问此页面</p>
        <div class="prompt-actions">
          <van-button
            round
            type="primary"
            @click="handleLogin"
            class="login-button"
          >
            立即登录
          </van-button>
          <van-button
            round
            plain
            @click="handleBack"
            class="back-button"
          >
            返回
          </van-button>
        </div>
      </div>
    </div>

    <!-- 已认证但需要访客状态 -->
    <div v-else-if="isAuthenticated && requiresGuest" class="guest-required">
      <div class="guest-prompt">
        <van-icon name="info" size="48" color="#1989fa" />
        <h3 class="prompt-title">已登录</h3>
        <p class="prompt-message">您已经登录，正在跳转到首页...</p>
        <van-button
          round
          type="primary"
          @click="handleRedirect"
          class="redirect-button"
        >
          立即跳转
        </van-button>
      </div>
    </div>

    <!-- 权限不足 -->
    <div v-else-if="!hasPermission" class="permission-denied">
      <div class="permission-prompt">
        <van-icon name="close" size="48" color="#ee0a24" />
        <h3 class="prompt-title">权限不足</h3>
        <p class="prompt-message">您没有权限访问此页面</p>
        <div class="prompt-actions">
          <van-button
            round
            type="primary"
            @click="handleBackHome"
            class="home-button"
          >
            返回首页
          </van-button>
          <van-button
            round
            plain
            @click="handleContactAdmin"
            class="contact-button"
          >
            联系管理员
          </van-button>
        </div>
      </div>
    </div>

    <!-- 正常显示内容 -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'

interface Props {
  // 认证要求
  requiresAuth?: boolean
  requiresGuest?: boolean
  // 权限要求
  requiredPermissions?: string[]
  requiredRoles?: string[]
  // 重定向配置
  loginRedirect?: string
  guestRedirect?: string
  // 自定义行为
  autoRedirect?: boolean
  showPrompt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requiresAuth: false,
  requiresGuest: false,
  requiredPermissions: () => [],
  requiredRoles: () => [],
  loginRedirect: '/auth/login',
  guestRedirect: '/',
  autoRedirect: true,
  showPrompt: true
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const checkingAuth = ref(true)

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)

// 检查权限
const hasPermission = computed(() => {
  // 如果没有权限要求，直接返回true
  if (props.requiredPermissions.length === 0 && props.requiredRoles.length === 0) {
    return true
  }

  // 这里应该实现实际的权限检查逻辑
  // 暂时返回true，实际项目中需要根据用户权限进行判断
  return true
})

// 处理登录
const handleLogin = () => {
  const redirectUrl = route.fullPath
  router.push({
    path: props.loginRedirect,
    query: { redirect: redirectUrl }
  })
}

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理重定向
const handleRedirect = () => {
  router.push(props.guestRedirect)
}

// 处理返回首页
const handleBackHome = () => {
  router.push('/')
}

// 处理联系管理员
const handleContactAdmin = () => {
  showToast('请联系系统管理员获取权限')
}

// 检查认证状态
const checkAuthStatus = async () => {
  try {
    checkingAuth.value = true
    
    // 如果store中已经有认证状态，直接使用
    if (authStore.isAuthenticated !== null) {
      checkingAuth.value = false
      return
    }

    // 否则检查本地存储的token
    await authStore.checkAuth()
  } catch (error) {
    console.error('检查认证状态失败:', error)
  } finally {
    checkingAuth.value = false
  }
}

// 处理自动重定向
const handleAutoRedirect = () => {
  if (!props.autoRedirect || checkingAuth.value) return

  // 需要认证但未认证
  if (props.requiresAuth && !isAuthenticated.value) {
    if (props.showPrompt) return // 显示提示，不自动重定向
    
    const redirectUrl = route.fullPath
    router.push({
      path: props.loginRedirect,
      query: { redirect: redirectUrl }
    })
    return
  }

  // 需要访客状态但已认证
  if (props.requiresGuest && isAuthenticated.value) {
    if (props.showPrompt) return // 显示提示，不自动重定向
    
    router.push(props.guestRedirect)
    return
  }

  // 权限不足
  if (!hasPermission.value) {
    if (props.showPrompt) return // 显示提示，不自动重定向
    
    router.push('/')
  }
}

// 监听认证状态变化
watch(isAuthenticated, () => {
  handleAutoRedirect()
})

// 组件挂载时检查认证状态
onMounted(() => {
  checkAuthStatus().then(() => {
    handleAutoRedirect()
  })
})

// 暴露方法给父组件
defineExpose({
  checkAuthStatus,
  handleLogin,
  handleRedirect
})
</script>

<style scoped lang="scss">
.sdkwork-auth-guard {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  .auth-checking,
  .auth-required,
  .guest-required,
  .permission-denied {
    text-align: center;
    padding: 40px 20px;

    .checking-text,
    .prompt-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 16px 0 8px 0;
    }

    .prompt-message {
      font-size: 14px;
      color: #666;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .prompt-actions {
      display: flex;
      gap: 12px;
      justify-content: center;

      .login-button,
      .back-button,
      .redirect-button,
      .home-button,
      .contact-button {
        min-width: 120px;
        height: 40px;
      }
    }
  }

  .auth-checking {
    .checking-text {
      color: #1989fa;
    }
  }

  .auth-required {
    .prompt-title {
      color: #ff976a;
    }
  }

  .guest-required {
    .prompt-title {
      color: #1989fa;
    }
  }

  .permission-denied {
    .prompt-title {
      color: #ee0a24;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sdkwork-auth-guard {
    .auth-checking,
    .auth-required,
    .guest-required,
    .permission-denied {
      padding: 30px 15px;

      .prompt-actions {
        flex-direction: column;
        align-items: center;

        .login-button,
        .back-button,
        .redirect-button,
        .home-button,
        .contact-button {
          width: 100%;
          max-width: 200px;
        }
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .sdkwork-auth-guard {
    .auth-checking,
    .auth-required,
    .guest-required,
    .permission-denied {
      .checking-text,
      .prompt-title {
        color: white;
      }

      .prompt-message {
        color: #a0aec0;
      }
    }
  }
}
</style>