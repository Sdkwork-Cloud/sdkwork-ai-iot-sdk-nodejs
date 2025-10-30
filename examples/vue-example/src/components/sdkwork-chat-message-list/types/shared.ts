/**
 * SDKWork 聊天消息列表组件类型定义
 */

import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript'
import type { ChatMessageVO } from '@/services'
import type { UserVO } from '@/services/src/service/user/types'

/**
 * 聊天消息列表特定属性
 */
export interface ChatMessageSpecificProps {
  /** 当前用户ID */
  currentUserId?: string | number
  /** 当前用户信息 */
  currentUser?: UserVO
  /** 接收者信息 */
  receiver?: UserVO
  /** 会话ID */
  conversationId?: string
  /** 是否显示头像 */
  showAvatar?: boolean
  /** 是否自动滚动到底部 */
  autoScrollToBottom?: boolean
  /** 滚动到底部的阈值（像素） */
  scrollThreshold?: number
  /** 是否显示时间分隔线 */
  showTimeDivider?: boolean
  /** 时间分隔线格式 */
  timeDividerFormat?: string
  /** 是否显示消息状态 */
  showMessageStatus?: boolean
  /** 是否支持消息长按 */
  enableLongPress?: boolean
  /** 是否支持消息点击 */
  enableClick?: boolean
  /** 自定义消息渲染器 */
  customMessageRenderer?: (message: ChatMessageVO) => any
}

/**
 * 聊天消息列表事件接口
 */
export interface ChatMessageEmits {
  /** 加载更多消息 */
  (e: 'load-more'): void
  /** 消息点击事件 */
  (e: 'message-click', message: ChatMessageVO): void
  /** 消息长按事件 */
  (e: 'message-long-press', message: ChatMessageVO): void
  /** 消息发送事件 */
  (e: 'message-send', message: ChatMessageVO): void
  /** 消息删除事件 */
  (e: 'message-delete', message: ChatMessageVO): void
  /** 消息编辑事件 */
  (e: 'message-edit', message: ChatMessageVO): void
  /** 消息复制事件 */
  (e: 'message-copy', message: ChatMessageVO): void
  /** 消息转发事件 */
  (e: 'message-forward', message: ChatMessageVO): void
  /** 消息重发事件 */
  (e: 'message-resend', message: ChatMessageVO): void
  /** 滚动事件 */
  (e: 'scroll', event: Event): void
  /** 滚动到底部事件 */
  (e: 'scroll-to-bottom'): void
  /** 滚动到顶部事件 */
  (e: 'scroll-to-top'): void
}

/**
 * 聊天消息列表插槽接口
 */
export interface ChatMessageSlots {
  /** 默认插槽 - 自定义消息项内容 */
  default(props: { message: ChatMessageVO; index: number; isOwn: boolean }): any
  /** 消息头部插槽 */
  'message-header'?: (props: { message: ChatMessageVO; index: number }) => any
  /** 消息内容插槽 */
  'message-content'?: (props: { message: ChatMessageVO; index: number; isOwn: boolean }) => any
  /** 消息尾部插槽 */
  'message-footer'?: (props: { message: ChatMessageVO; index: number }) => any
  /** 时间分隔线插槽 */
  'time-divider'?: (props: { time: string; messages: ChatMessageVO[] }) => any
  /** 加载更多插槽 */
  'load-more'?: (props: { loading: boolean; hasMore: boolean }) => any
  /** 空状态插槽 */
  'empty'?: () => any
  /** 加载状态插槽 */
  'loading'?: () => any
}

/**
 * 聊天消息列表实例方法接口
 */
export interface ChatMessageInstance {
  /** 滚动到底部 */
  scrollToBottom(): void
  /** 滚动到顶部 */
  scrollToTop(): void
  /** 滚动到指定消息 */
  scrollToMessage(messageId: string | number): void
  /** 添加消息到列表 */
  addMessage(message: ChatMessageVO): void
  /** 更新消息 */
  updateMessage(messageId: string | number, updates: Partial<ChatMessageVO>): void
  /** 删除消息 */
  deleteMessage(messageId: string | number): void
  /** 清空消息列表 */
  clearMessages(): void
  /** 获取消息列表 */
  getMessages(): ChatMessageVO[]
  /** 获取未读消息数量 */
  getUnreadCount(): number
  /** 标记消息为已读 */
  markAsRead(messageId?: string | number): void
}

/**
 * 聊天消息列表配置常量
 */
export const CHAT_MESSAGE_DEFAULT_CONFIG = {
  // 基础配置
  pageSize: 20,
  itemKey: 'id',
  itemTitleField: 'content',
  itemDescriptionField: 'createTime',
  
  // 聊天消息特定配置
  showAvatar: true,
  autoScrollToBottom: true,
  scrollThreshold: 50,
  showTimeDivider: true,
  timeDividerFormat: 'YYYY-MM-DD HH:mm',
  showMessageStatus: true,
  enableLongPress: true,
  enableClick: true,
  
  // 列表配置
  selectable: false,
  deletable: false,
  searchable: false,
  showBorderBottom: false,
  borderBottomLeftOffset: 0,
  showNoMoreData: true,
  themeMode: 'auto',
  
  // 间距配置
  topSpacing: '0px',
  leftSpacing: '12px',
  rightSpacing: '12px'
} as const

/**
 * 消息处理工具函数
 */
export const processMessage = (message: ChatMessageVO, currentUserId?: string | number): ChatMessageVO => {
  // 设置消息归属
  if (message.isOwn === undefined && currentUserId) {
    message.isOwn = message.senderId === currentUserId
  }
  
  // 格式化时间
  if (message.createTime && typeof message.createTime === 'string') {
    message.formattedTime = formatMessageTime(message.createTime)
  }
  
  return message
}

/**
 * 格式化消息时间
 */
export const formatMessageTime = (timeString: string): string => {
  try {
    const date = new Date(timeString)
    const now = new Date()
    
    // 今天
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    // 昨天
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    }
    
    // 一周内
    const diff = now.getTime() - date.getTime()
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days}天前`
    }
    
    // 更早的时间
    return date.toLocaleDateString('zh-CN')
  } catch {
    return timeString
  }
}

/**
 * 生成时间分隔线
 */
export const generateTimeDividers = (messages: ChatMessageVO[]): Array<{
  type: 'message' | 'divider'
  data: ChatMessageVO | { time: string; messages: ChatMessageVO[] }
}> => {
  if (messages.length === 0) return []
  
  const result: Array<{
    type: 'message' | 'divider'
    data: ChatMessageVO | { time: string; messages: ChatMessageVO[] }
  }> = []
  
  let currentGroup: ChatMessageVO[] = []
  let lastDate: string | null = null
  
  messages.forEach((message, index) => {
    const messageDate = message.createTime ? 
      new Date(message.createTime).toDateString() : 
      null
    
    if (messageDate && messageDate !== lastDate) {
      // 添加时间分隔线
      if (currentGroup.length > 0) {
        result.push({
          type: 'divider',
          data: {
            time: lastDate ? new Date(lastDate).toLocaleDateString('zh-CN') : '未知时间',
            messages: [...currentGroup]
          }
        })
      }
      
      // 开始新的分组
      currentGroup = [message]
      lastDate = messageDate
    } else {
      currentGroup.push(message)
    }
    
    // 添加消息
    result.push({
      type: 'message',
      data: message
    })
    
    // 处理最后一个分组
    if (index === messages.length - 1 && currentGroup.length > 0) {
      result.push({
        type: 'divider',
        data: {
          time: lastDate ? new Date(lastDate).toLocaleDateString('zh-CN') : '未知时间',
          messages: [...currentGroup]
        }
      })
    }
  })
  
  return result
}