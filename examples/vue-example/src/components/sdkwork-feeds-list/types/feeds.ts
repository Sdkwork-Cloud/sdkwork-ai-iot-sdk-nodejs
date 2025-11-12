// 文件信息接口
export interface FileItem {
  name: string
  size: number
  type?: string
  url?: string
}

// 链接预览接口
export interface LinkPreview {
  title?: string
  description?: string
  image?: string
  url: string
}

// 动态内容类型
export type FeedContentType = 'text' | 'image' | 'video' | 'audio' | 'link' | 'file'

// 动态内容数据接口
export interface FeedContent {
  // 图片内容
  images?: string[]
  
  // 视频内容
  video?: {
    url: string
    thumbnail?: string
    title?: string
    duration?: number
  }
  
  // 音频内容
  audio?: {
    url: string
    title?: string
    duration?: number
    fileSize?: number
  }
  
  // 链接内容
  link?: LinkPreview
  
  // 文件内容
  files?: FileItem[]
}

// 动态接口
export interface Feed {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  
  // 内容类型
  type: FeedContentType
  
  // 内容数据
  contentData?: FeedContent
  
  // 兼容旧版本
  images?: string[]
  video?: {
    url: string
    thumbnail?: string
    title?: string
    duration?: number
  }
  audio?: {
    url: string
    title?: string
    duration?: number
    fileSize?: number
  }
  link?: LinkPreview
  files?: FileItem[]
  
  // 交互数据
  isPinned: boolean
  isLiked: boolean
  likeCount: number
  commentCount: number
  shareCount?: number
  
  // 时间信息
  createdAt: string
  updatedAt?: string
}

// FeedItem组件属性
export interface FeedItemProps {
  feed: Feed
  selected?: boolean
}

// FeedList组件过滤器
export interface FeedListFilter {
  type?: FeedContentType | FeedContentType[]
  userId?: string
  timeRange?: {
    start: Date
    end: Date
  }
  keyword?: string
  isPinned?: boolean
}

// FeedList组件排序
export interface FeedListSort {
  field: 'createdAt' | 'likeCount' | 'commentCount'
  order: 'asc' | 'desc'
}

// FeedList分页参数
export interface FeedListPageableParams {
  filter?: FeedListFilter
  sort?: FeedListSort
}

// Feed API响应
export interface FeedListResponse {
  content: Feed[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}