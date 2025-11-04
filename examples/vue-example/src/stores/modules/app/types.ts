// ==================== App Store 类型定义 ====================

import { OfficialAccountSdkConfigResponse } from "sdkwork-sdk-api-typescript"

/** 主题模式 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

/** 语言配置 */
export enum Language {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR'
}

/** 布局模式 */
export enum LayoutMode {
  DEFAULT = 'default',
  COMPACT = 'compact',
  WIDE = 'wide'
}

/** 动画配置 */
export interface AnimationConfig {
  /** 是否启用动画 */
  enabled: boolean
  /** 动画持续时间 (ms) */
  duration: number
  /** 动画类型 */
  type: 'fade' | 'slide' | 'scale' | 'none'
}

/** 通知配置 */
export interface NotificationConfig {
  /** 是否启用声音 */
  sound: boolean
  /** 是否启用桌面通知 */
  desktop: boolean
  /** 通知位置 */
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** 通知持续时间 (ms) */
  duration: number
}

/** 存储配置 */
export interface StorageConfig {
  /** 存储类型 */
  type: 'localStorage' | 'sessionStorage' | 'indexedDB'
  /** 存储前缀 */
  prefix: string
  /** 是否启用加密 */
  encryption: boolean
}

/** 微信JS-SDK配置 */
export interface WechatSdkConfig {
  /** 应用ID */
  appId: string
  /** 时间戳 */
  timestamp: string
  /** 随机字符串 */
  nonceStr: string
  /** 签名 */
  signature: string
  /** 调试模式 */
  debug: boolean
}

/** 微信分享配置 */
export interface WechatShareConfig {
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc: string
  /** 分享链接 */
  link: string
  /** 分享图标 */
  imgUrl: string
}

/** 微信配置状态 */
export interface WechatConfigState {
  /** 是否已初始化 */
  initialized: boolean
  /** 是否正在加载 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** JS-SDK配置 */
  officialAccountSdkConfig: OfficialAccountSdkConfigResponse | null
  /** 默认分享配置 */
  shareConfig: WechatShareConfig | null
  /** 是否在微信公众号环境中 */
  isWechatOfficialAccount: boolean
  /** 是否在小程序环境中 */
  isWechatMiniProgram: boolean
}

/** 应用状态 */
export interface AppState {
  // 主题配置
  theme: ThemeMode
  systemTheme: ThemeMode
  
  // 语言配置
  language: Language
  availableLanguages: Language[]
  
  // 布局配置
  layout: LayoutMode
  sidebarCollapsed: boolean
  
  // 动画配置
  animation: AnimationConfig
  
  // 通知配置
  notification: NotificationConfig
  
  // 存储配置
  storage: StorageConfig
  
  // 应用状态
  initialized: boolean
  loading: boolean
  error: string | null
  
  // 设备信息
  device: {
    type: 'mobile' | 'tablet' | 'desktop'
    os: string
    browser: string
    screenWidth: number
    screenHeight: number
  }
  
  // 性能配置
  performance: {
    /** 是否启用性能监控 */
    monitoring: boolean
    /** 是否启用懒加载 */
    lazyLoading: boolean
    /** 图片压缩质量 */
    imageQuality: number
  }
  
  // 功能开关
  features: {
    /** 是否启用离线模式 */
    offlineMode: boolean
    /** 是否启用PWA */
    pwa: boolean
    /** 是否启用调试模式 */
    debugMode: boolean
    /** 是否启用分析 */
    analytics: boolean
  }
  
  // 应用信息
  appInfo: {
    version: string
    buildNumber: string
    lastUpdate: number
    environment: 'development' | 'staging' | 'production'
  }
 
  
  // 微信配置
  wechat: WechatConfigState
}

/** App Store Actions */
export interface AppStoreActions {
  // 主题相关
  setTheme(theme: ThemeMode): void
  toggleTheme(): void
  detectSystemTheme(): void
  
  // 语言相关
  setLanguage(language: Language): void
  getCurrentLanguage(): Language
  
  // 布局相关
  setLayout(layout: LayoutMode): void
  toggleSidebar(): void
  setSidebarCollapsed(collapsed: boolean): void
  
  // 动画相关
  setAnimationConfig(config: Partial<AnimationConfig>): void
  
  // 通知相关
  setNotificationConfig(config: Partial<NotificationConfig>): void
  
  // 存储相关
  setStorageConfig(config: Partial<StorageConfig>): void
  
  // 应用状态管理
  setLoading(loading: boolean): void
  setError(error: string | null): void
  clearError(): void
  
  // 设备检测
  detectDevice(): void
  
  // 性能配置
  setPerformanceConfig(config: Partial<AppState['performance']>): void
  
  // 功能开关
  setFeatureFlag(feature: keyof AppState['features'], enabled: boolean): void
  
  // 应用信息
  setAppInfo(info: Partial<AppState['appInfo']>): void
  
  // 微信配置相关
  setupWechatConfig(): Promise<void>
  setWechatShareConfig(config: Partial<WechatShareConfig>): void
  updateWechatShareInfo(title?: string, desc?: string, link?: string, imgUrl?: string): void
  isWechatEnvironment(): boolean
  isWechatOfficialAccount(): boolean
  isWechatMiniProgram(): boolean
  
  // 初始化
  initialize(): Promise<void>
  
  // 持久化
  saveToStorage(): void
  loadFromStorage(): void
  clearStorage(): void
}

/** App Store Getters */
export interface AppStoreGetters {
  // 主题相关
  isDarkMode: boolean
  isLightMode: boolean
  effectiveTheme: ThemeMode
  
  // 语言相关
  currentLanguage: Language
  languageText: string
  
  // 布局相关
  isMobile: boolean
  isDesktop: boolean
  isSidebarVisible: boolean
  
  // 应用状态
  isLoading: boolean
  hasError: boolean
  
  // 功能状态
  isDebugMode: boolean
  isProduction: boolean
  
  // 应用信息
  appVersion: string
  appEnvironment: string
  
  // 微信配置相关
  isWechatInitialized: boolean
  isWechatLoading: boolean
  hasWechatError: boolean
  wechatSdkConfig: WechatSdkConfig | null
  wechatShareConfig: WechatShareConfig | null
  isInWechatEnvironment: boolean
  isInWechatOfficialAccount: boolean
  isInWechatMiniProgram: boolean
}

/** 应用配置选项 */
export interface AppConfigOptions {
  /** 默认主题 */
  defaultTheme?: ThemeMode
  /** 默认语言 */
  defaultLanguage?: Language
  /** 可用语言列表 */
  availableLanguages?: Language[]
  /** 是否启用系统主题检测 */
  enableSystemTheme?: boolean
  /** 存储配置 */
  storage?: Partial<StorageConfig>
  /** 动画配置 */
  animation?: Partial<AnimationConfig>
  /** 通知配置 */
  notification?: Partial<NotificationConfig>
  /** 性能配置 */
  performance?: Partial<AppState['performance']>
  /** 功能开关 */
  features?: Partial<AppState['features']>
}