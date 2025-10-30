<template>
  <div class="cameos-tab-content">
    <!-- 使用sdkwork-cameos-list组件展示角色 -->
    <sdkwork-cameos-list
      :api="cameosApi"
      :params="cameoParams"
      :selectable="true"
      :searchable="false"
      :page-size="12"
      :category-api="categoryApi"
      :categorys="cameoCategories"
      :category-key="'id'"
      :category-name-field="'name'"
      :category-count-field="'count'"
      :default-category-id="'all'"
      @select="(cameo:any)=>{
        handleSelect(cameo)
      }"
      @search="handleSearch"
      @select-category="handleSelectCategory"
      @load="(pageData:any)=>{
        handleLoad(pageData)
      }"
      ref="cameoListRef"
    >

      <!-- 空状态插槽 -->
      <template #empty>
        <div class="empty-state">
          <van-empty description="暂无角色" image="search">
            <template #description>
              <div class="empty-description">
                <p>您还没有创建任何角色</p>
                <p class="empty-tip">创建您的第一个角色来丰富对话体验吧！</p>
              </div>
            </template>
            <van-button type="primary" size="small" @click="handleCreateCameo">
              创建角色
            </van-button>
          </van-empty>
        </div>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <div class="loading-state">
          <van-loading size="24px" vertical>加载角色中...</van-loading>
        </div>
      </template>
    </sdkwork-cameos-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 角色接口定义
interface Cameo {
  id: string | number
  name: string
  description: string
  avatar: string
  category: string
  personality: string
  background: string
  voice: string
  usageCount: number
  rating: number
  isPublic: boolean
  createdTime: string
  tags: string[]
}

// 分类接口定义
interface CameoCategory {
  id: string | number
  name: string
  count?: number
}

// 组件引用
const cameoListRef = ref<any>()

// 请求参数
const cameoParams = ref<any>({
  category: '',
  personality: '',
  sort: 'usageCount_desc',
  keyword: null
})

// 角色分类数据
const cameoCategories = ref<CameoCategory[]>([
  { id: 'all', name: '全部', count: 80 },
  { id: 'popular', name: '热门', count: 25 },
  { id: 'new', name: '最新', count: 15 },
  { id: 'historical', name: '历史人物', count: 12 },
  { id: 'fictional', name: '虚构角色', count: 20 },
  { id: 'celebrity', name: '名人明星', count: 18 },
  { id: 'professional', name: '职业角色', count: 10 }
])

// 模拟分类API请求
const categoryApi = async (): Promise<CameoCategory[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  return cameoCategories.value
}

// 模拟角色API请求
const cameosApi = async (params: Pageable): Promise<Page<Cameo>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { pageNumber = 0, pageSize = 12 } = params
  const startIndex = pageNumber * pageSize
  
  // 模拟数据
  const mockData: Cameo[] = Array.from({ length: pageSize }, (_, index) => {
    const personalities = ['活泼开朗', '沉稳内敛', '幽默风趣', '严谨认真', '温柔体贴', '强势果断']
    const backgrounds = ['历史人物', '虚构角色', '名人明星', '职业角色']
    const voices = ['青年男声', '青年女声', '中年男声', '中年女声', '老年男声', '老年女声']
    const categories = ['historical', 'fictional', 'celebrity', 'professional']
    
    return {
      id: `cameo_${startIndex + index + 1}`,
      name: `角色 ${startIndex + index + 1}`,
      description: `这是一个${backgrounds[Math.floor(Math.random() * backgrounds.length)]}，性格${personalities[Math.floor(Math.random() * personalities.length)]}`,
      avatar: `https://picsum.photos/80/80?random=${startIndex + index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      voice: voices[Math.floor(Math.random() * voices.length)],
      usageCount: Math.floor(Math.random() * 5000),
      rating: Math.floor(Math.random() * 50) / 10, // 0-5分
      isPublic: Math.random() > 0.4,
      createdTime: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['AI角色', '对话', personalities[Math.floor(Math.random() * personalities.length)]]
    }
  })
  
  return {
    content: mockData,
    totalElements: 80,
    totalPages: Math.ceil(80 / pageSize),
    pageSize,
    number: pageNumber,
    first: pageNumber === 0,
    last: pageNumber >= Math.ceil(80 / pageSize) - 1,
    empty: mockData.length === 0
  }
}

// 处理角色选择
const handleSelect = (cameo: Cameo) => {
  showToast(`选择了角色: ${cameo.name}`)
  // 这里可以执行选择后的操作，比如设置默认角色
}

// 处理搜索
const handleSearch = (keyword: string) => {
  cameoParams.value = {
    ...cameoParams.value,
    keyword
  }
  showToast(`搜索角色: ${keyword}`)
}

// 处理分类选择
const handleSelectCategory = (category: CameoCategory) => {
  cameoParams.value = {
    ...cameoParams.value,
    category: category.id === 'all' ? '' : category.id.toString()
  }
  showToast(`选择了分类: ${category.name}`)
}

// 处理数据加载
const handleLoad = (pageData: Page<Cameo>) => {
  console.log('角色数据加载完成:', pageData)
}

// 处理创建角色
const handleCreateCameo = () => {
  showToast('开始创建角色')
  // 这里可以跳转到角色创建页面
}

// 刷新数据方法
const refreshData = () => {
  cameoListRef.value?.refresh()
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('角色Tab内容组件已加载')
})

// 暴露方法给父组件
defineExpose({
  refreshData
})
</script>

<style scoped lang="scss">
.cameos-tab-content {
  min-height: 400px;
}

.cameos-header {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  
  .create-button {
    width: 100%;
  }
}

.empty-state {
  padding: 40px 0;
  
  .empty-description {
    text-align: center;
    
    p {
      margin: 4px 0;
    }
    
    .empty-tip {
      font-size: 12px;
      color: #999;
    }
  }
}

.loading-state {
  padding: 40px 0;
  text-align: center;
}

// 响应式设计
@media (max-width: 768px) {
  .cameos-header {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .cameos-header {
    padding: 8px 12px;
  }
}
</style>