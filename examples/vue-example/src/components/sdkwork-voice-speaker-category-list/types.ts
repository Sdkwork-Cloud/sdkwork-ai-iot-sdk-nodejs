/**
 * SDKWork Voice List 组件类型定义
 */

import { VoiceSpeakerVO } from '@/services'
import { VoiceCategory } from '@/stores/modules/audio/types'
import type { Page, Pageable } from 'sdkwork-commons-typescript' 
  
// 组件属性定义
export interface VoiceListProps {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<VoiceSpeakerVO>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持搜索 */
  searchable?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 分类数据API方法 */
  categoryApi?: () => Promise<VoiceCategory[]>
  /** 分类数据列表 */
  categorys?: VoiceCategory[]
  /** 分类项唯一键字段名 */
  categoryKey?: string
  /** 分类项名称字段名 */
  categoryNameField?: string
  /** 分类项数量字段名 */
  categoryCountField?: string
  /** 默认选中的分类ID */
  defaultCategoryId?: string | number
  /** 当前选中的发音人ID */
  selectedSpeakerId?: string | number
}

// 组件事件定义
export interface VoiceListEmits {
  /** 选择发音人事件 */
  (e: 'select', speaker: VoiceSpeakerVO): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 选择分类事件 */
  (e: 'select-category', category: VoiceCategory): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<VoiceSpeakerVO>): void
}

// 组件插槽定义
export interface VoiceListSlots {
  /** 默认插槽 - 自定义发音人列表项内容 */
  default(props: { item: VoiceSpeakerVO; index: number; selected: boolean }): any
  /** 分类插槽 - 自定义分类项内容 */
  category?(props: { category: VoiceCategory; index: number }): any
  /** 头部插槽 */
  header?: () => any
  /** 底部插槽 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}