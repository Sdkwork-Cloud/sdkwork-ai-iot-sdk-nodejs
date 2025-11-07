// ==================== 录制器 Store 实现 ====================

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { AudioRecorder, AudioRecorderError, AudioRecorderErrorType } from '../../../core/audio/recorder'
import {
    RecorderStoreState,
    RecorderStoreActions,
    RecorderStoreGetters,
    RecorderStoreOptions,
    RecorderConfig,
    AudioRecord,
    RecordState
} from './types'
import Recorder from 'recorder-core'
import { JsRecorderDataSender } from './record-data-sender'

// 默认配置
const DEFAULT_CONFIG: RecorderConfig = {
    sampleRate: 16000,
    format: 'pcm',
    enableWave: true,
    realtime: false,
    recordToFile: true,
    maxDuration: 0,
    autoSendInterval: 0
}

// 默认状态
const DEFAULT_STATE: RecorderStoreState = {
    config: { ...DEFAULT_CONFIG },
    currentState: RecordState.IDLE,
    currentDuration: 0,
    currentRecord: null,
    records: [],
    errorMessage: '',
    settingDialogVisible: false,
    recordListDialogVisible: false,
    saveDialogVisible: false,
    cancelConfirmVisible: false,
    currentPlayingRecordId: null,
    isPlaying: false,
    currentTime: 0,
    totalDuration: 0
}

export const useRecorderStore = defineStore('recorder', {
    // ==================== State ====================
    state: () => ({
        ...DEFAULT_STATE,
        config: { ...DEFAULT_CONFIG, enableWave: true },
        currentState: RecordState.IDLE,
        currentDuration: 0,
        currentRecord: null as AudioRecord | null,
        records: [] as AudioRecord[],
        errorMessage: '',
        settingDialogVisible: false,
        recordListDialogVisible: false,
        saveDialogVisible: false,
        cancelConfirmVisible: false,
        currentPlayingRecordId: null as string | null,
        isPlaying: false,
        currentTime: 0,
        totalDuration: 0,

        // 私有状态（不会被响应式监听）
        _timerInterval: null as number | null,
        _startTime: 0,
        _pausedTime: 0,
        _playbackInterval: null as number | null,
        _audioPlayer: null as any,
        _audioRecorder: null as InstanceType<typeof AudioRecorder> | null,
        _waveContainer: null as HTMLElement | null,
        _isRealtimeMode: false as boolean // 实时模式标记
    }),

    // ==================== Getters ====================
    getters: {
        // 状态检查
        isIdle: (state) =>
            state.currentState === RecordState.IDLE ||
            state.currentState === RecordState.STOPPED,

        isRecording: (state) =>
            state.currentState === RecordState.RECORDING,

        isPaused: (state) =>
            state.currentState === RecordState.PAUSED,

        isProcessing: (state) =>
            state.currentState === RecordState.PROCESSING,

        isError: (state) =>
            state.currentState === RecordState.ERROR,

        // 录制记录相关
        latestRecord: (state) =>
            state.records.length > 0 ? state.records[0] : null,

        recordCount: (state) => state.records.length,

        hasRecords: (state) => state.records.length > 0,

        // 配置相关
        isRealtimeEnabled: (state) =>
            state.config.realtime === true,

        isWaveEnabled: (state) =>
            state.config.enableWave === true,

        isRecordToFile: (state) =>
            state.config.recordToFile === true,

        // 播放相关
        currentPlayingRecord: (state) =>
            state.currentPlayingRecordId
                ? state.records.find(record => record.id === state.currentPlayingRecordId) || null
                : null,

        progressPercentage: (state) => {
            if (state.totalDuration === 0) return 0
            return (state.currentTime / state.totalDuration) * 100
        }
    },

    // ==================== Actions ====================
    actions: {
        // 配置操作
        updateConfig(newConfig: Partial<RecorderConfig>) {
            Object.assign(this.config, newConfig)
        },

        resetConfig() {
            ``
            this.config = { ...DEFAULT_CONFIG, enableWave: true }
        },

        // 录制操作
        async startRecording(options: {
            realtime?: boolean
            enableWave?: boolean
            waveContainer?: HTMLElement
            sampleRate?: number
            format?: 'pcm' | 'mp3' | 'wav'
            [key: string]: any
        } = {}) {
            // 参数默认值
            const {
                realtime = false,
                enableWave = true,
                waveContainer = null,
                sampleRate = this.config.sampleRate,
                format = this.config.format
            } = options

            // 更严格的状态检查，确保只有在 IDLE 或 STOPPED 状态下才能开始录制
            if (this.currentState !== RecordState.IDLE && this.currentState !== RecordState.STOPPED && this._audioRecorder && this._audioRecorder.isRecording()) {
                console.warn('Cannot start recording in state:', this.currentState)
                return
            }

            // 清除之前的错误信息
            this.errorMessage = ''

            this.currentState = RecordState.INITIALIZING
            this.currentDuration = 0
            this._pausedTime = 0
            this._startTime = 0

            try {
                // 如果录制器已存在但状态不正确，先销毁它
                if (this._audioRecorder) {
                    try {
                       const result= await this._audioRecorder.stopRecord()
                        if (typeof this._audioRecorder.destroy === 'function') {
                            this._audioRecorder.destroy()
                        }

                    } catch (error) {
                        console.warn('Error destroying existing recorder:', error)
                    }
                    this._audioRecorder = null
                }

                // 创建新的音频录制器
                this._audioRecorder = new AudioRecorder({
                    sampleRate,
                    format,
                    waveView: {
                        enable: enableWave || this.config.enableWave,
                        container: this._waveContainer as any || waveContainer
                    }
                })

                // 初始化录制器
                await this._audioRecorder.initialize()

                // 设置实时模式标记
                this._isRealtimeMode = (realtime || this.config.realtime) as boolean

                // 开始录制`
                if (this._isRealtimeMode) { 
                    const recorderDataSender:JsRecorderDataSender=new JsRecorderDataSender((blob: ArrayBuffer, encTime: number)=>{
                        this.sendStreamData(blob)
                    })
                    await this._audioRecorder.startRecordStream({
                        onData: (data: any, options: any) => {
                            recorderDataSender.handleSendData(data,options)
                        },
                        onError: (error: Error) => {
                            console.error('Real-time recording error:', error)
                            this.setError(`实时录制错误: ${error.message}`)
                        },
                        onComplete: () => {
                            console.log('Real-time recording completed')
                        }
                    })
                } else {
                    await this._audioRecorder.startRecordToFile()
                }

                this.currentState = RecordState.RECORDING

                // 开始计时器
                this.startTimer()

            } catch (error) {
                this.currentState = RecordState.ERROR
                
                // 增强错误处理：提供更友好的错误信息
                if (error instanceof AudioRecorderError) {
                    switch (error.type) {
                        case AudioRecorderErrorType.PERMISSION_DENIED:
                            this.errorMessage = '麦克风权限被拒绝，请检查浏览器权限设置'
                            break
                        case AudioRecorderErrorType.NOT_INITIALIZED:
                            this.errorMessage = '录音器未初始化，请检查设备连接'
                            break
                        case AudioRecorderErrorType.INITIALIZATION_FAILED:
                            // 检查是否是设备未找到错误
                            if (error.message.includes('NotFoundError') || error.message.includes('设备未找到')) {
                                this.errorMessage = '未检测到可用麦克风设备，请检查设备连接'
                            } else {
                                this.errorMessage = `录音器初始化失败: ${error.message}`
                            }
                            break
                        default:
                            this.errorMessage = `录音错误: ${error.message}`
                    }
                } else {
                    // 处理非AudioRecorderError类型的错误
                    const errorMessage = error instanceof Error ? error.message : '录制初始化失败'
                    
                    // 检查常见的设备错误
                    if (errorMessage.includes('NotFoundError') || errorMessage.includes('设备未找到')) {
                        this.errorMessage = '未检测到可用麦克风设备，请检查设备连接'
                    } else if (errorMessage.includes('Permission denied') || errorMessage.includes('权限被拒绝')) {
                        this.errorMessage = '麦克风权限被拒绝，请检查浏览器权限设置'
                    } else {
                        this.errorMessage = errorMessage
                    }
                }
                
                console.error('Recording initialization failed:', error)
                
                // 清理资源
                try {
                    if (this._audioRecorder) {
                        await this._audioRecorder.destroy()
                        this._audioRecorder = null
                    }
                } catch (cleanupError) {
                    console.error('Error during cleanup after recording failure:', cleanupError)
                }
            }
        },

        handleSendFrames(buffer: any, sampleRate: number, idx: number) {
            // const chunk = Recorder.SampleData(buffer, sampleRate, 16000, null);

            if (idx <= buffer.length - 1) {
                console.error('chunk======================================', buffer.slice(idx))
                this.sendStreamData(buffer.slice(idx));
            }
            // this.sendStreamData(buffer[buffer.length-1]);
        },

        pauseRecording() {
            if (this.currentState !== RecordState.RECORDING) return

            // 暂停录制器
            if (this._audioRecorder) {
                this._audioRecorder.pauseRecord()
            }

            this.currentState = RecordState.PAUSED
            this.stopTimer()
        },

        resumeRecording() {
            if (this.currentState !== RecordState.PAUSED) return

            // 恢复录制器
            if (this._audioRecorder) {
                this._audioRecorder.resumeRecord()
            }

            this.currentState = RecordState.RECORDING
            this.startTimer()
        },

        async stopRecording(): Promise<AudioRecord | null> {
            if (!this.isRecording && !this.isPaused) return null

            this.currentState = RecordState.PROCESSING
            this.stopTimer()

            try {
                let audioData: Blob | ArrayBuffer | null = null
                let duration = this.currentDuration

                // 停止录制并获取音频数据
                if (this._audioRecorder) {
                    const result = await this._audioRecorder.stopRecord()
                    audioData = result.data
                    duration = result.duration
                }

                // 创建录制数据
                const audioRecord: AudioRecord = {
                    duration: duration,
                    size: audioData ? (audioData instanceof Blob ? audioData.size : audioData.byteLength) : 0,
                    createdAt: Date.now(),
                    id: `record_${Date.now()}`,
                    name: `录制_${new Date().toLocaleString('zh-CN')}`,
                    data: audioData || undefined
                }

                this.addRecord(audioRecord)

                this.currentState = RecordState.STOPPED
                this.currentRecord = audioRecord
                this.currentDuration = 0 // 重置当前时长
                this._pausedTime = 0 // 重置暂停时间
                this._startTime = 0 // 重置开始时间

                return audioRecord

            } catch (error) {
                this.currentState = RecordState.ERROR
                this.errorMessage = error instanceof Error ? error.message : '录制停止失败'
                console.error('Recording stop failed:', error)
                return null
            }
        },

        cancelRecording() {
            if (!this.isRecording && !this.isPaused) return

            // 停止录制器但不保存数据
            if (this._audioRecorder) {
                try {
                    // 先停止录制器
                    this._audioRecorder.stopRecord()

                    // 销毁录制器实例，确保完全重置
                    if (typeof this._audioRecorder.destroy === 'function') {
                        this._audioRecorder.destroy()
                    }
                    this._audioRecorder = null

                } catch (error) {
                    console.warn('Error during recording cancellation:', error)
                }
            }

            // 完全重置状态
            this.currentState = RecordState.IDLE
            this.stopTimer()
            this.currentDuration = 0
            this.currentRecord = null
            this.errorMessage = ''
            this._pausedTime = 0
            this._startTime = 0

            // 关闭取消确认对话框
            this.cancelConfirmVisible = false
        },

        // 录制记录操作
        addRecord(record: AudioRecord) {
            this.records.unshift(record) // 新记录添加到开头

            // 限制记录数量（最多50条）
            if (this.records.length > 50) {
                this.records = this.records.slice(0, 50)
            }
        },

        removeRecord(recordId: string) {
            const index = this.records.findIndex(record => record.id === recordId)
            if (index !== -1) {
                this.records.splice(index, 1)
            }
        },

        clearRecords() {
            this.records = []
        },

        updateRecord(recordId: string, updates: Partial<AudioRecord>) {
            const record = this.records.find(record => record.id === recordId)
            if (record) {
                Object.assign(record, updates)
            }
        },

        // 播放操作
        playRecord(record: AudioRecord) {
            if (this.isPlaying && this.currentPlayingRecordId === record.id) {
                // 如果正在播放同一记录，则暂停
                this.pausePlayback()
                return
            }

            // 停止当前播放
            this.stopPlayback()

            // 开始播放新记录
            this.currentPlayingRecordId = record.id
            this.isPlaying = true
            this.currentTime = 0
            this.totalDuration = record.duration

            // 模拟播放进度更新
            this.startPlaybackTimer()
        },

        pausePlayback() {
            if (this.isPlaying) {
                this.isPlaying = false
                this.stopPlaybackTimer()
            }
        },

        stopPlayback() {
            this.isPlaying = false
            this.currentPlayingRecordId = null
            this.currentTime = 0
            this.totalDuration = 0
            this.stopPlaybackTimer()
        },

        // UI 操作
        toggleSettingDialog(show?: boolean) {
            this.settingDialogVisible = show !== undefined ? show : !this.settingDialogVisible
        },

        toggleRecordListDialog(show?: boolean) {
            this.recordListDialogVisible = show !== undefined ? show : !this.recordListDialogVisible
        },

        toggleSaveDialog(show?: boolean) {
            this.saveDialogVisible = show !== undefined ? show : !this.saveDialogVisible
        },

        toggleCancelConfirm(show?: boolean) {
            this.cancelConfirmVisible = show !== undefined ? show : !this.cancelConfirmVisible
        },

        // 错误处理
        setError(message: string) {
            this.errorMessage = message
            this.currentState = RecordState.ERROR
        },

        clearError() {
            this.errorMessage = ''
            if (this.currentState === RecordState.ERROR) {
                this.currentState = RecordState.IDLE
            }
        },

        // ==================== 私有方法 ====================

        // 录制计时器
        startTimer() {
            if (this._timerInterval) {
                clearInterval(this._timerInterval)
                this._timerInterval = null
            }

            this._startTime = Date.now() - this._pausedTime * 1000

            this._timerInterval = window.setInterval(() => {
                this.currentDuration = Math.floor((Date.now() - this._startTime) / 1000)

                // 检查最大录制时长限制
                if (this.config.maxDuration && this.config.maxDuration > 0 && this.currentDuration >= this.config.maxDuration) {
                    setTimeout(() => {
                        if (this.currentState === RecordState.RECORDING) {
                            this.stopRecording()
                        }
                    }, 0)
                }
            }, 1000)
        },

        stopTimer() {
            if (this._timerInterval) {
                clearInterval(this._timerInterval)
                this._timerInterval = null
            }

            // 记录暂停时的时间
            if (this.currentState === RecordState.PAUSED) {
                this._pausedTime = this.currentDuration
            } else {
                // 在停止或取消录制时，重置暂停时间
                this._pausedTime = 0
            }
        },

        // 播放计时器
        startPlaybackTimer() {
            if (this._playbackInterval) {
                clearInterval(this._playbackInterval)
                this._playbackInterval = null
            }

            this._playbackInterval = window.setInterval(() => {
                if (this.isPlaying && this.currentTime < this.totalDuration) {
                    this.currentTime += 0.1

                    if (this.currentTime >= this.totalDuration) {
                        this.stopPlayback()
                    }
                }
            }, 100)
        },

        stopPlaybackTimer() {
            if (this._playbackInterval) {
                clearInterval(this._playbackInterval)
                this._playbackInterval = null
            }
        },

        // 清理资源
        cleanup() {
            this.stopTimer()
            this.stopPlaybackTimer()

            // 销毁音频录制器
            if (this._audioRecorder) {
                try {
                    // 调用录制器的销毁方法（如果存在）
                    if (typeof this._audioRecorder.destroy === 'function') {
                        this._audioRecorder.destroy()
                    }
                } catch (error) {
                    console.warn('Error during audio recorder cleanup:', error)
                }
                this._audioRecorder = null
            }
        },

        // ==================== 录制器相关方法 ====================

        /**
         * 设置波形显示容器
         */
        setWaveContainer(container: HTMLElement) {
            // 如果容器没有变化，直接返回避免不必要的重新初始化
            if (this._waveContainer === container) {
                return
            }

            this._waveContainer = container

            // 如果录制器已存在且启用了波形显示，更新其波形容器配置
            if (this._audioRecorder && this.config.enableWave && container) {
                // 重新初始化录制器以应用新的波形容器
                this.reinitializeRecorder()
            }
        },

        /**
         * 重新初始化录制器
         */
        async reinitializeRecorder() {
            if (this._audioRecorder) {
                try {
                    const wasRecording = this.isRecording
                    const wasPaused = this.isPaused

                    // 销毁当前录制器
                    if (typeof this._audioRecorder.destroy === 'function') {
                        this._audioRecorder.destroy()
                    }
                    this._audioRecorder = null

                    // 重新创建录制器
                    this._audioRecorder = new AudioRecorder({
                        sampleRate: this.config.sampleRate,
                        format: this.config.format,
                        waveView: {
                            enable: this.config.enableWave,
                            container: this._waveContainer as any
                        }
                    })

                    // 如果之前正在录制或暂停，重新开始录制
                    if (wasRecording || wasPaused) {
                        await this.startRecording()

                        // 如果之前是暂停状态，重新暂停
                        if (wasPaused) {
                            this.pauseRecording()
                        }
                    }
                } catch (error) {
                    console.error('Failed to reinitialize recorder:', error)
                    this.setError(`录制器重新初始化失败: ${error instanceof Error ? error.message : '未知错误'}`)
                }
            }
        },

        /**
         * 获取录制统计信息
         */
        getRecordingStats() {
            if (!this._audioRecorder) {
                return {
                    state: this.currentState,
                    duration: this.currentDuration,
                    dataSize: 0,
                    waveEnabled: this.config.enableWave,
                    realtime: this.config.realtime
                }
            }

            // 这里可以调用录制器的统计方法获取更详细的信息
            return {
                state: this.currentState,
                duration: this.currentDuration,
                dataSize: this._audioRecorder.getStats ? this._audioRecorder.getStats().dataSize : 0,
                waveEnabled: this.config.enableWave,
                realtime: this.config.realtime
            }
        },

        /**
         * 下载录制文件
         */
        downloadRecord(recordId: string, filename?: string) {
            const record = this.records.find(r => r.id === recordId)
            if (!record || !record.data) {
                console.warn('Record not found or no data available')
                return
            }

            try {
                const blob = record.data instanceof Blob ? record.data : new Blob([record.data])
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename || `${record.name || 'recording'}.${this.config.format}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            } catch (error) {
                console.error('Failed to download record:', error)
                this.setError(`下载录制文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
            }
        },

        /**
         * 发送录制数据到 API
         */
        async sendStreamData(data: ArrayBuffer) {
            // 使用 window.$emit 发送流数据事件
            if (window.$emit) {
                window.$emit('recorder:stream-data', data)
            } else {
                console.warn('window.$emit 未定义，无法发送流数据事件')
            }
        },

        /**
         * 触发流数据事件
         */
        emitStreamData(data: ArrayBuffer) {
            this.sendStreamData(data)
        },
        destroyRecorder() {
            this.cleanup()
            this._audioRecorder = null
        }
    }
})

// 导出类型
// export type { RecorderStore } from './types'