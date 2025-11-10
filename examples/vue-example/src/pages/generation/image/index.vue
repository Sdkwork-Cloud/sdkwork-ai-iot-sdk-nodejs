<template>
  <div class="mobile-image-page">
    <!-- 移动端图片生成组件 -->
    <SdkworkGenerationImage 
      ref="imageGenerator"
      @back="$router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SdkworkGenerationImage } from '@/components/sdkwork-generation-image'
definePage({
    meta: {
        title: '图片生成' 
    }
})
// 组件引用
const imageGenerator = ref<InstanceType<typeof SdkworkGenerationImage>>()
</script>

<style lang="scss" scoped>
.mobile-image-page {
  height: 100vh;
  overflow-y: scroll;
  background: var(--bg-color-primary);
}
</style>    