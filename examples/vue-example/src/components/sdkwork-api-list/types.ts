/**
 * SDKWork API List 组件类型定义
 */

import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 组件属性接口
 */
export interface SdkworkApiListProps<T = any> {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<T>>
  /** 请求参数对象 */
  params?: Record<string, any>
  /** 是否支持行选择 */
  selectable?: boolean
  /** 是否支持行删除 */
  deletable?: boolean
  /** 是否支持顶部搜索 */
  searchable?: boolean
  /** 默认每页显示条数 */
  pageSize?: number
  /** 列表项唯一键字段名 */
  itemKey?: string
  /** 列表项标题字段名 */
  itemTitleField?: string
  /** 列表项描述字段名 */
  itemDescriptionField?: string
}

/**
 * 组件事件接口
 */
export interface SdkworkApiListEmits<T = any> {
  /** 行选择事件 */
  (e: 'select', item: T): void
  /** 行删除事件 */
  (e: 'delete', item: T): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<T>): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkApiListSlots<T = any> {
  /** 默认插槽 - 自定义列表项内容 */
  default(props: { item: T; index: number }): any
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
export interface SdkworkApiListInstance<T = any> {
  /** 刷新数据 */
  refresh(): void
  /** 加载更多数据 */
  loadMore(): void
  /** 获取当前数据 */
  getData(): T[]
  /** 获取选中项 */
  getSelectedItems(): T[]
  /** 清空选中项 */
  clearSelected(): void
  /** 设置选中项 */
  setSelectedItems(items: T[]): void
}

/**
 * 列表项渲染配置
 */
export interface ListItemRenderConfig<T = any> {
  /** 唯一键字段名 */
  keyField: string
  /** 标题字段名 */
  titleField: string
  /** 描述字段名 */
  descriptionField: string
  /** 自定义渲染函数 */
  render?: (item: T, index: number) => any
}

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'loadingMore' | 'refreshing' | 'error'

/**
 * 列表状态接口
 */
export interface ListState<T = any> {
  /** 数据列表 */
  data: T[]
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
  /** 选中项 */
  selectedItems: T[]
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
  customSearch?: (items: any[], keyword: string) => any[]
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
export interface SdkworkApiListConfig {
  /** 分页配置 */
  pagination: PaginationConfig
  /** 搜索配置 */
  search: SearchConfig
  /** 选择配置 */
  selection: SelectionConfig
  /** 列表项渲染配置 */
  itemRender: ListItemRenderConfig
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
export const DEFAULT_CONFIG: Partial<SdkworkApiListConfig> = {
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
  itemRender: {
    keyField: 'id',
    titleField: 'name',
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