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
  images?: string[] // 图片
  video?: {
    url: string
    thumbnail?: string
    title?: string
    duration?: number
  } // 视频
  audio?: {
    url: string
    title?: string
    duration?: number
    fileSize?: number
  } // 音频
  link?: LinkPreview // 链接
  files?: FileItem[] // 文件
  
  // 通用信息
  isPinned: boolean
  isLiked: boolean
  likeCount: number
  commentCount: number
  createdAt: string
}

// FeedItem组件属性
export interface FeedItemProps {
  feed: Feed
  selected?: boolean
}