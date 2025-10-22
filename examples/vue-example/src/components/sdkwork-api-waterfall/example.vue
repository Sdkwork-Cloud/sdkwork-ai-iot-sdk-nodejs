<template>
  <div class="waterfall-example">
    <h2>SDKWork API Waterfall 示例</h2>
    
    <sdkwork-api-waterfall
      :api="getProductList"
      :params="{ category: 'electronics' }"
      :columns="responsiveColumns"
      selectable
      searchable
      deletable
      @select="handleSelect"
      @delete="handleDelete"
      @search="handleSearch"
      @load="handleLoad"
      ref="waterfallRef"
    >
      <!-- 自定义瀑布流项 -->
      <template #default="{ item, index, selected }">
        <div class="product-card" :class="{ 'product-card--selected': selected }">
          <van-image
            :src="item.image"
            width="100%"
            height="auto"
            fit="cover"
            radius="8px 8px 0 0"
          />
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-price">¥{{ item.price }}</div>
            <div class="product-rating">
              <van-rate v-model="item.rating" readonly size="12" />
              <span>({{ item.sales }})</span>
            </div>
            <div class="product-description">{{ item.description }}</div>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <template #empty>
        <van-empty description="暂无商品数据" />
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <van-loading size="24px" vertical>加载商品数据...</van-loading>
      </template>
    </sdkwork-api-waterfall>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button type="primary" @click="handleRefresh">刷新</van-button>
      <van-button type="primary" @click="getSelectedItems">获取选中项</van-button>
      <van-button type="default" @click="clearSelected">清空选中</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import { showToast } from 'vant'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  sales: number
  description: string
}

// 模拟数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '智能手机 Pro Max',
    price: 5999,
    image: 'https://via.placeholder.com/300x400/007bff/ffffff?text=Phone',
    rating: 4.5,
    sales: 1200,
    description: '高性能智能手机，配备最新处理器和超清摄像头'
  },
  {
    id: '2',
    name: '笔记本电脑 Ultra',
    price: 8999,
    image: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Laptop',
    rating: 4.8,
    sales: 850,
    description: '轻薄便携，性能强劲，适合办公和娱乐'
  },
  {
    id: '3',
    name: '无线耳机 Pro',
    price: 1299,
    image: 'https://via.placeholder.com/300x250/dc3545/ffffff?text=Headphone',
    rating: 4.3,
    sales: 2300,
    description: '降噪效果出色，音质纯净，续航时间长'
  },
  {
    id: '4',
    name: '智能手表 Series',
    price: 1999,
    image: 'https://via.placeholder.com/300x350/ffc107/000000?text=Watch',
    rating: 4.6,
    sales: 1500,
    description: '健康监测，运动追踪，智能提醒功能'
  },
  {
    id: '5',
    name: '平板电脑 Mini',
    price: 3299,
    image: 'https://via.placeholder.com/300x280/17a2b8/ffffff?text=Tablet',
    rating: 4.4,
    sales: 700,
    description: '便携平板，适合阅读和轻度办公'
  },
  {
    id: '6',
    name: '游戏主机 Elite',
    price: 3999,
    image: 'https://via.placeholder.com/300x320/6f42c1/ffffff?text=Console',
    rating: 4.9,
    sales: 450,
    description: '高性能游戏主机，支持4K游戏体验'
  },
  {
    id: '7',
    name: '数码相机 Pro',
    price: 5999,
    image: 'https://via.placeholder.com/300x280/20c997/ffffff?text=Camera',
    rating: 4.7,
    sales: 320,
    description: '专业级数码相机，适合摄影爱好者'
  },
  {
    id: '8',
    name: '蓝牙音箱 Max',
    price: 899,
    image: 'https://via.placeholder.com/300x250/fd7e14/ffffff?text=Speaker',
    rating: 4.2,
    sales: 1800,
    description: '360度环绕音效，便携设计，续航强劲'
  }
]

// 组件引用
const waterfallRef = ref()

// 响应式列数
const responsiveColumns = computed(() => {
  const width = window.innerWidth
  if (width < 481) return 1
  if (width < 769) return 2
  if (width < 1025) return 3
  return 4
})

// API方法
const getProductList = async (params: Pageable): Promise<Page<Product>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { page = 0, size = 8 } = params
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = mockProducts.slice(startIndex, endIndex)
  
  return {
    content,
    empty: content.length === 0,
    first: page === 0,
    last: endIndex >= mockProducts.length,
    number: page,
    numberOfElements: content.length,
    size,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
      orders: []
    },
    totalElements: mockProducts.length,
    totalPages: Math.ceil(mockProducts.length / size)
  }
}

// 事件处理
const handleSelect = (product: Product) => {
  console.log('选中商品:', product)
  showToast(`选中: ${product.name}`)
}

const handleDelete = (product: Product) => {
  console.log('删除商品:', product)
  showToast(`删除: ${product.name}`)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  showToast(`搜索: ${keyword}`)
}

const handleLoad = (pageData: Page<Product>) => {
  console.log('数据加载完成:', pageData)
}

// 操作方法
const handleRefresh = () => {
  waterfallRef.value?.refresh()
  showToast('刷新数据')
}

const getSelectedItems = () => {
  const selected = waterfallRef.value?.getSelectedItems() || []
  console.log('选中项:', selected)
  showToast(`选中了 ${selected.length} 个商品`)
}

const clearSelected = () => {
  waterfallRef.value?.clearSelected()
  showToast('已清空选中项')
}

// 生命周期
onMounted(() => {
  console.log('Waterfall 示例组件已挂载')
})
</script>

<style scoped lang="scss">
.waterfall-example {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  
  h2 {
    text-align: center;
    padding: 16px;
    margin: 0;
    background: white;
    border-bottom: 1px solid #f0f0f0;
  }
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 16px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &--selected {
    border: 2px solid var(--van-primary-color);
    background: rgba(var(--van-primary-color-rgb), 0.05);
  }
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ee0a24;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
  margin-bottom: 8px;
}

.product-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.action-buttons {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
  
  .van-button {
    flex: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-info {
    padding: 10px;
  }
  
  .product-name {
    font-size: 13px;
  }
  
  .product-price {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 15px;
  }
  
  .product-price {
    font-size: 17px;
  }
}
</style>