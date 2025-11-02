import type { VoiceSpeakerVO } from '@/services'

// 合成数据类型
export interface SynthesisData {
  text: string
  speaker: VoiceSpeakerVO
  params: SynthesisParams
}

// 合成结果类型
export interface SynthesisResult {
  audioUrl: string
  duration: number
  fileSize: number
}

// 合成参数类型
export interface SynthesisParams {
  speed: number
  volume: number
  pitch: number
  format: string
}