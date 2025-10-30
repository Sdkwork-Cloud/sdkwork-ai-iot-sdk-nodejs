 
import { Page } from 'sdkwork-commons-typescript'
import type { Cameo, CameoPage, CameoPageable } from './types'

// 模拟角色数据
export const mockCameosData: Cameo[] = [
  {
    id: '1',
    name: '科技主播小美',
    avatar: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=小美',
    description: '专业科技产品评测主播，擅长讲解最新科技产品',
    type: 'character',
    cameoCount: 245,
    remixCount: 89,
    viewCount: 12500,
    likeCount: 3200,
    rating: 4.8,
    isFavorite: true,
    tags: ['科技', '评测', '专业'],
    createdAt: '2024-01-15',
    updatedAt: '2024-10-18'
  },
  {
    id: '2',
    name: '虚拟歌手小爱',
    avatar: 'https://via.placeholder.com/80x80/2196F3/FFFFFF?text=小爱',
    description: 'AI虚拟歌手，拥有甜美嗓音和独特音乐风格',
    type: 'character',
    cameoCount: 189,
    remixCount: 156,
    viewCount: 9800,
    likeCount: 2800,
    rating: 4.7,
    isFavorite: false,
    tags: ['音乐', '虚拟', '甜美'],
    createdAt: '2024-02-20',
    updatedAt: '2024-10-17'
  },
  {
    id: '3',
    name: '健身教练阿强',
    avatar: 'https://via.placeholder.com/80x80/FF9800/FFFFFF?text=阿强',
    description: '专业健身教练，提供科学的健身指导和营养建议',
    type: 'celebrity',
    cameoCount: 312,
    remixCount: 67,
    viewCount: 15800,
    likeCount: 4200,
    rating: 4.9,
    isFavorite: true,
    tags: ['健身', '健康', '专业'],
    createdAt: '2024-01-10',
    updatedAt: '2024-10-19'
  },
  {
    id: '4',
    name: '历史教授老张',
    avatar: 'https://via.placeholder.com/80x80/795548/FFFFFF?text=老张',
    description: '资深历史学教授，讲述有趣的历史故事和知识',
    type: 'custom',
    cameoCount: 178,
    remixCount: 45,
    viewCount: 8900,
    likeCount: 2100,
    rating: 4.6,
    isFavorite: false,
    tags: ['历史', '教育', '知识'],
    createdAt: '2024-03-05',
    updatedAt: '2024-10-16'
  },
  {
    id: '5',
    name: 'AI助手小智',
    avatar: 'https://via.placeholder.com/80x80/9C27B0/FFFFFF?text=小智',
    description: '智能AI助手，提供各种生活服务和问题解答',
    type: 'ai-generated',
    cameoCount: 456,
    remixCount: 234,
    viewCount: 24500,
    likeCount: 6800,
    rating: 4.8,
    isFavorite: true,
    tags: ['AI', '智能', '服务'],
    createdAt: '2024-01-01',
    updatedAt: '2024-10-20'
  },
  {
    id: '6',
    name: '美食博主小厨',
    avatar: 'https://via.placeholder.com/80x80/E91E63/FFFFFF?text=小厨',
    description: '热爱美食的博主，分享各种美食制作技巧',
    type: 'character',
    cameoCount: 267,
    remixCount: 123,
    viewCount: 13400,
    likeCount: 3500,
    rating: 4.7,
    isFavorite: false,
    tags: ['美食', '烹饪', '分享'],
    createdAt: '2024-02-15',
    updatedAt: '2024-10-18'
  },
  {
    id: '7',
    name: '旅行达人小游',
    avatar: 'https://via.placeholder.com/80x80/00BCD4/FFFFFF?text=小游',
    description: '环球旅行爱好者，分享世界各地的旅行见闻',
    type: 'celebrity',
    cameoCount: 189,
    remixCount: 78,
    viewCount: 11200,
    likeCount: 2900,
    rating: 4.6,
    isFavorite: true,
    tags: ['旅行', '冒险', '分享'],
    createdAt: '2024-03-10',
    updatedAt: '2024-10-17'
  },
  {
    id: '8',
    name: '游戏主播小玩',
    avatar: 'https://via.placeholder.com/80x80/FF5722/FFFFFF?text=小玩',
    description: '专业游戏主播，擅长各种热门游戏解说',
    type: 'custom',
    cameoCount: 345,
    remixCount: 167,
    viewCount: 18900,
    likeCount: 5200,
    rating: 4.9,
    isFavorite: false,
    tags: ['游戏', '娱乐', '解说'],
    createdAt: '2024-01-20',
    updatedAt: '2024-10-19'
  },
  {
    id: '9',
    name: '虚拟偶像小星',
    avatar: 'https://via.placeholder.com/80x80/673AB7/FFFFFF?text=小星',
    description: '新一代虚拟偶像，拥有独特的舞台表现力',
    type: 'ai-generated',
    cameoCount: 278,
    remixCount: 145,
    viewCount: 15600,
    likeCount: 4100,
    rating: 4.7,
    isFavorite: true,
    tags: ['虚拟', '偶像', '娱乐'],
    createdAt: '2024-02-25',
    updatedAt: '2024-10-16'
  },
  {
    id: '10',
    name: '财经分析师小财',
    avatar: 'https://via.placeholder.com/80x80/607D8B/FFFFFF?text=小财',
    description: '专业财经分析师，提供投资建议和市场分析',
    type: 'character',
    cameoCount: 156,
    remixCount: 67,
    viewCount: 9800,
    likeCount: 2300,
    rating: 4.5,
    isFavorite: false,
    tags: ['财经', '分析', '专业'],
    createdAt: '2024-03-15',
    updatedAt: '2024-10-15'
  }
]

// 默认API方法
export const defaultCameoApi = async (params: CameoPageable): Promise<Page<Cameo|any>|any> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { pageNumber = 0, pageSize = 10, filters = {} } = params
  const startIndex = pageNumber * pageSize
  const endIndex = startIndex + pageSize
  
  // 根据筛选条件过滤数据
  let filteredData = mockCameosData
  
  if (filters.type) {
    filteredData = filteredData.filter(item => item.type === filters.type)
  }
  
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.description.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  const pageData = filteredData.slice(startIndex, endIndex)
  
  return {
    content: pageData,
    totalElements: filteredData.length,
    totalPages: Math.ceil(filteredData.length / pageSize),
    pageSize: pageSize,
    number: pageNumber,
    first: pageNumber === 0,
    last: endIndex >= filteredData.length,
    numberOfElements: pageData.length
  }
}