import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 角色类型
 */
export type CameoType = 'character' | 'celebrity' | 'custom' | 'ai-generated'

/**
 * 角色实体
 */
export interface Cameo {
  /** 角色ID */
  id: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description: string
  /** 角色头像 */
  avatar: string
  /** 角色类型 */
  type: CameoType
  /** 客串次数 */
  cameoCount: number
  /** Remix次数 */
  remixCount: number
  /** 观看次数 */
  viewCount: number
  /** 点赞次数 */
  likeCount: number
  /** 评分 */
  rating: number
  /** 是否收藏 */
  isFavorite?: boolean
  /** 角色标签 */
  tags: string[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 角色分页响应
 */
export type CameoPage = Page<Cameo>

/**
 * 角色分页请求
 */
export interface CameoPageable extends Pageable {
  filters?: {
    /** 类型筛选 */
    type?: CameoType
    /** 关键词搜索 */
    keyword?: string
    /** 是否收藏 */
    isFavorite?: boolean
    /** 排序方式 */
    sortBy?: 'cameoCount' | 'remixCount' | 'viewCount' | 'rating' | 'createdAt'
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc'
  }
}

/**
 * 角色事件类型
 */
export interface CameoEvents {
  /** 选择角色事件 */
  select: [cameo: Cameo]
  /** 删除角色事件 */
  delete: [cameo: Cameo]
  /** 搜索事件 */
  search: [keyword: string]
  /** 数据加载事件 */
  load: [pageData: CameoPage]
  /** 点击角色事件 */
  click: [cameo: Cameo]
  /** 播放角色事件 */
  play: [cameo: Cameo]
  /** 收藏角色事件 */
  favorite: [cameo: Cameo, isFavorite: boolean]
  /** Remix角色事件 */
  remix: [cameo: Cameo]
  /** 分享角色事件 */
  share: [cameo: Cameo]
}