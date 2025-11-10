<template>
  <sdkwork-page-container safe-area :scrollable="false" theme-mode="auto">
    <!-- 顶部标签页导航 -->
    <van-tabs v-model:active="activeTab" sticky animated swipeable class="generation-tabs">
      <van-tab title="推荐" name="recommend">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'all' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="generationWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无作品" image="search">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到生成作品</p>
                  <p class="empty-tip">您可以尝试创建新的作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="图片" name="image">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'image' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="imageWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无图片作品" image="photo">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到图片作品</p>
                  <p class="empty-tip">您可以尝试创建新的图片作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载图片作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="视频" name="video">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'video' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="videoWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无视频作品" image="video">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到视频作品</p>
                  <p class="empty-tip">您可以尝试创建新的视频作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载视频作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="推广" name="promotion">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'promotion' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="promotionWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无推广作品" image="gem">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到推广作品</p>
                  <p class="empty-tip">您可以尝试创建新的推广作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载推广作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="短视频" name="shortVideo">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'shortVideo' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="shortVideoWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无短视频作品" image="play">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到短视频作品</p>
                  <p class="empty-tip">您可以尝试创建新的短视频作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载短视频作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="写真" name="portrait">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'portrait' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="portraitWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无写真作品" image="user">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到写真作品</p>
                  <p class="empty-tip">您可以尝试创建新的写真作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载写真作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
      
      <van-tab title="音乐" name="music">
        <sdkwork-generation-waterfall 
          :api="getGenerationList" 
          :params="{ type: 'music' }" 
          :page-size="12" 
          :searchable="false"
          :show-stats="true"
          :show-meta="true"
          :show-status="true"
          :clickable="true"
          @item-click="handleGenerationClick" 
          @search="handleSearch" 
          @load="handleLoad" 
          @create="handleCreateGeneration"
          ref="musicWaterfallRef">
          
          <!-- 空状态 -->
          <template #empty>
            <van-empty description="暂无音乐作品" image="music">
              <template #description>
                <div class="empty-description">
                  <p>暂时没有找到音乐作品</p>
                  <p class="empty-tip">您可以尝试创建新的音乐作品</p>
                </div>
              </template>
            </van-empty>
          </template>

          <!-- 加载状态 -->
          <template #loading>
            <van-loading size="24px" vertical>加载音乐作品中...</van-loading>
          </template>
        </sdkwork-generation-waterfall>
      </van-tab>
    </van-tabs>

    <!-- 创建作品浮动气泡 -->
    <van-floating-bubble v-model:offset="offset" axis="xy" magnetic="x" class="create-bubble"
      @click="handleCreateGeneration">
      <van-icon name="plus" size="24" color="#fff" />
    </van-floating-bubble>

    <!-- 生成功能选择弹窗 -->
    <SdkworkGenerationPopup 
      v-model="showGenerationPopup"
      title="选择生成类型"
      position="bottom"
      :closeable="true"
      :close-on-click-overlay="true"
      :round="true"
      :safe-area-inset-bottom="true"
      :lock-scroll="true"
      theme-mode="auto"
      @feature-click="handleFeatureSelect"
      @open="onPopupOpen"
      @close="onPopupClose"
      ref="generationPopupRef"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/hooks/theme/useTheme'
import { useGenerationStore } from '@/stores/modules/generation'
import SdkworkGenerationWaterfall from '@/components/sdkwork-generation-waterfall/sdkwork-generation-waterfall.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import SdkworkGenerationPopup from '@/components/sdkwork-generation-popup/sdkwork-generation-popup.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

definePage({
  meta: {
    title: '生成作品',
    hideBackButton: true,
    hideHeader: true
  }
})

const router = useRouter()
const generationStore = useGenerationStore()

// 使用主题系统
const { currentTheme, isDarkMode } = useTheme()

// 标签页状态
const activeTab = ref('recommend')



// 瀑布流组件引用
const generationWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const imageWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const videoWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const promotionWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const shortVideoWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const portraitWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()
const musicWaterfallRef = ref<InstanceType<typeof SdkworkGenerationWaterfall>>()

// 浮动气泡位置 - 右下角（动态计算）
const offset = ref({ x: 0, y: 0 })

// 生成弹窗状态
const showGenerationPopup = ref(false)

// 弹窗组件引用
const generationPopupRef = ref<InstanceType<typeof SdkworkGenerationPopup>>()

// 计算浮动气泡位置
const calculateBubblePosition = () => {
  // 获取视口尺寸
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 设置边距 - 紧贴右边，考虑tabbar高度
  const marginRight = 2
  const marginBottom = 80 // 避免遮盖tabbar
  const bubbleSize = 60 // 气泡尺寸

  // 计算右下角坐标
  offset.value = {
    x: viewportWidth - bubbleSize - marginRight,
    y: viewportHeight - bubbleSize - marginBottom
  }
}

// API方法 - 获取生成作品列表
const getGenerationList = async (params: Pageable): Promise<Page<any>|any> => {
  try {
    console.log('getGenerationList:', params)
    // 使用generation store获取生成作品列表
    const page = await generationStore.listGenerations({}, params)

    return page
  } catch (error) {
    console.error('获取生成作品列表失败:', error)
    return {
      content: [],
      empty: true,
      first: true,
      last: true,
      pageNumber: 0,
      numberOfElements: 0,
      pageSize: params.pageSize || 12,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
        orders: []
      },
      totalElements: 0,
      totalPages: 0
    }
  }
}

// 事件处理
const handleGenerationClick = async (generation: any) => {
  try {
    // 跳转到作品详情页面
    router.push(`/video/${generation.id}`)
  } catch (error) {
    console.error('查看作品详情失败:', error)
  }
}

const handleSearch = (keyword: string) => {
  console.log('搜索作品:', keyword)
}

const handleLoad = (pageData: Page<any>) => {
  console.log('作品数据加载完成:', pageData)
}

// 创建生成作品 - 显示弹窗选择功能
const handleCreateGeneration = () => {
  showGenerationPopup.value = true
}

// 处理功能项选择
const handleFeatureSelect = (feature: any) => {
  console.log('选择的功能:', feature)
  
  // 根据选择的功能跳转到对应的创建页面
  switch (feature.id) {
    case 'video-generation':
      router.push('/generation/video')
      break
    case 'video-dubbing':
      router.push('/generation/video/dubbing')
      break
    case 'ad-production':
      router.push('/generation/video/ad')
      break
    case 'image-generation':
      router.push('/generation/image')
      break
    case 'portrait-photo':
      router.push('/generation/image/portrait')
      break
    case 'id-photo':
      router.push('/generation/image/idphoto')
      break
    case 'music-generation':
      router.push('/generation/music')
      break
    case 'voice-cloning':
      router.push('/voice/clone')
      break
    case 'voice-synthesis':
      router.push('/voice/synthesis')
      break
    case 'audio-recording':
      router.push('/audio/recorder')
      break
    default:
      // 默认跳转到通用创建页面
      router.push('/generation/create')
  }
}

// 弹窗打开事件
const onPopupOpen = () => {
  console.log('生成功能弹窗已打开')
}

// 弹窗关闭事件
const onPopupClose = () => {
  console.log('生成功能弹窗已关闭')
}

onMounted(() => {
  // 页面加载完成
  console.log('生成作品页面已加载')

  // 初始计算气泡位置
  calculateBubblePosition()

  // 监听窗口大小变化，重新计算位置
  window.addEventListener('resize', calculateBubblePosition)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', calculateBubblePosition)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/theme.scss' as theme;

.generation-tabs {
  // 使用 data-theme 属性选择器
  :deep(.van-tabs__wrap) {
    background: var(--theme-background-color, #ffffff);
    border-bottom: 1px solid var(--theme-border-color, #ebedf0);
    
    .van-tab {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-text-color-2, #969799);
      
      &.van-tab--active {
        color: var(--theme-primary-color, #1989fa);
        font-weight: 600;
        background: var(--theme-background-color, #ffffff);
      }
      
      &:hover {
        color: var(--theme-text-color, #323233);
      }
    }
    
    .van-tabs__line {
      background-color: var(--theme-primary-color, #1989fa);
    }
  }
  
  :deep(.van-tabs__content) {
    background: var(--theme-background-color, #ffffff);
  }
  
  // 深色主题适配
  &[data-theme="dark"] {
    :deep(.van-tabs__wrap) {
      background: var(--theme-background-color, #1a1a1a);
      border-bottom: 1px solid var(--theme-border-color, #404040);
      
      .van-tab {
        color: var(--theme-text-color-2, #a0a0a0);
        
        &.van-tab--active {
          color: var(--theme-primary-color, #1989fa);
          font-weight: 600;
          background: var(--theme-background-color, #1a1a1a);
        }
        
        &:hover {
          color: var(--theme-text-color, #ffffff);
        }
      }
      
      .van-tabs__line {
        background-color: var(--theme-primary-color, #1989fa);
      }
    }
    
    :deep(.van-tabs__content) {
      background: var(--theme-background-color, #1a1a1a);
    }
    :deep(.van-tabs__nav){
        background: var(--theme-background-color, #1a1a1a) !important;
    }
  }
}

.empty-description {
  text-align: center;

  p {
    margin: 4px 0;
    color: #969799;
    font-size: 14px;
  }

  .empty-tip {
    font-size: 12px;
    color: #c8c9cc;
  }
}

// 浮动气泡样式
.create-bubble {
  :deep(.van-floating-bubble) {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 123, 255, 0.6);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '生成作品'
  }
}
</route>