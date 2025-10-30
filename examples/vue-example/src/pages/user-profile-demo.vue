<template>
  <div class="user-profile-demo">
    <div class="demo-header">
      <h1>用户Profile管理演示</h1>
      <p>体验完整的用户信息管理功能</p>
    </div>

    <div class="demo-controls">
      <van-button type="primary" @click="resetUserData">重置数据</van-button>
      <van-button type="warning" @click="toggleEditable">
        {{ editable ? '禁用编辑' : '启用编辑' }}
      </van-button>
      <van-button type="success" @click="loadMockData">加载模拟数据</van-button>
    </div>

    <!-- 用户Profile组件 -->
    <sdkwork-user-profile
      :user-data="userData"
      :editable="editable"
      :show-stats="true"
      :show-settings="true"
      @update:user="handleUserUpdate"
      @avatar-change="handleAvatarChange"
      @basic-info-change="handleBasicInfoChange"
      @social-links-change="handleSocialLinksChange"
      @settings-change="handleSettingsChange"
    />

    <!-- 调试信息 -->
    <div class="debug-panel">
      <h3>调试信息</h3>
      <div class="debug-info">
        <div class="info-item">
          <label>编辑模式:</label>
          <span :class="{ enabled: editable, disabled: !editable }">
            {{ editable ? '已启用' : '已禁用' }}
          </span>
        </div>
        <div class="info-item">
          <label>用户数据:</label>
          <span>{{ userData.userProfile ? '已加载' : '空数据' }}</span>
        </div>
        <div class="info-item">
          <label>统计信息:</label>
          <span>{{ userData.stats ? '已加载' : '空数据' }}</span>
        </div>
      </div>

      <div class="data-preview">
        <h4>当前用户数据:</h4>
        <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant' 

// 定义页面元信息
definePage({
  meta: {
    title: '用户Profile演示',
    description: '用户信息管理功能演示页面'
  }
})

// 响应式数据
const editable = ref(true)
const userData = reactive<Partial<any>>({
  userProfile: null, 
})

// 模拟用户数据
const mockUserData: Partial<any> = {
  userProfile: {
    avatar: 'https://via.placeholder.com/150x150',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86 13800138000',
    bio: '全栈开发者，热爱编程和技术创新',
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
    total_messages: 2894,
    total_devices: 3,
    total_agents: 8,
    online_time: 86400,
    last_active: new Date().toISOString()
  },
  userSettings: {
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      emailVisible: false,
      phoneVisible: false
    }
  }
}

// 事件处理函数
const handleUserUpdate = (newUserData: Partial<any>) => {
  Object.assign(userData, newUserData)
  console.log('用户数据更新:', newUserData)
  showToast('用户数据已更新')
}

const handleAvatarChange = (avatarUrl: string) => {
  if (!userData.userProfile) {
    userData.userProfile = {}
  }
  userData.userProfile.avatar = avatarUrl
  console.log('头像更新:', avatarUrl)
  showToast('头像已更新')
}

const handleBasicInfoChange = (info: any) => {
  if (!userData.userProfile) {
    userData.userProfile = {}
  }
  Object.assign(userData.userProfile, info)
  console.log('基本信息更新:', info)
  showToast('基本信息已更新')
}

const handleSocialLinksChange = (links: any) => {
  if (!userData.userProfile) {
    userData.userProfile = {}
  }
  if (!userData.userProfile.socialLinks) {
    userData.userProfile.socialLinks = {}
  }
  Object.assign(userData.userProfile.socialLinks, links)
  console.log('社交链接更新:', links)
  showToast('社交链接已更新')
}

const handleSettingsChange = (settings: any) => {
  if (!userData.userSettings) {
    userData.userSettings = {
      theme: 'light',
      language: 'zh-CN',
      notifications: { email: true, push: true, sms: false },
      privacy: { profileVisible: true, emailVisible: false, phoneVisible: false }
    }
  }
  Object.assign(userData.userSettings, settings)
  console.log('设置更新:', settings)
  showToast('设置已更新')
}

// 操作方法
const resetUserData = () => {
  Object.assign(userData, {
    userProfile: null,
    stats: null,
    userSettings: null
  })
  showToast('用户数据已重置')
}

const toggleEditable = () => {
  editable.value = !editable.value
  showToast(editable.value ? '编辑模式已启用' : '编辑模式已禁用')
}

const loadMockData = () => {
  Object.assign(userData, mockUserData)
  showToast('模拟数据已加载')
}

// 页面加载时初始化
onMounted(() => {
  console.log('用户Profile演示页面已加载')
  // 默认加载模拟数据
  loadMockData()
})
</script>

<style scoped>
.user-profile-demo {
  min-height: 100dvh;
  background: #f5f5f5;
}

.demo-header {
  text-align: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.demo-header h1 {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
}

.demo-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.demo-controls {
  display: flex;
  gap: 10px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.demo-controls .van-button {
  flex: 1;
  min-width: 120px;
}

.debug-panel {
  margin: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.debug-panel h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
}

.debug-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: bold;
  color: #666;
}

.info-item span {
  color: #333;
}

.info-item span.enabled {
  color: #52c41a;
}

.info-item span.disabled {
  color: #ff4d4f;
}

.data-preview h4 {
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.data-preview pre {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .demo-controls {
    flex-direction: column;
  }
  
  .demo-controls .van-button {
    width: 100%;
  }
  
  .debug-panel {
    margin: 10px;
  }
}
</style>