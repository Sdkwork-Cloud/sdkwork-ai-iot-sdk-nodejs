<template>
  <div class="sdkwork-scroll-video">
    <!-- 三缓冲区视频容器 -->
    <div
      ref="scrollContainer"
      class="video-scroll-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @wheel="handleWheel"
    >
      <!-- 三个缓冲区视频项（只用于视频播放） -->
      <div
        v-for="video in visibleVideos"
        :key="video.id"
        class="video-item"
        :class="{
          active: currentIndex === video.originalIndex,
          prev: video.position === 'prev',
          current: video.position === 'current',
          next: video.position === 'next'
        }"
        :style="getVideoStyle(video)"
      >
        <!-- 视频封面（预加载） -->
        <img
          v-if="video.coverUrl && currentIndex !== video.originalIndex"
          :src="video.coverUrl"
          class="video-cover"
          alt="视频封面"
        />
        
        <!-- 加载状态 -->
        <div v-if="video.loading && props.enableLoading" class="loading-overlay">
          <van-loading type="spinner" color="#fff" />
          <span class="loading-text">加载中...</span>
        </div>
      </div>
      
      <!-- 单个播放器实例，动态切换视频源 -->
      <div
        class="video-player"
        :class="{
          current: true
        }"
        :style="getPlayerStyle(currentVideo)"
        @click="togglePlay"
      >
        <SdkworkVideoPlayer
          v-if="currentVideo && currentVideo.videoUrl"
          ref="currentVideoPlayer"
          :src="currentVideo.videoUrl"
          :poster="currentVideo.coverUrl"
          :autoplay="props.autoplay"
          :muted="currentVideo.muted || props.muted"
          :playsInline="true"
          :controls="false"
          mode="fullscreen"
          :preload="currentVideo.preloaded ? 'auto' : 'metadata'"
          :enableLoading="props.enableLoading"
          @loadstart="handleVideoLoadStart"
          @loadedmetadata="handleVideoLoaded"
          @canplay="handleVideoCanPlay"
          @play="handleVideoPlay"
          @pause="handleVideoPause"
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnded"
          @error="handleVideoError"
        />
      </div>
      
      <!-- 数据展示层（只显示当前视频的内容） -->
      <div class="data-overlay" v-if="currentVideo">
        <!-- 左侧内容区子组件 -->
        <RightContent
          :video="currentVideo"
          @musicClick="handleMusicClick"
        />
        
        <!-- 右侧操作栏子组件 -->
        <RightActions
          :video="currentVideo"
          @like="handleLike"
          @comment="handleComment"
          @share="handleShare"
          @follow="handleFollow"
          @userClick="handleUserClick"
          style="pointer-events: auto;"
        />
      </div>
      
      <!-- 固定在底部的播放控制栏 -->
      <div class="bottom-controls-fixed" v-if="currentVideo">
        <!-- 进度条 -->
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${currentVideo.progress || 0}%` }"
          />
        </div>
        
        <!-- 播放控制 -->
        <div class="play-controls">
          <van-icon 
            :name="currentVideo.playing ? 'pause' : 'play'" 
            color="#fff" 
            size="24"
            @click="togglePlay"
          />
          <span class="time-text">
            {{ formatTime(currentVideo.currentTime || 0) }} / {{ formatTime(currentVideo.duration || 0) }}
          </span>
        </div>
      </div>
      
      <!-- 下拉刷新提示 -->
      <div v-if="pullState === 'refresh'" class="pull-refresh-tip" :style="{ top: `${-60 + pullDistance}px` }">
        <van-loading v-if="isRefreshing" type="spinner" color="#fff" />
        <span v-else class="pull-text">下拉刷新</span>
      </div>
      
      <!-- 上拉加载更多提示 -->
      <div v-if="pullState === 'loadmore'" class="pull-loadmore-tip" :style="{ top: `${allVideos.length * getViewportHeight() - pullDistance}px` }">
        <van-loading v-if="isLoadingMore" type="spinner" color="#fff" />
        <span v-else class="pull-text">上拉加载更多</span>
      </div>
    </div>
    
    <!-- 分页加载提示 -->
    <div v-if="loading" class="loading-more">
      <van-loading type="spinner" />
      <span>加载更多...</span>
    </div>
    
    <!-- 评论弹窗 -->
    <SdkworkCommentsListPopup
      v-model="showCommentPopup"
      :title="'视频评论'"
      :params="commentParams"
      @confirm="handleCommentConfirm"
      @close="handleCommentClose"
      style="z-index: 10000;"
    />
    
    <!-- 分享弹窗 -->
    <sdkwork-popup
      v-model:show="showSharePopup"
      position="bottom"
      round
      :style="{ height: '50%', zIndex: 10000 }"
    >
      <SharePanel
        :video="currentVideo"
        @close="showSharePopup = false"
      />
    </sdkwork-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { ScrollVideoItem, VideoAuthor, VideoMusic } from './types'

// 组件导入
import SdkworkVideoPlayer from '@/components/sdkwork-video-player/sdkwork-video-player.vue'
// 使用正确的显示模式常量
const VIDEO_MODE = 'fullscreen'
import SdkworkCommentsListPopup from '@/components/sdkwork-comments-list-popup/sdkwork-comments-list-popup.vue'
import SharePanel from './components/SharePanel.vue'
import RightActions from './components/RightActions.vue'
import RightContent from './components/RightContent.vue'

// 响应式数据
const scrollContainer = ref<HTMLElement>()
const videoPlayer = ref<InstanceType<typeof SdkworkVideoPlayer>>()
const currentIndex = ref(0)
const translateY = ref(0)
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
const loading = ref(false)
const showCommentPopup = ref(false)
const showSharePopup = ref(false)
const commentParams = ref<Record<string, any>>({})
const isSwitchingVideo = ref(false) // 视频切换中标志
const pullState = ref<'none' | 'refresh' | 'loadmore'>('none') // 下拉/上拉状态
const pullDistance = ref(0) // 下拉/上拉距离
const isRefreshing = ref(false) // 刷新中状态
const isLoadingMore = ref(false) // 加载更多中状态

// 视频数据管理
const allVideos = ref<ScrollVideoItem[]>([]) // 所有已加载的视频数据
const totalCount = ref(0) // 总视频数

// 三缓冲区视频管理 - 优化版本
const visibleVideos = computed(() => {
  const videos = []
  const prevIndex = currentIndex.value - 1
  const nextIndex = currentIndex.value + 1
  
  // 上一个视频（缓冲区1）
  if (prevIndex >= 0) {
    videos.push({
      ...allVideos.value[prevIndex],
      index: prevIndex,
      position: 'prev',
      originalIndex: prevIndex
    })
  }
  
  // 当前视频（缓冲区2）
  videos.push({
    ...allVideos.value[currentIndex.value],
    index: currentIndex.value,
    position: 'current',
    originalIndex: currentIndex.value
  })
  
  // 下一个视频（缓冲区3）
  if (nextIndex < allVideos.value.length) {
    videos.push({
      ...allVideos.value[nextIndex],
      index: nextIndex,
      position: 'next',
      originalIndex: nextIndex
    })
  }
  
  return videos
})

const currentVideo = computed<any>(() => allVideos.value[currentIndex.value] || null)

// 组件属性
interface Props {
  /** API请求方法，符合SpringBoot分页标准 */
  api: (params: Pageable) => Promise<Page<ScrollVideoItem>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 每页显示数量 */
  pageSize?: number
  /** 预加载视频数量 */
  preloadCount?: number
  /** 自动播放 */
  autoplay?: boolean
  /** 静音播放 */
  muted?: boolean
  /** 是否启用加载状态显示 */
  enableLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  pageSize: 10,
  preloadCount: 3,
  autoplay: true,
  muted: false,
  enableLoading: false
})

// 组件事件
interface Emits {
  (e: 'video-change', video: ScrollVideoItem, index: number): void
  (e: 'like', video: ScrollVideoItem): void
  (e: 'comment', video: ScrollVideoItem): void
  (e: 'share', video: ScrollVideoItem): void
  (e: 'follow', author: VideoAuthor): void
  (e: 'load', pageData: Page<ScrollVideoItem>): void
}

const emit = defineEmits<Emits>()

// 预加载视频（三缓冲区优化版本）
const preloadVideos = (centerIndex: number) => {
  // 三缓冲区模式：预加载当前、上一个、下一个视频
  const preloadIndices = [
    centerIndex - 1, // 上一个视频
    centerIndex,     // 当前视频
    centerIndex + 1  // 下一个视频
  ]
  
  // 扩展预加载范围，确保流畅体验
  const extendedIndices = [
    centerIndex - 2, // 扩展预加载
    centerIndex + 2  // 扩展预加载
  ]
  
  const allIndices = [...preloadIndices, ...extendedIndices]
  
  for (const index of allIndices) {
    if (index >= 0 && index < allVideos.value.length) {
      const video = allVideos.value[index]
      if (video && !video.preloaded) {
        preloadVideo(video)
      }
    }
  }
}

// 预加载单个视频元数据 - 优化版本
const preloadVideo = (video: ScrollVideoItem) => {
  if (video.preloaded || !video.videoUrl) return
  
  video.preloaded = true // 立即标记为预加载中，避免重复预加载
  
  // 使用更高效的预加载方式
  const videoElement = document.createElement('video')
  videoElement.setAttribute('src', video.videoUrl)
  videoElement.preload = 'metadata'
  videoElement.crossOrigin = 'anonymous'
  
  // 添加超时处理
  const timeoutId = setTimeout(() => {
    videoElement.remove()
    console.warn('视频预加载超时:', video.id)
  }, 10000)
  
  videoElement.onloadeddata = () => {
    clearTimeout(timeoutId)
    video.duration = videoElement.duration
    videoElement.remove()
    console.log('视频预加载完成:', video.id, '时长:', video.duration)
  }
  
  videoElement.onerror = () => {
    clearTimeout(timeoutId)
    console.error('视频预加载失败:', video.id)
    videoElement.remove()
  }
}

// 监听当前索引变化，预加载视频
watch(currentIndex, (newIndex, oldIndex) => {
  preloadVideos(newIndex)
}, { immediate: true })

// 生命周期
onMounted(() => {
  loadVideos()
  setupEventListeners()
})

onUnmounted(() => {
  cleanupEventListeners()
  pauseCurrentVideo()
})

// 事件监听器设置
const setupEventListeners = () => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

const cleanupEventListeners = () => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
}

// 触摸事件处理 - 优化版本
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startY.value = e.touches[0].clientY
  currentY.value = startY.value
  // 重置下拉/上拉状态
  pullState.value = 'none'
  pullDistance.value = 0
  // 暂停当前视频的动画过渡，实现更流畅的拖拽
  const container = scrollContainer.value
  if (container) {
    container.style.transition = 'none'
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  const deltaY = e.touches[0].clientY - currentY.value
  currentY.value = e.touches[0].clientY
  
  // 计算下拉/上拉距离
  const viewportHeight = getViewportHeight()
  const maxPullDistance = 80 // 最大下拉/上拉距离
  
  // 检查是否在边界位置
  const isAtTop = currentIndex.value === 0 && translateY.value >= 0
  const isAtBottom = currentIndex.value === allVideos.value.length - 1 && 
                     translateY.value <= -(allVideos.value.length - 1) * viewportHeight
  
  if (isAtTop && deltaY > 0) {
    // 在顶部下拉刷新（手指向上移动）
    pullState.value = 'refresh'
    pullDistance.value = Math.min(pullDistance.value + deltaY, maxPullDistance)
    translateY.value = pullDistance.value * 0.3 // 添加阻尼效果
  } else if (isAtBottom && deltaY < 0) {
    // 在底部上拉加载更多（手指向下移动）
    pullState.value = 'loadmore'
    pullDistance.value = Math.min(pullDistance.value - deltaY, maxPullDistance)
    translateY.value = -(allVideos.value.length - 1) * viewportHeight - pullDistance.value * 0.3
  } else {
    // 正常滑动
    pullState.value = 'none'
    pullDistance.value = 0
    
    // 限制滑动范围，添加弹性效果
    const maxTranslate = 100 // 允许向上弹性滑动100px
    const minTranslate = -(allVideos.value.length - 1) * viewportHeight - 100 // 允许向下弹性滑动100px
    const newTranslateY = translateY.value - deltaY
    
    // 添加阻尼效果
    if (newTranslateY > maxTranslate) {
      translateY.value = maxTranslate - (newTranslateY - maxTranslate) * 0.3
    } else if (newTranslateY < minTranslate) {
      translateY.value = minTranslate - (newTranslateY - minTranslate) * 0.3
    } else {
      translateY.value = newTranslateY
    }
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  const deltaY = currentY.value - startY.value
  const viewportHeight = getViewportHeight()
  
  // 恢复动画过渡
  const container = scrollContainer.value
  if (container) {
    container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
  
  // 检查是否触发了下拉刷新或上拉加载更多
  const pullThreshold = 60 // 触发下拉/上拉的最小距离
  
  if (pullState.value === 'refresh' && pullDistance.value >= pullThreshold) {
    // 触发下拉刷新
    handlePullToRefresh()
    return
  } else if (pullState.value === 'loadmore' && pullDistance.value >= pullThreshold) {
    // 触发上拉加载更多
    handlePullToLoadMore()
    return
  }
  
  // 判断滑动方向，添加阈值检测
  const threshold = viewportHeight * 0.15 // 15%的阈值
  const velocity = Math.abs(deltaY) / 300 // 计算滑动速度
  
  if (Math.abs(deltaY) > threshold || velocity > 0.5) {
    if (deltaY < 0) {
      // 上拉逻辑（手指向下移动，内容向上滚动）- 切换到下一个视频
      if (currentIndex.value < allVideos.value.length - 1) {
        // 正常切换到下一个视频
        switchToVideo(currentIndex.value + 1)
      } else {
        // 已经到最后一个视频，回弹到当前位置
        animateToCurrentPosition()
      }
    } else if (deltaY > 0) {
      // 下拉逻辑（手指向上移动，内容向下滚动）- 切换到上一个视频
      if (currentIndex.value > 0) {
        // 正常切换到上一个视频
        switchToVideo(currentIndex.value - 1)
      } else {
        // 已经到第一个视频，回弹到当前位置
        animateToCurrentPosition()
      }
    } else {
      // 回弹到当前位置
      animateToCurrentPosition()
    }
  } else {
    // 滑动距离不足，回弹到当前位置
    animateToCurrentPosition()
  }
  
  // 重置下拉/上拉状态
  pullState.value = 'none'
  pullDistance.value = 0
}

// 鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY
  
  // 滚轮向下滚动（delta > 0）：内容向上滚动，切换到下一个视频
  // 滚轮向上滚动（delta < 0）：内容向下滚动，切换到上一个视频
  if (delta > 50 && currentIndex.value < allVideos.value.length - 1) {
    switchToVideo(currentIndex.value + 1)
  } else if (delta < -50 && currentIndex.value > 0) {
    switchToVideo(currentIndex.value - 1)
  }
}

// 下拉刷新处理
const handlePullToRefresh = async () => {
  if (isRefreshing.value || loading.value) return
  
  try {
    isRefreshing.value = true
    pullState.value = 'refresh'
    showToast('刷新中...')
    
    // 重新加载数据
    await loadVideos()
    
    // 重置到第一个视频
    currentIndex.value = 0
    translateY.value = 0
    animateToCurrentPosition()
    
    showToast('刷新成功')
  } catch (error) {
    console.error('刷新失败:', error)
    showToast('刷新失败')
  } finally {
    isRefreshing.value = false
    pullState.value = 'none'
    pullDistance.value = 0
  }
}

// 上拉加载更多处理
const handlePullToLoadMore = async () => {
  if (isLoadingMore.value || loading.value) return
  
  try {
    isLoadingMore.value = true
    pullState.value = 'loadmore'
    showToast('加载更多...')
    
    // 加载更多数据
    await loadMoreVideos()
    
    // 如果加载成功，自动切换到新加载的第一个视频
    if (allVideos.value.length > currentIndex.value + 1) {
      switchToVideo(currentIndex.value + 1)
    } else {
      // 如果没有新数据，回弹到当前位置
      animateToCurrentPosition()
    }
    
    showToast('加载成功')
  } catch (error) {
    console.error('加载更多失败:', error)
    showToast('加载失败')
    // 加载失败时回弹到当前位置
    animateToCurrentPosition()
  } finally {
    isLoadingMore.value = false
    pullState.value = 'none'
    pullDistance.value = 0
  }
}

// 单个播放器实例引用
const currentVideoPlayer = ref<InstanceType<typeof SdkworkVideoPlayer>>()

// 视频事件处理 - 单播放器版本（修复加载状态问题）
const handleVideoLoadStart = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.loading = true
  }
}

const handleVideoLoaded = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.loading = false
    // 从播放器获取duration
    if (currentVideoPlayer.value) {
      currentVideo.value.duration = currentVideoPlayer.value.duration
    }
  }
}

const handleVideoCanPlay = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.loading = false
    // 自动播放当前视频
    if (props.autoplay && !currentVideo.value.playing) {
      currentVideo.value.playing = true
      playCurrentVideo()
    }
  }
}

const handleVideoPlay = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.playing = true
  }
}

const handleVideoPause = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.playing = false
  }
}

const handleTimeUpdate = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value && currentVideoPlayer.value) {
    currentVideo.value.currentTime = currentVideoPlayer.value.currentTime
    if (currentVideoPlayer.value.duration > 0) {
      currentVideo.value.progress = (currentVideoPlayer.value.currentTime / currentVideoPlayer.value.duration) * 100
    }
  }
}

const handleVideoEnded = () => {
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.playing = false
    // 自动播放下一个视频
    if (currentIndex.value < allVideos.value.length - 1) {
      setTimeout(() => switchToVideo(currentIndex.value + 1), 1000)
    }
  }
}

const handleVideoError = (error: any) => {
  console.error('视频播放错误:', error)
  // 由于是单播放器，事件总是针对当前播放的视频
  if (currentVideo.value) {
    currentVideo.value.loading = false
  }
  showToast('视频加载失败')
}

// 操作事件处理
const handleLike = async (video: ScrollVideoItem) => {
  try {
    video.liked = !video.liked
    video.likeCount += video.liked ? 1 : -1
    emit('like', video)
    
    // 模拟API调用
    // await videoApi.like(video.id)
    showToast(video.liked ? '已点赞' : '已取消点赞')
  } catch (error) {
    video.liked = !video.liked
    video.likeCount += video.liked ? -1 : 1
    showToast('操作失败')
  }
}

const handleComment = (video: ScrollVideoItem) => {
  commentParams.value = {
    contentType: 'VIDEO',
    contentId: video.id,
    ...video.commentParams
  }
  showCommentPopup.value = true
  emit('comment', video)
}

const handleCommentConfirm = (comment: any) => {
  // Handle comment submission if needed
  showCommentPopup.value = false
}

const handleCommentClose = () => {
  showCommentPopup.value = false
}

const handleShare = (video: ScrollVideoItem) => {
  showSharePopup.value = true
  emit('share', video)
}

const handleFollow = async (author: VideoAuthor) => {
  try {
    author.followed = !author.followed
    emit('follow', author)
    
    // 模拟API调用
    // await userApi.follow(author.id)
    showToast(author.followed ? '已关注' : '已取消关注')
  } catch (error) {
    author.followed = !author.followed
    showToast('操作失败')
  }
}

const handleMakeSame = (video: ScrollVideoItem) => {
  showToast('开始制作同款视频')
  // 跳转到制作页面或打开制作工具
}

const handleUserClick = (author: VideoAuthor) => {
  // 跳转到用户主页
  console.log('跳转到用户主页:', author.username)
}

const handleMusicClick = (music: VideoMusic) => {
  // 跳转到音乐页面或播放音乐
  console.log('播放音乐:', music?.name)
}

// 数据加载
const loadVideos = async () => {
  try {
    loading.value = true
    const params: Pageable = {
      page: 1,
      size: props.pageSize,
      ...props.params
    }
    
    const pageData:any = await props.api(params)
    allVideos.value = pageData.records.map((video:any) => ({
      ...video,
      loading: true,
      playing: false,
      muted: props.muted,
      progress: 0,
      currentTime: 0,
      preloaded: false
    }))
    
    totalCount.value = pageData.total
    emit('load', pageData)
    
    // 预加载第一个视频
    preloadVideos(0)
  } catch (error) {
    console.error('加载视频失败:', error)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const loadMoreVideos = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    const currentPage = Math.ceil(allVideos.value.length / props.pageSize) + 1
    const params: Pageable = {
      page: currentPage,
      size: props.pageSize,
      ...props.params
    }
    
    const pageData:any = await props.api(params)
    const newVideos = pageData.records.map((video:any) => ({
      ...video,
      loading: true,
      playing: false,
      muted: props.muted,
      progress: 0,
      currentTime: 0,
      preloaded: false
    }))
    
    allVideos.value.push(...newVideos)
    totalCount.value = pageData.total
    emit('load', pageData)
    
    // 预加载当前索引附近的视频
    preloadVideos(currentIndex.value)
  } catch (error) {
    console.error('加载更多视频失败:', error)
  } finally {
    loading.value = false
  }
}

// 视频切换（单播放器）- 优化版本
const switchToVideo = async (index: number) => {
  if (index < 0 || index >= allVideos.value.length) return
  
  if (isSwitchingVideo.value) return
  isSwitchingVideo.value = true
  
  try {
    const oldIndex = currentIndex.value
    const direction = index > oldIndex ? 'down' : 'up'
    
    // 暂停当前视频并重置其状态
    pauseCurrentVideo()
    if (allVideos.value[oldIndex]) {
      allVideos.value[oldIndex].playing = false
      allVideos.value[oldIndex].loading = false
    }
    
    // 设置新视频的加载状态
    const newVideo = allVideos.value[index]
    if (newVideo) {
      newVideo.loading = true
      newVideo.playing = false
    }
    
    // 预加载目标视频
    if (!newVideo?.preloaded) {
      preloadVideo(newVideo)
    }
    
    // 更新索引和位置
    currentIndex.value = index
    translateY.value = -index * getViewportHeight()
    
    // 重置下拉/上拉状态
    pullState.value = 'none'
    pullDistance.value = 0
    
    // 添加切换动画效果
    const container = scrollContainer.value
    if (container) {
      // 根据方向设置不同的动画曲线
      const easing = direction === 'down' 
        ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
        : 'cubic-bezier(0.42, 0, 0.58, 1)'
      container.style.transition = `transform 0.4s ${easing}`
    }
    
    // 等待DOM更新和动画完成
    await nextTick()
    
    // 播放新视频（延迟播放以获得更好的用户体验）
    if (props.autoplay) {
      setTimeout(async () => {
        await playCurrentVideo()
      }, 200)
    }
    
    // 触发视频切换事件
    emit('video-change', newVideo, index)
    
    // 预加载后续视频（扩展预加载范围）
    preloadVideos(index)
    
    // 加载更多数据（如果接近末尾或已经是最后一个视频）
    const shouldLoadMore = (index >= allVideos.value.length - Math.max(2, props.preloadCount) && 
                           allVideos.value.length < totalCount.value) ||
                          (index === allVideos.value.length - 1 && allVideos.value.length < totalCount.value)
    if (shouldLoadMore) {
      loadMoreVideos()
    }
    
  } catch (error) {
    console.error('切换视频失败:', error)
  } finally {
    setTimeout(() => {
      isSwitchingVideo.value = false
    }, 300)
  }
}

// 视频控制 - 使用单个播放器实例
const playCurrentVideo = async () => {
  if (!currentVideoPlayer.value || !props.autoplay) return
  
  try {
    if (currentVideoPlayer.value.paused) {
      await currentVideoPlayer.value.play()
    }
  } catch (error) {
    console.warn('播放失败，稍后重试:', error)
    setTimeout(async () => {
      if (currentVideoPlayer.value && currentVideoPlayer.value.paused) {
        try {
          await currentVideoPlayer.value.play()
        } catch (retryError) {
          console.error('重试播放失败:', retryError)
        }
      }
    }, 500)
  }
}

const pauseCurrentVideo = () => {
  if (currentVideoPlayer.value) {
    currentVideoPlayer.value.pause()
  }
}

const togglePlay = async () => {
  if (!currentVideoPlayer.value) return
  
  try {
    if (currentVideoPlayer.value.paused) {
      await currentVideoPlayer.value.play()
    } else {
      currentVideoPlayer.value.pause()
    }
  } catch (error) {
    console.error('切换播放状态失败:', error)
  }
}

// 工具函数 - 优化版本
const getViewportHeight = () => {
  return scrollContainer.value?.clientHeight || window.innerHeight
}

const animateToCurrentPosition = () => {
  const targetY = -currentIndex.value * getViewportHeight()
  translateY.value = targetY
  
  // 重置下拉/上拉状态
  pullState.value = 'none'
  pullDistance.value = 0
  
  // 添加平滑动画
  const container = scrollContainer.value
  if (container) {
    container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
}

const getVideoStyle = (video: any) => {
  const viewportHeight = getViewportHeight()
  let translateY = 0
  let opacity = 1
  let scale = 1
  
  if (video.position === 'prev') {
    translateY = -viewportHeight
    opacity = 0.7
    scale = 0.95
  } else if (video.position === 'next') {
    translateY = viewportHeight
    opacity = 0.7
    scale = 0.95
  }
  
  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: opacity,
    zIndex: getVideoZIndex(video.position),
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
  }
}

const getPlayerStyle = (video: any) => {
  if (!video) {
    return {
      top: '0px',
      opacity: 0,
      zIndex: 0
    }
  }
  
  const viewportHeight = getViewportHeight()
  let top = 0
  let opacity = 1
  
  if (video.position === 'prev') {
    top = -viewportHeight
    opacity = 0.7
  } else if (video.position === 'next') {
    top = viewportHeight
    opacity = 0.7
  }
  
  return {
    top: `${top}px`,
    opacity: opacity,
    zIndex: getVideoZIndex(video.position),
    transition: 'top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
  }
}

const getVideoZIndex = (position: string | null | undefined) => {
  if (!position) return 0
  
  switch (position) {
    case 'current': return 30
    case 'prev': return 20
    case 'next': return 20 // 保持相同的层级，避免遮挡问题
    default: return 0
  }
}

const shouldShowPlayer = (index: number) => {
  return index >= 0 && index < visibleVideos.value.length
}

const shouldAutoplay = (index: number) => {
  return index === 1 && props.autoplay // 只有当前视频自动播放
}

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 窗口事件处理
const handleResize = () => {
  animateToCurrentPosition()
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    pauseCurrentVideo()
  } else if (props.autoplay) {
    playCurrentVideo()
  }
}

// 暴露给父组件的方法
defineExpose({
  /** 播放当前视频 */
  play: () => playCurrentVideo(),
  /** 暂停当前视频 */
  pause: () => pauseCurrentVideo(),
  /** 切换到指定视频 */
  switchTo: (index: number) => switchToVideo(index),
  /** 获取当前视频索引 */
  getCurrentIndex: () => currentIndex.value,
  /** 获取视频列表 */
  getVideoList: () => allVideos.value,
  /** 获取当前视频 */
  getCurrentVideo: () => currentVideo.value,
  /** 刷新数据 */
  refresh: () => loadVideos(),
  /** 获取播放器实例 */
  getVideoPlayer: () => currentVideoPlayer.value,
  /** 获取组件信息 */
  getComponentInfo: () => ({
    totalVideos: allVideos.value.length,
    currentIndex: currentIndex.value,
    isSwitching: isSwitchingVideo.value
  })
})
</script>

<style scoped lang="scss">
.sdkwork-scroll-video {
  /* 使用更可靠的高度计算方法，避免手机浏览器工具栏问题 */
  height: 100dvh; /* 使用动态视口高度 */
  min-height: -webkit-fill-available; /* Safari 支持 */
  overflow: hidden;
  background: #000;
  
  /* Perfect screen adaptation for all devices */
  width: 100vw;
  max-width: 100%;
  position: fixed; /* 使用fixed定位避免滚动问题 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  /* Safe area support for mobile devices */
  @supports(padding: max(0px)) {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  
  .video-scroll-container {
    /* 使用更可靠的高度计算方法 */
    height: 100dvh; /* 使用动态视口高度 */
    min-height: -webkit-fill-available; /* Safari 支持 */
    width: 100%;
    position: relative;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    /* 确保容器正确填充安全区域 */
    @supports(padding: max(0px)) {
      height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
    
    /* Perfect video container sizing */
    .video-item {
      width: 100%;
      height: 100dvh; /* 使用动态视口高度 */
      min-height: -webkit-fill-available; /* Safari 支持 */
      
      /* 安全区域适配 */
      @supports(padding: max(0px)) {
        height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
        min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      }
      
      .video-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: #000;
      }
    }
    
    /* Video player perfect adaptation */
    .video-player {
      width: 100%;
      height: 100dvh; /* 使用动态视口高度 */
      min-height: -webkit-fill-available; /* Safari 支持 */
      
      /* 安全区域适配 */
      @supports(padding: max(0px)) {
        height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
        min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      }
      
      :deep(.sdkwork-video-player) {
        width: 100%;
        height: 100%;
        
        .video-js {
          width: 100%;
          height: 100%;
          background: #000;
          
          .vjs-tech {
            object-fit: cover;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    
    .video-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      
      &.prev {
        transform: translateY(-100%);
        opacity: 0.7;
        z-index: 10;
      }
      
      &.current {
        transform: translateY(0);
        opacity: 1;
        z-index: 30;
      }
      
      &.next {
        transform: translateY(100%);
        opacity: 0.7;
        z-index: 10;
      }
      
      .video-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: #000;
      }
      
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        
        .loading-text {
          margin-top: 12px;
          font-size: 14px;
        }
      }
    }
    
    .data-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999; /* 大幅提高层级确保在视频之上 */
      pointer-events: auto; /* 允许数据层接收点击事件 */
      transform: translateZ(0); /* 创建新的层叠上下文 */
    }
    
    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1; /* 大幅降低视频层级，确保在数据层之下 */
      transform: translateZ(0); /* 创建新的层叠上下文 */
      
      :deep(.sdkwork-video-player) {
        width: 100%;
        height: 100%;
        
        .video-js {
          width: 100%;
          height: 100%;
          background: #000;
          
          .vjs-tech {
            object-fit: cover;
          }
        }
      }
    }
  }
  
  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #fff;
    gap: 8px;
  }
  
  /* 固定在底部的播放控制栏 */
  .bottom-controls-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); /* 适配安全区域 */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    z-index: 60; /* 确保在视频内容之上 */
    pointer-events: auto;
    
    .progress-bar {
      width: 100%;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1px;
      margin-bottom: 12px;
      
      .progress-fill {
        height: 100%;
        background: #ff2442;
        border-radius: 1px;
        transition: width 0.1s linear;
      }
    }
    
    .play-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .time-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  /* 下拉刷新提示样式 */
  .pull-refresh-tip {
    position: absolute;
    top: -60px;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    z-index: 100;
    
    .pull-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  /* 上拉加载更多提示样式 */
  .pull-loadmore-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    z-index: 100;
    
    .pull-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

// 响应式设计 - 完美屏幕适配
@media (max-width: 768px) {
  .sdkwork-scroll-video {
    /* 移动端使用动态视口高度，避免浏览器工具栏问题 */
    height: 100dvh;
    min-height: -webkit-fill-available;
    width: 100vw;
    
    /* 移动端安全区域适配 */
    @supports(padding: max(0px)) {
      height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
    
    .data-overlay {
      .bottom-controls {
        padding: 12px;
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .sdkwork-scroll-video {
    /* 平板端使用动态视口高度 */
    height: 100dvh;
    min-height: -webkit-fill-available;
    width: 100vw;
    max-width: 100%;
    
    /* 平板端安全区域适配 */
    @supports(padding: max(0px)) {
      height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
  }
}

@media (min-width: 1025px) {
  .sdkwork-scroll-video {
    /* 桌面端使用动态视口高度 */
    height: 100dvh;
    min-height: -webkit-fill-available;
    width: 100vw;
    max-width: 100%;
    
    /* 桌面端安全区域适配 */
    @supports(padding: max(0px)) {
      height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
    
    /* 桌面端优化 */
    .video-scroll-container {
      .video-player {
        :deep(.sdkwork-video-player) {
          .video-js {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }
}

/* 屏幕方向适配 */
@media (orientation: landscape) {
  .sdkwork-scroll-video {
    .video-scroll-container {
      .video-player {
        :deep(.sdkwork-video-player) {
          .video-js {
            width: auto;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }
}

@media (orientation: portrait) {
  .sdkwork-scroll-video {
    .video-scroll-container {
      .video-player {
        :deep(.sdkwork-video-player) {
          .video-js {
            width: 100%;
            height: auto;
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }
}

/* 超宽屏适配 */
@media (min-width: 1920px) {
  .sdkwork-scroll-video {
    .video-scroll-container {
      .video-player {
        :deep(.sdkwork-video-player) {
          .video-js {
            max-width: 1920px;
            margin: 0 auto;
          }
        }
      }
    }
  }
}

/* 防止横向滚动 */
.sdkwork-scroll-video {
  overflow-x: hidden;
  
  .video-scroll-container {
    overflow-x: hidden;
  }
}

/* 固定底部控制栏的响应式适配 */
@media (max-width: 768px) {
  .bottom-controls-fixed {
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    
    .play-controls {
      .van-icon {
        font-size: 20px;
      }
      
      .time-text {
        font-size: 11px;
      }
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .bottom-controls-fixed {
    padding: 14px;
    padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
    
    .play-controls {
      .van-icon {
        font-size: 22px;
      }
      
      .time-text {
        font-size: 12px;
      }
    }
  }
}

@media (min-width: 1025px) {
  .bottom-controls-fixed {
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    
    .play-controls {
      .van-icon {
        font-size: 24px;
      }
      
      .time-text {
        font-size: 13px;
      }
    }
  }
}

/* 确保固定控制栏不会遮挡右侧操作区域 */
.bottom-controls-fixed {
  /* 为右侧操作区域留出空间 */
  padding-right: 80px; /* 右侧操作栏宽度 */
}

/* 横屏模式下的优化 */
@media (orientation: landscape) {
  .bottom-controls-fixed {
    padding-right: 60px; /* 横屏时右侧操作栏较小 */
  }
}

/* 视频完美适配逻辑 */
.video-perfect-fit {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

/* 确保视频始终居中显示 */
.video-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端浏览器视频层级修复 */
@media (max-width: 768px) {
  .sdkwork-scroll-video {
    /* 为移动端创建更强的层叠上下文 */
    transform: translateZ(0);
    z-index: 1;
    
    .video-scroll-container {
      transform: translateZ(0);
      z-index: 1;
      
      .data-overlay {
        /* 移动端需要更高的z-index来覆盖视频 */
        z-index: 2147483647 !important; /* iOS 最大z-index */
        transform: translateZ(0);
        
        /* 确保右侧操作区域在移动端可见 */
        .right-actions {
          z-index: 2147483647 !important;
          transform: translateZ(0);
        }
      }
      
      .video-player {
        /* 移动端视频播放器需要降低层级 */
        z-index: 1 !important;
        transform: translateZ(0);
        
        /* 移动端视频元素特殊处理 */
        :deep(.sdkwork-video-player) {
          z-index: 1 !important;
          transform: translateZ(0);
          
          .video-js {
            z-index: 1 !important;
            transform: translateZ(0);
            
            .vjs-tech {
              z-index: 1 !important;
              transform: translateZ(0);
            }
          }
        }
      }
      
      /* 确保弹出框在移动端有最高层级 */
      :deep(.sdkwork-popup) {
        z-index: 100000 !important;
        transform: translateZ(0);
      }
    }
  }
}

/* iOS Safari 特殊修复 */
@supports (-webkit-touch-callout: none) {
  .sdkwork-scroll-video .data-overlay {
    z-index: 2147483647 !important; /* iOS 最大z-index */
    -webkit-transform: translateZ(0);
  }
  
  .sdkwork-scroll-video .video-player {
    z-index: -1 !important;
    -webkit-transform: translateZ(0);
  }
  
  /* iOS 弹出框特殊修复 */
  .sdkwork-scroll-video :deep(.sdkwork-popup) {
    z-index: 2147483647 !important;
    -webkit-transform: translateZ(0);
  }
}

/* Android Chrome 特殊修复 */
@supports (-webkit-overflow-scrolling: touch) {
  .sdkwork-scroll-video .data-overlay {
    z-index: 999999 !important;
    -webkit-transform: translateZ(0);
  }
  
  /* Android 弹出框特殊修复 */
  .sdkwork-scroll-video :deep(.sdkwork-popup) {
    z-index: 999999 !important;
    -webkit-transform: translateZ(0);
  }
}
</style>