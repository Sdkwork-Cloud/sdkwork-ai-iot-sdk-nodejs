import type { GenerationItem } from './types'

/**
 * 模拟生成记录数据
 */
export const mockGenerationData: GenerationItem[] = [
  {
    id: 'gen-001',
    type: 'image',
    title: 'AI生成风景画',
    description: '使用AI生成的美丽山水风景画，包含湖泊、山脉和森林',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=1',
      thumbnail: 'https://picsum.photos/200/150?random=1',
      prompt: '美丽的山水风景画，湖泊、山脉、森林，阳光明媚',
      model: 'stable-diffusion-v2.1',
      size: '1024x768',
      duration: '15秒'
    }
  },
  {
    id: 'gen-002',
    type: 'video',
    title: '产品展示视频',
    description: '为新产品制作的宣传展示视频',
    status: 'completed',
    createdAt: '2024-01-14T14:20:00Z',
    result: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=2',
      prompt: '产品展示视频，现代风格，专业制作',
      model: 'video-diffusion',
      duration: '30秒',
      resolution: '1920x1080'
    }
  },
  {
    id: 'gen-003',
    type: 'music',
    title: '轻松背景音乐',
    description: '适合工作学习的轻松背景音乐',
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z',
    result: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://picsum.photos/200/150?random=3',
      prompt: '轻松的背景音乐，钢琴为主，适合工作学习',
      model: 'music-gen',
      duration: '3分钟',
      genre: '背景音乐'
    }
  },
  {
    id: 'gen-004',
    type: 'voice',
    title: '中文语音播报',
    description: '标准普通话语音播报内容',
    status: 'completed',
    createdAt: '2024-01-12T16:45:00Z',
    result: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://picsum.photos/200/150?random=4',
      prompt: '标准普通话语音播报，专业播音员音色',
      model: 'tts-chinese',
      duration: '45秒',
      voice: '标准女声'
    }
  },
  {
    id: 'gen-005',
    type: 'image',
    title: '抽象艺术创作',
    description: 'AI生成的抽象艺术风格作品',
    status: 'completed',
    createdAt: '2024-01-11T11:20:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=5',
      thumbnail: 'https://picsum.photos/200/150?random=5',
      prompt: '抽象艺术风格，色彩丰富，现代感',
      model: 'dalle-3',
      size: '512x512',
      style: '抽象艺术'
    }
  },
  {
    id: 'gen-006',
    type: 'video',
    title: '动画短片',
    description: 'AI生成的2D动画短片',
    status: 'processing',
    createdAt: '2024-01-15T13:10:00Z',
    result: {
      url: '',
      thumbnail: 'https://picsum.photos/200/150?random=6',
      prompt: '2D动画短片，可爱风格，适合儿童观看',
      model: 'animation-diffusion',
      progress: 65,
      estimatedTime: '5分钟'
    }
  },
  {
    id: 'gen-007',
    type: 'music',
    title: '电子舞曲',
    description: '动感电子舞曲，适合派对使用',
    status: 'completed',
    createdAt: '2024-01-10T18:30:00Z',
    result: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://picsum.photos/200/150?random=7',
      prompt: '动感电子舞曲，节奏强烈，适合派对',
      model: 'music-transformer',
      duration: '4分钟',
      bpm: 128
    }
  },
  {
    id: 'gen-008',
    type: 'voice',
    title: '英文语音对话',
    description: '美式英语语音对话生成',
    status: 'failed',
    createdAt: '2024-01-09T15:55:00Z',
    result: {
      url: '',
      thumbnail: 'https://picsum.photos/200/150?random=8',
      prompt: '美式英语语音对话，自然流畅',
      model: 'tts-english',
      error: '语音生成失败，请重试',
      retryCount: 2
    }
  },
  {
    id: 'gen-009',
    type: 'image',
    title: '人物肖像',
    description: 'AI生成的人物肖像画',
    status: 'completed',
    createdAt: '2024-01-08T12:25:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=9',
      thumbnail: 'https://picsum.photos/200/150?random=9',
      prompt: '人物肖像画，写实风格，专业摄影效果',
      model: 'midjourney-v5',
      size: '800x600',
      quality: '高清'
    }
  },
  {
    id: 'gen-010',
    type: 'video',
    title: '教学视频',
    description: '编程教学视频制作',
    status: 'pending',
    createdAt: '2024-01-15T08:40:00Z',
    result: {
      url: '',
      thumbnail: 'https://picsum.photos/200/150?random=10',
      prompt: '编程教学视频，代码演示，讲解清晰',
      model: 'video-synthesis',
      queuePosition: 3,
      estimatedWait: '10分钟'
    }
  },
  {
    id: 'gen-011',
    type: 'music',
    title: '古典音乐',
    description: '巴赫风格的古典音乐作品',
    status: 'completed',
    createdAt: '2024-01-07T20:15:00Z',
    result: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://picsum.photos/200/150?random=11',
      prompt: '巴赫风格古典音乐，管风琴演奏',
      model: 'music-rnn',
      duration: '5分钟',
      composer: '巴赫风格'
    }
  },
  {
    id: 'gen-012',
    type: 'voice',
    title: '日语语音',
    description: '日语语音播报生成',
    status: 'completed',
    createdAt: '2024-01-06T17:50:00Z',
    result: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://picsum.photos/200/150?random=12',
      prompt: '日语语音播报，标准东京口音',
      model: 'tts-japanese',
      duration: '2分钟',
      accent: '东京标准语'
    }
  },
  {
    id: 'gen-013',
    type: 'promotion',
    title: '产品推广海报',
    description: '为新产品制作的推广海报设计',
    status: 'completed',
    createdAt: '2024-01-16T09:20:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=13',
      thumbnail: 'https://picsum.photos/200/150?random=13',
      prompt: '产品推广海报，现代设计风格，突出产品特点',
      model: 'dalle-3',
      size: '1200x800',
      style: '现代商业'
    }
  },
  {
    id: 'gen-014',
    type: 'shortVideo',
    title: '15秒短视频',
    description: '适合社交媒体传播的短视频内容',
    status: 'completed',
    createdAt: '2024-01-16T11:45:00Z',
    result: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=14',
      prompt: '15秒短视频，快节奏剪辑，适合社交媒体',
      model: 'video-diffusion-short',
      duration: '15秒',
      platform: '抖音/快手'
    }
  },
  {
    id: 'gen-015',
    type: 'portrait',
    title: '人物写真',
    description: 'AI生成的人物写真照片',
    status: 'completed',
    createdAt: '2024-01-16T14:30:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=15',
      thumbnail: 'https://picsum.photos/200/150?random=15',
      prompt: '人物写真，专业摄影效果，自然光线',
      model: 'portrait-ai',
      size: '800x1200',
      quality: '高清写真'
    }
  },
  {
    id: 'gen-016',
    type: 'promotion',
    title: '品牌宣传视频',
    description: '品牌形象宣传视频制作',
    status: 'processing',
    createdAt: '2024-01-16T16:15:00Z',
    result: {
      url: '',
      thumbnail: 'https://picsum.photos/200/150?random=16',
      prompt: '品牌宣传视频，高端大气，专业制作',
      model: 'video-promotion',
      progress: 40,
      estimatedTime: '20分钟'
    }
  },
  {
    id: 'gen-017',
    type: 'shortVideo',
    title: '搞笑短视频',
    description: 'AI生成的搞笑短视频内容',
    status: 'completed',
    createdAt: '2024-01-15T19:20:00Z',
    result: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://picsum.photos/200/150?random=17',
      prompt: '搞笑短视频，幽默风格，适合娱乐平台',
      model: 'video-comedy',
      duration: '30秒',
      category: '娱乐'
    }
  },
  {
    id: 'gen-018',
    type: 'portrait',
    title: '艺术写真',
    description: '艺术风格的人物写真创作',
    status: 'completed',
    createdAt: '2024-01-14T21:10:00Z',
    result: {
      url: 'https://picsum.photos/400/300?random=18',
      thumbnail: 'https://picsum.photos/200/150?random=18',
      prompt: '艺术写真，油画风格，古典美感',
      model: 'art-portrait',
      size: '1000x1500',
      style: '油画艺术'
    }
  }
]

/**
 * 模拟分页数据
 */
export const mockGenerationPage = {
  content: mockGenerationData,
  totalElements: mockGenerationData.length,
  totalPages: Math.ceil(mockGenerationData.length / 10),
  size: 10,
  number: 0,
  first: true,
  last: false,
  numberOfElements: mockGenerationData.length
}

/**
 * 获取模拟数据（支持分页）
 */
export function getMockGenerations(page = 0, size = 10) {
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = mockGenerationData.slice(startIndex, endIndex)
  
  return {
    content,
    totalElements: mockGenerationData.length,
    totalPages: Math.ceil(mockGenerationData.length / size),
    size,
    number: page,
    first: page === 0,
    last: endIndex >= mockGenerationData.length,
    numberOfElements: content.length
  }
}

/**
 * 根据ID获取单个生成记录
 */
export function getMockGenerationById(id: string): GenerationItem | undefined {
  return mockGenerationData.find(item => item.id === id)
}

/**
 * 根据类型过滤生成记录
 */
export function getMockGenerationsByType(type: GenerationItem['type']) {
  return mockGenerationData.filter(item => item.type === type)
}

/**
 * 根据状态过滤生成记录
 */
export function getMockGenerationsByStatus(status: GenerationItem['status']) {
  return mockGenerationData.filter(item => item.status === status)
}