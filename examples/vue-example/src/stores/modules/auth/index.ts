import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  AuthState, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  VerificationCodeRequest,
  VerifyIdentityRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SocialLoginRequest,
  AuthError
} from './types'
import { UserStatus, RegisterType, LoginParam, RegisterParam, RefreshTokenParam } from 'sdkwork-sdk-api-typescript'
import { AuthAuthenticationService } from '@/services/src/service/auth/authentication/authentication'

export const useAuthStore = defineStore('auth', () => {
  // Service实例 - 业务逻辑封装层，保持固定不变
  const authService = new AuthAuthenticationService()

  // State - 基于现有数据结构，严格遵循数据操作规范
  const state = ref<AuthState>({
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
    currentUser: null,
    loading: false,
    error: null,
    verification: {
      identifier: null,
      method: null,
      type: null,
      sentAt: null,
      expiresAt: null
    },
    session: {
      lastActivity: Date.now(),
      sessionTimeout: 30 * 60 * 1000, // 30分钟
      autoLogout: true
    }
  })

  // Getters
  const isAuthenticated = computed(() => state.value.isAuthenticated)
  const currentUser = computed(() => state.value.currentUser)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const token = computed(() => state.value.token)
  const hasToken = computed(() => !!state.value.token)

  // 检查token是否即将过期
  const isTokenExpiring = computed(() => {
    if (!state.value.tokenExpiry) return false
    const threshold = 5 * 60 * 1000 // 5分钟阈值
    return Date.now() >= (state.value.tokenExpiry - threshold)
  })

  // 检查会话是否超时
  const isSessionExpired = computed(() => {
    const { lastActivity, sessionTimeout } = state.value.session
    return Date.now() - lastActivity > sessionTimeout
  })

  // Actions
  const setLoading = (loading: boolean) => {
    state.value.loading = loading
  }

  const setError = (error: Error | null) => {
    state.value.error = error
  }

  const updateSessionActivity = () => {
    state.value.session.lastActivity = Date.now()
  }

  // 登录 - 严格遵循架构分层规范：业务逻辑在store层处理
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setLoading(true)
      setError(null)

      // 1. 参数验证 - 遵循安全编码规范
      if (!credentials.username || !credentials.password) {
        throw new Error('用户名和密码不能为空')
      }

      // 2. 调用AuthAuthenticationService进行登录 - service层保持固定不变
      const loginParam: LoginParam = {
        username: credentials.username,
        password: credentials.password,
        type: credentials.type
      }

      const loginResult = await authService.login(loginParam)

      // 3. 数据转换和验证 - store层业务逻辑处理
      if (!loginResult.token) {
        throw new Error('登录响应无效：缺少访问令牌')
      }

      // 4. 构建登录响应数据 - 基于现有数据结构，VO层封装
      const response: LoginResponse = {
        token: loginResult.token,
        refreshToken: loginResult.refreshToken || '',
        expiresIn: loginResult.expiresIn || 3600,
        user: loginResult.user || {
          id: loginResult.userId || '',
          username: credentials.username,
          email: credentials.username?.includes('@') ? credentials.username : `${credentials.username}@example.com`,
          phone: '',
          nickname: credentials.username,
          status: UserStatus.ACTIVE,
          gender: undefined,
          faceImage: undefined,
          faceVideo: undefined,
          roleIds: [],
          roleNames: []
        }
      }

      // 5. 状态管理 - 遵循用户会话状态生命周期管理
      state.value.isAuthenticated = true
      state.value.token = response.token as string
      state.value.refreshToken = response.refreshToken as string 
      state.value.currentUser = response.user
      state.value.session.lastActivity = Date.now()

      // 6. 安全存储 - 实施严格的安全防护措施
      const storage = credentials.rememberMe ? localStorage : sessionStorage
      storage.setItem('auth_token', response.token as string)
      storage.setItem('auth_refresh_token', response.refreshToken as string)
      storage.setItem('auth_user', JSON.stringify(response.user)) 

      console.info('用户登录成功，状态已更新')
      return response
    } catch (error) {
      // 错误处理 - 完善的错误处理与异常捕获机制
      const errorMessage = error instanceof Error ? error.message : '登录失败'
      const authError: AuthError = {
        code: 'LOGIN_FAILED',
        message: errorMessage, 
      }
      setError(new Error(JSON.stringify(authError)))
      console.error('用户登录失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 注册 - 严格遵循架构分层规范：业务逻辑在store层处理
  const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      setLoading(true)
      setError(null)

      // 1. 参数验证 - 遵循安全编码规范
      if (!userData.username || !userData.password || !userData.confirmPassword) {
        throw new Error('用户名、密码和确认密码不能为空')
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('密码和确认密码不匹配')
      }

      // 2. 调用AuthAuthenticationService进行注册 - service层保持固定不变
      const registerParam: RegisterParam = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        phone: userData.phone,
        type: userData.type,
        captcha: userData.captcha,
        verificationCode: userData.verificationCode,
        invitationCode: userData.invitationCode,
        confirmPassword: userData.confirmPassword
      }

      const authUser = await authService.register(registerParam)

      // 3. 构建注册响应数据 - 基于现有数据结构，VO层封装
      const response: RegisterResponse = {
        user: authUser,
        requiresVerification: false
      }

      return response
    } catch (error) {
      // 错误处理 - 完善的错误处理与异常捕获机制
      const errorMessage = error instanceof Error ? error.message : '注册失败'
      const authError: AuthError = {
        code: 'REGISTER_FAILED',
        message: errorMessage, 
      }
      setError(new Error(JSON.stringify(authError)))
      console.error('用户注册失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 发送验证码
  const sendVerificationCode = async (request: VerificationCodeRequest): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      await new Promise((resolve) => {
        setTimeout(() => {
          state.value.verification = {
            identifier: request.identifier,
            method: request.method,
            type: request.type,
            sentAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟过期
          }
          resolve(void 0)
        }, 500)
      })
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 验证身份
  const verifyIdentity = async (request: VerifyIdentityRequest): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // 模拟验证码验证
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (request.verificationCode === '123456') {
            resolve(true)
          } else {
            reject(new Error('验证码错误'))
          }
        }, 500)
      })

      return true
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 重置密码
  const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(void 0)
        }, 1000)
      })
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 修改密码
  const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(void 0)
        }, 1000)
      })
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 社交登录
  const socialLogin = async (request: SocialLoginRequest): Promise<LoginResponse> => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      const response: LoginResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'mock-social-token-' + Date.now(),
            refreshToken: 'mock-social-refresh-token-' + Date.now(),
            expiresIn: 3600,
            user: {
              id: 'user-social-' + Date.now(),
              username: `user_${request.provider}`,
              email: `user_${request.provider}@example.com`,
              phone: '13800138000',
              faceImage: {url:'https://via.placeholder.com/100',},
              nickname: `Social User ${request.provider}`,
              status: UserStatus.ACTIVE,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          })
        }, 1000)
      })

      // 更新状态
      state.value.isAuthenticated = true
      state.value.token = response.token as string
      state.value.refreshToken = response.refreshToken as string 
      state.value.currentUser = response.user

      return response
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 退出登录 - 严格遵循架构分层规范：业务逻辑在store层处理
  const logout = async () => {
    try {
      // 1. 调用AuthAuthenticationService进行退出登录 - service层保持固定不变
      await authService.logout()
    } catch (error) {
      console.warn('退出登录后端调用失败，继续执行前端清理:', error)
    } finally {
      // 2. 状态清理 - 遵循用户会话状态生命周期管理
      state.value.isAuthenticated = false
      state.value.token = null
      state.value.refreshToken = null
      state.value.tokenExpiry = null
      state.value.currentUser = null
      state.value.verification = {
        identifier: null,
        method: null,
        type: null,
        sentAt: null,
        expiresAt: null
      }

      // 3. 安全清理 - 实施严格的安全防护措施
      const storageKeys = [
        'auth_token', 'auth_refresh_token', 'auth_user', 'auth_token_expiry'
      ]
      
      storageKeys.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
      
      console.info('用户退出登录完成')
    }
  }

  // 刷新token - 严格遵循架构分层规范：业务逻辑在store层处理
  const refreshToken = async (): Promise<string> => {
    try {
      // 1. 前置检查 - 遵循安全编码规范
      if (!state.value.refreshToken) {
        throw new Error('刷新令牌不可用')
      }

      // 2. 调用AuthAuthenticationService刷新令牌 - service层保持固定不变
      const refreshTokenParam: RefreshTokenParam = {
        refreshToken: state.value.refreshToken
      }

      const loginResult = await authService.refreshToken(refreshTokenParam)

      // 3. 数据验证 - store层业务逻辑处理
      if (!loginResult.token) {
        throw new Error('令牌刷新失败：响应无效')
      }

      // 4. 状态更新 - 遵循用户会话状态生命周期管理
      state.value.token = loginResult.token
      state.value.refreshToken = loginResult.refreshToken || state.value.refreshToken 

      // 5. 安全存储更新 - 实施严格的安全防护措施
      const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage
      storage.setItem('auth_token', loginResult.token)
      if (loginResult.refreshToken) {
        storage.setItem('auth_refresh_token', loginResult.refreshToken)
      } 

      console.info('访问令牌刷新成功')
      return loginResult.token
    } catch (error) {
      // 错误处理 - 完善的错误处理与异常捕获机制
      console.error('令牌刷新失败:', error)
      
      // 令牌刷新失败时自动退出登录
      logout()
      throw error
    }
  }

  // 检查认证状态 - 严格遵循架构分层规范：业务逻辑在store层处理
  const checkAuth = async (): Promise<boolean> => {
    try {
      // 1. 检查本地存储 - 遵循安全编码规范
      const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      const storedTokenExpiry = localStorage.getItem('auth_token_expiry') || sessionStorage.getItem('auth_token_expiry')
      
      if (!storedToken) {
        return false
      }

      // 2. 检查token是否过期
      if (storedTokenExpiry && parseInt(storedTokenExpiry) < Date.now()) {
        console.warn('访问令牌已过期，尝试刷新')
        await refreshToken()
        return true
      }

      // 3. 调用AuthAuthenticationService验证token有效性 - service层保持固定不变
      const currentUser = await authService.getCurrentUser()
      
      if (!currentUser) {
        throw new Error('获取用户信息失败：token可能无效')
      }

      // 4. 状态恢复 - 遵循用户会话状态生命周期管理
      state.value.isAuthenticated = true
      state.value.token = storedToken
      state.value.currentUser = currentUser
      
      // 从存储中恢复其他状态
      const storedRefreshToken = localStorage.getItem('auth_refresh_token') || sessionStorage.getItem('auth_refresh_token')
      if (storedRefreshToken) {
        state.value.refreshToken = storedRefreshToken
      }
      
      if (storedTokenExpiry) {
        state.value.tokenExpiry = parseInt(storedTokenExpiry)
      } else {
        state.value.tokenExpiry = Date.now() + 3600 * 1000 // 默认1小时
      }
      
      state.value.session.lastActivity = Date.now()

      console.info('认证状态检查成功')
      return true
    } catch (error) {
      // 错误处理 - 完善的错误处理与异常捕获机制
      console.warn('认证状态检查失败，执行退出登录:', error)
      
      // 认证失败时自动清理状态
      logout()
      return false
    }
  }

  // 检查是否为登录用户
  const isLoginUser = (userId: string): boolean => {
    return state.value.currentUser?.id === userId
  }

  return {
    // State
    state,

    // Getters
    isAuthenticated,
    currentUser,
    loading,
    error,
    token,
    hasToken,
    isTokenExpiring,
    isSessionExpired,

    // Actions
    login,
    register,
    sendVerificationCode,
    verifyIdentity,
    resetPassword,
    changePassword,
    socialLogin,
    logout,
    refreshToken,
    checkAuth,
    isLoginUser,
    updateSessionActivity,
    setLoading,
    setError
  }
})