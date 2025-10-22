/**
 * 认证相关类型定义 - 统一数据模型和VO体系
 */

import type { 
  LoginParam, 
  RegisterParam, 
  LoginResultResponse, 
  UserResponse,
  RegisterType,
  UserStatus,
  RegisterResultResponse
} from 'sdkwork-sdk-api-typescript'

/**
 * 登录请求参数 - 扩展SDK的LoginParam
 */
export interface LoginRequest extends LoginParam {
  rememberMe?: boolean
}

/**
 * 注册请求参数 - 扩展SDK的RegisterParam
 */
export interface RegisterRequest extends RegisterParam {
  confirmPassword?: string
  agreed?: boolean
}

/**
 * 登录响应数据 - 扩展SDK的LoginResult
 */
export interface LoginResultVO extends LoginResultResponse {
  user: UserResponse
}

/**
 * 注册响应数据
 */
export interface RegisterResultVO extends RegisterResultResponse {
  user: UserResponse
  requiresVerification: boolean
}

/**
 * 验证码发送请求参数
 */
export interface VerificationCodeRequest {
  identifier: string
  method: 'email' | 'phone'
  type: 'registration' | 'password_reset' | 'login'
}

/**
 * 身份验证请求参数
 */
export interface VerifyIdentityRequest {
  identifier: string
  verificationCode: string
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  identifier: string
  verificationCode: string
  newPassword: string
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
}

/**
 * 社交登录请求参数
 */
export interface SocialLoginRequest {
  provider: 'wechat' | 'qq' | 'github' | 'google'
  code: string
  state?: string
}

/**
 * 认证错误类型
 */
export interface AuthError {
  code: string
  message: string
  details?: any
}

/**
 * 认证配置选项
 */
export interface AuthConfig {
  tokenStorage: 'localStorage' | 'sessionStorage' | 'cookie'
  autoRefresh: boolean
  refreshThreshold: number
  sessionTimeout: number
}

/**
 * 用户会话信息
 */
export interface UserSession {
  userId: string
  username: string
  email: string
  roles: string[]
  permissions: string[]
  loginTime: number
  lastActivity: number
}

/**
 * 认证状态接口
 */
export interface AuthState {
  // 认证状态
  isAuthenticated: boolean
  token: string | null
  refreshToken: string | null
  tokenExpiry: number | null

  // 用户信息
  currentUser: UserResponse | null
  
  // 加载状态
  loading: boolean
  error: AuthError | null

  // 认证流程状态
  verification: {
    identifier: string | null
    method: 'email' | 'phone' | null
    type: 'registration' | 'password_reset' | 'login' | null
    sentAt: number | null
    expiresAt: number | null
  }

  // 会话管理
  session: {
    lastActivity: number
    sessionTimeout: number
    autoLogout: boolean
  }
}

/**
 * 表单验证规则
 */
export interface ValidationRules {
  username: (value: string) => boolean
  email: (value: string) => boolean
  phone: (value: string) => boolean
  password: (value: string) => boolean
  confirmPassword: (value: string, password: string) => boolean
}

/**
 * 注册表单数据
 */
export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string
  verificationCode: string
  agreed: boolean
}

/**
 * 登录表单数据
 */
export interface LoginFormData extends LoginRequest {
  // 可以添加额外的表单字段
}

/**
 * 导出所有类型
 */
export type {
  RegisterType,
  UserStatus
}