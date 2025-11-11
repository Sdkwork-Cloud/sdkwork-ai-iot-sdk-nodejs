<template>
  <div class="sdkwork-feeds-item" :class="themeClass">
    <!-- 用户信息 -->
    <div class="feed-user">
      <img 
        :src="feed.userAvatar || defaultAvatar" 
        :alt="feed.userName"
        class="user-avatar"
        @click="handleUserClick"
      />
      <div class="user-info">
        <div class="user-name" @click="handleUserClick">{{ feed.userName }}</div>
        <div class="feed-time">{{ formatTime(feed.createdAt) }}</div>
      </div>
      <div v-if="feed.isPinned" class="pin-badge">
        <van-icon name="thumb-circle-o" size="14" />
        <span>置顶</span>
      </div>
    </div>

    <!-- 动态内容 -->
    <div class="feed-content">
      <div class="feed-text">{{ feed.content }}</div>
      
      <!-- 图片展示 -->
      <div v-if="feed.images && feed.images.length" class="feed-images">
        <div class="image-grid">
          <img
            v-for="(image, imgIndex) in feed.images.slice(0, 3)"
            :key="imgIndex"
            :src="image"
            :alt="`图片${imgIndex + 1}`"
            class="feed-image"
            @click="handleImagePreview(feed.images, imgIndex)"
          />
          <div v-if="feed.images.length > 3" class="more-images">
            <span>+{{ feed.images.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 互动区域 -->
    <div class="feed-actions">
      <div class="action-item" :class="{ liked: feed.isLiked }" @click="handleLike">
        <van-icon :name="feed.isLiked ? 'good-job' : 'good-job-o'" size="16" />
        <span class="action-count">{{ formatNumber(feed.likeCount || 0) }}</span>
      </div>
      <div class="action-item" @click="handleComment">
        <van-icon name="chat-o" size="16" />
        <span class="action-count">{{ formatNumber(feed.commentCount || 0) }}</span>
      </div>
      <div class="action-item" @click="handleShare">
        <van-icon name="share-o" size="16" />
        <span class="action-count">分享</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showImagePreview } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'

// 动态类型定义
interface Feed {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  images: string[]
  isPinned: boolean
  isLiked: boolean
  likeCount: number
  commentCount: number
  createdAt: string
}

// Props定义
interface Props {
  feed: Feed
}

const props = defineProps<Props>()

// 事件定义
interface Emits {
  (e: 'like', feed: Feed): void
  (e: 'comment', feed: Feed): void
  (e: 'share', feed: Feed): void
  (e: 'user-click', feed: Feed): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 默认头像
const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200.jpg'

// 处理点赞
const handleLike = () => {
  emit('like', props.feed)
}

// 处理评论
const handleComment = () => {
  emit('comment', props.feed)
}

// 处理分享
const handleShare = () => {
  emit('share', props.feed)
}

// 处理用户点击
const handleUserClick = () => {
  emit('user-click', props.feed)
}

// 处理图片预览
const handleImagePreview = (images: string[], index: number) => {
  showImagePreview({
    images,
    startPosition: index,
  })
}

// 格式化时间
const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return date.toLocaleDateString()
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
.sdkwork-feeds-item {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-large, 12px);
  padding: 16px;
  box-shadow: var(--shadow-light);
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #f0f0f0);
}

.sdkwork-feeds-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.feed-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 1px solid var(--border-color, #ebedf0);
  box-shadow: var(--shadow-light);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  line-height: 1.2;
  transition: color 0.2s ease;
  cursor: pointer;
}

.user-name:hover {
  color: var(--color-primary, #1989fa);
}

.feed-time {
  font-size: 12px;
  color: var(--text-secondary, #969799);
  margin-top: 2px;
}

.pin-badge {
  display: flex;
  align-items: center;
  color: var(--color-warning, #ff976a);
  font-size: 12px;
  padding: 2px 6px;
  background: rgba(255, 151, 106, 0.1);
  border-radius: var(--radius-small, 6px);
  transition: all 0.2s ease;
}

.pin-badge:hover {
  background: rgba(255, 151, 106, 0.2);
}

.pin-badge .van-icon {
  margin-right: 2px;
}

.feed-content {
  margin-bottom: 12px;
}

.feed-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary, #323233);
  margin-bottom: 12px;
  word-wrap: break-word;
  transition: color 0.2s ease;
}

.feed-images {
  margin-bottom: 12px;
}

.image-grid {
  display: grid;
  gap: 8px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  position: relative;
}

/* 根据图片数量调整网格布局 */
.image-grid:has(.feed-image:nth-child(1):nth-last-child(1)) {
  grid-template-columns: 1fr;
  max-width: 200px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr;
  max-width: 280px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(3)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(3):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 360px;
}

.feed-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-small, 6px);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.feed-image:hover {
  transform: scale(1.02);
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-small, 6px);
  backdrop-filter: blur(5px);
  transition: background 0.2s ease;
}

.more-images:hover {
  background: rgba(0, 0, 0, 0.8);
}

.feed-actions {
  display: flex;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary, #969799);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s ease;
  border-radius: var(--radius-small, 6px);
}

.action-item:hover {
  color: var(--color-primary, #1989fa);
  background: var(--color-primary-light, rgba(25, 137, 250, 0.1));
  padding: 4px 8px;
}

.action-item.liked {
  color: var(--color-danger, #ee0a24);
}

.action-item.liked:hover {
  color: #d60a1f;
  background: rgba(238, 10, 36, 0.1);
}

.action-count {
  margin-left: 4px;
  font-weight: 500;
  transition: color 0.2s ease;
}

/* 统一主题样式 */
.theme-light {
  --bg-card: #ffffff;
  --bg-page: #f7f8fa;
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
  --bg-card: #1a1a1a;
  --bg-page: #0a0a0a;
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

/* 暗色主题适配 */
.theme-dark .user-avatar {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .sdkwork-feeds-item {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .pin-badge {
  background: rgba(255, 151, 106, 0.15);
  color: var(--color-warning, #ff976a);
}

.theme-dark .pin-badge:hover {
  background: rgba(255, 151, 106, 0.25);
}
</style>