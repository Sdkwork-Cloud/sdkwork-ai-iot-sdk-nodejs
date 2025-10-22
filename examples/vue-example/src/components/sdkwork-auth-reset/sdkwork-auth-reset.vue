<template>
  <div class="sdkwork-auth-reset" :class="{ 'dark-mode': isDarkMode }">
    <!-- 科技感背景 -->
    <div class="tech-background">
      <div class="tech-grid"></div>
      <div class="tech-glow"></div>
    </div>

    <!-- 重置密码容器 -->
    <div class="reset-container">
      <!-- 简洁头部 -->
      <div class="reset-header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L35 15L20 25L5 15L20 5Z" fill="currentColor" />
            <path d="M20 25L35 35L20 25L5 35L20 25Z" fill="currentColor" />
          </svg>
        </div>
        <h1 class="reset-title">重置密码</h1>
        <p class="reset-subtitle">请设置您的新密码</p>
      </div>

      <!-- 重置密码表单 -->
      <van-form class="reset-form" @submit="handleResetPassword">
        <!-- 当前密码输入 -->
        <van-field v-model="resetForm.currentPassword" type="password" name="currentPassword" label="当前密码"
          placeholder="请输入当前密码" :rules="[{ required: true, message: '请输入当前密码' }]" left-icon="lock" clearable />

        <!-- 新密码输入 -->
        <van-field v-model="resetForm.newPassword" type="password" name="newPassword" label="新密码" placeholder="请输入新密码"
          :rules="[
            { required: true, message: '请输入新密码' },
            { validator: validatePassword, message: '密码至少8位，包含字母和数字' }
          ]" left-icon="lock" clearable />

        <!-- 确认密码 -->
        <van-field v-model="resetForm.confirmPassword" type="password" name="confirmPassword" label="确认密码"
          placeholder="请再次输入新密码" :rules="[
            { required: true, message: '请确认新密码' },
            { validator: validateConfirmPassword, message: '两次密码输入不一致' }
          ]" left-icon="lock" clearable />

        <!-- 重置按钮 -->
        <div class="form-actions">
          <van-button round block type="primary" native-type="submit" :loading="loading" loading-text="重置中..."
            class="reset-button">
            重置密码
          </van-button>
        </div>
      </van-form>

      <!-- 安全提示 -->
      <div class="security-tips">
        <h4>安全提示</h4>
        <ul>
          <li>密码长度至少8位</li>
          <li>包含字母和数字</li>
          <li>避免使用简单密码</li>
          <li>定期更换密码</li>
        </ul>
      </div>

      <!-- 返回链接 -->
      <div class="back-link">
        <a class="back-text" @click="handleBack">
          ← 返回
        </a>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="loading" class="loading-overlay">
      <van-loading type="spinner" size="24px">重置中...</van-loading>
    </van-overlay>

    <!-- 成功弹窗 -->
    <sdkwork-popup v-model:show="showSuccessPopup" round position="center">
      <div class="success-popup">
        <van-icon name="success" size="48" color="#07c160" />
        <h3 class="popup-title">密码重置成功</h3>
        <p class="popup-message">您的密码已成功重置</p>
        <van-button round block type="primary" @click="handleSuccessConfirm" class="popup-button">
          确定
        </van-button>
      </div>
    </sdkwork-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/modules/auth'

interface ResetForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Props {
  // 自定义属性
  requireCurrentPassword?: boolean
  autoRedirect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireCurrentPassword: true,
  autoRedirect: true
})

interface Emits {
  'reset-success': []
  'reset-failed': [error: Error]
  'back': []
}

const emit = defineEmits<Emits>()

// 使用路由和store
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const showSuccessPopup = ref(false)

const resetForm = reactive<ResetForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const isDarkMode = computed(() => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})
// 验证密码
const validatePassword = (value: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
}

// 验证确认密码
const validateConfirmPassword = (value: string) => {
  return value === resetForm.newPassword
}

// 处理重置密码
const handleResetPassword = async () => {
  try {
    loading.value = true

    const resetData = {
      currentPassword: props.requireCurrentPassword ? resetForm.currentPassword : undefined,
      newPassword: resetForm.newPassword
    }

    // 调用auth store重置密码
    await authStore.changePassword(resetData)

    // 重置成功
    emit('reset-success')
    showSuccessPopup.value = true
    showToast('密码重置成功')
  } catch (error) {
    console.error('密码重置失败:', error)
    emit('reset-failed', error as Error)
    showToast('密码重置失败，请检查当前密码')
  } finally {
    loading.value = false
  }
}

// 处理成功确认
const handleSuccessConfirm = () => {
  showSuccessPopup.value = false

  if (props.autoRedirect) {
    // 根据来源页面决定重定向
    const from = route.query.from as string || '/profile'
    router.push(from)
  }
}

// 处理返回
const handleBack = () => {
  emit('back')
  router.back()
}

// 暴露方法给父组件
defineExpose({
  clear: () => {
    resetForm.currentPassword = ''
    resetForm.newPassword = ''
    resetForm.confirmPassword = ''
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

.sdkwork-auth-reset {
  min-height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-blue-dark) 100%);
  transition: all 0.3s ease;

  .reset-container {
    background: white;
    border-radius: 16px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    .reset-header {
      text-align: center;
      margin-bottom: 30px;

      .reset-title {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .reset-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .reset-form {
      .form-actions {
        margin-top: 24px;

        .reset-button {
          height: 44px;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .security-tips {
      margin-top: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      ul {
        margin: 0;
        padding-left: 16px;
        font-size: 12px;
        color: #666;
        line-height: 1.5;

        li {
          margin-bottom: 4px;
        }
      }
    }

    .back-link {
      text-align: center;
      margin-top: 20px;

      .back-text {
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

  .success-popup {
    padding: 30px 20px;
    text-align: center;

    .popup-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 16px 0 8px 0;
    }

    .popup-message {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }

    .popup-button {
      height: 40px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sdkwork-auth-reset {
    padding: 16px;

    .reset-container {
      padding: 30px 20px;
      margin: 0;

      .reset-header {
        .reset-title {
          font-size: 24px;
        }
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .sdkwork-auth-reset {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);

    .reset-container {
      background: #2d3748;
      color: white;

      .reset-header {
        .reset-title {
          color: white;
        }

        .reset-subtitle {
          color: #a0aec0;
        }
      }

      .security-tips {
        background: #4a5568;

        h4 {
          color: white;
        }

        ul {
          color: #a0aec0;
        }
      }

      .success-popup {
        background: #2d3748;

        .popup-title {
          color: white;
        }

        .popup-message {
          color: #a0aec0;
        }
      }
    }
  }
}
</style>