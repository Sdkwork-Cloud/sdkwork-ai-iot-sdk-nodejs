<template>
  <div class="sdkwork-product-detail" :class="themeClass">
    <!-- 商品轮播图 -->
    <SdkworkProductSwiper
      ref="swiperRef"
      :images="product.images"
      :product-name="product.name"
      :height="swiperHeight"
      :theme-mode="themeMode"
      :is-favorite="isFavorite"
      @change="handleSwiperChange"
      @favorite-change="handleFavoriteChange"
      @image-load="handleImageLoad"
      @image-error="handleImageError"
    />

    <!-- 商品基本信息 -->
    <SdkworkProductInfo
      :product="product"
    />

    <!-- 商品规格选择 -->
    <SdkworkProductSpec
      ref="specRef"
      :available-specs="availableSpecs"
      :default-specs="defaultSpecs"
      @specs-change="handleSpecsChange"
      @specs-confirm="handleSpecsConfirm"
    />

    <!-- 商品详情Tabs -->
    <SdkworkProductTabs
      ref="tabsRef"
      :product="product"
      :theme-mode="themeMode"
      :default-active-tab="defaultActiveTab"
      @tab-change="handleTabChange"
    />

    <!-- 底部操作栏 -->
    <SdkworkProductActions
      ref="actionsRef"
      :is-favorite="isFavorite"
      @add-to-cart="handleAddToCart"
      @buy-now="handleBuyNow"
      @favorite-change="handleFavoriteChange"
      @share="handleShare"
      @customer-service="handleCustomerService"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import SdkworkProductSwiper from './components/sdkwork-product-swiper.vue'
import SdkworkProductInfo from './components/sdkwork-product-info.vue'
import SdkworkProductSpec from './components/sdkwork-product-spec.vue'
import SdkworkProductTabs from './components/sdkwork-product-tabs.vue'
import SdkworkProductActions from './components/sdkwork-product-actions.vue'

// 商品数据类型
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  images?: string[]
  rating?: number
  sales?: number
  stock?: number
  tags?: string[]
  detailHtml?: string
  specifications?: Array<{ name: string; value: string }>
  reviews?: Array<{
    id: string | number
    userName: string
    rating: number
    content: string
    createTime: string
  }>
}

// 组件属性
interface Props {
  /** 商品数据 */
  product: Product
  /** 主题模式 */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 轮播图高度 */
  swiperHeight?: string | number
  /** 默认激活的Tab索引 */
  defaultActiveTab?: number
  /** 默认选中的规格 */
  defaultSpecs?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto',
  swiperHeight: '300',
  defaultActiveTab: 0,
  defaultSpecs: () => []
})

// 事件定义
interface Emits {
  (e: 'add-to-cart', product: Product, quantity: number, specs: string[]): void
  (e: 'buy-now', product: Product, quantity: number, specs: string[]): void
  (e: 'favorite-change', product: Product, isFavorite: boolean): void
  (e: 'share', product: Product): void
  (e: 'customer-service', product: Product): void
  (e: 'tab-change', index: number, tabName: string): void
  (e: 'specs-change', specs: string[]): void
  (e: 'specs-confirm', specs: string[]): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isFavorite = ref(false)

// 组件引用
const swiperRef = ref<InstanceType<typeof SdkworkProductSwiper>>()
const specRef = ref<InstanceType<typeof SdkworkProductSpec>>()
const tabsRef = ref<InstanceType<typeof SdkworkProductTabs>>()
const actionsRef = ref<InstanceType<typeof SdkworkProductActions>>()

// 主题检测逻辑
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-product-detail--dark' : 'sdkwork-product-detail--light'
})

// 模拟规格数据
const availableSpecs = ref([
  { label: '黑色', value: 'black' },
  { label: '白色', value: 'white' },
  { label: '红色', value: 'red' },
  { label: '64GB', value: '64gb' },
  { label: '128GB', value: '128gb' },
  { label: '256GB', value: '256gb' }
])

// 方法
const handleSwiperChange = (index: number) => {
  console.log('轮播图切换到第', index + 1, '张')
}

const handleImageLoad = (event: Event) => {
  console.log('图片加载成功')
}

const handleImageError = (event: Event) => {
  console.error('图片加载失败')
}

const handleFavoriteChange = (newFavoriteState: boolean) => {
  isFavorite.value = newFavoriteState
  emit('favorite-change', props.product, isFavorite.value)
  showToast(isFavorite.value ? '已收藏' : '已取消收藏')
}

const handleSpecsChange = (specs: string[]) => {
  emit('specs-change', specs)
}

const handleSpecsConfirm = (specs: string[]) => {
  emit('specs-confirm', specs)
}

const handleTabChange = (index: number, tabName: string) => {
  emit('tab-change', index, tabName)
}

const handleAddToCart = () => {
  const selectedSpecs = specRef.value?.getSelectedSpecs() || []
  if (selectedSpecs.length === 0) {
    showToast('请先选择规格')
    return
  }
  
  emit('add-to-cart', props.product, 1, selectedSpecs)
  showToast('已加入购物车')
}

const handleBuyNow = () => {
  const selectedSpecs = specRef.value?.getSelectedSpecs() || []
  if (selectedSpecs.length === 0) {
    showToast('请先选择规格')
    return
  }
  
  emit('buy-now', props.product, 1, selectedSpecs)
}

const handleShare = () => {
  emit('share', props.product)
  showToast('分享功能已触发')
}

const handleCustomerService = () => {
  emit('customer-service', props.product)
  showToast('正在联系客服...')
}

// 暴露方法
defineExpose({
  /** 刷新商品数据 */
  refresh: () => {
    console.log('刷新商品详情')
  },
  
  /** 获取当前选中的规格 */
  getSelectedSpecs: () => specRef.value?.getSelectedSpecs() || [],
  
  /** 设置选中的规格 */
  setSelectedSpecs: (specs: string[]) => {
    specRef.value?.setSelectedSpecs(specs)
  },
  
  /** 跳转到指定Tab */
  switchTab: (tabIndex: number) => {
    tabsRef.value?.switchTab(tabIndex)
  },
  
  /** 设置收藏状态 */
  setFavorite: (favorite: boolean) => {
    isFavorite.value = favorite
    actionsRef.value?.setFavorite(favorite)
  },
  
  /** 获取收藏状态 */
  getFavorite: () => isFavorite.value,
  
  /** 触发加入购物车 */
  triggerAddToCart: () => {
    actionsRef.value?.triggerAddToCart()
  },
  
  /** 触发立即购买 */
  triggerBuyNow: () => {
    actionsRef.value?.triggerBuyNow()
  },
  
  /** 打开规格选择弹窗 */
  openSpecPopup: () => {
    specRef.value?.openSpecPopup()
  },
  
  /** 获取当前激活的Tab */
  getActiveTab: () => tabsRef.value?.getActiveTab()
})
</script>

<style scoped lang="scss">
.sdkwork-product-detail {
  min-height: 100vh;
  background: var(--sdkwork-product-detail-background, #f5f5f5);
  padding-bottom: 60px;
}

/* 浅色主题 */
.sdkwork-product-detail--light {
  --sdkwork-product-detail-background: #f5f5f5;
}

/* 深色主题 */
.sdkwork-product-detail--dark {
  --sdkwork-product-detail-background: #1a1a1a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-product-detail {
    padding-bottom: 50px;
  }
}
</style>