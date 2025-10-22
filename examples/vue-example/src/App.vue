<template>
  <div id="app">
    <!-- 应用提供者 -->
    <AppProvider>
      <!-- 路由视图 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- 全局加载提示 -->
      <van-overlay :show="globalLoading" class="global-loading">
        <div class="loading-content">
          <van-loading type="spinner" size="24px" />
          <span class="loading-text">{{ loadingText }}</span>
        </div>
      </van-overlay>

      <!-- 全局消息提示 -->
      <van-notify v-model:show="showNotify" type="success">
        {{ notifyMessage }}
      </van-notify>
    </AppProvider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import AppProvider from '@/components/common/app-provider.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const globalLoading = ref(false)
const loadingText = ref('加载中...')
const showNotify = ref(false)
const notifyMessage = ref('')

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 全局加载控制方法
const setGlobalLoading = (loading: boolean, text: string = '加载中...') => {
  globalLoading.value = loading
  loadingText.value = text
}

const showGlobalNotify = (message: string, type: string = 'success') => {
  notifyMessage.value = message
  showNotify.value = true
}

// 路由守卫处理
const setupRouterGuard = () => {
  router.beforeEach((to, from, next) => {
    // 设置全局加载状态
    setGlobalLoading(true, '页面加载中...')

    // 认证检查
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      next('/auth/login')
      return
    }

    // 已认证用户访问登录页，重定向到首页
    if (to.path.startsWith('/auth') && isAuthenticated.value) {
      next('/')
      return
    }

    next()
  })

  router.afterEach(() => {
    // 关闭全局加载状态
    setGlobalLoading(false)
    
    // 滚动到顶部
    window.scrollTo(0, 0)
  })

  router.onError((error) => {
    console.error('路由错误:', error)
    setGlobalLoading(false)
    showGlobalNotify('页面加载失败，请重试', 'danger')
  })
}

// 网络状态监听
const setupNetworkListener = () => {
  const handleOnline = () => {
    showGlobalNotify('网络连接已恢复')
  }

  const handleOffline = () => {
    showGlobalNotify('网络连接已断开', 'warning')
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })
}

// 错误处理
const setupErrorHandler = () => {
  const handleError = (event: ErrorEvent) => {
    console.error('全局错误:', event.error)
    // 在实际项目中，这里可以集成错误报告服务
  }

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('未处理的 Promise 拒绝:', event.reason)
    // 在实际项目中，这里可以集成错误报告服务
  }

  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  })
}

// 初始化应用
const initializeApp = async () => {
  try {
    setGlobalLoading(true, '应用初始化中...')

    // 检查用户认证状态
    // await authStore.checkAuthStatus() // 暂时注释掉，等待authStore实现此方法

    // 设置路由守卫
    setupRouterGuard()

    // 设置网络状态监听
    setupNetworkListener()

    // 设置错误处理
    setupErrorHandler()

    setGlobalLoading(false)
  } catch (error) {
    console.error('应用初始化失败:', error)
    setGlobalLoading(false)
    showGlobalNotify('应用初始化失败', 'danger')
  }
}

// 组件挂载时初始化应用
onMounted(() => {
  initializeApp()
})

// 暴露全局方法给 window 对象（开发调试用）
if (import.meta.env.DEV) {
  (window as any).$app = {
    setGlobalLoading,
    showGlobalNotify,
    authStore,
    router
  }
}
</script>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  min-height: 100dvh;
}

// 全局过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 全局加载样式
.global-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .loading-text {
      font-size: 14px;
      color: #666;
    }
  }
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  #app {
    color: white;
    background: #1a1a1a;
  }

  .global-loading {
    .loading-content {
      background: #2d3748;
      color: white;

      .loading-text {
        color: #a0aec0;
      }
    }
  }

  ::-webkit-scrollbar-track {
    background: #2d3748;
  }

  ::-webkit-scrollbar-thumb {
    background: #4a5568;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #718096;
  }
}

// 移动端适配
@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }

  .global-loading {
    .loading-content {
      padding: 20px;
      margin: 0 20px;

      .loading-text {
        font-size: 13px;
      }
    }
  }
}

// 打印样式
@media print {
  .global-loading,
  .van-overlay,
  .van-notify {
    display: none !important;
  }
}

// 无障碍支持
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

// 高对比度支持
@media (prefers-contrast: high) {
  #app {
    color: #000;
    background: #fff;
  }

  .global-loading {
    background: rgba(0, 0, 0, 0.9);

    .loading-content {
      border: 2px solid #000;
    }
  }
}
</style>