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

// 群组项组件 Props 类型
export interface GroupItemProps {
  group: Group
  showJoinButton?: boolean
}

// 群组项组件 Emits 类型
export interface GroupItemEmits {
  (e: 'click', group: Group): void
  (e: 'join', group: Group): void
}