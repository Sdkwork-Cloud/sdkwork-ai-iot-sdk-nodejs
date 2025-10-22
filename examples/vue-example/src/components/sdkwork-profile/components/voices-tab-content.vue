<template>
  <div class="voices-tab-content">
    <!-- 使用sdkwork-voice-speaker-category-list组件展示声音 -->
    <sdkwork-voice-speaker-list
      :api="voicesApi"
      :params="voiceParams"
      :selectable="true"
      :searchable="false"
      :page-size="15"
      :category-api="categoryApi"
      :categorys="voiceCategories"
      :category-key="'id'"
      :category-name-field="'name'"
      :category-count-field="'count'"
      :default-category-id="'all'"
      @select="handleSelect"
      @search="handleSearch"
      @select-category="handleSelectCategory"
      @load="handleLoad"
      ref="voiceListRef"
    >
      <!-- 头部插槽 - 添加筛选和排序 -->
      <!-- <template #header>
        <div class="voices-header">
          <div class="filter-section">
            <van-dropdown-menu>
              <van-dropdown-item v-model="voiceParams.language" :options="languageOptions" @change="handleLanguageChange" />
              <van-dropdown-item v-model="voiceParams.gender" :options="genderOptions" @change="handleGenderChange" />
            </van-dropdown-menu>
          </div>
        </div>
      </template> -->

      <!-- 空状态插槽 -->
      <template #empty>
        <div class="empty-state">
          <van-empty description="暂无声音" image="search">
            <template #description>
              <div class="empty-description">
                <p>当前分类下没有声音</p>
                <p class="empty-tip">尝试切换分类或调整筛选条件</p>
              </div>
            </template>
          </van-empty>
        </div>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <div class="loading-state">
          <van-loading size="24px" vertical>加载声音中...</van-loading>
        </div>
      </template>
    </sdkwork-voice-speaker-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import { VoiceSpeakerVO } from '@/services'
import { VoiceCategory } from '@/stores/modules/audio/types'
 

// 组件引用
const voiceListRef = ref<any>()

// 请求参数
const voiceParams = ref<any>({
  language: '',
  gender: '',
  category: '',
  sort: 'usageCount_desc',
  keyword: null
})

// 语言选项
const languageOptions = [
  { text: '全部语言', value: '' },
  { text: '中文', value: 'zh' },
  { text: '英文', value: 'en' },
  { text: '日语', value: 'ja' },
  { text: '韩语', value: 'ko' }
]

// 性别选项
const genderOptions = [
  { text: '全部性别', value: '' },
  { text: '男声', value: 'male' },
  { text: '女声', value: 'female' }
]

// 声音分类数据
const voiceCategories = ref<VoiceCategory[]>([
  { id: 'all', name: '全部', count: 150 },
  { id: 'popular', name: '热门', count: 45 },
  { id: 'new', name: '最新', count: 25 },
  { id: 'chinese', name: '中文', count: 80 },
  { id: 'english', name: '英文', count: 40 },
  { id: 'cartoon', name: '卡通', count: 15 },
  { id: 'professional', name: '专业', count: 30 }
])

// 模拟分类API请求
const categoryApi = async (): Promise<VoiceCategory[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  return voiceCategories.value
}

// 模拟声音API请求
const voicesApi = async (params: Pageable): Promise<Page<VoiceSpeakerVO>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { page = 0, size = 15 } = params
  const startIndex = page * size
  
  // 模拟数据
  const mockData: VoiceSpeakerVO[] = Array.from({ length: size }, (_, index) => {
    const languages = ['zh', 'en', 'ja', 'ko']
    const genders = ['male', 'female']
    const categories = ['popular', 'new', 'chinese', 'english', 'cartoon', 'professional']
    
    return {
      id: `voice_${startIndex + index + 1}`,
      name: `声音 ${startIndex + index + 1}`,
      description: `这是一个${genders[Math.floor(Math.random() * genders.length)] === 'male' ? '男' : '女'}声，适用于${['中文', '英文', '日语', '韩语'][Math.floor(Math.random() * 4)]}场景`,
      avatar: `https://picsum.photos/60/60?random=${startIndex + index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      gender: genders[Math.floor(Math.random() * genders.length)] as 'male' | 'female',
      sampleAudio: `https://example.com/audio/sample_${startIndex + index + 1}.mp3`,
      usageCount: Math.floor(Math.random() * 10000),
      rating: Math.floor(Math.random() * 50) / 10, // 0-5分
      isPublic: Math.random() > 0.3,
      createdTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
  
  return {
    content: mockData,
    totalElements: 150,
    totalPages: Math.ceil(150 / size),
    size,
    number: page,
    first: page === 0,
    last: page >= Math.ceil(150 / size) - 1,
    empty: mockData.length === 0
  }
}

// 处理声音选择
const handleSelect = (speaker: VoiceSpeakerVO) => {
  showToast(`选择了声音: ${speaker.name}`)
  // 这里可以执行选择后的操作，比如设置默认声音
}

// 处理搜索
const handleSearch = (keyword: string) => {
  voiceParams.value = {
    ...voiceParams.value,
    keyword
  }
  showToast(`搜索声音: ${keyword}`)
}

// 处理分类选择
const handleSelectCategory = (category: VoiceCategory) => {
  voiceParams.value = {
    ...voiceParams.value,
    category: category.id === 'all' ? '' : category.id.toString()
  }
  showToast(`选择了分类: ${category.name}`)
}

// 处理数据加载
const handleLoad = (pageData: Page<VoiceSpeakerVO>) => {
  console.log('声音数据加载完成:', pageData)
}

// 处理语言筛选变化
const handleLanguageChange = (value: string) => {
  voiceParams.value.language = value
  voiceListRef.value?.refresh()
}

// 处理性别筛选变化
const handleGenderChange = (value: string) => {
  voiceParams.value.gender = value
  voiceListRef.value?.refresh()
}

// 刷新数据方法
const refreshData = () => {
  voiceListRef.value?.refresh()
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('声音Tab内容组件已加载')
})

// 暴露方法给父组件
defineExpose({
  refreshData
})
</script>

<style scoped lang="scss">
.voices-tab-content {
  min-height: 400px;
}

.voices-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  
  .filter-section {
    padding: 12px 16px;
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
  .voices-header {
    .filter-section {
      padding: 8px 12px;
    }
  }
}

@media (max-width: 480px) {
  .voices-header {
    .filter-section {
      padding: 6px 8px;
    }
  }
}
</style>