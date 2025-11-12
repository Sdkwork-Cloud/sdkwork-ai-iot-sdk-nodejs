<template>
  <van-popup 
    v-model:show="visible" 
    position="top" 
    :round="false"
    :close-on-click-overlay="false"
    class="background-music-popup"
  >
    <div class="popup-content">
      <!-- 弹窗头部 -->
      <div class="popup-header">
        <!-- 搜索框移到头部 -->
        <div class="search-container">
          <van-search 
            v-model="searchKeyword" 
            placeholder="搜索音乐" 
            @search="searchMusic"
            class="music-search"
          />
        </div>
        
        <div class="close-button" @click="closePopup">
          <Icon icon="ri:close-line" width="20" height="20" />
        </div>
      </div>
      
      <!-- 弹窗主体 -->
      <div class="popup-body">
        
        <!-- 音乐分类标签 -->
        <div class="category-tabs">
          <div 
            v-for="category in musicCategories"
            :key="category.id"
            class="category-tab"
            :class="{ 'active': selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
        
        <!-- 音乐列表 -->
        <div class="music-list">
          <div 
            v-for="music in filteredMusicList"
            :key="music.id"
            class="music-item"
            :class="{ 'active': selectedMusic === music.id }"
            @click="selectMusic(music.id)"
          >
            <div class="music-cover">
              <img :src="music.cover || '/default-music-cover.jpg'" :alt="music.name" />
              <div 
                class="play-overlay" 
                @click.stop="playMusic(music.url)"
                :class="{ 'playing': playingMusicId === music.id }"
              >
                <Icon 
                  :icon="playingMusicId === music.id ? 'ri:pause-fill' : 'ri:play-fill'" 
                  width="20" 
                  height="20" 
                  class="play-icon"
                />
              </div>
            </div>
            <div class="music-info">
              <div class="music-name-artist">
                <div class="music-name">{{ music.name }}</div>
                <div class="music-artist">{{ music.artist }}</div>
              </div>
              <div class="music-duration">{{ formatDuration(music.duration) }}</div>
            </div>
            <div class="music-actions">
              <Icon 
                v-if="selectedMusic === music.id"
                icon="ri:check-line" 
                width="20" 
                height="20" 
                class="check-icon"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="popup-footer">
        <div class="footer-actions">
          <div class="left-area">
            <div class="selected-music-container" v-if="selectedMusicInfo">
              <div class="music-preview">
                <img 
                  :src="selectedMusicInfo.cover || '/default-music-cover.jpg'" 
                  :alt="selectedMusicInfo.name" 
                  class="selected-cover"
                />
                <div class="selected-info">
                  <div class="selected-details">{{ selectedMusicInfo.name }}</div>
                  <div class="selected-duration">{{ formatDuration(selectedMusicInfo.duration) }}</div>
                </div>
                <div class="remove-selection" @click.stop="clearSelection">
                  <Icon icon="ri:close-line" width="14" height="14" />
                </div>
              </div>
            </div>
          </div>
          <div 
            class="confirm-button" 
            :class="{ 'disabled': !selectedMusic && selectedMusic !== '' }"
            @click="confirmSelection"
          >
            <Icon icon="ri:check-double-line" width="16" height="16" />
            <span>确认</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

// 音乐项接口
interface MusicItem {
  id: string
  name: string
  artist: string
  duration: number
  url: string
  cover?: string
  category: string
}

// Props定义
interface Props {
  modelValue: boolean
  defaultMusicId?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultMusicId: ''
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'music-change': [musicId: string]
}>()

// 控制弹窗显示/隐藏
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 搜索关键词
const searchKeyword = ref('')
// 选中的分类
const selectedCategory = ref('all')
// 选中的音乐
const selectedMusic = ref(props.defaultMusicId)
// 当前播放的音乐
const playingMusicId = ref('')

// 音乐分类
const musicCategories = [
  { id: 'all', name: '全部' },
  { id: 'popular', name: '热门' },
  { id: 'calm', name: '平静' },
  { id: 'energetic', name: '活力' },
  { id: 'romantic', name: '浪漫' }
]

// 音乐列表
const musicList = ref<MusicItem[]>([
  {
    id: 'music1',
    name: '轻快假日',
    artist: '未知艺术家',
    duration: 120,
    url: '/music/music1.mp3',
    cover: '/covers/music1.jpg',
    category: 'popular'
  },
  {
    id: 'music2',
    name: '宁静晨曦',
    artist: '音乐创作人',
    duration: 95,
    url: '/music/music2.mp3',
    cover: '/covers/music2.jpg',
    category: 'calm'
  },
  {
    id: 'music3',
    name: '城市节奏',
    artist: 'DJ Sound',
    duration: 180,
    url: '/music/music3.mp3',
    cover: '/covers/music3.jpg',
    category: 'energetic'
  },
  {
    id: 'music4',
    name: '浪漫之舞',
    artist: '钢琴师',
    duration: 145,
    url: '/music/music4.mp3',
    cover: '/covers/music4.jpg',
    category: 'romantic'
  },
  {
    id: 'music5',
    name: '山水之间',
    artist: '民族音乐',
    duration: 210,
    url: '/music/music5.mp3',
    cover: '/covers/music5.jpg',
    category: 'calm'
  },
  {
    id: 'music6',
    name: '电子未来',
    artist: '电子音乐制作人',
    duration: 135,
    url: '/music/music6.mp3',
    cover: '/covers/music6.jpg',
    category: 'energetic'
  }
])

// 根据分类和搜索关键词过滤音乐列表
const filteredMusicList = computed(() => {
  let result = musicList.value

  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(music => music.category === selectedCategory.value)
  }

  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(music => 
      music.name.toLowerCase().includes(keyword) || 
      music.artist.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 获取选中的音乐信息
const selectedMusicInfo = computed(() => {
  if (!selectedMusic.value) return null
  return musicList.value.find(music => music.id === selectedMusic.value)
})

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

// 搜索音乐
const searchMusic = () => {
  // 搜索逻辑已在computed中实现
}

// 选择音乐
const selectMusic = (musicId: string) => {
  selectedMusic.value = musicId
}

// 播放音乐
const playMusic = (musicUrl: string) => {
  // 这里实现音乐播放逻辑
  const music = musicList.value.find(m => m.url === musicUrl)
  if (music) {
    if (playingMusicId.value === music.id) {
      // 如果是当前播放的音乐，则暂停
      playingMusicId.value = ''
    } else {
      // 播放新音乐
      playingMusicId.value = music.id
    }
  }
  
  // 在实际应用中，这里应该使用Audio API播放音乐
  console.log('播放音乐:', musicUrl)
}

// 格式化时长
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}



// 清除选择
const clearSelection = () => {
  selectedMusic.value = ''
  playingMusicId.value = ''
}

// 确认选择
const confirmSelection = () => {
  if (selectedMusic.value !== undefined) {
    emit('music-change', selectedMusic.value)
    closePopup()
  }
}

// 关闭弹窗
const closePopup = () => {
  visible.value = false
}

// 监听弹窗关闭，停止音乐播放
watch(visible, (newVal) => {
  if (!newVal) {
    playingMusicId.value = ''
  }
})
</script>

<style scoped>
/* 弹窗容器样式 */
.background-music-popup {
  z-index: 3000;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.popup-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 122, 255, 0.15);
}

/* 弹窗头部 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 122, 255, 0.1);
  flex-shrink: 0;
  gap: 12px;
}

/* 头部中的搜索框 */
.search-container {
  flex: 1;
  max-width: 300px;
}

.music-search {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 0 12px;
  height: 36px;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

/* 弹窗主体 */
.popup-body {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}



/* 分类标签 */
.category-tabs {
  display: flex;
  padding: 12px 16px 0;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tab.active {
  color: white;
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
}

/* 音乐列表 */
.music-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.music-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.music-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.1);
}

.music-item.active {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.music-cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.music-cover img {
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.play-overlay.playing {
  opacity: 1;
  background: rgba(0, 122, 255, 0.7);
}

.music-item:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
}

.music-info {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.music-name-artist {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.music-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.music-artist {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 0 auto;
}

.music-duration {
  font-size: 12px;
  color: #888;
}

.music-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.check-icon {
  color: #007aff;
}

/* 弹窗底部 */
.popup-footer {
  padding: 0;
  border-top: 1px solid rgba(0, 122, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(244, 247, 252, 0.9) 100%);
  flex-shrink: 0;
  height: 68px; /* 固定高度：16px*2(上下padding) + 36px(按钮高度) */
}

.footer-actions {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
}

.left-area {
  flex: 1;
  min-width: 0;
  height: 36px;
  display: flex;
  align-items: center;
}

.selected-music-container {
  width: 100%;
  height: 100%;
}

.confirm-button {
  width: 80px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
  flex-shrink: 0;
}

.confirm-button:hover:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.confirm-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.selected-music-container .music-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(0, 122, 255, 0.04);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 122, 255, 0.1);
}

.selected-music-container .music-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(0, 122, 255, 0.08), transparent);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.selected-music-container .selected-cover {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid rgba(0, 122, 255, 0.2);
  flex-shrink: 0;
}

.selected-music-container .selected-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-width: 0;
  gap: 2px;
}

.selected-music-container .selected-details {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.selected-music-container .selected-duration {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.selected-music-container .remove-selection {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}

.selected-music-container .remove-selection:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 0;
}

.action-button.secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #555;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.action-button.secondary:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}



.action-button.primary {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

.action-button.primary:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.35);
}

.action-button.primary.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.button-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  opacity: 0;
}

.action-button.primary:hover:not(.disabled) .button-effect {
  animation: buttonShimmer 1.5s infinite;
}

@keyframes buttonShimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 深色主题适配 */
html[data-theme="dark"] .popup-content {
  background: linear-gradient(135deg, #2c2c2e 0%, #1c1c1e 100%);
  box-shadow: 0 10px 40px rgba(0, 122, 255, 0.25);
}

html[data-theme="dark"] .header-title {
  color: #ffffff;
}

html[data-theme="dark"] .music-item {
  background: rgba(44, 44, 46, 0.7);
}

html[data-theme="dark"] .music-item:hover {
  background: rgba(44, 44, 46, 0.9);
}

html[data-theme="dark"] .music-item.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: rgba(0, 122, 255, 0.5);
}

html[data-theme="dark"] .music-name {
  color: #ffffff;
}

html[data-theme="dark"] .music-artist {
  color: #d1d1d6;
}

html[data-theme="dark"] .music-duration {
  color: #98989d;
}

html[data-theme="dark"] .category-tab {
  color: #d1d1d6;
  background: rgba(44, 44, 46, 0.6);
}

html[data-theme="dark"] .popup-footer {
  background: linear-gradient(135deg, rgba(44, 44, 46, 0.9) 0%, rgba(28, 28, 30, 0.9) 100%);
  border-color: rgba(0, 122, 255, 0.2);
}

html[data-theme="dark"] .selected-music-container .music-preview {
  background: rgba(0, 122, 255, 0.08);
  border-color: rgba(0, 122, 255, 0.15);
}

html[data-theme="dark"] .selected-music-container .selected-details {
  color: #ffffff;
}

html[data-theme="dark"] .selected-music-container .selected-duration {
  color: #98989d;
}

html[data-theme="dark"] .selected-music-container .remove-selection {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

html[data-theme="dark"] .selected-music-container .remove-selection:hover {
  background: rgba(255, 255, 255, 0.3);
}

html[data-theme="dark"] .confirm-button {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
}

html[data-theme="dark"] .confirm-button:hover:not(.disabled) {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
}



html[data-theme="dark"] .close-button {
  color: #d1d1d6;
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .close-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

html[data-theme="dark"] .music-search {
  background: rgba(44, 44, 46, 0.8);
}
</style>