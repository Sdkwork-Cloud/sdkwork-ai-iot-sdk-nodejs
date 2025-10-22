import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 瀑布流组件属性接口
 */
export interface WaterfallProps {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<any>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持项选择 */
  selectable?: boolean
  /** 是否支持项删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 瀑布流项唯一键字段名 */
  itemKey?: string
  /** 瀑布流项标题字段名 */
  itemTitleField?: string
  /** 瀑布流项描述字段名 */
  itemDescriptionField?: string
  /** 瀑布流列数 */
  columns?: number
  /** 列间距 */
  gap?: number
}

/**
 * 瀑布流组件事件接口
 */
export interface WaterfallEmits {
  /** 项选择事件 */
  select: (item: any) => void
  /** 项删除事件 */
  delete: (item: any) => void
  /** 搜索事件 */
  search: (keyword: string) => void
  /** 数据加载完成事件 */
  load: (pageData: Page<any>) => void
}

/**
 * 瀑布流组件插槽接口
 */
export interface WaterfallSlots {
  /** 默认插槽 - 自定义瀑布流项内容 */
  default: (props: { item: any; index: number; selected: boolean }) => any
  /** 头部插槽 - 瀑布流顶部区域 */
  header?: () => any
  /** 底部插槽 - 瀑布流底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}

/**
 * 瀑布流组件方法接口
 */
export interface WaterfallMethods {
  /** 刷新数据 */
  refresh: () => void
  /** 加载更多数据 */
  loadMore: () => void
  /** 获取当前数据 */
  getData: () => any[]
  /** 获取选中项 */
  getSelectedItems: () => any[]
  /** 清空选中项 */
  clearSelected: () => void
  /** 设置选中项 */
  setSelectedItems: (items: any[]) => void
}