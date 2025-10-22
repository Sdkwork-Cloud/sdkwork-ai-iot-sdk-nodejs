/**
 * 音乐播放管理器 - 实现统一的音乐播放API
 * 提供全局的音乐播放控制，基于usePlayerStore进行统一状态管理
 * 支持事件驱动和直接方法调用
 */

import mitt from 'mitt'
import type { MusicVO } from '@/services/src/service/music/types'
import { usePlayerStore } from '@/stores/modules/player'
import { musicVOToTrack, PlayerDisplayMode, trackToMusicVO } from '@/stores/modules/player/types'

// 音乐播放事件类型
type MusicPlayerEvents = {
  'play': MusicVO
  'pause': void
  'stop': void
  'next': void
  'previous': void
  'volume-change': number
  'seek': number
  'ended': void
  'error': Error
  'mode-change': string
  'playlist-change': MusicVO[]
  'current-track-change': MusicVO
}

// 播放模式枚举
export enum PlayerMode {
  FULLSCREEN = 'fullscreen',
  BOTTOM_BAR = 'bottom-bar',
  CARD = 'card'
}

// 播放模式映射到PlayerDisplayMode
const modeMapping = {
  [PlayerMode.FULLSCREEN]: PlayerDisplayMode.FULLSCREEN,
  [PlayerMode.BOTTOM_BAR]: PlayerDisplayMode.BOTTOM_BAR,
  [PlayerMode.CARD]: PlayerDisplayMode.CARD
}

class MusicPlayerManager {
  private emitter = mitt<MusicPlayerEvents>()
  private playerStore: ReturnType<typeof usePlayerStore> | null = null

  /**
   * 初始化播放器存储
   */
  private initializeStore() {
    if (!this.playerStore) {
      this.playerStore = usePlayerStore()
      // 初始化音频播放器
      this.playerStore.initializeAudioPlayer()
    }
  }

  /**
   * 获取播放器状态
   */
  getState() {
    this.initializeStore()
    return {
      isPlaying: this.playerStore!.isPlaying,
      isPaused: this.playerStore!.isPaused,
      isStopped: this.playerStore!.isStopped,
      currentTrack: this.playerStore!.currentTrack,
      currentTime: this.playerStore!.currentTime,
      duration: this.playerStore!.duration,
      volume: this.playerStore!.volume,
      playbackRate: this.playerStore!.playbackRate,
      playlist: this.playerStore!.playlistTracks,
      currentTrackIndex: this.playerStore!.currentTrackIndex,
      mode: this.playerStore!.displayMode
    }
  }

  /**
   * 播放音乐 - 简化版：只负责播放功能，显示模式由外部控制
   * @param music 音乐对象
   * @param playlist 播放列表（可选）
   */
  async play(music: MusicVO, playlist?: MusicVO[]): Promise<void> {
    try {
      this.initializeStore()

      console.log('🎵 [MusicPlayerManager] play方法调用:', music.title)

      // 直接使用MusicVO，无需转换
      const tracks = (playlist || [music]).map(music => {
        return musicVOToTrack(music)
      });


      // 设置播放列表和当前曲目
      const trackIndex = tracks.findIndex(track => track.id === music.id)
      console.log('🎵 [MusicPlayerManager] 设置播放列表:', {
        trackIndex: trackIndex,
        tracksCount: tracks.length
      })

      // 先停止当前播放（如果有）
      if (this.playerStore!.isPlaying) {
        console.log('🎵 [MusicPlayerManager] 停止当前播放')
        await this.playerStore!.stop()
      }

      // 设置播放列表
      this.playerStore!.setPlaylist(tracks, trackIndex >= 0 ? trackIndex : 0)

      // 显示播放器
      this.playerStore!.showMusicPlayer()

      // 实际开始播放
      console.log('🎵 [MusicPlayerManager] 调用playerStore.play()')
      await this.playerStore!.play()

      // 触发播放事件
      this.emitter.emit('play', music)
      this.emitter.emit('current-track-change', music)
      this.emitter.emit('playlist-change', playlist || [music])

      console.log('🎵 [MusicPlayerManager] 播放完成:', music.title, '播放状态:', this.playerStore!.isPlaying ? '播放中' : '未播放')
    } catch (error) {
      console.error('🎵 [MusicPlayerManager] 播放错误:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 暂停播放
   */
  pause(): void {
    try {
      this.initializeStore()
      this.playerStore!.pause()
      this.emitter.emit('pause')
      console.log('暂停播放')
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    try {
      this.initializeStore()
      this.playerStore!.stop()
      this.emitter.emit('stop')
      console.log('停止播放')
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 切换播放/暂停状态
   */
  togglePlay(): void {
    try {
      this.initializeStore()
      this.playerStore!.togglePlay()

      if (this.playerStore!.isPlaying) {
        this.emitter.emit('play', this.playerStore!.currentTrack!)
      } else {
        this.emitter.emit('pause')
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 播放下一首
   */
  next(): void {
    try {
      this.initializeStore()
      if (this.playerStore!.playlistTracks.length === 0) return

      this.playerStore!.next()
      this.emitter.emit('next')

      if (this.playerStore!.currentTrack) {
        this.emitter.emit('current-track-change', this.playerStore!.currentTrack)
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 播放上一首
   */
  previous(): void {
    try {
      this.initializeStore()
      if (this.playerStore!.playlistTracks.length === 0) return

      this.playerStore!.previous()
      this.emitter.emit('previous')

      if (this.playerStore!.currentTrack) {
        this.emitter.emit('current-track-change', this.playerStore!.currentTrack)
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 设置音量
   * @param volume 音量值 (0-1)
   */
  setVolume(volume: number): void {
    try {
      this.initializeStore()
      this.playerStore!.setVolume(volume)
      this.emitter.emit('volume-change', volume)
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 设置播放进度
   * @param time 时间（秒）
   */
  seek(time: number): void {
    try {
      this.initializeStore()
      this.playerStore!.seek(time)
      this.emitter.emit('seek', time)
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 设置播放模式
   * @param mode 播放模式
   */
  setMode(mode: PlayerMode): void {
    try {
      this.initializeStore()
      const displayMode = modeMapping[mode] || PlayerDisplayMode.FULLSCREEN
      this.playerStore!.setDisplayMode(displayMode)
      this.emitter.emit('mode-change', mode)
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 设置播放列表
   * @param playlist 播放列表
   */
  setPlaylist(playlist: MusicVO[]): void {
    try {
      this.initializeStore()
      // 直接使用MusicVO，无需转换
      const trackList = playlist.map(music => {
        return musicVOToTrack(music)
      })
      this.playerStore!.setPlaylist(trackList, 0)
      this.emitter.emit('playlist-change', playlist)
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  /**
   * 获取当前播放曲目
   */
  getCurrentTrack(): MusicVO | null {
    this.initializeStore()
    return this.playerStore!.currentTrack
  }

  /**
   * 获取播放列表
   */
  getPlaylist(): MusicVO[] {
    this.initializeStore()
    const playlist = this.playerStore!.playlistTracks.map(track => {
      return trackToMusicVO(track)
    }) 
    return playlist
  }

  /**
   * 检查是否正在播放
   */
  isPlaying(): boolean {
    this.initializeStore()
    return this.playerStore!.isPlaying
  }

  /**
   * 检查是否有下一首
   */
  hasNext(): boolean {
    this.initializeStore()
    return this.playerStore!.hasNext
  }

  /**
   * 检查是否有上一首
   */
  hasPrevious(): boolean {
    this.initializeStore()
    return this.playerStore!.hasPrevious
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param handler 事件处理器
   */
  on<T extends keyof MusicPlayerEvents>(
    event: T,
    handler: (payload: MusicPlayerEvents[T]) => void
  ): void {
    this.emitter.on(event, handler as any)
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param handler 事件处理器
   */
  off<T extends keyof MusicPlayerEvents>(
    event: T,
    handler: (payload: MusicPlayerEvents[T]) => void
  ): void {
    this.emitter.off(event, handler as any)
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param payload 事件数据
   */
  emit<T extends keyof MusicPlayerEvents>(
    event: T,
    payload: MusicPlayerEvents[T]
  ): void {
    this.emitter.emit(event, payload)
  }

  /**
   * 处理错误
   * @param error 错误对象
   */
  private handleError(error: Error): void {
    console.error('音乐播放错误:', error)
    this.emitter.emit('error', error)
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.stop()
    this.emitter.all.clear()
  }
}

// 创建单例实例
const musicPlayerManager = new MusicPlayerManager()

export default musicPlayerManager