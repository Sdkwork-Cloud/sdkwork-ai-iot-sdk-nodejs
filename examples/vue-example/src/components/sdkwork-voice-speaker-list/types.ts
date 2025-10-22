 
import { VoiceSpeakerVO } from '@/services'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 发音人性别
 */
export type SpeakerGender = 'male' | 'female' | 'neutral'

/**
 * 发音人语言
 */
export type SpeakerLanguage = 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' | 'ja-JP' | 'ko-KR'

/**
 * 发音人类型
 */
export type SpeakerType = 'standard' | 'premium' | 'custom'

/**
 * 发音人状态
 */
export type SpeakerStatus = 'active' | 'disabled' | 'testing'

/**
 * 发音人语音特性
 */
export interface SpeakerVoice {
  /** 语速 (0-100) */
  speed: number
  /** 音调 (0-100) */
  pitch: number
  /** 音量 (0-100) */
  volume: number
  /** 情感类型 */
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'calm'
}


/**
 * 发音人列表查询参数
 */
export interface SpeakerQueryParams {
  /** 性别筛选 */
  gender?: SpeakerGender
  /** 语言筛选 */
  language?: SpeakerLanguage
  /** 类型筛选 */
  type?: SpeakerType
  /** 状态筛选 */
  status?: SpeakerStatus
  /** 关键词搜索 */
  keyword?: string
  /** 是否支持实时语音 */
  realtime?: boolean
  /** 是否支持离线语音 */
  offline?: boolean
  /** 是否支持情感语音 */
  emotional?: boolean
  /** 是否支持多语言 */
  multilingual?: boolean
  /** 标签筛选 */
  tags?: string[]
  /** 是否收藏 */
  favorite?: boolean
  /** 评分筛选 */
  minRating?: number
  /** 使用次数筛选 */
  minUsageCount?: number
}

/**
 * 发音人分页响应
 */
export type SpeakerPage = Page<VoiceSpeakerVO>

/**
 * 发音人分页请求
 */
export interface SpeakerPageable extends Pageable {
  filters?: SpeakerQueryParams
}

/**
 * 发音人事件类型
 */
export interface SpeakerEvents {
  (e: 'select', speaker: VoiceSpeakerVO): void
  (e: 'play-sample', speaker: VoiceSpeakerVO): void
  (e: 'favorite', speaker: VoiceSpeakerVO): void
  (e: 'delete', speaker: VoiceSpeakerVO): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: SpeakerPage): void
  (e: 'click', speaker: VoiceSpeakerVO): void
  (e: 'context-menu', speaker: VoiceSpeakerVO, event: MouseEvent): void
}