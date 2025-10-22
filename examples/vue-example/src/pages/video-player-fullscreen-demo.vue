<template>
  <div class="demo-container">
    <h1>视频播放器 - Fullscreen Mode 演示</h1>
    
    <div class="demo-section">
      <h2>Fullscreen Mode 示例</h2>
      <sdkwork-video-player
        ref="fullscreenPlayer"
        src="https://vjs.zencdn.net/v/oceans.mp4"
        poster="https://vjs.zencdn.net/v/oceans.png"
        mode="fullscreen"
        @ready="onPlayerReady"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkVideoPlayer from '@/components/sdkwork-video-player/sdkwork-video-player.vue'

const fullscreenPlayer = ref<InstanceType<typeof SdkworkVideoPlayer>>()

const onPlayerReady = (player: any) => {
  console.log('Fullscreen player ready:', player)
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>