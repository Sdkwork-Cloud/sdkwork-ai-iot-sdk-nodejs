<template>
  <div class="sdkwork-auth-oauth-callback">
    <!-- 加载状态 -->
    <div v-if="loading" class="callback-loading">
      <div class="loading-content">
        <div class="loading-spinner">
          <i class="i-mdi-loading animate-spin"></i>
        </div>
        <h3 class="loading-title">正在处理授权...</h3>
        <p class="loading-description">请稍等，正在验证您的登录信息</p>
      </div>
    </div>

    <!-- 成功状态 -->
    <div v-else-if="success" class="callback-success">
      <div class="success-content">
        <div class="success-icon">
          <i class="i-mdi-check-circle"></i>
        </div>
        <h3 class="success-title">授权成功</h3>
        <p class="success-description">您已成功登录，正在跳转...</p>
        <div class="success-actions">
          <button 
            v-if="!autoRedirect" 
            class="success-btn" 
            @click="handleManualRedirect"
          >
            立即跳转
          </button>
          <button 
            class="success-btn secondary" 
            @click="handleStayHere"
          >
            留在此页
          </button>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="callback-error">
      <div class="error-content">
        <div class="error-icon">
          <i class="i-mdi-alert-circle"></i>
        </div>
        <h3 class="error-title">授权失败</h3>
        <p class="error-description">{{ errorMessage }}</p>
        <div class="error-actions">
          <button class="error-btn primary" @click="handleRetry">
            <i class="i-mdi-refresh"></i>
            重新尝试
          </button>
          <button class="error-btn" @click="handleBackToLogin">
            <i class="i-mdi-arrow-left"></i>
            返回登录
          </button>
        </div>
        <div v-if="errorDetails" class="error-details">
          <details>
            <summary>错误详情</summary>
            <pre>{{ errorDetails }}</pre>
          </details>
        </div>
      </div>
    </div>

    <!-- 未知状态 -->
    <div v-else class="callback-unknown">
      <div class="unknown-content">
        <div class="unknown-icon">
          <i class="i-mdi-help-circle"></i>
        </div>
        <h3 class="unknown-title">未知状态</h3>
        <p class="unknown-description">无法处理当前授权状态</p>
        <button class="unknown-btn" @click="handleReset">
          重置状态
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth/auth'
import type { OAuthProvider, OAuthCallbackParams } from '@/stores/modules/auth/types'

// Props定义
interface Props {
  // 默认重定向URL
  defaultRedirect?: string
  // 自动重定向延迟（毫秒）
  autoRedirectDelay?: number
  // 是否启用自动重定向
  autoRedirect?: boolean
  // 是否显示错误详情
  showErrorDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultRedirect: '/',
  autoRedirectDelay: 3000,
  autoRedirect: true,
  showErrorDetails: false
})

// Emits定义
const emit = defineEmits<{
  'callback-success': [provider: OAuthProvider]
  'callback-error': [error: string, provider?: OAuthProvider]
  'callback-complete': []
}>()

// 路由和Store
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const currentProvider = ref<OAuthProvider | null>(null)
const redirectTimer = ref<any>(null)

// 方法
const extractCallbackParams = (): OAuthCallbackParams => {
  const { code, state, error: oauthError, error_description } = route.query
  
  return {
    code: code as string,
    state: state as string,
    error: oauthError as string,
    error_description: error_description as string
  }
}

const detectProvider = (): OAuthProvider | null => {
  // 从URL路径或查询参数中检测提供者
  const path = route.path.toLowerCase()
  const queryProvider = route.query.provider as string
  
  if (queryProvider) {
    return queryProvider as OAuthProvider
  }
  
  // 从路径中检测
  if (path.includes('github')) return 'github'
  if (path.includes('google')) return 'google'
  if (path.includes('wechat')) return 'wechat'
  if (path.includes('qq')) return 'qq'
  if (path.includes('facebook')) return 'facebook'
  if (path.includes('twitter')) return 'twitter'
  
  return null
}

const handleCallback = async () => {
  try {
    loading.value = true
    error.value = false
    success.value = false
    errorMessage.value = ''
    errorDetails.value = ''
    
    // 提取回调参数
    const params = extractCallbackParams()
    
    // 检测提供者
    const provider = detectProvider()
    if (!provider) {
      throw new Error('无法识别OAuth2提供者')
    }
    currentProvider.value = provider
    
    // 检查错误参数
    if (params.error) {
      throw new Error(params.error_description || `OAuth2授权失败: ${params.error}`)
    }
    
    // 检查必要的参数
    if (!params.code) {
      throw new Error('缺少授权码参数')
    }
    
    // 调用authStore处理回调
    await authStore.handleOAuthCallback(params, provider)
    
    // 处理成功
    handleSuccess(provider)
    
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
    emit('callback-complete')
  }
}

const handleSuccess = (provider: OAuthProvider) => {
  success.value = true
  currentProvider.value = provider
  
  emit('callback-success', provider)
  
  // 自动重定向
  if (props.autoRedirect) {
    redirectTimer.value = setTimeout(() => {
      handleRedirect()
    }, props.autoRedirectDelay)
  }
}

const handleError = (err: any) => {
  error.value = true
  errorMessage.value = err instanceof Error ? err.message : '授权处理失败'
  errorDetails.value = props.showErrorDetails ? JSON.stringify(err, null, 2) : ''
  
  emit('callback-error', errorMessage.value, currentProvider.value || undefined)
}

const handleRedirect = () => {
  const redirectUrl = route.query.redirect as string || props.defaultRedirect
  router.push(redirectUrl)
}

const handleManualRedirect = () => {
  if (redirectTimer.value) {
    clearTimeout(redirectTimer.value)
    redirectTimer.value = null
  }
  handleRedirect()
}

const handleStayHere = () => {
  if (redirectTimer.value) {
    clearTimeout(redirectTimer.value)
    redirectTimer.value = null
  }
}

const handleRetry = () => {
  handleCallback()
}

const handleBackToLogin = () => {
  router.push('/login')
}

const handleReset = () => {
  loading.value = true
  success.value = false
  error.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  currentProvider.value = null
  
  if (redirectTimer.value) {
    clearTimeout(redirectTimer.value)
    redirectTimer.value = null
  }
  
  handleCallback()
}

// 生命周期
onMounted(() => {
  handleCallback()
})

onUnmounted(() => {
  if (redirectTimer.value) {
    clearTimeout(redirectTimer.value)
    redirectTimer.value = null
  }
})

// 暴露方法给父组件
defineExpose({
  handleCallback,
  handleRedirect,
  handleRetry,
  handleBackToLogin
})
</script>

<style scoped>
.sdkwork-auth-oauth-callback {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

/* 通用内容样式 */
.callback-loading,
.callback-success,
.callback-error,
.callback-unknown {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-content,
.success-content,
.error-content,
.unknown-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

/* 图标样式 */
.loading-spinner,
.success-icon,
.error-icon,
.unknown-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
}

.loading-spinner i {
  color: var(--primary-color);
}

.success-icon i {
  color: var(--success-color);
}

.error-icon i {
  color: var(--error-color);
}

.unknown-icon i {
  color: var(--warning-color);
}

/* 标题样式 */
.loading-title,
.success-title,
.error-title,
.unknown-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

/* 描述样式 */
.loading-description,
.success-description,
.error-description,
.unknown-description {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 按钮样式 */
.success-actions,
.error-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

.success-btn,
.error-btn,
.unknown-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s var(--ease-out);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.success-btn:hover,
.error-btn:hover,
.unknown-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-color-light);
}

.success-btn.primary,
.error-btn.primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.success-btn.primary:hover,
.error-btn.primary:hover {
  background: var(--primary-color-dark);
  border-color: var(--primary-color-dark);
}

.success-btn.secondary {
  background: transparent;
  border-color: var(--border-color);
}

.success-btn.secondary:hover {
  background: var(--bg-secondary);
}

/* 错误详情样式 */
.error-details {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.error-details details {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
}

.error-details summary {
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.error-details pre {
  background: var(--bg-code);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  color: var(--text-code);
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
}

/* 动画效果 */
.loading-spinner i {
  animation: spin 1s linear infinite;
}

.success-icon i {
  animation: scaleIn 0.5s var(--ease-out);
}

.error-icon i {
  animation: shake 0.5s var(--ease-out);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scaleIn {
  from { 
    transform: scale(0.5); 
    opacity: 0; 
  }
  to { 
    transform: scale(1); 
    opacity: 1; 
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .sdkwork-auth-oauth-callback {
    padding: var(--spacing-md);
  }
  
  .loading-spinner,
  .success-icon,
  .error-icon,
  .unknown-icon {
    font-size: 48px;
  }
  
  .success-actions,
  .error-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .success-btn,
  .error-btn,
  .unknown-btn {
    width: 100%;
    justify-content: center;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .success-btn,
  .error-btn,
  .unknown-btn {
    background: var(--bg-card-dark);
    border-color: var(--border-color-dark);
  }
  
  .error-details details {
    background: var(--bg-secondary-dark);
    border-color: var(--border-color-dark);
  }
  
  .error-details pre {
    background: var(--bg-code-dark);
    color: var(--text-code-dark);
  }
}
</style>