<template>
  <div 
    class="video-list-item" 
    :class="{ 'video-item-selected': selected }"
    @click="handleItemClick"
  >
    <!-- 视频封面 -->
    <div class="video-cover">
      <img 
        :src="video.thumbnailUrl || '/images/video-placeholder.jpg'" 
        :alt="video.title"
        class="cover-image"
        loading="lazy"
      />
      
      <!-- 视频时长 -->
      <div class="video-duration" v-if="video.duration">
        {{ formatDuration(video.duration) }}
      </div>
      
      <!-- 视频状态标签 -->
      <div class="video-status" :class="getStatusClass(video.status)">
        {{ getStatusText(video.status) }}
      </div>
      
      <!-- 播放按钮 -->
      <div class="play-overlay">
        <van-icon name="play-circle-o" size="32" color="white" />
      </div>
    </div>
    
    <!-- 视频信息 -->
    <div class="video-info">
      <!-- 标题 -->
      <h3 class="video-title" :title="video.title">
        {{ video.title || '未命名视频' }}
      </h3>
      
      <!-- 描述 -->
      <p class="video-description" v-if="video.description">
        {{ video.description }}
      </p>
      
      <!-- 元数据 -->
      <div class="video-meta">
        <!-- 分辨率 -->
        <span class="meta-item" v-if="video.resolution">
          <van-icon name="video-o" />
          {{ video.resolution }}
        </span>
        
        <!-- 文件大小 -->
        <span class="meta-item" v-if="video.fileSize">
          <van-icon name="file-o" />
          {{ formatFileSize(video.fileSize) }}
        </span>
        
        <!-- 创建时间 -->
        <span class="meta-item" v-if="video.createdAt">
          <van-icon name="clock-o" />
          {{ formatDate(video.createdAt) }}
        </span>
      </div>
      
      <!-- 操作按钮 -->
      <div class="video-actions" v-if="selectable || deletable">
        <!-- 选择按钮 -->
        <van-button 
          v-if="selectable"
           
          :type="selected ? 'primary' : 'default'"
          @click.stop="handleSelect"
          class="action-btn"
        >
          {{ selected ? '已选' : '选择' }}
        </van-button>
        
        <!-- 删除按钮 -->
        <van-button 
          v-if="deletable"
           
          type="danger" 
          plain
          @click.stop="handleDelete"
          class="action-btn"
        >
          删除
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

// 定义属性
interface Props {
  /** 视频数据 */
  video: any
  /** 索引 */
  index?: number
  /** 是否选中 */
  selected?: boolean
  /** 是否可选择 */
  selectable?: boolean
  /** 是否可删除 */
  deletable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  selected: false,
  selectable: false,
  deletable: false
})

// 定义事件
interface Emits {
  (e: 'select', video: any): void
  (e: 'delete', video: any): void
  (e: 'click', video: any): void
}

const emit = defineEmits<Emits>()
const router = useRouter()

// 格式化时长 (秒转时分秒)
const formatDuration = (seconds: number): string => {
  if (!seconds) return '00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

// 格式化文件大小
const formatFileSize = (size: string | number): string => {
  if (!size) return '0 B'
  
  let numSize = typeof size === 'string' ? parseFloat(size) : size
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  
  while (numSize >= 1024 && unitIndex < units.length - 1) {
    numSize /= 1024
    unitIndex++
  }
  
  return `${numSize.toFixed(1)} ${units[unitIndex]}`
}

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// 获取状态样式类
const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'COMPLETED': 'status-completed',
    'PROCESSING': 'status-processing',
    'FAILED': 'status-failed',
    'DELETED': 'status-deleted',
    'DEFAULT': 'status-default'
  }
  return statusMap[status] || 'status-default'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'COMPLETED': '已完成',
    'PROCESSING': '处理中',
    'FAILED': '失败',
    'DELETED': '已删除',
    'DEFAULT': '默认'
  }
  return statusMap[status] || '未知'
}

// 处理项点击
const handleItemClick = () => {
  emit('click', props.video) 
}

// 处理选择
const handleSelect = () => {
  if (props.selectable) {
    emit('select', props.video)
  }
}

// 处理删除
const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.video)
  }
}
</script>

<style scoped lang="scss">
.video-list-item {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  &.video-item-selected {
    border: 2px solid var(--van-primary-color);
    background: rgba(var(--van-primary-color-rgb), 0.05);
  }
}

.video-cover {
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 16px;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .video-status {
    position: absolute;
    top: 4px;
    left: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    color: white;
    
    &.status-completed {
      background: var(--van-success-color);
    }
    
    &.status-processing {
      background: var(--van-warning-color);
    }
    
    &.status-failed {
      background: var(--van-danger-color);
    }
    
    &.status-deleted {
      background: var(--van-gray-6);
    }
    
    &.status-default {
      background: var(--van-gray-5);
    }
  }
  
  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .play-overlay {
    opacity: 1;
  }
}

.video-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #999;
    
    .van-icon {
      font-size: 12px;
    }
  }
}

.video-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  
  .action-btn {
    flex-shrink: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-list-item {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .video-cover {
    width: 100px;
    height: 75px;
    margin-right: 12px;
  }
  
  .video-title {
    font-size: 15px;
    -webkit-line-clamp: 1;
  }
  
  .video-description {
    font-size: 13px;
    -webkit-line-clamp: 1;
  }
  
  .video-meta {
    gap: 8px;
    
    .meta-item {
      font-size: 11px;
    }
  }
}

@media (max-width: 480px) {
  .video-list-item {
    flex-direction: column;
  }
  
  .video-cover {
    width: 100%;
    height: 160px;
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .video-meta {
    justify-content: space-between;
  }
}
</style>