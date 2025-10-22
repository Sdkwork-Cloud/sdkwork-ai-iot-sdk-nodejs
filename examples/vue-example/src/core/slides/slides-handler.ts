import { 
    ISlidesHandler, 
    SlideDisplayEvent, 
    SlideItem, 
    Slides, 
    SlidesHandlerConfig, 
    SlidesHandlerEvent, 
    SlidesHandlerMode, 
    SlidesSyncConfig 
} from "./types";

/**
 * 智能PPT语音同步播放器
 * 
 * 核心特性：
 * - 支持播放器模式和实时模式
 * - 精确的时间同步机制
 * - 完善的事件系统
 * - 高性能的幻灯片切换算法
 * - 易于扩展的架构设计
 */
export class SmartSlidesHandler implements ISlidesHandler {
    // 状态管理
    private slides: Slides | null = null;
    private realtimeSlides: SlideItem[] = [];
    private currentSlide: SlideItem | null = null;
    private previousSlide: SlideItem | null = null;
    private lastSyncTime: number = 0;
    
    // 系统控制
    private syncIntervalId: number | null = null;
    private eventListeners: Map<SlidesHandlerEvent, Set<(data: SlideDisplayEvent) => void>> = new Map();
    private displayChangeCallbacks: Set<(event: SlideDisplayEvent) => void> = new Set();
    
    // 配置
    private mode: SlidesHandlerMode;
    private syncConfig: Required<SlidesSyncConfig>;

    constructor(config: SlidesHandlerConfig = {}) {
        this.mode = config.mode || SlidesHandlerMode.PLAYER;
        
        // 默认配置，确保所有属性都有值
        this.syncConfig = {
            syncInterval: 100,
            preloadTime: 200,
            delayTime: 0,
            smoothTransition: true,
            defaultTransitionDuration: 300,
            ...config.syncConfig
        };
        
        this.initializeEventSystem();
    }

    // ==================== 初始化方法 ====================

    /**
     * 初始化事件系统
     */
    private initializeEventSystem(): void {
        Object.values(SlidesHandlerEvent).forEach(event => {
            this.eventListeners.set(event, new Set());
        });
    }

    // ==================== 数据加载方法 ====================

    async loadFromUrl(url: string): Promise<Slides> {
        this.emit(SlidesHandlerEvent.LOAD_START, this.createDisplayEvent(null, 0));
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            return this.loadFromString(content);
        } catch (error) {
            this.emit(SlidesHandlerEvent.LOAD_ERROR, this.createDisplayEvent(null, 0));
            throw new Error(`加载URL失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async loadFromFile(file: File): Promise<Slides> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const content = e.target?.result as string;
                this.loadFromString(content).then(resolve).catch(reject);
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file, 'utf-8');
        });
    }

    async loadFromBlob(blob: Blob): Promise<Slides> {
        const file = new File([blob], 'slides', { type: blob.type });
        return this.loadFromFile(file);
    }

    async loadFromString(content: string): Promise<Slides> {
        try {
            const slidesData = JSON.parse(content);
            
            // 数据验证
            this.validateSlidesData(slidesData);
            
            // 处理时间信息
            const processedSlides = this.processSlidesTiming(slidesData);
            this.setSlides(processedSlides);
            
            this.emit(SlidesHandlerEvent.LOAD_COMPLETE, this.createDisplayEvent(null, 0));
            return processedSlides;
            
        } catch (error) {
            this.emit(SlidesHandlerEvent.LOAD_ERROR, this.createDisplayEvent(null, 0));
            throw new Error(`解析幻灯片数据失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 验证幻灯片数据结构
     */
    private validateSlidesData(data: any): asserts data is Slides {
        if (!data.title || typeof data.title !== 'string') {
            throw new Error('幻灯片标题缺失或格式错误');
        }
        
        if (!Array.isArray(data.items)) {
            throw new Error('幻灯片条目必须是数组');
        }
        
        data.items.forEach((item: any, index: number) => {
            if (!item.title || !item.content) {
                throw new Error(`幻灯片 ${index + 1} 缺少标题或内容`);
            }
        });
    }

    /**
     * 处理幻灯片时间信息
     */
    private processSlidesTiming(slidesData: Slides): Slides {
        let currentTime = 0;
        const processedItems: SlideItem[] = [];
        
        for (const item of slidesData.items) {
            const processedItem: SlideItem = { 
                ...item, 
                sequence: item.sequence || processedItems.length + 1 
            };
            
            // 智能时间设置
            processedItem.startTime = item.startTime ?? currentTime;
            processedItem.duration = item.duration ?? 5000;
            processedItem.endTime = item.endTime ?? processedItem.startTime + processedItem.duration;
            
            processedItems.push(processedItem);
            currentTime = processedItem.endTime;
        }
        
        return {
            ...slidesData,
            items: processedItems,
            totalDuration: currentTime
        };
    }

    // ==================== 实时幻灯片处理 ====================

    addRealtimeSlide(slide: SlideItem, startTime: number, endTime: number): SlideItem {
        const realtimeSlide: SlideItem = {
            ...slide,
            startTime,
            endTime,
            duration: endTime - startTime
        };
        
        this.realtimeSlides.push(realtimeSlide);
        
        // 根据模式处理
        if (this.mode === SlidesHandlerMode.REALTIME) {
            this.handleRealtimeModeSlide(realtimeSlide);
        }
        
        this.emit(SlidesHandlerEvent.RECOGNITION_RESULT, this.createDisplayEvent(realtimeSlide, startTime));
        return realtimeSlide;
    }

    /**
     * 处理实时模式幻灯片
     */
    private handleRealtimeModeSlide(slide: SlideItem): void {
        this.previousSlide = this.currentSlide;
        this.currentSlide = slide;
        
        this.emitDisplayChange(slide, slide.startTime || 0, false, 'voice');
    }

    // ==================== 时间同步控制 ====================

    startSync(): void {
        this.stopSync();
        this.emit(SlidesHandlerEvent.SYNC_START, this.createDisplayEvent(null, 0));
        
        if (this.mode === SlidesHandlerMode.PLAYER) {
            this.syncIntervalId = setInterval(() => {
                if (this.lastSyncTime > 0) {
                    this.updatePlaybackTime(this.lastSyncTime);
                }
            }, this.syncConfig.syncInterval) as unknown as number;
        }
    }

    stopSync(): void {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
        }
        this.emit(SlidesHandlerEvent.SYNC_STOP, this.createDisplayEvent(null, 0));
    }

    updatePlaybackTime(currentTime: number): SlideItem | null {
        this.lastSyncTime = currentTime;
        
        return this.mode === SlidesHandlerMode.PLAYER 
            ? this.handlePlayerModeTimeUpdate(currentTime)
            : this.handleRealtimeModeTimeUpdate(currentTime);
    }

    /**
     * 播放器模式时间更新处理
     */
    private handlePlayerModeTimeUpdate(currentTime: number): SlideItem | null {
        if (!this.slides) return null;
        
        // 合并所有幻灯片并按时间排序
        const allSlides = [
            ...this.slides.items,
            ...this.realtimeSlides
        ].sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
        
        // 高效查找当前幻灯片
        const currentSlide = this.findCurrentSlide(allSlides, currentTime);
        
        // 检查是否需要切换
        if (currentSlide !== this.currentSlide) {
            this.previousSlide = this.currentSlide;
            this.currentSlide = currentSlide;
            this.emitDisplayChange(currentSlide, currentTime, false, 'time');
        }
        
        return currentSlide;
    }

    /**
     * 实时模式时间更新处理
     */
    private handleRealtimeModeTimeUpdate(currentTime: number): SlideItem | null {
        // 查找当前有效的实时幻灯片
        const validSlides = this.realtimeSlides.filter(slide => {
            const startTime = slide.startTime || 0;
            const endTime = slide.endTime || startTime + 5000;
            return currentTime >= startTime && currentTime <= endTime;
        });
        
        const latestSlide = validSlides.length > 0 ? validSlides[validSlides.length - 1] : null;
        
        if (latestSlide !== this.currentSlide) {
            this.previousSlide = this.currentSlide;
            this.currentSlide = latestSlide;
            this.emitDisplayChange(latestSlide, currentTime, false, 'voice');
        }
        
        return latestSlide;
    }

    /**
     * 高效查找当前幻灯片
     */
    private findCurrentSlide(slides: SlideItem[], currentTime: number): SlideItem | null {
        for (const slide of slides) {
            const startTime = slide.startTime || 0;
            const endTime = slide.endTime || startTime + 5000;
            
            // 考虑预加载和延迟时间
            const adjustedStartTime = startTime - this.syncConfig.preloadTime;
            const adjustedEndTime = endTime + this.syncConfig.delayTime;
            
            if (currentTime >= adjustedStartTime && currentTime <= adjustedEndTime) {
                return slide;
            }
        }
        return null;
    }

    // ==================== 语音识别处理 ====================

    processSpeechRecognition(speechText: string, confidence: number, timestamp: number): SlideItem | null {
        if (!this.slides || confidence < 0.7) return null;
        
        const matchedSlide = this.findSlideByKeywords(speechText);
        
        if (matchedSlide) {
            const realtimeSlide: SlideItem = {
                ...matchedSlide,
                startTime: timestamp,
                endTime: timestamp + 5000,
                duration: 5000
            };
            
            return this.addRealtimeSlide(realtimeSlide, timestamp, timestamp + 5000);
        }
        
        return null;
    }

    /**
     * 基于关键词查找匹配幻灯片
     */
    private findSlideByKeywords(speechText: string): SlideItem | null {
        if (!this.slides) return null;
        
        const text = speechText.toLowerCase();
        
        // 优先关键词匹配
        for (const slide of this.slides.items) {
            if (slide.keywords?.some(keyword => text.includes(keyword.toLowerCase()))) {
                return slide;
            }
        }
        
        // 其次内容匹配
        for (const slide of this.slides.items) {
            const slideText = (slide.title + ' ' + slide.content).toLowerCase();
            if (slideText.includes(text)) {
                return slide;
            }
        }
        
        return null;
    }

    // ==================== 幻灯片控制 ====================

    getCurrentSlide(): SlideItem | null {
        return this.currentSlide;
    }

    goToSlide(slideIndex: number): void {
        if (!this.slides || slideIndex < 0 || slideIndex >= this.slides.items.length) {
            throw new Error(`无效的幻灯片索引: ${slideIndex}`);
        }
        
        const targetSlide = this.slides.items[slideIndex];
        this.previousSlide = this.currentSlide;
        this.currentSlide = targetSlide;
        
        this.emitDisplayChange(targetSlide, Date.now(), true, 'manual');
    }

    goToPreviousSlide(): void {
        if (!this.slides || !this.currentSlide) return;
        
        const currentIndex = this.slides.items.findIndex(slide => slide === this.currentSlide);
        if (currentIndex > 0) {
            this.goToSlide(currentIndex - 1);
        }
    }

    goToNextSlide(): void {
        if (!this.slides || !this.currentSlide) return;
        
        const currentIndex = this.slides.items.findIndex(slide => slide === this.currentSlide);
        if (currentIndex < this.slides.items.length - 1) {
            this.goToSlide(currentIndex + 1);
        }
    }

    clear(): void {
        this.slides = null;
        this.realtimeSlides = [];
        this.currentSlide = null;
        this.previousSlide = null;
        this.lastSyncTime = 0;
        
        this.emit(SlidesHandlerEvent.CLEARED, this.createDisplayEvent(null, 0));
    }

    // ==================== 事件系统 ====================

    onDisplayChange(callback: (event: SlideDisplayEvent) => void): void {
        this.displayChangeCallbacks.add(callback);
    }

    offDisplayChange(callback: (event: SlideDisplayEvent) => void): void {
        this.displayChangeCallbacks.delete(callback);
    }

    on(event: SlidesHandlerEvent, callback: (data: SlideDisplayEvent) => void): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.add(callback);
        }
    }

    off(event: SlidesHandlerEvent, callback: (data: SlideDisplayEvent) => void): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    /**
     * 触发显示变化事件
     */
    private emitDisplayChange(
        slide: SlideItem | null, 
        currentTime: number, 
        isManual: boolean = false, 
        reason: 'time' | 'voice' | 'manual' | 'auto' = 'auto'
    ): void {
        const event = this.createDisplayEvent(slide, currentTime, isManual, reason);
        
        this.emit(SlidesHandlerEvent.DISPLAY_CHANGE, event);
        
        this.displayChangeCallbacks.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Display change callback error:', error);
            }
        });
    }

    /**
     * 触发事件
     */
    private emit(event: SlidesHandlerEvent, data: SlideDisplayEvent): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event ${event} callback error:`, error);
                }
            });
        }
    }

    /**
     * 创建显示事件对象
     */
    private createDisplayEvent(
        slide: SlideItem | null, 
        currentTime: number, 
        isManual: boolean = false, 
        reason: 'time' | 'voice' | 'manual' | 'auto' = 'auto'
    ): SlideDisplayEvent {
        return {
            currentSlide: slide,
            previousSlide: this.previousSlide,
            currentTime,
            timestamp: Date.now(),
            isManual,
            reason
        };
    }

    // ==================== 工具方法 ====================

    /**
     * 设置幻灯片数据
     */
    private setSlides(slides: Slides): void {
        this.slides = slides;
        this.currentSlide = null;
        this.previousSlide = null;
    }

    /**
     * 获取幻灯片总数
     */
    getTotalSlides(): number {
        return this.slides?.items.length || 0;
    }

    /**
     * 获取当前幻灯片索引
     */
    getCurrentSlideIndex(): number {
        if (!this.slides || !this.currentSlide) return -1;
        return this.slides.items.findIndex(slide => slide === this.currentSlide);
    }

    /**
     * 检查是否在播放中
     */
    isPlaying(): boolean {
        return this.syncIntervalId !== null;
    }

    /**
     * 销毁实例
     */
    destroy(): void {
        this.stopSync();
        this.clear();
        this.eventListeners.clear();
        this.displayChangeCallbacks.clear();
    }
}