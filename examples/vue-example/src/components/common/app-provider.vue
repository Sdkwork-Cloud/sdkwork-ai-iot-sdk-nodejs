<script setup lang="ts">
import { defineComponent } from 'vue';
import { useAppProvider } from '@/hooks/useAppProvider';
import MusicPlayerPanel from './music-player-panel.vue';

defineOptions({
  name: 'AppProvider'
});

// 使用 hooks 中的 emitter
const { emitter } = useAppProvider();

// ContextHolder 组件（如果需要保持组件形式）
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    // 全局方法已经在 App.vue 中注册，这里不需要重复注册
    return () => null;
  }
});
</script>

<template>
  <slot></slot>
  
  <!-- 音乐播放器面板 -->
  <MusicPlayerPanel />
</template>

<style scoped></style>