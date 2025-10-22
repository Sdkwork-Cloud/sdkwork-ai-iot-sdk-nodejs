/**
 * 认证服务类型定义
 */
import type { UserVO } from '../user/types'

/**
 * 认证请求基础接口
 */
export interface AuthRequest {
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  scope?: string[]
}

/**
 * 登录请求参数
 */
export interface LoginRequest extends AuthRequest {
  username: string
  password: string
  rememberMe?: boolean
  deviceInfo?: DeviceInfo
}

/**
 * 注册请求参数
 */
export interface RegisterRequest extends AuthRequest {
  username: string
  email: string
  phone: string
  password: string
  verificationCode?: string
  inviteCode?: string
  profile?: UserProfile
}

/**
 * 验证码发送请求参数
 */
export interface VerificationCodeRequest {
  identifier: string
  method: 'email' | 'phone' | 'sms'
  type: 'registration' | 'password_reset' | 'login' | 'account_verification'
  template?: string
  params?: Record<string, any>
}

/**
 * 验证码验证请求参数
 */
export interface VerifyCodeRequest {
  identifier: string
  code: string
  type: string
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  identifier: string
  code: string
  newPassword: string
  confirmPassword?: string
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
  confirmPassword?: string
}

/**
 * 社交登录请求参数
 */
export interface SocialLoginRequest extends AuthRequest {
  provider: 'wechat' | 'qq' | 'github' | 'google' | 'facebook' | 'twitter'
  code: string
  state?: string
  redirectUri?: string
}

/**
 * 设备信息
 */
export interface DeviceInfo {
  deviceId?: string
  deviceType: 'web' | 'mobile' | 'desktop' | 'tablet'
  os: string
  browser: string
  userAgent: string
  ipAddress?: string
  location?: GeoLocation
}

/**
 * 地理位置信息
 */
export interface GeoLocation {
  latitude: number
  longitude: number
  country?: string
  city?: string
  region?: string
}

/**
 * 用户资料信息
 */
export interface UserProfile {
  avatar?: string
  nickname?: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  bio?: string
  website?: string
  socialLinks?: SocialLinks
}

/**
 * 社交链接
 */
export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  wechat?: string
  qq?: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  scope?: string[]
  user: UserVO
  session?: UserSession
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  user: UserVO
  requiresVerification: boolean
  verificationMethod?: 'email' | 'phone'
  message?: string
}

/**
 * 验证码发送响应
 */
export interface VerificationCodeResponse {
  success: boolean
  message: string
  expiresIn?: number
  method: string
}

/**
 * 验证码验证响应
 */
export interface VerifyCodeResponse {
  success: boolean
  valid: boolean
  message?: string
  token?: string
}

/**
 * 密码重置响应
 */
export interface ResetPasswordResponse {
  success: boolean
  message: string
  requiresLogin?: boolean
}

/**
 * 密码修改响应
 */
export interface ChangePasswordResponse {
  success: boolean
  message: string
}

/**
 * 社交登录响应
 */
export interface SocialLoginResponse extends LoginResponse {
  provider: string
  isNewUser: boolean
}

/**
 * 用户会话信息
 */
export interface UserSession {
  sessionId: string
  userId: string
  loginTime: number
  lastActivity: number
  expiresAt: number
  deviceInfo: DeviceInfo
  isCurrent: boolean
}

/**
 * Token验证响应
 */
export interface TokenValidationResponse {
  valid: boolean
  userId?: string
  username?: string
  expiresAt?: number
  scopes?: string[]
}

/**
 * Token刷新请求
 */
export interface TokenRefreshRequest {
  refreshToken: string
  clientId?: string
  clientSecret?: string
}

/**
 * Token刷新响应
 */
export interface TokenRefreshResponse {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
}

/**
 * 认证错误响应
 */
export interface AuthErrorResponse {
  error: string
  errorDescription?: string
  errorUri?: string
  code?: string
  details?: any
}

/**
 * 认证配置
 */
export interface AuthConfig {
  baseUrl: string
  clientId: string
  clientSecret?: string
  scope: string[]
  tokenStorage: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory'
  autoRefresh: boolean
  refreshThreshold: number
  sessionTimeout: number
  endpoints: AuthEndpoints
}

/**
 * 认证端点配置
 */
export interface AuthEndpoints {
  login: string
  register: string
  logout: string
  refresh: string
  verify: string
  resetPassword: string
  changePassword: string
  socialLogin: string
  sendVerificationCode: string
  verifyCode: string
  validateToken: string
  userInfo: string
}

/**
 * 认证事件类型
 */
export type AuthEventType = 
  | 'login'
  | 'logout' 
  | 'token_expired'
  | 'token_refreshed'
  | 'session_timeout'
  | 'verification_sent'
  | 'verification_verified'

/**
 * 认证事件数据
 */
export interface AuthEventData {
  type: AuthEventType
  timestamp: number
  data?: any
  userId?: string
}

/**
 * 认证状态枚举
 */
export enum AuthStatus {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  EXPIRED = 'expired',
  REFRESHING = 'refreshing',
  ERROR = 'error'
}

/**
 * 权限检查结果
 */
export interface PermissionCheckResult {
  hasPermission: boolean
  missingPermissions?: string[]
  hasAll: boolean
}

/**
 * 角色检查结果
 */
export interface RoleCheckResult {
  hasRole: boolean
  missingRoles?: string[]
  hasAll: boolean
}