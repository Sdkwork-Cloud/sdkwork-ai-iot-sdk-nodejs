/**
 * 字幕处理器实现
 * <p>
 * 实现 SubtitlesHandler 接口，支持 PLAYER 和 STREAM 两种模式
 * </p>
 */

import { 
    SubtitlesHandler, 
    SubtitleEntry, 
    Subtitles, 
    SubtitleDisplayEvent, 
    SubtitlesHandlerEvent,
    SubtitleFormat, 
    SubtitlesHandlerMode,
    PlayerModeConfig,
    StreamModeConfig,
    SubtitlesHandlerConfig
} from './subtitles';
import { SubtitleProcessorFactory } from './subtitles_factory';


/**
 * 默认字幕处理器实现
 */
export class DefaultSubtitlesHandler implements SubtitlesHandler {
    private subtitles: Subtitles | null = null;
    private streamEntries: SubtitleEntry[] = [];
    private currentEntry: SubtitleEntry | null = null;
    private lastSyncTime: number = 0;
    private syncIntervalId: number | null = null;
    private eventListeners: Map<SubtitlesHandlerEvent, Set<(data: SubtitleDisplayEvent) => void>> = new Map();
    private displayChangeCallbacks: Set<(event: SubtitleDisplayEvent) => void> = new Set();
    
    // 配置
    private mode: SubtitlesHandlerMode;
    private playerConfig: PlayerModeConfig;
    private streamConfig: StreamModeConfig;
    
    constructor(config: SubtitlesHandlerConfig = {}) {
        this.mode = config.mode || SubtitlesHandlerMode.PLAYER;
        
        // 默认播放器模式配置
        this.playerConfig = {
            syncInterval: 100,
            preloadTime: 200,
            delayTime: 0,
            smoothTransition: true,
            maxCachedEntries: 1000,
            ...config.playerConfig
        };
        
        // 默认流模式配置
        this.streamConfig = {
            displayDuration: 5000,
            maxDisplayCount: 3,
            autoClearExpired: true,
            expireThreshold: 10000,
            allowOverwrite: false,
            ...config.streamConfig
        };
        
        this.initializeEventSystem();
    }
    
    /**
     * 初始化事件系统
     */
    private initializeEventSystem(): void {
        // 初始化所有事件类型的监听器集合
        Object.values(SubtitlesHandlerEvent).forEach(event => {
            this.eventListeners.set(event, new Set());
        });
    }
    
    // ==================== 字幕加载方法实现 ====================
    
    async loadFromUrl(url: string): Promise<Subtitles> {
        this.emit(SubtitlesHandlerEvent.LOAD_START, this.createDisplayEvent(null, 0));
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            return this.loadFromString(content);
        } catch (error) {
            this.emit(SubtitlesHandlerEvent.LOAD_ERROR, this.createDisplayEvent(null, 0));
            throw error;
        }
    }
    
    async loadFromFile(file: File): Promise<Subtitles> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const content = e.target?.result as string;
                this.loadFromString(content).then(resolve).catch(reject);
            };
            
            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };
            
            reader.readAsText(file, 'utf-8');
        });
    }
    
    async loadFromBlob(blob: Blob): Promise<Subtitles> {
        const file = new File([blob], 'subtitle', { type: blob.type });
        return this.loadFromFile(file);
    }
    
    async loadFromString(content: string): Promise<Subtitles> {
        const format = this.detectFormat(content);
        const parser = SubtitleProcessorFactory.createParser(format);
        
        const subtitles = await parser.parse(content);
        this.setSubtitles(subtitles);
        
        this.emit(SubtitlesHandlerEvent.LOAD_COMPLETE, this.createDisplayEvent(null, 0));
        
        return subtitles;
    }
    
    // ==================== 流式字幕处理方法实现 ====================
    
    addStreamSubtitle(text: string, startTime: number, endTime: number): SubtitleEntry {
        const entry: SubtitleEntry = {
            sequence: this.streamEntries.length + 1,
            startTime,
            endTime,
            text
        };
        
        // 根据模式处理流字幕
        if (this.mode === SubtitlesHandlerMode.STREAM) {
            this.handleStreamModeSubtitle(entry);
        } else {
            this.handlePlayerModeSubtitle(entry);
        }
        
        this.streamEntries.push(entry);
        
        // 限制缓存数量
        if (this.streamEntries.length > this.playerConfig.maxCachedEntries!) {
            this.streamEntries.shift();
        }
        
        this.emit(SubtitlesHandlerEvent.STREAM_ADDED, this.createDisplayEvent(entry, startTime));
        
        return entry;
    }
    
    /**
     * 处理流模式下的字幕
     */
    private handleStreamModeSubtitle(entry: SubtitleEntry): void {
        // 流模式：直接显示最新字幕
        this.currentEntry = entry;
        
        // 触发显示事件
        this.emitDisplayChange(entry, entry.startTime || 0, true);
        
        // 设置自动清除定时器
        if (this.streamConfig.autoClearExpired) {
            const displayTime = entry.endTime || (entry.startTime || 0) + this.streamConfig.displayDuration!;
            setTimeout(() => {
                if (this.currentEntry === entry) {
                    this.currentEntry = null;
                    this.emitDisplayChange(null, Date.now(), true);
                }
            }, displayTime - (entry.startTime || 0));
        }
    }
    
    /**
     * 处理播放器模式下的字幕
     */
    private handlePlayerModeSubtitle(entry: SubtitleEntry): void {
        // 播放器模式：字幕按时间顺序管理，不立即显示
        // 会在 updatePlaybackTime 时根据时间触发显示
    }
    
    // ==================== 播放器同步方法实现 ====================
    
    startSync(): void {
        this.stopSync();
        
        this.emit(SubtitlesHandlerEvent.SYNC_START, this.createDisplayEvent(null, 0));
        
        if (this.mode === SubtitlesHandlerMode.PLAYER) {
            // 播放器模式：使用定时器同步
            this.syncIntervalId = setInterval(() => {
                if (this.lastSyncTime > 0) {
                    this.updatePlaybackTime(this.lastSyncTime);
                }
            }, this.playerConfig.syncInterval!) as unknown as number;
        }
        // 流模式不需要定时同步
    }
    
    stopSync(): void {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
        }
        
        this.emit(SubtitlesHandlerEvent.SYNC_STOP, this.createDisplayEvent(null, 0));
    }
    
    updatePlaybackTime(currentTime: number): SubtitleEntry | null {
        this.lastSyncTime = currentTime;
        
        if (this.mode === SubtitlesHandlerMode.PLAYER) {
            return this.handlePlayerModeTimeUpdate(currentTime);
        } else {
            return this.handleStreamModeTimeUpdate(currentTime);
        }
    }
    
    /**
     * 处理播放器模式的时间更新
     */
    private handlePlayerModeTimeUpdate(currentTime: number): SubtitleEntry | null {
        // 合并静态字幕和流式字幕
        const allEntries = [
            ...(this.subtitles?.entries || []),
            ...this.streamEntries
        ].sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
        
        // 查找当前时间对应的字幕
        let currentEntry: SubtitleEntry | null = null;
        
        for (const entry of allEntries) {
            const startTime = entry.startTime || 0;
            const endTime = entry.endTime || startTime + 1000;
            
            // 考虑预加载时间
            const adjustedStartTime = startTime - this.playerConfig.preloadTime!;
            const adjustedEndTime = endTime + this.playerConfig.delayTime!;
            
            if (currentTime >= adjustedStartTime && currentTime <= adjustedEndTime) {
                currentEntry = entry;
                break;
            }
        }
        
        // 检查字幕是否发生变化
        const isNew = currentEntry !== this.currentEntry;
        
        if (isNew) {
            this.currentEntry = currentEntry;
            this.emitDisplayChange(currentEntry, currentTime, true);
        }
        
        return currentEntry;
    }
    
    /**
     * 处理流模式的时间更新
     */
    private handleStreamModeTimeUpdate(currentTime: number): SubtitleEntry | null {
        // 流模式：显示最新的有效字幕
        const validEntries = this.streamEntries.filter(entry => {
            const startTime = entry.startTime || 0;
            const endTime = entry.endTime || startTime + this.streamConfig.displayDuration!;
            return currentTime >= startTime && currentTime <= endTime;
        });
        
        // 获取最新的字幕
        const latestEntry = validEntries.length > 0 
            ? validEntries[validEntries.length - 1] 
            : null;
        
        const isNew = latestEntry !== this.currentEntry;
        
        if (isNew) {
            this.currentEntry = latestEntry;
            this.emitDisplayChange(latestEntry, currentTime, true);
        }
        
        return latestEntry;
    }
    
    getCurrentSubtitle(): SubtitleEntry | null {
        return this.currentEntry;
    }
    
    // ==================== 管理方法实现 ====================
    
    clear(): void {
        this.subtitles = null;
        this.streamEntries = [];
        this.currentEntry = null;
        this.lastSyncTime = 0;
        
        this.emit(SubtitlesHandlerEvent.CLEARED, this.createDisplayEvent(null, 0));
    }
    
    /**
     * 导出字幕
     * @param format 导出格式
     * @returns 导出的字幕内容
     */
    async export(format: SubtitleFormat): Promise<string> {
        if (!this.subtitles && this.streamEntries.length === 0) {
            throw new Error('没有可导出的字幕内容');
        }
        
        // 创建要导出的字幕对象
        const exportSubtitles: Subtitles = {
            entries: [
                ...(this.subtitles?.entries || []),
                ...this.streamEntries
            ].sort((a, b) => (a.startTime || 0) - (b.startTime || 0)),
            format: format,
            language: this.subtitles?.language || 'zh-CN',
            duration: this.subtitles?.duration
        };
        
        // 使用字幕生成器生成内容
        const generator = SubtitleProcessorFactory.createGenerator(format);
        return await generator.generate(exportSubtitles);
    }
    
    // ==================== 事件监听方法实现 ====================
    
    onDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void {
        this.displayChangeCallbacks.add(callback);
    }
    
    offDisplayChange(callback: (event: SubtitleDisplayEvent) => void): void {
        this.displayChangeCallbacks.delete(callback);
    }
    
    on(event: SubtitlesHandlerEvent, callback: (data: SubtitleDisplayEvent) => void): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.add(callback);
        }
    }
    
    off(event: SubtitlesHandlerEvent, callback: (data: SubtitleDisplayEvent) => void): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }
    
    // ==================== 私有工具方法 ====================
    
    /**
     * 设置字幕对象
     */
    private setSubtitles(subtitles: Subtitles): void {
        this.subtitles = subtitles;
        this.currentEntry = null;
        this.lastSyncTime = 0;
    }
    
    /**
     * 触发显示变化事件
     */
    private emitDisplayChange(entry: SubtitleEntry | null, currentTime: number, isNew: boolean): void {
        const event = this.createDisplayEvent(entry, currentTime, isNew);
        
        // 触发专门的字幕显示变化回调
        this.displayChangeCallbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('字幕显示变化回调错误:', error);
            }
        });
        
        // 触发通用事件
        this.emit(SubtitlesHandlerEvent.DISPLAY_CHANGE, event);
    }
    
    /**
     * 触发事件
     */
    private emit(event: SubtitlesHandlerEvent, data: SubtitleDisplayEvent): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`事件处理错误: ${event}`, error);
                }
            });
        }
    }
    
    /**
     * 创建显示事件对象
     */
    private createDisplayEvent(entry: SubtitleEntry | null, currentTime: number, isNew: boolean = false): SubtitleDisplayEvent {
        const startTime = entry?.startTime || 0;
        const endTime = entry?.endTime || currentTime;
        const duration = Math.max(endTime - startTime, 1);
        const elapsed = Math.max(currentTime - startTime, 0);
        const progress = Math.min(elapsed / duration, 1);
        
        return {
            entry,
            currentTime,
            isNew,
            progress
        };
    }
    
    /**
     * 检测字幕格式
     */
    private detectFormat(content: string): SubtitleFormat {
        // 简单的格式检测逻辑
        if (content.includes('WEBVTT')) {
            return SubtitleFormat.VTT;
        } else if (content.match(/\d{2}:\d{2}:\d{2},\d{3}/)) {
            return SubtitleFormat.SRT;
        } else if (content.match(/\[\d{2}:\d{2}\.\d{2}\]/)) {
            return SubtitleFormat.LRC;
        } else {
            return SubtitleFormat.OTHER;
        }
    }
    
    // ==================== 公共工具方法 ====================
    
    /**
     * 获取当前模式
     */
    getMode(): SubtitlesHandlerMode {
        return this.mode;
    }
    
    /**
     * 切换模式
     */
    switchMode(mode: SubtitlesHandlerMode): void {
        if (this.mode !== mode) {
            this.stopSync();
            this.mode = mode;
            this.currentEntry = null;
            this.lastSyncTime = 0;
            
            // 模式切换后重新开始同步
            if (mode === SubtitlesHandlerMode.PLAYER) {
                this.startSync();
            }
        }
    }
    
    /**
     * 获取统计信息
     */
    getStats(): {
        mode: SubtitlesHandlerMode;
        totalEntries: number;
        streamEntries: number;
        currentTime: number;
        currentSubtitle: SubtitleEntry | null;
    } {
        return {
            mode: this.mode,
            totalEntries: this.subtitles?.entries?.length || 0,
            streamEntries: this.streamEntries.length,
            currentTime: this.lastSyncTime,
            currentSubtitle: this.currentEntry
        };
    }
}

/**
 * 字幕处理器工厂
 */
export class SubtitlesHandlerFactory {
    /**
     * 创建播放器模式的字幕处理器
     */
    static createPlayerHandler(config?: PlayerModeConfig): DefaultSubtitlesHandler {
        return new DefaultSubtitlesHandler({
            mode: SubtitlesHandlerMode.PLAYER,
            playerConfig: config
        });
    }
    
    /**
     * 创建流模式的字幕处理器
     */
    static createStreamHandler(config?: StreamModeConfig): DefaultSubtitlesHandler {
        return new DefaultSubtitlesHandler({
            mode: SubtitlesHandlerMode.STREAM,
            streamConfig: config
        });
    }
    
    /**
     * 根据场景创建字幕处理器
     */
    static createHandlerForScenario(scenario: 'video' | 'music' | 'speech' | 'ai'): DefaultSubtitlesHandler {
        switch (scenario) {
            case 'video':
                return this.createPlayerHandler({
                    syncInterval: 100,
                    preloadTime: 200,
                    smoothTransition: true
                });
            case 'music':
                return this.createPlayerHandler({
                    syncInterval: 50,
                    preloadTime: 100,
                    smoothTransition: false
                });
            case 'speech':
                return this.createStreamHandler({
                    displayDuration: 3000,
                    maxDisplayCount: 1,
                    autoClearExpired: true
                });
            case 'ai':
                return this.createStreamHandler({
                    displayDuration: 5000,
                    maxDisplayCount: 3,
                    autoClearExpired: true,
                    allowOverwrite: true
                });
            default:
                return this.createPlayerHandler();
        }
    }
}