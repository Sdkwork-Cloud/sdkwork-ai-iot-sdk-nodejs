/**
 * SDKWork Appointment List 组件类型定义
 */

import type { Page, Pageable } from 'sdkwork-commons-typescript' 
import { TabItem } from '../sdkwork-api-list/types/shared'

/**
 * 预约数据类型定义
 */
export interface Appointment {
  /** 预约ID */
  id: string | number
  /** 预约编号 */
  appointmentNo: string
  /** 预约标题 */
  title: string
  /** 预约类型 */
  type: AppointmentType
  /** 预约状态 */
  status: AppointmentStatus
  /** 预约状态文本 */
  statusText: string
  /** 预约时间 */
  dateTime: string
  /** 预约时长（分钟） */
  duration?: number
  /** 预约地点 */
  location?: string
  /** 服务人员/医生姓名 */
  staffName: string
  /** 服务人员/医生ID */
  staffId?: string | number
  /** 客户姓名 */
  customerName: string
  /** 客户电话 */
  customerPhone?: string
  /** 客户备注 */
  notes?: string
  /** 预约费用 */
  fee?: number
  /** 货币类型 */
  currency?: string
  /** 预约服务项目 */
  serviceItems?: ServiceItem[]
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 预约服务项目定义
 */
export interface ServiceItem {
  /** 服务项ID */
  id: string | number
  /** 服务名称 */
  serviceName: string
  /** 服务描述 */
  description?: string
  /** 服务时长（分钟） */
  duration?: number
  /** 服务费用 */
  fee?: number
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 预约类型枚举
 */
export enum AppointmentType {
  /** 服务预约 */
  SERVICE = 'service',
  /** 医疗就诊 */
  MEDICAL = 'medical',
  /** 美容美发 */
  BEAUTY = 'beauty',
  /** 教育培训 */
  EDUCATION = 'education',
  /** 商务会议 */
  BUSINESS = 'business',
  /** 其他类型 */
  OTHER = 'other'
}

/**
 * 预约状态枚举
 */
export enum AppointmentStatus {
  /** 待确认 */
  PENDING = 'pending',
  /** 已确认 */
  CONFIRMED = 'confirmed',
  /** 进行中 */
  IN_PROGRESS = 'in_progress',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已取消 */
  CANCELLED = 'cancelled',
  /** 已过期 */
  EXPIRED = 'expired',
  /** 已改期 */
  RESCHEDULED = 'rescheduled'
}

/**
 * 操作按钮定义
 */
export interface AppointmentActionButton {
  /** 按钮唯一标识 */
  key: string
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /** 按钮图标 */
  icon?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 显示条件函数 */
  showCondition?: (appointment: Appointment) => boolean
}

/**
 * 预约状态配置
 */
export interface AppointmentStatusConfig {
  [key: string]: {
    /** 状态文本 */
    text: string
    /** 状态颜色 */
    color: string
    /** 背景颜色 */
    bgColor?: string
    /** 状态图标 */
    icon?: string
  }
}

/**
 * 组件属性接口
 */
export interface SdkworkAppointmentListProps {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Appointment>>
  /** 请求参数对象 */
  params?: Record<string, any>
  /** 是否支持搜索 */
  searchable?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 默认每页显示条数 */
  pageSize?: number
  /** 预约Tabs数据数组 */
  tabs?: TabItem[]
  /** 预约Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: AppointmentActionButton[]
  /** 预约状态配置 */
  statusConfig?: AppointmentStatusConfig
}

/**
 * 组件事件接口
 */
export interface SdkworkAppointmentListEmits {
  /** 预约选择事件 */
  (e: 'select', appointment: Appointment): void
  /** 预约删除事件 */
  (e: 'delete', appointment: Appointment): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<Appointment>): void
  /** Tab切换事件 */
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
  /** 操作按钮点击事件 */
  (e: 'action', appointment: Appointment, action: string): void
  /** 预约项点击事件 */
  (e: 'click', appointment: Appointment): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkAppointmentListSlots {
  /** 默认插槽 - 自定义预约项内容 */
  default?: (props: { appointment: Appointment; index: number; selected: boolean }) => any
  /** 头部插槽 */
  header?: () => any
  /** 底部插槽 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** Tab标题自定义插槽 */
  'tab-title'?: (props: { tab: TabItem }) => any
  /** 预约头部自定义插槽 */
  'appointment-header'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约内容自定义插槽 */
  'appointment-content'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约底部自定义插槽 */
  'appointment-footer'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约操作自定义插槽 */
  'appointment-actions'?: (props: { appointment: Appointment; index: number }) => any
}

/**
 * 组件实例方法接口
 */
export interface SdkworkAppointmentListInstance {
  /** 刷新数据 */
  refresh(): void
  /** 加载更多数据 */
  loadMore(): void
  /** 获取当前数据 */
  getData(): Appointment[]
  /** 获取选中项 */
  getSelectedItems(): Appointment[]
  /** 清空选中项 */
  clearSelected(): void
  /** 设置选中项 */
  setSelectedItems(items: Appointment[]): void
  /** 获取当前激活的Tab */
  getActiveTab(): string | number
  /** 设置激活的Tab */
  setActiveTab(tabName: string | number): void
  /** 获取Tabs数据 */
  getTabsData(): TabItem[]
}

/**
 * 预约列表项组件属性
 */
export interface AppointmentListItemProps {
  /** 预约数据 */
  appointment: Appointment
  /** 预约索引 */
  index?: number
  /** 是否选中 */
  selected?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: AppointmentActionButton[]
  /** 预约状态配置 */
  statusConfig?: AppointmentStatusConfig
}

/**
 * 预约列表项组件事件
 */
export interface AppointmentListItemEmits {
  /** 选择事件 */
  (e: 'select', appointment: Appointment): void
  /** 删除事件 */
  (e: 'delete', appointment: Appointment): void
  /** 操作事件 */
  (e: 'action', appointment: Appointment, action: string): void
  /** 点击事件 */
  (e: 'click', appointment: Appointment): void
}

/**
 * 默认预约状态配置
 */
export const DEFAULT_STATUS_CONFIG: AppointmentStatusConfig = {
  [AppointmentStatus.PENDING]: { text: '待确认', color: '#ff6b35', bgColor: '#fff7f0', icon: 'clock-o' },
  [AppointmentStatus.CONFIRMED]: { text: '已确认', color: '#1890ff', bgColor: '#f0f8ff', icon: 'checked' },
  [AppointmentStatus.IN_PROGRESS]: { text: '进行中', color: '#52c41a', bgColor: '#f6ffed', icon: 'setting-o' },
  [AppointmentStatus.COMPLETED]: { text: '已完成', color: '#13c2c2', bgColor: '#e6fffb', icon: 'completed' },
  [AppointmentStatus.CANCELLED]: { text: '已取消', color: '#ff4d4f', bgColor: '#fff2f0', icon: 'close' },
  [AppointmentStatus.EXPIRED]: { text: '已过期', color: '#faad14', bgColor: '#fffbe6', icon: 'clock-o' },
  [AppointmentStatus.RESCHEDULED]: { text: '已改期', color: '#722ed1', bgColor: '#f9f0ff', icon: 'calendar-o' }
}

/**
 * 默认操作按钮配置
 */
export const DEFAULT_ACTION_BUTTONS: AppointmentActionButton[] = [
  { key: 'view', text: '查看详情', type: 'primary', icon: 'eye-o' },
  { key: 'edit', text: '修改预约', type: 'default', icon: 'edit', showCondition: (appointment) => appointment.status === AppointmentStatus.PENDING },
  { key: 'confirm', text: '确认预约', type: 'success', icon: 'checked', showCondition: (appointment) => appointment.status === AppointmentStatus.PENDING },
  { key: 'cancel', text: '取消预约', type: 'warning', icon: 'close', showCondition: (appointment) => appointment.status === AppointmentStatus.PENDING || appointment.status === AppointmentStatus.CONFIRMED },
  { key: 'start', text: '开始服务', type: 'primary', icon: 'play-circle-o', showCondition: (appointment) => appointment.status === AppointmentStatus.CONFIRMED },
  { key: 'complete', text: '完成服务', type: 'success', icon: 'completed', showCondition: (appointment) => appointment.status === AppointmentStatus.IN_PROGRESS },
  { key: 'reschedule', text: '重新预约', type: 'default', icon: 'calendar-o', showCondition: (appointment) => appointment.status === AppointmentStatus.CANCELLED || appointment.status === AppointmentStatus.EXPIRED }
]

/**
 * 默认预约Tabs配置
 */
export const DEFAULT_APPOINTMENT_TABS: TabItem[] = [
  { value: 'all', title: '全部预约', params: { status: '' } },
  { value: AppointmentStatus.PENDING, title: '待确认', params: { status: AppointmentStatus.PENDING } },
  { value: AppointmentStatus.CONFIRMED, title: '已确认', params: { status: AppointmentStatus.CONFIRMED } },
  { value: AppointmentStatus.IN_PROGRESS, title: '进行中', params: { status: AppointmentStatus.IN_PROGRESS } },
  { value: AppointmentStatus.COMPLETED, title: '已完成', params: { status: AppointmentStatus.COMPLETED } },
  { value: AppointmentStatus.CANCELLED, title: '已取消', params: { status: AppointmentStatus.CANCELLED } }
]