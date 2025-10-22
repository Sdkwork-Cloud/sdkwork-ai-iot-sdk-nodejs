<template>
  <div class="sdkwork-auth-login" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 科技感动态背景 -->
    <div class="tech-background">
      <div class="tech-grid"></div>
      <div class="tech-glow"></div>
    </div>
    
    <!-- 顶部品牌区域 - 提取到容器外部 -->
    <div class="brand-header">
      <div class="brand-container">
        <div class="brand-logo">
          <Icon icon="ph:cube" class="brand-icon" />
          <h1 class="brand-title">SDKWork</h1>
        </div>
        <p class="brand-subtitle">AIoT 智能平台</p>
      </div>
    </div>
    
    <!-- 精简登录表单容器 -->
    <div class="login-container">
      
      <!-- 科技感登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 用户名输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <Icon icon="ph:user" class="input-icon" />
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="用户名或邮箱"
              class="tech-input"
              :class="{ error: errors.username }"
              @blur="validateField('username')"
            />
          </div>
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </div>

        <!-- 密码输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <Icon icon="ph:lock" class="input-icon" />
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="密码"
              class="tech-input"
              :class="{ error: errors.password }"
              @blur="validateField('password')"
            />
            <Icon 
              :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" 
              class="password-toggle"
              @click="showPassword = !showPassword"
            />
          </div>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <!-- 选项区域 -->
        <div class="form-options">
          <label class="remember-checkbox">
            <input 
              v-model="loginForm.rememberMe" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">记住我</span>
          </label>
          <a class="forgot-password" @click="handleForgotPassword">
            忘记密码？
          </a>
        </div>

        <!-- 登录按钮 -->
        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="tech-login-button"
            :class="{ loading: loading }"
          >
            <Icon v-if="loading" icon="ph:spinner" class="loading-icon" />
            <span class="button-text">{{ loading ? '登录中...' : '登录' }}</span>
          </button>
        </div>
      </form>

      <!-- 注册链接 -->
      <div class="register-link">
        <span>还没有账户？</span>
        <a class="register-text" @click="handleRegister">
          立即注册
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'
import { Icon } from '@iconify/vue'

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  username?: string
  password?: string
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
const errors = reactive<FormErrors>({})

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const validationRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱' },
    { minLength: 2, message: '用户名至少2个字符' },
    { pattern: /^[\w.-]+@[\w.-]+\.\w+$|^[\w\u4e00-\u9fa5]{2,20}$/, message: '请输入有效的用户名或邮箱' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少6个字符' },
    { pattern: /^[\w!@#$%^&*()]{6,20}$/, message: '密码格式不正确' }
  ]
}

// 表单验证函数
const validateField = (field: keyof FormErrors) => {
  const value = loginForm[field].trim()
  const rules = validationRules[field]
  
  for (const rule of rules) {
    if (rule.required && !value) {
      errors[field] = rule.message
      return false
    }
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.message
      return false
    }
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message
      return false
    }
  }
  
  delete errors[field]
  return true
}

// 表单整体验证
const validateForm = () => {
  let isValid = true
  Object.keys(validationRules).forEach(field => {
    if (!validateField(field as keyof FormErrors)) {
      isValid = false
    }
  })
  return isValid
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return loginForm.username.trim().length > 0 && 
         loginForm.password.length > 0 && 
         Object.keys(errors).length === 0
})

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

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) {
    showToast({
      message: '请检查表单输入',
      className: isDarkMode.value ? 'dark-toast' : ''
    })
    return
  }

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
    showToast({
      message: '登录成功',
      className: isDarkMode.value ? 'dark-toast' : ''
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
    showToast({
      message: '登录失败，请检查用户名和密码',
      className: isDarkMode.value ? 'dark-toast' : ''
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

// 切换暗色模式
const toggleDarkMode = (dark: boolean) => {
  isDarkMode.value = dark
  emit('theme-change', dark)
}

// 清空表单
const clearForm = () => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.rememberMe = false
  errors.username = undefined
  errors.password = undefined
}

// 暴露方法给父组件
defineExpose({
  focus: () => {
    const usernameInput = document.querySelector('.tech-input') as HTMLInputElement
    usernameInput?.focus()
  },
  clear: clearForm,
  toggleDarkMode,
  validate: validateForm
})
</script>

<style scoped lang="scss">
// 科技蓝主题色系 - 基于 #2B6CB0 构建专业配色方案
:root {
  // 主色系 - 科技蓝 (WCAG AA级对比度标准)
  --tech-blue-50: #EBF8FF;
  --tech-blue-100: #BEE3F8;
  --tech-blue-200: #90CDF4;
  --tech-blue-300: #63B3ED;
  --tech-blue-400: #4299E1;
  --tech-blue-500: #2B6CB0; // 主色
  --tech-blue-600: #2C5282;
  --tech-blue-700: #2A4365;
  --tech-blue-800: #1A365D;
  --tech-blue-900: #153E75;
  
  // 中性灰 - 专业科技感 (优化对比度)
  --tech-gray-50: #F8F9FA;
  --tech-gray-100: #E9ECEF;
  --tech-gray-200: #DEE2E6;
  --tech-gray-300: #CED4DA;
  --tech-gray-400: #ADB5BD;
  --tech-gray-500: #6C757D;
  --tech-gray-600: #495057;
  --tech-gray-700: #343A40;
  --tech-gray-800: #212529;
  --tech-gray-900: #121416;
  
  // 文字色彩系统 - 确保WCAG AA级对比度
  --tech-text-primary: var(--tech-gray-900);
  --tech-text-secondary: var(--tech-gray-600);
  --tech-text-tertiary: var(--tech-gray-500);
  --tech-text-disabled: var(--tech-gray-400);
  
  // 背景色彩系统
  --tech-bg-primary: #FFFFFF;
  --tech-bg-secondary: var(--tech-gray-50);
  --tech-bg-tertiary: var(--tech-gray-100);
  
  // 边框色彩系统
  --tech-border-light: var(--tech-gray-200);
  --tech-border-medium: var(--tech-gray-300);
  --tech-border-dark: var(--tech-gray-400);
  
  // 功能色
  --tech-success: #198754;
  --tech-warning: #FFC107;
  --tech-error: #DC3545;
  --tech-info: #0D6EFD;
}

// 暗色模式色彩系统 - 全面优化对比度
.sdkwork-auth-login.dark-mode {
  // 文字色彩系统 - 暗色模式 (确保WCAG AA级对比度)
  --tech-text-primary: #FFFFFF;
  --tech-text-secondary: #E9ECEF;
  --tech-text-tertiary: #ADB5BD;
  --tech-text-disabled: #6C757D;
  
  // 背景色彩系统 - 暗色模式
  --tech-bg-primary: var(--tech-gray-900);
  --tech-bg-secondary: var(--tech-gray-800);
  --tech-bg-tertiary: var(--tech-gray-700);
  
  // 边框色彩系统 - 暗色模式
  --tech-border-light: var(--tech-gray-700);
  --tech-border-medium: var(--tech-gray-600);
  --tech-border-dark: var(--tech-gray-500);
}

.sdkwork-auth-login {
  min-height: 100dvh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--tech-blue-500) 0%, var(--tech-blue-700) 100%);
  transition: all 0.3s ease;

  // 科技感背景
  .tech-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 0;

    .tech-grid {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 32px 32px;
      opacity: 0.3;
    }

    .tech-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(43, 108, 176, 0.15) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      filter: blur(80px);
      animation: pulse 8s ease-in-out infinite;
    }
  }

  // 顶部品牌区域
  .brand-header {
    position: relative;
    z-index: 2;
    margin-bottom: 40px;
    text-align: center;

    .brand-container {
      .brand-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 12px;

        .brand-icon {
          width: 48px;
          height: 48px;
          color: #FFFFFF;
          filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3));
          transition: all 0.3s ease;
        }

        &:hover .brand-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 6px 16px rgba(255, 255, 255, 0.4));
        }
      }

      .brand-title {
        font-size: 36px;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .brand-subtitle {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .login-container {
    position: relative;
    z-index: 1;
    background: var(--tech-bg-primary);
    border-radius: 20px;
    padding: 40px 32px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    .login-form {
      .input-group {
        margin-bottom: 24px;

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--tech-bg-secondary);
          border: 1px solid var(--tech-blue-400);
          border-radius: 12px;
          transition: all 0.3s ease;
          padding: 0 16px;
          height: 52px;

          &:hover {
            border-color: var(--tech-blue-500);
            background: var(--tech-bg-tertiary);
          }

          &:focus-within {
            border-color: var(--tech-blue-500);
            box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.15);
            background: var(--tech-bg-primary);
          }

          .input-icon {
            width: 20px;
            height: 20px;
            color: var(--tech-text-tertiary);
            margin-right: 12px;
            transition: color 0.3s ease;
          }

          .tech-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 16px;
            font-weight: 500;
            color: var(--tech-text-primary);
            line-height: 1.5;

            &::placeholder {
              color: var(--tech-text-tertiary);
              font-weight: 400;
            }

            &.error {
              color: var(--tech-error);
            }
          }

          .password-toggle {
            width: 20px;
            height: 20px;
            color: var(--tech-text-tertiary);
            cursor: pointer;
            transition: color 0.3s ease;
            margin-left: 12px;

            &:hover {
              color: var(--tech-blue-500);
            }
          }
        }

        .error-message {
          font-size: 12px;
          color: var(--tech-error);
          margin-top: 8px;
          margin-left: 16px;
          font-weight: 500;
        }
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px 0;
        font-size: 14px;

        .remember-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;

          .checkbox-input {
            display: none;

            &:checked + .checkbox-custom {
              background: var(--tech-blue-500);
              border-color: var(--tech-blue-500);

              &::after {
                opacity: 1;
              }
            }
          }

          .checkbox-custom {
            width: 18px;
            height: 18px;
            border: 2px solid var(--tech-blue-400);
            border-radius: 4px;
            background: var(--tech-bg-primary);
            position: relative;
            transition: all 0.3s ease;

            &::after {
              content: '';
              position: absolute;
              left: 4px;
              top: 1px;
              width: 6px;
              height: 10px;
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
              opacity: 0;
              transition: opacity 0.3s ease;
            }
          }

          .checkbox-label {
            color: var(--tech-text-secondary);
            font-weight: 500;
            user-select: none;
          }
        }

        .forgot-password {
          color: var(--tech-blue-500);
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 6px 12px;
          border-radius: 6px;

          &:hover {
            color: var(--tech-blue-600);
            background: rgba(43, 108, 176, 0.1);
            text-decoration: none;
          }
        }
      }

      .form-actions {
        margin-top: 32px;

        .tech-login-button {
          width: 100%;
          height: 56px;
          background: linear-gradient(135deg, var(--tech-blue-500) 0%, var(--tech-blue-400) 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 16px rgba(43, 108, 176, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 16px 32px rgba(43, 108, 176, 0.5);
            background: linear-gradient(135deg, var(--tech-blue-400) 0%, var(--tech-blue-500) 100%);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 4px 8px rgba(43, 108, 176, 0.3);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            background: var(--tech-gray-400);
            box-shadow: none;
          }

          &.loading {
            pointer-events: none;
          }

          .loading-icon {
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }

          .button-text {
            font-weight: 600;
          }
        }
      }
    }

    .register-link {
      text-align: center;
      margin-top: 32px;
      font-size: 14px;
      color: var(--tech-text-secondary);

      .register-text {
        color: var(--tech-blue-500);
        text-decoration: none;
        margin-left: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 6px 12px;
        border-radius: 6px;

        &:hover {
          color: var(--tech-blue-600);
          background: rgba(43, 108, 176, 0.1);
          text-decoration: none;
        }
      }
    }
  }
}

// 暗色模式 - 全面优化对比度和科技蓝主题
.sdkwork-auth-login.dark-mode {
  background: linear-gradient(135deg, var(--tech-gray-900) 0%, var(--tech-gray-800) 100%);

  .tech-background {
    .tech-grid {
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      opacity: 0.4;
    }

    .tech-glow {
      background: radial-gradient(circle, rgba(43, 108, 176, 0.2) 0%, transparent 70%);
      filter: blur(100px);
    }
  }

  // 顶部品牌区域 - 暗色模式
  .brand-header {
    .brand-container {
      .brand-logo {
        .brand-icon {
          color: #FFFFFF;
          filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.2));
        }
      }

      .brand-title {
        color: #FFFFFF;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .brand-subtitle {
        color: rgba(255, 255, 255, 0.85);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .login-container {
    background: var(--tech-bg-primary);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);

    .login-form {
      .input-group {
        .input-wrapper {
          background: var(--tech-bg-secondary);
          border-color: var(--tech-border-light);

          &:hover {
            border-color: var(--tech-blue-400);
            background: var(--tech-bg-tertiary);
          }

          &:focus-within {
            border-color: var(--tech-blue-500);
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
            background: var(--tech-bg-primary);
          }

          .input-icon {
            color: var(--tech-text-tertiary);
          }

          .tech-input {
            color: var(--tech-text-primary);

            &::placeholder {
              color: var(--tech-text-tertiary);
            }
          }

          .password-toggle {
            color: var(--tech-text-tertiary);

            &:hover {
              color: var(--tech-blue-400);
            }
          }
        }
      }

      .form-options {
        .remember-checkbox {
          .checkbox-custom {
            border-color: var(--tech-border-medium);
            background: var(--tech-bg-secondary);
          }

          .checkbox-label {
            color: var(--tech-text-secondary);
          }
        }

        .forgot-password {
          color: var(--tech-blue-400);

          &:hover {
            color: var(--tech-blue-300);
            background: rgba(66, 153, 225, 0.15);
          }
        }
      }

      .form-actions {
        .tech-login-button {
          background: linear-gradient(135deg, var(--tech-blue-500) 0%, var(--tech-blue-400) 100%);

          &:hover:not(:disabled) {
            box-shadow: 0 12px 24px rgba(66, 153, 225, 0.3);
          }
        }
      }
    }

    .register-link {
      color: var(--tech-text-secondary);

      .register-text {
        color: var(--tech-blue-400);

        &:hover {
          color: var(--tech-blue-300);
          background: rgba(66, 153, 225, 0.15);
        }
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 响应式布局方案
@media (max-width: 768px) {
  .sdkwork-auth-login {
    padding: 16px;
    min-height: 100dvh;

    .brand-header {
      margin-bottom: 32px;

      .brand-container {
        .brand-logo {
          .brand-icon {
            width: 40px;
            height: 40px;
          }
        }

        .brand-title {
          font-size: 32px;
        }

        .brand-subtitle {
          font-size: 14px;
        }
      }
    }

    .login-container {
      padding: 32px 24px;
      max-width: 100%;
      border-radius: 16px;

      .login-form {
        .input-group {
          margin-bottom: 20px;

          .input-wrapper {
            height: 48px;
            padding: 0 14px;

            .input-icon {
              width: 18px;
              height: 18px;
              margin-right: 10px;
            }

            .tech-input {
              font-size: 15px;
            }

            .password-toggle {
              width: 18px;
              height: 18px;
            }
          }
        }

        .form-options {
          margin: 20px 0;
          font-size: 13px;
        }

        .form-actions {
          margin-top: 28px;

          .tech-login-button {
            height: 52px;
            font-size: 15px;
          }
        }
      }

      .register-link {
        margin-top: 28px;
        font-size: 13px;
      }
    }
  }
}

// 超小屏幕适配
@media (max-width: 480px) {
  .sdkwork-auth-login {
    padding: 12px;

    .brand-header {
      margin-bottom: 24px;

      .brand-container {
        .brand-logo {
          .brand-icon {
            width: 36px;
            height: 36px;
          }
        }

        .brand-title {
          font-size: 28px;
        }

        .brand-subtitle {
          font-size: 13px;
        }
      }
    }

    .login-container {
      padding: 24px 20px;
      border-radius: 12px;

      .login-form {
        .input-group {
          .input-wrapper {
            height: 44px;
            padding: 0 12px;
          }
        }

        .form-actions {
          .tech-login-button {
            height: 48px;
          }
        }
      }
    }
  }
}

// 紧凑模式
.sdkwork-auth-login.compact-mode {
  .brand-header {
    margin-bottom: 32px;

    .brand-container {
      .brand-logo {
        .brand-icon {
          width: 40px;
          height: 40px;
        }
      }

      .brand-title {
        font-size: 32px;
      }

      .brand-subtitle {
        font-size: 14px;
      }
    }
  }

  .login-container {
    padding: 28px 24px;
    max-width: 360px;

    .login-form {
      .input-group {
        margin-bottom: 20px;

        .input-wrapper {
          height: 48px;
        }
      }

      .form-actions {
        margin-top: 24px;

        .tech-login-button {
          height: 48px;
        }
      }
    }
  }
}

// 暗色模式Toast样式
:global(.dark-toast) {
  background: var(--tech-bg-primary) !important;
  color: var(--tech-text-primary) !important;
  border: 1px solid var(--tech-border-light) !important;
}
</style>