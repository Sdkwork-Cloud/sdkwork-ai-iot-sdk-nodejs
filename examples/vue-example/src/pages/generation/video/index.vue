<template>
  <div class="mobile-video-page">
    <!-- 移动端视频生成组件 -->
    <SdkworkGenerationVideo 
      ref="videoGenerator"
      @back="$router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkGenerationVideo from '@/components/sdkwork-generation-video/sdkwork-generation-video.vue'
definePage({
    meta: {
        title: '视频生成' 
    }
})
// 组件引用
const videoGenerator = ref<InstanceType<typeof SdkworkGenerationVideo>>()
</script>

<style lang="scss" scoped>
.mobile-video-page {
  height: 100vh;
  overflow-y: scroll;
  background: var(--bg-color-primary);
}
</style>