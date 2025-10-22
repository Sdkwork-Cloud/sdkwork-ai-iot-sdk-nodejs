import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 通知消息类型
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system'

/**
 * 通知消息状态
 */
export type NotificationStatus = 'unread' | 'read' | 'archived'

/**
 * 通知消息实体
 */
export interface Notification {
  id: string
  title: string
  content: string
  type: NotificationType
  status: NotificationStatus
  sender?: string
  avatar?: string
  timestamp: string
  readAt?: string
  createdAt: string
  updatedAt: string
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
  category?: string
  tags?: string[]
}

/**
 * 通知消息列表查询参数
 */
export interface NotificationQueryParams {
  type?: NotificationType
  status?: NotificationStatus
  keyword?: string
  category?: string
  priority?: string
  startTime?: string
  endTime?: string
  unreadOnly?: boolean
}

/**
 * 通知消息分页响应
 */
export type NotificationPage = Page<Notification>

/**
 * 通知消息分页请求
 */
export interface NotificationPageable extends Pageable {
  filters?: NotificationQueryParams
}
 