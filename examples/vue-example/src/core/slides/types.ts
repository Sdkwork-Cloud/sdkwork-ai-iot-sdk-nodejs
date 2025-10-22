import { AudioMediaResource, ImageMediaResource, VideoMediaResource } from "sdkwork-sdk-api-typescript";

/**
 * PPT语音讲解处理器模式
 */
export enum SlidesHandlerMode {
    /**
     * 播放器模式：通过语音播放进度时间触发幻灯片切换
     * - 适用于预录制的语音讲解
     * - 幻灯片按时间顺序切换
     * - 支持跳转、暂停等播放控制
     */
    PLAYER = 'player',

    /**
     * 实时模式：根据实时语音分析结果切换幻灯片
     * - 适用于实时语音讲解
     * - 幻灯片按语音内容动态切换
     * - 支持实时语音识别和语义分析
     */
    REALTIME = 'realtime'
}

/**
 * 幻灯片同步配置
 */
export interface SlidesSyncConfig {
    /** 同步间隔（毫秒） */
    syncInterval?: number;
    /** 提前切换时间（毫秒） */
    preloadTime?: number;
    /** 延迟切换时间（毫秒） */
    delayTime?: number;
    /** 是否启用平滑过渡动画 */
    smoothTransition?: boolean;
    /** 默认过渡动画时长（毫秒） */
    defaultTransitionDuration?: number;
}

/**
 * 幻灯片处理器配置
 */
export interface SlidesHandlerConfig {
    /** 处理器模式 */
    mode?: SlidesHandlerMode;
    /** 同步配置 */
    syncConfig?: SlidesSyncConfig;
    /** 默认幻灯片语言 */
    defaultLanguage?: string;
}

/**
 * 幻灯片条目
 */
export interface SlideItem {
    /** 幻灯片序号 */
    sequence: number;
    /** 幻灯片标题 */
    title: string;
    /** 幻灯片内容 */
    content: string;
    /** 幻灯片开始时间（毫秒） */
    startTime?: number;
    /** 幻灯片结束时间（毫秒） */
    endTime?: number;
    /** 幻灯片持续时间（毫秒） */
    duration?: number;
    /** 幻灯片图片资源 */
    image?: ImageMediaResource;
    /** 幻灯片视频资源 */
    video?: VideoMediaResource;
    /** 幻灯片HTML内容 */
    html?: string;
    /** 幻灯片链接 */
    link?: string;
    /** 幻灯片备注 */
    notes?: string;
    /** 幻灯片过渡动画类型 */
    transition?: 'fade' | 'slide' | 'zoom' | 'none';
    /** 过渡动画时长（毫秒） */
    transitionDuration?: number;
    /** 幻灯片关键词（用于语音识别匹配） */
    keywords?: string[];
    /** 幻灯片语义标签 */
    semanticTags?: string[];
}

/**
 * 幻灯片集合
 */
export interface Slides {
    /** 幻灯片标题 */
    title: string;
    audio?: AudioMediaResource;
    video?: VideoMediaResource;
    /** 幻灯片描述 */
    description?: string;
    /** 幻灯片作者 */
    author?: string;
    /** 创建时间 */
    createdAt?: Date;
    /** 修改时间 */
    updateAt?: Date;
    /** 幻灯片总时长（毫秒） */
    totalDuration?: number;
    /** 幻灯片语言 */
    language?: string;
    /** 幻灯片条目列表 */
    items: SlideItem[];
    /** 幻灯片格式类型 */
    format?: 'ppt' | 'pptx' | 'pdf' | 'image' | 'custom';
}

/**
 * 幻灯片显示事件
 */
export interface SlideDisplayEvent {
    /** 当前显示的幻灯片 */
    currentSlide: SlideItem | null;
    /** 上一个幻灯片 */
    previousSlide: SlideItem | null;
    /** 当前播放时间（毫秒） */
    currentTime: number;
    /** 事件触发时间戳 */
    timestamp: number;
    /** 是否为手动触发 */
    isManual?: boolean;
    /** 切换原因 */
    reason?: 'time' | 'voice' | 'manual' | 'auto';
}

/**
 * 幻灯片处理器事件类型
 */
export enum SlidesHandlerEvent {
    /** 幻灯片加载开始 */
    LOAD_START = 'load_start',
    /** 幻灯片加载完成 */
    LOAD_COMPLETE = 'load_complete',
    /** 幻灯片加载错误 */
    LOAD_ERROR = 'load_error',
    /** 幻灯片切换开始 */
    SLIDE_CHANGE_START = 'slide_change_start',
    /** 幻灯片切换完成 */
    SLIDE_CHANGE_COMPLETE = 'slide_change_complete',
    /** 幻灯片显示变化 */
    DISPLAY_CHANGE = 'display_change',
    /** 同步开始 */
    SYNC_START = 'sync_start',
    /** 同步停止 */
    SYNC_STOP = 'sync_stop',
    /** 实时语音识别开始 */
    RECOGNITION_START = 'recognition_start',
    /** 实时语音识别结果 */
    RECOGNITION_RESULT = 'recognition_result',
    /** 实时语音识别结束 */
    RECOGNITION_END = 'recognition_end',
    /** 幻灯片播放完成 */
    PLAYBACK_COMPLETE = 'playback_complete',
    /** 幻灯片被清除 */
    CLEARED = 'cleared'
}

/**
 * PPT语音讲解处理器接口
 * <p>
 * 实现语音讲解过程中自动切换幻灯片的处理器，支持播放器模式和实时模式
 * </p>
 */
export interface ISlidesHandler {
    /**
     * 从URL加载幻灯片
     * @param url 幻灯片文件URL
     * @returns Promise<Slides>
     */
    loadFromUrl(url: string): Promise<Slides>;

    /**
     * 从文件加载幻灯片
     * @param file 文件对象
     * @returns Promise<Slides>
     */
    loadFromFile(file: File): Promise<Slides>;

    /**
     * 从Blob加载幻灯片
     * @param blob Blob对象
     * @returns Promise<Slides>
     */
    loadFromBlob(blob: Blob): Promise<Slides>;

    /**
     * 从JSON字符串加载幻灯片
     * @param content 幻灯片内容JSON字符串
     * @returns Promise<Slides>
     */
    loadFromString(content: string): Promise<Slides>;

    /**
     * 添加实时语音识别的幻灯片切换
     * @param slide 幻灯片条目
     * @param startTime 开始时间（毫秒）
     * @param endTime 结束时间（毫秒）
     * @returns 添加的幻灯片条目
     */
    addRealtimeSlide(slide: SlideItem, startTime: number, endTime: number): SlideItem;

    /**
     * 开始播放器同步
     */
    startSync(): void;

    /**
     * 停止播放器同步
     */
    stopSync(): void;

    /**
     * 更新播放时间
     * @param currentTime 当前播放时间（毫秒）
     * @returns 当前应该显示的幻灯片
     */
    updatePlaybackTime(currentTime: number): SlideItem | null;

    /**
     * 处理实时语音识别结果
     * @param speechText 语音识别文本
     * @param confidence 识别置信度
     * @param timestamp 时间戳
     * @returns 匹配的幻灯片
     */
    processSpeechRecognition(speechText: string, confidence: number, timestamp: number): SlideItem | null;

    /**
     * 获取当前显示的幻灯片
     */
    getCurrentSlide(): SlideItem | null;

    /**
     * 手动切换到指定幻灯片
     * @param slideIndex 幻灯片索引
     */
    goToSlide(slideIndex: number): void;

    /**
     * 切换到下一张幻灯片
     */
    goToNextSlide(): void;

    /**
     * 切换到上一张幻灯片
     */
    goToPreviousSlide(): void;

    /**
     * 清除所有幻灯片
     */
    clear(): void;

    /**
     * 监听幻灯片显示变化事件
     * @param callback 回调函数
     */
    onDisplayChange(callback: (event: SlideDisplayEvent) => void): void;

    /**
     * 移除幻灯片显示变化事件监听器
     * @param callback 回调函数
     */
    offDisplayChange(callback: (event: SlideDisplayEvent) => void): void;

    /**
     * 添加事件监听器
     * @param event 事件类型
     * @param callback 回调函数
     */
    on(event: SlidesHandlerEvent, callback: (data: SlideDisplayEvent) => void): void;

    /**
     * 移除事件监听器
     * @param event 事件类型
     * @param callback 回调函数
     */
    off(event: SlidesHandlerEvent, callback: (data: SlideDisplayEvent) => void): void;

     
}