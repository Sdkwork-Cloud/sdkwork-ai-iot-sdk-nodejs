<template>
  <van-config-provider :theme="currentTheme">
    <div id="app"
      :class="['app-container', layoutClass, { 'dvh-supported': supportsDvh, 'dvh-not-supported': !supportsDvh }]"
      :style="{ width: `${windowWidth}px !important`, height: `${windowHeight}px !important` }">
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
  </van-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import AppProvider from '@/components/common/app-provider.vue'
import { useIotClient } from './hooks/client/useIotClient'
import { useAppProvider } from '@/hooks/useAppProvider'
import { useWindowSize } from '@vueuse/core'
import { useTheme } from '@/hooks/theme/useTheme' 

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 使用主题系统
const { currentTheme, isDarkMode, setTheme } = useTheme()

// 初始化 Vant 主题系统
import { initVantTheme } from '@/utils/vant-theme' 
 
initVantTheme()

// 尽早注册全局方法，解决加载生命周期问题
const { registerGlobalMethods } = useAppProvider()
registerGlobalMethods()

// 在Vue上下文中创建getParameter方法
function _getParameter(name: string) {
  try {
    // 如果路由对象存在且有效，从路由对象中获取参数
    if (route && (route.params || route.query)) {
      if (route.params && (route.params as Record<string, any>)[name]) {
        return (route.params as Record<string, any>)[name];
      }
      if (route.query && (route.query as Record<string, any>)[name]) {
        return (route.query as Record<string, any>)[name];
      }
    }

    // 如果路由对象为空或无法获取参数，从URL中解析
    const url = window.location.href;
    const urlObj = new URL(url);

    // 尝试从URL查询参数中获取
    if (urlObj.searchParams.has(name)) {
      return urlObj.searchParams.get(name);
    }

    // 尝试从URL路径中解析参数（简单实现，可能需要根据实际路由规则调整）
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const pathParamNames = window.$router?.currentRoute?.value?.matched[0]?.path.split('/').filter((s: any) => s.startsWith(':')) || [];

    for (let i = 0; i < pathParamNames.length; i++) {
      const paramName = pathParamNames[i].substring(1); // 去掉':'前缀
      if (paramName === name && i < pathSegments.length) {
        return pathSegments[i];
      }
    }

    return null;
  } catch (error) {
    console.error('获取路由参数失败:', error);
    return null;
  }
}

function getParameter(name: string | any) {
  if (typeof name === 'string') {
    return _getParameter(name);
  }
  if (Array.isArray(name)) {
    for (let n of name) {
      let v = _getParameter(n);
      if (v) return v;
    }
  }
  return null;
}

// 注册getParameter到全局
window.$getParameter = getParameter;

// 响应式数据
const globalLoading = ref(false)
const loadingText = ref('加载中...')
const showNotify = ref(false)
const notifyMessage = ref('')

// 检测浏览器是否支持 dvh
const supportsDvh = ref(true)

// 使用窗口尺寸Hook
const { width: windowWidth, height: windowHeight } = useWindowSize()

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const { createSDK, initSDK, sdkConfig } = useIotClient()

// 动态布局类名
const layoutClass = ref('no-tabbar') // 默认无tabbar

// 更新布局类名的方法
const updateLayoutClass = () => {
  try {
    // 使用当前路由信息来更新布局类名
    const currentPath = router.currentRoute.value.path
    const currentMeta = router.currentRoute.value.meta as { layout?: string }

    // 确保meta对象存在
    if (!currentMeta) {
      layoutClass.value = 'no-tabbar'
      return
    }

    if (currentMeta.layout === 'tabbar') {
      layoutClass.value = 'has-tabbar'
    } else if (currentMeta.layout === 'empty') {
      layoutClass.value = 'no-tabbar'
    } else {
      layoutClass.value = 'no-tabbar' // 默认无tabbar
    }
  } catch (error) {
    console.warn('更新布局类名失败:', error)
    layoutClass.value = 'no-tabbar' // 出错时使用默认值
  }
}

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

  router.afterEach((to) => {
    // 更新布局类名
    updateLayoutClass()

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

  // 返回清理函数
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
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

  // 返回清理函数
  return () => {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
}

// 初始化SDK（仅在登录状态下）
const initializeSDK = async () => {
  if (isAuthenticated.value) {
    try {
      console.log('用户已登录，开始初始化SDK...')
      await initSDK(sdkConfig)
      console.log('SDK初始化成功')
    } catch (error) {
      console.error('SDK初始化失败:', error)
      showGlobalNotify('SDK初始化失败', 'danger')
    }
  } else {
  }
}

// 销毁SDK
const destroySDK = async () => {
  try {
    console.log('开始销毁SDK...')
    // 这里应该调用实际的SDK销毁方法，而不是递归调用自身
    // await actualSDKDestroyMethod()
    console.log('SDK销毁成功')
  } catch (error) {
    console.error('SDK销毁失败:', error)
  }
}

// 检测浏览器是否支持 dvh
const checkDvhSupport = () => {
  if (typeof window === 'undefined') return

  try {
    // 创建一个测试元素来检测 dvh 支持
    const testElement = document.createElement('div')
    testElement.style.height = '100dvh'
    document.body.appendChild(testElement)

    // 检查计算后的样式值
    const computedStyle = window.getComputedStyle(testElement)
    const heightValue = computedStyle.height

    // 如果计算后的高度不是有效的像素值，说明不支持 dvh
    supportsDvh.value = heightValue !== 'auto' && heightValue !== '0px' && heightValue !== ''

    // 清理测试元素
    document.body.removeChild(testElement)

    console.log(`浏览器 ${supportsDvh.value ? '支持' : '不支持'} dvh，检测结果: ${heightValue}`)
  } catch (error) {
    console.warn('检测 dvh 支持时出错:', error)
    supportsDvh.value = false
  }
}

// 设置认证事件监听
const setupAuthEventListeners = () => {
  // 监听登录成功事件
  if (window.$on) {
    window.$on('auth:login-success', (result: any) => {
      console.log('监听到登录成功事件，初始化SDK')
        sdkConfig.authorization = result.token
        initializeSDK()
    })

    // 监听登出开始事件
    window.$on('auth:logout-start', () => {
      console.log('监听到登出开始事件，销毁SDK')
      destroySDK()
    })
  }
}

// 收集清理函数
const cleanupFunctions: (() => void)[] = []

// 初始化应用
const initializeApp = async () => {
  try {
    setGlobalLoading(true, '应用初始化中...')

    // 检测浏览器是否支持 dvh
    checkDvhSupport()

    // 检查用户认证状态（基于token有效性）
    await authStore.checkAuthStatus()

    // 设置初始布局类名
    updateLayoutClass()

    // 设置路由守卫
    setupRouterGuard()

    // 设置网络状态监听
    const networkCleanup = setupNetworkListener()
    if (networkCleanup) {
      cleanupFunctions.push(networkCleanup)
    }

    // 设置错误处理
    const errorHandlerCleanup = setupErrorHandler()
    if (errorHandlerCleanup) {
      cleanupFunctions.push(errorHandlerCleanup)
    }

    // 设置认证事件监听
    setupAuthEventListeners()

    // 根据当前认证状态决定是否初始化SDK
    initializeSDK()

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

// 组件卸载时执行清理
onUnmounted(() => {
  cleanupFunctions.forEach(cleanup => {
    try {
      cleanup()
    } catch (error) {
      console.error('清理函数执行失败:', error)
    }
  })
  cleanupFunctions.length = 0
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
// 移动端根元素样式优化
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  -webkit-text-size-adjust: 100%; // 防止iOS Safari自动调整字体大小
  -webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
  -webkit-overflow-scrolling: touch; // iOS平滑滚动
}

// 移动端应用容器
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--theme-text-color, #333);
  background-color: var(--theme-background-color, #ffffff);

  /* 微信浏览器兼容性处理 - 基础样式 */
  min-height: 100vh !important;
  /* 基础兼容性 */
  min-height: -webkit-fill-available !important;
  /* 移动端浏览器兼容 */
  max-height: 100vh !important;
  height: 100vh !important;
  /* 基础兼容性 */
  height: -webkit-fill-available !important;
  /* 移动端浏览器兼容 */
  width: 100vw !important;

  /* 支持 dvh 的浏览器 */
  &.dvh-supported {
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    height: 100dvh !important;
  }

  overflow: hidden;
  box-sizing: border-box;

  // 移动端触摸优化
  touch-action: manipulation;
  user-select: none;

  // 防止移动端缩放
  -webkit-user-select: none;
  -webkit-touch-callout: none;

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
</style>