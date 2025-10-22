import { AutoplayStatus } from '@/core/audio/player/types';

/**
 * 媒体类型枚举
 */
export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video'
}

/**
 * 媒体权限检测结果
 */
export interface MediaPermissionResult {
  /** 自动播放状态 */
  status: AutoplayStatus;
  /** 是否支持自动播放 */
  canAutoplay: boolean;
  /** 是否需要用户交互 */
  requiresUserInteraction: boolean;
  /** 是否需要静音播放 */
  requiresMuted: boolean;
  /** 错误信息（如果有） */
  error?: Error;
}

/**
 * 媒体权限检测工具类
 * 处理浏览器自动播放策略和权限检测
 */
export class MediaPermissionUtils {
  private static instance: MediaPermissionUtils;
  private statusChangeCallbacks: Map<MediaType, ((result: MediaPermissionResult) => void)[]> = new Map();
  private lastDetectionResults: Map<MediaType, MediaPermissionResult> = new Map();
  private userInteractionDetected: boolean = false;

  /**
   * 获取单例实例
   */
  public static getInstance(): MediaPermissionUtils {
    if (!MediaPermissionUtils.instance) {
      MediaPermissionUtils.instance = new MediaPermissionUtils();
      MediaPermissionUtils.instance.setupUserInteractionListeners();
    }
    return MediaPermissionUtils.instance;
  }

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor() {}

  /**
   * 设置用户交互监听器
   */
  private setupUserInteractionListeners(): void {
    const handleUserInteraction = () => {
      if (!this.userInteractionDetected) {
        this.userInteractionDetected = true;
        this.notifyUserInteractionDetected();
      }
    };

    // 监听各种用户交互事件
    document.addEventListener('click', handleUserInteraction, { once: true, capture: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true, capture: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true, capture: true });
    document.addEventListener('mousedown', handleUserInteraction, { once: true, capture: true });
  }

  /**
   * 检测媒体支持情况
   * @param mediaType 媒体类型
   * @param forceCheck 是否强制重新检测
   * @returns 媒体权限检测结果
   */
  public async detectMediaSupport(mediaType: MediaType, forceCheck: boolean = false): Promise<MediaPermissionResult> {
    // 如果已经检测过且不强制重新检测，则返回缓存结果
    const cachedResult = this.lastDetectionResults.get(mediaType);
    if (cachedResult && !forceCheck) {
      return cachedResult;
    }

    let result: MediaPermissionResult;

    try {
      if (mediaType === MediaType.AUDIO) {
        result = await this.detectAudioSupport();
      } else {
        result = await this.detectVideoSupport();
      }
    } catch (error) {
      result = {
        status: AutoplayStatus.DISALLOWED,
        canAutoplay: false,
        requiresUserInteraction: true,
        requiresMuted: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }

    this.lastDetectionResults.set(mediaType, result);
    this.notifyStatusChange(mediaType, result);
    return result;
  }

  /**
   * 检测音频支持情况
   */
  private async detectAudioSupport(): Promise<MediaPermissionResult> {
    const audioElement = document.createElement('audio');
    audioElement.volume = 0; // 静音检测

    // 使用一个极短的空白音频数据
    const silentAudioBase64 = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audioElement.src = silentAudioBase64;

    try {
      const playPromise = audioElement.play();
      
      if (!playPromise) {
        return {
          status: AutoplayStatus.DISALLOWED,
          canAutoplay: false,
          requiresUserInteraction: true,
          requiresMuted: false
        };
      }

      await playPromise;

      // 测试非静音播放
      audioElement.volume = 0.5;
      try {
        await audioElement.play();
        return {
          status: AutoplayStatus.ALLOWED,
          canAutoplay: true,
          requiresUserInteraction: false,
          requiresMuted: false
        };
      } catch {
        return {
          status: AutoplayStatus.ALLOWED_MUTED,
          canAutoplay: true,
          requiresUserInteraction: false,
          requiresMuted: true
        };
      }
    } catch (error) {
      return {
        status: AutoplayStatus.DISALLOWED,
        canAutoplay: false,
        requiresUserInteraction: true,
        requiresMuted: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      audioElement.pause();
      audioElement.src = '';
      audioElement.remove();
    }
  }

  /**
   * 检测视频支持情况
   */
  private async detectVideoSupport(): Promise<MediaPermissionResult> {
    // 视频检测逻辑类似音频
    const videoElement = document.createElement('video');
    videoElement.muted = true;
    videoElement.playsInline = true;

    // 使用一个极短的空白视频数据
    const silentVideoBase64 = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAABNRtZGF0AAAADAAAAABMYXZmNTcuODMuMTAw';
    videoElement.src = silentVideoBase64;

    try {
      const playPromise = videoElement.play();
      
      if (!playPromise) {
        return {
          status: AutoplayStatus.DISALLOWED,
          canAutoplay: false,
          requiresUserInteraction: true,
          requiresMuted: false
        };
      }

      await playPromise;

      // 测试非静音播放
      videoElement.muted = false;
      try {
        await videoElement.play();
        return {
          status: AutoplayStatus.ALLOWED,
          canAutoplay: true,
          requiresUserInteraction: false,
          requiresMuted: false
        };
      } catch {
        return {
          status: AutoplayStatus.ALLOWED_MUTED,
          canAutoplay: true,
          requiresUserInteraction: false,
          requiresMuted: true
        };
      }
    } catch (error) {
      return {
        status: AutoplayStatus.DISALLOWED,
        canAutoplay: false,
        requiresUserInteraction: true,
        requiresMuted: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      videoElement.pause();
      videoElement.src = '';
      videoElement.remove();
    }
  }

  /**
   * 请求媒体权限
   * @param mediaType 媒体类型
   * @param muted 是否以静音模式请求
   * @returns 媒体权限检测结果
   */
  public async requestPermission(mediaType: MediaType, muted: boolean = false): Promise<MediaPermissionResult> {
    const result = await this.detectMediaSupport(mediaType, true);
    
    // 如果用户已经有过交互，更新状态
    if (this.userInteractionDetected && result.requiresUserInteraction) {
      const updatedResult: MediaPermissionResult = {
        ...result,
        requiresUserInteraction: false
      };
      this.lastDetectionResults.set(mediaType, updatedResult);
      this.notifyStatusChange(mediaType, updatedResult);
      return updatedResult;
    }

    return result;
  }

  /**
   * 注册状态变更回调
   * @param mediaType 媒体类型
   * @param callback 回调函数
   */
  public onStatusChange(mediaType: MediaType, callback: (result: MediaPermissionResult) => void): void {
    if (!this.statusChangeCallbacks.has(mediaType)) {
      this.statusChangeCallbacks.set(mediaType, []);
    }
    this.statusChangeCallbacks.get(mediaType)!.push(callback);
  }

  /**
   * 移除状态变更回调
   * @param mediaType 媒体类型
   * @param callback 回调函数
   */
  public offStatusChange(mediaType: MediaType, callback: (result: MediaPermissionResult) => void): void {
    const callbacks = this.statusChangeCallbacks.get(mediaType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 通知状态变更
   * @param mediaType 媒体类型
   * @param result 检测结果
   */
  private notifyStatusChange(mediaType: MediaType, result: MediaPermissionResult): void {
    const callbacks = this.statusChangeCallbacks.get(mediaType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(result);
        } catch (error) {
          console.error('状态变更回调执行失败:', error);
        }
      });
    }
  }

  /**
   * 通知用户交互被检测到
   */
  private notifyUserInteractionDetected(): void {
    // 更新所有媒体的检测结果
    for (const [mediaType, result] of this.lastDetectionResults) {
      if (result.requiresUserInteraction) {
        const updatedResult: MediaPermissionResult = {
          ...result,
          requiresUserInteraction: false
        };
        this.lastDetectionResults.set(mediaType, updatedResult);
        this.notifyStatusChange(mediaType, updatedResult);
      }
    }

    // 触发用户交互回调
    this.notifyStatusChange(MediaType.AUDIO, {
      status: AutoplayStatus.ALLOWED,
      canAutoplay: true,
      requiresUserInteraction: false,
      requiresMuted: false
    });
  }

  /**
   * 检查是否已经检测到用户交互
   */
  public hasUserInteraction(): boolean {
    return this.userInteractionDetected;
  }

  /**
   * 手动触发用户交互检测（用于测试）
   */
  public triggerUserInteraction(): void {
    if (!this.userInteractionDetected) {
      this.userInteractionDetected = true;
      this.notifyUserInteractionDetected();
    }
  }
}