<template>
  <sdkwork-container 
    safe-area
    :scrollable="false"
    theme-mode="auto" 
  >
    <!-- 商品网格列表（包含所有其他组件在header slot中） -->
      <sdkwork-mall-product-grid
        ref="productGridListRef"
        :filter-params="currentFilterParams"
        @select="handleProductSelect"
        @delete="handleProductDelete"
        @search="handleProductSearch"
        @load="handleProductLoad"
        @item-click="handleProductClick"
        @batch-operation="handleBatchOperation"
      >
        <!-- 头部插槽：包含所有其他子组件 -->
        <template #header> 

          <!-- 顶部功能网格 -->
          <sdkwork-mall-feature-grid
            :features="featureItems"
            @click="handleFeatureClick"
          />

          <!-- 轮播图 -->
          <sdkwork-mall-banner
            :banners="banners"
          />

          <!-- 热门推荐 -->
          <sdkwork-mall-recommend
            :products="recommendedProducts"
            @view-all="handleViewAllRecommend"
            @product-click="handleProductClick"
          />
 
        </template>
      </sdkwork-mall-product-grid>
  </sdkwork-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'  

// 导入子组件 
import SdkworkMallFeatureGrid from './sdkwork-mall-feature-grid.vue'
import SdkworkMallBanner from './sdkwork-mall-banner.vue'
import SdkworkMallRecommend from './sdkwork-mall-recommend.vue'
import SdkworkMallProductGrid from './sdkwork-mall-product-grid.vue'
import { ProductVO } from '@/services'

// 路由实例
const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const activeCategory = ref('all')
const productGridListRef = ref()

// 功能网格数据
const featureItems = ref([
  { id: 'smart-home', name: '智能家居', icon: 'mdi:home-outline', badge: '热', badgeColor: '#ee0a24' },
  { id: 'ai-devices', name: 'AI设备', icon: 'mdi:robot-outline', badge: '新', badgeColor: '#1989fa' },
  { id: 'wearables', name: '智能穿戴', icon: 'mdi:watch-variant', badge: null },
  { id: 'robotics', name: '机器人', icon: 'mdi:robot-industrial', badge: null },
  { id: 'drones', name: '无人机', icon: 'mdi:quadcopter', badge: '爆', badgeColor: '#ff976a' },
  { id: 'sensors', name: '传感器', icon: 'mdi:motion-sensor', badge: null },
  { id: 'cameras', name: '摄像头', icon: 'mdi:cctv', badge: null },
  { id: 'mock', name: '模拟设备', icon: 'mdi:dots-horizontal', badge: null }
])

// 轮播图数据
const banners = ref([
  { 
    id: 1, 
    image: 'https://picsum.photos/375/150?random=10', 
    title: 'AI智能硬件专场', 
    description: '最新AI技术，智能生活新体验'
  },
  { 
    id: 2, 
    image: 'https://picsum.photos/375/150?random=11', 
    title: '智能家居套装', 
    description: '打造全屋智能，享受科技生活'
  },
  { 
    id: 3, 
    image: 'https://picsum.photos/375/150?random=12', 
    title: '智能机器人', 
    description: '家庭助手，工作伙伴，生活更轻松'
  }
])

// 推荐商品数据
const recommendedProducts = ref<ProductVO[]>([])

// 加载推荐商品
const loadRecommendedProducts = async () => {
  recommendedProducts.value = [
      {
        id: 101,
        title: 'AI智能音箱 Pro',
        price: 299,
        originalPrice: 399,
        resources: {
          images: [
            {
              url: 'https://picsum.photos/120/120?random=1',
              width: 120,
              height: 120
            }
          ]
        },
        categoryId: 1,
        salesCount: 12500,
        stock: 45
      },
      {
        id: 102,
        title: '智能门锁 X1',
        price: 899,
        originalPrice: 1299,
        resources: {
          images: [
            {
              url: 'https://picsum.photos/120/120?random=2',
              width: 120,
              height: 120
            }
          ]
        },
        categoryId: 1,
        salesCount: 8900,
        stock: 32
      },
      {
        id: 103,
        title: '扫地机器人 T8',
        price: 1599,
        originalPrice: 1999,
        resources: {
          images: [
            {
              url: 'https://picsum.photos/120/120?random=3',
              width: 120,
              height: 120
            }
          ]
        },
        categoryId: 1,
        salesCount: 15600,
        stock: 28
      },
      {
        id: 301,
        title: 'AI健康手环',
        price: 399,
        originalPrice: 499,
        resources: {
          images: [
            {
              url: 'https://picsum.photos/120/120?random=4',
              width: 120,
              height: 120
            }
          ]
        },
        categoryId: 2,
        salesCount: 25600,
        stock: 156
      }
    ]
}

// 商品分类数据
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'smart-home', name: '智能家居' },
  { id: 'ai-devices', name: 'AI设备' },
  { id: 'wearables', name: '智能穿戴' },
  { id: 'robotics', name: '机器人' },
  { id: 'drones', name: '无人机' }
])

// 筛选参数
const filterParams = reactive({
  keyword: '',
  category: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  tags: []
})

// 计算属性
const currentFilterParams = computed(() => ({
  ...filterParams,
  category: activeCategory.value === 'all' ? undefined : activeCategory.value
}))

// 事件处理
const handlePageLoad = () => {
  console.log('商城首页加载完成')
}

const handleSearch = () => {
  filterParams.keyword = searchKeyword.value
  productGridListRef.value?.refresh()
}

const handleClearSearch = () => {
  searchKeyword.value = ''
  filterParams.keyword = ''
  productGridListRef.value?.refresh()
}

const handleFeatureClick = (feature: any) => {
  showToast(`进入${feature.name}分类`)
  activeCategory.value = feature.id
  filterParams.category = feature.id === 'more' ? undefined : feature.id
  productGridListRef.value?.refresh()
}

const handleViewAllRecommend = () => {
  showToast('查看全部推荐商品')
  // 可以跳转到推荐商品页面
}

const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId
  filterParams.category = categoryId === 'all' ? undefined : categoryId as any
  productGridListRef.value?.refresh()
}

const handleProductSelect = (product: ProductVO) => {
  console.log('选中商品:', product.title)
}

const handleProductDelete = (product: ProductVO) => {
  console.log('删除商品:', product.title)
}

const handleProductSearch = (keyword: string) => {
  console.log('商品搜索:', keyword)
}

const handleProductLoad = (pageData: any) => {
  console.log('商品数据加载完成:', pageData)
}

const handleProductClick = (product: ProductVO) => {
  showToast(`查看商品: ${product.title}`)
  // 实际项目中可以跳转到商品详情页
  // router.push(`/product/${product.id}`)
}

const handleBatchOperation = (products: ProductVO[]) => {
  console.log('批量操作商品:', products)
  showToast(`批量操作 ${products.length} 个商品`)
}

// 组件挂载
onMounted(() => {
  console.log('商城首页初始化完成')
  loadRecommendedProducts()
})
</script>

<style scoped lang="scss">
.mall-home {
  padding-bottom: 20px;
}
</style>
