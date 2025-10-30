/**
 * SDKWork Order List 组件类型定义
 */

import type { Page, Pageable } from 'sdkwork-commons-typescript' 
import { TabItem } from '../sdkwork-api-list/types/shared'

/**
 * 订单数据类型定义
 */
export interface Order {
  /** 订单ID */
  id: string | number
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  status: OrderStatus
  /** 订单状态文本 */
  statusText: string
  /** 创建时间 */
  createTime: string
  /** 订单总金额 */
  totalAmount: number
  /** 货币类型 */
  currency?: string
  /** 客户姓名 */
  customerName: string
  /** 客户电话 */
  customerPhone?: string
  /** 配送地址 */
  shippingAddress?: string
  /** 订单商品项 */
  items?: OrderItem[]
  /** 支付状态 */
  paymentStatus?: PaymentStatus
  /** 配送状态 */
  shippingStatus?: ShippingStatus
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 订单商品项定义
 */
export interface OrderItem {
  /** 商品项ID */
  id: string | number
  /** 商品ID */
  productId: string | number
  /** 商品名称 */
  productName: string
  /** 商品图片 */
  productImage?: string
  /** 商品数量 */
  quantity: number
  /** 商品单价 */
  unitPrice: number
  /** 商品总价 */
  totalPrice: number
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 订单状态枚举
 */
export enum OrderStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已确认 */
  CONFIRMED = 'confirmed',
  /** 处理中 */
  PROCESSING = 'processing',
  /** 已发货 */
  SHIPPED = 'shipped',
  /** 已完成 */
  DELIVERED = 'delivered',
  /** 已取消 */
  CANCELLED = 'cancelled',
  /** 已退款 */
  REFUNDED = 'refunded'
}

/**
 * 支付状态枚举
 */
export enum PaymentStatus {
  /** 待支付 */
  PENDING = 'pending',
  /** 已支付 */
  PAID = 'paid',
  /** 支付失败 */
  FAILED = 'failed',
  /** 已退款 */
  REFUNDED = 'refunded'
}

/**
 * 配送状态枚举
 */
export enum ShippingStatus {
  /** 待发货 */
  PENDING = 'pending',
  /** 处理中 */
  PROCESSING = 'processing',
  /** 已发货 */
  SHIPPED = 'shipped',
  /** 已送达 */
  DELIVERED = 'delivered',
  /** 已取消 */
  CANCELLED = 'cancelled'
}

/**
 * 操作按钮定义
 */
export interface OrderActionButton {
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
  showCondition?: (order: Order) => boolean
}

/**
 * 订单状态配置
 */
export interface OrderStatusConfig {
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
export interface SdkworkOrderListProps {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Order>>
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
  /** 订单Tabs数据数组 */
  tabs?: TabItem[]
  /** 订单Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: OrderActionButton[]
  /** 订单状态配置 */
  statusConfig?: OrderStatusConfig
}

/**
 * 组件事件接口
 */
export interface SdkworkOrderListEmits {
  /** 订单选择事件 */
  (e: 'select', order: Order): void
  /** 订单删除事件 */
  (e: 'delete', order: Order): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 数据加载完成事件 */
  (e: 'load', pageData: Page<Order>): void
  /** Tab切换事件 */
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
  /** 操作按钮点击事件 */
  (e: 'action', order: Order, action: string): void
  /** 订单项点击事件 */
  (e: 'click', order: Order): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkOrderListSlots {
  /** 默认插槽 - 自定义订单项内容 */
  default?: (props: { order: Order; index: number; selected: boolean }) => any
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
  /** 订单头部自定义插槽 */
  'order-header'?: (props: { order: Order; index: number }) => any
  /** 订单内容自定义插槽 */
  'order-content'?: (props: { order: Order; index: number }) => any
  /** 订单底部自定义插槽 */
  'order-footer'?: (props: { order: Order; index: number }) => any
  /** 订单操作自定义插槽 */
  'order-actions'?: (props: { order: Order; index: number }) => any
}

/**
 * 组件实例方法接口
 */
export interface SdkworkOrderListInstance {
  /** 刷新数据 */
  refresh(): void
  /** 加载更多数据 */
  loadMore(): void
  /** 获取当前数据 */
  getData(): Order[]
  /** 获取选中项 */
  getSelectedItems(): Order[]
  /** 清空选中项 */
  clearSelected(): void
  /** 设置选中项 */
  setSelectedItems(items: Order[]): void
  /** 获取当前激活的Tab */
  getActiveTab(): string | number
  /** 设置激活的Tab */
  setActiveTab(tabName: string | number): void
  /** 获取Tabs数据 */
  getTabsData(): TabItem[]
}

/**
 * 订单列表项组件属性
 */
export interface OrderListItemProps {
  /** 订单数据 */
  order: Order
  /** 订单索引 */
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
  actionButtons?: OrderActionButton[]
  /** 订单状态配置 */
  statusConfig?: OrderStatusConfig
}

/**
 * 订单列表项组件事件
 */
export interface OrderListItemEmits {
  /** 选择事件 */
  (e: 'select', order: Order): void
  /** 删除事件 */
  (e: 'delete', order: Order): void
  /** 操作事件 */
  (e: 'action', order: Order, action: string): void
  /** 点击事件 */
  (e: 'click', order: Order): void
}

/**
 * 默认订单状态配置
 */
export const DEFAULT_STATUS_CONFIG: OrderStatusConfig = {
  [OrderStatus.PENDING]: { text: '待处理', color: '#ff6b35', bgColor: '#fff7f0', icon: 'clock-o' },
  [OrderStatus.CONFIRMED]: { text: '已确认', color: '#1890ff', bgColor: '#f0f8ff', icon: 'checked' },
  [OrderStatus.PROCESSING]: { text: '处理中', color: '#52c41a', bgColor: '#f6ffed', icon: 'setting-o' },
  [OrderStatus.SHIPPED]: { text: '已发货', color: '#722ed1', bgColor: '#f9f0ff', icon: 'logistics' },
  [OrderStatus.DELIVERED]: { text: '已完成', color: '#13c2c2', bgColor: '#e6fffb', icon: 'completed' },
  [OrderStatus.CANCELLED]: { text: '已取消', color: '#ff4d4f', bgColor: '#fff2f0', icon: 'close' },
  [OrderStatus.REFUNDED]: { text: '已退款', color: '#faad14', bgColor: '#fffbe6', icon: 'refund-o' }
}

/**
 * 默认操作按钮配置
 */
export const DEFAULT_ACTION_BUTTONS: OrderActionButton[] = [
  { key: 'view', text: '查看详情', type: 'primary', icon: 'eye-o' },
  { key: 'edit', text: '编辑', type: 'default', icon: 'edit' },
  { key: 'cancel', text: '取消订单', type: 'warning', icon: 'close', showCondition: (order) => order.status === OrderStatus.PENDING },
  { key: 'confirm', text: '确认订单', type: 'success', icon: 'checked', showCondition: (order) => order.status === OrderStatus.PENDING },
  { key: 'ship', text: '发货', type: 'primary', icon: 'logistics', showCondition: (order) => order.status === OrderStatus.CONFIRMED },
  { key: 'complete', text: '完成订单', type: 'success', icon: 'completed', showCondition: (order) => order.status === OrderStatus.SHIPPED }
]

/**
 * 默认订单Tabs配置
 */
export const DEFAULT_ORDER_TABS: TabItem[] = [
  { value: 'all', title: '全部订单', params: { status: '' } },
  { value: OrderStatus.PENDING, title: '待处理', params: { status: OrderStatus.PENDING } },
  { value: OrderStatus.CONFIRMED, title: '已确认', params: { status: OrderStatus.CONFIRMED } },
  { value: OrderStatus.PROCESSING, title: '处理中', params: { status: OrderStatus.PROCESSING } },
  { value: OrderStatus.SHIPPED, title: '已发货', params: { status: OrderStatus.SHIPPED } },
  { value: OrderStatus.DELIVERED, title: '已完成', params: { status: OrderStatus.DELIVERED } }
]