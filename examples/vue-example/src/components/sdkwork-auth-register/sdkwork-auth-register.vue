<template>
  <div class="sdkwork-auth-register" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 全屏科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid-lines"></div>
      <div class="tech-particles-container">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="tech-glow-effect"></div>
    </div>
    
    <!-- 主容器 -->
    <div class="register-main-container">
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
      
      <!-- 右侧注册表单区 -->
      <div class="form-section">
        <div class="form-container">
          
          <!-- 注册表单标题 -->
          <div class="form-header">
            <h2 class="form-title">创建账户</h2>
            <p class="form-subtitle">加入AIoT智能平台</p>
          </div>
          
          <!-- Vant 表单 -->
          <van-form 
            ref="registerFormRef"
            :model="registerForm" 
            :rules="formRules"
            @submit="handleRegister"
            class="modern-register-form"
          >
            <!-- 用户名输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:user" class="input-icon-svg" />
              </div>
              <van-field
                v-model="registerForm.username"
                name="username"
                placeholder="用户名"
                :rules="formRules.username"
                :border="false"
                class="modern-input"
              />
            </div>
            
            <!-- 邮箱输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:envelope" class="input-icon-svg" />
              </div>
              <van-field
                v-model="registerForm.email"
                name="email"
                placeholder="邮箱地址"
                :rules="formRules.email"
                :border="false"
                class="modern-input"
              />
            </div>
            
            <!-- 手机号输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:phone" class="input-icon-svg" />
              </div>
              <van-field
                v-model="registerForm.phone"
                name="phone"
                placeholder="手机号（可选）"
                :rules="formRules.phone"
                :border="false"
                class="modern-input"
              />
            </div>
            
            <!-- 密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock" class="input-icon-svg" />
              </div>
              <van-field
                v-model="registerForm.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="密码"
                :rules="formRules.password"
                :border="false"
                class="modern-input"
              >
                <template #button>
                  <div class="password-toggle" @click="showPassword = !showPassword">
                    <Icon :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="toggle-icon" />
                  </div>
                </template>
              </van-field>
            </div>
            
            <!-- 确认密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock-key" class="input-icon-svg" />
              </div>
              <van-field
                v-model="registerForm.confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="确认密码"
                :rules="formRules.confirmPassword"
                :border="false"
                class="modern-input"
              >
                <template #button>
                  <div class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                    <Icon :icon="showConfirmPassword ? 'ph:eye-slash' : 'ph:eye'" class="toggle-icon" />
                  </div>
                </template>
              </van-field>
            </div>
            
            <!-- 协议同意 -->
            <div class="agreement-section">
              <van-checkbox 
                v-model="registerForm.agreed" 
                shape="square"
                class="modern-checkbox"
                :rules="formRules.agreed"
              >
                <span class="checkbox-label">
                  我已阅读并同意
                  <van-button type="default" size="mini" link class="agreement-link">
                    《用户协议》
                  </van-button>
                  和
                  <van-button type="default" size="mini" link class="agreement-link">
                    《隐私政策》
                  </van-button>
                </span>
              </van-checkbox>
            </div>
            
            <!-- 注册按钮 -->
            <div class="form-actions">
              <van-button
                round
                block
                type="primary"
                native-type="submit"
                :loading="loading"
                :disabled="!isFormValid"
                loading-text="注册中..."
                class="modern-register-button"
              >
                <template #loading>
                  <van-loading type="spinner" size="20px" />
                </template>
                <span class="button-content">
                  <Icon icon="ph:user-plus" class="button-icon" />
                  <span>创建账户</span>
                </span>
              </van-button>
            </div>
          </van-form>
          
          <!-- 登录链接 -->
          <div class="login-section">
            <p class="login-text">已有账户？</p>
            <van-button 
              type="default" 
              size="large" 
              @click="handleLogin"
              class="login-button"
            >
              <Icon icon="ph:sign-in" class="login-icon" />
              <span>立即登录</span>
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

interface RegisterForm {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreed: boolean
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
  'register-success': [user: any]
  'register-failed': [error: Error]
  'login-click': []
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
const showConfirmPassword = ref(false)
const registerFormRef = ref()

const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreed: false
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
    { required: true, message: '请输入用户名', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^[\w\u4e00-\u9fa5]{2,20}$/.test(value), 
      message: '用户名2-20位，支持中文、英文、数字', 
      trigger: 'onBlur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^[\w.-]+@[\w.-]+\.\w+$/.test(value), 
      message: '请输入有效的邮箱地址', 
      trigger: 'onBlur' 
    }
  ],
  phone: [
    { 
      validator: (value: string) => !value || /^1[3-9]\d{9}$/.test(value), 
      message: '请输入有效的手机号', 
      trigger: 'onBlur' 
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'onBlur' },
    { 
      validator: (value: string) => value.length >= 6, 
      message: '密码至少6个字符', 
      trigger: 'onBlur' 
    },
    { 
      validator: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value), 
      message: '密码需包含大小写字母和数字', 
      trigger: 'onBlur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'onBlur' },
    { 
      validator: (value: string) => value === registerForm.password, 
      message: '两次输入的密码不一致', 
      trigger: 'onBlur' 
    }
  ],
  agreed: [
    { 
      validator: (value: boolean) => value === true, 
      message: '请同意用户协议和隐私政策', 
      trigger: 'onBlur' 
    }
  ]
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return registerForm.username.trim().length >= 2 && 
         registerForm.email.trim().length > 0 &&
         registerForm.password.length >= 6 &&
         registerForm.confirmPassword === registerForm.password &&
         registerForm.agreed
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

// 处理注册
const handleRegister = async () => {
  try {
    loading.value = true
    
    const registerData = {
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      phone: registerForm.phone.trim(),
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      agreed: registerForm.agreed
    }

    // 调用auth store的注册方法
    const result = await authStore.register(registerData)
    
    // 注册成功
    emit('register-success', result)
    showNotify({
      type: 'success',
      message: '注册成功',
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
    console.error('注册失败:', error)
    emit('register-failed', error as Error)
    showNotify({
      type: 'danger',
      message: '注册失败，请检查输入信息',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    loading.value = false
  }
}

// 处理登录
const handleLogin = () => {
  emit('login-click')
  router.push('/auth/login')
}

// 清空表单
const clearForm = () => {
  registerForm.username = ''
  registerForm.email = ''
  registerForm.phone = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.agreed = false
}

// 暴露方法给父组件
defineExpose({
  focus: () => {
    const firstField = document.querySelector('.modern-input input') as HTMLInputElement
    firstField?.focus()
  },
  clear: clearForm,
  validate: () => registerFormRef.value?.validate()
})
</script>

<style scoped lang="scss">
// 复用登录组件的样式系统
.sdkwork-auth-register {
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
  .register-main-container {
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

      .modern-register-form {
        .input-group {
          position: relative;
          margin-bottom: 20px;
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

        .agreement-section {
          margin: 24px 0 32px;

          .modern-checkbox {
            :deep(.van-checkbox__label) {
              color: var(--tech-text-secondary);
              font-size: 14px;
              line-height: 1.4;
            }

            :deep(.van-checkbox__icon) {
              border-color: var(--tech-border-medium);
              background: var(--tech-bg-primary);

              .van-icon {
                color: var(--tech-blue-500);
              }
            }

            .agreement-link {
              :deep(.van-button) {
                background: transparent;
                border: none;
                color: var(--tech-blue-500);
                font-size: 14px;
                font-weight: 600;
                padding: 0;
                margin: 0 2px;

                &:hover {
                  color: var(--tech-blue-600);
                  text-decoration: underline;
                }
              }
            }
          }
        }

        .form-actions {
          .modern-register-button {
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

      .login-section {
        margin-top: 40px;
        text-align: center;

        .login-text {
          color: var(--tech-text-secondary);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .login-button {
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

            .login-icon {
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
.sdkwork-auth-register.dark-mode {
  .brand-section {
    background: rgba(0, 0, 0, 0.2);
  }

  .form-section {
    background: var(--tech-bg-primary);
  }
}

// 动画定义（复用登录组件的动画）
@keyframes floatParticle {
  0%, 100% {
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
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes floatLogo {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulseLogo {
  0%, 100% {
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
  .sdkwork-auth-register {
    .register-main-container {
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
  .sdkwork-auth-register {
    .form-section {
      padding: 32px 20px;

      .form-container {
        .form-header {
          margin-bottom: 32px;

          .form-title {
            font-size: 28px;
          }
        }

        .modern-register-form {
          .input-group {
            margin-bottom: 16px;

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
            .modern-register-button {
              :deep(.van-button) {
                height: 56px;
                font-size: 15px;
                border-radius: 12px;
              }
            }
          }

          .login-section {
            .login-button {
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
.sdkwork-auth-register.compact-mode {
  .register-main-container {
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