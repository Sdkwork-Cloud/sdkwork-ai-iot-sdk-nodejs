<template>
  <div class="voice-list-popup-demo">
    <div class="demo-header">
      <h1>发音人选择器弹出层演示</h1>
      <p>点击下方按钮打开发音人选择弹出层</p>
    </div>

    <div class="demo-content">
      <!-- 当前选中的发音人显示 -->
      <div class="selected-speaker" v-if="selectedSpeaker">
        <div class="speaker-info">
          <div class="avatar">
            <img :src="selectedSpeaker.avatar" :alt="selectedSpeaker.name" v-if="selectedSpeaker.avatar" />
            <div class="avatar-placeholder" v-else>
              {{ getInitials(selectedSpeaker.name) }}
            </div>
          </div>
          <div class="info">
            <div class="name">{{ selectedSpeaker.name }}</div>
            <div class="description">{{ selectedSpeaker.description }}</div>
            <div class="meta">
              <span class="language">{{ selectedSpeaker.language }}</span>
              <span class="gender">{{ getGenderText(selectedSpeaker.gender) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 打开弹出层的按钮 -->
      <div class="action-buttons">
        <van-button type="primary" size="large" @click="showPopup = true">
          {{ selectedSpeaker ? '更换发音人' : '选择发音人' }}
        </van-button>
        
        <van-button type="default" size="large" @click="showFullScreenPopup = true">
          全屏选择发音人
        </van-button>
      </div>
    </div>

    <!-- 普通弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showPopup"
      title="选择发音人"
      height="70vh"
      :api="getVoiceSpeakers"
      :params="searchParams"
      :category-api="getVoiceCategories"
      :categorys="mockCategories"
      :selected-speaker-id="selectedSpeaker?.id ? Number(selectedSpeaker.id) : undefined"
      @confirm="handleConfirm"
      @close="handleClose"
      @select="handleSelect"
      @search="handleSearch"
    />

    <!-- 全屏弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showFullScreenPopup"
      title="选择发音人"
      height="100dvh"
      confirm-text="确认选择"
      :api="getVoiceSpeakers"
      :params="searchParams"
      :category-api="getVoiceCategories"
      :categorys="mockCategories"
      :selected-speaker-id="selectedSpeaker?.id ? Number(selectedSpeaker.id) : undefined"
      @confirm="handleConfirm"
      @close="handleClose"
      @select="handleSelect"
      @search="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript' 
import SdkworkVoiceListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import { VoiceSpeakerVO } from '@/services'
import { VoiceCategory } from '@/stores/modules/audio/types'

// 响应式数据
const showPopup = ref(false)
const showFullScreenPopup = ref(false)
const selectedSpeaker = ref<VoiceSpeakerVO | null>(null)
const searchParams = ref({})

// 模拟分类数据
const mockCategories: VoiceCategory[] = [
  { id: 'all', name: '全部', count: 5 },
  { id: 'female', name: '女声', count: 3 },
  { id: 'male', name: '男声', count: 2 },
  { id: 'chinese', name: '中文', count: 3 },
  { id: 'english', name: '英语', count: 2 }
]

// 模拟分类API请求
const getVoiceCategories = async (): Promise<VoiceCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCategories
}

// 模拟API请求
const getVoiceSpeakers = async (params: Pageable | any): Promise<Page<VoiceSpeakerVO>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟数据
  const mockSpeakers: VoiceSpeakerVO[] = [
    {
      id: 1,
      name: '小爱同学',
      description: '甜美可爱的女声，适合日常对话',
      avatar: '',
      category: 'female',
      language: '中文',
      gender: 'female',
      sampleAudio: ''
    },
    {
      id: 2,
      name: '小度',
      description: '清晰自然的男声，适合播报新闻',
      avatar: '',
      category: 'male',
      language: '中文',
      gender: 'male',
      sampleAudio: ''
    },
    {
      id: 3,
      name: 'Siri',
      description: '标准美式英语发音，适合国际交流',
      avatar: '',
      category: 'female',
      language: '英语',
      gender: 'female',
      sampleAudio: ''
    },
    {
      id: 4,
      name: 'Alex',
      description: '深沉有力的男声，适合朗读文学作品',
      avatar: '',
      category: 'male',
      language: '英语',
      gender: 'male',
      sampleAudio: ''
    },
    {
      id: 5,
      name: '樱花',
      description: '温柔细腻的女声，适合儿童故事',
      avatar: '',
      category: 'female',
      language: '中文',
      gender: 'female',
      sampleAudio: ''
    }
  ]

  // 根据分类筛选数据
  let filteredSpeakers = mockSpeakers
  if (params.categoryId && params.categoryId !== 'all') {
    filteredSpeakers = mockSpeakers.filter(speaker => 
      speaker.category === params.categoryId || speaker.language === params.categoryId
    )
  }

  // 模拟分页
  const page = params.page || 0
  const size = params.size || 10
  const start = page * size
  const end = start + size
  
  return {
    content: filteredSpeakers.slice(start, end),
    totalElements: filteredSpeakers.length,
    totalPages: Math.ceil(filteredSpeakers.length / size),
    number: page,
    size: size,
    first: page === 0,
    last: end >= filteredSpeakers.length,
    empty: filteredSpeakers.length === 0,
    numberOfElements: filteredSpeakers.slice(start, end).length,
    sort: []
  }
}

// 获取名称首字母
const getInitials = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

// 获取性别文本
const getGenderText = (gender: string): string => {
  return gender === 'male' ? '男声' : '女声'
}

// 处理确认选择
const handleConfirm = (speaker: VoiceSpeakerVO) => {
  selectedSpeaker.value = speaker
  showToast(`已选择: ${speaker.name}`)
}

// 处理关闭
const handleClose = () => {
  console.log('弹出层已关闭')
}

// 处理选择发音人
const handleSelect = (speaker: VoiceSpeakerVO) => {
  console.log('选择了发音人:', speaker.name)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  searchParams.value = { keyword }
  console.log('搜索关键词:', keyword)
}
</script>

<style scoped>
.voice-list-popup-demo {
  padding: 20px;
  min-height: 100dvh;
  background: #f5f5f5;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.demo-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selected-speaker {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.speaker-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.speaker-info .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.speaker-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.speaker-info .avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #1989fa;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.speaker-info .info {
  flex: 1;
}

.speaker-info .name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.speaker-info .description {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.speaker-info .meta {
  display: flex;
  gap: 8px;
}

.speaker-info .language,
.speaker-info .gender {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 10px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-list-popup-demo {
    padding: 16px;
  }
  
  .demo-header h1 {
    font-size: 20px;
  }
  
  .selected-speaker {
    padding: 12px;
  }
  
  .speaker-info .avatar {
    width: 40px;
    height: 40px;
  }
}
</style>