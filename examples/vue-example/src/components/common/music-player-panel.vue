<template>
  <!-- 音乐播放器面板 -->
  <SdkworkMusicPlayer
    v-if="showPlayer"
    :mode="playerDisplayMode"
    :enable-close-fullscreen="true"
    width="100%"
    height="100%"
    @close-player="handleCloseGlobalPlayer"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SdkworkMusicPlayer from '@/components/sdkwork-music-player/sdkwork-music-player.vue'
import type { MusicVO } from '@/services/src/service/music/types'
import { usePlayerStore } from '@/stores/modules/player'
import { PlayerDisplayMode } from '@/stores/modules/player/types'

// 使用player store管理状态
const playerStore = usePlayerStore()

// 使用计算属性直接获取状态，简化逻辑
const showPlayer = computed(() => playerStore.showPlayer)
const playerDisplayMode = computed(() => playerStore.playerDisplayMode)
const currentPlayingMusic = computed(() => {
  const track = playerStore.currentTrack
  if (!track) return null
  
  return {
    id: track.id || '',
    title: track.title,
    artist: track.artist,
    src: track.src,
    cover: track.cover || '',
    duration: track.duration || 0
  } as MusicVO
})

const globalPlaylist = computed(() => {
  return playerStore.playlistTracks.map(track => ({
    id: track.id || '',
    title: track.title,
    artist: track.artist,
    src: track.src,
    cover: track.cover || '',
    duration: track.duration || 0
  } as MusicVO))
})

// 关闭全局播放器
const handleCloseGlobalPlayer = () => {
  playerStore.hidePlayer()
  playerStore.stop()
}

// 定义组件名称
defineOptions({
  name: 'MusicPlayerPanel'
})
</script>

<style scoped>
/* 音乐播放器面板样式 */
.music-player-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>