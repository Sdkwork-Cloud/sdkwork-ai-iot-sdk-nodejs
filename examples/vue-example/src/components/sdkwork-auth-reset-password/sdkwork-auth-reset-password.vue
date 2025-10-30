<template>
  <div class="sdkwork-auth-reset-password" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 全屏科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid-lines"></div>
      <div class="tech-particles-container">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="tech-glow-effect"></div>
    </div>
    
    <!-- 主容器 -->
    <div class="reset-password-main-container">
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
      
      <!-- 右侧重置密码表单区 -->
      <div class="form-section">
        <div class="form-container">
          
          <!-- 重置密码表单标题 -->
          <div class="form-header">
            <h2 class="form-title">重置密码</h2>
            <p class="form-subtitle">设置新的登录密码</p>
          </div>
          
          <!-- Vant 表单 -->
          <van-form 
            ref="resetPasswordFormRef"
            :model="resetPasswordForm" 
            :rules="formRules"
            @submit="handleResetPassword"
            class="modern-reset-password-form"
          >
            <!-- 当前密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock" class="input-icon-svg" />
              </div>
              <van-field
                v-model="resetPasswordForm.currentPassword"
                name="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="请输入当前密码"
                :rules="formRules.currentPassword"
                :border="false"
                class="modern-input"
              >
                <template #button>
                  <div class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
                    <Icon :icon="showCurrentPassword ? 'ph:eye-slash' : 'ph:eye'" class="toggle-icon" />
                  </div>
                </template>
              </van-field>
            </div>
            
            <!-- 新密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock-key" class="input-icon-svg" />
              </div>
              <van-field
                v-model="resetPasswordForm.newPassword"
                name="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="请输入新密码"
                :rules="formRules.newPassword"
                :border="false"
                class="modern-input"
              >
                <template #button>
                  <div class="password-toggle" @click="showNewPassword = !showNewPassword">
                    <Icon :icon="showNewPassword ? 'ph:eye-slash' : 'ph:eye'" class="toggle-icon" />
                  </div>
                </template>
              </van-field>
            </div>
            
            <!-- 确认新密码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:lock-key" class="input-icon-svg" />
              </div>
              <van-field
                v-model="resetPasswordForm.confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="请确认新密码"
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
            
            <!-- 重置按钮 -->
            <div class="form-actions">
              <van-button
                round
                block
                type="primary"
                native-type="submit"
                :loading="loading"
                :disabled="!isFormValid"
                loading-text="重置中..."
                class="modern-reset-button"
              >
                <template #loading>
                  <van-loading type="spinner" size="20px" />
                </template>
                <span class="button-content">
                  <Icon icon="ph:key" class="button-icon" />
                  <span>重置密码</span>
                </span>
              </van-button>
            </div>
          </van-form>
          
          <!-- 返回链接 -->
          <div class="back-section">
            <van-button 
              type="default" 
              size="large" 
              @click="handleBack"
              class="back-button"
            >
              <Icon icon="ph:arrow-left" class="back-icon" />
              <span>返回</span>
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
  Loading as VanLoading
} from 'vant'

interface ResetPasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Props {
  redirectUrl?: string
  autoRedirect?: boolean
  forceDarkMode?: boolean
  compactMode?: boolean
  requireCurrentPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  redirectUrl: '/',
  autoRedirect: true,
  forceDarkMode: false,
  compactMode: false,
  requireCurrentPassword: true
})

interface Emits {
  'reset-success': []
  'reset-failed': [error: Error]
  'back-click': []
  'theme-change': [isDark: boolean]
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const isDarkMode = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const resetPasswordFormRef = ref()

const resetPasswordForm = reactive<ResetPasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 特性列表
const features = [
  '账户安全保护',
  '定期更新密码',
  '强密码策略',
  '安全提醒'
]

// Vant Form 验证规则
const formRules = {
  currentPassword: [
    { 
      required: props.requireCurrentPassword, 
      message: '请输入当前密码', 
      trigger: 'onBlur' 
    },
    { 
      validator: (value: string) => !props.requireCurrentPassword || value.length >= 6, 
      message: '密码至少6个字符', 
      trigger: 'onBlur' 
    }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'onBlur' },
    { 
      validator: (value: string) => value.length >= 6, 
      message: '密码至少6个字符', 
      trigger: 'onBlur' 
    },
    { 
      validator: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value), 
      message: '密码需包含大小写字母和数字', 
      trigger: 'onBlur' 
    },
    { 
      validator: (value: string) => value !== resetPasswordForm.currentPassword, 
      message: '新密码不能与当前密码相同', 
      trigger: 'onBlur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'onBlur' },
    { 
      validator: (value: string) => value === resetPasswordForm.newPassword, 
      message: '两次输入的密码不一致', 
      trigger: 'onBlur' 
    }
  ]
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  const currentValid = !props.requireCurrentPassword || 
                       (resetPasswordForm.currentPassword.length >= 6)
  const newValid = resetPasswordForm.newPassword.length >= 6 &&
                   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(resetPasswordForm.newPassword) &&
                   resetPasswordForm.newPassword !== resetPasswordForm.currentPassword
  const confirmValid = resetPasswordForm.confirmPassword === resetPasswordForm.newPassword
  
  return currentValid && newValid && confirmValid
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

// 处理重置密码
const handleResetPassword = async () => {
  try {
    loading.value = true
    
    const request = {
      currentPassword: props.requireCurrentPassword ? resetPasswordForm.currentPassword : undefined,
      newPassword: resetPasswordForm.newPassword,
      confirmPassword: resetPasswordForm.confirmPassword
    }

    // 调用auth store的重置密码方法
    const result = await authStore.changePassword(request)
    
    // 重置成功
    emit('reset-success')
    showNotify({
      type: 'success',
      message: '密码重置成功',
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
    console.error('重置密码失败:', error)
    emit('reset-failed', error as Error)
    showNotify({
      type: 'danger',
      message: '重置密码失败，请检查输入信息',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    loading.value = false
  }
}

// 处理返回
const handleBack = () => {
  emit('back-click')
  router.back()
}

// 清空表单
const clearForm = () => {
  resetPasswordForm.currentPassword = ''
  resetPasswordForm.newPassword = ''
  resetPasswordForm.confirmPassword = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// 暴露方法给父组件
defineExpose({
  focus: () => {
    const firstField = document.querySelector('.modern-input input') as HTMLInputElement
    firstField?.focus()
  },
  clear: clearForm,
  validate: () => resetPasswordFormRef.value?.validate()
})
</script>

<style scoped lang="scss">
// 复用登录组件的样式系统
.sdkwork-auth-reset-password {
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
  .reset-password-main-container {
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

      .modern-reset-password-form {
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

        .form-actions {
          margin-top: 32px;

          .modern-reset-button {
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

      .back-section {
        margin-top: 24px;

        .back-button {
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

            .back-icon {
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
.sdkwork-auth-reset-password.dark-mode {
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
  .sdkwork-auth-reset-password {
    .reset-password-main-container {
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
  .sdkwork-auth-reset-password {
    .form-section {
      padding: 32px 20px;

      .form-container {
        .form-header {
          margin-bottom: 32px;

          .form-title {
            font-size: 28px;
          }
        }

        .modern-reset-password-form {
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
            .modern-reset-button {
              :deep(.van-button) {
                height: 56px;
                font-size: 15px;
                border-radius: 12px;
              }
            }
          }

          .back-section {
            .back-button {
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
.sdkwork-auth-reset-password.compact-mode {
  .reset-password-main-container {
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