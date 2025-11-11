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

// 群组列表组件 Props 类型
export interface GroupListProps {
  // 群组数据
  groups?: Group[]
  loading?: boolean
  
  // 搜索和筛选
  showSearch?: boolean
  showFilter?: boolean
  showSort?: boolean
  
  // 按钮控制
  showJoinButton?: boolean
  
  // 样式控制
  customClass?: string
  
  // 最大显示数量，分页用
  pageSize?: number
  
  // 是否启用下拉刷新
  enableRefresh?: boolean
}

// 群组列表组件 Emits 类型
export interface GroupListEmits {
  (e: 'groupClick', group: Group): void
  (e: 'join', group: Group): void
  (e: 'search', keyword: string): void
  (e: 'refresh'): void
  (e: 'loadMore'): void
}

// 筛选标签类型
export interface FilterTag {
  label: string
  value: string
}

// 排序选项类型
export interface SortOption {
  text: string
  value: string
}