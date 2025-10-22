import { AutoplayStatus, AutoplayPermissionResult } from './types';

/**
 * 自动播放检测和权限请求工具类
 */
export class AutoplayUtils {
  private static instance: AutoplayUtils;
  private cachedStatus: AutoplayStatus = AutoplayStatus.UNKNOWN;
  private testAudio: HTMLAudioElement | null = null;
  private statusChangeCallbacks: ((result: AutoplayPermissionResult) => void)[] = [];

  /**
   * 获取单例实例
   */
  public static getInstance(): AutoplayUtils {
    if (!AutoplayUtils.instance) {
      AutoplayUtils.instance = new AutoplayUtils();
    }
    return AutoplayUtils.instance;
  }

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor() {}

  /**
   * 检测浏览器自动播放策略
   * @param forceCheck 是否强制重新检测
   * @returns 自动播放权限结果
   */
  public async detectAutoplaySupport(forceCheck: boolean = false): Promise<AutoplayPermissionResult> {
    // 如果已经检测过且不强制重新检测，则返回缓存结果
    if (this.cachedStatus !== AutoplayStatus.UNKNOWN && !forceCheck) {
      return this.createResult(this.cachedStatus);
    }

    try {
      // 创建一个静音的短音频元素用于测试
      this.testAudio = document.createElement('audio');
      this.testAudio.volume = 0;
      
      // 使用一个极短的空白音频数据
      // 注意：这是一个极小的、有效的音频数据，用于测试自动播放
      const silentAudioBase64 = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      this.testAudio.src = silentAudioBase64;
      
      // 尝试播放
      const playPromise = this.testAudio.play();
      
      // 如果浏览器不支持Promise API，则假设需要用户交互
      if (!playPromise) {
        this.cachedStatus = AutoplayStatus.DISALLOWED;
        return this.createResult(this.cachedStatus);
      }
      
      // 等待播放结果
      await playPromise;
      
      // 如果能够播放，则检查是否需要静音
      this.testAudio.volume = 0.5;
      try {
        await this.testAudio.play();
        // 如果能够以非静音方式播放，则完全支持自动播放
        this.cachedStatus = AutoplayStatus.ALLOWED;
      } catch (error) {
        // 如果非静音播放失败，则只支持静音自动播放
        this.cachedStatus = AutoplayStatus.ALLOWED_MUTED;
      }
      
    } catch (error) {
      // 如果播放失败，则不支持自动播放
      console.warn('自动播放检测失败:', error);
      this.cachedStatus = AutoplayStatus.DISALLOWED;
      
      const result = this.createResult(this.cachedStatus);
      result.error = error instanceof Error ? error : new Error(String(error));
      return result;
    } finally {
      // 清理测试音频元素
      if (this.testAudio) {
        this.testAudio.pause();
        this.testAudio.src = '';
        this.testAudio.remove();
        this.testAudio = null;
      }
    }
    
    const result = this.createResult(this.cachedStatus);
    this.notifyStatusChange(result);
    return result;
  }

  /**
   * 请求自动播放权限
   * @param muted 是否以静音模式请求
   * @returns 自动播放权限结果
   */
  public async requestPermission(muted: boolean = false): Promise<AutoplayPermissionResult> {
    // 首先检测当前状态
    const currentStatus = await this.detectAutoplaySupport();
    
    // 如果已经允许自动播放，则直接返回
    if (currentStatus.status === AutoplayStatus.ALLOWED) {
      return currentStatus;
    }
    
    // 如果只允许静音自动播放，且请求的是静音模式，则返回成功
    if (currentStatus.status === AutoplayStatus.ALLOWED_MUTED && muted) {
      return currentStatus;
    }
    
    try {
      // 创建一个临时的音频元素
      const tempAudio = document.createElement('audio');
      tempAudio.volume = muted ? 0 : 0.1;
      
      // 使用一个极短的空白音频数据
      const silentAudioBase64 = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      tempAudio.src = silentAudioBase64;
      
      // 尝试播放
      await tempAudio.play();
      
      // 如果播放成功，更新缓存状态
      this.cachedStatus = muted ? AutoplayStatus.ALLOWED_MUTED : AutoplayStatus.ALLOWED;
      
      // 清理临时音频元素
      tempAudio.pause();
      tempAudio.src = '';
      tempAudio.remove();
      
      const result = this.createResult(this.cachedStatus);
      this.notifyStatusChange(result);
      return result;
      
    } catch (error) {
      // 如果播放失败，则权限请求失败
      console.warn('自动播放权限请求失败:', error);
      
      // 更新缓存状态
      this.cachedStatus = AutoplayStatus.DISALLOWED;
      
      const result = this.createResult(this.cachedStatus);
      result.error = error instanceof Error ? error : new Error(String(error));
      this.notifyStatusChange(result);
      return result;
    }
  }

  /**
   * 注册状态变更回调
   * @param callback 状态变更回调函数
   */
  public onStatusChange(callback: (result: AutoplayPermissionResult) => void): void {
    this.statusChangeCallbacks.push(callback);
  }

  /**
   * 移除状态变更回调
   * @param callback 要移除的回调函数
   */
  public offStatusChange(callback: (result: AutoplayPermissionResult) => void): void {
    const index = this.statusChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      this.statusChangeCallbacks.splice(index, 1);
    }
  }

  /**
   * 通知所有状态变更回调
   * @param result 自动播放权限结果
   */
  private notifyStatusChange(result: AutoplayPermissionResult): void {
    this.statusChangeCallbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('自动播放状态变更回调执行错误:', error);
      }
    });
  }

  /**
   * 根据状态创建结果对象
   * @param status 自动播放状态
   * @returns 自动播放权限结果
   */
  private createResult(status: AutoplayStatus): AutoplayPermissionResult {
    return {
      status,
      requiresUserInteraction: status === AutoplayStatus.DISALLOWED,
      requiresMuted: status === AutoplayStatus.ALLOWED_MUTED
    };
  }
}

/**
 * 获取自动播放工具实例
 * @returns AutoplayUtils实例
 */
export const getAutoplayUtils = (): AutoplayUtils => {
  return AutoplayUtils.getInstance();
};