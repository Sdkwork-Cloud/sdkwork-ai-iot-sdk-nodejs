/**
 * SDKWork Agent List 组件类型定义
 */

import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 智能体接口定义
 */
export interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  category: string
  tags: string[]
  createdTime: string
  updatedTime: string
  usageCount: number
  rating: number
  isPublic: boolean
  owner: string
}

/**
 * 组件属性接口
 */
export interface SdkworkAgentListProps {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Agent>>
  /** 请求参数对象 */
  params?: Record<string, any>
  /** 是否支持智能体选择 */
  selectable?: boolean
  /** 是否支持智能体删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 默认每页显示条数 */
  pageSize?: number
  /** 智能体唯一键字段名 */
  agentKey?: string
  /** 智能体名称字段名 */
  agentNameField?: string
  /** 智能体描述字段名 */
  agentDescriptionField?: string
}

/**
 * 组件事件接口
 */
export interface SdkworkAgentListEmits {
  /** 智能体选择事件 */
  (e: 'select', agent: Agent): void
  /** 智能体删除事件 */
  (e: 'delete', agent: Agent): void
  /** 智能体点击事件 */
  (e: 'click', agent: Agent): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<Agent>): void
  /** 创建智能体事件 */
  (e: 'create'): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkAgentListSlots {
  /** 默认插槽 - 自定义智能体列表项内容 */
  default(props: { agent: Agent; index: number; selected: boolean }): any
  /** 头部插槽 - 列表顶部区域 */
  header?: () => any
  /** 底部插槽 - 列表底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}

/**
 * 组件实例方法接口
 */
export interface SdkworkAgentListInstance {
  /** 刷新数据 */
  refresh(): void
  /** 加载更多数据 */
  loadMore(): void
  /** 获取当前智能体数据 */
  getAgents(): Agent[]
  /** 获取选中智能体 */
  getSelectedAgents(): Agent[]
  /** 清空选中智能体 */
  clearSelected(): void
  /** 设置选中智能体 */
  setSelectedAgents(agents: Agent[]): void
}

/**
 * 智能体列表项渲染配置
 */
export interface AgentListItemRenderConfig {
  /** 唯一键字段名 */
  keyField: string
  /** 名称字段名 */
  nameField: string
  /** 描述字段名 */
  descriptionField: string
  /** 自定义渲染函数 */
  render?: (agent: Agent, index: number) => any
}

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'loadingMore' | 'refreshing' | 'error'

/**
 * 智能体列表状态接口
 */
export interface AgentListState {
  /** 智能体数据列表 */
  agents: Agent[]
  /** 当前页码 */
  currentPage: number
  /** 总记录数 */
  totalElements: number
  /** 总页数 */
  totalPages: number
  /** 加载状态 */
  loadingState: LoadingState
  /** 搜索关键词 */
  searchKeyword: string
  /** 选中智能体 */
  selectedAgents: Agent[]
  /** 是否有更多数据 */
  hasMore: boolean
  /** 错误信息 */
  error?: string
}

/**
 * 分页配置接口
 */
export interface PaginationConfig {
  /** 当前页码 */
  page: number
  /** 每页大小 */
  size: number
  /** 排序字段 */
  sort?: string[]
  /** 搜索关键词 */
  keyword?: string
  /** 自定义过滤参数 */
  filters?: Record<string, any>
}

/**
 * 搜索配置接口
 */
export interface SearchConfig {
  /** 是否启用搜索 */
  enabled: boolean
  /** 防抖延迟（毫秒） */
  debounce: number
  /** 搜索字段 */
  fields?: string[]
  /** 自定义搜索函数 */
  customSearch?: (agents: Agent[], keyword: string) => Agent[]
}

/**
 * 选择配置接口
 */
export interface SelectionConfig {
  /** 是否启用选择 */
  enabled: boolean
  /** 选择模式：single/multiple */
  mode: 'single' | 'multiple'
  /** 是否保持选择状态 */
  persistSelection: boolean
}

/**
 * 组件配置接口
 */
export interface SdkworkAgentListConfig {
  /** 分页配置 */
  pagination: PaginationConfig
  /** 搜索配置 */
  search: SearchConfig
  /** 选择配置 */
  selection: SelectionConfig
  /** 智能体列表项渲染配置 */
  agentRender: AgentListItemRenderConfig
}

/**
 * 工具函数类型定义
 */

/**
 * 构建请求参数函数
 */
export type BuildParamsFn = (page: number, pageSize: number, keyword?: string, customParams?: Record<string, any>) => Pageable

/**
 * 数据转换函数
 */
export type DataTransformFn<T, R = any> = (response: any) => Page<T>

/**
 * 错误处理函数
 */
export type ErrorHandlerFn = (error: any) => void

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG: Partial<SdkworkAgentListConfig> = {
  pagination: {
    page: 0,
    size: 10
  },
  search: {
    enabled: false,
    debounce: 300
  },
  selection: {
    enabled: false,
    mode: 'multiple',
    persistSelection: false
  },
  agentRender: {
    keyField: 'id',
    nameField: 'name',
    descriptionField: 'description'
  }
}

/**
 * 响应式断点配置
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
} as const

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  /** 主色调 */
  primaryColor: string
  /** 背景色 */
  backgroundColor: string
  /** 边框色 */
  borderColor: string
  /** 选中背景色 */
  selectedBackgroundColor: string
  /** 文字颜色 */
  textColor: string
  /** 次要文字颜色 */
  secondaryTextColor: string
}

/**
 * 默认主题配置
 */
export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1890ff',
  backgroundColor: '#ffffff',
  borderColor: '#f0f0f0',
  selectedBackgroundColor: '#e6f7ff',
  textColor: '#333333',
  secondaryTextColor: '#666666'
}