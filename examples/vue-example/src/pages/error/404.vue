<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <div class="error-content">
      <van-empty image="error" description="页面不存在">
        <template #description>
          <div class="error-description">
            <h3>404 - 页面未找到</h3>
            <p>抱歉，您访问的页面不存在</p>
          </div>
        </template>
        
        <van-button type="primary" @click="goHome">
          返回首页
        </van-button>
      </van-empty>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

definePage({
    meta: {
        title: '页面未找到',
        hideHeader: true
    }
})

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-page {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  
  .error-content {
    text-align: center;
    
    .error-description {
      margin-bottom: 20px;
      
      h3 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 18px;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>