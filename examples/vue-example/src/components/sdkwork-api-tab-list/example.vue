<template>
  <div class="example-container">
    <h2>SDKWork API Tab List 示例</h2>
    
    <!-- 基础用法示例 -->
    <div class="example-section">
      <h3>基础用法 - 静态Tabs</h3>
      <sdkwork-api-tab-list
        :api="getUserList"
        :tabs="staticTabs"
        :default-active-tab="'all'"
        searchable
        selectable
        @tab-change="handleStaticTabChange"
        @select="handleSelect"
        @search="handleSearch"
        @load="handleLoad"
      >
        <!-- 自定义列表项 -->
        <template #default="{ item, selected }">
          <div class="user-item" :class="{ selected }">
            <div class="avatar">{{ item.avatar }}</div>
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div class="email">{{ item.email }}</div>
              <div class="status">{{ item.status }}</div>
            </div>
            <div class="actions">
              <van-button size="small" @click.stop="handleEdit(item)">编辑</van-button>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <template #empty>
          <van-empty description="暂无用户数据" image="search">
            <template #description>
              <div class="empty-description">
                <p>暂时没有找到用户数据</p>
                <p class="empty-tip">您可以尝试调整搜索条件</p>
              </div>
            </template>
          </van-empty>
        </template>

        <!-- 加载状态 -->
        <template #loading>
          <van-loading size="24px" vertical>加载用户数据...</van-loading>
        </template>
      </sdkwork-api-tab-list>
    </div>

    <!-- 动态Tabs示例 -->
    <div class="example-section">
      <h3>动态Tabs - API加载</h3>
      <sdkwork-api-tab-list
        :api="getProductList"
        :tabs-api="getCategoryTabs"
        searchable
        @tab-change="handleDynamicTabChange"
        ref="dynamicTabListRef"
      >
        <!-- 自定义列表项 -->
        <template #default="{ item }">
          <div class="product-item">
            <img :src="item.image" class="product-image" />
            <div class="product-info">
              <div class="product-name">{{ item.name }}</div>
              <div class="product-price">¥{{ item.price }}</div>
              <div class="product-category">{{ item.categoryName }}</div>
            </div>
          </div>
        </template>

        <!-- 自定义Tab标题 -->
        <template #tab-title="{ tab }">
          <div class="custom-tab-title">
            <van-icon name="shop-o" />
            <span>{{ tab.title }}</span>
            <van-badge v-if="tab.count" :content="tab.count" />
          </div>
        </template>
      </sdkwork-api-tab-list>

      <div class="control-buttons">
        <van-button @click="refreshDynamicList">刷新数据</van-button>
        <van-button @click="switchToFirstTab">切换到第一个Tab</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { TabItem } from './types'

// 模拟数据
interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  categoryName: string
}

// 静态Tabs数据
const staticTabs = ref([
  { value: 'all', title: '全部用户', params: { status: '' } },
  { value: 'active', title: '活跃用户', params: { status: 'active' } },
  { value: 'inactive', title: '非活跃用户', params: { status: 'inactive' } },
  { value: 'banned', title: '禁用用户', params: { status: 'banned' } }
])

// 模拟用户数据
const mockUsers: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', avatar: '张', status: 'active' },
  { id: '2', name: '李四', email: 'lisi@example.com', avatar: '李', status: 'active' },
  { id: '3', name: '王五', email: 'wangwu@example.com', avatar: '王', status: 'inactive' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', avatar: '赵', status: 'banned' },
  { id: '5', name: '钱七', email: 'qianqi@example.com', avatar: '钱', status: 'active' }
]

// 模拟商品数据
const mockProducts: Product[] = [
  { id: '1', name: '智能手机', price: 2999, image: 'https://via.placeholder.com/60', categoryId: '1', categoryName: '电子产品' },
  { id: '2', name: '笔记本电脑', price: 5999, image: 'https://via.placeholder.com/60', categoryId: '1', categoryName: '电子产品' },
  { id: '3', name: '运动鞋', price: 399, image: 'https://via.placeholder.com/60', categoryId: '2', categoryName: '服装鞋帽' },
  { id: '4', name: 'T恤', price: 99, image: 'https://via.placeholder.com/60', categoryId: '2', categoryName: '服装鞋帽' },
  { id: '5', name: '书籍', price: 59, image: 'https://via.placeholder.com/60', categoryId: '3', categoryName: '图书文具' }
]

// 动态Tab列表引用
const dynamicTabListRef = ref()

// 获取用户列表API
const getUserList = async (params: Pageable): Promise<Page<User>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const { page = 0, size = 10, filters } = params
  let filteredUsers = [...mockUsers]

  // 应用状态过滤
  if (filters?.status) {
    filteredUsers = filteredUsers.filter(user => user.status === filters.status)
  }

  const startIndex = page * size
  const endIndex = startIndex + size
  const content = filteredUsers.slice(startIndex, endIndex)

  return {
    content,
    empty: content.length === 0,
    first: page === 0,
    last: endIndex >= filteredUsers.length,
    number: page,
    numberOfElements: content.length,
    size,
    sort: { empty: true, sorted: false, unsorted: true, orders: [] },
    totalElements: filteredUsers.length,
    totalPages: Math.ceil(filteredUsers.length / size)
  }
}

// 获取分类Tabs数据
const getCategoryTabs = async (): Promise<TabItem[]> => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 300))

  return [
    { value: 'all', title: '全部商品', count: mockProducts.length },
    { value: '1', title: '电子产品', count: mockProducts.filter(p => p.categoryId === '1').length },
    { value: '2', title: '服装鞋帽', count: mockProducts.filter(p => p.categoryId === '2').length },
    { value: '3', title: '图书文具', count: mockProducts.filter(p => p.categoryId === '3').length }
  ]
}

// 获取商品列表API
const getProductList = async (params: Pageable): Promise<Page<Product>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const { page = 0, size = 10, filters } = params
  let filteredProducts = [...mockProducts]

  // 应用分类过滤
  if (filters?.categoryId && filters.categoryId !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.categoryId === filters.categoryId)
  }

  const startIndex = page * size
  const endIndex = startIndex + size
  const content = filteredProducts.slice(startIndex, endIndex)

  return {
    content,
    empty: content.length === 0,
    first: page === 0,
    last: endIndex >= filteredProducts.length,
    number: page,
    numberOfElements: content.length,
    size,
    sort: { empty: true, sorted: false, unsorted: true, orders: [] },
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size)
  }
}

// 事件处理函数
const handleStaticTabChange = (tab: TabItem, params: Record<string, any>) => {
  console.log('静态Tab切换:', tab.title, '参数:', params)
}

const handleDynamicTabChange = (tab: TabItem, params: Record<string, any>) => {
  console.log('动态Tab切换:', tab.title, '参数:', params)
}

const handleSelect = (item: User) => {
  console.log('选中用户:', item.name)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<any>) => {
  console.log('数据加载完成:', pageData)
}

const handleEdit = (user: User) => {
  console.log('编辑用户:', user.name)
}

// 控制函数
const refreshDynamicList = () => {
  if (dynamicTabListRef.value) {
    dynamicTabListRef.value.refresh()
  }
}

const switchToFirstTab = () => {
  if (dynamicTabListRef.value) {
    const tabs = dynamicTabListRef.value.getTabsData()
    if (tabs.length > 0) {
      dynamicTabListRef.value.setActiveTab(tabs[0].value)
    }
  }
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 16px;
  max-width: 100%;
  box-sizing: border-box;

  h2 {
    margin-bottom: 24px;
    color: #333;
    text-align: center;
  }

  .example-section {
    margin-bottom: 32px;

    h3 {
      margin-bottom: 16px;
      color: #666;
      font-size: 16px;
    }
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s;

    &.selected {
      background-color: #e6f7ff;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-right: 12px;
    }

    .info {
      flex: 1;

      .name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .email {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
      }

      .status {
        font-size: 12px;
        color: #999;
      }
    }

    .actions {
      margin-left: 12px;
    }
  }

  .product-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;

    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      margin-right: 12px;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .product-price {
        font-size: 18px;
        font-weight: bold;
        color: #ff6b6b;
        margin-bottom: 4px;
      }

      .product-category {
        font-size: 12px;
        color: #999;
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

  .custom-tab-title {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .control-buttons {
    margin-top: 16px;
    display: flex;
    gap: 8px;

    .van-button {
      flex: 1;
    }
  }
}
</style>