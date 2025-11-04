// ==================== Share Store 类型定义 ====================

/** 分享平台 */
export enum SharePlatform {
  WECHAT = 'wechat',
  WECHAT_MOMENTS = 'wechat_moments',
  QQ = 'qq',
  QZONE = 'qzone',
  WEIBO = 'weibo',
  SYSTEM = 'system',
  COPY_LINK = 'copy_link'
}

/** 分享内容类型 */
export enum ShareContentType {
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
  FILE = 'file'
}

/** 分享结果状态 */
export enum ShareResult {
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  UNSUPPORTED = 'unsupported'
}

/** 分享配置 */
export interface ShareConfig {
  /** 分享标题 */
  title: string
  /** 分享描述 */
  description: string
  /** 分享链接 */
  url: string
  /** 分享图片URL */
  imageUrl: string
  /** 分享内容类型 */
  type: ShareContentType
  /** 是否启用分享统计 */
  enableAnalytics: boolean
  /** 分享标签 */
  tags: string[]
  /** 自定义数据 */
  customData?: Record<string, any>
}

/** 分享平台配置 */
export interface SharePlatformConfig {
  /** 平台名称 */
  name: string
  /** 平台图标 */
  icon: string
  /** 是否可用 */
  enabled: boolean
  /** 平台特定配置 */
  config?: Record<string, any>
}

/** 分享统计信息 */
export interface ShareAnalytics {
  /** 分享次数 */
  shareCount: number
  /** 成功次数 */
  successCount: number
  /** 失败次数 */
  failedCount: number
  /** 最近分享时间 */
  lastShareTime: number | null
  /** 平台分享统计 */
  platformStats: Record<SharePlatform, number>
}

/** 分享状态 */
export interface ShareState {
  /** 是否正在分享 */
  sharing: boolean
  /** 当前分享配置 */
  currentConfig: ShareConfig | null
  /** 分享结果 */
  result: ShareResult | null
  /** 错误信息 */
  error: string | null
  /** 可用分享平台 */
  availablePlatforms: SharePlatformConfig[]
  /** 分享统计信息 */
  analytics: ShareAnalytics
  /** 最近分享记录 */
  recentShares: Array<{
    id: string
    platform: SharePlatform
    config: ShareConfig
    result: ShareResult
    timestamp: number
    error?: string
  }>
}

/** Share Store Actions */
export interface ShareStoreActions {
  // 分享配置管理
  setShareConfig(config: Partial<ShareConfig>): void
  clearShareConfig(): void
  
  // 平台管理
  detectAvailablePlatforms(): Promise<void>
  enablePlatform(platform: SharePlatform, enabled: boolean): void
  getPlatformConfig(platform: SharePlatform): SharePlatformConfig | null
  
  // 分享操作
  share(platform: SharePlatform, config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToWechat(config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToWechatMoments(config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToQQ(config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToQzone(config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToWeibo(config?: Partial<ShareConfig>): Promise<ShareResult>
  shareToSystem(config?: Partial<ShareConfig>): Promise<ShareResult>
  copyLink(config?: Partial<ShareConfig>): Promise<ShareResult>
  
  // 批量分享
  shareToMultiple(platforms: SharePlatform[], config?: Partial<ShareConfig>): Promise<Record<SharePlatform, ShareResult>>
  
  // 分享统计
  recordShare(platform: SharePlatform, result: ShareResult, error?: string): void
  getShareStats(): ShareAnalytics
  clearShareStats(): void
  
  // 工具方法
  generateShareUrl(baseUrl: string, params?: Record<string, any>): string
  validateShareConfig(config: ShareConfig): boolean
  
  // 初始化
  initialize(): Promise<void>
}

/** Share Store Getters */
export interface ShareStoreGetters {
  // 状态相关
  isSharing: boolean
  hasError: boolean
  currentResult: ShareResult | null
  
  // 平台相关
  enabledPlatforms: SharePlatformConfig[]
  platformCount: number
  wechatEnabled: boolean
  qqEnabled: boolean
  weiboEnabled: boolean
  
  // 统计相关
  totalShares: number
  successRate: number
  recentShareCount: number
  
  // 工具方法
  defaultShareConfig: ShareConfig
}

/** 分享配置选项 */
export interface ShareConfigOptions {
  /** 默认分享配置 */
  defaultConfig?: Partial<ShareConfig>
  /** 启用平台 */
  enabledPlatforms?: SharePlatform[]
  /** 是否启用统计 */
  enableAnalytics?: boolean
  /** 最大记录数量 */
  maxRecords?: number
  /** 自定义平台配置 */
  platformConfigs?: Record<SharePlatform, Partial<SharePlatformConfig>>
}