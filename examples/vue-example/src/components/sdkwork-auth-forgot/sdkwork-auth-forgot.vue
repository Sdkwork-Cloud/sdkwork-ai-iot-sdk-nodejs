<template>
  <div class="sdkwork-auth-forgot">
    <!-- 忘记密码容器 -->
    <div class="forgot-container">
      <!-- 头部 -->
      <div class="forgot-header">
        <h1 class="forgot-title">找回密码</h1>
        <p class="forgot-subtitle">请输入您的邮箱或手机号找回密码</p>
      </div>

      <!-- 步骤指示器 -->
      <van-steps :active="currentStep" active-color="#1989fa">
        <van-step>验证身份</van-step>
        <van-step>重置密码</van-step>
        <van-step>完成</van-step>
      </van-steps>

      <!-- 步骤1: 验证身份 -->
      <div v-if="currentStep === 0" class="step-content">
        <van-form class="forgot-form" @submit="handleVerifyIdentity">
          <!-- 邮箱/手机号输入 -->
          <van-field
            v-model="forgotForm.identifier"
            name="identifier"
            label="邮箱/手机号"
            placeholder="请输入邮箱地址或手机号"
            :rules="[{ required: true, message: '请输入邮箱或手机号' }]"
            left-icon="envelop-o"
            clearable
          />

          <!-- 验证码 -->
          <van-field
            v-model="forgotForm.verificationCode"
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

          <!-- 验证按钮 -->
          <div class="form-actions">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              loading-text="验证中..."
              class="verify-button"
            >
              验证身份
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 步骤2: 重置密码 -->
      <div v-else-if="currentStep === 1" class="step-content">
        <van-form class="reset-form" @submit="handleResetPassword">
          <!-- 新密码输入 -->
          <van-field
            v-model="resetForm.newPassword"
            type="password"
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            :rules="[
              { required: true, message: '请输入新密码' },
              { validator: validatePassword, message: '密码至少8位，包含字母和数字' }
            ]"
            left-icon="lock"
            clearable
          />

          <!-- 确认密码 -->
          <van-field
            v-model="resetForm.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入新密码"
            :rules="[
              { required: true, message: '请确认新密码' },
              { validator: validateConfirmPassword, message: '两次密码输入不一致' }
            ]"
            left-icon="lock"
            clearable
          />

          <!-- 重置按钮 -->
          <div class="form-actions">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              loading-text="重置中..."
              class="reset-button"
            >
              重置密码
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 步骤3: 完成 -->
      <div v-else class="step-content">
        <div class="success-content">
          <van-icon name="success" size="64" color="#07c160" />
          <h3 class="success-title">密码重置成功</h3>
          <p class="success-message">您的密码已成功重置，请使用新密码登录</p>
          
          <div class="success-actions">
            <van-button
              round
              type="primary"
              @click="handleLogin"
              class="login-button"
            >
              立即登录
            </van-button>
            <van-button
              round
              plain
              @click="handleBackHome"
              class="home-button"
            >
              返回首页
            </van-button>
          </div>
        </div>
      </div>

      <!-- 返回登录链接 -->
      <div class="login-link" v-if="currentStep < 2">
        <a class="login-text" @click="handleBackToLogin">
          ← 返回登录
        </a>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="loading" class="loading-overlay">
      <van-loading type="spinner" size="24px">{{ loadingText }}</van-loading>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'

interface ForgotForm {
  identifier: string
  verificationCode: string
}

interface ResetForm {
  newPassword: string
  confirmPassword: string
}

interface Props {
  // 自定义属性
  autoRedirect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoRedirect: true
})

interface Emits {
  'verify-success': [identifier: string]
  'reset-success': []
  'back-to-login': []
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const currentStep = ref(0)
const countdown = ref(0)

const forgotForm = reactive<ForgotForm>({
  identifier: '',
  verificationCode: ''
})

const resetForm = reactive<ResetForm>({
  newPassword: '',
  confirmPassword: ''
})

// 计算加载文本
const loadingText = computed(() => {
  switch (currentStep.value) {
    case 0: return '验证中...'
    case 1: return '重置中...'
    default: return '处理中...'
  }
})

// 验证密码
const validatePassword = (value: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
}

// 验证确认密码
const validateConfirmPassword = (value: string) => {
  return value === resetForm.newPassword
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!forgotForm.identifier) {
    showToast('请先输入邮箱或手机号')
    return
  }

  try {
    loading.value = true
    
    // 调用auth store发送验证码
    await authStore.sendVerificationCode({
      identifier: forgotForm.identifier,
      method: forgotForm.identifier.includes('@') ? 'email' : 'phone',
      type: 'password_reset'
    })
    
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

// 处理身份验证
const handleVerifyIdentity = async () => {
  try {
    loading.value = true
    
    // 调用auth store验证身份
    await authStore.verifyIdentity({
      identifier: forgotForm.identifier,
      verificationCode: forgotForm.verificationCode
    })
    
    // 验证成功，进入下一步
    emit('verify-success', forgotForm.identifier)
    currentStep.value = 1
    showToast('身份验证成功')
  } catch (error) {
    console.error('身份验证失败:', error)
    showToast('身份验证失败，请检查验证码')
  } finally {
    loading.value = false
  }
}

// 处理重置密码
const handleResetPassword = async () => {
  try {
    loading.value = true
    
    // 调用auth store重置密码
    await authStore.resetPassword({
      identifier: forgotForm.identifier,
      verificationCode: forgotForm.verificationCode,
      newPassword: resetForm.newPassword
    })
    
    // 重置成功，进入完成步骤
    emit('reset-success')
    currentStep.value = 2
    showToast('密码重置成功')
  } catch (error) {
    console.error('密码重置失败:', error)
    showToast('密码重置失败')
  } finally {
    loading.value = false
  }
}

// 处理登录
const handleLogin = () => {
  router.push('/auth/login')
}

// 处理返回首页
const handleBackHome = () => {
  router.push('/')
}

// 处理返回登录
const handleBackToLogin = () => {
  emit('back-to-login')
  router.push('/auth/login')
}

// 暴露方法给父组件
defineExpose({
  reset: () => {
    currentStep.value = 0
    forgotForm.identifier = ''
    forgotForm.verificationCode = ''
    resetForm.newPassword = ''
    resetForm.confirmPassword = ''
  }
})
</script>

<style scoped lang="scss">
.sdkwork-auth-forgot {
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .forgot-container {
    background: white;
    border-radius: 16px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    .forgot-header {
      text-align: center;
      margin-bottom: 30px;

      .forgot-title {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .forgot-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .van-steps {
      margin-bottom: 30px;
    }

    .step-content {
      .form-actions {
        margin-top: 24px;

        .verify-button,
        .reset-button {
          height: 44px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .code-button {
        min-width: 80px;
      }

      .success-content {
        text-align: center;
        padding: 20px 0;

        .success-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 16px 0 8px 0;
        }

        .success-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .success-actions {
          display: flex;
          gap: 12px;

          .login-button,
          .home-button {
            flex: 1;
            height: 40px;
          }
        }
      }
    }

    .login-link {
      text-align: center;
      margin-top: 20px;

      .login-text {
        color: #1989fa;
        text-decoration: none;
        font-size: 14px;
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
}

// 移动端适配
@media (max-width: 768px) {
  .sdkwork-auth-forgot {
    padding: 16px;

    .forgot-container {
      padding: 30px 20px;
      margin: 0;

      .forgot-header {
        .forgot-title {
          font-size: 24px;
        }
      }

      .success-actions {
        flex-direction: column;
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .sdkwork-auth-forgot {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);

    .forgot-container {
      background: #2d3748;
      color: white;

      .forgot-header {
        .forgot-title {
          color: white;
        }

        .forgot-subtitle {
          color: #a0aec0;
        }
      }

      .success-content {
        .success-title {
          color: white;
        }

        .success-message {
          color: #a0aec0;
        }
      }
    }
  }
}
</style>