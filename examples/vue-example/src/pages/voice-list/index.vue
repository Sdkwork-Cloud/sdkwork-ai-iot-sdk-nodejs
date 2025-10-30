<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <div class="page-content">
      <SdkworkVoiceList
        :api="fetchSpeakers"
        :params="listParams"
        :categorys="categories"
        :selected-speaker-id="selectedSpeakerId"
        searchable
        selectable
        selection-mode="single"
        :page-size="10"
        @select="handleSelectSpeaker"
        @search="handleSearch"
        @select-category="handleSelectCategory"
        @load="handleLoadComplete"
      >
        <!-- 自定义分类项 -->
        <template #category="{ category }">
          <div class="category-item">
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count" v-if="category.count">({{ category.count }})</span>
          </div>
        </template>

        <!-- 空状态 -->
        <template #empty>
          <div class="empty-state">
            <van-empty image="search" description="暂无发音人数据" />
          </div>
        </template>
      </SdkworkVoiceList>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue' 
import type { Page } from 'sdkwork-commons-typescript'   
import { CategoryVO } from '@/services'

const router = useRouter()

// 页面加载处理
const handlePageLoad = () => {
  console.log('页面已加载')
}

// 选中的发音人ID
const selectedSpeakerId = ref<string | number>('')

// 列表参数
const listParams = reactive({
  keyword: '',
  category: ''
})

// 分类数据
const categories: CategoryVO[] = [
  { id: 'all', name: '全部', count: 0 },
  { id: 'chinese', name: '中文发音人', count: 0 },
  { id: 'english', name: '英文发音人', count: 0 },
  { id: 'japanese', name: '日文发音人', count: 0 },
  { id: 'korean', name: '韩文发音人', count: 0 },
  { id: 'child', name: '儿童发音人', count: 0 },
  { id: 'elder', name: '老年发音人', count: 0 }
]

// 模拟API请求
const fetchSpeakers = async (params: any): Promise<Page<any>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  // 模拟数据
  const mockSpeakers: any[] = [
    {
      id: 1,
      name: '小爱',
      description: '清晰自然的中文女声，适合新闻播报',
      avatar: 'https://via.placeholder.com/48x48',
      category: 'chinese',
      language: '中文',
      gender: 'female',
      sampleAudio: 'https://example.com/sample1.mp3'
    },
    {
      id: 2,
      name: '小明',
      description: '沉稳有力的中文男声，适合商务场景',
      avatar: 'https://via.placeholder.com/48x48',
      category: 'chinese',
      language: '中文',
      gender: 'male',
      sampleAudio: 'https://example.com/sample2.mp3'
    },
    {
      id: 3,
      name: 'Emma',
      description: '标准美式英语发音，适合教育场景',
      avatar: 'https://via.placeholder.com/48x48',
      category: 'english',
      language: '英文',
      gender: 'female',
      sampleAudio: 'https://example.com/sample3.mp3'
    },
    {
      id: 4,
      name: 'David',
      description: '英式英语发音，适合正式场合',
      avatar: 'https://via.placeholder.com/48x48',
      category: 'english',
      language: '英文',
      gender: 'male',
      sampleAudio: 'https://example.com/sample4.mp3'
    },
    {
      id: 5,
      name: '花子',
      description: '温柔日文女声，适合动漫配音',
      avatar: 'https://via.placeholder.com/48x48',
      category: 'japanese',
      language: '日文',
      gender: 'female',
      sampleAudio: 'https://example.com/sample5.mp3'
    }
  ]

  // 根据搜索关键词和分类过滤
  let filteredSpeakers = mockSpeakers

  if (params.keyword) {
    filteredSpeakers = filteredSpeakers.filter(speaker => 
      speaker.name.includes(params.keyword) || 
      speaker.description.includes(params.keyword)
    )
  }

  if (params.category && params.category !== 'all') {
    filteredSpeakers = filteredSpeakers.filter(speaker => 
      speaker.category === params.category
    )
  }

  // 分页处理
  const page = params.page || 0
  const size = params.size || 10
  const startIndex = page * size
  const endIndex = startIndex + size
  const paginatedSpeakers = filteredSpeakers.slice(startIndex, endIndex)

  return {
    content: paginatedSpeakers,
    totalElements: filteredSpeakers.length,
    totalPages: Math.ceil(filteredSpeakers.length / size),
    number: page,
    size: size,
    first: page === 0,
    last: endIndex >= filteredSpeakers.length,
    empty: filteredSpeakers.length === 0
  }
}

// 事件处理
const handleSelectSpeaker = (speaker: any) => {
  selectedSpeakerId.value = speaker.id
  showToast(`已选择发音人：${speaker.name}`)
  console.log('选中的发音人：', speaker)
}

const handleSearch = (keyword: string) => {
  listParams.keyword = keyword
  console.log('搜索关键词：', keyword)
}

const handleSelectCategory = (category: any) => {
  listParams.category = category.id as string
  console.log('选中的分类：', category)
}

const handleLoadComplete = (pageData: any) => {
  console.log('数据加载完成：', pageData)
}

const handlePreview = (speaker: any) => {
  showToast(`试听发音人：${speaker.name}`)
  console.log('试听发音人：', speaker)
  // 这里可以集成实际的语音合成试听功能
}
</script>

<style scoped>
.voice-list-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.page-content {
  flex: 1;
  overflow: hidden;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.category-name {
  font-size: 14px;
  color: #333;
}

.category-count {
  font-size: 12px;
  color: #999;
}

.empty-state {
  padding: 40px 0;
}
</style>