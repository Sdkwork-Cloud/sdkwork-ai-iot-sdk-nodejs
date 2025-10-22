<template>
  <div class="sdkwork-auth-register">
    <!-- 科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid"></div>
      <div class="tech-glow"></div>
    </div>

    <!-- 注册表单容器 -->
    <div class="register-container">
      <!-- 简洁头部 -->
      <div class="register-header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L35 15L20 25L5 15L20 5Z" fill="currentColor"/>
            <path d="M20 25L35 35L20 25L5 35L20 25Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 class="register-title">创建账户</h1>
        <p class="register-subtitle">注册新账户开始使用</p>
      </div>

      <!-- 注册表单 -->
      <van-form class="register-form" @submit="handleRegister">
        <!-- 用户名输入 -->
        <van-field
          v-model="registerForm.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[
            { required: true, message: '请输入用户名' },
            { validator: validateUsername, message: '用户名格式不正确' }
          ]"
          left-icon="user-o"
          clearable
        />

        <!-- 邮箱输入 -->
        <van-field
          v-model="registerForm.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱地址"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { validator: validateEmail, message: '邮箱格式不正确' }
          ]"
          left-icon="envelop-o"
          clearable
        />

        <!-- 手机号输入 -->
        <van-field
          v-model="registerForm.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { validator: validatePhone, message: '手机号格式不正确' }
          ]"
          left-icon="phone-o"
          clearable
        />

        <!-- 密码输入 -->
        <van-field
          v-model="registerForm.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { validator: validatePassword, message: '密码至少8位，包含字母和数字' }
          ]"
          left-icon="lock"
          clearable
        />

        <!-- 确认密码 -->
        <van-field
          v-model="registerForm.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次密码输入不一致' }
          ]"
          left-icon="lock"
          clearable
        />

        <!-- 验证码 -->
        <van-field
          v-model="registerForm.verificationCode"
          name="verificationCode"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
          left-icon="shield-check"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
              class="code-button"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>

        <!-- 协议同意 -->
        <div class="agreement">
          <van-checkbox v-model="registerForm.agreed" shape="square">
            我已阅读并同意
            <a class="agreement-link" @click="showAgreement">《用户协议》</a>
            和
            <a class="agreement-link" @click="showPrivacy">《隐私政策》</a>
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
            loading-text="注册中..."
            class="register-button"
          >
            注册
          </van-button>
        </div>
      </van-form>

      <!-- 登录链接 -->
      <div class="login-link">
        <span>已有账户？</span>
        <a class="login-text" @click="handleLogin">
          立即登录
        </a>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="loading" class="loading-overlay">
      <van-loading type="spinner" size="24px">注册中...</van-loading>
    </van-overlay>

    <!-- 协议弹窗 -->
    <sdkwork-popup v-model:show="showAgreementPopup" round position="bottom">
      <div class="agreement-popup">
        <h3>用户协议</h3>
        <div class="agreement-content">
          <!-- 协议内容 -->
          <p>这里是用户协议内容...</p>
        </div>
        <van-button block @click="showAgreementPopup = false">同意并关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showPrivacyPopup" round position="bottom">
      <div class="agreement-popup">
        <h3>隐私政策</h3>
        <div class="agreement-content">
          <!-- 隐私政策内容 -->
          <p>这里是隐私政策内容...</p>
        </div>
        <van-button block @click="showPrivacyPopup = false">同意并关闭</van-button>
      </div>
    </sdkwork-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'
import type { RegisterRequest } from '@/stores/modules/auth/types'

interface RegisterForm extends RegisterRequest {
  confirmPassword: string
  verificationCode: string
  agreed: boolean
}

interface Props {
  // 自定义属性
  autoLogin?: boolean
  showVerification?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoLogin: true,
  showVerification: true
})

interface Emits {
  'register-success': [user: any]
  'register-failed': [error: Error]
  'login-click': []
  'verification-sent': [email: string]
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const countdown = ref(0)
const showAgreementPopup = ref(false)
const showPrivacyPopup = ref(false)

const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  agreed: false
})

// 验证用户名
const validateUsername = (value: string) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value)
}

// 验证邮箱
const validateEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// 验证手机号
const validatePhone = (value: string) => {
  return /^1[3-9]\d{9}$/.test(value)
}

// 验证密码
const validatePassword = (value: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
}

// 验证确认密码
const validateConfirmPassword = (value: string) => {
  return value === registerForm.password
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!registerForm.email && !registerForm.phone) {
    showToast('请先输入邮箱或手机号')
    return
  }

  try {
    loading.value = true
    
    // 调用auth store发送验证码
    await authStore.sendVerificationCode({
      identifier: (registerForm.email || registerForm.phone) as string,
      method: registerForm.email ? 'email' : 'phone',
      type: 'registration'
    })
    
    emit('verification-sent', (registerForm.email || registerForm.phone) as string)
    showToast('验证码已发送')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
    showToast('发送验证码失败')
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.agreed) {
    showToast('请同意用户协议和隐私政策')
    return
  }

  try {
    loading.value = true
    
    const registerData = {
      username: registerForm?.username?.trim(),
      email: registerForm?.email?.trim(),
      phone: registerForm?.phone?.trim(),
      password: registerForm.password
    }

    // 调用auth store的注册方法
    const result = await authStore.register(registerData)
    
    // 注册成功
    emit('register-success', result)
    showToast('注册成功')
    
    // 自动登录
    if (props.autoLogin) {
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  } catch (error) {
    console.error('注册失败:', error)
    emit('register-failed', error as Error)
    showToast('注册失败，请检查输入信息')
  } finally {
    loading.value = false
  }
}

// 处理登录
const handleLogin = () => {
  emit('login-click')
  router.push('/auth/login')
}

// 显示协议
const showAgreement = () => {
  showAgreementPopup.value = true
}

// 显示隐私政策
const showPrivacy = () => {
  showPrivacyPopup.value = true
}

// 暴露方法给父组件
defineExpose({
  clear: () => {
    registerForm.username = ''
    registerForm.email = ''
    registerForm.phone = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.verificationCode = ''
    registerForm.agreed = false
  }
})
</script>

<style scoped lang="scss">
// 科技蓝主题色系
:root {
  --tech-blue: #1890ff;
  --tech-blue-dark: #096dd9;
  --tech-blue-light: #40a9ff;
  --tech-blue-glow: rgba(24, 144, 255, 0.4);
  --tech-gray: #f0f2f5;
  --tech-gray-dark: #262626;
  --tech-text: #1f2937;
  --tech-text-dark: #f9fafb;
  --tech-border: #e5e7eb;
  --tech-border-dark: #374151;
  --tech-bg: #ffffff;
  --tech-bg-dark: #111827;
  --tech-card: #ffffff;
  --tech-card-dark: #1f2937;
}

.sdkwork-auth-register {
  min-height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-blue-dark) 100%);
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
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.3;
    }

    .tech-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, var(--tech-blue-glow) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      filter: blur(40px);
      animation: pulse 4s ease-in-out infinite;
    }
  }

  .register-container {
    position: relative;
    z-index: 1;
    background: var(--tech-card);
    border-radius: 12px;
    padding: 40px 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    .register-header {
      text-align: center;
      margin-bottom: 30px;

      .register-title {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .register-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .register-form {
      .agreement {
        margin: 16px 0;
        font-size: 14px;

        .agreement-link {
          color: #1989fa;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .form-actions {
        margin-top: 24px;

        .register-button {
          height: 44px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .code-button {
        min-width: 80px;
      }
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;

      .login-text {
        color: #1989fa;
        text-decoration: none;
        margin-left: 4px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .loading-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }

  .agreement-popup {
    padding: 20px;

    h3 {
      text-align: center;
      margin-bottom: 16px;
      color: #333;
    }

    .agreement-content {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 1.5;
      color: #666;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sdkwork-auth-register {
    padding: 16px;

    .register-container {
      padding: 30px 20px;
      margin: 0;

      .register-header {
        .register-title {
          font-size: 24px;
        }
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .sdkwork-auth-register {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);

    .register-container {
      background: #2d3748;
      color: white;

      .register-header {
        .register-title {
          color: white;
        }

        .register-subtitle {
          color: #a0aec0;
        }
      }

      .agreement-popup {
        background: #2d3748;
        color: white;

        h3 {
          color: white;
        }

        .agreement-content {
          color: #a0aec0;
        }
      }
    }
  }
}
</style>