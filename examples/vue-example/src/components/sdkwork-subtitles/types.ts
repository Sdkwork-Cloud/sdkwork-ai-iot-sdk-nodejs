import type { 
  SubtitleFormat, 
  SubtitleEntry, 
  Subtitles
} from '@/core/subtitles'
import { SubtitleDisplayMode } from '@/stores/modules/subtitles/types'

/**
 * 字幕组件属性接口
 */
export interface SdkworkSubtitlesProps {
  // 字幕内容输入方式
  content?: string
  url?: string
  subtitles?: Subtitles
  
  // 字幕格式
  format?: SubtitleFormat
  
  // 显示配置
  displayMode?: SubtitleDisplayMode
  lineCount?: number
  fontSize?: number
  fontColor?: string
  backgroundColor?: string
  showBackground?: boolean
  position?: 'top' | 'bottom' | 'center'
  autoScroll?: boolean
  scrollSpeed?: number
  
  // 播放控制
  currentTime?: number
  isPlaying?: boolean
  
  // 控制面板
  showControls?: boolean
  
  // 媒体时长
  duration?: number
}

/**
 * 字幕组件事件接口
 */
export interface SdkworkSubtitlesEmits {
  // 字幕相关事件
  (e: 'load-start', currentTime: number): void
  (e: 'load-complete', currentTime: number): void
  (e: 'load-error', error: string, currentTime: number): void
  (e: 'entry-change', entry: SubtitleEntry | null, currentTime: number): void
  (e: 'mode-change', currentTime: number): void
  (e: 'playback-state-change', currentTime: number): void
  (e: 'content-update', currentTime: number): void
  
  // 控制事件
  (e: 'fullscreen-change', isFullscreen: boolean): void
  (e: 'seek-to', time: number): void
}

/**
 * 字幕组件方法接口
 */
export interface SdkworkSubtitlesMethods {
  // 字幕加载方法
  loadFromString(content: string, options?: any): Promise<void>
  loadFromUrl(url: string, options?: any): Promise<void>
  loadFromObject(subtitles: Subtitles): void
  clearSubtitles(): void
  
  // 动态字幕方法
  addDynamicSubtitle(text: string, startTime: number, endTime: number, isFinal?: boolean): void
  addDynamicSubtitles(entries: Array<{text: string, startTime: number, endTime: number}>): void
  clearDynamicSubtitles(): void
  
  // 播放控制方法
  startPlayback(): void
  stopPlayback(): void
  pausePlayback(): void
  resumePlayback(): void
  seekTo(time: number): void
  updatePlaybackTime(time: number): void
  
  // 显示模式方法
  switchDisplayMode(mode: SubtitleDisplayMode, options?: any): void
  toggleFullscreen(): void
  
  // 配置方法
  updateConfig(config: any): void
  resetConfig(): void
  
  // 工具方法
  getStats(): {
    totalEntries: number
    dynamicEntries: number
    currentTime: number
    totalDuration: number
    state: string
  }
  exportSubtitles(format: SubtitleFormat): Promise<string>
  
  // 事件方法
  on(event: string, callback: (data: any) => void): void
  off(event: string, callback: (data: any) => void): void
}

/**
 * 字幕组件实例类型
 */
export type SdkworkSubtitlesInstance = InstanceType<typeof import('./sdkwork-subtitles.vue').default> & SdkworkSubtitlesMethods

/**
 * 字幕配置接口
 */
export interface SubtitleConfig {
  displayMode: SubtitleDisplayMode
  lineCount?: number
  fontSize?: number
  fontColor?: string
  backgroundColor?: string
  showBackground?: boolean
  position?: 'top' | 'bottom' | 'center'
  autoScroll?: boolean
  scrollSpeed?: number
}

/**
 * 动态字幕选项接口
 */
export interface DynamicSubtitleOptions {
  text: string
  startTime: number
  endTime: number
  isFinal?: boolean
  confidence?: number
}

/**
 * 字幕加载选项接口
 */
export interface SubtitleLoadOptions {
  format?: SubtitleFormat
  language?: string
  duration?: number
  encoding?: string
  cache?: boolean
}

/**
 * 字幕事件数据接口
 */
export interface SubtitleEventData {
  type: string
  currentEntry?: SubtitleEntry | null
  currentTime?: number
  error?: string
  data?: any
}

/**
 * 组件尺寸类型
 */
export type ComponentSize = 'small' | 'medium' | 'large'

/**
 * 动画配置接口
 */
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
}

/**
 * 响应式断点配置
 */
export interface ResponsiveBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  boxShadow: string
}

/**
 * 国际化配置接口
 */
export interface I18nConfig {
  locale: string
  messages: Record<string, Record<string, string>>
}

/**
 * 无障碍配置接口
 */
export interface A11yConfig {
  ariaLabel: string
  ariaDescription: string
  keyboardNavigation: boolean
  screenReaderSupport: boolean
}

/**
 * 性能配置接口
 */
export interface PerformanceConfig {
  debounceTime: number
  throttleTime: number
  maxCacheSize: number
  lazyLoading: boolean
}

/**
 * 错误处理配置接口
 */
export interface ErrorHandlingConfig {
  maxRetries: number
  retryDelay: number
  fallbackContent: string
  showErrorMessages: boolean
}

/**
 * 组件配置总接口
 */
export interface ComponentConfig {
  subtitle: SubtitleConfig
  theme: ThemeConfig
  responsive: ResponsiveBreakpoints
  animation: AnimationConfig
  i18n: I18nConfig
  a11y: A11yConfig
  performance: PerformanceConfig
  errorHandling: ErrorHandlingConfig
}

/**
 * 组件状态枚举
 */
export enum ComponentState {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ERROR = 'error',
  DISABLED = 'disabled'
}

/**
 * 组件模式枚举
 */
export enum ComponentMode {
  DEFAULT = 'default',
  MINIMAL = 'minimal',
  COMPACT = 'compact',
  EXPANDED = 'expanded',
  FULLSCREEN = 'fullscreen'
}

/**
 * 组件变体枚举
 */
export enum ComponentVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

/**
 * 组件方向枚举
 */
export enum ComponentDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

/**
 * 组件对齐方式枚举
 */
export enum ComponentAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
  STRETCH = 'stretch'
}

/**
 * 组件工具函数类型
 */
export type UtilityFunction<T = any> = (...args: any[]) => T

/**
 * 组件工具类
 */
export class ComponentUtils {
  /**
   * 防抖函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  /**
   * 节流函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * 深拷贝函数
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as T
    
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key])
      }
    }
    return cloned
  }

  /**
   * 格式化时间
   */
  static formatTime(milliseconds: number, format: string = 'mm:ss'): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)

    return format
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'))
      .replace('ms', ms.toString().padStart(2, '0'))
  }

  /**
   * 生成唯一ID
   */
  static generateId(prefix: string = 'subtitle'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 检查对象是否为空
   */
  static isEmpty(obj: any): boolean {
    if (obj == null) return true
    if (Array.isArray(obj)) return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj).length === 0
    return false
  }

  /**
   * 合并配置
   */
  static mergeConfig<T>(defaultConfig: T, userConfig: Partial<T>): T {
    return { ...defaultConfig, ...userConfig }
  }

  /**
   * 验证配置
   */
  static validateConfig(config: any, schema: any): boolean {
    // 简化的配置验证逻辑
    for (const key in schema) {
      if (schema[key].required && !(key in config)) {
        console.warn(`Missing required configuration: ${key}`)
        return false
      }
    }
    return true
  }
}