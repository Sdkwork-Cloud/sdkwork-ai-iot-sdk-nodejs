// 分镜镜头数据结构定义
export interface ShotItem {
  /** 镜头唯一标识 */
  id: string
  /** 镜头内容描述 */
  content: string
  /** 台词内容（播报内容） */
  dialogue: string
  /** 时长（秒） */
  duration: number
  /** 首帧图片URL */
  startFrame?: string
  /** 尾帧图片URL */
  endFrame?: string
  /** 单图模式图片URL */
  image?: string
  /** 图片生成提示词 */
  prompt?: string
  /** 首帧提示词 */
  startPrompt?: string
  /** 尾帧提示词 */
  endPrompt?: string
  /** 镜头视频生成描述 */
  videoDescription?: string
  /** 配音情感 */
  emotion?: 'neutral' | 'happy' | 'excited' | 'serious'
  /** 生成的视频URL */
  video?: string
}

// 分镜列表数据结构
export interface StoryboardList {
  /** 视频描述 */
  videoDescription: string
  /** 镜头列表 */
  shots: ShotItem[]
}

// 图片模式枚举
export type ImageMode = 'single' | 'frames'

// 配音情感选项
export const EMOTION_OPTIONS = [
  { text: '平静', value: 'neutral' },
  { text: '愉快', value: 'happy' },
  { text: '兴奋', value: 'excited' },
  { text: '严肃', value: 'serious' }
] as const

// 图片模式选项
export const IMAGE_MODE_OPTIONS = [
  { text: '单图模式', value: 'single' },
  { text: '首尾帧模式', value: 'frames' }
] as const