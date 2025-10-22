// ==================== 字幕 Store 类型定义 ====================

import { SubtitleFormat, SubtitleEntry, Subtitles } from '../../../core/subtitles/subtitles'

/**
 * 字幕显示模式
 */
export enum SubtitleDisplayMode {
    /** 全屏模式 */
    FULLSCREEN = 'fullscreen',
    /** 卡片模式 */
    CARD = 'card',
    /** 行模式 */
    LINE = 'line'
}

/**
 * 字幕加载源类型
 */
export enum SubtitleSourceType {
    /** 字符串内容 */
    STRING = 'string',
    /** URL地址 */
    URL = 'url',
    /** Subtitles对象 */
    OBJECT = 'object'
}

/**
 * 字幕配置
 */
export interface SubtitleConfig {
    /** 显示模式 */
    displayMode: SubtitleDisplayMode
    /** 行模式下的行数 */
    lineCount?: number
    /** 字体大小 */
    fontSize?: number
    /** 字体颜色 */
    fontColor?: string
    /** 背景颜色 */
    backgroundColor?: string
    /** 是否显示背景 */
    showBackground?: boolean
    /** 字幕位置 */
    position?: 'top' | 'bottom' | 'center'
    /** 自动滚动 */
    autoScroll?: boolean
    /** 滚动速度 */
    scrollSpeed?: number
}

/**
 * 字幕状态
 */
export enum SubtitleState {
    /** 空闲状态 */
    IDLE = 'idle',
    /** 加载中 */
    LOADING = 'loading',
    /** 加载完成 */
    LOADED = 'loaded',
    /** 播放中 */
    PLAYING = 'playing',
    /** 暂停 */
    PAUSED = 'paused',
    /** 错误状态 */
    ERROR = 'error'
}

/**
 * 字幕事件类型
 */
export enum SubtitleEventType {
    /** 字幕加载开始 */
    LOAD_START = 'loadStart',
    /** 字幕加载完成 */
    LOAD_COMPLETE = 'loadComplete',
    /** 字幕加载错误 */
    LOAD_ERROR = 'loadError',
    /** 字幕条目变化 */
    ENTRY_CHANGE = 'entryChange',
    /** 显示模式变化 */
    MODE_CHANGE = 'modeChange',
    /** 播放状态变化 */
    PLAYBACK_STATE_CHANGE = 'playbackStateChange',
    /** 字幕内容更新 */
    CONTENT_UPDATE = 'contentUpdate'
}

/**
 * 字幕事件数据
 */
export interface SubtitleEventData {
    /** 事件类型 */
    type: SubtitleEventType
    /** 当前字幕条目 */
    currentEntry?: SubtitleEntry | null
    /** 当前播放时间（毫秒） */
    currentTime?: number
    /** 错误信息 */
    error?: string
    /** 附加数据 */
    data?: any
}

/**
 * 字幕加载选项
 */
export interface SubtitleLoadOptions {
    /** 字幕格式（自动检测时可省略） */
    format?: SubtitleFormat
    /** 字幕语言 */
    language?: string
    /** 媒体时长（秒） */
    duration?: number
    /** 字符编码 */
    encoding?: string
    /** 是否启用缓存 */
    cache?: boolean
}

/**
 * 动态字幕添加选项
 */
export interface DynamicSubtitleOptions {
    /** 字幕文本 */
    text: string
    /** 开始时间（毫秒） */
    startTime: number
    /** 结束时间（毫秒） */
    endTime: number
    /** 是否为最终结果 */
    isFinal?: boolean
    /** 置信度 */
    confidence?: number
}

/**
 * 字幕 Store 状态
 */
export interface SubtitleStoreState {
    // ==================== 配置相关 ====================
    /** 字幕配置 */
    config: SubtitleConfig
    
    // ==================== 状态相关 ====================
    /** 当前状态 */
    currentState: SubtitleState
    /** 错误信息 */
    errorMessage: string
    
    // ==================== 字幕内容相关 ====================
    /** 当前字幕对象 */
    currentSubtitles: Subtitles | null
    /** 动态添加的字幕条目 */
    dynamicEntries: SubtitleEntry[]
    /** 当前显示的字幕条目 */
    currentEntry: SubtitleEntry | null
    
    // ==================== 播放相关 ====================
    /** 当前播放时间（毫秒） */
    currentTime: number
    /** 媒体总时长（毫秒） */
    totalDuration: number
    /** 是否正在播放 */
    isPlaying: boolean
    
    // ==================== UI 相关 ====================
    /** 是否显示设置对话框 */
    settingDialogVisible: boolean
    /** 是否显示字幕列表 */
    subtitleListVisible: boolean
    
    // ==================== 私有状态 ====================
    /** 事件监听器 */
    _eventListeners: Map<SubtitleEventType, Function[]>
    /** 同步定时器 */
    _syncTimer: number | null
}

/**
 * 字幕 Store Getters
 */
export interface SubtitleStoreGetters {
    // 状态检查
    isIdle: boolean
    isLoading: boolean
    isLoaded: boolean
    isPlayingState: boolean
    isPaused: boolean
    isError: boolean
    
    // 字幕内容相关
    hasSubtitles: boolean
    hasDynamicEntries: boolean
    totalEntries: number
    currentEntryText: string
    
    // 播放相关
    progressPercentage: number
    timeRemaining: number
    
    // 配置相关
    isFullscreenMode: boolean
    isCardMode: boolean
    isLineMode: boolean
    displayLineCount: number
}

/**
 * 字幕 Store Actions
 */
export interface SubtitleStoreActions {
    // ==================== 配置操作 ====================
    /** 更新配置 */
    updateConfig(config: Partial<SubtitleConfig>): void
    /** 重置配置 */
    resetConfig(): void
    /** 切换显示模式 */
    switchDisplayMode(mode: SubtitleDisplayMode, options?: Partial<SubtitleConfig>): void
    
    // ==================== 字幕加载操作 ====================
    /** 从字符串加载字幕 */
    loadFromString(content: string, options?: SubtitleLoadOptions): Promise<void>
    /** 从URL加载字幕 */
    loadFromUrl(url: string, options?: SubtitleLoadOptions): Promise<void>
    /** 从Subtitles对象加载 */
    loadFromObject(subtitles: Subtitles): void
    /** 清除字幕 */
    clearSubtitles(): void
    
    // ==================== 动态字幕操作 ====================
    /** 添加动态字幕 */
    addDynamicSubtitle(options: DynamicSubtitleOptions): SubtitleEntry
    /** 批量添加动态字幕 */
    addDynamicSubtitles(entries: DynamicSubtitleOptions[]): SubtitleEntry[]
    /** 清除动态字幕 */
    clearDynamicSubtitles(): void
    
    // ==================== 播放控制操作 ====================
    /** 开始播放同步 */
    startPlayback(): void
    /** 停止播放同步 */
    stopPlayback(): void
    /** 暂停播放 */
    pausePlayback(): void
    /** 恢复播放 */
    resumePlayback(): void
    /** 跳转到指定时间 */
    seekTo(time: number): void
    /** 更新播放时间 */
    updatePlaybackTime(time: number): void
    
    // ==================== 事件操作 ====================
    /** 添加事件监听器 */
    on(event: SubtitleEventType, callback: (data: SubtitleEventData) => void): void
    /** 移除事件监听器 */
    off(event: SubtitleEventType, callback: (data: SubtitleEventData) => void): void
    /** 触发事件 */
    emit(event: SubtitleEventType, data?: Partial<SubtitleEventData>): void
    
    // ==================== UI 操作 ====================
    /** 显示设置对话框 */
    showSettings(): void
    /** 隐藏设置对话框 */
    hideSettings(): void
    /** 显示字幕列表 */
    showSubtitleList(): void
    /** 隐藏字幕列表 */
    hideSubtitleList(): void
    
    // ==================== 工具操作 ====================
    /** 获取字幕统计信息 */
    getStats(): {
        totalEntries: number
        dynamicEntries: number
        currentTime: number
        totalDuration: number
        state: SubtitleState
    }
    /** 导出字幕 */
    exportSubtitles(format: SubtitleFormat): Promise<string>
}