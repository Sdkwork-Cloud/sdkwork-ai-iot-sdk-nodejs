<template>
  <div class="sdkwork-auth-bind-mobile" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 全屏科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid-lines"></div>
      <div class="tech-particles-container">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="tech-glow-effect"></div>
    </div>
    
    <!-- 主容器 -->
    <div class="bind-mobile-main-container">
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
      
      <!-- 右侧绑定手机号表单区 -->
      <div class="form-section">
        <div class="form-container">
          
          <!-- 绑定手机号表单标题 -->
          <div class="form-header">
            <h2 class="form-title">绑定手机号</h2>
            <p class="form-subtitle">增强账户安全性</p>
          </div>
          
          <!-- Vant 表单 -->
          <van-form 
            ref="bindMobileFormRef"
            :model="bindMobileForm" 
            :rules="formRules"
            @submit="handleBindMobile"
            class="modern-bind-mobile-form"
          >
            <!-- 手机号输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:phone" class="input-icon-svg" />
              </div>
              <van-field
                v-model="bindMobileForm.phone"
                name="phone"
                placeholder="请输入手机号"
                :rules="formRules.phone"
                :border="false"
                class="modern-input"
              />
            </div>
            
            <!-- 验证码输入 -->
            <div class="input-group">
              <div class="input-icon">
                <Icon icon="ph:key" class="input-icon-svg" />
              </div>
              <van-field
                v-model="bindMobileForm.verificationCode"
                name="verificationCode"
                placeholder="请输入6位验证码"
                :rules="formRules.verificationCode"
                :border="false"
                class="modern-input"
              >
                <template #button>
                  <van-button 
                    size="small" 
                    type="primary" 
                    :disabled="countdown > 0"
                    @click="handleSendCode"
                    class="send-code-button"
                  >
                    {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
                  </van-button>
                </template>
              </van-field>
            </div>
            
            <!-- 绑定按钮 -->
            <div class="form-actions">
              <van-button
                round
                block
                type="primary"
                native-type="submit"
                :loading="loading"
                :disabled="!isFormValid"
                loading-text="绑定中..."
                class="modern-bind-button"
              >
                <template #loading>
                  <van-loading type="spinner" size="20px" />
                </template>
                <span class="button-content">
                  <Icon icon="ph:device-mobile" class="button-icon" />
                  <span>绑定手机号</span>
                </span>
              </van-button>
            </div>
          </van-form>
          
          <!-- 跳过链接 -->
          <div class="skip-section">
            <van-button 
              type="default" 
              size="large" 
              @click="handleSkip"
              class="skip-button"
            >
              <Icon icon="ph:arrow-right" class="skip-icon" />
              <span>暂不绑定</span>
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

interface BindMobileForm {
  phone: string
  verificationCode: string
}

interface Props {
  redirectUrl?: string
  autoRedirect?: boolean
  forceDarkMode?: boolean
  compactMode?: boolean
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  redirectUrl: '/',
  autoRedirect: true,
  forceDarkMode: false,
  compactMode: false,
  userId: ''
})

interface Emits {
  'bind-success': [phone: string]
  'bind-failed': [error: Error]
  'skip-click': []
  'theme-change': [isDark: boolean]
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const isDarkMode = ref(false)
const countdown = ref(0)
const bindMobileFormRef = ref()

const bindMobileForm = reactive<BindMobileForm>({
  phone: '',
  verificationCode: ''
})

// 特性列表
const features = [
  '账户安全保护',
  '快速登录',
  '密码找回',
  '消息通知'
]

// Vant Form 验证规则
const formRules:any = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^1[3-9]\d{9}$/.test(value), 
      message: '请输入有效的手机号', 
      trigger: 'onBlur' 
    }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^\d{6}$/.test(value), 
      message: '请输入6位数字验证码', 
      trigger: 'onBlur' 
    }
  ]
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(bindMobileForm.phone) && 
         /^\d{6}$/.test(bindMobileForm.verificationCode)
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
  clearInterval(countdownInterval)
})

// 倒计时处理
let countdownInterval: any = null

const startCountdown = () => {
  countdown.value = 60
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownInterval!)
    }
  }, 1000)
}

// 发送验证码
const handleSendCode = async () => {
  if (countdown.value > 0) return
  
  try {
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(bindMobileForm.phone)) {
      showNotify({
        type: 'warning',
        message: '请输入有效的手机号',
        background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
        color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
      })
      return
    }

    // 这里应该调用发送验证码的API
    // await authStore.sendVerificationCode({
    //   phone: bindMobileForm.phone,
    //   type: 'bind_mobile'
    // })

    showNotify({
      type: 'success',
      message: '验证码已发送',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
    
    // 开始倒计时
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
    showNotify({
      type: 'danger',
      message: '发送验证码失败，请重试',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  }
}

// 处理绑定手机号
const handleBindMobile = async () => {
  try {
    loading.value = true
    
    const request = {
      phone: bindMobileForm.phone.trim(),
      verificationCode: bindMobileForm.verificationCode,
      userId: props.userId
    }

    // 调用auth store的绑定手机号方法
    const result = await authStore.bindMobile(request)
    
    // 绑定成功
    emit('bind-success', result.phone || bindMobileForm.phone)
    showNotify({
      type: 'success',
      message: '手机号绑定成功',
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
    console.error('绑定手机号失败:', error)
    emit('bind-failed', error as Error)
    showNotify({
      type: 'danger',
      message: '绑定手机号失败，请检查输入信息',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    loading.value = false
  }
}

// 处理跳过
const handleSkip = () => {
  emit('skip-click')
  router.push(props.redirectUrl)
}

// 清空表单
const clearForm = () => {
  bindMobileForm.phone = ''
  bindMobileForm.verificationCode = ''
  countdown.value = 0
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
}

// 暴露方法给父组件
defineExpose({
  focus: () => {
    const firstField = document.querySelector('.modern-input input') as HTMLInputElement
    firstField?.focus()
  },
  clear: clearForm,
  validate: () => bindMobileFormRef.value?.validate()
})
</script>

<style scoped lang="scss">
// 复用登录组件的样式系统
.sdkwork-auth-bind-mobile {
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
  .bind-mobile-main-container {
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

      .modern-bind-mobile-form {
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
              .send-code-button {
                :deep(.van-button) {
                  background: var(--tech-blue-500);
                  border: none;
                  border-radius: 8px;
                  font-size: 12px;
                  font-weight: 600;
                  padding: 6px 12px;

                  &:disabled {
                    background: var(--tech-gray-400);
                    color: var(--tech-gray-600);
                  }
                }
              }
            }
          }
        }

        .form-actions {
          margin-top: 32px;

          .modern-bind-button {
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

      .skip-section {
        margin-top: 24px;
        text-align: center;

        .skip-button {
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

            .skip-icon {
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
.sdkwork-auth-bind-mobile.dark-mode {
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
  .sdkwork-auth-bind-mobile {
    .bind-mobile-main-container {
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
  .sdkwork-auth-bind-mobile {
    .form-section {
      padding: 32px 20px;

      .form-container {
        .form-header {
          margin-bottom: 32px;

          .form-title {
            font-size: 28px;
          }
        }

        .modern-bind-mobile-form {
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
            .modern-bind-button {
              :deep(.van-button) {
                height: 56px;
                font-size: 15px;
                border-radius: 12px;
              }
            }
          }

          .skip-section {
            .skip-button {
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
.sdkwork-auth-bind-mobile.compact-mode {
  .bind-mobile-main-container {
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