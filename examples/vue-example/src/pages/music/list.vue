<template>
  <div class="music-list-page dark-mode">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="search-container">
        <sdkwork-search-bar
          v-model="searchKeyword"
          placeholder="搜索音乐、歌手或专辑"
          shape="round"
          background="transparent"
          @search="handleSearch"
          @clear="handleClearSearch"
        />
      </div>
      
      <div class="filter-controls">
        <van-dropdown-menu active-color="#3b82f6">
          <van-dropdown-item v-model="sortBy" :options="sortOptions" @change="handleSortChange" />
          <van-dropdown-item v-model="genreFilter" :options="genreOptions" @change="handleGenreChange" />
        </van-dropdown-menu>
      </div>
    </div>

    <!-- 音乐列表 -->
    <div class="music-list-container">
      <SdkworkMusicList
        ref="musicListRef"
        :api="customApiMethod"
        :selectable="false"
        :searchable="false"
        :deletable="false"
        :page-size="20"
        :auto-load="true"
        :default-keyword="searchKeyword"
        @select="handleMusicSelect"
        @load="handleMusicLoad"
        @click="handleMusicClick"
      >
        <!-- 自定义空状态 -->
        <template #empty>
          <div class="empty-state">
            <van-icon name="music-o" size="48" />
            <p class="empty-title">暂无音乐</p>
            <p class="empty-description">尝试调整搜索条件</p>
          </div>
        </template>
      </SdkworkMusicList>
    </div>




  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { showToast } from 'vant'
import SdkworkMusicList from '@/components/sdkwork-music-list/sdkwork-music-list.vue'
import type { MusicVO } from '@/services/src/service/music/types'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import musicPlayerManager from '@/core/music'

// 响应式数据
const musicListRef = ref<InstanceType<typeof SdkworkMusicList>>()
const searchKeyword = ref('')
const sortBy = ref('latest')
const genreFilter = ref('all')
const currentPlayingMusic = ref<MusicVO | null>(null)

// 播放列表
const playlist = ref<MusicVO[]>([])

// 排序选项
const sortOptions = [
  { text: '最新', value: 'latest' },
  { text: '热门', value: 'popular' },
  { text: '标题', value: 'title' },
  { text: '时长', value: 'duration' }
]

// 流派筛选选项
const genreOptions = [
  { text: '全部', value: 'all' },
  { text: '流行', value: 'pop' },
  { text: '摇滚', value: 'rock' },
  { text: '古典', value: 'classical' },
  { text: '电子', value: 'electronic' },
  { text: '爵士', value: 'jazz' },
  { text: '民谣', value: 'folk' }
]

// 模拟在线音乐资源
const onlineMusicResources = [
  {
    id: 1,
    title: '月光奏鸣曲',
    artist: '贝多芬',
    genre: 'classical',
    duration: 360,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/300/300?random=1',
    description: '贝多芬经典钢琴奏鸣曲',
    popularity: 95,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: '蓝色多瑙河',
    artist: '小约翰·施特劳斯',
    genre: 'classical',
    duration: 420,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/300/300?random=2',
    description: '圆舞曲之王的经典作品',
    popularity: 92,
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    title: '卡农',
    artist: '帕赫贝尔',
    genre: 'classical',
    duration: 300,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/300/300?random=3',
    description: '永恒的经典卡农变奏曲',
    popularity: 98,
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    title: '致爱丽丝',
    artist: '贝多芬',
    genre: 'classical',
    duration: 180,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://picsum.photos/300/300?random=4',
    description: '贝多芬著名的钢琴小品',
    popularity: 90,
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    title: '四季·春',
    artist: '维瓦尔第',
    genre: 'classical',
    duration: 240,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://picsum.photos/300/300?random=5',
    description: '巴洛克时期的经典协奏曲',
    popularity: 88,
    createdAt: '2024-01-11'
  },
  {
    id: 6,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'pop',
    duration: 233,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://picsum.photos/300/300?random=6',
    description: '流行金曲',
    popularity: 96,
    createdAt: '2024-01-10'
  },
  {
    id: 7,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'rock',
    duration: 354,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    cover: 'https://picsum.photos/300/300?random=7',
    description: '摇滚经典',
    popularity: 99,
    createdAt: '2024-01-09'
  },
  {
    id: 8,
    title: 'Take Five',
    artist: 'Dave Brubeck',
    genre: 'jazz',
    duration: 324,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://picsum.photos/300/300?random=8',
    description: '爵士名曲',
    popularity: 85,
    createdAt: '2024-01-08'
  },
  {
    id: 9,
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    genre: 'rock',
    duration: 482,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    cover: 'https://picsum.photos/300/300?random=9',
    description: '摇滚史诗',
    popularity: 97,
    createdAt: '2024-01-07'
  },
  {
    id: 10,
    title: 'Hotel California',
    artist: 'Eagles',
    genre: 'rock',
    duration: 391,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    cover: 'https://picsum.photos/300/300?random=10',
    description: '经典摇滚',
    popularity: 94,
    createdAt: '2024-01-06'
  }
]

// 自定义API方法
const customApiMethod = async (pageableParams: Pageable): Promise<Page<MusicVO|any>|any> => {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredMusics = [...onlineMusicResources]
    
    // 搜索过滤
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filteredMusics = filteredMusics.filter(music => 
        music.title.toLowerCase().includes(keyword) ||
        music.artist.toLowerCase().includes(keyword) ||
        music.description.toLowerCase().includes(keyword)
      )
    }
    
    // 流派过滤
    if (genreFilter.value !== 'all') {
      filteredMusics = filteredMusics.filter(music => music.genre === genreFilter.value)
    }
    
    // 排序
    switch (sortBy.value) {
      case 'latest':
        filteredMusics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popular':
        filteredMusics.sort((a, b) => b.popularity - a.popularity)
        break
      case 'title':
        filteredMusics.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'duration':
        filteredMusics.sort((a, b) => a.duration - b.duration)
        break
    }
    
    // 分页处理
    const { page = 0, size = 20 } = pageableParams
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedMusics = filteredMusics.slice(startIndex, endIndex)
    
    // 更新播放列表
    playlist.value = filteredMusics
    
    return {
      content: paginatedMusics,
      totalElements: filteredMusics.length,
      totalPages: Math.ceil(filteredMusics.length / size),
      size: size,
      number: page,
      first: page === 0,
      last: endIndex >= filteredMusics.length,
      empty: filteredMusics.length === 0
    }
  } catch (error) {
    console.error('获取音乐列表失败:', error)
    throw error
  }
}

// 事件处理
const handleSearch = () => {
  if (musicListRef.value) {
    musicListRef.value.refresh()
  }
}

const handleClearSearch = () => {
  searchKeyword.value = ''
  handleSearch()
}

const handleSortChange = () => {
  handleSearch()
}

const handleGenreChange = () => {
  handleSearch()
}

const handleMusicSelect = async (music: MusicVO) => {
  // 使用nextTick确保DOM更新后再进行播放
  await nextTick()
  
  console.log('🎵 [MusicList] handleMusicSelect调用:', music.title)
  
  // 使用音乐播放管理器，根据逻辑自动判断播放模式
  try {
    console.log('🎵 [MusicList] 调用musicPlayerManager.play')
    
    // 检查当前播放状态
    const currentState = musicPlayerManager.getState()
    console.log('🎵 [MusicList] 当前播放状态:', currentState)
    
    // 调用播放管理器进行智能播放
    musicPlayerManager.play(music, playlist.value)
    console.log('🎵 [MusicList] musicPlayerManager.play调用完成')
    
    // 更新本地状态
    currentPlayingMusic.value = music
    showToast(`开始播放: ${music.title}`)
  } catch (error) {
    console.error('🎵 [MusicList] 播放失败:', error)
    showToast(`播放失败: ${error}`)
  }
}

const handleMusicClick = (music: MusicVO) => {
  // 点击音乐项的处理逻辑
  console.log('点击音乐:', music.title)
}

const handleMusicLoad = (pageData: Page<MusicVO>) => {
  console.log('音乐列表加载完成:', pageData.content.length, '首音乐')
}

const openPlayer = () => {
  if (currentPlayingMusic.value) {
    // 使用全局音乐播放管理器打开播放器
    window.$music.play(currentPlayingMusic.value, playlist.value, 'fullscreen')
  }
}

// 监听搜索关键词变化
watch(searchKeyword, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // 防抖搜索
    clearTimeout((window as any).searchTimeout)
    ;(window as any).searchTimeout = setTimeout(() => {
      handleSearch()
    }, 300)
  }
})

// 组件挂载时初始化
onMounted(() => {
  // 初始化播放列表
  playlist.value = onlineMusicResources
  
  // 确保全局音乐播放管理器已初始化
  if (!window.$music) {
    window.$music = musicPlayerManager
  }
})
</script>

<style scoped lang="scss">
.music-list-page {
  min-height: 100dvh;
  background: #000000;
  color: #ffffff;
}

.filter-section {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(30px);
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-container {
  margin-bottom: 12px;
}

.filter-controls {
  :deep(.van-dropdown-menu) {
    background: transparent;
    
    .van-dropdown-menu__bar {
      background: transparent;
      box-shadow: none;
    }
    
    .van-dropdown-menu__title {
      color: #e2e8f0;
      font-size: 14px;
    }
  }
}

.music-list-container {
  padding: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  
  .dark-mode & {
    color: #a0aec0;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    margin: 16px 0 8px;
  }
  
  .empty-description {
    font-size: 14px;
    margin-bottom: 20px;
    opacity: 0.7;
  }
}

.player-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  
  .dark-mode & {
    background: rgba(26, 32, 44, 0.95);
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.current-cover {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.track-info {
  .track-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a202c;
    
    .dark-mode & {
      color: #e2e8f0;
    }
  }
  
  .track-artist {
    font-size: 12px;
    color: #64748b;
    
    .dark-mode & {
      color: #a0aec0;
    }
  }
}

.player-actions {
  flex-shrink: 0;
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    padding: 12px 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-right {
    align-self: flex-end;
  }
  
  .filter-section {
    padding: 12px 16px;
  }
  
  .stats-section {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .music-list-container {
    padding: 10px;
  }
  
  .player-controls {
    padding: 10px 16px;
  }
  
  .track-info {
    .track-title {
      font-size: 13px;
    }
    
    .track-artist {
      font-size: 11px;
    }
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .player-info {
    gap: 8px;
  }
  
  .current-cover {
    width: 32px;
    height: 32px;
  }
}

// 滚动条样式
:deep(.van-list) {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    
    .dark-mode & {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
    
    .dark-mode & {
      background: #4a5568;
    }
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
    
    .dark-mode & {
      background: #718096;
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 无障碍支持
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

// 高对比度支持
@media (prefers-contrast: high) {
  .music-list-page {
    background: #ffffff;
    color: #000000;
    
    &.dark-mode {
      background: #000000;
      color: #ffffff;
    }
  }
  
  .stat-item {
    border: 2px solid #000000;
    
    .dark-mode & {
      border: 2px solid #ffffff;
    }
  }
}
</style>