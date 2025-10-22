import { SlideItem, Slides, SlidesHandlerMode, SlidesSyncConfig } from '../../../core/slides/types';

/**
 * 幻灯片播放状态
 */
export enum SlidesPlaybackState {
    /** 未开始 */
    IDLE = 'idle',
    /** 播放中 */
    PLAYING = 'playing',
    /** 暂停 */
    PAUSED = 'paused',
    /** 停止 */
    STOPPED = 'stopped',
    /** 完成 */
    COMPLETED = 'completed'
}

/**
 * 播放控制模式
 */
export enum PlaybackControlMode {
    /** 自动模式 - 根据语音时间自动切换 */
    AUTO = 'auto',
    /** 手动模式 - 用户手动控制切换 */
    MANUAL = 'manual',
    /** 混合模式 - 自动+手动控制 */
    HYBRID = 'hybrid'
}

/**
 * 语音同步配置
 */
export interface VoiceSyncConfig {
    /** 是否启用语音同步 */
    enabled: boolean;
    /** 语音识别置信度阈值 */
    confidenceThreshold: number;
    /** 语音识别关键词匹配模式 */
    keywordMatching: 'exact' | 'fuzzy' | 'semantic';
    /** 语音延迟补偿（毫秒） */
    delayCompensation: number;
    /** 是否启用实时语音识别 */
    realtimeRecognition: boolean;
}

/**
 * 播放器配置
 */
export interface SlidesPlayerConfig {
    /** 播放控制模式 */
    controlMode: PlaybackControlMode;
    /** 幻灯片处理器模式 */
    slidesMode: SlidesHandlerMode;
    /** 同步配置 */
    syncConfig: SlidesSyncConfig;
    /** 语音同步配置 */
    voiceSync: VoiceSyncConfig;
    /** 是否启用循环播放 */
    loop: boolean;
    /** 是否显示过渡动画 */
    showTransitions: boolean;
    /** 默认幻灯片显示时长（毫秒） */
    defaultSlideDuration: number;
    /** 是否预加载幻灯片资源 */
    preloadResources: boolean;
}

/**
 * 播放器状态
 */
export interface SlidesPlayerState {
    /** 播放状态 */
    playbackState: SlidesPlaybackState;
    /** 当前播放时间（毫秒） */
    currentTime: number;
    /** 总时长（毫秒） */
    totalDuration: number;
    /** 播放进度百分比 */
    progress: number;
    /** 当前幻灯片索引 */
    currentSlideIndex: number;
    /** 当前幻灯片 */
    currentSlide: SlideItem | null;
    /** 上一个幻灯片 */
    previousSlide: SlideItem | null;
    /** 是否正在加载 */
    isLoading: boolean;
    /** 错误信息 */
    error: string | null;
    /** 最后更新时间 */
    lastUpdated: number;
}

/**
 * 播放器统计信息
 */
export interface SlidesPlayerStats {
    /** 总播放次数 */
    totalPlays: number;
    /** 总播放时长（毫秒） */
    totalPlayTime: number;
    /** 平均播放时长（毫秒） */
    averagePlayTime: number;
    /** 幻灯片切换次数 */
    slideChanges: number;
    /** 语音识别成功次数 */
    voiceRecognitionSuccess: number;
    /** 语音识别失败次数 */
    voiceRecognitionFailures: number;
    /** 用户交互次数 */
    userInteractions: number;
}

/**
 * 播放器事件类型
 */
export enum SlidesPlayerEvent {
    /** 播放状态变化 */
    PLAYBACK_STATE_CHANGE = 'playback_state_change',
    /** 幻灯片切换 */
    SLIDE_CHANGE = 'slide_change',
    /** 播放时间更新 */
    TIME_UPDATE = 'time_update',
    /** 播放开始 */
    PLAY_START = 'play_start',
    /** 播放暂停 */
    PLAY_PAUSE = 'play_pause',
    /** 播放停止 */
    PLAY_STOP = 'play_stop',
    /** 播放完成 */
    PLAY_COMPLETE = 'play_complete',
    /** 加载开始 */
    LOAD_START = 'load_start',
    /** 加载完成 */
    LOAD_COMPLETE = 'load_complete',
    /** 加载错误 */
    LOAD_ERROR = 'load_error',
    /** 语音识别结果 */
    VOICE_RECOGNITION = 'voice_recognition',
    /** 用户交互 */
    USER_INTERACTION = 'user_interaction',
    /** 配置更新 */
    CONFIG_UPDATE = 'config_update'
}

/**
 * 播放器事件数据
 */
export interface SlidesPlayerEventData {
    /** 事件类型 */
    type: SlidesPlayerEvent;
    /** 事件时间戳 */
    timestamp: number;
    /** 事件数据 */
    data: any;
    /** 播放器状态快照 */
    state: SlidesPlayerState;
}

/**
 * 语音识别结果
 */
export interface VoiceRecognitionResult {
    /** 识别文本 */
    text: string;
    /** 置信度 */
    confidence: number;
    /** 时间戳 */
    timestamp: number;
    /** 是否最终结果 */
    isFinal: boolean;
    /** 匹配的幻灯片索引 */
    matchedSlideIndex?: number;
    /** 匹配的关键词 */
    matchedKeywords?: string[];
}

/**
 * 用户交互记录
 */
export interface UserInteraction {
    /** 交互类型 */
    type: 'click' | 'keypress' | 'drag' | 'scroll';
    /** 交互目标 */
    target: string;
    /** 交互时间 */
    timestamp: number;
    /** 交互数据 */
    data?: any;
}

/**
 * Store Actions 类型定义
 */
export interface SlidesStoreActions {
    // 播放控制
    play(): void;
    pause(): void;
    stop(): void;
    seek(time: number): void;
    
    // 幻灯片导航
    goToSlide(index: number): void;
    previousSlide(): void;
    nextSlide(): void;
    
    // 数据管理
    loadSlides(slides: Slides | string | File): Promise<void>;
    clearSlides(): void;
    
    // 配置管理
    updateConfig(config: Partial<SlidesPlayerConfig>): void;
    resetConfig(): void;
    
    // 语音处理
    processVoiceRecognition(result: VoiceRecognitionResult): void;
    
    // 状态管理
    reset(): void;
    destroy(): void;
}

/**
 * Store Getters 类型定义
 */
export interface SlidesStoreGetters {
    // 状态获取
    isPlaying: boolean;
    isPaused: boolean;
    isStopped: boolean;
    isLoading: boolean;
    hasError: boolean;
    
    // 幻灯片信息
    currentSlide: SlideItem | null;
    previousSlide: SlideItem | null;
    totalSlides: number;
    slideProgress: number;
    
    // 播放信息
    currentTime: number;
    totalDuration: number;
    progressPercentage: number;
    timeRemaining: number;
    
    // 配置信息
    config: SlidesPlayerConfig;
    stats: SlidesPlayerStats;
}

/**
 * Store State 类型定义
 */
export interface SlidesStoreState {
    // 播放器状态
    playbackState: SlidesPlaybackState;
    currentTime: number;
    totalDuration: number;
    currentSlideIndex: number;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number;
    
    // 幻灯片数据
    slides: Slides | null;
    currentSlide: SlideItem | null;
    previousSlide: SlideItem | null;
    
    // 配置
    config: SlidesPlayerConfig;
    
    // 统计信息
    stats: SlidesPlayerStats;
    
    // 事件记录
    events: SlidesPlayerEventData[];
    userInteractions: UserInteraction[];
    
    // 语音识别记录
    voiceRecognitionResults: VoiceRecognitionResult[];
}