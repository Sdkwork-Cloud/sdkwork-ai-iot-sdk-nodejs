import type { Page, Pageable } from 'sdkwork-commons-typescript' 
import { VoiceSpeakerVO } from '@/services'
import { VoiceCategory } from '@/stores/modules/audio/types'

// 默认发音人数据
export const defaultVoiceSpeakers: VoiceSpeakerVO[] = [
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
  },
  {
    id: 6,
    name: '晓晓',
    description: '年轻活力的女声，适合娱乐内容',
    avatar: '',
    category: 'female',
    language: '中文',
    gender: 'female',
    sampleAudio: ''
  },
  {
    id: 7,
    name: '云希',
    description: '知性优雅的女声，适合知识分享',
    avatar: '',
    category: 'female',
    language: '中文',
    gender: 'female',
    sampleAudio: ''
  },
  {
    id: 8,
    name: '逍遥',
    description: '沉稳大气的男声，适合商务场景',
    avatar: '',
    category: 'male',
    language: '中文',
    gender: 'male',
    sampleAudio: ''
  }
]

// 默认分类数据
export const defaultVoiceCategories: VoiceCategory[] = [
  { id: 'all', name: '全部', count: defaultVoiceSpeakers.length },
  { id: 'female', name: '女声', count: defaultVoiceSpeakers.filter(s => s.gender === 'female').length },
  { id: 'male', name: '男声', count: defaultVoiceSpeakers.filter(s => s.gender === 'male').length },
  { id: 'chinese', name: '中文', count: defaultVoiceSpeakers.filter(s => s.language === '中文').length },
  { id: 'english', name: '英语', count: defaultVoiceSpeakers.filter(s => s.language === '英语').length }
]

// 默认API方法 - 发音人数据
export const defaultVoiceApi = async (params: Pageable | any): Promise<Page<VoiceSpeakerVO> | any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 根据分类筛选数据
  let filteredSpeakers = defaultVoiceSpeakers
  if (params.categoryId && params.categoryId !== 'all') {
    filteredSpeakers = defaultVoiceSpeakers.filter(speaker =>
      speaker.category === params.categoryId || speaker.language === params.categoryId
    )
  }

  // 根据关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredSpeakers = filteredSpeakers.filter(speaker =>
      speaker.name.toLowerCase().includes(keyword) ||
      speaker.description.toLowerCase().includes(keyword)
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
    last: end >= filteredSpeakers.length
  }
}

// 默认API方法 - 分类数据
export const defaultCategoryApi = async (): Promise<VoiceCategory[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  return defaultVoiceCategories
}

// 导出默认数据
export default {
  speakers: defaultVoiceSpeakers,
  categories: defaultVoiceCategories,
  api: defaultVoiceApi,
  categoryApi: defaultCategoryApi
}