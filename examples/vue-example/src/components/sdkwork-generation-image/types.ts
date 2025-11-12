import type { GenerateImageParam, GenerateImageResponse } from 'sdkwork-sdk-api-typescript'

/**
 * 图片生成组件Props接口
 */
export interface SdkworkGenerationImageProps {
  /**
   * 默认激活的标签页
   */
  defaultTab?: 'text' | 'reference' | 'portrait' | 'idphoto'
  /**
   * 是否禁用组件
   */
  disabled?: boolean
  /**
   * 是否显示积分消耗
   */
  showPointsCost?: boolean
  /**
   * 积分消耗系数
   */
  pointsCoefficient?: number
}

/**
 * 组件事件接口
 */
export interface SdkworkGenerationImageEvents {
  /**
   * 图片生成开始
   */
  'generation-start': [params: GenerateImageParam]
  /**
   * 图片生成成功
   */
  'generation-success': [result: GenerateImageResponse]
  /**
   * 图片生成失败
   */
  'generation-error': [error: Error]
  /**
   * 表单验证状态变化
   */
  'validation-change': [isValid: boolean]
  /**
   * 标签页切换
   */
  'tab-change': [tab: ImageGenerationMode]
}

/**
 * 图片生成模式
 */
export type ImageGenerationMode = 'text' | 'reference' | 'portrait' | 'idphoto'

/**
 * 照片设置
 */
export interface PhotoSettings {
  gender: string
  age: string
  background: string
  idType: string
  idSize: string
  bgColor: string
}

/**
 * 生成结果
 */
export interface GenerationResult {
  id: string
  url: string
  width: number
  height: number
  model?: string
  prompt?: string
  requestId?: string
  status: string
}