<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 页面标题 -->
    <template #header>
      <div class="page-header">
        <h1 class="page-title">音乐库</h1>
        <p class="page-subtitle">选择您喜欢的音乐进行播放</p>
      </div>
    </template>

    <!-- 音乐列表 -->
    <div class="music-list">
      <div 
        v-for="track in playlist" 
        :key="track.id"
        class="music-card"
        @click="playTrack(track)"
      >
        <div class="card-cover">
          <img :src="track.cover" :alt="track.title" class="cover-image" />
          <div class="play-overlay">
            <Icon icon="mdi:play" class="play-icon" />
          </div>
        </div>
        <div class="card-info">
          <h3 class="track-title">{{ track.title }}</h3>
          <p class="track-artist">{{ track.artist }}</p>
          <div class="track-meta">
            <span class="album-name" v-if="track.album">{{ track.album }}</span>
            <span class="quality-badge">{{ track.quality }}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="action-btn" @click.stop="toggleFavorite(track)">
            <Icon :icon="isFavorite(track.id) ? 'mdi:heart' : 'mdi:heart-outline'" />
          </button>
          <button class="action-btn fullscreen-btn" @click.stop="openFullscreenPlayer(track)">
            <Icon icon="mdi:fullscreen" />
          </button>
        </div>
      </div>
    </div>

    <!-- 底部播放器 -->
    <div class="bottom-player">
      <SdkworkMusicPlayer
        v-if="currentTrack"
        :src="currentTrack.src"
        :title="currentTrack.title"
        :artist="currentTrack.artist"
        :cover="currentTrack.cover"
        :theme-color="themeColor"
        :show-waveform="true"
        :autoplay="false"
        :loop="false"
        :volume="0.7"
        :mode="PlayerDisplayMode.BOTTOM_BAR"
        :playlist="playlist"
        width="100%"
        height="80px"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @mode-change="handleModeChange"
      />
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import SdkworkMusicPlayer from '@/components/sdkwork-music-player/sdkwork-music-player.vue'
import { PlayerDisplayMode } from '@/stores/modules/player/types'

const router = useRouter()

// 页面加载处理
const handlePageLoad = () => {
  console.log('页面已加载')
}

// 响应式数据
const themeColor = ref('#3b82f6')
const currentTrack = ref<any>(null)
const favoriteTracks = reactive<Set<string>>(new Set())

// 音乐播放列表
const playlist:any = [
  {
    id: '1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=1',
    quality: '高品质',
    bitrate: 320,
    duration: 180
  },
  {
    id: '2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=2',
    quality: '标准音质',
    bitrate: 192,
    duration: 210
  },
  {
    id: '3',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=3',
    quality: '无损音质',
    bitrate: 1411,
    duration: 195
  },
  {
    id: '4',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    title: 'SoundHelix Song 4',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=4',
    quality: '高品质',
    bitrate: 320,
    duration: 225
  },
  {
    id: '5',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    title: 'SoundHelix Song 5',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=5',
    quality: '标准音质',
    bitrate: 192,
    duration: 200
  },
  {
    id: '6',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    title: 'SoundHelix Song 6',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=6',
    quality: '高品质',
    bitrate: 320,
    duration: 190
  },
  {
    id: '7',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    title: 'SoundHelix Song 7',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=7',
    quality: '无损音质',
    bitrate: 1411,
    duration: 215
  },
  {
    id: '8',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    title: 'SoundHelix Song 8',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=8',
    quality: '标准音质',
    bitrate: 192,
    duration: 205
  }
]

// 方法
const playTrack = (track: any) => {
  currentTrack.value = track
  // 导航到全屏播放页面
  router.push(`/music/${track.id}`)
}

const openFullscreenPlayer = (track: any) => {
  router.push(`/music/${track.id}`)
}

const toggleFavorite = (track: any) => {
  if (favoriteTracks.has(track.id)) {
    favoriteTracks.delete(track.id)
  } else {
    favoriteTracks.add(track.id)
  }
}

const isFavorite = (trackId: string) => {
  return favoriteTracks.has(trackId)
}

// 播放器事件处理
const handlePlay = () => {
  console.log('开始播放')
}

const handlePause = () => {
  console.log('暂停播放')
}

const handleEnded = () => {
  console.log('播放结束')
}

const handleModeChange = (mode: PlayerDisplayMode) => {
  if (mode === PlayerDisplayMode.FULLSCREEN && currentTrack.value) {
    router.push(`/music/${currentTrack.value.id}`)
  }
}
</script>

<style scoped>
.music-list-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  padding: 20px;
  padding-bottom: 100px; /* 为底部播放器留出空间 */
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #a0a0a0;
}

.music-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.music-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 15px;
  align-items: center;
}

.music-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-cover {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.music-card:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  width: 30px;
  height: 30px;
  color: white;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.album-name {
  font-size: 0.8rem;
  color: #888;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.quality-badge {
  font-size: 0.7rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.card-actions {
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.fullscreen-btn:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.action-btn.active {
  color: #ef4444;
}

.bottom-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-list-page {
    padding: 15px;
    padding-bottom: 90px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .music-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .music-card {
    padding: 15px;
  }
  
  .card-cover {
    width: 60px;
    height: 60px;
  }
  
  .track-title {
    font-size: 1rem;
  }
  
  .track-artist {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .music-list-page {
    padding: 10px;
    padding-bottom: 80px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .music-card {
    padding: 12px;
    gap: 12px;
  }
  
  .card-cover {
    width: 50px;
    height: 50px;
  }
  
  .track-title {
    font-size: 0.95rem;
  }
  
  .track-artist {
    font-size: 0.8rem;
  }
  
  .track-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>