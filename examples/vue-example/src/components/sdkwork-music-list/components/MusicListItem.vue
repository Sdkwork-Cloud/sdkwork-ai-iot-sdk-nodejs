<template>
  <div 
    class="music-list-item" 
    :class="{ 
      'music-item-selected': selected,
      'music-item-playing': isPlaying,
      'no-border': !props.showBorderBottom
    }"
    :data-theme="props.themeMode"
    @click="handleItemClick"
  >
    <!-- 序号 -->
    <div class="music-index" v-if="showIndex">
      <span class="index-number">{{ index + 1 }}</span>
      <div v-if="isPlaying" class="playing-indicator">
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
      </div>
    </div>

    <!-- 音乐封面 -->
    <div class="music-cover">
      <img 
        :src="music.cover || music.thumbnailUrl || '/images/music-placeholder.jpg'" 
        :alt="music.title"
        class="cover-image"
        loading="lazy"
      />
       
      
      <!-- 音乐时长 -->
      <div class="music-duration" v-if="music.duration">
        {{ formatDuration(music.duration) }}
      </div>
    </div>
    
    <!-- 音乐信息 -->
    <div class="music-info">
      <!-- 标题和艺术家 -->
      <div class="music-main-info">
        <h3 class="music-title" :title="music.title">
          {{ music.title || '未命名音乐' }}
        </h3>
        <p class="music-artist" v-if="music.artist">
          {{ music.artist }}
        </p>
      </div>
      
      <!-- 专辑信息 -->
      <p class="music-album" v-if="music.album">
        {{ music.album }}
      </p>
      
      <!-- 标签信息 -->
      <div class="music-tags" v-if="music.genre || music.quality">
        <span class="music-tag" v-if="music.genre">{{ music.genre }}</span>
        <span class="music-tag quality-tag" v-if="music.quality">{{ music.quality }}</span>
      </div>
    </div>
    
    <!-- 操作区域 -->
    <div class="music-actions">
      <!-- 时长 -->
      <div class="music-time" v-if="music.duration">
        {{ formatDuration(music.duration) }}
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn like-btn" @click.stop="handleLike" :class="{ 'liked': isLiked }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        
        <button class="action-btn more-btn" @click.stop="handleMore">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { showToast } from 'vant'

// 定义属性
interface Props {
  /** 音乐数据 */
  music: any
  /** 索引 */
  index?: number
  /** 是否选中 */
  selected?: boolean
  /** 是否可选择 */
  selectable?: boolean
  /** 是否可删除 */
  deletable?: boolean
  /** 是否显示序号 */
  showIndex?: boolean
  /** 主题模式：'dark' | 'light' | 'auto' */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 是否显示边框 */
  showBorderBottom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  selected: false,
  selectable: false,
  deletable: false,
  showIndex: false,
  themeMode: 'auto',
  showBorderBottom: false
})

// 定义事件
interface Emits {
  (e: 'click', music: any): void 
  (e: 'like', music: any): void
  (e: 'more', music: any): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isLiked = ref(false)

// 计算属性
const isPlaying = computed(() => {
  // 检查全局音乐播放器是否存在
  if (!window.$music) return false
  
  try {
    const state = window.$music.getState()
    // 安全地检查当前播放的曲目
    return state.currentTrack?.id === props.music.id && state.isPlaying
  } catch (error) {
    console.warn('获取播放状态失败:', error)
    return false
  }
})

// 格式化时长 (秒转时分秒)
const formatDuration = (seconds: number): string => {
  if (!seconds) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}



// 处理项点击
const handleItemClick = () => {
  emit('click', props.music) 
}

// 处理喜欢
const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', props.music)
  showToast(isLiked.value ? '已添加到喜欢' : '已取消喜欢')
}

// 处理更多操作
const handleMore = () => {
  emit('more', props.music)
}
</script>

<style scoped lang="scss">
.music-list-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 10px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  border: 1px solid #f0f0f0;
  
  &:hover {
    background: #f8f9fa;
    border-color: #e1e5e9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  &.music-item-selected {
    background: rgba(0, 123, 255, 0.05);
    border-color: rgba(0, 123, 255, 0.2);
  }
  
  &.music-item-playing {
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.03), rgba(0, 123, 255, 0.08));
    border-color: rgba(0, 123, 255, 0.3);
  }
}

/* 主题模式支持 */
.music-list-item[data-theme="dark"] {
  background: #1a1a1a;
  border: 1px solid #333;
  
  &:hover {
    background: #2a2a2a;
    border-color: #444;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &.music-item-selected {
    background: rgba(0, 123, 255, 0.15);
    border-color: rgba(0, 123, 255, 0.4);
  }
  
  &.music-item-playing {
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.2));
    border-color: rgba(0, 123, 255, 0.5);
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .music-list-item[data-theme="auto"] {
    background: #1a1a1a;
    border: 1px solid #333;
    
    &:hover {
      background: #2a2a2a;
      border-color: #444;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    &.music-item-selected {
      background: rgba(0, 123, 255, 0.15);
      border-color: rgba(0, 123, 255, 0.4);
    }
    
    &.music-item-playing {
      background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.2));
      border-color: rgba(0, 123, 255, 0.5);
    }
  }
}

.music-index {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  
  .index-number {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    transition: all 0.3s ease;
  }
  
  .playing-indicator {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;
    margin-top: 4px;
    
    .wave-bar {
      width: 2px;
      background: #007bff;
      border-radius: 1px;
      animation: wave 1.2s ease-in-out infinite;
      
      &:nth-child(1) { height: 6px; animation-delay: 0s; }
      &:nth-child(2) { height: 10px; animation-delay: 0.2s; }
      &:nth-child(3) { height: 8px; animation-delay: 0.4s; }
    }
  }
}

/* 主题模式支持 */
.music-list-item[data-theme="dark"] {
  .music-index {
    .index-number {
      color: #cccccc;
    }
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .music-list-item[data-theme="auto"] {
    .music-index {
      .index-number {
        color: #cccccc;
      }
    }
  }
}

.music-cover {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 16px;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .music-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    backdrop-filter: blur(4px);
  }
  
  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;
    
    .play-icon {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #007bff;
      transform: scale(0.8);
      transition: all 0.3s ease;
    }
  }
  
  &:hover {
    .cover-image {
      transform: scale(1.05);
    }
    
    .play-overlay {
      opacity: 1;
      
      .play-icon {
        transform: scale(1);
      }
    }
  }
}

.music-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-right: 16px;
}

.music-main-info {
  margin-bottom: 6px;
}

.music-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-artist {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 主题模式支持 */
.music-list-item[data-theme="dark"] {
  .music-title {
    color: #ffffff;
  }

  .music-artist {
    color: #cccccc;
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .music-list-item[data-theme="auto"] {
    .music-title {
      color: #ffffff;
    }

    .music-artist {
      color: #cccccc;
    }
  }
}

.music-album {
  font-size: 13px;
  color: #999;
  margin: 0 0 8px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-tags {
  display: flex;
  gap: 6px;
  
  .music-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 12px;
    background: #f0f0f0;
    color: #666;
    font-weight: 500;
    
    &.quality-tag {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  }
}

/* 主题模式支持 */
.music-list-item[data-theme="dark"] {
  .music-album {
    color: #aaaaaa;
  }

  .music-tags {
    .music-tag {
      background: #333;
      color: #cccccc;
      
      &.quality-tag {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    }
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .music-list-item[data-theme="auto"] {
    .music-album {
      color: #aaaaaa;
    }

    .music-tags {
      .music-tag {
        background: #333;
        color: #cccccc;
        
        &.quality-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
    }
  }
}

.music-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .music-time {
    font-size: 13px;
    color: #999;
    font-weight: 500;
    min-width: 40px;
    text-align: right;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f0f0f0;
      color: #666;
    }
    
    &.like-btn {
      &.liked {
        color: #ff3b30;
        
        &:hover {
          background: rgba(255, 59, 48, 0.1);
        }
      }
    }
    
    &.more-btn:hover {
      background: #f0f0f0;
      color: #666;
    }
  }
}

/* 主题模式支持 */
.music-list-item[data-theme="dark"] {
  .music-actions {
    .music-time {
      color: #aaaaaa;
    }

    .action-btn {
      color: #aaaaaa;
      
      &:hover {
        background: #333;
        color: #ffffff;
      }
      
      &.like-btn {
        &.liked {
          color: #ff3b30;
          
          &:hover {
            background: rgba(255, 59, 48, 0.2);
          }
        }
      }
      
      &.more-btn:hover {
        background: #333;
        color: #ffffff;
      }
    }
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .music-list-item[data-theme="auto"] {
    .music-actions {
      .music-time {
        color: #aaaaaa;
      }

      .action-btn {
        color: #aaaaaa;
        
        &:hover {
          background: #333;
          color: #ffffff;
        }
        
        &.like-btn {
          &.liked {
            color: #ff3b30;
            
            &:hover {
              background: rgba(255, 59, 48, 0.2);
            }
          }
        }
        
        &.more-btn:hover {
          background: #333;
          color: #ffffff;
        }
      }
    }
  }
}

@keyframes wave {
  0%, 100% { transform: scaleY(0.6); }
  50% { transform: scaleY(1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-list-item {
    padding: 12px 16px;
    margin-bottom: 6px;
  }
  
  .music-index {
    width: 32px;
    margin-right: 12px;
    
    .index-number {
      font-size: 13px;
    }
  }
  
  .music-cover {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
  
  .music-info {
    margin-right: 12px;
  }
  
  .music-title {
    font-size: 15px;
  }
  
  .music-artist {
    font-size: 13px;
  }
  
  .music-album {
    font-size: 12px;
  }
  
  .music-actions {
    gap: 12px;
    
    .music-time {
      font-size: 12px;
      min-width: 35px;
    }
    
    .action-btn {
      width: 32px;
      height: 32px;
    }
  }
}

@media (max-width: 480px) {
  .music-list-item {
    padding: 10px 12px;
  }
  
  .music-index {
    width: 28px;
    margin-right: 8px;
    
    .index-number {
      font-size: 12px;
    }
  }
  
  .music-cover {
    width: 44px;
    height: 44px;
    margin-right: 10px;
  }
  
  .music-info {
    margin-right: 8px;
  }
  
  .music-title {
    font-size: 14px;
  }
  
  .music-artist {
    font-size: 12px;
  }
  
  .music-album {
    display: none;
  }
  
  .music-tags {
    .music-tag {
      font-size: 10px;
      padding: 1px 6px;
    }
  }
  
  .music-actions {
    gap: 8px;
    
    .music-time {
      font-size: 11px;
      min-width: 30px;
    }
    
    .action-buttons {
      gap: 4px;
    }
    
    .action-btn {
      width: 28px;
      height: 28px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>