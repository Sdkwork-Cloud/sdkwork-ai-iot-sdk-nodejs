/**
 * 认证服务实现
 */
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  VerificationCodeRequest,
  VerificationCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  TokenValidationResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  AuthConfig,
  AuthErrorResponse
} from './types'
import type { UserVO } from '../user/types'

export class AuthService {
  private config: AuthConfig

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api/auth',
      clientId: config.clientId || 'web-client',
      clientSecret: config.clientSecret,
      scope: config.scope || ['openid', 'profile', 'email'],
      tokenStorage: config.tokenStorage || 'localStorage',
      autoRefresh: config.autoRefresh ?? true,
      refreshThreshold: config.refreshThreshold || 5 * 60 * 1000, // 5分钟
      sessionTimeout: config.sessionTimeout || 30 * 60 * 1000, // 30分钟
      endpoints: {
        login: config.endpoints?.login || '/login',
        register: config.endpoints?.register || '/register',
        logout: config.endpoints?.logout || '/logout',
        refresh: config.endpoints?.refresh || '/refresh',
        verify: config.endpoints?.verify || '/verify',
        resetPassword: config.endpoints?.resetPassword || '/reset-password',
        changePassword: config.endpoints?.changePassword || '/change-password',
        socialLogin: config.endpoints?.socialLogin || '/social',
        sendVerificationCode: config.endpoints?.sendVerificationCode || '/verification/send',
        verifyCode: config.endpoints?.verifyCode || '/verification/verify',
        validateToken: config.endpoints?.validateToken || '/validate',
        userInfo: config.endpoints?.userInfo || '/userinfo'
      }
    }
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(this.config.endpoints.login, {
      method: 'POST',
      body: JSON.stringify({
        ...credentials,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'password',
        scope: this.config.scope.join(' ')
      })
    })

    // 存储token
    this.storeTokens(response.accessToken, response.refreshToken, response.expiresIn)

    return response
  }

  /**
   * 用户注册
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>(this.config.endpoints.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(request: VerificationCodeRequest): Promise<VerificationCodeResponse> {
    return this.request<VerificationCodeResponse>(this.config.endpoints.sendVerificationCode, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * 验证验证码
   */
  async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    return this.request<VerifyCodeResponse>(this.config.endpoints.verifyCode, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * 重置密码
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.request<ResetPasswordResponse>(this.config.endpoints.resetPassword, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * 修改密码
   */
  async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>(this.config.endpoints.changePassword, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`
      },
      body: JSON.stringify(request)
    })
  }

  /**
   * 社交登录
   */
  async socialLogin(request: SocialLoginRequest): Promise<SocialLoginResponse> {
    const response = await this.request<SocialLoginResponse>(this.config.endpoints.socialLogin, {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    })

    // 存储token
    this.storeTokens(response.accessToken, response.refreshToken, response.expiresIn)

    return response
  }

  /**
   * 验证token
   */
  async validateToken(token?: string): Promise<TokenValidationResponse> {
    const tokenToValidate = token || this.getAccessToken()
    if (!tokenToValidate) {
      return { valid: false }
    }

    return this.request<TokenValidationResponse>(this.config.endpoints.validateToken, {
      method: 'POST',
      body: JSON.stringify({ token: tokenToValidate })
    })
  }

  /**
   * 刷新token
   */
  async refreshToken(request?: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    const refreshToken = request?.refreshToken || this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.request<TokenRefreshResponse>(this.config.endpoints.refresh, {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token'
      })
    })

    // 更新存储的token
    this.storeTokens(response.accessToken, response.refreshToken as string, response.expiresIn)

    return response
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<UserVO> {
    return this.request<UserVO>(this.config.endpoints.userInfo, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`
      }
    })
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    try {
      await this.request(this.config.endpoints.logout, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`
        }
      })
    } catch (error) {
      console.warn('Logout request failed:', error)
    } finally {
      this.clearTokens()
    }
  }

  /**
   * 检查token是否需要刷新
   */
  shouldRefreshToken(): boolean {
    if (!this.config.autoRefresh) return false

    const token = this.getAccessToken()
    const expiry = this.getTokenExpiry()

    if (!token || !expiry) return false

    const now = Date.now()
    const threshold = this.config.refreshThreshold

    return (expiry - now) <= threshold
  }

  /**
   * 获取存储的access token
   */
  getAccessToken(): string | null {
    return this.getStoredToken('access_token')
  }

  /**
   * 获取存储的refresh token
   */
  getRefreshToken(): string | null {
    return this.getStoredToken('refresh_token')
  }

  /**
   * 获取token过期时间
   */
  getTokenExpiry(): number | null {
    const expiry = this.getStorage().getItem('token_expiry')
    return expiry ? parseInt(expiry, 10) : null
  }

  /**
   * 存储token
   */
  private storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const storage = this.getStorage()
    const expiry = Date.now() + expiresIn * 1000

    storage.setItem('access_token', accessToken)
    storage.setItem('refresh_token', refreshToken)
    storage.setItem('token_expiry', expiry.toString())
  }

  /**
   * 清除存储的token
   */
  private clearTokens(): void {
    const storage = this.getStorage()
    storage.removeItem('access_token')
    storage.removeItem('refresh_token')
    storage.removeItem('token_expiry')
  }

  /**
   * 获取存储的token
   */
  private getStoredToken(type: 'access_token' | 'refresh_token'): string | null {
    return this.getStorage().getItem(type)
  }

  /**
   * 获取存储实例
   */
  private getStorage(): Storage {
    switch (this.config.tokenStorage) {
      case 'localStorage':
        return localStorage
      case 'sessionStorage':
        return sessionStorage
      case 'cookie':
        // 简单实现，实际项目中应该使用更完善的cookie处理
        return {
          getItem: (key: string) => {
            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
              const [cookieKey, cookieValue] = cookie.trim().split('=')
              if (cookieKey === key) {
                return decodeURIComponent(cookieValue)
              }
            }
            return null
          },
          setItem: (key: string, value: string) => {
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`
          },
          removeItem: (key: string) => {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        } as Storage
      default:
        // 内存存储
        const memoryStorage: Record<string, string> = {}
        return {
          getItem: (key: string) => memoryStorage[key] || null,
          setItem: (key: string, value: string) => { memoryStorage[key] = value },
          removeItem: (key: string) => { delete memoryStorage[key] }
        } as Storage
    }
  }

  /**
   * 通用请求方法
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData: AuthErrorResponse = await response.json().catch(() => ({
          error: 'unknown_error',
          errorDescription: 'An unknown error occurred'
        }))

        throw new Error(errorData.errorDescription || errorData.error || 'Request failed')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }
}

// 创建默认实例
export const authService = new AuthService()

// 导出类型
export * from './types'