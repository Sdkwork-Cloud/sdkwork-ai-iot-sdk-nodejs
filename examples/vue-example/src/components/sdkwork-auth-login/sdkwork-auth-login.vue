<template>
  <div class="sdkwork-auth-login" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 全屏科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid-lines"></div>
      <div class="tech-particles-container">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="tech-glow-effect"></div>
    </div>

    <!-- 主容器 -->
    <div class="login-main-container">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo-animated">
            <div class="logo-icon">
              <Icon icon="ph:brain" class="brain-icon" />
              <div class="logo-glow"></div>
            </div>
            <h1 class="brand-title-main">SDKWork AI</h1>
            <p class="brand-subtitle-main">智能物联网平台</p>
          </div>

          <div class="tech-features">
            <div class="feature-item" v-for="feature in features" :key="feature">
              <Icon icon="ph:check-circle" class="feature-icon" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区 -->
      <div class="form-section">
        <div class="form-container">

          <!-- 登录表单标题 -->
          <div class="form-header">
            <h2 class="form-title">欢迎回来</h2>
            <p class="form-subtitle">登录您的AIoT账户</p>
          </div>

          <!-- Vant 表单 -->
          <van-form ref="loginFormRef" :model="loginForm" :rules="formRules" @submit="handleLogin"
            class="modern-login-form">
            <!-- 用户名输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:user" class="input-icon-svg" />
              </div>
              <van-field v-model="loginForm.username" name="username" placeholder="用户名或邮箱" :rules="formRules.username"
                :border="false" class="modern-input" />
            </div>

            <!-- 密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock" class="input-icon-svg" />
              </div>
              <van-field v-model="loginForm.password" name="password" :type="showPassword ? 'text' : 'password'"
                placeholder="密码" :rules="formRules.password" :border="false" class="modern-input">
                <template #button>
                  <div class="password-toggle" @click="showPassword = !showPassword">
                    <Icon :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="toggle-icon" />
                  </div>
                </template>
              </van-field>
            </div>

            <!-- 选项区域 -->
            <div class="form-options">
              <van-checkbox v-model="loginForm.rememberMe" shape="square" class="modern-checkbox">
                <span class="checkbox-label">记住登录状态</span>
              </van-checkbox>

              <van-button type="default" size="small" link @click="handleForgotPassword" class="forgot-password-link">
                忘记密码？
              </van-button>
            </div>

            <!-- 登录按钮 -->
            <div class="form-actions">
              <van-button round block type="primary" native-type="submit" :loading="loading" :disabled="!isFormValid"
                loading-text="登录中..." class="modern-login-button">
                <template #loading>
                  <van-loading type="spinner" size="20px" />
                </template>
                <span class="button-content">
                  <Icon icon="ph:sign-in" class="button-icon" />
                  <span>登录账户</span>
                </span>
              </van-button>
            </div>
          </van-form>

          <!-- 注册链接 -->
          <div class="register-section">
            <van-button type="default" size="large" @click="handleRegister" class="register-button">
              <Icon icon="ph:user-plus" class="register-icon" />
              <span>创建新账户</span>
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showNotify } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'
import { Icon } from '@iconify/vue'

// Vant 组件导入
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  Checkbox as VanCheckbox,
  Loading as VanLoading
} from 'vant'

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

interface Props {
  redirectUrl?: string
  autoRedirect?: boolean
  forceDarkMode?: boolean
  compactMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  redirectUrl: '/',
  autoRedirect: true,
  forceDarkMode: false,
  compactMode: false
})

interface Emits {
  'login-success': [user: any]
  'login-failed': [error: Error]
  'forgot-password': []
  'register-click': []
  'theme-change': [isDark: boolean]
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const isDarkMode = ref(false)
const showPassword = ref(false)
const loginFormRef = ref()

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  rememberMe: false
})

// 特性列表
const features = [
  '智能数据分析',
  '实时监控',
  'AI预测',
  '安全可靠'
]

// Vant Form 验证规则
const formRules:any = {
  username: [
    { required: true, message: '请输入用户名、邮箱或手机号', trigger: 'onBlur' },
    {
      validator: (value: string) => {
        // 邮箱验证：username@domain.com
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // 用户名验证：2-20位，支持字母、数字、下划线、中文
        const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
        // 手机号验证：中国大陆手机号
        const phoneRegex = /^1[3-9]\d{9}$/;
        
        return emailRegex.test(value) || usernameRegex.test(value) || phoneRegex.test(value);
      },
      message: '请输入有效的用户名、邮箱或手机号',
      trigger: 'onBlur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'onBlur' },
    {
      validator: (value: string) => value.length >= 6,
      message: '密码至少6个字符',
      trigger: 'onBlur'
    }
  ]
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return loginForm.username.trim().length > 0 &&
    loginForm.password.length >= 6
})

// 粒子样式
const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 6 + 4
  const delay = Math.random() * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  }
}

// 检测暗色模式
const checkDarkMode = () => {
  if (props.forceDarkMode) {
    isDarkMode.value = true
    return
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true
  } else {
    isDarkMode.value = false
  }
  emit('theme-change', isDarkMode.value)
}

// 监听系统主题变化
let darkModeMediaQuery: MediaQueryList | null = null

onMounted(() => {
  checkDarkMode()

  if (window.matchMedia) {
    darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addEventListener('change', checkDarkMode)
  }
})

onUnmounted(() => {
  if (darkModeMediaQuery) {
    darkModeMediaQuery.removeEventListener('change', checkDarkMode)
  }
})

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  emit('theme-change', isDarkMode.value)
}

// 处理登录
const handleLogin = async () => {
  try {
    loading.value = true

    const credentials = {
      username: loginForm.username.trim(),
      password: loginForm.password
    }

    // 调用auth store的登录方法
    const result = await authStore.login(credentials)

    // 登录成功
    emit('login-success', result)
    showNotify({
      type: 'success',
      message: '登录成功',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })

    // 自动重定向
    if (props.autoRedirect) {
      setTimeout(() => {
        router.push(props.redirectUrl)
      }, 1000)
    }
  } catch (error) {
    console.error('登录失败:', error)
    emit('login-failed', error as Error)
    showNotify({
      type: 'danger',
      message: '登录失败，请检查用户名和密码',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    loading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  emit('forgot-password')
  router.push('/auth/forgot-password')
}

// 处理注册
const handleRegister = () => {
  emit('register-click')
  router.push('/auth/register')
}

// 清空表单
const clearForm = () => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.rememberMe = false
}

// 暴露方法给父组件
defineExpose({
  focus: () => {
    const firstField = document.querySelector('.modern-input input') as HTMLInputElement
    firstField?.focus()
  },
  clear: clearForm,
  toggleTheme,
  validate: () => loginFormRef.value?.validate()
})
</script>

<style scoped lang="scss">
// 科技蓝主题色系
:root {
  // 主色系 - 科技蓝
  --tech-blue-50: #E3F2FD;
  --tech-blue-100: #BBDEFB;
  --tech-blue-200: #90CAF9;
  --tech-blue-300: #64B5F6;
  --tech-blue-400: #42A5F5;
  --tech-blue-500: #2196F3;
  --tech-blue-600: #1E88E5;
  --tech-blue-700: #1976D2;
  --tech-blue-800: #1565C0;
  --tech-blue-900: #0D47A1;

  // 渐变色彩
  --gradient-primary: linear-gradient(135deg, var(--tech-blue-500) 0%, var(--tech-blue-700) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--tech-blue-400) 0%, var(--tech-blue-600) 100%);

  // 中性色
  --tech-gray-50: #FAFAFA;
  --tech-gray-100: #F5F5F5;
  --tech-gray-200: #EEEEEE;
  --tech-gray-300: #E0E0E0;
  --tech-gray-400: #BDBDBD;
  --tech-gray-500: #9E9E9E;
  --tech-gray-600: #757575;
  --tech-gray-700: #616161;
  --tech-gray-800: #424242;
  --tech-gray-900: #212121;

  // 文字色彩
  --tech-text-primary: #3f68ef;
  --tech-text-secondary: var(--tech-gray-600);
  --tech-text-tertiary: var(--tech-gray-500);

  // 背景色彩
  --tech-bg-primary: #FFFFFF;
  --tech-bg-secondary: var(--tech-gray-50);
  --tech-bg-tertiary: var(--tech-gray-100);

  // 边框色彩
  --tech-border-light: var(--tech-gray-200);
  --tech-border-medium: var(--tech-gray-300);
}

// 暗色模式色彩系统
.sdkwork-auth-login.dark-mode {
  --tech-text-primary: #466ff4;
  --tech-text-secondary: #E0E0E0;
  --tech-text-tertiary: #B0B0B0;

  --tech-bg-primary: var(--tech-gray-900);
  --tech-bg-secondary: var(--tech-gray-700);
  --tech-bg-tertiary: var(--tech-gray-600);

  --tech-border-light: var(--tech-gray-600);
  --tech-border-medium: var(--tech-gray-500);
}

.sdkwork-auth-login {
  min-height: 100dvh;
  position: relative;
  background: var(--gradient-primary);
  overflow: hidden;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

  // 科技背景
  .tech-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;

    .tech-grid-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.4;
    }

    .tech-particles-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: floatParticle infinite linear;
      }
    }

    .tech-glow-effect {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      filter: blur(100px);
      animation: pulseGlow 8s ease-in-out infinite;
    }
  }

  // 主容器布局
  .login-main-container {
    position: relative;
    z-index: 1;
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 0;
  }

  // 品牌展示区
  .brand-section {
    padding: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);

    .brand-content {
      text-align: center;
      max-width: 400px;

      .brand-logo-animated {
        margin-bottom: 60px;

        .logo-icon {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 30px;

          .brain-icon {
            width: 100%;
            height: 100%;
            color: #FFFFFF;
            filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
            animation: floatLogo 6s ease-in-out infinite;
          }

          .logo-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            filter: blur(20px);
            animation: pulseLogo 4s ease-in-out infinite;
          }
        }

        .brand-title-main {
          font-size: 48px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .brand-subtitle-main {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      }

      .tech-features {
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 500;

          .feature-icon {
            width: 20px;
            height: 20px;
            color: var(--tech-blue-300);
          }
        }
      }
    }
  }

  // 表单区域
  .form-section {
    padding: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--tech-bg-primary);

    .form-container {
      width: 100%;
      max-width: 400px;

      .form-header {
        margin-bottom: 40px;
        text-align: center;

        .form-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--tech-text-primary);
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }

        .form-subtitle {
          font-size: 16px;
          color: var(--tech-text-secondary);
          margin: 0;
        }
      }

      .modern-login-form {
        .input-group {
          position: relative;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          background: var(--tech-bg-secondary);
          border: 1px solid var(--tech-border-light);
          border-radius: 12px;
          transition: all 0.3s ease;

          &:focus-within {
            border-color: var(--tech-blue-500);
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
          }

          .input-icon {
            padding: 0 16px;
            display: flex;
            align-items: center;

            .input-icon-svg {
              width: 20px;
              height: 20px;
              color: var(--tech-text-tertiary);
            }
          }

          .modern-input {
            flex: 1;

            :deep(.van-field__body) {
              input {
                background: transparent;
                border: none;
                padding: 16px 16px 16px 0;
                font-size: 16px;
                color: var(--tech-text-primary);

                &::placeholder {
                  color: var(--tech-text-tertiary);
                }

                &:focus {
                  outline: none;
                }
              }
            }

            :deep(.van-field__button) {
              .password-toggle {
                padding: 0 16px;
                cursor: pointer;
                display: flex;
                align-items: center;

                .toggle-icon {
                  width: 20px;
                  height: 20px;
                  color: var(--tech-text-tertiary);
                  transition: color 0.3s ease;

                  &:hover {
                    color: var(--tech-blue-500);
                  }
                }
              }
            }
          }
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 24px 0 32px;

          .modern-checkbox {
            :deep(.van-checkbox__label) {
              color: var(--tech-text-secondary);
              font-size: 14px;
            }

            :deep(.van-checkbox__icon) {
              border-color: var(--tech-border-medium);
              background: var(--tech-bg-primary);

              .van-icon {
                color: var(--tech-blue-500);
              }
            }
          }

          .forgot-password-link {
            :deep(.van-button) {
              background: transparent;
              border: none;
              color: var(--tech-blue-500);
              font-size: 14px;
              font-weight: 600;
              padding: 0;

              &:hover {
                color: var(--tech-blue-600);
                text-decoration: underline;
              }
            }
          }
        }

        .form-actions {
          .modern-login-button {
            :deep(.van-button) {
              background: var(--tech-blue-600);
              border: none;
              border-radius: 12px;
              height: 56px;
              font-size: 16px;
              font-weight: 700;
              box-shadow: 0 8px 24px rgba(33, 150, 243, 0.4);
              transition: all 0.3s ease;

              &:hover:not(:disabled) {
                background: var(--tech-blue-700);
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(33, 150, 243, 0.5);
              }

              &:active:not(:disabled) {
                transform: translateY(0);
              }

              .button-content {
                display: flex;
                align-items: center;
                gap: 8px;

                .button-icon {
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }
        }
      }

      .register-section {
        margin-top: 40px;

        .register-divider {
          position: relative;
          text-align: center;
          margin-bottom: 24px;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--tech-border-light);
          }

          .divider-text {
            background: var(--tech-bg-primary);
            padding: 0 16px;
            color: var(--tech-text-secondary);
            font-size: 14px;
            position: relative;
            z-index: 1;
          }
        }

        .register-button {
          :deep(.van-button) {
            background: var(--tech-bg-secondary);
            border: 2px solid var(--tech-border-light);
            border-radius: 12px;
            height: 56px;
            font-size: 16px;
            font-weight: 600;
            color: var(--tech-text-primary);
            transition: all 0.3s ease;

            &:hover {
              border-color: var(--tech-blue-500);
              background: var(--tech-bg-tertiary);
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
            }

            &:active {
              transform: translateY(0);
            }

            .register-icon {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}

// 暗色模式适配
.sdkwork-auth-login.dark-mode {
  .brand-section {
    background: rgba(0, 0, 0, 0.2);
  }

  .form-section {
    background: var(--tech-bg-primary);
  }
}

// 动画定义
@keyframes floatParticle {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

@keyframes pulseGlow {

  0%,
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes floatLogo {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulseLogo {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .sdkwork-auth-login {
    .login-main-container {
      grid-template-columns: 1fr;
    }

    .brand-section {
      display: none;
    }

    .form-section {
      padding: 40px 24px;
    }
  }
}

@media (max-width: 768px) {
  .sdkwork-auth-login {
    .form-section {
      padding: 32px 20px;

      .form-container {
        .theme-switch-container {
          margin-bottom: 32px;
        }

        .form-header {
          margin-bottom: 32px;

          .form-title {
            font-size: 28px;
          }
        }

        .modern-login-form {
          .input-group {
            margin-bottom: 20px;

            .modern-input {
              :deep(.van-field__body) {
                input {
                  padding: 14px 14px 14px 0;
                  font-size: 15px;
                }
              }
            }
          }

          .form-actions {
            .modern-login-button {
              :deep(.van-button) {
                height: 56px;
                font-size: 15px;
                border-radius: 12px;
              }
            }
          }

          .register-section {
            .register-button {
              :deep(.van-button) {
                height: 56px;
                font-size: 15px;
                border-radius: 12px;
              }
            }
          }
        }
      }
    }
  }
}

// 紧凑模式
.sdkwork-auth-login.compact-mode {
  .login-main-container {
    grid-template-columns: 1fr;
  }

  .brand-section {
    display: none;
  }

  .form-section {
    padding: 40px;

    .form-container {
      max-width: 360px;
    }
  }
}
</style>