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
      
      <!-- 图片内容 -->
      <FeedImageContent 
        v-if="feed.type === 'image' && feed.images" 
        :images="feed.images"
      />
      
      <!-- 视频内容 -->
      <FeedVideoContent 
        v-if="feed.type === 'video' && feed.video" 
        :video-url="feed.video.url"
        :thumbnail="feed.video.thumbnail"
        :title="feed.video.title"
        :duration="feed.video.duration"
      />
      
      <!-- 音频内容 -->
      <FeedAudioContent 
        v-if="feed.type === 'audio' && feed.audio" 
        :audio-url="feed.audio.url"
        :title="feed.audio.title"
        :duration="feed.audio.duration"
        :file-size="feed.audio.fileSize"
      />
      
      <!-- 链接内容 -->
      <FeedLinkContent 
        v-if="feed.type === 'link' && feed.link" 
        :link-url="feed.link.url"
        :title="feed.link.title"
        :description="feed.link.description"
        :image="feed.link.image"
      />
      
      <!-- 文件内容 -->
      <FeedFileContent 
        v-if="feed.type === 'file' && feed.files" 
        :files="feed.files"
      />
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
import { useTheme } from '@/hooks/theme/useTheme'
import FeedImageContent from './components/FeedImageContent.vue'
import FeedVideoContent from './components/FeedVideoContent.vue'
import FeedAudioContent from './components/FeedAudioContent.vue'
import FeedLinkContent from './components/FeedLinkContent.vue'
import FeedFileContent from './components/FeedFileContent.vue'

// 文件信息接口
interface FileItem {
  name: string
  size: number
  type?: string
  url?: string
}

// 链接预览接口
interface LinkPreview {
  title?: string
  description?: string
  image?: string
  url: string
}

// 动态类型定义
interface Feed {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  
  // 内容类型和数据
  type: 'text' | 'image' | 'video' | 'audio' | 'link' | 'file'
  
  // 不同类型的内容数据
  images?: string[] // 图片
  video?: {
    url: string
    thumbnail?: string
    title?: string
    duration?: number
  } // 视频
  audio?: {
    url: string
    title?: string
    duration?: number
    fileSize?: number
  } // 音频
  link?: LinkPreview // 链接
  files?: FileItem[] // 文件
  
  // 通用信息
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