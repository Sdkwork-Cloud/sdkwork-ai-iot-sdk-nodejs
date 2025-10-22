/**
 * SDKWork API Tab List 组件类型定义
 */

import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * Tab项数据类型定义
 */
export interface TabItem {
  /** Tab的值 */
  value: string | number
  /** Tab的显示标题 */
  title: string
  /** Tab对应的查询参数 */
  params?: Record<string, any>
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 组件属性接口
 */
export interface SdkworkApiTabListProps<T = any> {
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
  /** Tabs数据数组 */
  tabs?: TabItem[]
  /** Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** Tabs字段映射配置 */
  tabsFieldMap?: {
    /** 值字段名映射 */
    value?: string
    /** 标题字段名映射 */
    title?: string
    /** 参数字段名映射 */
    params?: string
  }
  /** Tabs是否粘性定位 */
  tabsSticky?: boolean
  /** Tabs是否支持滑动切换 */
  tabsSwipeable?: boolean
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
}

/**
 * 组件事件接口
 */
export interface SdkworkApiTabListEmits<T = any> {
  /** 行选择事件 */
  (e: 'select', item: T): void
  /** 行删除事件 */
  (e: 'delete', item: T): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<T>): void
  /** Tab切换事件 */
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkApiTabListSlots<T = any> {
  /** 默认插槽 - 自定义列表项内容 */
  default(props: { item: T; index: number; selected: boolean }): any
  /** 头部插槽 - 列表顶部区域 */
  header?: () => any
  /** 底部插槽 - 列表底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** Tab标题自定义插槽 */
  'tab-title'?: (props: { tab: TabItem }) => any
}

/**
 * 组件实例方法接口
 */
export interface SdkworkApiTabListInstance<T = any> {
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
  /** 获取当前激活的Tab */
  getActiveTab(): string | number
  /** 设置激活的Tab */
  setActiveTab(tabName: string | number): void
  /** 获取Tabs数据 */
  getTabsData(): TabItem[]
}

/**
 * Tab配置接口
 */
export interface TabConfig {
  /** 是否显示Tabs */
  enabled: boolean
  /** 粘性定位 */
  sticky: boolean
  /** 滑动切换 */
  swipeable: boolean
  /** 默认激活Tab */
  defaultActive: string | number
}

/**
 * 组件配置接口
 */
export interface SdkworkApiTabListConfig {
  /** 分页配置 */
  pagination: {
    page: number
    size: number
  }
  /** 搜索配置 */
  search: {
    enabled: boolean
    debounce: number
  }
  /** 选择配置 */
  selection: {
    enabled: boolean
    mode: 'single' | 'multiple'
  }
  /** Tab配置 */
  tabs: TabConfig
}

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG: Partial<SdkworkApiTabListConfig> = {
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
    mode: 'multiple'
  },
  tabs: {
    enabled: false,
    sticky: true,
    swipeable: true,
    defaultActive: ''
  }
}

/**
 * 工具函数类型定义
 */

/**
 * Tab数据处理函数
 */
export type TabDataProcessor = (data: any[]) => TabItem[]

/**
 * Tab参数构建函数
 */
export type TabParamsBuilder = (tab: TabItem) => Record<string, any>

/**
 * 默认Tab字段映射
 */
export const DEFAULT_TAB_FIELD_MAP = {
  value: 'value',
  title: 'title',
  params: 'params'
} as const