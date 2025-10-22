import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 视频作者信息
 */
export interface VideoAuthor {
  /** 作者ID */
  id: string
  /** 用户名 */
  username: string
  /** 头像URL */
  avatar: string
  /** 是否已认证 */
  verified: boolean
  /** 是否已关注 */
  followed: boolean
  /** 粉丝数 */
  followerCount: number
  /** 作品数 */
  videoCount: number
}

/**
 * 视频音乐信息
 */
export interface VideoMusic {
  /** 音乐ID */
  id: string
  /** 音乐名称 */
  name: string
  /** 作者 */
  author: string
  /** 封面URL */
  coverUrl: string
  /** 音乐URL */
  musicUrl: string
  /** 时长（秒） */
  duration: number
}

/**
 * 滚动视频项
 */
export interface ScrollVideoItem {
  /** 视频ID */
  id: string
  /** 视频索引（内部使用） */
  index?: number
  /** 视频标题 */
  title: string
  /** 视频描述 */
  description: string
  /** 视频URL */
  videoUrl: string
  /** 封面URL */
  coverUrl: string
  /** 视频时长（秒） */
  duration: number
  /** 视频宽高比（如：9:16, 16:9, 1:1等） */
  aspectRatio?: string
  /** 视频类型（如：手机竖屏、横屏视频、正方形等） */
  videoType?: string
  /** 视频宽度 */
  videoWidth?: number
  /** 视频高度 */
  videoHeight?: number
  /** 作者信息 */
  author: VideoAuthor
  /** 音乐信息 */
  music?: VideoMusic
  /** 点赞数 */
  likeCount: number
  /** 评论数 */
  commentCount: number
  /** 分享数 */
  shareCount: number
  /** 做同款数 */
  makeSameCount: number
  /** 是否已点赞 */
  liked: boolean
  /** 是否静音 */
  muted: boolean
  /** 播放进度（0-100） */
  progress: number
  /** 当前播放时间（秒） */
  currentTime: number
  /** 是否正在播放 */
  playing: boolean
  /** 是否正在加载 */
  loading: boolean
  /** 是否已预加载 */
  preloaded?: boolean
  /** 创建时间 */
  createTime: string
  /** 标签 */
  tags: string[]
  /** 视频元素引用（内部使用） */
  videoElement?: HTMLVideoElement
  /** 评论参数 */
  commentParams?: Record<string, any>
}

/**
 * 视频列表分页响应
 */
export interface VideoPageResponse extends Page<ScrollVideoItem> {
  /** 是否有下一页 */
  hasNext: boolean
  /** 下一页页码 */
  nextPage?: number
}

/**
 * 视频API接口定义
 */
export interface VideoApi {
  /** 获取视频列表（符合SpringBoot分页标准） */
  getVideos: (params: VideoListParams) => Promise<VideoPageResponse>
  /** 点赞视频 */
  likeVideo: (videoId: string) => Promise<void>
  /** 取消点赞 */
  unlikeVideo: (videoId: string) => Promise<void>
  /** 关注作者 */
  followAuthor: (authorId: string) => Promise<void>
  /** 取消关注 */
  unfollowAuthor: (authorId: string) => Promise<void>
  /** 分享视频 */
  shareVideo: (videoId: string) => Promise<void>
}

/**
 * 视频列表请求参数
 */
export interface VideoListParams extends Omit<Pageable, 'sort'> {
  /** 标签筛选 */
  tags?: string[]
  /** 作者ID筛选 */
  authorId?: string
  /** 排序方式 */
  sort?: 'latest' | 'hot' | 'recommend' | string[]
  /** 关键词搜索 */
  keyword?: string
}

/**
 * 评论信息
 */
export interface Comment {
  /** 评论ID */
  id: string
  /** 用户信息 */
  user: VideoAuthor
  /** 评论内容 */
  content: string
  /** 点赞数 */
  likeCount: number
  /** 回复数 */
  replyCount: number
  /** 创建时间 */
  createTime: string
  /** 是否已点赞 */
  liked: boolean
  /** 回复列表 */
  replies?: Comment[]
}

/**
 * 评论分页响应
 */
export interface CommentPageResponse extends Page<Comment> {
  /** 总评论数 */
  totalComments: number
}

/**
 * 评论API接口定义
 */
export interface CommentApi {
  /** 获取评论列表 */
  getComments: (videoId: string, params: Pageable) => Promise<CommentPageResponse>
  /** 发表评论 */
  addComment: (videoId: string, content: string) => Promise<Comment>
  /** 回复评论 */
  replyComment: (commentId: string, content: string) => Promise<Comment>
  /** 点赞评论 */
  likeComment: (commentId: string) => Promise<void>
  /** 取消点赞评论 */
  unlikeComment: (commentId: string) => Promise<void>
}