<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <div class="auth-container">
      <div class="auth-header">
        <h1>用户认证</h1>
        <p>请选择您需要的操作</p>
      </div>
      
      <div class="auth-actions">
        <van-button 
          type="primary" 
          size="large" 
          block 
          @click="goToLogin"
          class="auth-button"
        >
          登录
        </van-button>
        
        <van-button 
          type="default" 
          size="large" 
          block 
          @click="goToRegister"
          class="auth-button"
        >
          注册
        </van-button>
        
        <van-button  
          size="small" 
          @click="goToForgotPassword"
          class="forgot-link"
        >
          忘记密码？
        </van-button>
      </div>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

definePage({
  meta: {
    title: '用户认证',
    layout: 'auth',
    hideHeader: true, 
  }
})

const router = useRouter()

const goToLogin = () => {
  router.push('/auth/login')
}

const goToRegister = () => {
  router.push('/auth/register')
}

const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  .auth-container {
    background: white;
    border-radius: 12px;
    padding: 40px 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    
    .auth-header {
      text-align: center;
      margin-bottom: 30px;
      
      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }
      
      p {
        color: #666;
        font-size: 14px;
      }
    }
    
    .auth-actions {
      .auth-button {
        margin-bottom: 15px;
        height: 44px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
      }
      
      .forgot-link {
        width: 100%;
        text-align: center;
        color: #666;
        margin-top: 10px;
      }
    }
  }
}
</style>