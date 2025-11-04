// 用户管理相关类型定义

import { UserVO } from "@/services"

/**
 * 用户角色枚举
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}
 

/**
 * 用户创建参数
 */
export interface CreateUserParams {
  username: string
  email: string
  password: string
  phone?: string
  nickname?: string
  realName?: string
  role?: UserRole
  status?: UserStatus
}

/**
 * 用户更新参数
 */
export interface UpdateUserParams {
  username?: string
  email?: string
  phone?: string
  avatar?: string
  nickname?: string
  realName?: string
  role?: UserRole
  status?: UserStatus
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: UserRole
  status?: UserStatus
}

/**
 * 用户分页响应
 */
export interface UserPaginationResponse {
  users: UserVO[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 用户状态接口
 */
export interface UserState {
  // 当前登录用户
  currentUser: UserVO | null
  
  // 用户列表
  userList: UserVO[]
  
  // 当前查看的用户详情
  currentUserDetail: UserVO | null
  
  // 加载状态
  loading: boolean
  
  // 错误信息
  error: string | null
  
  // 分页信息
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}