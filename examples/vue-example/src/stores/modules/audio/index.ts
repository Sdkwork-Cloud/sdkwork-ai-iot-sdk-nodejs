import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VoiceCategory } from './types'
import { VoiceSpeakerVO } from '@/services'

export const useAudioStore = defineStore('audio', () => {
  // 当前选中的发音人
  const selectedSpeaker = ref<VoiceSpeakerVO | null>(null)
  
  // 发音人列表
  const speakers = ref<VoiceSpeakerVO[]>([])
  
  // 发音人分类
  const categories = ref<VoiceCategory[]>([])
  
  // 正在播放的音频
  const playingAudio = ref<HTMLAudioElement | null>(null)
  
  // 设置选中的发音人
  const setSelectedSpeaker = (speaker: VoiceSpeakerVO) => {
    selectedSpeaker.value = speaker
  }
  
  // 清除选中的发音人
  const clearSelectedSpeaker = () => {
    selectedSpeaker.value = null
  }
  
  // 设置发音人列表
  const setSpeakers = (speakerList: VoiceSpeakerVO[]) => {
    speakers.value = speakerList
  }
  
  // 设置分类列表
  const setCategories = (categoryList: VoiceCategory[]) => {
    categories.value = categoryList
  }
  
  // 试听发音人声音
  const previewSpeaker = async (speaker: VoiceSpeakerVO) => {
    // 停止当前播放的音频
    if (playingAudio.value) {
      playingAudio.value.pause()
      playingAudio.value = null
    }
    
    // 如果有示例音频URL，播放试听
    if (speaker.sampleAudio) {
      try {
        const audio = new Audio(speaker.sampleAudio)
        playingAudio.value = audio
        await audio.play()
        
        audio.onended = () => {
          playingAudio.value = null
        }
      } catch (error) {
        console.error('播放试听音频失败:', error)
        playingAudio.value = null
      }
    } else {
      // 如果没有示例音频，可以播放默认提示音或显示提示
      console.log('该发音人暂无试听音频')
    }
  }
  
  // 停止试听
  const stopPreview = () => {
    if (playingAudio.value) {
      playingAudio.value.pause()
      playingAudio.value = null
    }
  }
  
  // 根据分类ID获取发音人列表
  const getSpeakersByCategory = (categoryId: string | number) => {
    return speakers.value.filter(speaker => speaker.category === categoryId)
  }
  
  // 获取默认分类的发音人
  const getDefaultSpeakers = () => {
    if (categories.value.length > 0) {
      const defaultCategory = categories.value[0]
      return getSpeakersByCategory(defaultCategory.id)
    }
    return speakers.value
  }

  return {
    selectedSpeaker,
    speakers,
    categories,
    playingAudio,
    setSelectedSpeaker,
    clearSelectedSpeaker,
    setSpeakers,
    setCategories,
    previewSpeaker,
    stopPreview,
    getSpeakersByCategory,
    getDefaultSpeakers
  }
})