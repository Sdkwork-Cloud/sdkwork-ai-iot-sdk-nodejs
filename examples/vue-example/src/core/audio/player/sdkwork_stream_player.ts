import { AudioPlayerState, IStreamAudioPlayer, AudioPlayerEvents, AutoplayStatus, AutoplayPermissionResult } from './types';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/pcm';
import 'recorder-core/src/extensions/buffer_stream.player';
import mitt from 'mitt';
import { MediaPermissionUtils, MediaType } from '../../media/permission/MediaPermissionUtils';

// 播放器配置接口
export interface StreamPlayerConfig {
  /** 是否解码音频数据，默认false（直接播放PCM数据） */
  decode?: boolean;
  /** 音频采样率，默认16000 */
  sampleRate?: number;
  /** 是否实时模式，默认false */
  realtime?: boolean;
  /** 最大延迟时间（毫秒），默认800 */
  maxDelay?: number;
  /** 是否丢弃所有延迟数据，默认false */
  discardAll?: boolean;
  /** 流量图片URL，默认空字符串 */
  trafficImgUrl?: string;
  /** 音频通道数，默认1 */
  channels?: number;
}

// 定义事件类型
type StreamAudioEvents = {
  onPlay: null;
  onPause: null;
  onStop: null;
  onEnd: null;
  onError: Error;
  onVolumeChange: number;
  onStateChange: { oldState: AudioPlayerState; newState: AudioPlayerState };
  onAutoplayBlocked: AutoplayPermissionResult;
  onAutoplayStatusChange: AutoplayPermissionResult;
};

/**
 * Sdkwork流式音频播放器
 * 基于recorder-core的BufferStreamPlayer实现流式播放
 * 使用mitt事件库管理事件
 */
export class SdkworkStreamAudioPlayer implements IStreamAudioPlayer {
  private player: any = null;
  private state: AudioPlayerState = AudioPlayerState.IDLE;
  private volume: number = 1.0;
  // 使用mitt事件发射器
  private emitter = mitt<StreamAudioEvents>();
  private autoplayStatus: AutoplayStatus = AutoplayStatus.UNKNOWN;
  private pendingPlayPromise: Promise<void> | null = null;
  private pendingPlayResolve: (() => void) | null = null;
  private pendingPlayReject: ((error: Error) => void) | null = null;
  // 播放器配置（统一管理所有配置参数）
  private config: Required<StreamPlayerConfig>;

  /**
   * 构造函数
   * @param config 播放器配置选项
   */
  constructor(config?: StreamPlayerConfig) {
    // 设置默认配置
    this.config = {
      decode: false,
      sampleRate: 16000,
      realtime: false,
      maxDelay: 800,
      discardAll: false,
      trafficImgUrl: '',
      channels: 1,
      ...config
    }; 

    this.initPlayer();

    // 检测自动播放支持
    this.detectAutoplaySupport();

    // 监听自动播放状态变化
    MediaPermissionUtils.getInstance().onStatusChange(MediaType.AUDIO, this.handleAutoplayStatusChange.bind(this));
  }

  /**
   * 初始化播放器
   */
  private initPlayer(): void {
    if (!Recorder.BufferStreamPlayer) {
      console.error('缺少BufferStreamPlayer扩展文件，请确保已导入 recorder-core/src/extensions/buffer_stream.player');
      return;
    }

    try {
      Recorder.TrafficImgUrl = this.config.trafficImgUrl;
      this.player = Recorder.BufferStreamPlayer({
        decode: this.config.decode,
        sampleRate: this.config.sampleRate,
        realtime: this.config.realtime,
        maxDelay: this.config.maxDelay,
        discardAll: this.config.discardAll,
        TrafficImgUrl: this.config.trafficImgUrl,
        onInputError: (errMsg: string, inputIndex: number) => {
          console.error(`第${inputIndex}次的音频片段输入出错: ${errMsg}`);
          this.emitter.emit('onError', new Error(`音频片段输入出错: ${errMsg}`));
        },
        onPlayEnd: () => {
          console.log('音频播放结束');
          this.setState(AudioPlayerState.ENDED);
          this.emitter.emit('onEnd', null);
        }
      });
      console.log('流式音频播放器实例已创建，配置:', this.config);
    } catch (error) {
      console.error('流式音频播放器初始化失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 检测浏览器自动播放支持
   * @param forceCheck 是否强制重新检测
   * @returns 自动播放权限结果
   */
  async detectAutoplaySupport(forceCheck: boolean = false): Promise<AutoplayPermissionResult> {
    const result = await MediaPermissionUtils.getInstance().detectMediaSupport(MediaType.AUDIO, forceCheck);
    this.autoplayStatus = result.status;
    return result;
  }

  /**
   * 请求自动播放权限
   * @param muted 是否以静音模式请求
   * @returns 自动播放权限结果
   */
  async requestAutoplayPermission(muted: boolean = false): Promise<AutoplayPermissionResult> {
    const result = await MediaPermissionUtils.getInstance().requestPermission(MediaType.AUDIO, muted);
    this.autoplayStatus = result.status;
    return result;
  }

  /**
   * 处理自动播放状态变更
   * @param result 自动播放权限结果
   */
  private handleAutoplayStatusChange(result: AutoplayPermissionResult): void {
    this.autoplayStatus = result.status;
    this.emitter.emit('onAutoplayStatusChange', result);
  }

  /**
   * 开始实时音频流播放
   * @param sampleRate - 音频采样率（默认：使用配置中的sampleRate）
   * @param channels - 音频通道数（默认：使用配置中的channels）
   */
  async startStream(sampleRate?: number, channels?: number): Promise<void> {
    // 如果提供了参数，则更新配置
    if (sampleRate !== undefined) {
      this.config.sampleRate = sampleRate;
    }
    if (channels !== undefined) {
      this.config.channels = channels;
    }
    
    if (!this.player) {
      this.initPlayer();
      if (!this.player) {
        throw new Error('流式音频播放器初始化失败');
      }
    }

    // 如果播放器已经启动，先停止并重置状态
    if (this.state !== AudioPlayerState.IDLE && this.state !== AudioPlayerState.ERROR) {
      await this.stopStream();
    }

    // 如果未检测自动播放状态，先检测
    if (this.autoplayStatus === AutoplayStatus.UNKNOWN) {
      await this.detectAutoplaySupport();
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // 根据自动播放状态处理
        if (this.autoplayStatus === AutoplayStatus.ALLOWED) {
          // 完全支持自动播放
          this.player.start(() => {
            console.log('流式音频播放器已启动');
            this.setState(AudioPlayerState.READY);
            this.emitter.emit('onPlay', null);
            resolve();
          }, (err: string) => {
            console.error('流式音频播放器启动失败:', err);
            this.setState(AudioPlayerState.ERROR);
            this.emitter.emit('onError', new Error(err));
            reject(new Error(err));
          });
        } else if (this.autoplayStatus === AutoplayStatus.ALLOWED_MUTED) {
          // 支持静音自动播放
          const originalVolume = this.volume;
          this.setVolume(0);

          this.player.start(() => {
            console.log('流式音频播放器已启动(静音模式)');
            this.setState(AudioPlayerState.READY);
            this.emitter.emit('onPlay', null);

            // 监听用户交互事件，在用户交互后恢复音量
            const userInteractionHandler = () => {
              this.setVolume(originalVolume);
              document.removeEventListener('click', userInteractionHandler);
              document.removeEventListener('touchstart', userInteractionHandler);
              document.removeEventListener('keydown', userInteractionHandler);
            };

            document.addEventListener('click', userInteractionHandler);
            document.addEventListener('touchstart', userInteractionHandler);
            document.addEventListener('keydown', userInteractionHandler);

            resolve();
          }, (err: string) => {
            console.error('流式音频播放器启动失败:', err);
            this.setState(AudioPlayerState.ERROR);
            this.emitter.emit('onError', new Error(err));
            reject(new Error(err));
          });
        } else {
          // 不支持自动播放，需要用户交互
          const result: AutoplayPermissionResult = {
            status: this.autoplayStatus,
            requiresUserInteraction: true,
            requiresMuted: false
          };

          // 设置等待用户交互状态
          this.setState(AudioPlayerState.WAITING_FOR_INTERACTION);
          
          // 触发自动播放受阻事件
          this.emitter.emit('onAutoplayBlocked', result);

          // 创建一个待处理的播放Promise
          this.pendingPlayPromise = new Promise<void>((playResolve, playReject) => {
            this.pendingPlayResolve = playResolve;
            this.pendingPlayReject = playReject;
          });

          // 将当前的resolve和reject保存，以便在用户交互后调用
          const currentResolve = resolve;
          const currentReject = reject;

          // 当pendingPlayPromise解决时，解决当前Promise
          this.pendingPlayPromise.then(() => {
            currentResolve();
          }).catch((error) => {
            currentReject(error);
          });
        }
      } catch (error) {
        console.error('启动流式音频播放器失败:', error);
        this.setState(AudioPlayerState.ERROR);
        this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
        reject(error);
      }
    });
  }

  /**
    * 用户交互后恢复播放
    * 在用户点击播放按钮等交互后调用
    */
  async resumeAfterInteraction(): Promise<void> {
    try {
      if (!this.player) {
        throw new Error('流式音频播放器未初始化');
      }

      // 只有在等待用户交互状态时才允许恢复
      if (this.state !== AudioPlayerState.WAITING_FOR_INTERACTION) {
        throw new Error('播放器不在等待用户交互状态');
      }

      // 启动播放
      this.player.start(() => {
        console.log('用户交互后流式音频播放器已启动');
        this.setState(AudioPlayerState.READY);
        this.emitter.emit('onPlay', null);

        // 如果有待处理的播放Promise，则解决它
        if (this.pendingPlayResolve) {
          this.pendingPlayResolve();
          this.pendingPlayPromise = null;
          this.pendingPlayResolve = null;
          this.pendingPlayReject = null;
        }

        // 更新自动播放状态
        this.detectAutoplaySupport(true);
      }, (err: string) => {
        console.error('用户交互后流式音频播放器启动失败:', err);
        this.setState(AudioPlayerState.ERROR);
        this.emitter.emit('onError', new Error(err));

        // 如果有待处理的播放Promise，则拒绝它
        if (this.pendingPlayReject) {
          this.pendingPlayReject(new Error(err));
          this.pendingPlayPromise = null;
          this.pendingPlayResolve = null;
          this.pendingPlayReject = null;
        }
      });
    } catch (error) {
      this.setState(AudioPlayerState.ERROR);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));

      // 如果有待处理的播放Promise，则拒绝它
      if (this.pendingPlayReject) {
        this.pendingPlayReject(error instanceof Error ? error : new Error(String(error)));
        this.pendingPlayPromise = null;
        this.pendingPlayResolve = null;
        this.pendingPlayReject = null;
      }

      throw error;
    }
  }

  /**
   * 向流中添加音频数据
   * @param data - 音频数据（多种格式）
   */
  appendStreamData(data: Float32Array | Int16Array | ArrayBuffer): void {
    if (!this.player) {
      console.warn('流式音频播放器未初始化');
      return;
    }

    if (this.state !== AudioPlayerState.READY && this.state !== AudioPlayerState.PLAYING && this.state !== AudioPlayerState.PAUSED) {
      console.warn('流式音频播放器未启动');
      return;
    }

    try {
      // 处理不同类型的数据
      if (data instanceof Float32Array) {
        // 将Float32Array转换为Int16Array
        const int16Data = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) {
          // 将-1.0到1.0的浮点数转换为-32768到32767的整数
          int16Data[i] = Math.max(-32768, Math.min(32767, Math.round(data[i] * 32767)));
        }
        this.player.input(int16Data);
      } else if (data instanceof Int16Array) {
        // 直接使用Int16Array
        this.player.input(data);
      } else if (data instanceof ArrayBuffer) {
        // 将ArrayBuffer转换为Int16Array
        this.player.input(new Int16Array(data));
      }

      // 只有在当前状态不是PLAYING时，才设置为PLAYING状态
      // 避免不必要的状态转换
      if (this.state !== AudioPlayerState.PLAYING) {
        this.setState(AudioPlayerState.PLAYING);
      }
    } catch (error) {
      console.error('音频数据处理失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 停止实时音频流播放
   */
  async stopStream(): Promise<void> {
    if (!this.player) {
      console.warn('流式音频播放器未初始化，无法停止');
      return;
    }

    try {
      // 只有在播放器已启动时才执行停止操作
      if (this.state !== AudioPlayerState.IDLE && this.state !== AudioPlayerState.ERROR) {
        if (this.player.stop) {
          this.player.stop();
        }
        this.setState(AudioPlayerState.IDLE);
        this.emitter.emit('onStop', null);
      } else {
        console.warn('流式音频播放器未启动，无需停止');
      }
    } catch (error) {
      console.error('停止流式音频播放器失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 暂停当前播放
   */
  pause(shouldClearInput?: boolean): void {
    if (!this.player) {
      console.warn('流式音频播放器未初始化，无法暂停');
      return;
    }
    
    if (this.state !== AudioPlayerState.READY && this.state !== AudioPlayerState.PLAYING && this.state !== AudioPlayerState.PAUSED) {
      console.warn('流式音频播放器未启动，无法暂停');
      return;
    }

    try {
      if (this.player.pause) {
        this.player.pause();
        this.setState(AudioPlayerState.PAUSED);
        this.emitter.emit('onPause', null);
      }
      if(shouldClearInput){
        this.clearInput()
      }
    } catch (error) {
      console.error('暂停流式音频播放器失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }
  clearInput(duration?: number): void {
    if (!this.player) {
      console.warn('流式音频播放器未初始化，无法清空输入');
      return;  
    }
    
    if (this.state !== AudioPlayerState.READY && this.state !== AudioPlayerState.PLAYING && this.state !== AudioPlayerState.PAUSED) {
      console.warn('流式音频播放器未启动，无法清空输入');
      return;
    }
    this.player.clearInput(duration)
  }

  /**
   * 恢复暂停的播放
   */
  async resume(): Promise<void> {
    if (!this.player) {
      console.warn('流式音频播放器未初始化，无法恢复');
      return;
    }
    
    if (this.state !== AudioPlayerState.READY && this.state !== AudioPlayerState.PLAYING && this.state !== AudioPlayerState.PAUSED) {
      console.warn('流式音频播放器未启动，无法恢复');
      return;
    }

    try {
      if (this.player.resume) {
        this.player.resume();
        this.setState(AudioPlayerState.PLAYING);
        this.emitter.emit('onPlay', null);
      }
    } catch (error) {
      console.error('恢复流式音频播放器失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 停止播放并重置到开始位置
   */
  stop(): void {
    this.stopStream();
  }

  /**
   * 设置音量
   * @param volume - 音量级别（0.0到1.0）
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.player && this.player.setVolume) {
      this.player.setVolume(this.volume);
      this.emitter.emit('onVolumeChange', this.volume);
    }
  }

  /**
   * 获取当前音量
   * @returns 当前音量级别
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 获取当前播放状态
   * @returns 当前播放器状态
   */
  getState(): AudioPlayerState {
    return this.state;
  } 
  /**
   * 检查播放器是否处于可播放状态
   * @returns 是否可播放
   */
  isPlayable(): boolean {
    return this.state === AudioPlayerState.READY || 
           this.state === AudioPlayerState.PLAYING || 
           this.state === AudioPlayerState.PAUSED;
  }

  /**
   * 检查播放器是否处于可重启状态
   * @returns 是否可重启
   */
  isRestartable(): boolean {
    return this.state === AudioPlayerState.PLAYING || 
           this.state === AudioPlayerState.READY || 
           this.state === AudioPlayerState.PAUSED;
  }

  /**
   * 设置播放器状态并触发状态变更事件
   * @param state - 新状态
   */
  private setState(state: AudioPlayerState): void {
    if (this.state !== state) {
      const oldState = this.state;
      this.state = state;
      this.emitter.emit('onStateChange', { oldState, newState: state });
    }
  }

  /**
   * 添加事件监听器
   * @param event - 事件名称
   * @param callback - 事件回调
   */
  on<K extends keyof AudioPlayerEvents>(event: K, callback: AudioPlayerEvents[K]): void {
    // 将AudioPlayerEvents事件映射到StreamAudioEvents
    this.emitter.on(event as unknown as keyof StreamAudioEvents, callback as any);
  }

  /**
   * 移除事件监听器
   * @param event - 事件名称
   */
  off<K extends keyof AudioPlayerEvents>(event: K): void {
    this.emitter.off(event as unknown as keyof StreamAudioEvents);
  }

  /**
   * 清理资源并停止播放
   */
  destroy(): void {
    try {
      this.stopStream();

      if (this.player && this.player.destroy) {
        this.player.destroy();
      }

      this.player = null;

      this.emitter.all.clear(); // 清除所有事件监听
      this.setState(AudioPlayerState.IDLE);
    } catch (error) {
      console.error('销毁流式音频播放器失败:', error);
    }
  }
}