<template>
  <div class="mobile-music-page">
    <!-- 移动端音乐生成组件 -->
    <SdkworkGenerationMusic 
      ref="musicGenerator"
      @back="$router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SdkworkGenerationMusic } from '@/components/sdkwork-generation-music'
definePage({
    meta: {
        title: '音乐生成' 
    }
})
// 组件引用
const musicGenerator = ref<InstanceType<typeof SdkworkGenerationMusic>>()
</script>

<style lang="scss" scoped>
.mobile-music-page {
  height: 100vh;
  overflow-y: scroll;
  background: var(--bg-color-primary);
}
</style>    