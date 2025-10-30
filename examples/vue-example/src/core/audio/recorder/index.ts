/**
 * Audio Recorder Module
 * 
 * 基于 recorder-core 库的音频录制解决方案，支持文件录制和实时流式传输。
 * 提供可选的波形可视化功能，增强用户体验。
 * 
 * 核心特性：
 * - 文件录制与自动 Blob 生成
 * - 实时音频数据流式传输
 * - 多格式支持 (PCM, MP3, WAV)
 * - 可选的波形可视化 (WaveView)
 * - 浏览器兼容性检测
 * - 可配置的音频参数
 * - 完善的错误处理和状态管理
 * 
 * 使用示例：
 * ```typescript
 * // 基础录制
 * const recorder = new AudioRecorder({ sampleRate: 16000, format: 'pcm' });
 * await recorder.initialize();
 * await recorder.startRecordToFile();
 * const audioBlob = await recorder.stopRecord();
 * 
 * // 带波形显示的录制
 * const recorderWithWave = new AudioRecorder({
 *   sampleRate: 16000,
 *   waveView: { enable: true, container: '#wave-container' }
 * });
 * await recorderWithWave.initialize();
 * ```
 */

import Recorder from 'recorder-core'
import 'recorder-core/src/engine/pcm'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/extensions/waveview'

// ==================== 类型定义 ====================

/**
 * 波形可视化配置选项
 */
export interface WaveViewOptions {
  /** 是否启用波形显示 (默认: false) */
  enable?: boolean
  /** 波形图容器元素或选择器 */
  container?: HTMLElement | string
  /** 波形图宽度 (默认: 0，自动使用容器大小) */
  width?: number
  /** 波形图高度 (默认: 0，自动使用容器大小) */
  height?: number
  /** 缩放系数，应为正整数，使用2倍宽高进行绘制 (默认: 2) */
  scale?: number
  /** 移动速度系数，越大越快 (默认: 9) */
  speed?: number
  /** 相位，调整了速度后，调整这个值得到一个看起来舒服的波形 (默认: 21.8) */
  phase?: number
  /** 绘制帧率，调整后也需调整phase值 (默认: 20) */
  fps?: number
  /** 当停止了input输入时，是否保持波形，设为false停止后将变成一条线 (默认: true) */
  keep?: boolean
  /** 线条基础粗细 (默认: 3) */
  lineWidth?: number
  /** 线条渐变色1，从左到右 (默认: [0,"rgba(150,96,238,1)",0.2,"rgba(170,79,249,1)",1,"rgba(53,199,253,1)"]) */
  linear1?: any[]
  /** 线条渐变色2，从左到右 (默认: [0,"rgba(209,130,255,0.6)",1,"rgba(53,199,255,0.6)"]) */
  linear2?: any[]
  /** 背景渐变色，从上到下 (默认: [0,"rgba(255,255,255,0.2)",1,"rgba(54,197,252,0.2)"]) */
  linearBg?: any[]
}

/**
 * 音频数据处理模式
 */
export enum AudioProcessingMode {
  /** 使用 onProcess 回调处理原始音频数据 */
  ON_PROCESS = 'onProcess',
  /** 使用 takeoffEncodeChunk 回调处理编码后的音频数据 */
  TAKE_OFF_ENCODE = 'takeoffEncodeChunk'
}

/**
 * 音频录制配置选项
 */
export interface AudioRecorderOptions {
  /** 音频采样率 Hz (默认: 16000) */
  sampleRate?: number
  /** 音频比特率 kbps (默认: 128) */
  bitRate?: number
  /** 音频通道数 (默认: 1) */
  channels?: number
  /** 音频格式 (默认: 'pcm') */
  format?: 'pcm' | 'mp3' | 'wav'
  /** 波形可视化配置 */
  waveView?: WaveViewOptions
  /** 音频数据处理模式 (默认: ON_PROCESS) */
  processingMode?: AudioProcessingMode
}

/**
 * 实时音频流回调接口
 */
export interface RecordStreamCallback {
  /** 新音频数据可用时调用 */
  onData: (data: any, options?: {
    powerLevel: number; bufferDuration: number; bufferSampleRate: number; newBufferIdx: number;
  }) => void
  /** 处理 takeoffEncodeChunk 的编码数据 */
  onAppendData?: (chunkBytes: any, options?: {
    sampleRate: number; bitRate: number; format: string;
  }) => void
  /** 流式传输错误时调用 */
  onError?: (error: Error) => void
  /** 流式传输完成时调用 */
  onComplete?: () => void
}

/**
 * 录制结果对象
 */
export interface RecordResult {
  /** 录制的音频数据 Blob */
  data: Blob | ArrayBuffer
  /** 录制时长 (秒) */
  duration: number
  /** 使用的采样率 */
  sampleRate: number
  /** 文件大小 (字节) */
  size: number
}

/**
 * 录制状态枚举
 */
export enum RecordingState {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error'
}

/**
 * 录制统计信息
 */
export interface RecordingStats {
  /** 当前状态 */
  state: RecordingState
  /** 录制时长 (秒) */
  duration: number
  /** 数据大小 (字节) */
  dataSize: number
  /** 是否启用波形显示 */
  waveViewEnabled: boolean
}

/**
 * 错误类型枚举
 */
export enum AudioRecorderErrorType {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RECORDING_IN_PROGRESS = 'RECORDING_IN_PROGRESS',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  WAVEVIEW_INIT_FAILED = 'WAVEVIEW_INIT_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 自定义错误类
 */
export class AudioRecorderError extends Error {
  constructor(
    public type: AudioRecorderErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'AudioRecorderError'
  }
}

// ==================== 主类实现 ====================

/**
 * 音频录制器主类
 * 
 * 封装 recorder-core 库，提供更友好的 API，支持文件录制和实时流式传输。
 * 可选地集成波形可视化功能，增强用户体验。
 * 
 * 设计原则：
 * - 功能模块化：核心录制功能与可视化功能分离
 * - 错误隔离：waveview 错误不影响核心录制功能
 * - 向后兼容：现有 API 保持不变
 * - 易于维护：清晰的类型定义和错误处理
 */
export class AudioRecorder {
  // 核心录制组件
  private recorder: any = null
  private streamCallback: RecordStreamCallback | null = null

  // 状态管理
  private _state: RecordingState = RecordingState.IDLE
  private _startTime: number = 0
  private _dataSize: number = 0

  // 波形可视化组件
  private waveView: any = null
  private waveViewEnabled: boolean = false

  // 配置选项
  private options: Required<AudioRecorderOptions>

  /**
   * 创建音频录制器实例
   * @param options - 录制配置选项
   */
  constructor(options: AudioRecorderOptions = {}) {
    // 先标准化 waveView 配置
    const waveViewOptions = {
      enable: false,
      width: 0,
      height: 0,
      container: undefined,
      scale: 2,
      speed: 9,
      phase: 21.8,
      fps: 20,
      keep: true,
      lineWidth: 3,
      linear1: [0, "rgba(150,96,238,1)", 0.2, "rgba(170,79,249,1)", 1, "rgba(53,199,253,1)"],
      linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"],
      linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"],
      ...options.waveView
    }

    this.options = {
      sampleRate: 16000,
      bitRate: 16,
      channels: 1,
      format: 'pcm',
      processingMode: AudioProcessingMode.ON_PROCESS,
      waveView: waveViewOptions,
      ...options
    }
    this.waveViewEnabled = Boolean(this.options.waveView.enable)
    console.log('AudioRecorder initialized with waveView enabled:', this.waveViewEnabled, 'processingMode:', this.options.processingMode, 'options:', this.options.waveView)
  }

  // ==================== 私有方法 ====================

  /**
   * 安全地打开录音器，如果已打开则跳过
   * 
   * 使用 Recorder.IsOpen() 检测是否有 Recorder 已调用过 open 打开了麦克风录音功能
   * 避免重复打开麦克风资源，因为 Recorder 持有的普通麦克风录音资源是全局唯一的
   * 
   * @param onSuccess - 打开成功回调
   * @param onError - 打开失败回调
   * @returns Promise<void>
   */
  private async safeOpenRecorder(onSuccess?: () => void, onError?: (msg: string) => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // 检查是否已打开麦克风录音功能
      if (Recorder.IsOpen && Recorder.IsOpen()) {
        console.log('Recorder is already open, skipping open() call')
        onSuccess?.()
        resolve()
        return
      }

      // 检查 recorder 实例是否存在
      if (!this.recorder) {
        const errorMsg = 'Recorder instance not created'
        console.error(errorMsg)
        onError?.(errorMsg)
        reject(new AudioRecorderError(
          AudioRecorderErrorType.NOT_INITIALIZED,
          errorMsg
        ))
        return
      }

      // 未打开则调用 open()
      this.recorder.open(() => {
        console.log('Audio recorder opened successfully')
        onSuccess?.()
        resolve()
      }, (msg: string, isUserNotAllow: boolean) => {
        const errorMsg = `Failed to open recorder: ${msg}`
        console.error(errorMsg)
        onError?.(msg)
        reject(new AudioRecorderError(
          isUserNotAllow ? AudioRecorderErrorType.PERMISSION_DENIED : AudioRecorderErrorType.UNKNOWN_ERROR,
          errorMsg
        ))
      })
    })
  }

  /**
   * 安全地初始化波形可视化组件
   */
  private async initializeWaveView(): Promise<void> {
    if (!this.options.waveView.enable) {
      this.waveViewEnabled = false
      console.log('WaveView disabled by configuration')
      return
    }

    try {
      // 检查 WaveView 扩展是否可用
      if (!Recorder.WaveView) {
        console.warn('WaveView extension not available in Recorder')
        this.waveViewEnabled = false
        return
      }

      // 配置 waveview
      const container = this.resolveWaveViewContainer()
      if (!container) {
        console.warn('WaveView container not found or not specified')
        this.waveViewEnabled = false
        return
      }

      if (this.waveView) {
        console.log('WaveView already initialized')
        return
      }

      // 创建 waveview 实例并传入完整配置
      const waveViewConfig = {
        elem: container,
        width: this.options.waveView.width,
        height: this.options.waveView.height,
        scale: this.options.waveView.scale,
        speed: this.options.waveView.speed,
        phase: this.options.waveView.phase,
        fps: this.options.waveView.fps,
        keep: this.options.waveView.keep,
        lineWidth: this.options.waveView.lineWidth,
        linear1: this.options.waveView.linear1,
        linear2: this.options.waveView.linear2,
        linearBg: this.options.waveView.linearBg
      }

      // 过滤掉未定义的配置项
      const filteredConfig = Object.fromEntries(
        Object.entries(waveViewConfig).filter(([_, value]) => value !== undefined)
      )

      this.waveView = Recorder.WaveView(filteredConfig)
      this.waveViewEnabled = true

      console.log('WaveView initialized successfully with config:', filteredConfig)

    } catch (error) {
      console.warn('WaveView initialization failed, visualization disabled:', error)
      this.waveViewEnabled = false
    }
  }

  /**
   * 解析波形图容器元素
   */
  private resolveWaveViewContainer(): HTMLElement | null {
    const { container } = this.options.waveView

    if (!container) {
      console.warn('WaveView container not specified')
      return null
    }

    if (typeof container === 'string') {
      return document.querySelector(container) as HTMLElement
    }

    return container
  }

  /**
   * 安全地更新波形显示
   */
  private safeUpdateWaveView(buffers: any[], powerLevel: number, bufferDuration: number, bufferSampleRate: number): void {
    if (this.waveViewEnabled && this.waveView && buffers && buffers.length > 0) {
      try {
        // 打印波形更新日志
        // console.log(`WaveView updating: buffers=${buffers.length}, powerLevel=${powerLevel.toFixed(2)}, sampleRate=${bufferSampleRate}`)

        // 使用最后一个缓冲区的数据和正确的参数调用 input 方法
        const lastBuffer = buffers[buffers.length - 1]
        if (lastBuffer && lastBuffer.length > 0) {
          this.waveView.input(lastBuffer, powerLevel, bufferSampleRate)

          // 打印更新成功日志
          // console.log('WaveView updated successfully')
        } else {
          // console.log('WaveView update skipped: empty buffer')
        }
      } catch (error) {
        console.warn('WaveView update error:', error)
      }
    } else {
      // 打印波形显示未启用的日志
      if (this.waveView) {
        console.log('WaveView not enabled:', this.waveViewEnabled, this.waveView)
      }

    }
  }

  /**
   * 处理音频数据流
   */
  private processAudioData(buffers: any[], powerLevel: number, bufferDuration: number, bufferSampleRate: number, newBufferIdx: number, asyncEnd: boolean): void {
    // 检查数据有效性
    if (!buffers || buffers.length === 0) {
      return
    }

    // 更新波形显示
    this.safeUpdateWaveView(buffers, powerLevel, bufferDuration, bufferSampleRate)

    // 处理流式音频数据
    if (this.streamCallback) {
      try {
        const pcmData = this.buffersToArrayBuffer(buffers)
        this._dataSize += pcmData.byteLength
        const options = {
          powerLevel, bufferDuration, bufferSampleRate,
          newBufferIdx, asyncEnd
        }
        this.streamCallback.onData(buffers, options)
      } catch (error) {
        this.streamCallback.onError?.(
          new AudioRecorderError(
            AudioRecorderErrorType.UNKNOWN_ERROR,
            `Audio data processing failed: ${error}`,
            error instanceof Error ? error : undefined
          )
        )
      }
    }
  }

  // ==================== 公共方法 ====================

  /**
   * 初始化音频录制器并请求麦克风权限
   * 
   * 执行步骤：
   * 1. 检查当前状态
   * 2. 初始化波形可视化组件（如果启用）
   * 3. 创建 recorder-core 实例
   * 4. 请求麦克风权限
   * 5. 更新状态
   * 
   * @throws {AudioRecorderError} 初始化失败或权限被拒绝
   */
  async initialize(): Promise<void> {
    if (this._state !== RecordingState.IDLE) {
      throw new AudioRecorderError(
        AudioRecorderErrorType.INITIALIZATION_FAILED,
        `Cannot initialize in ${this._state} state`
      )
    }

    this._state = RecordingState.INITIALIZING

    try {
      // 初始化波形可视化
      await this.initializeWaveView()
      Recorder.TrafficImgUrl = ''
      // 创建 recorder-core 实例，根据配置决定使用 onProcess 还是 takeoffEncodeChunk
      const recorderConfig: any = {
        type: this.options.format,
        sampleRate: this.options.sampleRate,
        bitRate: this.options.bitRate,
        TrafficImgUrl: ''
      }

      // 根据 processingMode 配置决定使用哪种回调
      if (this.options.processingMode === AudioProcessingMode.ON_PROCESS) {
        // 使用 onProcess 处理原始音频数据
        recorderConfig.onProcess = (buffers: any[], powerLevel: number, bufferDuration: number, bufferSampleRate: number, newBufferIdx: number, asyncEnd: any) => {
          this.processAudioData(buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd)
        }
        console.log('AudioRecorder using ON_PROCESS mode for audio data processing')
      } else if (this.options.processingMode === AudioProcessingMode.TAKE_OFF_ENCODE) {
        // 使用 takeoffEncodeChunk 处理编码后的音频数据
        recorderConfig.takeoffEncodeChunk = (chunkBytes: any) => {
          console.log("接管实时转码，推入实时处理", chunkBytes);
          
          // 如果有流式回调并且定义了 onAppendData 方法，则调用它
          if (this.streamCallback && this.streamCallback.onAppendData) {
            try {
              this.streamCallback.onAppendData(chunkBytes, {
                sampleRate: this.options.sampleRate,
                bitRate: this.options.bitRate,
                format: this.options.format
              });
            } catch (error) {
              console.error('Error in onAppendData callback:', error);
              this.streamCallback.onError?.(new AudioRecorderError(
                AudioRecorderErrorType.UNKNOWN_ERROR,
                `onAppendData callback failed: ${error}`,
                error instanceof Error ? error : undefined
              ));
            }
          }
        }
        console.log('AudioRecorder using TAKE_OFF_ENCODE mode for audio data processing')
      }

      this.recorder = Recorder(recorderConfig)

      // 请求麦克风权限
      await this.safeOpenRecorder(
        () => {
          console.log('Audio recorder initialized successfully')
          this._state = RecordingState.IDLE
        },
        (msg: string) => {
          throw new AudioRecorderError(
            AudioRecorderErrorType.INITIALIZATION_FAILED,
            msg
          )
        }
      )

    } catch (error) {
      this._state = RecordingState.ERROR

      if (error instanceof AudioRecorderError) {
        throw error
      }

      throw new AudioRecorderError(
        AudioRecorderErrorType.INITIALIZATION_FAILED,
        `Audio recorder initialization failed: ${error}`,
        error instanceof Error ? error : undefined
      )
    }
  }

  /**
   * 开始文件录制
   * 
   * 验证步骤：
   * 1. 检查录制器是否已初始化
   * 2. 检查是否已有录制在进行中
   * 3. 重置数据统计
   * 4. 打开录制器
   * 5. 开始录制
   * 
   * @throws {AudioRecorderError} 录制器未初始化或已有录制在进行中
   */
  async startRecordToFile(): Promise<void> {
    this.validateRecorderInitialized()
    this.validateNotRecording()

    this._state = RecordingState.RECORDING
    this._startTime = Date.now()
    this._dataSize = 0

    // 先调用 open() 再调用 start()
    await this.safeOpenRecorder(
      () => {
        this.recorder.start()
      },
      (msg: string) => {
        throw new AudioRecorderError(
          AudioRecorderErrorType.UNKNOWN_ERROR,
          `Failed to open recorder: ${msg}`
        )
      }
    )
  }

  /**
   * 开始实时音频流录制
   * 
   * 与文件录制类似，但音频数据通过回调实时传输
   * 
   * @param callback - 音频数据回调接口
   * @throws {AudioRecorderError} 录制器未初始化或已有录制在进行中
   */
  async startRecordStream(callback: RecordStreamCallback): Promise<void> {
    this.validateRecorderInitialized()
    this.validateNotRecording()

    this.streamCallback = callback
    this._state = RecordingState.RECORDING
    this._startTime = Date.now()
    this._dataSize = 0
    this.initializeWaveView()

    // 先调用 open() 再调用 start()
    await this.safeOpenRecorder(
      () => {
        this.recorder.start()
      },
      (msg: string) => {
        throw new AudioRecorderError(
          AudioRecorderErrorType.UNKNOWN_ERROR,
          `Failed to open recorder: ${msg}`
        )
      }
    )
  }

  /**
   * 停止当前录制会话
   * 
   * 处理步骤：
   * 1. 验证录制状态
   * 2. 停止录制
   * 3. 处理流式回调完成
   * 4. 返回录制的音频数据
   * 5. 重置状态
   * 
   * @returns 录制的音频数据 Blob 和时长 (文件模式) 或 null (流模式)
   */
  async stopRecord(): Promise<{ data: Blob | ArrayBuffer | null; duration: number }> {
    if (this._state !== RecordingState.RECORDING || !this.recorder) {
      return { data: null, duration: 0 }
    }

    this._state = RecordingState.STOPPED

    // 处理流式录制完成
    if (this.streamCallback) {
      return new Promise<{ data: Blob | ArrayBuffer | null; duration: number }>((resolve) => {
        this.recorder.stop((data: Blob | ArrayBuffer, duration: number) => {
          // 流式录制模式下，返回时长和可能的数据
          console.log('Stream recording stopped, duration:', duration)
          this.streamCallback?.onComplete?.()
          this.streamCallback = null
          resolve({ data: data || null, duration })
        }, (msg: string) => {
          console.error('Stream recording stop failed:', msg)
          this.streamCallback?.onComplete?.()
          this.streamCallback = null
          resolve({ data: null, duration: this.getRecordDuration() })
        })
      })
    }

    // 返回文件录制的音频数据
    return new Promise<{ data: Blob | ArrayBuffer | null; duration: number }>((resolve, reject) => {
      this.recorder.stop((data: Blob | ArrayBuffer, duration: number) => {
        // 通过回调参数获取录制的音频数据和时长
        if (data) {
          resolve({ data: data, duration })
        } else {
          reject(new AudioRecorderError(
            AudioRecorderErrorType.UNKNOWN_ERROR,
            'Failed to get audio data'
          ))
        }
      }, (msg: string) => {
        reject(new AudioRecorderError(
          AudioRecorderErrorType.UNKNOWN_ERROR,
          `Stop recording failed: ${msg}`
        ))
      })
    })
  }

  /**
   * 暂停当前录制会话
   */
  pauseRecord(): void {
    if (this._state === RecordingState.RECORDING && this.recorder) {
      this._state = RecordingState.PAUSED
      this.recorder.pause()
    }
  }

  /**
   * 恢复暂停的录制会话
   */
  resumeRecord(): void {
    if (this._state === RecordingState.PAUSED && this.recorder) {
      this._state = RecordingState.RECORDING
      this.recorder.resume()
    }
  }

  /**
   * 销毁录制器并释放所有资源
   * 
   * 执行步骤：
   * 1. 停止当前录制（如果正在进行）
   * 2. 关闭录制器实例
   * 3. 清理波形显示组件
   * 4. 调用 Recorder.Destroy() 释放全局资源（AudioContext、Worker）
   * 5. 重置所有状态
   * 
   * 注意：当要彻底移除 Recorder 时需要显式的调用此方法。
   * 大部分情况下不调用 Destroy 也不会造成问题。
   */
  destroy(): void {
    // 停止录制
    if (this._state === RecordingState.RECORDING && this.recorder) {
      this.recorder.stop()
    }

    // 关闭录制器
    if (this.recorder) {
      this.recorder.close()
      this.recorder = null
    }

    // 清理波形显示
    if (this.waveView) {
      try {
        this.waveView.close?.()
      } catch (error) {
        console.warn('Error closing wave view:', error)
      }
      this.waveView = null
    }

    // 调用 Recorder.Destroy() 释放全局资源（AudioContext、Worker）
    if (typeof Recorder !== 'undefined' && Recorder.Destroy) {
      try {
        Recorder.Destroy()
        console.log('Recorder global resources destroyed successfully')
      } catch (error) {
        console.warn('Error destroying Recorder global resources:', error)
      }
    }

    // 重置状态
    this._state = RecordingState.IDLE
    this.streamCallback = null
    this._startTime = 0
    this._dataSize = 0
    this.waveViewEnabled = false
  }

  // ==================== 状态验证方法 ====================

  /**
   * 验证录制器是否已初始化
   * @throws {AudioRecorderError} 录制器未初始化
   */
  private validateRecorderInitialized(): void {
    if (!this.recorder) {
      throw new AudioRecorderError(
        AudioRecorderErrorType.NOT_INITIALIZED,
        'Audio recorder not initialized. Call initialize() first.'
      )
    }
  }

  /**
   * 验证当前没有录制在进行中
   * @throws {AudioRecorderError} 已有录制在进行中
   */
  private validateNotRecording(): void {
    if (this._state === RecordingState.RECORDING) {
      throw new AudioRecorderError(
        AudioRecorderErrorType.RECORDING_IN_PROGRESS,
        'Recording already in progress'
      )
    }
  }

  // ==================== 状态查询方法 ====================

  /**
   * 获取当前录制状态
   */
  getRecordingState(): boolean {
    return this._state === RecordingState.RECORDING
  }

  /**
   * 获取详细的录制状态
   */
  getState(): RecordingState {
    return this._state
  }

  /**
   * 获取录制统计信息
   */
  getStats(): RecordingStats {
    return {
      state: this._state,
      duration: this.getRecordDuration(),
      dataSize: this._dataSize,
      waveViewEnabled: this.waveViewEnabled,
    }
  }
  /**
   * 检查波形显示是否启用
   */
  isWaveViewEnabled(): boolean {
    return this.waveViewEnabled
  }

  /**
   * 动态启用/禁用波形显示
   * @param enable - 是否启用
   */
  async toggleWaveView(enable: boolean): Promise<boolean> {
    if (enable === this.waveViewEnabled) {
      return this.waveViewEnabled
    }

    if (enable) {
      // 启用波形显示
      await this.initializeWaveView()
    } else {
      // 禁用波形显示
      if (this.waveView) {
        try {
          this.waveView.close?.()
        } catch (error) {
          console.warn('Error closing wave view:', error)
        }
        this.waveView = null
      }
      this.waveViewEnabled = false
    }

    return this.waveViewEnabled
  }

  // ==================== 工具方法 ====================

  /**
   * 将音频缓冲区转换为 ArrayBuffer 用于流式传输
   * 
   * 音频处理流程：
   * - 输入：recorder-core 的浮点音频缓冲区数组
   * - 输出：包含 16 位 PCM 数据的单个 ArrayBuffer
   * - 使用小端字节序以确保兼容性
   * - 处理样本归一化和转换
   * 
   * @param buffers - recorder-core 的音频缓冲区数组
   * @returns 转换后的 PCM 音频数据
   */
  private buffersToArrayBuffer(buffers: any[]): ArrayBuffer {
    // 计算总缓冲区长度
    let totalLength = 0
    for (const buffer of buffers) {
      totalLength += buffer.length
    }

    // 创建 ArrayBuffer 并填充数据 (16 位 PCM)
    const arrayBuffer = new ArrayBuffer(totalLength * 2) // 16 位 PCM
    const view = new DataView(arrayBuffer)
    let offset = 0

    for (const buffer of buffers) {
      for (let i = 0; i < buffer.length; i++) {
        // 将浮点样本转换为 16 位整数
        const sample = Math.max(-1, Math.min(1, buffer[i]))
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
        view.setInt16(offset, intSample, true) // 小端字节序
        offset += 2
      }
    }

    return arrayBuffer
  }

  /**
   * 获取当前录制会话的时长
   * 
   * 如果录制器未初始化或未在录制中，返回 0
   * 
   * @returns 录制时长（秒）
   */
  getRecordDuration(): number {
    if (!this.recorder) return 0

    // 如果正在录制，计算精确时长
    if (this._state === RecordingState.RECORDING && this._startTime > 0) {
      return (Date.now() - this._startTime) / 1000
    }

    return this.recorder.duration || 0
  }

  // ==================== 遗留接口（向后兼容） ====================

  /**
   * 遗留接口方法：开始录制（文件模式）
   * 
   * 为使用 start()/stop() 模式的旧代码提供向后兼容性
   */
  async start(): Promise<void> {
    return this.startRecordToFile()
  }

  /**
   * 遗留接口方法：停止录制
   * 
   * 提供向后兼容性并返回增强的 RecordResult 对象
   * 
   * @throws {AudioRecorderError} 如果没有录制数据可用
   */
  async stop(): Promise<RecordResult> {
    const result = await this.stopRecord()
    if (!result) {
      throw new AudioRecorderError(
        AudioRecorderErrorType.UNKNOWN_ERROR,
        'No recording data available'
      )
    }
    const data: Blob | ArrayBuffer = result.data as Blob | ArrayBuffer
    return {
      data: data,
      duration: result.duration,
      sampleRate: this.options.sampleRate,
      size: data instanceof Blob ? data.size : data?.byteLength
    }
  }

  /**
   * 遗留接口方法：检查录制状态
   */
  isRecording(): boolean {
    return this.getRecordingState()
  }

  /**
   * 遗留接口方法：资源清理
   * 
   * destroy() 方法的别名
   */
  dispose(): void {
    this.destroy()
  }
}

// ==================== 工具函数 ====================

/**
 * 检查浏览器是否支持音频录制功能
 * 
 * 验证以下内容：
 * - navigator.mediaDevices API 是否可用
 * - getUserMedia 方法是否支持麦克风访问
 * - 浏览器是否具有必要的 Web Audio API 支持
 * - Recorder.Support() 静态方法检测
 * 
 * 注意：仅仅是检测浏览器支持情况，不会判断和调起用户授权
 * （rec.open()会判断用户授权），不会判断是否支持特定格式录音。
 * 
 * @returns 如果支持音频录制则返回 true，否则返回 false
 */
export function isRecordingSupported(): boolean {
  // 基础浏览器 API 支持检测
  const basicSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

  // Recorder.Support() 检测（如果可用）
  const recorderSupport = typeof Recorder !== 'undefined' && Recorder.Support && Recorder.Support()

  // 返回综合检测结果
  return basicSupport && (recorderSupport !== false)
}

/**
 * 创建 AudioRecorder 实例的工厂函数
 * 
 * 提供一种便捷的方式来创建 AudioRecorder 实例
 * 
 * @param options - 可选的音频录制配置
 * @returns 新的 AudioRecorder 实例
 */
export function createAudioRecorder(options?: AudioRecorderOptions): AudioRecorder {
  return new AudioRecorder(options)
}

/**
 * 返回支持的音频格式列表
 * 
 * 这些格式通过 recorder-core 引擎支持：
 * - PCM: 原始脉冲编码调制（未压缩）
 * - MP3: MPEG-1 音频层 III（压缩）
 * - WAV: 波形音频文件格式（未压缩）
 * 
 * @returns 支持的音频格式名称数组
 */
export function getSupportedFormats(): string[] {
  return ['pcm', 'mp3', 'wav']
}

/**
 * 返回默认的音频录制选项
 * 
 * 默认配置：
 * - 采样率：16000 Hz（语音识别最佳）
 * - 比特率：128 kbps（大多数应用的良好质量）
 * - 通道数：1（单声道音频）
 * - 格式：PCM（未压缩，实时处理最佳）
 * - 处理模式：ON_PROCESS（处理原始音频数据）
 * 
 * @returns 默认录制配置
 */
export function getDefaultOptions(): AudioRecorderOptions {
  return {
    sampleRate: 16000,
    bitRate: 16,
    channels: 1,
    format: 'pcm',
    processingMode: AudioProcessingMode.ON_PROCESS
  }
}

/**
 * 返回默认的波形显示选项
 * 
 * 默认配置：
 * - 宽度：300px
 * - 高度：100px
 * - 线条宽度：2px
 * - 线条颜色：'#409EFF'
 * - 背景颜色：'transparent'
 * 
 * @returns 默认波形显示配置
 */
export function getDefaultWaveViewOptions(): WaveViewOptions {
  return {
    enable: false,
    width: 300,
    height: 100,
    lineWidth: 2,
  }
}

/**
 * 验证录制配置选项
 * 
 * 检查配置选项是否有效，包括：
 * - 采样率是否在有效范围内
 * - 比特率是否合理
 * - 格式是否受支持
 * 
 * @param options - 要验证的配置选项
 * @returns 验证结果，包含错误信息（如果有）
 */
export function validateOptions(options: AudioRecorderOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (options.sampleRate && (options.sampleRate < 8000 || options.sampleRate > 48000)) {
    errors.push('Sample rate must be between 8000 and 48000 Hz')
  }

  if (options.bitRate && (options.bitRate < 32 || options.bitRate > 320)) {
    errors.push('Bit rate must be between 32 and 320 kbps')
  }

  if (options.format && !getSupportedFormats().includes(options.format)) {
    errors.push(`Format '${options.format}' is not supported. Supported formats: ${getSupportedFormats().join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}