<template>
  <div class="sdkwork-auth-forgot" :class="{ 'dark-mode': isDarkMode, 'compact-mode': compactMode }">
    <!-- 全屏科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid-lines"></div>
      <div class="tech-particles-container">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="tech-glow-effect"></div>
    </div>
    
    <!-- 主容器 -->
    <div class="forgot-main-container">
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
      
      <!-- 右侧忘记密码表单区 -->
      <div class="form-section">
        <div class="form-container">
          
          <!-- 忘记密码表单标题 -->
          <div class="form-header">
            <h2 class="form-title">找回密码</h2>
            <p class="form-subtitle">通过邮箱或手机号重置密码</p>
          </div>
          
          <!-- 步骤指示器 -->
          <div class="step-indicator">
            <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <span class="step-label">验证身份</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <span class="step-label">验证码验证</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
              <div class="step-number">3</div>
              <span class="step-label">重置密码</span>
            </div>
          </div>
          
          <!-- 步骤1：验证身份 -->
          <div v-if="currentStep === 1" class="step-content">
            <van-form 
              ref="step1FormRef"
              :model="step1Form" 
              :rules="step1Rules"
              @submit="handleStep1Submit"
              class="modern-forgot-form"
            >
              <!-- 验证方式选择 -->
              <div class="verification-method">
                <div class="method-title">选择验证方式</div>
                <div class="method-options">
                  <van-radio-group v-model="step1Form.method" direction="horizontal">
                    <van-radio name="email" class="method-radio">
                      <template #icon="{ checked }">
                        <div class="radio-icon" :class="{ checked }">
                          <Icon icon="ph:envelope" class="method-icon" />
                        </div>
                      </template>
                      <span class="method-label">邮箱验证</span>
                    </van-radio>
                    <van-radio name="phone" class="method-radio">
                      <template #icon="{ checked }">
                        <div class="radio-icon" :class="{ checked }">
                          <Icon icon="ph:phone" class="method-icon" />
                        </div>
                      </template>
                      <span class="method-label">手机验证</span>
                    </van-radio>
                  </van-radio-group>
                </div>
              </div>
              
              <!-- 邮箱/手机号输入 -->
              <div class="input-group">
                <div class="input-icon">
                  <Icon :icon="step1Form.method === 'email' ? 'ph:envelope' : 'ph:phone'" class="input-icon-svg" />
                </div>
                <van-field
                  v-model="step1Form.identifier"
                  :name="step1Form.method === 'email' ? 'email' : 'phone'"
                  :placeholder="step1Form.method === 'email' ? '请输入注册邮箱' : '请输入注册手机号'"
                  :rules="step1Form.method === 'email' ? step1Rules.email : step1Rules.phone"
                  :border="false"
                  class="modern-input"
                />
              </div>
              
              <!-- 发送验证码按钮 -->
              <div class="form-actions">
                <van-button
                  round
                  block
                  type="primary"
                  native-type="submit"
                  :loading="step1Loading"
                  :disabled="!isStep1Valid"
                  loading-text="发送中..."
                  class="modern-send-button"
                >
                  <span class="button-content">
                    <Icon icon="ph:paper-plane" class="button-icon" />
                    <span>发送验证码</span>
                  </span>
                </van-button>
              </div>
            </van-form>
          </div>
          
          <!-- 步骤2：验证码验证 -->
          <div v-if="currentStep === 2" class="step-content">
            <van-form 
              ref="step2FormRef"
              :model="step2Form" 
              :rules="step2Rules"
              @submit="handleStep2Submit"
              class="modern-forgot-form"
            >
              <!-- 验证码输入 -->
              <div class="input-group">
                <div class="input-icon">
                  <Icon icon="ph:key" class="input-icon-svg" />
                </div>
                <van-field
                  v-model="step2Form.verificationCode"
                  name="verificationCode"
                  placeholder="请输入6位验证码"
                  :rules="step2Rules.verificationCode"
                  :border="false"
                  class="modern-input"
                >
                  <template #button>
                    <van-button 
                      size="small" 
                      type="primary" 
                      :disabled="countdown > 0"
                      @click="handleResendCode"
                      class="resend-button"
                    >
                      {{ countdown > 0 ? `${countdown}s后重发` : '重新发送' }}
                    </van-button>
                  </template>
                </van-field>
              </div>
              
              <!-- 验证按钮 -->
              <div class="form-actions">
                <van-button
                  round
                  block
                  type="primary"
                  native-type="submit"
                  :loading="step2Loading"
                  :disabled="!isStep2Valid"
                  loading-text="验证中..."
                  class="modern-verify-button"
                >
                  <span class="button-content">
                    <Icon icon="ph:check-circle" class="button-icon" />
                    <span>验证验证码</span>
                  </span>
                </van-button>
              </div>
            </van-form>
          </div>
          
          <!-- 步骤3：重置密码 -->
          <div v-if="currentStep === 3" class="step-content">
            <van-form 
              ref="step3FormRef"
              :model="step3Form" 
              :rules="step3Rules"
              @submit="handleStep3Submit"
              class="modern-forgot-form"
            >
              <!-- 新密码输入 -->
              <div class="input-group">
                <div class="input-icon">
                  <Icon icon="ph:lock" class="input-icon-svg" />
                </div>
                <van-field
                  v-model="step3Form.newPassword"
                  name="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="请输入新密码"
                  :rules="step3Rules.newPassword"
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
              
              <!-- 确认密码输入 -->
              <div class="input-group">
                <div class="input-icon">
                  <Icon icon="ph:lock-key" class="input-icon-svg" />
                </div>
                <van-field
                  v-model="step3Form.confirmPassword"
                  name="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请确认新密码"
                  :rules="step3Rules.confirmPassword"
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
              
              <!-- 重置密码按钮 -->
              <div class="form-actions">
                <van-button
                  round
                  block
                  type="primary"
                  native-type="submit"
                  :loading="step3Loading"
                  :disabled="!isStep3Valid"
                  loading-text="重置中..."
                  class="modern-reset-button"
                >
                  <span class="button-content">
                    <Icon icon="ph:key" class="button-icon" />
                    <span>重置密码</span>
                  </span>
                </van-button>
              </div>
            </van-form>
          </div>
          
          <!-- 返回登录链接 -->
          <div class="back-section">
            <van-button 
              type="default" 
              size="large" 
              @click="handleBackToLogin"
              class="back-button"
            >
              <Icon icon="ph:arrow-left" class="back-icon" />
              <span>返回登录</span>
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
  RadioGroup as VanRadioGroup,
  Radio as VanRadio
} from 'vant'

interface Step1Form {
  method: 'email' | 'phone'
  identifier: string
}

interface Step2Form {
  verificationCode: string
}

interface Step3Form {
  newPassword: string
  confirmPassword: string
}

interface Props {
  redirectUrl?: string
  autoRedirect?: boolean
  forceDarkMode?: boolean
  compactMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  redirectUrl: '/auth/login',
  autoRedirect: true,
  forceDarkMode: false,
  compactMode: false
})

interface Emits {
  'forgot-success': []
  'forgot-failed': [error: Error]
  'back-to-login': []
  'theme-change': [isDark: boolean]
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const currentStep = ref(1)
const isDarkMode = ref(false)
const step1Loading = ref(false)
const step2Loading = ref(false)
const step3Loading = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
const step1FormRef = ref()
const step2FormRef = ref()
const step3FormRef = ref()

const step1Form = reactive<Step1Form>({
  method: 'email',
  identifier: ''
})

const step2Form = reactive<Step2Form>({
  verificationCode: ''
})

const step3Form = reactive<Step3Form>({
  newPassword: '',
  confirmPassword: ''
})

// 特性列表
const features = [
  '智能数据分析',
  '实时监控',
  'AI预测',
  '安全可靠'
]

// 验证规则
const step1Rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^[\w.-]+@[\w.-]+\.\w+$/.test(value), 
      message: '请输入有效的邮箱地址', 
      trigger: 'onBlur' 
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^1[3-9]\d{9}$/.test(value), 
      message: '请输入有效的手机号', 
      trigger: 'onBlur' 
    }
  ]
}

const step2Rules = {
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'onBlur' },
    { 
      validator: (value: string) => /^\d{6}$/.test(value), 
      message: '请输入6位数字验证码', 
      trigger: 'onBlur' 
    }
  ]
}

const step3Rules = {
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
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'onBlur' },
    { 
      validator: (value: string) => value === step3Form.newPassword, 
      message: '两次输入的密码不一致', 
      trigger: 'onBlur' 
    }
  ]
}

// 计算属性
const isStep1Valid = computed(() => {
  return step1Form.identifier.trim().length > 0 && 
         (step1Form.method === 'email' ? 
           /^[\w.-]+@[\w.-]+\.\w+$/.test(step1Form.identifier) : 
           /^1[3-9]\d{9}$/.test(step1Form.identifier))
})

const isStep2Valid = computed(() => {
  return /^\d{6}$/.test(step2Form.verificationCode)
})

const isStep3Valid = computed(() => {
  return step3Form.newPassword.length >= 6 && 
         step3Form.confirmPassword === step3Form.newPassword
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
let countdownInterval: NodeJS.Timeout | null = null

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

// 步骤1：发送验证码
const handleStep1Submit = async () => {
  try {
    step1Loading.value = true
    
    const request = {
      identifier: step1Form.identifier.trim(),
      method: step1Form.method
    }

    // 调用auth store的忘记密码方法
    const result = await authStore.forgotPassword(request)
    
    if (result.success) {
      showNotify({
        type: 'success',
        message: '验证码已发送，请查收',
        background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
        color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
      })
      
      // 开始倒计时
      startCountdown()
      
      // 进入下一步
      currentStep.value = 2
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    showNotify({
      type: 'danger',
      message: '发送验证码失败，请重试',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    step1Loading.value = false
  }
}

// 步骤2：验证验证码
const handleStep2Submit = async () => {
  try {
    step2Loading.value = true
    
    const request = {
      identifier: step1Form.identifier.trim(),
      verificationCode: step2Form.verificationCode,
      type: 'password_reset' as const
    }

    // 调用auth store的验证码验证方法
    const result = await authStore.verifyCode(request)
    
    if (result.success) {
      showNotify({
        type: 'success',
        message: '验证码验证成功',
        background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
        color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
      })
      
      // 进入下一步
      currentStep.value = 3
    }
  } catch (error) {
    console.error('验证码验证失败:', error)
    showNotify({
      type: 'danger',
      message: '验证码验证失败，请重试',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    step2Loading.value = false
  }
}

// 步骤3：重置密码
const handleStep3Submit = async () => {
  try {
    step3Loading.value = true
    
    const request = {
      identifier: step1Form.identifier.trim(),
      verificationCode: step2Form.verificationCode,
      newPassword: step3Form.newPassword
    }

    // 调用auth store的重置密码方法
    const result = await authStore.resetPassword(request)
    
    if (result) {
      showNotify({
        type: 'success',
        message: '密码重置成功',
        background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
        color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
      })
      
      emit('forgot-success')
      
      // 自动重定向
      if (props.autoRedirect) {
        setTimeout(() => {
          router.push(props.redirectUrl)
        }, 1500)
      }
    }
  } catch (error) {
    console.error('密码重置失败:', error)
    emit('forgot-failed', error as Error)
    showNotify({
      type: 'danger',
      message: '密码重置失败，请重试',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  } finally {
    step3Loading.value = false
  }
}

// 重新发送验证码
const handleResendCode = async () => {
  if (countdown.value > 0) return
  
  try {
    const request = {
      identifier: step1Form.identifier.trim(),
      method: step1Form.method
    }

    const result = await authStore.forgotPassword(request)
    
    if (result.success) {
      showNotify({
        type: 'success',
        message: '验证码已重新发送',
        background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
        color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
      })
      
      // 重新开始倒计时
      startCountdown()
    }
  } catch (error) {
    console.error('重新发送验证码失败:', error)
    showNotify({
      type: 'danger',
      message: '重新发送验证码失败，请重试',
      background: isDarkMode.value ? 'var(--tech-bg-primary)' : '#fff',
      color: isDarkMode.value ? 'var(--tech-text-primary)' : 'var(--tech-text-primary)'
    })
  }
}

// 返回登录
const handleBackToLogin = () => {
  emit('back-to-login')
  router.push('/auth/login')
}

// 清空表单
const clearForm = () => {
  currentStep.value = 1
  step1Form.method = 'email'
  step1Form.identifier = ''
  step2Form.verificationCode = ''
  step3Form.newPassword = ''
  step3Form.confirmPassword = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  countdown.value = 0
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
}

// 暴露方法给父组件
defineExpose({
  clear: clearForm,
  reset: () => {
    clearForm()
    currentStep.value = 1
  }
})
</script>

<style scoped lang="scss">
// 复用登录组件的样式系统
.sdkwork-auth-forgot {
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
  .forgot-main-container {
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
        margin-bottom: 32px;
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

      // 步骤指示器
      .step-indicator {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;

          .step-number {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--tech-bg-secondary);
            border: 2px solid var(--tech-border-light);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
            color: var(--tech-text-tertiary);
            transition: all 0.3s ease;
          }

          .step-label {
            margin-top: 8px;
            font-size: 12px;
            color: var(--tech-text-tertiary);
            transition: all 0.3s ease;
          }

          &.active {
            .step-number {
              background: var(--tech-blue-500);
              border-color: var(--tech-blue-500);
              color: white;
            }

            .step-label {
              color: var(--tech-text-primary);
              font-weight: 600;
            }
          }

          &.completed {
            .step-number {
              background: var(--tech-blue-300);
              border-color: var(--tech-blue-300);
              color: white;
            }

            .step-label {
              color: var(--tech-text-secondary);
            }
          }
        }

        .step-divider {
          flex: 1;
          height: 2px;
          background: var(--tech-border-light);
          margin: 0 8px;
          position: relative;
          top: -16px;
        }
      }

      .step-content {
        .modern-forgot-form {
          .verification-method {
            margin-bottom: 24px;

            .method-title {
              font-size: 14px;
              color: var(--tech-text-secondary);
              margin-bottom: 12px;
              font-weight: 600;
            }

            .method-options {
              :deep(.van-radio-group) {
                display: flex;
                gap: 16px;

                .method-radio {
                  flex: 1;

                  :deep(.van-radio__label) {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;

                    .radio-icon {
                      width: 48px;
                      height: 48px;
                      border-radius: 12px;
                      background: var(--tech-bg-secondary);
                      border: 2px solid var(--tech-border-light);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      transition: all 0.3s ease;

                      &.checked {
                        background: var(--tech-blue-50);
                        border-color: var(--tech-blue-500);
                      }

                      .method-icon {
                        width: 24px;
                        height: 24px;
                        color: var(--tech-text-tertiary);
                        transition: color 0.3s ease;
                      }
                    }

                    .method-label {
                      font-size: 14px;
                      color: var(--tech-text-secondary);
                      font-weight: 500;
                    }
                  }

                  :deep(.van-radio__icon) {
                    display: none;
                  }
                }
              }
            }
          }

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

                .resend-button {
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

            .modern-send-button,
            .modern-verify-button,
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
      }

      .back-section {
        margin-top: 40px;

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
.sdkwork-auth-forgot.dark-mode {
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
  .sdkwork-auth-forgot {
    .forgot-main-container {
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
  .sdkwork-auth-forgot {
    .form-section {
      padding: 32px 20px;

      .form-container {
        .form-header {
          margin-bottom: 24px;

          .form-title {
            font-size: 28px;
          }
        }

        .step-indicator {
          margin-bottom: 32px;

          .step-item {
            .step-number {
              width: 28px;
              height: 28px;
              font-size: 12px;
            }

            .step-label {
              font-size: 11px;
            }
          }

          .step-divider {
            top: -14px;
          }
        }

        .step-content {
          .modern-forgot-form {
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
              .modern-send-button,
              .modern-verify-button,
              .modern-reset-button {
                :deep(.van-button) {
                  height: 56px;
                  font-size: 15px;
                  border-radius: 12px;
                }
              }
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

// 紧凑模式
.sdkwork-auth-forgot.compact-mode {
  .forgot-main-container {
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