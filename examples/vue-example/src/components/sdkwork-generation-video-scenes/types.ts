// 视频场景项数据结构定义
export interface VideoSceneItem {
  /** 分镜唯一标识 */
  id: string
  /** 分镜排序权重 */
  order: number
  /** 视频描述文字 */
  videoDescription: string
  /** 口播台词 */
  script: string
  /** 分镜时长（秒） */
  duration: number
  /** 参考图片列表 */
  images: SceneImage[]
  /** 生成的视频URL */
  video?: string
  /** 视频生成状态 */
  videoStatus?: 'pending' | 'generating' | 'completed' | 'failed'
  /** 视频生成进度 */
  videoProgress?: number
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

// 场景图片数据结构
export interface SceneImage {
  /** 图片唯一标识 */
  id: string
  /** 图片URL */
  url: string
  /** 图片类型 */
  type: 'startFrame' | 'endFrame' | 'product' | 'reference'
  /** 图片标题 */
  title?: string
  /** 图片生成提示词 */
  prompt?: string
  /** 图片尺寸 */
  width?: number
  /** 图片尺寸 */
  height?: number
  /** 文件大小 */
  size?: number
}

// 图片模式类型
export type ImageMode = 'single' | 'frames' | 'gallery'

// 图片生成模式
export type ImageGenerateMode = 'upload' | 'ai-generate' | 'library'

// 视频创作项目数据结构
export interface VideoProject {
  /** 项目ID */
  id: string
  /** 项目名称 */
  name: string
  /** 项目描述 */
  description?: string
  /** 分镜列表 */
  scenes: VideoSceneItem[]
  /** 项目创建时间 */
  createdAt: Date
  /** 项目更新时间 */
  updatedAt: Date
  /** 项目草稿状态 */
  isDraft: boolean
  /** 项目版本 */
  version: number
}

// 撤销/重做操作记录
export interface HistoryRecord {
  /** 操作类型 */
  type: 'create' | 'update' | 'delete' | 'reorder'
  /** 操作目标ID */
  targetId: string
  /** 操作前的数据 */
  before?: any
  /** 操作后的数据 */
  after?: any
  /** 操作时间 */
  timestamp: Date
}

// 图片模式选项
export const IMAGE_MODE_OPTIONS = [
  { text: '单图模式', value: 'single' as const },
  { text: '首尾帧模式', value: 'frames' as const },
  { text: '图片库模式', value: 'gallery' as const }
] as const

// 图片类型选项
export const IMAGE_TYPE_OPTIONS = [
  { text: '首帧', value: 'startFrame' as const },
  { text: '尾帧', value: 'endFrame' as const },
  { text: '商品图', value: 'product' as const },
  { text: '参考图', value: 'reference' as const }
] as const

// 视频生成状态选项
export const VIDEO_STATUS_OPTIONS = [
  { text: '待生成', value: 'pending' as const },
  { text: '生成中', value: 'generating' as const },
  { text: '已完成', value: 'completed' as const },
  { text: '生成失败', value: 'failed' as const }
] as const