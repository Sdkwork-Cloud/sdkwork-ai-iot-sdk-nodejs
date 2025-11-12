/**
 * 视频对话生成组件类型定义
 */

// 对话角色接口
export interface DialogueCharacter {
  id: string
  name: string
  avatar?: string // 头像URL
  description?: string // 角色描述
  roleType?: 'main' | 'supporting' | 'extra' // 角色类型：主、配、群
  tags?: string[] // 角色标签
  appearance: {
    gender: 'male' | 'female' | 'other'
    age: string
    style: string // 如：商务、休闲、正式等
    description: string // 外观描述
  }
  voice: {
    voiceId: string // 语音ID
    pitch?: number // 音调
    speed?: number // 语速
    emotion?: string // 情感风格
  }
}

// 对话项类型
export interface DialogueItem {
  id: string
  characterId: string // 发言角色ID
  content: string // 对话内容
  duration: number // 预计持续时间（秒）
  emotion?: string // 情感表达
  actions?: string[] // 动作描述
  position?: string // 在画面中的位置
}

// 对话场景类型
export interface DialogueScene {
  id: string
  name: string
  background: string // 背景描述或URL
  characters: string[] // 参与角色ID列表
  dialogue: DialogueItem[] // 对话内容
  totalDuration: number // 总时长
}

// 完整对话项目类型
export interface DialogueProject {
  id: string
  title: string
  description: string
  characters: DialogueCharacter[] // 所有角色
  scenes: DialogueScene[] // 所有场景
  createdAt: string
  updatedAt: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
}

// 视频生成设置
export interface VideoSettings {
  title: string
  description: string
  resolution: '480p' | '720p' | '1080p' | '4K'
  format: 'mp4' | 'mov' | 'avi' | 'webm'
  backgroundMusic: string
  addSubtitle: boolean
  addTransition: boolean
  loopMusic: boolean
}

// 组件Props接口
export interface VideoDialogueProps {
  /** 是否禁用组件 */
  disabled?: boolean
  /** 积分系数 */
  pointsCoefficient?: number
  /** 是否显示历史记录 */
  showHistory?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

// 组件事件接口
export interface VideoDialogueEmits {
  /** 生成开始事件 */
  (e: 'generation-start', params: any): void
  /** 生成成功事件 */
  (e: 'generation-success', result: any): void
  /** 生成错误事件 */
  (e: 'generation-error', error: string): void
  /** 验证状态变更事件 */
  (e: 'validation-change', isValid: boolean): void
  /** 项目保存事件 */
  (e: 'project-save', project: DialogueProject): void
}