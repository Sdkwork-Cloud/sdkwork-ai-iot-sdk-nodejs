import { AudioPlayerState, IStreamAudioPlayer, AudioPlayerEvents, AutoplayStatus, AutoplayPermissionResult } from './types';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/pcm';
import 'recorder-core/src/extensions/buffer_stream.player';
import mitt from 'mitt';
import { MediaPermissionUtils, MediaType } from '../../media/permission/MediaPermissionUtils';

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
  private sampleRate: number = 16000;
  private channels: number = 1;
  private isPlayerStarted: boolean = false;
  // 使用mitt事件发射器
  private emitter = mitt<StreamAudioEvents>();
  private autoplayStatus: AutoplayStatus = AutoplayStatus.UNKNOWN;
  private pendingPlayPromise: Promise<void> | null = null;
  private pendingPlayResolve: (() => void) | null = null;
  private pendingPlayReject: ((error: Error) => void) | null = null;

  /**
   * 构造函数
   */
  constructor() {
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
      this.player = Recorder.BufferStreamPlayer({
        decode: false,
        sampleRate: this.sampleRate,
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
      console.log('流式音频播放器实例已创建');
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
   * @param sampleRate - 音频采样率（默认：16000）
   * @param channels - 音频通道数（默认：1）
   */
  async startStream(sampleRate: number = 16000, channels: number = 1): Promise<void> {
    if (!this.player) {
      this.initPlayer();
      if (!this.player) {
        throw new Error('流式音频播放器初始化失败');
      }
    }

    this.sampleRate = sampleRate;
    this.channels = channels;

    // 如果播放器已经启动，先停止
    if (this.isPlayerStarted) {
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
            this.isPlayerStarted = true;
            this.setState(AudioPlayerState.READY);
            this.emitter.emit('onPlay', null);
            resolve();
          }, (err: string) => {
            console.error('流式音频播放器启动失败:', err);
            this.isPlayerStarted = false;
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
            this.isPlayerStarted = true;
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
            this.isPlayerStarted = false;
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
        this.isPlayerStarted = false;
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
       
       // 启动播放
       this.player.start(() => {
         console.log('用户交互后流式音频播放器已启动');
         this.isPlayerStarted = true;
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
         this.isPlayerStarted = false;
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

    if (!this.isPlayerStarted) {
      console.warn('流式音频播放器未启动');
      return;
    }

    try {
      // 如果当前状态是暂停，自动恢复播放
      if (this.state === AudioPlayerState.PAUSED) {
        this.setState(AudioPlayerState.PLAYING);
        this.emitter.emit('onPlay', null);
      }

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

      // 如果当前状态不是播放中，设置为播放中
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
      return;
    }

    try {
      if (this.player.stop) {
        this.player.stop();
      }
      this.isPlayerStarted = false;
      this.setState(AudioPlayerState.IDLE);
      this.emitter.emit('onStop', null);
    } catch (error) {
      console.error('停止流式音频播放器失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 暂停当前播放
   */
  pause(): void {
    if (!this.player || !this.isPlayerStarted) {
      return;
    }

    try {
      if (this.player.pause) {
        this.player.pause();
        this.setState(AudioPlayerState.PAUSED);
        this.emitter.emit('onPause', null);
      }
    } catch (error) {
      console.error('暂停流式音频播放器失败:', error);
      this.emitter.emit('onError', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 恢复暂停的播放
   */
  async resume(): Promise<void> {
    if (!this.player || !this.isPlayerStarted) {
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
      this.isPlayerStarted = false;
      this.emitter.all.clear(); // 清除所有事件监听
      this.setState(AudioPlayerState.IDLE);
    } catch (error) {
      console.error('销毁流式音频播放器失败:', error);
    }
  }
}