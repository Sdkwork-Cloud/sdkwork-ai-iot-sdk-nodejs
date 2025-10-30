// ==================== 幻灯片播放器 Store 实现 ====================

import { defineStore } from 'pinia'
import { SmartSlidesHandler } from '../../../core/slides/slides-handler'
import { 
    SlidesPlaybackState,
    PlaybackControlMode,
    VoiceSyncConfig,
    SlidesPlayerConfig,
    SlidesPlayerStats,
    SlidesPlayerEvent,
    SlidesPlayerEventData,
    VoiceRecognitionResult,
    UserInteraction
} from './types'
import { Slides, SlidesHandlerMode, SlidesSyncConfig } from '../../../core/slides/types'

// 默认配置
const DEFAULT_CONFIG: SlidesPlayerConfig = {
    controlMode: PlaybackControlMode.AUTO,
    slidesMode: SlidesHandlerMode.PLAYER,
    syncConfig: {
        syncInterval: 100,
        preloadTime: 200,
        delayTime: 0,
        smoothTransition: true,
        defaultTransitionDuration: 300
    },
    voiceSync: {
        enabled: true,
        confidenceThreshold: 0.7,
        keywordMatching: 'fuzzy',
        delayCompensation: 0,
        realtimeRecognition: true
    },
    loop: false,
    showTransitions: true,
    defaultSlideDuration: 5000,
    preloadResources: true
}

// 默认统计信息
const DEFAULT_STATS: SlidesPlayerStats = {
    totalPlays: 0,
    totalPlayTime: 0,
    averagePlayTime: 0,
    slideChanges: 0,
    voiceRecognitionSuccess: 0,
    voiceRecognitionFailures: 0,
    userInteractions: 0
}

export const useSlidesStore = defineStore('slides', {
    // ==================== State ====================
    state: () => ({
        // 播放器状态
        playbackState: SlidesPlaybackState.IDLE,
        currentTime: 0,
        totalDuration: 0,
        currentSlideIndex: -1,
        isLoading: false,
        error: null as string | null,
        lastUpdated: Date.now(),
        
        // 幻灯片数据
        slides: null as Slides | null,
        currentSlide: null as any,
        previousSlide: null as any,
        
        // 配置
        config: { ...DEFAULT_CONFIG },
        
        // 统计信息
        stats: { ...DEFAULT_STATS },
        
        // 事件记录
        events: [] as SlidesPlayerEventData[],
        userInteractions: [] as UserInteraction[],
        voiceRecognitionResults: [] as VoiceRecognitionResult[],

        // 私有状态（不会被响应式监听）
        _slidesHandler: null as SmartSlidesHandler | null,
        _playbackInterval: null as number | null,
        _startTime: 0,
        _pausedTime: 0,
        _audioPlayer: null as any
    }),

    // ==================== Getters ====================
    getters: {
        // 状态检查
        isPlaying: (state) => state.playbackState === SlidesPlaybackState.PLAYING,
        isPaused: (state) => state.playbackState === SlidesPlaybackState.PAUSED,
        isStopped: (state) => state.playbackState === SlidesPlaybackState.STOPPED,
        hasError: (state) => state.error !== null,
        
        // 幻灯片信息
        totalSlides: (state) => state.slides?.items.length || 0,
        slideProgress: (state) => {
            const total = state.slides?.items.length || 0
            return total > 0 ? (state.currentSlideIndex + 1) / total : 0
        },
        
        // 播放信息
        progressPercentage: (state) => {
            return state.totalDuration > 0 ? (state.currentTime / state.totalDuration) * 100 : 0
        },
        timeRemaining: (state) => {
            return state.totalDuration - state.currentTime
        }
    },

    // ==================== Actions ====================
    actions: {
        // ==================== 初始化方法 ====================
        
        /**
         * 初始化幻灯片处理器
         */
        _initializeSlidesHandler() {
            if (this._slidesHandler) {
                this._slidesHandler.destroy()
            }
            
            this._slidesHandler = new SmartSlidesHandler({
                mode: this.config.slidesMode,
                syncConfig: this.config.syncConfig
            })
            
            // 监听幻灯片切换事件
            this._slidesHandler.onDisplayChange((event) => {
                this._handleSlideChange(event)
            })
        },

        /**
         * 处理幻灯片切换事件
         */
        _handleSlideChange(event: any) {
            this.previousSlide = this.currentSlide
            this.currentSlide = event.currentSlide
            this.currentSlideIndex = this._getCurrentSlideIndex()
            this.currentTime = event.currentTime
            
            // 记录事件
            this._recordEvent(SlidesPlayerEvent.SLIDE_CHANGE, {
                currentSlide: event.currentSlide,
                previousSlide: event.previousSlide,
                reason: event.reason
            })
            
            // 更新统计
            this.stats.slideChanges++
            this.lastUpdated = Date.now()
        },

        /**
         * 记录事件
         */
        _recordEvent(type: SlidesPlayerEvent, data: any) {
            const event: SlidesPlayerEventData = {
                type,
                timestamp: Date.now(),
                data,
                state: {
                    playbackState: this.playbackState,
                    currentTime: this.currentTime,
                    totalDuration: this.totalDuration,
                    progress: this.progressPercentage,
                    currentSlideIndex: this.currentSlideIndex,
                    currentSlide: this.currentSlide,
                    previousSlide: this.previousSlide,
                    isLoading: this.isLoading,
                    error: this.error,
                    lastUpdated: this.lastUpdated
                }
            }
            
            this.events.push(event)
            
            // 保持事件记录不超过100条
            if (this.events.length > 100) {
                this.events.shift()
            }
        },

        /**
         * 获取当前幻灯片索引
         */
        _getCurrentSlideIndex(): number {
            if (!this.slides || !this.currentSlide) {
                return -1
            }
            
            return this.slides.items.findIndex(slide => 
                slide.sequence === this.currentSlide?.sequence
            )
        },

        // ==================== 播放控制 ====================
        
        /**
         * 开始播放
         */
        play() {
            if (this.playbackState === SlidesPlaybackState.PLAYING) {
                return
            }
            
            if (!this._slidesHandler) {
                this._initializeSlidesHandler()
            }
            
            if (this.playbackState === SlidesPlaybackState.PAUSED) {
                // 从暂停状态恢复
                this.playbackState = SlidesPlaybackState.PLAYING
                this._startPlaybackTimer()
            } else {
                // 开始新的播放
                this.playbackState = SlidesPlaybackState.PLAYING
                this.currentTime = 0
                this._startPlaybackTimer()
                
                // 开始幻灯片同步
                this._slidesHandler?.startSync()
                
                // 更新统计
                this.stats.totalPlays++
            }
            
            this._recordEvent(SlidesPlayerEvent.PLAY_START, {
                startTime: this.currentTime
            })
        },

        /**
         * 暂停播放
         */
        pause() {
            if (this.playbackState !== SlidesPlaybackState.PLAYING) {
                return
            }
            
            this.playbackState = SlidesPlaybackState.PAUSED
            this._stopPlaybackTimer()
            
            // 暂停幻灯片同步
            this._slidesHandler?.stopSync()
            
            this._recordEvent(SlidesPlayerEvent.PLAY_PAUSE, {
                pauseTime: this.currentTime
            })
        },

        /**
         * 停止播放
         */
        stop() {
            if (this.playbackState === SlidesPlaybackState.STOPPED) {
                return
            }
            
            this.playbackState = SlidesPlaybackState.STOPPED
            this._stopPlaybackTimer()
            
            // 停止幻灯片同步
            this._slidesHandler?.stopSync()
            
            // 更新播放时长统计
            if (this.currentTime > 0) {
                this.stats.totalPlayTime += this.currentTime
                this.stats.averagePlayTime = this.stats.totalPlayTime / this.stats.totalPlays
            }
            
            this._recordEvent(SlidesPlayerEvent.PLAY_STOP, {
                stopTime: this.currentTime
            })
        },

        /**
         * 跳转到指定时间
         */
        seek(time: number) {
            if (time < 0 || time > this.totalDuration) {
                return
            }
            
            this.currentTime = time
            
            // 更新幻灯片显示
            if (this._slidesHandler) {
                this._slidesHandler.updatePlaybackTime(time)
            }
            
            this._recordEvent(SlidesPlayerEvent.TIME_UPDATE, {
                seekTime: time
            })
        },

        /**
         * 开始播放计时器
         */
        _startPlaybackTimer() {
            this._stopPlaybackTimer()
            
            this._playbackInterval = setInterval(() => {
                if (this.playbackState === SlidesPlaybackState.PLAYING) {
                    this.currentTime += 100 // 每100ms更新一次
                    
                    // 检查是否播放完成
                    if (this.currentTime >= this.totalDuration) {
                        if (this.config.loop) {
                            this.currentTime = 0
                        } else {
                            this._handlePlaybackComplete()
                        }
                    }
                    
                    // 更新时间显示
                    this._slidesHandler?.updatePlaybackTime(this.currentTime)
                    
                    this.lastUpdated = Date.now()
                }
            }, 100) as unknown as number
        },

        /**
         * 停止播放计时器
         */
        _stopPlaybackTimer() {
            if (this._playbackInterval) {
                clearInterval(this._playbackInterval)
                this._playbackInterval = null
            }
        },

        /**
         * 处理播放完成
         */
        _handlePlaybackComplete() {
            this.playbackState = SlidesPlaybackState.COMPLETED
            this._stopPlaybackTimer()
            
            // 停止幻灯片同步
            this._slidesHandler?.stopSync()
            
            // 更新统计
            this.stats.totalPlayTime += this.currentTime
            this.stats.averagePlayTime = this.stats.totalPlayTime / this.stats.totalPlays
            
            this._recordEvent(SlidesPlayerEvent.PLAY_COMPLETE, {
                totalDuration: this.totalDuration
            })
        },

        // ==================== 幻灯片导航 ====================
        
        /**
         * 跳转到指定幻灯片
         */
        goToSlide(index: number) {
            if (!this.slides || index < 0 || index >= this.slides.items.length) {
                return
            }
            
            this._slidesHandler?.goToSlide(index)
            
            // 记录用户交互
            this._recordUserInteraction('click', `slide-${index}`)
        },

        /**
         * 上一张幻灯片
         */
        previousSlide() {
            this._slidesHandler?.goToPreviousSlide()
            
            // 记录用户交互
            this._recordUserInteraction('click', 'previous-slide')
        },

        /**
         * 下一张幻灯片
         */
        nextSlide() {
            this._slidesHandler?.goToNextSlide()
            
            // 记录用户交互
            this._recordUserInteraction('click', 'next-slide')
        },

        /**
         * 记录用户交互
         */
        _recordUserInteraction(type: 'click' | 'keypress' | 'drag' | 'scroll', target: string) {
            const interaction: UserInteraction = {
                type,
                target,
                timestamp: Date.now()
            }
            
            this.userInteractions.push(interaction)
            this.stats.userInteractions++
            
            // 保持交互记录不超过50条
            if (this.userInteractions.length > 50) {
                this.userInteractions.shift()
            }
        },

        // ==================== 数据管理 ====================
        
        /**
         * 加载幻灯片数据
         */
        async loadSlides(slidesData: Slides | string | File) {
            this.isLoading = true
            this.error = null
            
            this._recordEvent(SlidesPlayerEvent.LOAD_START, {
                dataType: typeof slidesData
            })
            
            try {
                if (!this._slidesHandler) {
                    this._initializeSlidesHandler()
                }
                
                let slides: Slides
                
                if (typeof slidesData === 'string') {
                    // JSON字符串
                    slides = await this._slidesHandler!.loadFromString(slidesData)
                } else if (slidesData instanceof File) {
                    // 文件
                    slides = await this._slidesHandler!.loadFromFile(slidesData)
                } else {
                    // Slides对象
                    slides = slidesData
                    this._slidesHandler!.loadFromString(JSON.stringify(slidesData))
                }
                
                this.slides = slides
                this.totalDuration = slides.totalDuration || 0
                
                // 重置播放状态
                this.playbackState = SlidesPlaybackState.IDLE
                this.currentTime = 0
                this.currentSlideIndex = -1
                this.currentSlide = null
                this.previousSlide = null
                
                this._recordEvent(SlidesPlayerEvent.LOAD_COMPLETE, {
                    slidesCount: slides.items.length,
                    totalDuration: this.totalDuration
                })
                
            } catch (error) {
                this.error = error instanceof Error ? error.message : '加载幻灯片失败'
                
                this._recordEvent(SlidesPlayerEvent.LOAD_ERROR, {
                    error: this.error
                })
                
                throw error
            } finally {
                this.isLoading = false
            }
        },

        /**
         * 清除幻灯片数据
         */
        clearSlides() {
            this.slides = null
            this.currentSlide = null
            this.previousSlide = null
            this.currentSlideIndex = -1
            this.totalDuration = 0
            this.currentTime = 0
            
            this.stop()
            
            if (this._slidesHandler) {
                this._slidesHandler.clear()
            }
        },

        // ==================== 配置管理 ====================
        
        /**
         * 更新播放器配置
         */
        updateConfig(newConfig: Partial<SlidesPlayerConfig>) {
            Object.assign(this.config, newConfig)
            
            // 如果幻灯片处理器已存在，重新初始化
            if (this._slidesHandler) {
                this._initializeSlidesHandler()
            }
            
            this._recordEvent(SlidesPlayerEvent.CONFIG_UPDATE, {
                config: this.config
            })
        },

        /**
         * 重置配置
         */
        resetConfig() {
            this.config = { ...DEFAULT_CONFIG }
            
            if (this._slidesHandler) {
                this._initializeSlidesHandler()
            }
        },

        // ==================== 语音处理 ====================
        
        /**
         * 处理语音识别结果
         */
        processVoiceRecognition(result: VoiceRecognitionResult) {
            if (!this.config.voiceSync.enabled) {
                return
            }
            
            // 记录语音识别结果
            this.voiceRecognitionResults.push(result)
            
            // 保持记录不超过20条
            if (this.voiceRecognitionResults.length > 20) {
                this.voiceRecognitionResults.shift()
            }
            
            // 处理语音识别结果
            if (result.confidence >= this.config.voiceSync.confidenceThreshold) {
                this.stats.voiceRecognitionSuccess++
                
                if (this._slidesHandler) {
                    this._slidesHandler.processSpeechRecognition(
                        result.text,
                        result.confidence,
                        result.timestamp
                    )
                }
            } else {
                this.stats.voiceRecognitionFailures++
            }
            
            this._recordEvent(SlidesPlayerEvent.VOICE_RECOGNITION, {
                result,
                success: result.confidence >= this.config.voiceSync.confidenceThreshold
            })
        },

        // ==================== 状态管理 ====================
        
        /**
         * 重置播放器
         */
        reset() {
            this.clearSlides()
            this.resetConfig()
            this.stats = { ...DEFAULT_STATS }
            this.events = []
            this.userInteractions = []
            this.voiceRecognitionResults = []
            this.error = null
        },

        /**
         * 销毁播放器
         */
        destroy() {
            this.stop()
            
            if (this._slidesHandler) {
                this._slidesHandler.destroy()
                this._slidesHandler = null
            }
            
            this._stopPlaybackTimer()
        }
    }
})