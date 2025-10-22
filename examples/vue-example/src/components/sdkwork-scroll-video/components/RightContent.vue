<template>
  <div class="right-content">
    <!-- 用户信息 -->
    <div class="user-info">
      <span class="username">@{{ video.author?.username || '未知用户' }}</span>
      <van-tag v-if="video.author?.verified" type="primary" size="medium">
        已认证
      </van-tag>
    </div>
    
    <!-- 视频描述 -->
    <div class="video-desc">
      {{ video.description }}
    </div>
    
    <!-- 音乐信息 -->
    <div class="music-info" @click="handleMusicClick(video.music)">
      <van-icon name="music-o" color="#fff" size="14" />
      <span class="music-name">{{ video.music?.name || '原声' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ScrollVideoItem, VideoMusic } from '../types'

interface Props {
  video: ScrollVideoItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  musicClick: [music: VideoMusic]
}>()

const handleMusicClick = (music: VideoMusic | undefined) => {
  if (music) {
    emit('musicClick', music)
  }
}
</script>

<style scoped lang="scss">
.right-content {
  position: absolute;
  left: 16px;
  bottom: 120px;
  color: #fff;
  z-index: 10;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .username {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .video-desc {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
    max-width: 70%;
  }
  
  .music-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    opacity: 0.8;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .right-content {
    left: 12px;
    bottom: 100px;
    
    .video-desc {
      max-width: 80%;
    }
  }
}
</style>