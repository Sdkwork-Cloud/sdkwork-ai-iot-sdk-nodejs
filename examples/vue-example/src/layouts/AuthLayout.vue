<template>
  <div class="auth-layout">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>

    <!-- 主要内容区域 -->
    <main class="auth-main">
      <!-- 头部品牌标识 -->
      <header class="auth-header" v-if="showHeader">
        <div class="brand">
          <img 
            src="@/assets/logo.png" 
            alt="SDKWork AI IoT SDK" 
            class="brand-logo"
            @error="handleLogoError"
          />
          <h1 class="brand-name">SDKWork AI IoT SDK</h1>
        </div>
        <div class="header-actions">
          <van-button 
            round 
            plain 
            size="small" 
            @click="handleBackHome"
            class="back-home-btn"
          >
            ← 返回首页
          </van-button>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="auth-content">
        <router-view />
      </div>

      <!-- 页脚信息 -->
      <footer class="auth-footer" v-if="showFooter">
        <div class="footer-content">
          <p class="copyright">
            © 2025 SDKWork AI IoT SDK. All rights reserved.
          </p>
          <div class="footer-links">
            <a href="/privacy" class="footer-link">隐私政策</a>
            <a href="/terms" class="footer-link">服务条款</a>
            <a href="/help" class="footer-link">帮助中心</a>
          </div>
        </div>
      </footer>
    </main>

    <!-- 全局加载状态 -->
    <van-overlay :show="globalLoading" class="global-loading-overlay">
      <div class="loading-content">
        <van-loading type="spinner" size="24px" />
        <p class="loading-text">加载中...</p>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { usePageTitle } from '@/hooks/usePageTitle'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 使用页面标题hook
const { pageTitle, setPageTitle } = usePageTitle()

// 响应式数据
const globalLoading = ref(false)
const logoError = ref(false)

// 监听路由变化，更新标题
watch(() => route, () => {
  setPageTitle()
}, { deep: true })

// 计算属性
const showHeader = computed(() => {
  return !route.meta.hideHeader
})

const showFooter = computed(() => {
  return !route.meta.hideFooter
})

// 处理logo加载错误
const handleLogoError = () => {
  logoError.value = true
}

// 处理返回首页
const handleBackHome = () => {
  router.push('/')
}

// 设置全局加载状态
const setGlobalLoading = (loading: boolean) => {
  globalLoading.value = loading
}

// 组件挂载时的逻辑
onMounted(() => {
  // 设置页面标题
  setPageTitle()
  
  // 检查认证状态
  if (route.meta.requiresGuest && authStore.isAuthenticated) {
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  }
})

// 暴露方法给子组件
defineExpose({
  setGlobalLoading
})
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100dvh;
  height: 100dvh;
  max-height: 100dvh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;

  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;

      &.circle-1 {
        width: 200px;
        height: 200px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      &.circle-2 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      &.circle-3 {
        width: 100px;
        height: 100px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }
    }
  }

  .auth-main {
    position: relative;
    z-index: 1;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;

    .auth-header { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;

        .brand-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
        }
      }

      .header-actions {
        .back-home-btn {
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }

    .auth-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center; 
    }

    .auth-footer {
      padding: 20px 30px;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .copyright {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 20px;

          .footer-link {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;

            &:hover {
              color: white;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  .global-loading-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;

    .loading-content {
      text-align: center;
      color: white;

      .loading-text {
        margin-top: 12px;
        font-size: 14px;
      }
    }
  }
}

// 动画定义
@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .auth-layout {
    .auth-main {
      .auth-header {
        padding: 15px 20px;
        flex-direction: column;
        gap: 15px;

        .brand {
          .brand-name {
            font-size: 16px;
          }
        }
      }

      .auth-content {
        padding: 15px;
      }

      .auth-footer {
        padding: 15px 20px;

        .footer-content {
          flex-direction: column;
          gap: 10px;
          text-align: center;

          .footer-links {
            justify-content: center;
          }
        }
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .auth-layout {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);

    .background-decoration {
      .decoration-circle {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}

// 打印样式
@media print {
  .auth-layout {
    background: white !important;

    .background-decoration,
    .auth-header,
    .auth-footer {
      display: none !important;
    }

    .auth-content {
      padding: 0 !important;
    }
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  .auth-layout {
    .auth-main {
      .auth-header {
        background: rgba(0, 0, 0, 0.8);
        
        .brand-name {
          color: white;
          text-shadow: 0 0 2px black;
        }
      }

      .auth-footer {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  }
}

// 减少动画偏好
@media (prefers-reduced-motion: reduce) {
  .auth-layout {
    .background-decoration {
      .decoration-circle {
        animation: none;
      }
    }
  }
}
</style>