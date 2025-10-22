/**
 * 认证状态接口 - 定义认证相关的状态数据结构
 */
import type { UserResponse } from 'sdkwork-sdk-api-typescript';
import type { LoginParam, RegisterParam, LoginResultResponse, AuthUserResponse } from 'sdkwork-sdk-api-typescript';

export interface AuthState {
  // 认证状态
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;

  // 用户信息
  currentUser: UserResponse | null;
  
  // 加载状态
  loading: boolean;
  error: Error | null;

  // 认证流程状态
  verification: {
    identifier: string | null;
    method: 'email' | 'phone' | null;
    type: 'registration' | 'password_reset' | 'login' | null;
    sentAt: number | null;
    expiresAt: number | null;
  };

  // 会话管理
  session: {
    lastActivity: number;
    sessionTimeout: number;
    autoLogout: boolean;
  };
}

/**
 * 登录请求参数 - 与SDK LoginParam保持一致
 */
export interface LoginRequest extends LoginParam {
  rememberMe?: boolean;
  //登陆成功跳转URL
  redirectUrl?: string;
}

/**
 * 登录响应数据 - 与SDK LoginResult保持一致
 */
export interface LoginResponse extends LoginResultResponse {
  user: UserResponse;
}

/**
 * 注册请求参数 - 与SDK RegisterParam保持一致
 */
export interface RegisterRequest extends RegisterParam {
  // 扩展字段
  confirmPassword?: string;
  agreed?: boolean;
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  user: UserResponse;
  requiresVerification: boolean;
}

/**
 * 验证码发送请求参数
 */
export interface VerificationCodeRequest {
  identifier: string;
  method: 'email' | 'phone';
  type: 'registration' | 'password_reset' | 'login';
}

/**
 * 身份验证请求参数
 */
export interface VerifyIdentityRequest {
  identifier: string;
  verificationCode: string;
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  identifier: string;
  verificationCode: string;
  newPassword: string;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
}

/**
 * 社交登录请求参数
 */
export interface SocialLoginRequest {
  provider: 'wechat' | 'qq' | 'github' | 'google';
  code: string;
  state?: string;
}

/**
 * 认证错误类型
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

/**
 * 认证配置选项
 */
export interface AuthConfig {
  tokenStorage: 'localStorage' | 'sessionStorage' | 'cookie';
  autoRefresh: boolean;
  refreshThreshold: number;
  sessionTimeout: number;
}

/**
 * 用户会话信息
 */
export interface UserSession {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  loginTime: number;
  lastActivity: number;
}