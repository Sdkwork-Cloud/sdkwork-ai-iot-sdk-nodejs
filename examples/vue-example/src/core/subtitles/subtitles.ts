/**
 * 字幕格式枚举
 * <p>
 * 定义支持的字幕格式类型，适用于视频、音频（包括音乐）等多媒体内容
 * </p>
 */
export enum SubtitleFormat {
    /**
     * SubRip字幕格式
     */
    SRT = "srt",
    
    /**
     * WebVTT字幕格式
     */
    VTT = "vtt",
    
    /**
     * SubStation Alpha字幕格式
     */
    SSA = "ssa",
    
    /**
     * Advanced SubStation Alpha字幕格式
     */
    ASS = "ass",
    
    /**
     * MPEG-4字幕格式
     */
    MP4 = "mp4",
    
    /**
     * LRC歌词格式（常用于音乐）
     */
    LRC = "lrc",
    
    /**
     * KARaoke LRC格式（用于卡拉OK）
     */
    KAR = "kar",
    
    /**
     * ID3歌词格式（嵌入在MP3文件中）
     */
    ID3 = "id3",
    
    /**
     * 其他字幕格式
     */
    OTHER = "other"
}

/**
 * 字幕条目类
 * <p>
 * 表示单个字幕条目，包含开始时间、结束时间和文本内容。
 * 可用于视频、音频（包括音乐）的字幕或歌词显示。
 * </p>
 */
export interface SubtitleEntry {
    /**
     * 字幕序号
     */
    sequence?: number;
    
    /**
     * 字幕开始时间（毫秒）
     */
    startTime?: number;
    
    /**
     * 字幕结束时间（毫秒）
     */
    endTime?: number;
    
    /**
     * 字幕文本内容
     */
    text?: string;
    
    /**
     * 字幕文本内容（多行）
     */
    texts?: string[];
    isDynamic?: boolean
}

/**
 * 字幕处理器模式
 */
export enum SubtitlesHandlerMode {
    /**
     * 播放器模式：通过播放进度时间触发字幕显示
     * - 适用于视频、音乐播放器
     * - 字幕按时间顺序显示
     * - 支持跳转、暂停等播放控制
     */
    PLAYER = 'player',
    
    /**
     * 流模式：根据时间获取最新的字幕
     * - 适用于实时语音转文字、AI对话
     * - 字幕按接收顺序显示
     * - 支持实时更新和覆盖
     */
    STREAM = 'stream'
}

/**
 * 播放器模式配置
 */
export interface PlayerModeConfig {
    /** 同步间隔（毫秒） */
    syncInterval?: number;
    /** 提前显示时间（毫秒） */
    preloadTime?: number;
    /** 延迟显示时间（毫秒） */
    delayTime?: number;
    /** 是否启用平滑过渡 */
    smoothTransition?: boolean;
    /** 最大缓存字幕数 */
    maxCachedEntries?: number;
}

/**
 * 流模式配置
 */
export interface StreamModeConfig {
    /** 显示持续时间（毫秒） */
    displayDuration?: number;
    /** 最大同时显示字幕数 */
    maxDisplayCount?: number;
    /** 是否自动清除过期字幕 */
    autoClearExpired?: boolean;
    /** 过期时间阈值（毫秒） */
    expireThreshold?: number;
    /** 是否支持字幕覆盖 */
    allowOverwrite?: boolean;
}

/**
 * 字幕处理器配置
 */
export interface SubtitlesHandlerConfig {
    /** 处理器模式 */
    mode?: SubtitlesHandlerMode;
    /** 播放器模式配置 */
    playerConfig?: PlayerModeConfig;
    /** 流模式配置 */
    streamConfig?: StreamModeConfig;
    /** 默认字幕语言 */
    defaultLanguage?: string;
    /** 是否启用自动检测格式 */
    autoDetectFormat?: boolean;
}
/**
 * 字幕对象类
 * <p>
 * 用于表示视频或音频（包括音乐）的字幕信息，包含字幕的播放时间进度、文本内容等信息，
 * 支持多种字幕格式的抽象表示
 * </p>
 */
export interface Subtitles {
    /**
     * 字幕条目列表
     */
    entries?: SubtitleEntry[];
    
    /**
     * 字幕格式类型
     */
    format?: SubtitleFormat;
    
    /**
     * 字幕语言
     */
    language?: string;
    
    /**
     * 媒体时长（秒）- 适用于视频、音频（包括音乐）
     */
    duration?: number;
    
    /**
     * 判断是否为歌词（音乐字幕）
     * 根据format字段自动判断，LRC、KAR、ID3格式被认为是歌词格式
     */
    isLyrics?: () => boolean;
    
    /**
     * 根据时间获取对应的字幕条目
     * 
     * @param timeMillis 时间戳（毫秒）
     * @return 对应时间的字幕条目，如果未找到则返回null
     */
    getSubtitleEntryAt?: (timeMillis: number) => SubtitleEntry | null;
    
    /**
     * 根据时间获取对应的字幕文本
     * 
     * @param timeMillis 时间戳（毫秒）
     * @return 对应时间的字幕文本，如果未找到则返回空字符串
     */
    getSubtitleTextAt?: (timeMillis: number) => string;
}

/**
 * 字幕解析器接口
 * <p>
 * 定义从字符串或文件解析字幕内容到Subtitles对象的方法
 * </p>
 */
export interface SubtitleParser {
    /**
     * 从字符串解析字幕内容
     * 
     * @param content 字符串格式的字幕内容
     * @return 解析后的Subtitles对象
     */
    parse(content: string): Promise<Subtitles>;
}

/**
 * 字幕生成器接口
 * <p>
 * 定义将Subtitles对象生成为字符串或写入文件的方法
 * </p>
 */
export interface SubtitleGenerator {
    /**
     * 将Subtitles对象生成为字符串
     * 
     * @param subtitles Subtitles对象
     * @return 字符串格式的字幕内容
     */
    generate(subtitles: Subtitles): Promise<string>;
}
 
/**
 * 字幕显示事件
 */
export interface SubtitleDisplayEvent {
    /** 当前字幕条目 */
    entry: SubtitleEntry | null;
    /** 当前时间（毫秒） */
    currentTime: number;
    /** 是否为新字幕 */
    isNew: boolean;
    /** 播放进度（0-1） */
    progress: number;
}

/**
 * 字幕处理器事件类型
 */
export enum SubtitlesHandlerEvent {
    /** 字幕加载开始 */
    LOAD_START = 'loadStart',
    /** 字幕加载完成 */
    LOAD_COMPLETE = 'loadComplete',
    /** 字幕加载错误 */
    LOAD_ERROR = 'loadError',
    /** 字幕显示变化 */
    DISPLAY_CHANGE = 'displayChange',
    /** 流字幕添加 */
    STREAM_ADDED = 'streamAdded',
    /** 字幕同步开始 */
    SYNC_START = 'syncStart',
    /** 字幕同步停止 */
    SYNC_STOP = 'syncStop',
    /** 字幕清空 */
    CLEARED = 'cleared'
}

/**
 * 字幕处理器接口
 * <p>
 * 定义完善的字幕处理器，支持从URL、文件、Blob、字符串中加载并解析字幕文件。
 * 支持流方式的字幕处理，播放器同步，以及多种播放场景。
 * </p>
 */
export interface SubtitlesHandler {
    /**
     * 从URL加载字幕
     * @param url 字幕文件URL
     * @returns Promise<Subtitles>
     */
    loadFromUrl(url: string): Promise<Subtitles>;
    
    /**
     * 从文件加载字幕
     * @param file 文件对象
     * @returns Promise<Subtitles>
     */
    loadFromFile(file: File): Promise<Subtitles>;
    
    /**
     * 从Blob加载字幕
     * @param blob Blob对象
     * @returns Promise<Subtitles>
     */
    loadFromBlob(blob: Blob): Promise<Subtitles>;
    
    /**
     * 从字符串加载字幕
     * @param content 字幕内容字符串
     * @returns Promise<Subtitles>
     */
    loadFromString(content: string): Promise<Subtitles>;
    
    /**
     * 添加流式字幕
     * @param text 字幕文本
     * @param startTime 开始时间（毫秒）
     * @param endTime 结束时间（毫秒）
     * @returns 添加的字幕条目
     */
    addStreamSubtitle(text: string, startTime: number, endTime: number): SubtitleEntry;
    
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
     * @returns 当前应该显示的字幕条目
     */
    updatePlaybackTime(currentTime: number): SubtitleEntry | null;
    
    /**
     * 获取当前显示的字幕
     */
    getCurrentSubtitle(): SubtitleEntry | null;
    
    /**
     * 清除所有字幕
     */
    clear(): void;
    
    /**
     * 监听字幕显示变化事件
     * @param callback 回调函数
     */
    onDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void;
    
    /**
     * 移除字幕显示变化事件监听器
     * @param callback 回调函数
     */
    offDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void;
    
    /**
     * 添加事件监听器
     * @param event 事件类型
     * @param callback 回调函数
     */
    on(event: SubtitlesHandlerEvent, callback: (data: SubtitleDisplayEvent) => void): void;
    
    /**
     * 移除事件监听器
     * @param event 事件类型
     * @param callback 回调函数
     */
    off(event: SubtitlesHandlerEvent, callback: (data: SubtitleDisplayEvent) => void): void;
    
    /**
     * 导出字幕
     * @param format 导出格式
     * @returns 导出的字幕内容
     */
    export(format: SubtitleFormat): Promise<string>;
}