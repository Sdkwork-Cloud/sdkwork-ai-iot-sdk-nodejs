// ==================== 认证 Store 类型定义 ====================

import type { UserResponse } from 'sdkwork-sdk-api-typescript';
import type { LoginParam, RegisterParam, LoginResultResponse, AuthUserResponse } from 'sdkwork-sdk-api-typescript';

// ==================== 基础类型定义 ====================

/**
 * 认证状态枚举
 */
export enum AuthStateEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * 认证状态接口 - 定义认证相关的状态数据结构
 */
export interface AuthState {
  // 基础状态
  state: AuthStateEnum;
  errorMessage: string;
  initialized: boolean;

  // 认证状态
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;

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
 * OAuth2平台类型
 */
export type OAuthProvider = 'wechat' | 'qq' | 'github' | 'google' | 'facebook' | 'twitter' | 'linkedin' | 'microsoft' | 'apple' | 'dingtalk' | 'feishu';

/**
 * OAuth2平台配置
 */
export interface OAuthPlatformConfig {
  provider: OAuthProvider;
  enabled: boolean;
  clientId: string;
  clientSecret?: string;
  scope: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  redirectUri: string;
  displayName: string;
  icon: string;
  color: string;
}

/**
 * OAuth2授权请求参数
 */
export interface OAuthAuthorizeRequest {
  provider: OAuthProvider;
  state?: string;
  redirectUri?: string;
}

/**
 * OAuth2回调参数
 */
export interface OAuthCallbackParams {
  code: string;
  state?: string;
  error?: string;
  error_description?: string;
}

/**
 * OAuth2令牌响应
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

/**
 * OAuth2用户信息
 */
export interface OAuthUserInfo {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider: OAuthProvider;
}

/**
 * 社交登录请求参数
 */
export interface SocialLoginRequest {
  provider: OAuthProvider;
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

// ==================== Store 类型定义 ====================

/**
 * 认证 Store 状态接口
 */
export interface AuthStoreState {
  // 基础状态
  state: AuthStateEnum;
  errorMessage: string;
  initialized: boolean;

  // 认证状态
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;

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

  // 私有状态（不会被响应式监听）
  _authService: any;
}

/**
 * 登出选项接口
 */
export interface LogoutOptions {
  /**
   * 是否跳转到首页
   */
  redirectToHome?: boolean;
  /**
   * 自定义跳转URL（优先级高于redirectToHome）
   */
  redirectUrl?: string;
}

/**
 * 绑定手机号请求参数
 */
export interface BindMobileRequest {
  phone: string;
  verificationCode: string;
  userId?: string;
}

/**
 * 绑定手机号响应数据
 */
export interface BindMobileResponse {
  success: boolean;
  message: string;
  phone?: string;
}

/**
 * 忘记密码请求参数
 */
export interface ForgotPasswordRequest {
  identifier: string;
  method: 'email' | 'phone';
}

/**
 * 忘记密码响应数据
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  requiresVerification: boolean;
}

/**
 * 验证码验证请求参数
 */
export interface VerifyCodeRequest {
  identifier: string;
  verificationCode: string;
  type: 'registration' | 'password_reset' | 'login' | 'bind_mobile';
}

/**
 * 验证码验证响应数据
 */
export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  token?: string;
}

/**
 * 认证 Store 操作接口
 */
export interface AuthStoreActions {
  // 认证基础操作
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (userData: RegisterRequest) => Promise<RegisterResponse>;
  logout: (options?: LogoutOptions) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  
  // 验证码操作
  sendVerificationCode: (request: VerificationCodeRequest) => Promise<boolean>;
  verifyIdentity: (request: VerifyIdentityRequest) => Promise<boolean>;
  resetPassword: (request: ResetPasswordRequest) => Promise<boolean>;
  changePassword: (request: ChangePasswordRequest) => Promise<boolean>;
  
  // 社交登录
  socialLogin: (request: SocialLoginRequest) => Promise<LoginResponse>;
  
  // 状态管理
  setState: (state: AuthStateEnum) => void;
  setError: (message: string) => void;
  clearError: () => void;
  clearState: () => void;
  
  // 会话管理
  updateSessionActivity: () => void;
  checkSessionTimeout: () => boolean;
  
  // 初始化
  initialize: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
}

/**
 * 认证 Store Getters 接口
 */
export interface AuthStoreGetters {
  // 状态检查
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;

  // 认证状态相关
  hasToken: boolean;
  hasRefreshToken: boolean;
  isTokenExpiring: boolean;
  isSessionExpired: boolean;
  hasVerification: boolean;

  // 用户信息相关（代理到userStore）
  currentUser: any;
  hasCurrentUser: boolean;
  userDisplayName: string;
}

/**
 * 认证 Store 完整接口
 */
export interface AuthStore extends AuthStoreState, AuthStoreActions, AuthStoreGetters {}

/**
 * 认证 Store 创建选项
 */
export interface AuthStoreOptions {
  // 初始配置
  initialSessionTimeout?: number;
  
  // 持久化选项
  persist?: boolean;
  persistKey?: string;
  
  // 事件回调
  onStateChange?: (state: AuthStateEnum) => void;
  onLogin?: (response: LoginResponse) => void;
  onLogout?: () => void;
  onError?: (error: AuthError) => void;
}