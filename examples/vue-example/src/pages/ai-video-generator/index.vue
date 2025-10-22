<template>
  <div class="ai-music-generator-page"> 
    <!-- 使用SDK音乐生成组件 -->
    <SdkworkGeneratorChat />
  </div>
</template>

<script setup lang="ts">
import SdkworkGeneratorChat from '@/components/sdkwork-generator-chat/sdkwork-generator-chat.vue'
</script>

<style scoped>
.ai-music-generator-page { 
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
}

.page-header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.page-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
}
</style>