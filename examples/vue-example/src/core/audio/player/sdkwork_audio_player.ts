import { AudioPlayerEvents, AudioPlayerOptions, AudioPlayerState, AutoplayPermissionResult, AutoplayStatus, IAudioPlayer } from "./types";
import { MediaPermissionUtils, MediaType, MediaPermissionResult } from "../../media/permission/MediaPermissionUtils";
import { AudioUtils } from "../utils/AudioUtils";

export class SdkworkAudioPlayer implements IAudioPlayer {
    private audioElement: HTMLAudioElement | null = null;
    private volume: number = 1.0;
    private isLooping: boolean = false;
    private events: AudioPlayerEvents = {};
    private updateInterval: number | null = null;
    private state: AudioPlayerState = AudioPlayerState.IDLE;
    private lastUpdateTime: number = 0;
    private autoplayStatus: AutoplayStatus = AutoplayStatus.UNKNOWN;
    private pendingPlayPromise: Promise<void> | null = null;
    private pendingPlayResolve: (() => void) | null = null;
    private pendingPlayReject: ((error: Error) => void) | null = null;

    constructor(options: AudioPlayerOptions = {}) {
        this.volume = options.volume ?? 1.0;
        this.isLooping = options.loop ?? false;
        this.events = options.events ?? {};
        
        // 初始化时检测自动播放状态
        this.detectAutoplaySupport();
        
        // 监听自动播放状态变化
        MediaPermissionUtils.getInstance().onStatusChange(MediaType.AUDIO, this.handleAutoplayStatusChange.bind(this));
    }

    /**
     * 检测浏览器自动播放支持
     * @param forceCheck 是否强制重新检测
     * @returns 自动播放权限结果
     */
    async detectAutoplaySupport(forceCheck: boolean = false): Promise<AutoplayPermissionResult> {
        const result = await MediaPermissionUtils.getInstance().detectMediaSupport(MediaType.AUDIO, forceCheck);
        this.autoplayStatus = this.convertToAutoplayStatus(result);
        return this.convertToAutoplayResult(result);
    }



    /**
     * 将媒体权限结果转换为自动播放权限结果
     * @param result 媒体权限检测结果
     * @returns 自动播放权限结果
     */
    private convertToAutoplayResult(result: MediaPermissionResult): AutoplayPermissionResult {
        let status: AutoplayStatus;
        
        if (!result.canAutoplay) {
            status = AutoplayStatus.DISALLOWED;
        } else if (result.requiresMuted) {
            status = AutoplayStatus.ALLOWED_MUTED;
        } else {
            status = AutoplayStatus.ALLOWED;
        }
        
        return {
            status,
            requiresUserInteraction: result.requiresUserInteraction,
            requiresMuted: result.requiresMuted,
            error: result.error
        };
    }

    /**
     * 将媒体权限结果转换为自动播放状态
     * @param result 媒体权限检测结果
     * @returns 自动播放状态
     */
    private convertToAutoplayStatus(result: MediaPermissionResult): AutoplayStatus {
        if (!result.canAutoplay) {
            return AutoplayStatus.DISALLOWED;
        } else if (result.requiresMuted) {
            return AutoplayStatus.ALLOWED_MUTED;
        } else {
            return AutoplayStatus.ALLOWED;
        }
    }

    /**
     * 请求自动播放权限
     * @param muted 是否以静音模式请求
     * @returns 自动播放权限结果
     */
    async requestAutoplayPermission(muted: boolean = false): Promise<AutoplayPermissionResult> {
        const result = await MediaPermissionUtils.getInstance().requestPermission(MediaType.AUDIO, muted);
        this.autoplayStatus = this.convertToAutoplayStatus(result);
        return this.convertToAutoplayResult(result);
    }

    /**
     * 处理自动播放状态变更
     * @param result 媒体权限检测结果
     */
    private handleAutoplayStatusChange(result: MediaPermissionResult): void {
        const autoplayResult = this.convertToAutoplayResult(result);
        this.autoplayStatus = autoplayResult.status;
        
        // 触发自动播放状态变更事件
        if (this.events.onAutoplayStatusChange) {
            this.events.onAutoplayStatusChange(autoplayResult);
        }
        
        // 如果自动播放被阻止且需要用户交互，触发自动播放阻止事件
        if (autoplayResult.status === AutoplayStatus.DISALLOWED && autoplayResult.requiresUserInteraction) {
            if (this.events.onAutoplayBlocked) {
                this.events.onAutoplayBlocked(autoplayResult);
            }
        }
    }

    /**
     * 尝试播放音频，处理自动播放限制
     * @param audioElement 音频元素
     * @returns 播放Promise
     */
    private async tryPlayWithAutoplayHandling(audioElement: HTMLAudioElement): Promise<void> {
        // 如果未检测自动播放状态，先检测
        if (this.autoplayStatus === AutoplayStatus.UNKNOWN) {
            await this.detectAutoplaySupport();
        }

        try {
            // 尝试播放
            await audioElement.play();
            this.setState(AudioPlayerState.PLAYING);
        } catch (error) {
            // 如果播放失败，可能是自动播放限制
            console.warn('播放失败，可能是自动播放限制:', error);
            
            // 更新自动播放状态
            await this.detectAutoplaySupport(true);
            
            // 创建自动播放权限结果
            const result: AutoplayPermissionResult = {
                status: this.autoplayStatus,
                requiresUserInteraction: this.autoplayStatus === AutoplayStatus.DISALLOWED,
                requiresMuted: this.autoplayStatus === AutoplayStatus.ALLOWED_MUTED,
                error: error instanceof Error ? error : new Error(String(error))
            };
            
            // 触发自动播放受阻事件
            this.events.onAutoplayBlocked?.(result);
            
            // 如果支持静音自动播放，尝试静音播放
            if (this.autoplayStatus === AutoplayStatus.ALLOWED_MUTED) {
                const originalVolume = audioElement.volume;
                audioElement.volume = 0;
                
                try {
                    await audioElement.play();
                    this.setState(AudioPlayerState.PLAYING);
                    
                    // 创建一个延迟恢复音量的函数
                    const restoreVolume = () => {
                        // 创建一个渐变音量的效果
                        let currentVolume = 0;
                        const targetVolume = originalVolume;
                        const step = targetVolume / 10;
                        
                        const fadeInterval = setInterval(() => {
                            currentVolume = Math.min(targetVolume, currentVolume + step);
                            audioElement.volume = currentVolume;
                            
                            if (currentVolume >= targetVolume) {
                                clearInterval(fadeInterval);
                            }
                        }, 100);
                    };
                    
                    // 监听用户交互事件，在用户交互后恢复音量
                    const userInteractionHandler = () => {
                        restoreVolume();
                        document.removeEventListener('click', userInteractionHandler);
                        document.removeEventListener('touchstart', userInteractionHandler);
                        document.removeEventListener('keydown', userInteractionHandler);
                    };
                    
                    document.addEventListener('click', userInteractionHandler);
                    document.addEventListener('touchstart', userInteractionHandler);
                    document.addEventListener('keydown', userInteractionHandler);
                    
                } catch (innerError) {
                    // 如果静音播放也失败，则需要用户交互
                    audioElement.volume = originalVolume;
                    
                    // 创建待处理的播放Promise，等待用户交互
                    this.pendingPlayPromise = new Promise<void>((resolve, reject) => {
                        this.pendingPlayResolve = resolve;
                        this.pendingPlayReject = reject;
                    });
                    
                    // 注册用户交互监听器，当用户交互时自动重试播放
                    this.registerUserInteractionListener();
                    
                    // 设置播放器状态为等待用户交互
                    this.setState(AudioPlayerState.WAITING_FOR_INTERACTION);
                    
                    // 返回待处理的播放Promise
                    return this.pendingPlayPromise;
                }
            } else {
                // 如果不支持自动播放，则需要用户交互
                this.setState(AudioPlayerState.PAUSED);
                
                // 创建待处理的播放Promise，等待用户交互
                this.pendingPlayPromise = new Promise<void>((resolve, reject) => {
                    this.pendingPlayResolve = resolve;
                    this.pendingPlayReject = reject;
                });
                
                // 注册用户交互监听器，当用户交互时自动重试播放
                this.registerUserInteractionListener();
                
                // 设置播放器状态为等待用户交互
                this.setState(AudioPlayerState.WAITING_FOR_INTERACTION);
                
                // 返回待处理的播放Promise
                return this.pendingPlayPromise;
            }
        }
    }

    /**
     * 注册用户交互监听器
     * 当自动播放被阻止时，监听用户交互事件并自动重试播放
     */
    private registerUserInteractionListener(): void {
        if (!this.audioElement) {
            return;
        }

        const interactionHandler = async () => {
            // 移除监听器
            document.removeEventListener('click', interactionHandler);
            document.removeEventListener('touchstart', interactionHandler);
            document.removeEventListener('keydown', interactionHandler);

            try {
                // 尝试重新播放
                await this.audioElement!.play();
                this.setState(AudioPlayerState.PLAYING);
                
                // 解决待处理的播放Promise
                if (this.pendingPlayResolve) {
                    this.pendingPlayResolve();
                    this.pendingPlayPromise = null;
                    this.pendingPlayResolve = null;
                    this.pendingPlayReject = null;
                }
                
                // 更新自动播放状态
                await this.detectAutoplaySupport(true);
                
            } catch (error) {
                console.warn('用户交互后播放仍然失败:', error);
                
                // 如果仍然失败，拒绝待处理的播放Promise
                if (this.pendingPlayReject) {
                    this.pendingPlayReject(error as Error);
                    this.pendingPlayPromise = null;
                    this.pendingPlayResolve = null;
                    this.pendingPlayReject = null;
                }
            }
        };

        // 添加用户交互监听器
        document.addEventListener('click', interactionHandler, { once: true });
        document.addEventListener('touchstart', interactionHandler, { once: true });
        document.addEventListener('keydown', interactionHandler, { once: true });
    }

    /**
     * 用户交互后恢复播放
     * 在用户点击播放按钮等交互后调用
     */
    async resumeAfterInteraction(): Promise<void> {
        if (!this.audioElement) {
            throw new Error('没有可播放的音频');
        }
        
        try {
            await this.audioElement.play();
            this.setState(AudioPlayerState.PLAYING);
            
            // 如果有待处理的播放Promise，则解决它
            if (this.pendingPlayResolve) {
                this.pendingPlayResolve();
                this.pendingPlayPromise = null;
                this.pendingPlayResolve = null;
                this.pendingPlayReject = null;
            }
            
            // 更新自动播放状态
            await this.detectAutoplaySupport(true);
            
        } catch (error) {
            this.setState(AudioPlayerState.ERROR);
            this.events.onError?.(error as Error);
            
            // 如果有待处理的播放Promise，则拒绝它
            if (this.pendingPlayReject) {
                this.pendingPlayReject(error as Error);
                this.pendingPlayPromise = null;
                this.pendingPlayResolve = null;
                this.pendingPlayReject = null;
            }
            
            throw error;
        }
    }

    /**
     * 播放音频文件
     */
    async play(url: string | File | Blob): Promise<void> {
        // 如果是 Blob 类型，调用专门的 playBlob 方法
        if (typeof url !== 'string' && !(url instanceof File) && url instanceof Blob) {
            return this.playBlob(url);
        }
        
        // 严谨的状态判断：如果正在播放，先停止当前播放
        if (this.audioElement && this.state === AudioPlayerState.PLAYING) {
            this.stop();
        }
        
        this.setState(AudioPlayerState.LOADING);
        
        try {
            // 复用现有的音频元素，而不是每次都创建新的
            if (!this.audioElement) {
                this.audioElement = new Audio();
                this.setupAudioElementEvents(this.audioElement);
            }

            // 重置音频元素状态
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            
            // 处理不同类型的音频源
            let audioSrc: string;
            if (typeof url === 'string') {
                // 如果是字符串，直接使用
                audioSrc = url;
            } else if (url instanceof File) {
                // 如果是 File 对象，创建对象 URL
                audioSrc = URL.createObjectURL(url);
            } else {
                throw new Error('不支持的音频源类型');
            }
            
            // 加载并播放音频文件
            this.audioElement.src = audioSrc;
            this.audioElement.volume = this.volume;
            this.audioElement.loop = this.isLooping;
            
            // 等待元数据加载以获取时长
            await new Promise<void>((resolve, reject) => {
                this.audioElement!.addEventListener('loadedmetadata', () => {
                    resolve();
                });
                this.audioElement!.addEventListener('error', () => {
                    reject(new Error('加载音频元数据失败'));
                });
            });
            
            // 尝试播放，处理自动播放限制
            try {
              await this.tryPlayWithAutoplayHandling(this.audioElement);
            } catch (error) {
              // 如果是自动播放限制，不抛出错误，返回待处理的Promise
              if (this.pendingPlayPromise) {
                return this.pendingPlayPromise;
              }
              throw error;
            }
            
            // 如果有待处理的播放Promise，则返回它
            return this.pendingPlayPromise || Promise.resolve();
            
        } catch (error) {
            // 如果是自动播放限制导致的错误，不设置错误状态
            if (this.pendingPlayPromise) {
                return this.pendingPlayPromise;
            }
            
            // 设置错误状态并触发错误事件
            this.setState(AudioPlayerState.ERROR);
            this.events.onError?.(error as Error);
            
            // 重新抛出错误，让调用方处理
            throw error;
        }
    }

    /**
     * 播放Blob对象
     */
    async playBlob(blob: Blob): Promise<void> {
        // 严谨的状态判断：如果正在播放，先停止当前播放
        if (this.audioElement && this.state === AudioPlayerState.PLAYING) {
            this.stop();
        }
        
        this.setState(AudioPlayerState.LOADING);
        
        try {
            // 检测音频格式并转换为可播放格式
            let playableBlob: Blob;
            
            // 检测是否是PCM格式
            const format = AudioUtils.detectAudioFormat(blob);
            if (format === 'pcm' || blob.type === 'audio/pcm') {
                console.log('检测到PCM格式音频，转换为WAV格式');
                // 将PCM转换为WAV
                const arrayBuffer = await AudioUtils.blobToArrayBuffer(blob);
                playableBlob = AudioUtils.pcmToWav(arrayBuffer, 16000, 1, 16);
            } else {
                // 其他格式直接使用
                playableBlob = blob;
            }
            
            // 从blob创建对象URL
            const objectUrl = URL.createObjectURL(playableBlob);
            
            // 复用现有的音频元素，而不是每次都创建新的
            if (!this.audioElement) {
                this.audioElement = new Audio();
                this.setupAudioElementEvents(this.audioElement);
            }

            // 重置音频元素状态
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            
            // 加载并播放blob
            this.audioElement.src = objectUrl;
            this.audioElement.volume = this.volume;
            this.audioElement.loop = this.isLooping;
            
            // 等待元数据加载以获取时长
            await new Promise<void>((resolve, reject) => {
                this.audioElement!.addEventListener('loadedmetadata', () => {
                    resolve();
                });
                this.audioElement!.addEventListener('error', () => {
                    reject(new Error('加载音频元数据失败'));
                });
            });
            
            // 尝试播放，处理自动播放限制
            await this.tryPlayWithAutoplayHandling(this.audioElement);
            
            // 播放结束后清理对象URL
            this.audioElement.addEventListener('ended', () => {
                URL.revokeObjectURL(objectUrl);
            });
            
            // 如果有待处理的播放Promise，则返回它
            return this.pendingPlayPromise || Promise.resolve();
            
        } catch (error) {
            // 如果是自动播放限制导致的错误，不设置错误状态
            if (this.pendingPlayPromise) {
                return this.pendingPlayPromise;
            }
            
            this.setState(AudioPlayerState.ERROR);
            this.events.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * 暂停当前播放
     */
    pause(): void {
        if (this.audioElement) {
            this.audioElement.pause();
            this.setState(AudioPlayerState.PAUSED);
        }
    }

    /**
     * 恢复暂停的播放
     */
    async resume(): Promise<void> {
        if (this.audioElement) {
            if (this.state === AudioPlayerState.PAUSED || this.state === AudioPlayerState.IDLE) {
                try {
                    await this.audioElement.play();
                    this.setState(AudioPlayerState.PLAYING);
                } catch (error) {
                    this.setState(AudioPlayerState.ERROR);
                    this.events.onError?.(error as Error);
                    throw error;
                }
            }
        }
    }

    /**
     * 停止播放并重置到开始位置
     */
    stop(): void {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.setState(AudioPlayerState.IDLE);
        }
        this.stopTimeUpdates();
    }

    /**
     * 设置音量
     */
    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.audioElement) {
            this.audioElement.volume = this.volume;
        }
        
        this.events.onVolumeChange?.(this.volume);
    }

    /**
     * 获取当前音量
     */
    getVolume(): number {
        return this.volume;
    }

    /**
     * 获取当前播放状态
     */
    getState(): AudioPlayerState {
        return this.state;
    }

    /**
     * 获取当前播放时间
     */
    getCurrentTime(): number {
        if (this.audioElement) {
            return this.audioElement.currentTime;
        }
        return 0;
    }

    /**
     * 获取总时长
     */
    getDuration(): number {
        if (this.audioElement) {
            return this.audioElement.duration || 0;
        }
        return 0;
    }

    /**
     * 跳转到特定时间位置
     */
    seek(time: number): void {
        if (this.audioElement) {
            this.audioElement.currentTime = time;
        }
    }

    /**
     * 设置播放速率
     */
    setPlaybackRate(rate: number): void {
        const newRate = Math.max(0.5, Math.min(4.0, rate));
        
        if (this.audioElement) {
            this.audioElement.playbackRate = newRate;
        }
    }

    /**
     * 添加事件监听器
     */
    on<K extends keyof AudioPlayerEvents>(event: K, callback: AudioPlayerEvents[K]): void {
        this.events[event] = callback;
    }

    /**
     * 移除事件监听器
     */
    off<K extends keyof AudioPlayerEvents>(event: K): void {
        delete this.events[event];
    }

    /**
     * 清理资源并停止播放
     */
    destroy(): void {
        this.stop();
        this.stopTimeUpdates();

        if (this.audioElement) {
            this.audioElement.src = '';
            this.audioElement = null;
        }

        this.setState(AudioPlayerState.IDLE);
    }

    /**
     * 设置音频元素事件监听器
     */
    private setupAudioElementEvents(audioElement: HTMLAudioElement): void {
        audioElement.addEventListener('play', () => {
            this.setState(AudioPlayerState.PLAYING);
            this.startTimeUpdates();
        });

        audioElement.addEventListener('pause', () => {
            this.setState(AudioPlayerState.PAUSED);
            this.stopTimeUpdates();
        });

        audioElement.addEventListener('ended', () => {
            this.setState(AudioPlayerState.ENDED);
            this.stopTimeUpdates();
        });

        audioElement.addEventListener('error', () => {
            this.setState(AudioPlayerState.ERROR);
            this.events.onError?.(new Error('音频元素错误'));
            this.stopTimeUpdates();
        });

        audioElement.addEventListener('loadedmetadata', () => {
            // 更新时长
        });
    }

    /**
     * 开始时间更新间隔以跟踪进度
     */
    private startTimeUpdates(): void {
        this.stopTimeUpdates();
        
        this.updateInterval = window.setInterval(() => {
            const currentTime = this.getCurrentTime();
            const duration = this.getDuration();
            
            if (currentTime !== this.lastUpdateTime) {
                this.events.onTimeUpdate?.(currentTime, duration);
                this.events.onProgress?.(currentTime, duration);
                this.lastUpdateTime = currentTime;
            }
        }, 100);
    }

    /**
     * 停止时间更新间隔
     */
    private stopTimeUpdates(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * 更新播放器状态并触发事件
     */
    private setState(newState: AudioPlayerState): void {
        const oldState = this.state;
        this.state = newState;

        // 触发特定状态事件
        switch (newState) {
            case AudioPlayerState.PLAYING:
                this.events.onPlay?.();
                break;
            case AudioPlayerState.PAUSED:
                this.events.onPause?.();
                break;
            case AudioPlayerState.IDLE:
                this.events.onStop?.();
                break;
            case AudioPlayerState.ENDED:
                this.events.onEnd?.();
                break;
            case AudioPlayerState.WAITING_FOR_INTERACTION:
                // 等待用户交互状态，可以触发特定事件或UI提示
                break;
        }
    }
}