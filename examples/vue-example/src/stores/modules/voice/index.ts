/**
 * Voice Store 模块导出
 */

// 导出发音人管理store
export { useVoiceStore } from './voice'

// 导出发音人相关类型和枚举
export type {
  VoiceSpeaker,
  AudioQuality,
  VoiceParameters,
  CreateSpeakerParams,
  UpdateSpeakerParams,
  CloneSpeakerParams,
  SpeakerQueryParams,
  SpeakerPagination,
  SpeakerStats,
  VoiceState
} from './types'

export {
  SpeakerGender,
  SpeakerLanguage,
  SpeakerStyle,
  SpeakerStatus,
  DEFAULT_SPEAKER_QUERY,
  DEFAULT_PAGINATION,
  DEFAULT_STATS
} from './types'