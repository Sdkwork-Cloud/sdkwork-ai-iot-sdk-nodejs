<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <div class="user-info">
      <sdkwork-cell-group>
        <sdkwork-cell title="用户名" :value="userInfo.username" />
        <sdkwork-cell title="邮箱" :value="userInfo.email" />
        <sdkwork-cell title="手机号" :value="userInfo.phone" />
        <sdkwork-cell title="注册时间" :value="userInfo.registerTime" />
      </sdkwork-cell-group>
    </div>
    
    <div class="user-actions">
      <sdkwork-cell-group>
        <sdkwork-cell title="修改密码" is-link @click="goToChangePassword" />
        <sdkwork-cell title="个人信息" is-link @click="goToProfile" />
        <sdkwork-cell title="安全设置" is-link @click="goToSecurity" />
        <sdkwork-cell title="退出登录" is-link @click="handleLogout" />
      </sdkwork-cell-group>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import { useAuthStore } from '@/stores/modules/auth'

definePage({
    meta: {
        title: '用户中心'
    }
})

const router = useRouter()
const authStore = useAuthStore()

// 页面加载处理
const handlePageLoad = () => {
  console.log('页面已加载')
}

const userInfo = ref({
  username: 'admin',
  email: 'admin@sdkwork.com',
  phone: '138****8888',
  registerTime: '2024-01-01'
})

const goToChangePassword = () => {
  router.push('/user/change-password')
}

const goToProfile = () => {
  router.push('/user/profile')
}

const goToSecurity = () => {
  router.push('/user/security')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
</script>

<style scoped lang="scss">
.user-center-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .user-info {
    margin-bottom: 20px;
  }
  
  .user-actions {
    margin-bottom: 20px;
  }
}
</style>

<route>
{
  meta: {
    layout: 'default',
    title: '用户中心'
  }
}
</route>