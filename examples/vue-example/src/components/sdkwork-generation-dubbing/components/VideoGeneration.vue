<template>
  <div class="video-generation-section">
    <!-- 视频预览和生成区域 -->
    <div class="video-container">
      <!-- 未生成视频时显示 -->
      <div v-if="!shot.video && !isGeneratingVideo && !isRegeneratingVideo" class="video-placeholder">
        <van-icon name="play-circle-o" size="48" />
        <span class="placeholder-text">点击生成视频</span>
        <van-button
          type="primary"
          size="large"
          round
          @click="handleGenerateVideo"
          :disabled="canGenerateVideo !== true"
          class="generate-video-btn"
        >
          <van-icon name="video-o" />
          生成视频
        </van-button>
        <div v-if="canGenerateVideo !== true" class="disabled-tip">
          <van-icon name="info-o" />
          <span>请先完善内容</span>
        </div>
      </div>
      
      <!-- 生成视频时显示进度 -->
      <div v-else-if="isGeneratingVideo || isRegeneratingVideo" class="video-progress-container">
        <van-circle
          :current-rate="videoProgress / 100"
          :rate="100"
          :speed="100"
          :stroke-width="60"
          color="#1989fa"
          layer-color="#f0f0f0"
          size="80px"
        />
        <span class="progress-text">{{ videoProgressText }}</span>
      </div>
      
      <!-- 已生成视频时显示 -->
      <div v-else class="video-player">
        <video :src="shot.video" controls class="scene-video" />
        <div class="video-actions">
          <van-button
            type="primary"
            size="small"
            round
            @click="handleDownloadVideo"
            class="video-download-btn"
          >
            <van-icon name="down" />
            下载
          </van-button>
          <van-button
            type="default"
            size="small"
            round
            @click="handleRegenerateVideo"
            :loading="isRegeneratingVideo"
            class="video-regenerate-btn"
          >
            <van-icon name="replay" />
            重新生成
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShotItem } from './types.ts'

interface Props {
  shot: ShotItem
  index: number
  canGenerateVideo?: boolean
  contentStatus?: {
    hasImages: boolean
    hasPrompts: boolean
    hasDescription: boolean
    hasDialogue: boolean
    isComplete: boolean
  }
}

interface Emits {
  (e: 'update:shot', shot: ShotItem): void
  (e: 'generate-video', shotId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地状态
const isGeneratingVideo = ref(false)
const isRegeneratingVideo = ref(false)
const videoProgress = ref(0)
const videoProgressText = ref('')

// 生成视频
const handleGenerateVideo = () => {
  // 检查是否可以生成视频
  if (props.canGenerateVideo !== true) {
    return // 提示用户先完善内容
  }
  
  isGeneratingVideo.value = true
  videoProgress.value = 0
  videoProgressText.value = '正在准备视频生成...'
  
  // 触发视频生成事件
  emit('generate-video', props.shot.id)
  
  const progressInterval = setInterval(() => {
    videoProgress.value += 10
    if (videoProgress.value <= 30) {
      videoProgressText.value = '正在分析图像内容...'
    } else if (videoProgress.value <= 60) {
      videoProgressText.value = '正在生成视频帧...'
    } else if (videoProgress.value < 90) {
      videoProgressText.value = '正在渲染视频...'
    } else if (videoProgress.value >= 90) {
      videoProgressText.value = '即将完成...'
    }
    
    if (videoProgress.value >= 100) {
      clearInterval(progressInterval)
      videoProgressText.value = '视频生成完成！'
      setTimeout(() => {
        isGeneratingVideo.value = false
        videoProgressText.value = ''
        
        // 模拟视频生成结果（实际应该通过事件更新shot.video）
        emit('update:shot', { 
          ...props.shot, 
          video: 'https://example.com/video.mp4' // 这里应该是实际生成的视频URL
        })
      }, 1000)
    }
  }, 500)
}

// 重新生成视频
const handleRegenerateVideo = () => {
  isRegeneratingVideo.value = true
  videoProgress.value = 0
  videoProgressText.value = '正在重新生成视频...'
  
  // 触发视频生成事件
  emit('generate-video', props.shot.id)
  
  const progressInterval = setInterval(() => {
    videoProgress.value += 15
    if (videoProgress.value <= 30) {
      videoProgressText.value = '正在分析图像内容...'
    } else if (videoProgress.value <= 60) {
      videoProgressText.value = '正在生成视频帧...'
    } else if (videoProgress.value < 90) {
      videoProgressText.value = '正在渲染视频...'
    } else if (videoProgress.value >= 90) {
      videoProgressText.value = '即将完成...'
    }
    
    if (videoProgress.value >= 100) {
      clearInterval(progressInterval)
      videoProgressText.value = '视频重新生成完成！'
      setTimeout(() => {
        isRegeneratingVideo.value = false
        videoProgressText.value = ''
        
        // 模拟视频生成结果
        emit('update:shot', { 
          ...props.shot, 
          video: 'https://example.com/video-regenerated.mp4' // 这里应该是实际生成的视频URL
        })
      }, 1000)
    }
  }, 400)
}

// 下载视频
const handleDownloadVideo = () => {
  if (!props.shot.video) return
  
  // 创建一个临时链接并触发下载
  const link = document.createElement('a')
  link.href = props.shot.video
  link.download = `scene-${props.index + 1}-video.mp4`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
/* 视频生成区域 - 极简设计 */
.video-generation-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.video-container {
  position: relative;
  width: 100%;
  min-height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
}

.placeholder-text {
  font-size: 16px;
  color: #666;
  font-weight: 400;
}

.generate-video-btn {
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.2);
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 0 24px;
  height: 44px;
}

.generate-video-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(25, 137, 250, 0.3);
}

.disabled-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #ff6b6b;
  margin-top: 8px;
}

.video-progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}

.progress-text {
  font-size: 14px;
  color: #1989fa;
  font-weight: 500;
}

.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.scene-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  border-radius: 12px;
}

.video-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
}

.video-regenerate-btn,
.video-download-btn {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.video-regenerate-btn:hover,
.video-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .video-container {
    background-color: #1e293b;
  }
  
  .video-placeholder {
    background-color: transparent;
  }
  
  .placeholder-text {
    color: #e2e8f0;
  }
  
  .progress-text {
    color: #7dd3fc;
  }
  
  .video-regenerate-btn,
  .video-download-btn {
    background-color: rgba(30, 41, 59, 0.9);
    color: #e2e8f0;
  }
}
</style>