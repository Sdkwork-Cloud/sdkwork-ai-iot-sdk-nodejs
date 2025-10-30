<template>
  <div class="sdkwork-auth-oauth-login">
    <!-- 标题区域 -->
    <div class="oauth-header">
      <h2 class="oauth-title">第三方登录</h2>
      <p class="oauth-subtitle">选择您喜欢的登录方式</p>
    </div>

    <!-- OAuth2平台列表 -->
    <div class="oauth-platforms">
      <div
        v-for="platform in enabledPlatforms"
        :key="platform.provider"
        class="oauth-platform-item"
        :style="{ '--platform-color': platform.color }"
        @click="handleOAuthLogin(platform.provider)"
      >
        <div class="platform-icon">
          <i :class="platform.icon"></i>
        </div>
        <span class="platform-name">{{ platform.displayName }}</span>
        <div class="platform-loading" v-if="loadingPlatform === platform.provider">
          <i class="i-mdi-loading animate-spin"></i>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="oauth-divider">
      <span class="divider-text">或</span>
    </div>

    <!-- 其他登录选项 -->
    <div class="oauth-options">
      <button
        v-if="showAccountLogin"
        class="oauth-option-btn"
        @click="$emit('switch-to-account')"
      >
        <i class="i-mdi-account"></i>
        <span>账号密码登录</span>
      </button>
      
      <button
        v-if="showRegister"
        class="oauth-option-btn"
        @click="$emit('switch-to-register')"
      >
        <i class="i-mdi-account-plus"></i>
        <span>注册新账号</span>
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="oauth-error">
      <i class="i-mdi-alert-circle"></i>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- 配置提示 -->
    <div v-if="!enabledPlatforms.length" class="oauth-config-hint">
      <div class="config-hint-content">
        <i class="i-mdi-cog"></i>
        <div class="hint-text">
          <p>未配置OAuth2平台</p>
          <p class="hint-detail">请在环境变量中配置相应的CLIENT_ID</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/modules/auth/auth'
import type { OAuthProvider, OAuthPlatformConfig } from '@/stores/modules/auth/types'

// Props定义
interface Props {
  // 是否显示账号登录选项
  showAccountLogin?: boolean
  // 是否显示注册选项
  showRegister?: boolean
  // 自定义重定向URL
  redirectUri?: string
  // 是否紧凑模式
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAccountLogin: true,
  showRegister: true,
  compact: false
})

// Emits定义
const emit = defineEmits<{
  'oauth-started': [provider: OAuthProvider]
  'oauth-success': [provider: OAuthProvider]
  'oauth-error': [error: string]
  'switch-to-account': []
  'switch-to-register': []
}>()

// Store
const authStore = useAuthStore()

// 响应式数据
const loadingPlatform = ref<OAuthProvider | null>(null)
const errorMessage = ref('')

// 计算属性
const enabledPlatforms = computed(() => {
  return authStore.getOAuthPlatforms()
})

// 方法
const handleOAuthLogin = async (provider: OAuthProvider) => {
  try {
    loadingPlatform.value = provider
    errorMessage.value = ''
    
    emit('oauth-started', provider)
    
    // 发起OAuth2授权请求
    authStore.authorizeOAuth({
      provider,
      redirectUri: props.redirectUri
    })
    
    emit('oauth-success', provider)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth2登录失败'
    errorMessage.value = message
    emit('oauth-error', message)
    console.error('OAuth2登录失败:', error)
  } finally {
    loadingPlatform.value = null
  }
}

// 处理OAuth2回调（需要在回调页面调用）
const handleOAuthCallback = async (params: any, provider: OAuthProvider) => {
  try {
    loadingPlatform.value = provider
    errorMessage.value = ''
    
    // 调用authStore处理回调
    await authStore.handleOAuthCallback(params, provider)
    
    emit('oauth-success', provider)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth2回调处理失败'
    errorMessage.value = message
    emit('oauth-error', message)
    console.error('OAuth2回调处理失败:', error)
  } finally {
    loadingPlatform.value = null
  }
}

// 清除错误
const clearError = () => {
  errorMessage.value = ''
}

// 暴露方法给父组件
defineExpose({
  handleOAuthCallback,
  clearError
})

onMounted(() => {
  // 组件挂载时的初始化逻辑
  console.log('OAuth2登录组件已加载，可用平台:', enabledPlatforms.value.map(p => p.displayName))
})
</script>

<style scoped>
.sdkwork-auth-oauth-login {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* 标题区域 */
.oauth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.oauth-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
}

.oauth-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* OAuth2平台列表 */
.oauth-platforms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.oauth-platform-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.3s var(--ease-out);
  position: relative;
  min-height: 80px;
}

.oauth-platform-item:hover {
  border-color: var(--platform-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.oauth-platform-item:active {
  transform: translateY(0);
}

.platform-icon {
  font-size: 24px;
  color: var(--platform-color);
  margin-bottom: var(--spacing-sm);
}

.platform-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.platform-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: var(--platform-color);
}

/* 分隔线 */
.oauth-divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-xl) 0;
}

.oauth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  background: var(--bg-body);
  padding: 0 var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  position: relative;
  z-index: 1;
}

/* 其他登录选项 */
.oauth-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.oauth-option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s var(--ease-out);
}

.oauth-option-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-color-light);
}

/* 错误提示 */
.oauth-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  margin-top: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background: var(--error-bg);
  color: var(--error-color);
  font-size: var(--font-size-sm);
}

/* 配置提示 */
.oauth-config-hint {
  padding: var(--spacing-xl);
  text-align: center;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  margin-top: var(--spacing-lg);
}

.config-hint-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.config-hint-content i {
  font-size: 24px;
  color: var(--text-tertiary);
}

.hint-text p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.hint-detail {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 紧凑模式 */
.sdkwork-auth-oauth-login.compact {
  padding: var(--spacing-md);
}

.sdkwork-auth-oauth-login.compact .oauth-platforms {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-sm);
}

.sdkwork-auth-oauth-login.compact .oauth-platform-item {
  padding: var(--spacing-md);
  min-height: 60px;
}

.sdkwork-auth-oauth-login.compact .platform-icon {
  font-size: 20px;
}

.sdkwork-auth-oauth-login.compact .platform-name {
  font-size: var(--font-size-xs);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .oauth-platforms {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sdkwork-auth-oauth-login {
    padding: var(--spacing-md);
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .oauth-platform-item {
    background: var(--bg-card-dark);
    border-color: var(--border-color-dark);
  }
  
  .oauth-option-btn {
    background: var(--bg-card-dark);
    border-color: var(--border-color-dark);
  }
}
</style>