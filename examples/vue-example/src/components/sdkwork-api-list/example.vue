<template>
  <div class="example-container">
    <h2>SDKWork API List 组件示例</h2>
    
    <!-- 基础用法示例 -->
    <div class="example-section">
      <h3>基础用法</h3>
      <sdkwork-api-list
        :api="getUserList"
        :params="{ status: 'active' }"
        selectable
        searchable
        deletable
        :page-size="15"
        @select="handleSelect"
        @delete="handleDelete"
        @search="handleSearch"
        @load="handleLoad"
      />
    </div>

    <!-- 自定义列表项示例 -->
    <div class="example-section">
      <h3>自定义列表项</h3>
      <sdkwork-api-list
        :api="getProductList"
        searchable
        :item-title-field="'title'"
        :item-description-field="'category'"
      >
        <template #default="{ item, index }">
          <div class="custom-product-item">
            <div class="product-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="product-info">
              <div class="product-title">{{ item.title }}</div>
              <div class="product-category">{{ item.category }}</div>
              <div class="product-price">¥{{ item.price }}</div>
            </div>
            <div class="product-actions">
              <van-button size="small" type="primary" @click.stop="handleBuy(item)">
                购买
              </van-button>
            </div>
          </div>
        </template>

        <template #empty>
          <van-empty image="search" description="暂无商品数据">
            <van-button round type="primary" @click="handleRefresh">刷新</van-button>
          </van-empty>
        </template>
      </sdkwork-api-list>
    </div>

    <!-- 高级用法示例 -->
    <div class="example-section">
      <h3>高级用法 - 带操作栏</h3>
      <div class="toolbar">
        <van-button @click="handleRefreshAll">刷新所有</van-button>
        <van-button @click="handleGetSelected">获取选中项</van-button>
        <van-button @click="handleClearSelected">清空选中</van-button>
      </div>
      
      <sdkwork-api-list
        ref="advancedListRef"
        :api="getOrderList"
        selectable
        searchable
        :item-key="'orderId'"
      >
        <template #header>
          <div class="list-header">
            <div class="header-title">订单列表</div>
            <div class="header-stats">
              共 {{ totalOrders }} 条订单，选中 {{ selectedCount }} 条
            </div>
          </div>
        </template>

        <template #default="{ item }">
          <div class="order-item">
            <div class="order-header">
              <span class="order-id">订单号: {{ item.orderId }}</span>
              <span class="order-status" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </div>
            <div class="order-content">
              <div class="order-info">
                <div>商品: {{ item.productName }}</div>
                <div>金额: ¥{{ item.amount }}</div>
                <div>时间: {{ formatDate(item.createTime) }}</div>
              </div>
              <div class="order-actions">
                <van-button size="small" @click.stop="handleViewOrder(item)">查看</van-button>
                <van-button 
                  v-if="item.status === 'pending'" 
                  size="small" 
                  type="success"
                  @click.stop="handleConfirmOrder(item)"
                >
                  确认
                </van-button>
              </div>
            </div>
          </div>
        </template>
      </sdkwork-api-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { SdkworkApiListInstance } from './types'

// 用户数据类型
interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: string
  createTime: string
}

// 商品数据类型
interface Product {
  id: string
  title: string
  category: string
  price: number
  image: string
  stock: number
}

// 订单数据类型
interface Order {
  orderId: string
  productName: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  createTime: string
}

// 响应式数据
const advancedListRef = ref<SdkworkApiListInstance<Order>>()
const totalOrders = ref(0)
const selectedOrders = ref<Order[]>([])

// 计算属性
const selectedCount = computed(() => selectedOrders.value.length)

// 模拟API方法 - 用户列表
const getUserList = async (params: Pageable): Promise<Page<User>> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockData: User[] = Array.from({ length: params.size || 10 }, (_, index) => ({
    id: `user_${index + (params.page || 0) * (params.size || 10)}`,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    status: 'active',
    createTime: new Date().toISOString()
  }))

  return {
    content: mockData,
    empty: mockData.length === 0,
    first: (params.page || 0) === 0,
    last: (params.page || 0) >= 5, // 模拟总共6页数据
    number: params.page || 0,
    numberOfElements: mockData.length,
    size: params.size || 10,
    sort: { empty: true, sorted: false, unsorted: true },
    totalElements: 60, // 模拟总共60条数据
    totalPages: 6
  }
}

// 模拟API方法 - 商品列表
const getProductList = async (params: Pageable): Promise<Page<Product>> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const categories = ['电子产品', '家居用品', '服装鞋帽', '图书文具', '运动户外']
  const mockData: Product[] = Array.from({ length: params.size || 10 }, (_, index) => ({
    id: `product_${index}`,
    title: `商品${index + 1}`,
    category: categories[index % categories.length],
    price: Math.floor(Math.random() * 1000) + 100,
    image: `https://picsum.photos/100/100?random=${index}`,
    stock: Math.floor(Math.random() * 100)
  }))

  return {
    content: mockData,
    empty: mockData.length === 0,
    first: (params.page || 0) === 0,
    last: (params.page || 0) >= 2,
    number: params.page || 0,
    numberOfElements: mockData.length,
    size: params.size || 10,
    sort: { empty: true, sorted: false, unsorted: true },
    totalElements: 30,
    totalPages: 3
  }
}

// 模拟API方法 - 订单列表
const getOrderList = async (params: Pageable): Promise<Page<Order>> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const statuses: Order['status'][] = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled']
  const mockData: Order[] = Array.from({ length: params.size || 10 }, (_, index) => ({
    orderId: `ORDER${String(index + 1 + (params.page || 0) * (params.size || 10)).padStart(6, '0')}`,
    productName: `商品${index + 1}`,
    amount: Math.floor(Math.random() * 1000) + 100,
    status: statuses[index % statuses.length],
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))

  const total = 50
  return {
    content: mockData,
    empty: mockData.length === 0,
    first: (params.page || 0) === 0,
    last: (params.page || 0) >= Math.ceil(total / (params.size || 10)) - 1,
    number: params.page || 0,
    numberOfElements: mockData.length,
    size: params.size || 10,
    sort: { empty: true, sorted: false, unsorted: true },
    totalElements: total,
    totalPages: Math.ceil(total / (params.size || 10))
  }
}

// 事件处理函数
const handleSelect = (item: User) => {
  showToast(`选中用户: ${item.name}`)
}

const handleDelete = (item: User) => {
  showToast(`删除用户: ${item.name}`)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<any>) => {
  console.log('数据加载完成:', pageData)
  if (pageData.content[0]?.orderId) {
    totalOrders.value = pageData.totalElements
  }
}

const handleBuy = (product: Product) => {
  showToast(`购买商品: ${product.title}`)
}

const handleRefresh = () => {
  if (advancedListRef.value) {
    advancedListRef.value.refresh()
  }
}

const handleRefreshAll = () => {
  // 这里可以添加刷新所有列表的逻辑
  showToast('刷新所有列表')
}

const handleGetSelected = async () => {
  if (advancedListRef.value) {
    const selected = advancedListRef.value.getSelectedItems()
    selectedOrders.value = selected
    showToast(`已选中 ${selected.length} 个订单`)
  }
}

const handleClearSelected = () => {
  if (advancedListRef.value) {
    advancedListRef.value.clearSelected()
    selectedOrders.value = []
    showToast('已清空选中项')
  }
}

const handleViewOrder = (order: Order) => {
  showToast(`查看订单: ${order.orderId}`)
}

const handleConfirmOrder = (order: Order) => {
  showToast(`确认订单: ${order.orderId}`)
}

// 工具函数
const getStatusClass = (status: Order['status']) => {
  const classMap = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    shipped: 'status-shipped',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return classMap[status]
}

const getStatusText = (status: Order['status']) => {
  const textMap = {
    pending: '待处理',
    confirmed: '已确认',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;

  h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 18px;
  }
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;

  .van-button {
    flex-shrink: 0;
  }
}

.custom-product-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  .product-image {
    width: 60px;
    height: 60px;
    margin-right: 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .product-info {
    flex: 1;

    .product-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .product-category {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .product-price {
      font-size: 16px;
      color: #ff6b35;
      font-weight: 600;
    }
  }

  .product-actions {
    margin-left: 12px;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 12px;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .header-stats {
    font-size: 14px;
    color: #666;
  }
}

.order-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;

    .order-id {
      font-weight: 500;
      color: #333;
    }

    .order-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-confirmed {
        background: #d1ecf1;
        color: #0c5460;
      }

      &.status-shipped {
        background: #d4edda;
        color: #155724;
      }

      &.status-completed {
        background: #e2e3e5;
        color: #383d41;
      }

      &.status-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
    }
  }

  .order-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;

    .order-info {
      flex: 1;

      div {
        margin-bottom: 4px;
        font-size: 14px;
        color: #666;
      }
    }

    .order-actions {
      display: flex;
      gap: 8px;
      margin-left: 12px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .example-container {
    padding: 12px;
  }

  .example-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .toolbar {
    flex-wrap: wrap;
  }

  .custom-product-item {
    flex-direction: column;
    align-items: flex-start;

    .product-image {
      margin-right: 0;
      margin-bottom: 8px;
    }

    .product-actions {
      margin-left: 0;
      margin-top: 8px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }

  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-content {
    flex-direction: column;
    align-items: flex-start !important;

    .order-actions {
      margin-left: 0 !important;
      margin-top: 8px;
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>