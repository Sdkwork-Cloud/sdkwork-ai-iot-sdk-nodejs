<template>
  <div class="group-header" :class="themeClass">
    <!-- 背景图 -->
    <div class="header-background">
      <img 
        :src="group?.coverImage || group?.avatar || defaultCover" 
        :alt="group?.name"
        class="background-image"
        @error="handleImageError"
      />
      <div class="background-overlay"></div>
    </div>
    
    <!-- 返回按钮 -->
    <div class="nav-back">
      <Icon icon="tabler:arrow-left" size="24" @click="handleBack" />
    </div>
    
    <!-- 群组基本信息 -->
    <div class="group-info">
      <div class="group-avatar" @click="handleAvatarClick">
        <img
          :src="group?.avatar || defaultAvatar"
          :alt="group?.name"
          class="avatar-image"
          @error="handleAvatarError"
        />
        <div v-if="group?.isOfficial" class="official-badge">官方</div>
        <div v-if="group?.isVerified" class="verified-badge">
          <Icon icon="tabler:circle-check" />
        </div>
      </div>
      
      <div class="group-basic-info">
        <h1 class="group-name">{{ group?.name }}</h1>
        
        <div class="group-tags">
          <van-tag
            v-for="tag in group?.tags?.slice(0, 3)"
            :key="tag"
            type="primary"
            plain
            class="group-tag"
          >
            {{ tag }}
          </van-tag>
          <span
            v-if="group?.tags && group.tags.length > 3"
            class="more-tags"
          >
            +{{ group.tags.length - 3 }}
          </span>
        </div>
        
        <div class="stats-info">
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(group?.memberCount || 0) }}</span>
            <span class="stat-label">成员</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(group?.messageCount || 0) }}</span>
            <span class="stat-label">消息</span>
          </div>
          <div v-if="group?.maxMembers" class="stat-divider"></div>
          <div v-if="group?.maxMembers" class="stat-item">
            <span class="stat-value">{{ group.maxMembers }}</span>
            <span class="stat-label">上限</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/hooks/theme/useTheme'
import { Icon } from '@iconify/vue'

// Props定义
interface Props {
  group?: any
}

const props = withDefaults(defineProps<Props>(), {})

// 事件定义
interface Emits {
  (e: 'back'): void
}

const emit = defineEmits<Emits>()

// 路由
const router = useRouter()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 默认图片
const defaultCover = 'https://picsum.photos/seed/default-cover/800/300.jpg'
const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200.jpg'

// 处理图片错误
const handleImageError = () => {
  console.log('背景图片加载失败')
}

const handleAvatarError = () => {
  console.log('头像加载失败')
}

// 处理返回
const handleBack = () => {
  emit('back')
}

// 处理头像点击 - 进入群组资料页面
const handleAvatarClick = () => {
  if (props.group?.id) {
    router.push(`/group/profile/${props.group.id}`)
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.group-header {
  position: relative;
  padding-bottom: 16px;
  color: #fff;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.5s ease;
}

.group-header:hover .background-image {
  transform: scale(1.08);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.2) 0%, 
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.nav-back {
  position: relative;
  z-index: 2;
  padding: 12px 16px;
}

.nav-back .van-icon {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  padding: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.nav-back .van-icon:hover {
  background: rgba(0, 0, 0, 0.4);
}

.group-info {
  position: relative;
  z-index: 2;
  display: flex;
  padding: 0 16px;
  margin-top: 10px;
}

.group-avatar {
  position: relative;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.group-avatar:hover {
  transform: translateY(-2px);
}

.group-avatar:hover .avatar-image {
  transform: scale(1.05);
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-large, 12px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-light);
  transition: transform 0.3s ease;
}

.official-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-primary, #1989fa);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  font-weight: 500;
}

.verified-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--color-success, #07c160);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: var(--shadow-light);
}

.group-basic-info {
  flex: 1;
  padding-top: 10px;
}

.group-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.group-tag {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.2s ease;
}

.group-tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.more-tags {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  align-self: center;
  transition: color 0.2s ease;
}

.more-tags:hover {
  color: rgba(255, 255, 255, 0.9);
}

.stats-info {
  display: flex;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-1px);
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1;
  transition: opacity 0.2s ease;
}

.stat-item:hover .stat-label {
  opacity: 1;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 16px;
}

/* 统一主题样式变量 */
.theme-light {
  --bg-page: #f7f8fa;
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --bg-secondary: #fafafa;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-primary-light: #ecf5ff;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #ebedf0;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

.theme-dark {
  --bg-page: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --bg-secondary: #222222;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-primary-light: #1a3c5c;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #3a3a3a;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

/* 主题适配 */
.theme-light .group-name,
.theme-dark .group-name {
  color: white;
}
</style>