<template>
  <div class="mobile-video-dialogue-page">
    <!-- 移动端视频对话生成组件 -->
    <SdkworkGenerationVideoDialogue 
      ref="videoDialogueGenerator"
      @back="$router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkGenerationVideoDialogue from '@/components/sdkwork-generation-video-dialogue/sdkwork-generation-video-dialogue.vue'

definePage({
    meta: {
        title: '视频对话生成' 
    }
})

// 组件引用
const videoDialogueGenerator = ref<InstanceType<typeof SdkworkGenerationVideoDialogue>>()
</script>

<style lang="scss" scoped>
.mobile-video-dialogue-page {
  height: 100vh;
  overflow-y: scroll;
  background: var(--bg-color-primary);
}
</style>