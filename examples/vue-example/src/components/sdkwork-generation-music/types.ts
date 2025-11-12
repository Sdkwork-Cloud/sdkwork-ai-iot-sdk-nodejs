import type { GenerateMusicParam, GenerateMusicResponse } from 'sdkwork-sdk-api-typescript'

/**
 * 音乐生成组件Props接口
 */
export interface SdkworkGenerationMusicProps {
  /**
   * 默认音乐模型
   */
  defaultModel?: string
  /**
   * 是否禁用组件
   */
  disabled?: boolean
  /**
   * 是否显示歌词编辑器
   */
  showLyrics?: boolean
  /**
   * 默认歌词内容
   */
  defaultLyrics?: string
  /**
   * 积分消耗系数
   */
  pointsCoefficient?: number
}

/**
 * 组件事件接口
 */
export interface SdkworkGenerationMusicEvents {
  /**
   * 音乐生成开始
   */
  'generation-start': [params: GenerateMusicParam]
  /**
   * 音乐生成成功
   */
  'generation-success': [result: GenerateMusicResponse]
  /**
   * 音乐生成失败
   */
  'generation-error': [error: Error]
  /**
   * 表单验证状态变化
   */
  'validation-change': [isValid: boolean]
  /**
   * 模型选择变化
   */
  'model-change': [model: string]
}

/**
 * 音乐配置
 */
export interface MusicConfig {
  style: string
  emotion: string
  scene: string
  bpm: string
  duration: string
}

/**
 * 生成结果
 */
export interface GenerationResult {
  id: string
  url: string
  model?: string
  prompt?: string
  lyrics?: string
  requestId?: string
  status: string
}