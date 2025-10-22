import { ref, onUnmounted } from 'vue'
import { AudioRecorder, AudioRecorderOptions, RecordStreamCallback } from '../../core/audio/recorder'

export interface UseAudioRecorderReturn {
  // 状态
  isRecording: Ref<boolean>
  isInitialized: Ref<boolean>
  duration: Ref<number>
  error: Ref<string | null>
  
  // 方法
  initialize: () => Promise<void>
  startRecordToFile: () => Promise<void>
  startRecordStream: (callback: RecordStreamCallback) => Promise<void>
  stopRecord: () => Promise<Blob | null>
  pauseRecord: () => void
  resumeRecord: () => void
  destroy: () => void
  
  // 工具方法
  reset: () => void
}

export function useAudioRecorder(options: AudioRecorderOptions = {}): UseAudioRecorderReturn {
  const audioRecorder = ref<AudioRecorder | null>(null)
  const isRecording = ref(false)
  const isInitialized = ref(false)
  const duration = ref(0)
  const error = ref<string | null>(null)
  
  let durationInterval: number | null = null

  // 初始化录音器
  const initialize = async (): Promise<void> => {
    try {
      error.value = null
      audioRecorder.value = new AudioRecorder(options)
      await audioRecorder.value.initialize()
      isInitialized.value = true
    } catch (err) {
      error.value = `初始化失败: ${err}`
      throw err
    }
  }

  // 开始录制到文件
  const startRecordToFile = async (): Promise<void> => {
    if (!audioRecorder.value) {
      throw new Error('录音器未初始化')
    }

    try {
      error.value = null
      await audioRecorder.value.startRecordToFile()
      isRecording.value = true
      startDurationTimer()
    } catch (err) {
      error.value = `开始录制失败: ${err}`
      throw err
    }
  }

  // 开始流式录制
  const startRecordStream = async (callback: RecordStreamCallback): Promise<void> => {
    if (!audioRecorder.value) {
      throw new Error('录音器未初始化')
    }

    try {
      error.value = null
      await audioRecorder.value.startRecordStream(callback)
      isRecording.value = true
      startDurationTimer()
    } catch (err) {
      error.value = `开始流式录制失败: ${err}`
      throw err
    }
  }

  // 停止录制
  const stopRecord = async (): Promise<Blob | null> => {
    if (!audioRecorder.value) {
      return null
    }

    try {
      error.value = null
      const result = await audioRecorder.value.stopRecord()
      isRecording.value = false
      stopDurationTimer()
      return result as any
    } catch (err) {
      error.value = `停止录制失败: ${err}`
      throw err
    }
  }

  // 暂停录制
  const pauseRecord = (): void => {
    if (audioRecorder.value) {
      audioRecorder.value.pauseRecord()
    }
  }

  // 恢复录制
  const resumeRecord = (): void => {
    if (audioRecorder.value) {
      audioRecorder.value.resumeRecord()
    }
  }

  // 销毁录音器
  const destroy = (): void => {
    if (audioRecorder.value) {
      audioRecorder.value.destroy()
      audioRecorder.value = null
    }
    isRecording.value = false
    isInitialized.value = false
    stopDurationTimer()
    duration.value = 0
    error.value = null
  }

  // 重置状态
  const reset = (): void => {
    destroy()
    error.value = null
  }

  // 开始计时器
  const startDurationTimer = (): void => {
    stopDurationTimer()
    durationInterval = window.setInterval(() => {
      if (audioRecorder.value) {
        duration.value = audioRecorder.value.getRecordDuration()
      }
    }, 100)
  }

  // 停止计时器
  const stopDurationTimer = (): void => {
    if (durationInterval) {
      clearInterval(durationInterval)
      durationInterval = null
    }
  }

  // 组件卸载时自动销毁
  onUnmounted(() => {
    destroy()
  })

  return {
    isRecording,
    isInitialized,
    duration,
    error,
    
    initialize,
    startRecordToFile,
    startRecordStream,
    stopRecord,
    pauseRecord,
    resumeRecord,
    destroy,
    reset
  }
}

export default useAudioRecorder