<template>
  <div class="video-demo">
    <!-- 视频滚动组件 -->
    <sdkwork-scroll-video
      :api="mockVideoApi"
      :params="videoParams"
      :page-size="5"
      :preload-count="3"
      autoplay
      :enableLoading="false"
      @video-change="handleVideoChange"
      @like="handleLike"
      @comment="handleComment"
      @share="handleShare"
      @follow="handleFollow"
      @load="handleLoad"
      @error="handleApiError"
      ref="videoRef"
    />
    
    <!-- 调试信息面板 -->
    <div class="debug-panel" v-if="showDebug">
      <div class="debug-info">
        <h3>视频滚动组件监控</h3>
        <div class="info-item">
          <span>当前视频索引:</span>
          <span>{{ currentIndex }}</span>
        </div>
        <div class="info-item">
          <span>总视频数:</span>
          <span>{{ bufferInfo?.totalVideos || 0 }}</span>
        </div>
        <div class="info-item">
          <span>当前索引:</span>
          <span>{{ bufferInfo?.currentIndex || 0 }}</span>
        </div>
        <div class="info-item">
          <span>切换状态:</span>
          <span>{{ bufferInfo?.isSwitching ? '切换中' : '正常' }}</span>
        </div>
        <div class="info-item">
          <span>内存使用:</span>
          <span>{{ memoryUsage }} MB</span>
        </div>
        <div class="info-item">
          <span>分页信息:</span>
          <span>每页5条，共6页</span>
        </div>
        <div class="info-item">
          <span>加载状态:</span>
          <span>{{ getLoadingStatus() }}</span>
        </div>
        <div class="info-item">
          <span>触摸方向:</span>
          <span>{{ getTouchDirection() }}</span>
        </div>
        <div class="info-item" v-if="currentVideo">
          <span>视频尺寸:</span>
          <span>{{ currentVideo.videoWidth }}x{{ currentVideo.videoHeight }} ({{ currentVideo.aspectRatio }})</span>
        </div>
        <div class="info-item" v-if="currentVideo">
          <span>视频类型:</span>
          <span>{{ currentVideo.videoType }}</span>
        </div>
      </div>
    </div>
     
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { ScrollVideoItem, VideoAuthor } from '../components/sdkwork-scroll-video/types'
definePage({
    meta: {
        hideHeader:true
    }
})
// 组件引用
const videoRef = ref()
const showDebug = ref(false)
const currentIndex = ref(0)
const currentVideo = ref<ScrollVideoItem | null>(null)
const bufferInfo = ref<any>(null)
const memoryUsage = ref(0)

// 视频参数
const videoParams = ref<Record<string, any>>({
  tags: ['推荐'],
  sort: 'recommend'
})

// 根据宽高比获取不同尺寸的视频URL（使用可靠的公共视频资源）
const getVideoUrlByAspectRatio = (aspectRatio: string, videoId: number): string => {
  // 使用可靠的公共视频资源，确保所有视频都可访问
  const videoSources = {
    // 9:16 竖屏手机视频 - 专门寻找竖屏视频资源
    '9:16': [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
    ],
    // 16:9 横屏视频 - 使用Google的可靠视频资源
    '16:9': [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
    ],
    // 1:1 正方形视频 - 使用相同的16:9视频，通过CSS适配测试正方形效果
    '1:1': [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ],
    // 4:3 传统比例 - 使用相同的16:9视频，通过CSS适配测试4:3效果
    '4:3': [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    ],
    // 21:9 超宽屏 - 使用相同的16:9视频，通过CSS适配测试超宽屏效果
    '21:9': [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
    ],
    // 3:4 竖屏传统比例 - 使用相同的16:9视频，通过CSS适配测试3:4效果
    '3:4': [
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ]
  }

  // 根据宽高比选择对应的视频列表，如果没有匹配则使用16:9
  const videos = videoSources[aspectRatio as keyof typeof videoSources] || videoSources['16:9']
  
  // 根据videoId选择视频，确保不同视频使用不同的URL
  return videos[videoId % videos.length]
}

// 真实可浏览的视频API - 优化版本，支持不同尺寸视频测试
const mockVideoApi = async (params: Pageable): Promise<Page<ScrollVideoItem>|any> => {
  // 模拟网络延迟
  const delay = Math.random() * 500 + 300 // 300-800ms随机延迟
  await new Promise(resolve => setTimeout(resolve, delay))
  
  const page = params.pageNumber || 1
  const size = params.pageSize || 10
  
  // 不同尺寸的视频数据配置 - 以9:16手机竖屏为主
  const videoConfigs = [
    // 9:16 竖屏手机视频（抖音风格）- 占主要比例
    { aspectRatio: '9:16', width: 720, height: 1280, type: '手机竖屏' },
    { aspectRatio: '9:16', width: 1080, height: 1920, type: '高清竖屏' },
    { aspectRatio: '9:16', width: 540, height: 960, type: '标准竖屏' },
    // 16:9 横屏视频（YouTube风格）- 少量横屏
    { aspectRatio: '16:9', width: 1280, height: 720, type: '横屏视频' },
    // 1:1 正方形视频（Instagram风格）
    { aspectRatio: '1:1', width: 1080, height: 1080, type: '正方形' },
    // 3:4 竖屏传统比例
    { aspectRatio: '3:4', width: 750, height: 1000, type: '竖屏传统' }
  ]
  
  // 模拟数据库中的视频数据（总共30个视频，以9:16竖屏为主）
  const generateVideoData = (baseId: number, count: number) => {
    const categories = [
      { name: '自然风光', tags: ['自然', '风光', '日出', '日落', '山水'] },
      { name: '城市生活', tags: ['城市', '夜景', '现代', '建筑', '街道'] },
      { name: '动物世界', tags: ['动物', '野生动物', '宠物', '鸟类', '海洋'] },
      { name: '美食制作', tags: ['美食', '甜点', '制作', '烹饪', '食谱'] },
      { name: '旅行探险', tags: ['旅行', '探险', '户外', '冒险', '风景'] },
      { name: '音乐舞蹈', tags: ['音乐', '舞蹈', '表演', '艺术', '文化'] }
    ]
    
    const videos = []
    
    for (let i = 0; i < count; i++) {
      const videoId = baseId + i
      const category = categories[videoId % categories.length]
      const subCategory = category.tags[videoId % category.tags.length]
      
      // 优先使用9:16竖屏视频（占60%），其他比例占40%
      let videoConfig
      if (videoId % 10 < 6) { // 60%的概率使用9:16竖屏
        videoConfig = videoConfigs[0] // 第一个9:16配置
      } else if (videoId % 10 < 7) { // 10%的概率使用高清竖屏
        videoConfig = videoConfigs[1] // 第二个9:16配置
      } else if (videoId % 10 < 8) { // 10%的概率使用标准竖屏
        videoConfig = videoConfigs[2] // 第三个9:16配置
      } else {
        videoConfig = videoConfigs[videoId % videoConfigs.length] // 其他比例
      }
      
      // 使用可靠的占位图服务，确保图片可访问且尺寸匹配
      const coverUrl = `https://picsum.photos/${Math.min(videoConfig.width, 800)}/${Math.min(videoConfig.height, 800)}?random=${videoId}`
      
      videos.push({
        id: `video_${videoId}`,
        title: `${category.name} - ${subCategory} [${videoConfig.type}]`,
        description: `精彩的${category.name}视频，${videoConfig.type}比例，展现${subCategory}的魅力。视频尺寸：${videoConfig.width}x${videoConfig.height} (${videoConfig.aspectRatio})`,
        videoUrl: getVideoUrlByAspectRatio(videoConfig.aspectRatio, videoId),
        coverUrl: coverUrl,
        duration: 30 + (videoId % 120), // 30-150秒随机时长
        aspectRatio: videoConfig.aspectRatio,
        videoType: videoConfig.type,
        videoWidth: videoConfig.width,
        videoHeight: videoConfig.height,
        author: {
          id: `author_${videoId}`,
          username: `${category.name}达人${videoId}`,
          avatar: `https://picsum.photos/100/100?random=${videoId + 100}`,
          verified: videoId % 3 === 0,
          followed: videoId % 4 === 0,
          followerCount: 1000 + (videoId * 123) % 10000,
          videoCount: 10 + (videoId % 50)
        },
        music: {
          id: `music_${videoId}`,
          name: `${category.name}旋律${videoId}`,
          author: `${category.name}之声`,
          coverUrl: `https://picsum.photos/100/100?random=${videoId + 200}`,
          musicUrl: '',
          duration: 180 + (videoId % 120)
        },
        likeCount: 100 + (videoId * 456) % 5000,
        commentCount: 10 + (videoId * 78) % 500,
        shareCount: 5 + (videoId * 23) % 200,
        makeSameCount: 1 + (videoId % 50),
        liked: videoId % 5 === 0,
        muted: false,
        progress: 0,
        currentTime: 0,
        playing: false,
        loading: true,
        preloaded: false,
        createTime: new Date(Date.now() - (videoId % 30) * 24 * 60 * 60 * 1000).toISOString(),
        tags: [category.name, subCategory, videoConfig.type, ...category.tags.slice(0, 2)]
      })
    }
    
    return videos
  }
  
  // 总共30个视频数据，支持3页加载
  const totalVideos = 30
  const allVideos = generateVideoData(1, totalVideos)
  
  // 根据分页参数返回数据
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  
  // 模拟第一页加载失败的情况（10%概率）
  if (page === 1 && Math.random() < 0.1) {
    throw new Error('网络连接失败，请检查网络后重试')
  }
  
  // 模拟后续页面加载失败的情况（5%概率）
  if (page > 1 && Math.random() < 0.05) {
    throw new Error('加载更多失败，请稍后重试')
  }
  
  // 如果请求的页码超出范围，返回空数组
  if (startIndex >= totalVideos) {
    return {
      records: [],
      total: totalVideos,
      size: size,
      current: page,
      pages: Math.ceil(totalVideos / size)
    }
  }
  
  const paginatedRecords = allVideos.slice(startIndex, endIndex)
  
  console.log(`API请求: 第${page}页, 大小${size}, 返回${paginatedRecords.length}条记录`)
  
  return {
    records: paginatedRecords,
    total: totalVideos,
    size: size,
    current: page,
    pages: Math.ceil(totalVideos / size)
  }
}

// 事件处理
const handleVideoChange = (video: ScrollVideoItem, index: number) => {
  currentIndex.value = index
  currentVideo.value = video
  console.log('视频切换:', video.title, index, `尺寸: ${video.videoWidth}x${video.videoHeight} (${video.aspectRatio})`)
  
  // 更新组件信息
  if (videoRef.value) {
    bufferInfo.value = videoRef.value.getComponentInfo()
  }
}

const handleLike = (video: ScrollVideoItem) => {
  console.log('点赞:', video.title)
}

const handleComment = (video: ScrollVideoItem) => {
  console.log('评论:', video.title)
}

const handleShare = (video: ScrollVideoItem) => {
  console.log('分享:', video.title)
}

const handleFollow = (author: VideoAuthor) => {
  console.log('关注:', author.username)
}

const handleLoad = (pageData: Page<ScrollVideoItem>) => {
  console.log('数据加载:', pageData) 
}

const handleApiError = (error: any) => {
  console.error('API请求失败:', error)
  showToast(error.message || '网络请求失败')
}

// 控制功能
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const refreshVideos = () => {
  if (videoRef.value) {
    videoRef.value.refresh()
    showToast('数据刷新中...')
  }
}

const switchToRandom = () => {
  if (videoRef.value) {
    const videoList = videoRef.value.getVideoList()
    if (videoList.length > 0) {
      const randomIndex = Math.floor(Math.random() * videoList.length)
      videoRef.value.switchTo(randomIndex)
      showToast(`切换到第 ${randomIndex + 1} 个视频`)
    }
  }
}

// 调试辅助函数
const getLoadingStatus = () => {
  if (!videoRef.value) return '未初始化'
  
  const videoList = videoRef.value.getVideoList()
  const currentVideo = videoRef.value.getCurrentVideo()
  
  if (videoList.length === 0) return '无数据'
  if (currentVideo?.loading) return '加载中'
  
  return `已加载${videoList.length}个视频`
}

const getTouchDirection = () => {
  // 这里可以添加触摸方向检测逻辑
  return '等待触摸事件'
}

// 内存监控
const updateMemoryUsage = () => {
  if ('memory' in performance) {
    const memoryInfo = (performance as any).memory
    memoryUsage.value = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)
  }
}

// 生命周期
let memoryInterval: number | null = null

onMounted(() => {
  // 开始内存监控
  memoryInterval = window.setInterval(updateMemoryUsage, 1000)
})

onUnmounted(() => {
  // 清理内存监控
  if (memoryInterval) {
    clearInterval(memoryInterval)
    memoryInterval = null
  }
})
</script>

<style scoped lang="scss">
.video-demo {
  height: 100dvh;
  position: relative;
  
  .debug-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    max-width: 300px;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #4fc3f7;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 12px;
      
      span:first-child {
        color: #ccc;
      }
      
      span:last-child {
        color: #4caf50;
        font-weight: 500;
      }
    }
  }
  
  .control-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
    
    .van-button {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .video-demo {
    .debug-panel {
      max-width: 250px;
      padding: 10px;
      
      h3 {
        font-size: 12px;
      }
      
      .info-item {
        font-size: 11px;
      }
    }
    
    .control-panel {
      bottom: 10px;
      
      .van-button {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
  }
}
</style>
<route>
{
  meta: {
    layout: 'empty', 
  }
}
</route>