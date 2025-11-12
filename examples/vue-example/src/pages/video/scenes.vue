<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  > 
    <sdkwork-video-scenes />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import SdkworkVideoScenes from '@/components/sdkwork-video-scenes/sdkwork-video-scenes.vue'
import type { VideoSceneItem, SceneImage } from '@/components/sdkwork-generation-video-scenes/types'
definePage({
    meta: {
        title: '视频分镜' 
    }
})  
 
</script>

<style scoped>
.video-scenes-page { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.actions { display: flex; gap: 8px; }
</style>

