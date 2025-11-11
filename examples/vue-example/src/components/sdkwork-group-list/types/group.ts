// 群组类型定义
export interface Group {
  id: string | number
  name: string
  description: string
  avatar?: string
  tags?: string[]
  memberCount: number
  maxMembers?: number
  messageCount: number
  price: number
  originalPrice?: number
  isOfficial?: boolean
  isVerified?: boolean
  isHot?: boolean
  isJoined?: boolean
  joining?: boolean
  type?: 'public' | 'private' | 'official'
  createdAt?: string | Date
}