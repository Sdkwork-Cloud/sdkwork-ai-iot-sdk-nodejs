<template>
  <div class="playlist-popup-overlay" @click="$emit('close')">
    <div class="playlist-popup" @click.stop>
      <!-- 顶部tabs -->
      <div class="popup-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'playlist' }"
          @click="activeTab = 'playlist'"
        >
          播放列表
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'hot' }"
          @click="activeTab = 'hot'"
        >
          热门歌曲
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'recommend' }"
          @click="activeTab = 'recommend'"
        >
          推荐歌曲
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="popup-content">
        <!-- 播放列表 -->
        <div v-if="activeTab === 'playlist'" class="tab-content">
          <div class="playlist-header">
            <h3>播放列表</h3>
            <span class="track-count">{{ playlist.length }} 首歌曲</span>
          </div>
          <div class="track-list">
            <div 
              v-for="(track, index) in playlist" 
              :key="track.id || index"
              class="track-item"
              :class="{ active: currentTrackIndex === index }"
              @click="playTrack(track, index)"
            >
              <div class="track-info">
                <div class="track-title">{{ track.title }}</div>
                <div class="track-artist">{{ track.artist }}</div>
              </div>
              <div class="track-duration">{{ formatTime(track.duration || 0) }}</div>
            </div>
          </div>
        </div>

        <!-- 热门歌曲 -->
        <div v-if="activeTab === 'hot'" class="tab-content">
          <div class="playlist-header">
            <h3>热门歌曲</h3>
          </div>
          <div class="track-list">
            <div 
              v-for="(track, index) in hotTracks" 
              :key="track.id || index"
              class="track-item"
              @click="playTrack(track, -1)"
            >
              <div class="track-rank">{{ index + 1 }}</div>
              <div class="track-info">
                <div class="track-title">{{ track.title }}</div>
                <div class="track-artist">{{ track.artist }}</div>
              </div>
              <div class="track-duration">{{ formatTime(track.duration || 0) }}</div>
            </div>
          </div>
        </div>

        <!-- 推荐歌曲 -->
        <div v-if="activeTab === 'recommend'" class="tab-content">
          <div class="playlist-header">
            <h3>推荐歌曲</h3>
          </div>
          <div class="track-list">
            <div 
              v-for="(track, index) in recommendedTracks" 
              :key="track.id || index"
              class="track-item"
              @click="playTrack(track, -1)"
            >
              <div class="track-info">
                <div class="track-title">{{ track.title }}</div>
                <div class="track-artist">{{ track.artist }}</div>
              </div>
              <div class="track-duration">{{ formatTime(track.duration || 0) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import { Track } from '@/stores/modules/player/types'
 
interface Props {
  playlist: Track[]
  currentTrackIndex: number
  hotTracks?: Track[]
  recommendedTracks?: Track[]
}

const props = withDefaults(defineProps<Props>(), {
  playlist: () => [],
  currentTrackIndex: -1,
  hotTracks: () => [],
  recommendedTracks: () => []
})

const emit = defineEmits<{
  'close': []
  'play-track': [track: Track, index: number]
}>()

const playerStore = usePlayerStore()
const activeTab = ref<'playlist' | 'hot' | 'recommend'>('playlist')

// 计算属性
const playlist = computed(() => props.playlist)
const currentTrackIndex = computed(() => props.currentTrackIndex)

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const playTrack = async (track: Track, index: number) => {
  emit('play-track', track, index)
}
</script>

<style scoped>
.playlist-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.playlist-popup {
  background: #1a1a1a;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 500px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-tabs {
  display: flex;
  background: #2a2a2a;
  border-bottom: 1px solid #333;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: var(--theme-color, #007bff);
  border-bottom: 2px solid var(--theme-color, #007bff);
}

.tab-btn:hover {
  color: white;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
}

.playlist-header {
  padding: 20px;
  border-bottom: 1px solid #333;
}

.playlist-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.track-count {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.track-list {
  padding: 0;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #2a2a2a;
  cursor: pointer;
  transition: background 0.2s ease;
}

.track-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.track-item.active {
  background: rgba(var(--theme-color-rgb, 0, 123, 255), 0.1);
}

.track-rank {
  width: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-right: 12px;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.track-duration {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-left: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .playlist-popup {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
  }
  
  .tab-btn {
    padding: 14px;
    font-size: 13px;
  }
  
  .playlist-header {
    padding: 16px;
  }
  
  .track-item {
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  .playlist-popup {
    height: 85vh;
  }
  
  .tab-btn {
    padding: 12px;
    font-size: 12px;
  }
  
  .playlist-header {
    padding: 12px;
  }
  
  .track-item {
    padding: 8px 12px;
  }
}
</style>