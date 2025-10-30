<template>
  <div class="sdkwork-user-profile">
    <!-- 用户信息卡片 -->
    <sdkwork-cell-group class="user-card">
      <sdkwork-cell center>
        <template #icon>
          <div class="avatar-container" @click="handleAvatarEdit">
            <van-image
              v-if="userProfile?.avatar"
              :src="userProfile.avatar"
              width="60"
              height="60"
              round
              fit="cover"
            />
            <div v-else class="avatar-placeholder">
              {{ getInitials(userProfile?.name || '用户') }}
            </div>
          </div>
        </template>
        <template #title>
          <div class="user-info">
            <div class="user-name">{{ userProfile?.name || '未设置用户名' }}</div>
            <div class="user-id">ID: {{ userProfile?.id || '未设置' }}</div>
          </div>
        </template>
        <template #right-icon>
          <van-icon name="edit" @click="handleEditProfile" />
        </template>
      </sdkwork-cell>
      
      <sdkwork-cell v-if="userProfile?.bio" :title="userProfile.bio" label="个人简介" />
    </sdkwork-cell-group>

    <!-- 基本信息 -->
    <sdkwork-cell-group title="基本信息">
      <sdkwork-cell title="手机号" :value="userProfile?.phone || '未设置'" is-link @click="handleEditPhone" />
      <sdkwork-cell title="邮箱" :value="userProfile?.email || '未设置'" is-link @click="handleEditEmail" />
      <sdkwork-cell title="位置" :value="userProfile?.location || '未设置'" is-link @click="handleEditLocation" />
    </sdkwork-cell-group>

    <!-- 设置 -->
    <sdkwork-cell-group title="设置">
      <sdkwork-cell title="通知设置" is-link @click="handleNotificationSettings" />
      <sdkwork-cell title="隐私设置" is-link @click="handlePrivacySettings" />
      <sdkwork-cell title="语言设置" :value="getLanguageLabel(userSettings.language)" is-link @click="handleLanguageChange" />
    </sdkwork-cell-group>

    <!-- 统计信息 -->
    <sdkwork-cell-group title="统计信息" v-if="showStats">
      <sdkwork-cell title="对话数量" :value="userStats.total_conversations || 0" />
      <sdkwork-cell title="消息数量" :value="userStats.total_messages || 0" />
      <sdkwork-cell title="设备数量" :value="userStats.total_devices || 0" />
      <sdkwork-cell title="智能体数量" :value="userStats.total_agents || 0" />
      <sdkwork-cell 
        v-if="userStats.last_active" 
        title="最后活跃" 
        :value="formatLastActive(userStats.last_active)" 
      />
    </sdkwork-cell-group>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <div class="button-group">
        <van-button round block type="primary" @click="handleSave" class="save-btn">保存修改</van-button>
      </div>
      <div class="button-group">
        <van-button round block type="default" @click="handleLogout" class="logout-btn">退出登录</van-button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <sdkwork-popup v-model:show="showEditPopup" position="bottom" round>
      <van-form @submit="handleFormSubmit">
        <sdkwork-cell-group>
          <van-field
            v-model="editForm.name"
            label="姓名"
            placeholder="请输入姓名"
          />
          <van-field
            v-model="editForm.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
          />
          <van-field
            v-model="editForm.email"
            label="邮箱"
            placeholder="请输入邮箱"
            type="email"
          />
          <van-field
            v-model="editForm.location"
            label="位置"
            placeholder="请输入位置"
          />
          <van-field
            v-model="editForm.bio"
            label="个人简介"
            placeholder="请输入个人简介"
            type="textarea"
            rows="2"
          />
        </sdkwork-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </sdkwork-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/stores/modules/user/user'
import { useAuthStore } from '@/stores/modules/auth/auth' 

// Props定义
interface Props {
  // 用户数据
  userData?: any
  // 是否可编辑
  editable?: boolean
  // 是否显示统计信息
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  showStats: true
})

// Emits定义
const emit = defineEmits<{
  // 用户信息更新
  'update:user': [userData: any]
  // 基本信息更新
  'basic-info-change': [info: any]
  // 设置更新
  'settings-change': [settings: any]
  // 退出登录
  'logout': []
}>()

// 响应式数据
const showEditPopup = ref(false)
const editForm = reactive({
  name: '',
  phone: '',
  email: '',
  location: '',
  bio: ''
})

// 主题相关
const userStore = useUserStore()
const currentTheme = computed(() => {
  const theme = userStore.userSettings?.theme || 'auto'
  if (theme === 'auto') {
    // 检测系统主题
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
})

// 监听主题变化
watch(currentTheme, (newTheme) => {
  updateTheme(newTheme)
})

onMounted(() => {
  updateTheme(currentTheme.value)
})

// 更新主题
const updateTheme = (theme: string) => {
  const root = document.querySelector('.sdkwork-user-profile') as HTMLElement
  if (root) {
    root.setAttribute('data-theme', theme)
  }
}

// 计算属性
const userProfile = computed(() => props.userData?.profile || {
  id: '',
  name: '',
  phone: '',
  email: '',
  location: '',
  bio: '',
  avatar: ''
})

const userStats = computed(() => props.userData?.stats || {})
const userSettings = computed(() => props.userData?.settings || {
  language: 'zh-CN',
  notifications: { enabled: true }
})

// 方法定义
const getInitials = (name: string): string => {
  return name.slice(0, 2).toUpperCase()
}

const getLanguageLabel = (language: string): string => {
  const languageMap = {
    'zh-CN': '简体中文',
    'en-US': 'English'
  }
  return languageMap[language as keyof typeof languageMap] || language
}

const formatLastActive = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 事件处理
const handleAvatarEdit = () => {
  if (!props.editable) return
  showToast('头像编辑功能开发中')
}

const handleEditProfile = () => {
  if (!props.editable) return
  Object.assign(editForm, userProfile.value)
  showEditPopup.value = true
}

const handleEditPhone = () => {
  if (!props.editable) return
  showDialog({
    title: '修改手机号',
    message: '请输入新的手机号码',
    showCancelButton: true,
    beforeClose: (action) => {
      if (action === 'confirm') showToast('手机号修改成功')
    }
  })
}

const handleEditEmail = () => {
  if (!props.editable) return
  showDialog({
    title: '修改邮箱',
    message: '请输入新的邮箱地址',
    showCancelButton: true,
    beforeClose: (action) => {
      if (action === 'confirm') showToast('邮箱修改成功')
    }
  })
}

const handleEditLocation = () => {
  if (!props.editable) return
  showDialog({
    title: '修改位置',
    message: '请输入新的位置信息',
    showCancelButton: true,
    beforeClose: (action) => {
      if (action === 'confirm') showToast('位置修改成功')
    }
  })
}

const handleNotificationSettings = () => {
  showDialog({
    title: '通知设置',
    message: '通知设置功能开发中',
    showCancelButton: false
  })
}

const handlePrivacySettings = () => {
  showDialog({
    title: '隐私设置',
    message: '隐私设置功能开发中',
    showCancelButton: false
  })
}

const handleLanguageChange = () => {
  showDialog({
    title: '语言设置',
    message: '语言设置功能开发中',
    showCancelButton: false
  })
}

const handleFormSubmit = () => {
  emit('basic-info-change', { ...editForm })
  showEditPopup.value = false
  showToast('个人信息更新成功')
}

const handleSave = () => {
  emit('basic-info-change', { ...userProfile.value })
  showToast('修改已保存')
}

const handleLogout = async (options?: { redirectToHome?: boolean; redirectUrl?: string }) => {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
    confirmButtonColor: '#ee0a24',
    beforeClose: async (action) => {
      if (action === 'confirm') {
        try {
          const authStore = useAuthStore()
          await authStore.logout(options)
          emit('logout')
          showToast('已退出登录')
          return true // 允许对话框关闭
        } catch (error) {
          console.error('退出登录失败:', error)
          showToast('退出登录失败，请重试')
          return false // 阻止对话框关闭
        }
      }
      return true // 对于取消操作，允许对话框关闭
    }
  })
}
</script>

<style scoped>
.sdkwork-user-profile {
  min-height: 100dvh; 
  /* 主题变量 */
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e8e8e8;
  --button-primary-bg: linear-gradient(135deg, #07c160 0%, #05a854 100%);
  --button-secondary-bg: #ffffff;
  --button-secondary-color: #666666;
  --button-secondary-hover: #f5f5f5;
}

/* 深色主题 */
@media (prefers-color-scheme: dark) {
  .sdkwork-user-profile {
    --bg-color: #1a1a1a;
    --card-bg: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --border-color: #404040;
    --button-secondary-bg: #404040;
    --button-secondary-color: #cccccc;
    --button-secondary-hover: #4d4d4d;
  }
}

/* 强制深色主题 */
.sdkwork-user-profile[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --card-bg: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #404040;
  --button-secondary-bg: #404040;
  --button-secondary-color: #cccccc;
  --button-secondary-hover: #4d4d4d;
}

/* 强制浅色主题 */
.sdkwork-user-profile[data-theme="light"] {
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e8e8e8;
  --button-secondary-bg: #ffffff;
  --button-secondary-color: #666666;
  --button-secondary-hover: #f5f5f5;
}

/* 微信风格头部 */
.wechat-header {
  position: relative;
  background: linear-gradient(135deg, #07c160 0%, #05a854 100%);
  color: white;
  padding: 40px 20px 20px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.header-content {
  position: relative;
  z-index: 1;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-edit-icon {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #07c160;
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.user-id {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 8px 0;
}

.user-bio {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
}

/* 微信风格设置区域 */
.wechat-settings {
  padding: 16px 0;
}

.settings-group {
  margin-bottom: 16px;
}

.settings-group:last-child {
  margin-bottom: 0;
}

.qrcode-icon {
  color: #07c160;
  font-size: 18px;
}

/* 退出登录区域 */
.logout-section {
  padding: 20px;
  margin-top: 20px;
}

.logout-btn {
  background: white;
  color: #07c160;
  border: 1px solid #07c160;
}

/* 统计信息浮动卡片 */
.stats-floating-card {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
}

.stats-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}

.stat-item {
  text-align: center;
  padding: 8px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #07c160;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  color: #666;
}

.last-active {
  font-size: 10px;
  color: #999;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

/* 头像选择器 */
.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.picker-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.picker-options {
  padding: 20px;
}

.picker-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 0;
  background: none;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.picker-option:last-child {
  border-bottom: none;
}

.picker-option .van-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* 底部操作按钮优化 - 主题自适应 */
.action-buttons {
  padding: 20px 16px;
  background: var(--bg-color);
  margin-top: 20px;
}

.button-group {
  margin-bottom: 12px;
}

.button-group:last-child {
  margin-bottom: 0;
}

.save-btn {
  background: var(--button-primary-bg);
  border: none;
  font-weight: 500;
  font-size: 16px;
  height: 44px;
  color: white;
}

.logout-btn {
  background: var(--button-secondary-bg);
  color: var(--button-secondary-color);
  border: 1px solid var(--border-color);
  font-weight: 400;
  font-size: 16px;
  height: 44px;
}

.logout-btn:hover {
  background: var(--button-secondary-hover);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wechat-header {
    padding: 30px 16px 16px;
  }
  
  .avatar-section {
    gap: 16px;
  }
  
  .avatar, .avatar-placeholder {
    width: 60px;
    height: 60px;
  }
  
  .user-name {
    font-size: 20px;
  }
  
  .stats-floating-card {
    bottom: 16px;
    right: 16px;
    min-width: 180px;
  }
  
  .stats-content {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .action-buttons {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .stats-floating-card {
    position: static;
    margin: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .action-buttons {
    padding: 12px;
  }
  
  .save-btn,
  .logout-btn {
    height: 40px;
    font-size: 15px;
  }
}
</style>