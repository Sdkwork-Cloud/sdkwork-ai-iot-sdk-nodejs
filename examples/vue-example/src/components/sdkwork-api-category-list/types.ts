/**
 * SDKWork API Category List 组件类型定义
 */

import type { Page } from 'sdkwork-commons-typescript'
export type { Page }
/**
 * 分类数据类型
 */
export interface Category {
  id: string | number
  name: string
  description?: string
  icon?: string
  color?: string
  count?: number
  [key: string]: any
}

/**
 * 组件属性类型
 */
export interface Props {
  /** API请求方法 */
  api: () => Promise<Page<any>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持行选择 */
  selectable?: boolean
  /** 是否支持行删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 分类数据API方法 */
  categoryApi?: () => Promise<Category[]>
  /** 分类数据列表 */
  categories?: Category[]
}

/**
 * 事件类型
 */
export interface Emits {
  /** 行选择事件 */
  select: [item: any]
  /** 行删除事件 */
  delete: [item: any]
  /** 搜索事件 */
  search: [keyword: string]
  /** 数据加载完成事件 */
  load: [page: Page<any>]
  /** 分类选择事件 */
  'select-category': [category: Category]
}

/**
 * 插槽类型
 */
export interface Slots {
  /** 默认插槽 - 内容列表项 */
  default: { item: any; index: number }
  /** 分类插槽 - 分类项 */
  category: { category: Category; index: number }
  /** 头部插槽 */
  header: void
  /** 底部插槽 */
  footer: void
  /** 空状态插槽 */
  empty: void
  /** 加载状态插槽 */
  loading: void
}
 