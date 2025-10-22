// ==================== 字幕 Store 实现 ====================

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { 
    SubtitlesHandler, 
    SubtitlesHandlerFactory,
    SubtitlesHandlerMode,
    SubtitleDisplayEvent,
    SubtitlesHandlerEvent
} from '@/core/subtitles'
import {
    SubtitleStoreState,
    SubtitleStoreGetters,
    SubtitleStoreActions,
    SubtitleConfig,
    SubtitleState,
    SubtitleEventType,
    SubtitleEventData,
    SubtitleDisplayMode,
    SubtitleLoadOptions,
    DynamicSubtitleOptions
} from './types'

// 默认配置
const DEFAULT_CONFIG: SubtitleConfig = {
    displayMode: SubtitleDisplayMode.CARD,
    lineCount: 3,
    fontSize: 16,
    fontColor: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    showBackground: true,
    position: 'bottom',
    autoScroll: true,
    scrollSpeed: 1
}

// 默认状态
const DEFAULT_STATE: SubtitleStoreState = {
    config: { ...DEFAULT_CONFIG },
    currentState: SubtitleState.IDLE,
    errorMessage: '',
    currentSubtitles: null,
    dynamicEntries: [],
    currentEntry: null,
    currentTime: 0,
    totalDuration: 0,
    isPlaying: false,
    settingDialogVisible: false,
    subtitleListVisible: false,
    _eventListeners: new Map(),
    _syncTimer: null
}

export const useSubtitleStore = defineStore('subtitles', {
    // ==================== State ====================
    state: () => ({
        config: { ...DEFAULT_CONFIG },
        currentState: SubtitleState.IDLE,
        errorMessage: '',
        currentSubtitles: null as any,
        dynamicEntries: [] as any[],
        currentEntry: null as any,
        currentTime: 0,
        totalDuration: 0,
        isPlaying: false,
        settingDialogVisible: false,
        subtitleListVisible: false,

        // 私有状态（不会被响应式监听）
        _eventListeners: new Map() as Map<SubtitleEventType, Function[]>,
        _syncTimer: null as number | null,
        _subtitlesHandler: null as SubtitlesHandler | null
    }),

    // ==================== Getters ====================
    getters: {
        // 状态检查
        isIdle: (state) => state.currentState === SubtitleState.IDLE,
        isLoading: (state) => state.currentState === SubtitleState.LOADING,
        isLoaded: (state) => state.currentState === SubtitleState.LOADED,
        isPlayingState: (state) => state.currentState === SubtitleState.PLAYING,
        isPaused: (state) => state.currentState === SubtitleState.PAUSED,
        isError: (state) => state.currentState === SubtitleState.ERROR,

        // 字幕内容相关
        hasSubtitles: (state) => state.currentSubtitles !== null,
        hasDynamicEntries: (state) => state.dynamicEntries.length > 0,
        totalEntries: (state) => {
            const staticEntries = state.currentSubtitles?.entries?.length || 0
            const dynamicEntries = state.dynamicEntries.length
            return staticEntries + dynamicEntries
        },
        currentEntryText: (state) => state.currentEntry?.text || '',

        // 播放相关
        progressPercentage: (state) => {
            if (state.totalDuration === 0) return 0
            return (state.currentTime / state.totalDuration) * 100
        },
        timeRemaining: (state) => {
            if (state.totalDuration === 0) return 0
            return Math.max(0, state.totalDuration - state.currentTime)
        },

        // 配置相关
        isFullscreenMode: (state) => state.config.displayMode === SubtitleDisplayMode.FULLSCREEN,
        isCardMode: (state) => state.config.displayMode === SubtitleDisplayMode.CARD,
        isLineMode: (state) => state.config.displayMode === SubtitleDisplayMode.LINE,
        displayLineCount: (state) => state.config.lineCount || 3
    },

    // ==================== Actions ====================
    actions: {
        // ==================== 配置操作 ====================
        updateConfig(newConfig: Partial<SubtitleConfig>) {
            Object.assign(this.config, newConfig)
            this.emit(SubtitleEventType.MODE_CHANGE, {
                currentTime: this.currentTime
            })
        },

        resetConfig() {
            this.config = { ...DEFAULT_CONFIG }
        },

        switchDisplayMode(mode: SubtitleDisplayMode, options?: Partial<SubtitleConfig>) {
            this.config.displayMode = mode
            if (options) {
                Object.assign(this.config, options)
            }
            this.emit(SubtitleEventType.MODE_CHANGE, {
                currentTime: this.currentTime
            })
        },

        // ==================== 字幕加载操作 ====================
        async loadFromString(content: string, options?: SubtitleLoadOptions) {
            this.currentState = SubtitleState.LOADING
            this.errorMessage = ''

            this.emit(SubtitleEventType.LOAD_START, {
                currentTime: this.currentTime
            })

            try {
                // 初始化字幕处理器
                if (!this._subtitlesHandler) {
                    this._subtitlesHandler = SubtitlesHandlerFactory.createPlayerHandler()
                    
                    // 设置事件监听
                    this._subtitlesHandler.onDisplayChange((event: SubtitleDisplayEvent) => {
                        this.currentEntry = event.entry
                        this.currentTime = event.currentTime
                        
                        this.emit(SubtitleEventType.ENTRY_CHANGE, {
                            currentEntry: event.entry,
                            currentTime: event.currentTime
                        })
                    })
                }

                // 加载字幕
                const subtitles = await this._subtitlesHandler.loadFromString(content)
                this.currentSubtitles = subtitles
                this.totalDuration = subtitles.duration ? subtitles.duration * 1000 : 0
                
                this.currentState = SubtitleState.LOADED
                
                this.emit(SubtitleEventType.LOAD_COMPLETE, {
                    currentTime: this.currentTime
                })

            } catch (error) {
                this.currentState = SubtitleState.ERROR
                this.errorMessage = error instanceof Error ? error.message : '字幕加载失败'
                
                this.emit(SubtitleEventType.LOAD_ERROR, {
                    error: this.errorMessage,
                    currentTime: this.currentTime
                })
                throw error
            }
        },

        async loadFromUrl(url: string, options?: SubtitleLoadOptions) {
            this.currentState = SubtitleState.LOADING
            this.errorMessage = ''

            this.emit(SubtitleEventType.LOAD_START, {
                currentTime: this.currentTime
            })

            try {
                // 初始化字幕处理器
                if (!this._subtitlesHandler) {
                    this._subtitlesHandler = SubtitlesHandlerFactory.createPlayerHandler()
                    
                    // 设置事件监听
                    this._subtitlesHandler.onDisplayChange((event: SubtitleDisplayEvent) => {
                        this.currentEntry = event.entry
                        this.currentTime = event.currentTime
                        
                        this.emit(SubtitleEventType.ENTRY_CHANGE, {
                            currentEntry: event.entry,
                            currentTime: event.currentTime
                        })
                    })
                }

                // 加载字幕
                const subtitles = await this._subtitlesHandler.loadFromUrl(url)
                this.currentSubtitles = subtitles
                this.totalDuration = subtitles.duration ? subtitles.duration * 1000 : 0
                
                this.currentState = SubtitleState.LOADED
                
                this.emit(SubtitleEventType.LOAD_COMPLETE, {
                    currentTime: this.currentTime
                })

            } catch (error) {
                this.currentState = SubtitleState.ERROR
                this.errorMessage = error instanceof Error ? error.message : '字幕加载失败'
                
                this.emit(SubtitleEventType.LOAD_ERROR, {
                    error: this.errorMessage,
                    currentTime: this.currentTime
                })
                throw error
            }
        },

        loadFromObject(subtitles: any) {
            this.currentSubtitles = subtitles
            this.totalDuration = subtitles.duration ? subtitles.duration * 1000 : 0
            this.currentState = SubtitleState.LOADED
            
            this.emit(SubtitleEventType.LOAD_COMPLETE, {
                currentTime: this.currentTime
            })
        },

        clearSubtitles() {
            this.currentSubtitles = null
            this.dynamicEntries = []
            this.currentEntry = null
            this.currentTime = 0
            this.totalDuration = 0
            this.currentState = SubtitleState.IDLE
            
            if (this._subtitlesHandler) {
                this._subtitlesHandler.clear()
            }
            
            this.emit(SubtitleEventType.CONTENT_UPDATE, {
                currentTime: this.currentTime
            })
        },

        // ==================== 动态字幕操作 ====================
        addDynamicSubtitle(options: DynamicSubtitleOptions) {
            const entry = {
                sequence: this.dynamicEntries.length + 1,
                startTime: options.startTime,
                endTime: options.endTime,
                text: options.text
            }

            this.dynamicEntries.push(entry)
            
            // 如果正在播放，检查是否需要立即显示
            if (this.isPlayingState && this._subtitlesHandler) {
                this._subtitlesHandler.addStreamSubtitle(
                    options.text,
                    options.startTime,
                    options.endTime
                )
            }

            this.emit(SubtitleEventType.CONTENT_UPDATE, {
                currentTime: this.currentTime,
                data: { entry, isDynamic: true }
            })

            return entry
        },

        addDynamicSubtitles(entries: DynamicSubtitleOptions[]) {
            const addedEntries = entries.map(options => this.addDynamicSubtitle(options))
            return addedEntries
        },

        clearDynamicSubtitles() {
            this.dynamicEntries = []
            this.emit(SubtitleEventType.CONTENT_UPDATE, {
                currentTime: this.currentTime
            })
        },

        // ==================== 播放控制操作 ====================
        startPlayback() {
            if (this._subtitlesHandler) {
                this._subtitlesHandler.startSync()
                this.currentState = SubtitleState.PLAYING
                this.isPlaying = true
                
                this.emit(SubtitleEventType.PLAYBACK_STATE_CHANGE, {
                    currentTime: this.currentTime
                })
            }
        },

        stopPlayback() {
            if (this._subtitlesHandler) {
                this._subtitlesHandler.stopSync()
                this.currentState = SubtitleState.IDLE
                this.isPlaying = false
                this.currentTime = 0
                
                this.emit(SubtitleEventType.PLAYBACK_STATE_CHANGE, {
                    currentTime: this.currentTime
                })
            }
        },

        pausePlayback() {
            if (this._subtitlesHandler && this.isPlayingState) {
                this.currentState = SubtitleState.PAUSED
                this.isPlaying = false
                
                this.emit(SubtitleEventType.PLAYBACK_STATE_CHANGE, {
                    currentTime: this.currentTime
                })
            }
        },

        resumePlayback() {
            if (this._subtitlesHandler && this.currentState === SubtitleState.PAUSED) {
                this.currentState = SubtitleState.PLAYING
                this.isPlaying = true
                
                this.emit(SubtitleEventType.PLAYBACK_STATE_CHANGE, {
                    currentTime: this.currentTime
                })
            }
        },

        seekTo(time: number) {
            this.currentTime = time
            
            if (this._subtitlesHandler) {
                this._subtitlesHandler.updatePlaybackTime(time)
            }
            
            this.emit(SubtitleEventType.ENTRY_CHANGE, {
                currentTime: time
            })
        },

        updatePlaybackTime(time: number) {
            this.currentTime = time
            
            if (this._subtitlesHandler) {
                this._subtitlesHandler.updatePlaybackTime(time)
            }
        },

        // ==================== 事件操作 ====================
        on(event: SubtitleEventType, callback: (data: SubtitleEventData) => void) {
            if (!this._eventListeners.has(event)) {
                this._eventListeners.set(event, [])
            }
            this._eventListeners.get(event)!.push(callback)
        },

        off(event: SubtitleEventType, callback: (data: SubtitleEventData) => void) {
            const listeners = this._eventListeners.get(event)
            if (listeners) {
                const index = listeners.indexOf(callback)
                if (index > -1) {
                    listeners.splice(index, 1)
                }
            }
        },

        emit(event: SubtitleEventType, data?: Partial<SubtitleEventData>) {
            const listeners = this._eventListeners.get(event)
            if (listeners) {
                const eventData: SubtitleEventData = {
                    type: event,
                    currentEntry: this.currentEntry,
                    currentTime: this.currentTime,
                    error: this.errorMessage,
                    ...data
                }
                
                listeners.forEach(callback => {
                    try {
                        callback(eventData)
                    } catch (error) {
                        console.error(`事件处理错误: ${event}`, error)
                    }
                })
            }
        },

        // ==================== UI 操作 ====================
        showSettings() {
            this.settingDialogVisible = true
        },

        hideSettings() {
            this.settingDialogVisible = false
        },

        showSubtitleList() {
            this.subtitleListVisible = true
        },

        hideSubtitleList() {
            this.subtitleListVisible = false
        },

        // ==================== 工具操作 ====================
        getStats() {
            return {
                totalEntries: this.totalEntries,
                dynamicEntries: this.dynamicEntries.length,
                currentTime: this.currentTime,
                totalDuration: this.totalDuration,
                state: this.currentState
            }
        },

        async exportSubtitles(format: any) {
            if (!this._subtitlesHandler) {
                throw new Error('字幕处理器未初始化')
            }
            
            return await this._subtitlesHandler.export(format)
        }
    }
})