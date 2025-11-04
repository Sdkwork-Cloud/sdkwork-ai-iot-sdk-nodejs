/**
 * Voice Store - 发音人类型定义文件
 * 统一管理发音人模块的所有类型定义
 */

// 发音人性别枚举
export enum SpeakerGender {
  MALE = 'male', // 男性
  FEMALE = 'female', // 女性
  NEUTRAL = 'neutral' // 中性
}

// 发音人语言枚举
export enum SpeakerLanguage {
  CHINESE = 'chinese', // 中文
  ENGLISH = 'english', // 英文
  JAPANESE = 'japanese', // 日文
  KOREAN = 'korean', // 韩文
  SPANISH = 'spanish', // 西班牙文
  FRENCH = 'french', // 法文
  GERMAN = 'german', // 德文
  ITALIAN = 'italian', // 意大利文
  RUSSIAN = 'russian', // 俄文
  OTHER = 'other' // 其他
}

// 发音人风格枚举
export enum SpeakerStyle {
  STANDARD = 'standard', // 标准
  WARM = 'warm', // 温暖
  CHEERFUL = 'cheerful', // 欢快
  SERIOUS = 'serious', // 严肃
  CALM = 'calm', // 平静
  ENERGETIC = 'energetic', // 活力
  GENTLE = 'gentle', // 温柔
  AUTHORITATIVE = 'authoritative', // 权威
  STORYTELLING = 'storytelling', // 讲故事
  CUSTOM = 'custom' // 自定义
}

// 发音人状态枚举
export enum SpeakerStatus {
  AVAILABLE = 'available', // 可用
  UNAVAILABLE = 'unavailable', // 不可用
  DISABLED = 'disabled', // 已禁用
  DELETED = 'deleted' // 已删除
}

// 发音人音频质量接口
export interface AudioQuality {
  sampleRate: number // 采样率 (Hz)
  bitrate: number // 比特率 (kbps)
  channels: number // 声道数
  format: string // 音频格式
}

// 发音人语音参数接口
export interface VoiceParameters {
  speed: number // 语速 (0.5-2.0)
  pitch: number // 音调 (0.5-2.0)
  volume: number // 音量 (0.0-1.0)
  emotion?: string // 情感参数
  emphasis?: string // 重音参数
}

// 发音人接口
export interface VoiceSpeaker {
  id: string // 发音人ID
  name: string // 发音人名称
  displayName: string // 显示名称
  description?: string // 描述
  gender: SpeakerGender // 性别
  language: SpeakerLanguage // 语言
  style: SpeakerStyle // 风格
  status: SpeakerStatus // 状态
  
  // 音频信息
  audioQuality: AudioQuality // 音频质量
  voiceParameters: VoiceParameters // 语音参数
  
  // 元数据
  tags: string[] // 标签
  category: string // 分类
  isFeatured: boolean // 是否推荐
  isCustom: boolean // 是否自定义
  
  // 统计信息
  usageCount: number // 使用次数
  rating: number // 评分 (0-5)
  popularity: number // 受欢迎度 (0-100)
  
  // 时间信息
  createdAt: number // 创建时间戳
  updatedAt: number // 更新时间戳
  lastUsedAt?: number // 最后使用时间
  
  // 自定义字段
  customFields?: Record<string, any> // 自定义字段
}

// 创建发音人参数
export interface CreateSpeakerParams {
  name: string // 发音人名称
  displayName: string // 显示名称
  description?: string // 描述
  gender: SpeakerGender // 性别
  language: SpeakerLanguage // 语言
  style: SpeakerStyle // 风格
  audioQuality?: Partial<AudioQuality> // 音频质量
  voiceParameters?: Partial<VoiceParameters> // 语音参数
  tags?: string[] // 标签
  category?: string // 分类
  isFeatured?: boolean // 是否推荐
  customFields?: Record<string, any> // 自定义字段
}

// 更新发音人参数
export interface UpdateSpeakerParams extends Partial<CreateSpeakerParams> {
  id: string // 发音人ID
  status?: SpeakerStatus // 状态
  isCustom?: boolean // 是否自定义
}

// 克隆发音人参数
export interface CloneSpeakerParams {
  sourceSpeakerId: string // 源发音人ID
  newName: string // 新名称
  newDisplayName: string // 新显示名称
  description?: string // 新描述
  category?: string // 新分类
  tags?: string[] // 新标签
  isCustom?: boolean // 是否自定义
  customFields?: Record<string, any> // 自定义字段
}

// 发音人查询参数
export interface SpeakerQueryParams {
  gender?: SpeakerGender // 性别筛选
  language?: SpeakerLanguage // 语言筛选
  style?: SpeakerStyle // 风格筛选
  status?: SpeakerStatus // 状态筛选
  category?: string // 分类筛选
  tags?: string[] // 标签筛选
  keyword?: string // 关键词搜索
  isFeatured?: boolean // 是否推荐
  isCustom?: boolean // 是否自定义
  page?: number // 页码
  pageSize?: number // 每页数量
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating' | 'popularity' // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 发音人分页信息
export interface SpeakerPagination {
  page: number // 当前页码
  pageSize: number // 每页数量
  total: number // 总数量
  totalPages: number // 总页数
  hasMore: boolean // 是否有更多
}

// 发音人统计信息
export interface SpeakerStats {
  total: number // 总发音人数
  available: number // 可用发音人数
  unavailable: number // 不可用发音人数
  disabled: number // 已禁用人发音数
  custom: number // 自定义发音人数
  featured: number // 推荐发音人数
  byGender: Record<SpeakerGender, number> // 按性别统计
  byLanguage: Record<SpeakerLanguage, number> // 按语言统计
  byStyle: Record<SpeakerStyle, number> // 按风格统计
}

// Voice Store 状态接口
export interface VoiceState {
  // 发音人列表
  speakers: VoiceSpeaker[]
  
  // 当前操作的发音人
  currentSpeaker: VoiceSpeaker | null
  
  // 发音人加载状态
  speakersLoading: boolean
  
  // 发音人操作错误信息
  speakerError: string | null
  
  // 发音人分页信息
  speakerPagination: SpeakerPagination
  
  // 发音人搜索参数
  searchParams: SpeakerQueryParams
  
  // 发音人统计信息
  speakerStats: SpeakerStats
  
  // 所有分类列表
  categories: string[]
  
  // 所有标签列表
  allTags: string[]
  
  // 最近使用的发音人
  recentSpeakers: VoiceSpeaker[]
}

// 默认发音人查询参数
export const DEFAULT_SPEAKER_QUERY: SpeakerQueryParams = {
  page: 1,
  pageSize: 20,
  status: SpeakerStatus.AVAILABLE,
  sortBy: 'popularity',
  sortOrder: 'desc'
}

// 默认发音人分页信息
export const DEFAULT_PAGINATION: SpeakerPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
  hasMore: false
}

// 默认发音人统计信息
export const DEFAULT_STATS: SpeakerStats = {
  total: 0,
  available: 0,
  unavailable: 0,
  disabled: 0,
  custom: 0,
  featured: 0,
  byGender: {
    [SpeakerGender.MALE]: 0,
    [SpeakerGender.FEMALE]: 0,
    [SpeakerGender.NEUTRAL]: 0
  },
  byLanguage: {
    [SpeakerLanguage.CHINESE]: 0,
    [SpeakerLanguage.ENGLISH]: 0,
    [SpeakerLanguage.JAPANESE]: 0,
    [SpeakerLanguage.KOREAN]: 0,
    [SpeakerLanguage.SPANISH]: 0,
    [SpeakerLanguage.FRENCH]: 0,
    [SpeakerLanguage.GERMAN]: 0,
    [SpeakerLanguage.ITALIAN]: 0,
    [SpeakerLanguage.RUSSIAN]: 0,
    [SpeakerLanguage.OTHER]: 0
  },
  byStyle: {
    [SpeakerStyle.STANDARD]: 0,
    [SpeakerStyle.WARM]: 0,
    [SpeakerStyle.CHEERFUL]: 0,
    [SpeakerStyle.SERIOUS]: 0,
    [SpeakerStyle.CALM]: 0,
    [SpeakerStyle.ENERGETIC]: 0,
    [SpeakerStyle.GENTLE]: 0,
    [SpeakerStyle.AUTHORITATIVE]: 0,
    [SpeakerStyle.STORYTELLING]: 0,
    [SpeakerStyle.CUSTOM]: 0
  }
}