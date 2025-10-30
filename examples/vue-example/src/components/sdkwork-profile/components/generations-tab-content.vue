<template>
  <div class="generations-tab-content">
    <!-- 使用重构后的sdkwork-generation-waterfall组件展示作品 -->
    <sdkwork-generation-waterfall
      :api="generationsApi"
      :params="generationParams"
      :selectable="false"
      :deletable="false"
      :searchable="false"
      :page-size="12"
      :item-key="'id'"
      :item-title-field="'title'"
      :item-description-field="'description'"
      :columns="2"
      :gap="0"
      :theme-mode="'auto'"
      :show-stats="true"
      :show-meta="true"
      :show-status="true"
      :clickable="true"
      :empty-text="'暂无作品'"
      :empty-tip="'开始创作您的第一个作品吧！'"
      :show-create-button="true"
      :create-button-text="'开始创作'"
      :loading-text="'加载作品中...'"
      @search="handleSearch"
      @load="handleLoad"
      @item-click="handleItemClick"
      @create="handleCreateGeneration"
      ref="waterfallRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 作品接口定义
interface Generation {
  id: string
  title: string
  description: string
  image: string
  views: number
  likes: number
  status: 'published' | 'draft'
  createdTime: string
  tags: string[]
  category: string
}

// 组件引用
const waterfallRef = ref<any>()

// 请求参数
const generationParams = ref<any>({
  category: '',
  status: '',
  sort: 'createdTime_desc',
  keyword: null
})

// 模拟API请求
const generationsApi = async (params: Pageable): Promise<Page<Generation>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { pageNumber = 0, pageSize = 12 } = params
  const startIndex = pageNumber * pageSize
  
  // 模拟数据
  const mockData: Generation[] = Array.from({ length: pageSize }, (_, index) => ({
    id: `generation_${startIndex + index + 1}`,
    title: `作品 ${startIndex + index + 1}`,
    description: `这是第 ${startIndex + index + 1} 个作品的描述信息，展示了AI创作的精彩成果`,
    image: `https://picsum.photos/300/200?random=${startIndex + index + 1}`,
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    status: Math.random() > 0.3 ? 'published' : 'draft',
    createdTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['AI创作', '艺术', '设计'],
    category: 'art'
  }))
  
  return {
    content: mockData,
    totalElements: 100,
    totalPages: Math.ceil(100 / pageSize),
    pageSize,
    number: pageNumber,
    first: pageNumber === 0,
    last: pageNumber >= Math.ceil(100 / pageSize) - 1,
    empty: mockData.length === 0
  }
}

// 处理搜索
const handleSearch = (keyword: string) => {
  generationParams.value = {
    ...generationParams.value,
    keyword
  }
  showToast(`搜索关键词: ${keyword}`)
}

// 处理数据加载
const handleLoad = (pageData: Page<Generation>) => {
  console.log('作品数据加载完成:', pageData)
}

// 处理作品项点击
const handleItemClick = (item: Generation) => {
  showToast(`查看作品: ${item.title}`)
  // 这里可以跳转到作品详情页面
}

// 处理创建作品
const handleCreateGeneration = () => {
  showToast('开始创作新作品')
  // 这里可以跳转到创作页面
}

// 刷新数据方法
const refreshData = () => {
  waterfallRef.value?.refresh()
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('作品Tab内容组件已加载')
})

// 暴露方法给父组件
defineExpose({
  refreshData
})
</script>

<style scoped lang="scss">
.generations-tab-content {
  min-height: 400px;
}
</style>