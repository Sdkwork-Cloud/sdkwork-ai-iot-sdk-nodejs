/**
 * 播放器状态管理Store
 */

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { SdkworkAudioPlayer } from '@/core/audio/player'
import {
  PlayerState,
  PlayMode,
  PlayerDisplayMode,
  musicVOToTrack,
  trackToMusicVO,
  Track
} from './types' 

export const usePlayerStore = defineStore('player', () => {
  // State - 直接定义响应式状态
  const playbackState = reactive({
    state: PlayerState.IDLE,
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    progress: 0,
    volume: 0.7,
    playbackRate: 1.0,
    isMuted: false,
    currentTrack: null as Track | null,
    currentTrackIndex: -1,
    playMode: PlayMode.SEQUENTIAL,
    displayMode: PlayerDisplayMode.CARD,
    originalDisplayMode: PlayerDisplayMode.BOTTOM_BAR
  })
  
  const playlist = reactive({
    tracks: [] as Track[],
    currentIndex: -1,
    hasPrevious: false,
    hasNext: false,
    isShuffled: false
  })
  
  const config = reactive({
    autoplay: false,
    loop: false,
    showWaveform: true,
    showLyrics: false,
    themeColor: '#3b82f6',
    defaultVolume: 0.7,
    defaultPlaybackRate: 1.0
  })
  
  const error = ref<string | null>(null)
  const isFullscreen = ref(false)
  const showPlaylistPopup = ref(false)

  // 音乐播放器显示状态
  const musicPlayerState = reactive({
    show: false,
    displayMode: PlayerDisplayMode.BOTTOM_BAR
  })

  // Audio Player实例
  const audioPlayer = ref<SdkworkAudioPlayer | null>(null)

  // Getters - 计算属性
  const isPlaying = computed(() => playbackState.isPlaying)
  const isPaused = computed(() => playbackState.isPaused)
  const isStopped = computed(() => playbackState.isStopped)
  const isLoading = computed(() => playbackState.isLoading)
  
  const currentTrack = computed(() => playbackState.currentTrack)
  const currentTrackIndex = computed(() => playbackState.currentTrackIndex)
  const hasPrevious = computed(() => playlist.hasPrevious)
  const hasNext = computed(() => playlist.hasNext)
  const progress = computed(() => playbackState.progress)
  
  const volume = computed(() => playbackState.volume)
  const playbackRate = computed(() => playbackState.playbackRate)
  const isMuted = computed(() => playbackState.isMuted)
  
  const playMode = computed(() => playbackState.playMode)
  const displayMode = computed(() => musicPlayerState.displayMode)
  const currentSong = computed(() => playbackState.currentTrack)
  const currentIndex = computed(() => playlist.currentIndex)
  const currentTime = computed(() => playbackState.currentTime)
  const duration = computed(() => playbackState.duration)
  const buffered = computed(() => playbackState.buffered)
  const playlistTracks = computed(() => playlist.tracks)
  
  // 音乐播放器显示状态getters
  const showPlayer = computed(() => musicPlayerState.show)
  const playerDisplayMode = computed(() => musicPlayerState.displayMode)

  // Actions
  // 初始化音频播放器
  async function initializeAudioPlayer() {
    if (audioPlayer.value) {
      audioPlayer.value.destroy()
    }

    audioPlayer.value = new SdkworkAudioPlayer({
      events: {
        onPlay: () => {
          playbackState.state = PlayerState.PLAYING
          playbackState.isPlaying = true
          playbackState.isPaused = false
          playbackState.isStopped = false
        },
        onPause: () => {
          playbackState.state = PlayerState.PAUSED
          playbackState.isPlaying = false
          playbackState.isPaused = true
          playbackState.isStopped = false
        },
        onStop: () => {
          playbackState.state = PlayerState.STOPPED
          playbackState.isPlaying = false
          playbackState.isPaused = false
          playbackState.isStopped = true
        },
        onEnd: () => {
          handleTrackEnd()
        },
        onTimeUpdate: (currentTime: number, duration: number) => {
          playbackState.currentTime = currentTime
          playbackState.duration = duration
          playbackState.progress = duration > 0 ? (currentTime / duration) * 100 : 0
        },
        onProgress: (currentTime: number, duration: number) => {
          playbackState.currentTime = currentTime
          playbackState.duration = duration
          playbackState.progress = duration > 0 ? (currentTime / duration) * 100 : 0
        },
        onVolumeChange: (volume: number) => {
          playbackState.volume = volume
          playbackState.isMuted = volume === 0
        },
        onError: (_error: Error) => { 
          playbackState.state = PlayerState.ERROR
        }
      }
    })
  }

  // 播放控制 - 优化版：增强错误处理和状态管理
  async function play() {
    console.log('🎵 [PlayerStore] play方法调用:', {
      hasAudioPlayer: !!audioPlayer.value,
      currentTrack: playbackState.currentTrack,
      currentTrackSrc: playbackState.currentTrack?.src,
      currentState: playbackState.state
    })
    
    // 检查必要条件
    if (!audioPlayer.value) {
      console.error('🎵 [PlayerStore] play方法中止: audioPlayer未初始化')
      error.value = '音频播放器未初始化'
      return
    }
    
    if (!playbackState.currentTrack) {
      console.error('🎵 [PlayerStore] play方法中止: 没有当前曲目')
      error.value = '没有选择播放曲目'
      return
    }
    
    if (!playbackState.currentTrack.src) {
      console.error('🎵 [PlayerStore] play方法中止: 曲目缺少音频源')
      error.value = '曲目音频源不可用'
      return
    }

    try {
      playbackState.isLoading = true
      error.value = null

      console.log('🎵 [PlayerStore] 开始播放音频文件:', playbackState.currentTrack.src)
      
      // 先停止之前的播放（如果有）
      if (playbackState.isPlaying) {
        console.log('🎵 [PlayerStore] 停止之前的播放')
        await audioPlayer.value.stop()
      }
      
      // 播放音频文件
      await audioPlayer.value.play(playbackState.currentTrack.src)
      
      // 显示播放器
      musicPlayerState.show = true
      
      // 如果启用自动播放，继续播放
      if (config.autoplay) {
        console.log('🎵 [PlayerStore] 自动播放已启用，继续播放')
        await audioPlayer.value.resume()
      }
      
      console.log('🎵 [PlayerStore] 播放成功，状态更新为PLAYING')
    } catch (err) {
      console.error('🎵 [PlayerStore] 播放失败:', err)
      
      // 检查是否为自动播放限制错误，如果是则不设置错误状态
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage.includes('自动播放限制') || errorMessage.includes('Cannot read properties of null')) {
        console.warn('🎵 [PlayerStore] 自动播放限制，等待用户交互')
        error.value = '需要用户交互才能播放音频'
        playbackState.state = PlayerState.PAUSED
      } else {
        error.value = errorMessage
        playbackState.state = PlayerState.ERROR
      }
      
      // 重置播放状态
      playbackState.isPlaying = false
      playbackState.isPaused = true
      playbackState.isStopped = false
    } finally {
      playbackState.isLoading = false
    }
  }

  async function pause() {
    if (!audioPlayer.value) return
    await audioPlayer.value.pause()
  }

  async function stop() {
    if (!audioPlayer.value) return
    await audioPlayer.value.stop()
  }

  async function togglePlay() {
    if (!audioPlayer.value) return

    try {
      if (playbackState.isPlaying) {
        await pause()
      } else {
        if (playbackState.isStopped) {
          await play()
        } else {
          await audioPlayer.value.resume()
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '播放控制失败'
    }
  }

  // 播放列表控制
  function setPlaylist(tracks: Track[], startIndex: number = 0) {
    console.log('🎵 [PlayerStore] setPlaylist调用:', {
      tracksCount: tracks.length,
      startIndex: startIndex,
      tracks: tracks.map(t => ({ id: t.id, title: t.title }))
    })
    
    playlist.tracks = tracks
    playlist.currentIndex = startIndex
    playlist.hasPrevious = startIndex > 0
    playlist.hasNext = startIndex < tracks.length - 1
    
    if (tracks.length > 0 && startIndex >= 0 && startIndex < tracks.length) {
      playbackState.currentTrack = tracks[startIndex]
      playbackState.currentTrackIndex = startIndex
      console.log('🎵 [PlayerStore] 设置当前曲目:', tracks[startIndex].title)
    } else {
      playbackState.currentTrack = null
      playbackState.currentTrackIndex = -1
      console.log('🎵 [PlayerStore] 清空当前曲目')
    }
  }

  function addTrack(track: Track) {
    playlist.tracks.push(track)
    updateNavigationState()
  }

  function removeTrack(index: number) {
    if (index >= 0 && index < playlist.tracks.length) {
      playlist.tracks.splice(index, 1)
      updateNavigationState()
      
      // 如果删除的是当前播放的曲目
      if (index === playbackState.currentTrackIndex) {
        if (playlist.tracks.length > 0) {
          playTrack(Math.min(index, playlist.tracks.length - 1))
        } else {
          stop()
          playbackState.currentTrack = null
          playbackState.currentTrackIndex = -1
        }
      }
    }
  }

  function clearPlaylist() {
    playlist.tracks = []
    playlist.currentIndex = -1
    playlist.hasPrevious = false
    playlist.hasNext = false
    stop()
    playbackState.currentTrack = null
    playbackState.currentTrackIndex = -1
  }

  // 曲目导航
  function next() {
    if (playlist.hasNext) {
      const nextIndex = playlist.currentIndex + 1
      playTrack(nextIndex)
    } else if (config.loop) {
      // 循环播放到第一首
      playTrack(0)
    }
  }

  function previous() {
    if (playlist.hasPrevious) {
      const prevIndex = playlist.currentIndex - 1
      playTrack(prevIndex)
    }
  }

  async function playTrack(index: number) {
    if (index < 0 || index >= playlist.tracks.length) return

    console.log('🎵 [PlayerStore] playTrack调用:', { index, trackTitle: playlist.tracks[index]?.title })

    // 先停止当前播放（如果有）
    if (audioPlayer.value && playbackState.isPlaying) {
      console.log('🎵 [PlayerStore] 停止当前播放')
      await audioPlayer.value.stop()
    }

    // 更新播放列表状态
    playlist.currentIndex = index
    playbackState.currentTrack = playlist.tracks[index]
    playbackState.currentTrackIndex = index
    updateNavigationState()

    // 显示播放器
    musicPlayerState.show = true

    console.log('🎵 [PlayerStore] 设置当前曲目:', playlist.tracks[index]?.title)

    // 重新初始化播放器并播放
    if (audioPlayer.value) {
      audioPlayer.value.destroy()
    }
    
    try {
      await initializeAudioPlayer()
      await play()
      console.log('🎵 [PlayerStore] 播放器初始化并播放成功')
    } catch (error) {
      console.error('🎵 [PlayerStore] 播放器初始化失败:', error) 
    }
  }

  // 播放模式控制
  function setPlayMode(mode: PlayMode) {
    playbackState.playMode = mode
  }

  function togglePlayMode() {
    const modes = Object.values(PlayMode)
    const currentIndex = modes.indexOf(playbackState.playMode)
    const nextIndex = (currentIndex + 1) % modes.length
    playbackState.playMode = modes[nextIndex]
  }

  // 显示模式控制
  function setDisplayMode(mode: PlayerDisplayMode) {
    // 保存原始显示模式（非全屏模式）
    if (mode !== PlayerDisplayMode.FULLSCREEN) {
      playbackState.originalDisplayMode = mode
    }
    musicPlayerState.displayMode = mode
    isFullscreen.value = mode === PlayerDisplayMode.FULLSCREEN
  }

  // 音乐播放器显示控制
  function showMusicPlayer() {
    musicPlayerState.show = true
  }

  function hidePlayer() {
    musicPlayerState.show = false
  }

  function togglePlayer() {
    musicPlayerState.show = !musicPlayerState.show
  }

  function setPlayerDisplayMode(mode: PlayerDisplayMode) {
    musicPlayerState.displayMode = mode
  }

  function toggleFullscreen() {
    const newFullscreenState = !isFullscreen.value
    isFullscreen.value = newFullscreenState
    musicPlayerState.displayMode = newFullscreenState 
      ? PlayerDisplayMode.FULLSCREEN 
      : playbackState.originalDisplayMode || PlayerDisplayMode.BOTTOM_BAR
  }

  // 音频设置
  function setVolume(vol: number) {
    playbackState.volume = Math.max(0, Math.min(1, vol))
    playbackState.isMuted = vol === 0
    if (audioPlayer.value) {
      audioPlayer.value.setVolume(playbackState.volume)
    }
  }

  function setPlaybackRate(rate: number) {
    playbackState.playbackRate = Math.max(0.5, Math.min(4, rate))
    if (audioPlayer.value) {
      audioPlayer.value.setPlaybackRate(playbackState.playbackRate)
    }
  }

  function toggleMute() {
    if (playbackState.isMuted) {
      // 取消静音
      const newVolume = playbackState.volume > 0 ? playbackState.volume : 0.7
      setVolume(newVolume)
    } else {
      // 静音
      setVolume(0)
    }
  }

  // 进度控制
  function seek(time: number) {
    if (audioPlayer.value) {
      audioPlayer.value.seek(time)
    }
  }

  function seekToPercentage(percentage: number) {
    const time = (playbackState.duration * percentage) / 100
    seek(time)
  }

  // 错误处理
  function setError(err: string | null) {
    error.value = err
  }

  function clearError() {
    error.value = null
  }

  // UI控制
  function setShowPlaylistPopup(show: boolean) {
    showPlaylistPopup.value = show
  }

  // 内部方法
  function updateNavigationState() {
    playlist.hasPrevious = playlist.currentIndex > 0
    playlist.hasNext = playlist.currentIndex < playlist.tracks.length - 1
  }

  function handleTrackEnd() {
    switch (playbackState.playMode) {
      case PlayMode.SEQUENTIAL:
        if (playlist.hasNext) {
          next()
        } else if (config.loop) {
          playTrack(0)
        }
        break
        
      case PlayMode.RANDOM:
        const randomIndex = Math.floor(Math.random() * playlist.tracks.length)
        playTrack(randomIndex)
        break
        
      case PlayMode.LOOP:
        seek(0)
        play()
        break
    }
  }

  // 返回store的所有内容
  return {
    // State
    playbackState,
    playlist,
    config,
    error,
    isFullscreen,
    showPlaylistPopup,
    musicPlayerState,
    audioPlayer,
    
    // Getters
    isPlaying,
    isPaused,
    isStopped,
    isLoading,
    currentTrack,
    currentTrackIndex,
    hasPrevious,
    hasNext,
    progress,
    volume,
    playbackRate,
    isMuted,
    playMode,
    displayMode,
    currentSong,
    currentIndex,
    currentTime,
    duration,
    buffered,
    playlistTracks,
    showPlayer,
    playerDisplayMode,
    
    // Actions
    initializeAudioPlayer,
    play,
    pause,
    stop,
    togglePlay,
    setPlaylist,
    addTrack,
    removeTrack,
    clearPlaylist,
    next,
    previous,
    playTrack,
    setPlayMode,
    togglePlayMode,
    setDisplayMode,
    toggleFullscreen,
    setVolume,
    setPlaybackRate,
    toggleMute,
    seek,
    seekToPercentage,
    setError,
    clearError,
    setShowPlaylistPopup,
    updateNavigationState,
    handleTrackEnd,
    showMusicPlayer,
    hidePlayer,
    togglePlayer,
    setPlayerDisplayMode
  }
})

export type PlayerStore = ReturnType<typeof usePlayerStore>