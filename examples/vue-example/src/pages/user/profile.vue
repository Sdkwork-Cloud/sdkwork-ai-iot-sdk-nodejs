<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  > 

    <!-- 用户Profile组件 -->
    <sdkwork-user-profile
      v-if="userData"
      :user-profile="userData.profile"
      :user-stats="userData.stats"
      :user-settings="userData.settings"
      :editable="true"
      @avatar-change="handleAvatarChange"
      @basic-info-change="handleBasicInfoChange"
      @social-links-change="handleSocialLinksChange"
      @settings-change="handleSettingsChange"
      @theme-change="handleThemeChange"
      @notification-change="handleNotificationChange"
      @privacy-change="handlePrivacyChange"
      @language-change="handleLanguageChange"
    />

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <van-loading size="24px" vertical>加载用户资料...</van-loading>
    </div>

    <!-- 调试信息面板 -->
    <div class="debug-panel" v-if="showDebug">
      <h3>调试信息</h3>
      <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import SdkworkUserProfile from '@/components/sdkwork-user-profile/sdkwork-user-profile.vue'

// 路由实例
const router = useRouter()

// 页面加载处理
const handlePageLoad = () => {
  console.log('页面已加载')
}

// 响应式数据
const userData = ref<any>(null)
const showDebug = ref(false)

// 模拟用户数据
const mockUserData = {
  profile: {
    id: 'user_001',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86 13800138000',
    avatar: 'https://via.placeholder.com/100x100/007bff/ffffff?text=ZS',
    bio: '全栈开发者，专注于AI和物联网技术',
    location: '北京市朝阳区',
    website: 'https://zhangsan.dev',
    socialLinks: {
      github: 'https://github.com/zhangsan',
      twitter: 'https://twitter.com/zhangsan',
      linkedin: 'https://linkedin.com/in/zhangsan'
    }
  },
  stats: {
    total_conversations: 156,
    total_messages: 2847,
    total_devices: 8,
    total_agents: 3,
    last_active: new Date().toISOString(),
    online_status: 'online'
  },
  settings: {
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profile_visible: 'public',
      activity_visible: 'friends',
      search_visible: true
    }
  }
}

// 生命周期
onMounted(() => {
  loadUserData()
})

// 加载用户数据
const loadUserData = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    userData.value = mockUserData
    showToast('用户资料加载成功')
  } catch (error) {
    console.error('加载用户数据失败:', error)
    showToast('加载失败，请重试')
  }
}

// 事件处理函数
const handleAvatarChange = (avatarData: any) => {
  console.log('头像变更:', avatarData)
  if (userData.value) {
    userData.value.profile.avatar = avatarData.avatar
  }
  showToast('头像更新成功')
}

const handleBasicInfoChange = (basicInfo: any) => {
  console.log('基本信息变更:', basicInfo)
  if (userData.value) {
    userData.value.profile = { ...userData.value.profile, ...basicInfo }
  }
  showToast('基本信息更新成功')
}

const handleSocialLinksChange = (socialLinks: any) => {
  console.log('社交链接变更:', socialLinks)
  if (userData.value) {
    userData.value.profile.socialLinks = socialLinks
  }
  showToast('社交链接更新成功')
}

const handleSettingsChange = (settings: any) => {
  console.log('设置变更:', settings)
  if (userData.value) {
    userData.value.settings = { ...userData.value.settings, ...settings }
  }
  showToast('设置更新成功')
}

const handleThemeChange = (theme: string) => {
  console.log('主题变更:', theme)
  if (userData.value) {
    userData.value.settings.theme = theme
  }
  showToast(`主题已切换为${theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}模式`)
}

const handleNotificationChange = (notifications: any) => {
  console.log('通知设置变更:', notifications)
  if (userData.value) {
    userData.value.settings.notifications = notifications
  }
  showToast('通知设置已更新')
}

const handlePrivacyChange = (privacy: any) => {
  console.log('隐私设置变更:', privacy)
  if (userData.value) {
    userData.value.settings.privacy = privacy
  }
  showToast('隐私设置已更新')
}

const handleLanguageChange = (language: string) => {
  console.log('语言变更:', language)
  if (userData.value) {
    userData.value.settings.language = language
  }
  showToast(`语言已切换为${language === 'zh-CN' ? '中文' : '英文'}`)
}
</script>

<style scoped>
.user-profile-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.debug-panel {
  margin: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.debug-panel h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.debug-panel pre {
  font-size: 12px;
  color: #666;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}
</style>