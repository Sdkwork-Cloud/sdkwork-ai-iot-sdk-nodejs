<template>
  <div class="sdkwork-product-swiper">
    <van-swipe
      ref="swiperRef"
      :autoplay="autoplay"
      :show-indicators="showIndicators"
      :height="height"
      :theme-mode="themeMode"
      @change="handleSwiperChange"
    >
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <div class="product-image-container">
          <img 
            :src="image" 
            :alt="productName"
            class="product-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>
      </van-swipe-item>
      
      <!-- 自定义指示器 -->
      <template #indicator>
        <div class="custom-indicator">
          {{ currentImageIndex + 1 }} / {{ images?.length || 0 }}
        </div>
      </template>
    </van-swipe>
    
    <!-- 收藏按钮 -->
    <div class="favorite-btn" @click="toggleFavorite">
      <van-icon 
        :name="isFavorite ? 'star' : 'star-o'" 
        :color="isFavorite ? '#ff6b6b' : '#ccc'"
        size="24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'   

// 组件属性
interface Props {
  /** 商品图片数组 */
  images?: string[]
  /** 商品名称 */
  productName?: string
  /** 是否自动播放 */
  autoplay?: number
  /** 是否显示指示器 */
  showIndicators?: boolean
  /** 轮播图高度 */
  height?: string | number
  /** 主题模式 */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 是否已收藏 */
  isFavorite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  productName: '',
  autoplay: 300000000,
  showIndicators: true,
  height: '300',
  themeMode: 'auto',
  isFavorite: false
})

// 事件定义
interface Emits {
  (e: 'change', index: number): void
  (e: 'favorite-change', isFavorite: boolean): void
  (e: 'image-load', event: Event): void
  (e: 'image-error', event: Event): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const currentImageIndex = ref(0)

// 组件引用
const swiperRef = ref<any>()

// 方法
const handleSwiperChange = (index: number) => {
  currentImageIndex.value = index
  emit('change', index)
}

const handleImageLoad = (event: Event) => {
  emit('image-load', event)
}

const handleImageError = (event: Event) => {
  emit('image-error', event)
}

const toggleFavorite = () => {
  const newFavoriteState = !props.isFavorite
  emit('favorite-change', newFavoriteState)
}

// 暴露方法
defineExpose({
  /** 切换到上一张 */
  prev: () => swiperRef.value?.prev(),
  /** 切换到下一张 */
  next: () => swiperRef.value?.next(),
  /** 跳转到指定图片 */
  swipeTo: (index: number, options?: { immediate?: boolean }) => 
    swiperRef.value?.swipeTo(index, options),
  /** 获取当前图片索引 */
  getCurrentIndex: () => currentImageIndex.value
})
</script>

<style scoped lang="scss">
.sdkwork-product-swiper {
  position: relative;
  
  .product-image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sdkwork-product-swiper-image-background, #fff);
    
    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .custom-indicator {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .favorite-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    
    &:active {
      background: rgba(255, 255, 255, 0.7);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-product-swiper {
    .custom-indicator {
      bottom: 15px;
      right: 15px;
      font-size: 11px;
      padding: 3px 6px;
    }
    
    .favorite-btn {
      top: 15px;
      right: 15px;
      width: 36px;
      height: 36px;
    }
  }
}
</style>