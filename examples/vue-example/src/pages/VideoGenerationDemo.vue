<template>
  <div class="video-generation-demo">
    <div class="demo-header">
      <h1>视频生成工具</h1>
      <p>使用AI技术生成高质量视频内容</p>
    </div>
    
    <!-- 视频生成组件 -->
    <sdkwork-generation-video />
  </div>
</template>

<script setup lang="ts">
import SdkworkGenerationVideo from '@/components/sdkwork-generation-video/sdkwork-generation-video.vue'
</script>

<style scoped>
.video-generation-demo {
  background: #f5f5f5;
  min-height: 100vh;
}

.demo-header {
  background: white;
  padding: 20px 16px;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}

.demo-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.demo-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>