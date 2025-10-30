// ==================== 认证 Store 实现 ====================

import { defineStore } from 'pinia'
import { AuthAuthenticationService } from '@/services/src/service/auth/authentication/authentication'
import { useUserStore } from '../user/user'
import { tokenManager } from '@/core/framework/token/manager'
import {
  AuthStoreState,
  AuthStoreActions,
  AuthStoreGetters,
  AuthStateEnum,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerificationCodeRequest,
  VerifyIdentityRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SocialLoginRequest,
  BindMobileRequest,
  BindMobileResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  OAuthProvider,
  OAuthPlatformConfig,
  OAuthAuthorizeRequest,
  OAuthCallbackParams,
  OAuthTokenResponse,
  OAuthUserInfo
} from './types'
import { UserStatus, LoginParam, RegisterParam, RefreshTokenParam } from 'sdkwork-sdk-api-typescript'
 

export const useAuthStore = defineStore('auth', {
  // ==================== State ====================
  state: (): AuthStoreState => ({
    state: AuthStateEnum.IDLE,
    errorMessage: '',
    initialized: false,
    isAuthenticated: false,
    token: null as string | null,
    refreshToken: null as string | null,
    tokenExpiry: null as number | null,
    verification: {
      identifier: null as string | null,
      method: null as 'email' | 'phone' | null,
      type: null as 'registration' | 'password_reset' | 'login' | null,
      sentAt: null as number | null,
      expiresAt: null as number | null
    },
    session: {
      lastActivity: Date.now(),
      sessionTimeout: 30 * 60 * 1000,
      autoLogout: true
    },

    // 私有状态
    _authService: new AuthAuthenticationService()
  }),

  // ==================== Getters ====================
  getters: {
    // 基础状态检查
    isLoading: (state) => state.state === AuthStateEnum.LOADING,
    isSuccess: (state) => state.state === AuthStateEnum.SUCCESS,
    isError: (state) => state.state === AuthStateEnum.ERROR,
    isIdle: (state) => state.state === AuthStateEnum.IDLE,

    // 认证状态判断
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    isLoggedOut: (state) => !state.isAuthenticated && !state.token,

    // 流程状态判断
    isLoggingIn: (state) => state.state === AuthStateEnum.LOADING && !state.isAuthenticated,
    isLoggingOut: (state) => state.state === AuthStateEnum.LOADING && state.isAuthenticated,
    isRegistering: (state) => state.state === AuthStateEnum.LOADING && state.verification.type === 'registration',
    isVerifying: (state) => state.state === AuthStateEnum.LOADING && state.verification.identifier !== null,

    // Token 状态判断
    hasToken: (state) => !!state.token,
    hasRefreshToken: (state) => !!state.refreshToken,
    hasValidToken: (state) => {
      if (!state.token || !state.tokenExpiry) return false
      return Date.now() < state.tokenExpiry
    },
    isTokenExpiring: (state) => {
      if (!state.tokenExpiry) return false
      const threshold = 5 * 60 * 1000
      return Date.now() >= (state.tokenExpiry - threshold)
    },

    // 会话状态判断
    isSessionExpired: (state) => {
      const { lastActivity, sessionTimeout } = state.session
      return Date.now() - lastActivity > sessionTimeout
    },

    // 验证码状态判断
    hasVerification: (state) => {
      return state.verification.identifier !== null &&
        state.verification.expiresAt !== null &&
        state.verification.expiresAt > Date.now()
    },

    // 用户状态代理
    currentUser: () => {
      const userStore = useUserStore()
      return userStore.currentUser
    },
    hasCurrentUser: () => {
      const userStore = useUserStore()
      return userStore.hasCurrentUser
    },

    // 组合状态判断
    canLogin: (state) => state.state === AuthStateEnum.IDLE && !state.isAuthenticated,
    canLogout: (state) => state.isAuthenticated && state.state !== AuthStateEnum.LOADING,
  },

  // ==================== Actions ====================
  actions: {
    // 状态管理
    setState(newState: AuthStateEnum) {
      this.state = newState
    },

    setError(message: string) {
      this.errorMessage = message
      this.state = AuthStateEnum.ERROR
    },

    clearError() {
      this.errorMessage = ''
      this.state = AuthStateEnum.IDLE
    },

    // 会话管理
    updateSessionActivity() {
      this.session.lastActivity = Date.now()
    },

    // 检查认证状态（用于页面刷新时恢复状态）
    async checkAuthStatus(): Promise<boolean> {
      try {
        // 从tokenManager获取token
        const authToken = tokenManager.getAuthToken()
        const refreshToken = tokenManager.getRefreshToken()
        
        if (!authToken) {
          // 没有token，用户未登录
          this.isAuthenticated = false
          this.token = null
          this.refreshToken = null
          this.tokenExpiry = null
          return false
        }

        // 有token，检查token是否有效
        this.token = authToken
        this.refreshToken = refreshToken
        
        // 这里可以添加token验证逻辑，比如调用验证接口
        // 暂时假设token有效，设置认证状态
        this.isAuthenticated = true
        this.session.lastActivity = Date.now()
        
        // 尝试获取用户信息
        try {
          const userStore = useUserStore()
          // 这里可以调用获取用户信息的接口
          // 如果获取失败，说明token可能已失效
          console.log('Token存在，认证状态已恢复')
        } catch (error) {
          console.warn('获取用户信息失败，token可能已失效:', error)
          // token可能已失效，清除认证状态
          this.isAuthenticated = false
          this.token = null
          this.refreshToken = null
          tokenManager.clearTokens()
          return false
        }

        return true
      } catch (error) {
        console.error('检查认证状态失败:', error)
        // 出错时清除认证状态
        this.isAuthenticated = false
        this.token = null
        this.refreshToken = null
        tokenManager.clearTokens()
        return false
      }
    },

    // 登录操作
    async login(loginRequest: LoginRequest): Promise<LoginResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 参数验证
        if (!loginRequest.username || !loginRequest.password) {
          throw new Error('用户名和密码不能为空')
        } 

        const loginResult = await this._authService.login(loginRequest).catch((error: any) => {
             window.$message.error('登录失败  ') 
             this.setError(error.message)
        })

        // 数据验证
        if (!loginResult.token) {
          throw new Error('登录响应无效：缺少访问令牌')
        }

        // 构建响应
        const response: LoginResponse = {
          token: loginResult.token,
          refreshToken: loginResult.refreshToken || '',
          expiresIn: loginResult.expiresIn || 3600,
          user: loginResult.user || {
            id: loginResult.userId || '',
            username: loginRequest.username,
            email: loginRequest.username?.includes('@') ? loginRequest.username : `${loginRequest.username}@example.com`,
            phone: '',
            nickname: loginRequest.username,
            status: UserStatus.ACTIVE,
            gender: undefined,
            faceImage: undefined,
            faceVideo: undefined,
            roleIds: [],
            roleNames: []
          }
        }

        // 更新状态
        this.isAuthenticated = true
        this.token = response.token as string
        this.refreshToken = response.refreshToken as any
        this.session.lastActivity = Date.now()

        // 更新用户状态
        const userStore = useUserStore()
        userStore.setCurrentUser(response.user)

        // 使用 tokenManager 管理 token
        tokenManager.setAuthToken(response.token as string)
        tokenManager.setRefreshToken(response.refreshToken as string)

        // 触发登录成功事件
        if (window.$emit) {
          window.$emit('auth:login-success', response)
        }

        this.state = AuthStateEnum.SUCCESS
        console.info('用户登录成功')
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '登录失败'
        this.setError(errorMessage)
        console.error('用户登录失败:', error)
        throw error
      }
    },

    // 注册操作
    async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 参数验证
        if (!registerRequest.username || !registerRequest.password || !registerRequest.confirmPassword) {
          throw new Error('用户名、密码和确认密码不能为空')
        }

        if (registerRequest.password !== registerRequest.confirmPassword) {
          throw new Error('密码和确认密码不匹配')
        } 
        const authUser = await this._authService.register(registerRequest)

        // 构建响应
        const response: RegisterResponse = {
          user: authUser,
          requiresVerification: false
        }

        this.state = AuthStateEnum.SUCCESS
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '注册失败'
        this.setError(errorMessage)
        console.error('用户注册失败:', error)
        throw error
      }
    },

    // 登出操作
    async logout(options?: { redirectToHome?: boolean; redirectUrl?: string }) {
      this.state = AuthStateEnum.LOADING

      try {
        // 触发登出前事件
        if (window.$emit) {
          window.$emit('auth:logout-start')
        }

        // 使用 tokenManager 清除 token
        tokenManager.clearTokens()

        // 重置状态
        this.isAuthenticated = false
        this.token = null
        this.refreshToken = null
        this.tokenExpiry = null

        // 重置用户状态
        const userStore = useUserStore()
        userStore.setCurrentUser(null)

        // 触发登出成功事件
        if (window.$emit) {
          window.$emit('auth:logout-success')
        }

        this.state = AuthStateEnum.SUCCESS
        console.info('用户登出成功')

        // 处理跳转逻辑
        if (options?.redirectUrl) {
          // 优先使用自定义跳转URL
          window.location.href = options.redirectUrl
        } else if (options?.redirectToHome) {
          // 跳转到首页
          window.location.href = '/'
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '登出失败'
        this.setError(errorMessage)
        console.error('用户登出失败:', error)
        throw error
      }
    },

    // 刷新token操作
    async handleRefreshToken(): Promise<string | null> {
      if (!this.refreshToken) {
        this.setError('没有可用的刷新令牌')
        return null
      }

      this.state = AuthStateEnum.LOADING

      try {
        const refreshParam: RefreshTokenParam = {
          refreshToken: this.refreshToken
        }

        const result = await this._authService.refreshToken(refreshParam)

        if (result.token) {
          this.token = result.token
          this.refreshToken = result.refreshToken || this.refreshToken
          this.session.lastActivity = Date.now()

          // 使用 tokenManager 更新 token
          tokenManager.setAuthToken(result.token)
          if (result.refreshToken) {
            tokenManager.setRefreshToken(result.refreshToken)
          }

          this.state = AuthStateEnum.SUCCESS
          return result.token
        }

        this.setError('刷新令牌失败')
        return null
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '刷新令牌失败'
        this.setError(errorMessage)
        console.error('刷新令牌失败:', error)
        return null
      }
    },

    // 验证码操作
    async sendVerificationCode(request: VerificationCodeRequest): Promise<boolean> {
      this.state = AuthStateEnum.LOADING

      try {
        // 模拟发送验证码
        this.verification = {
          identifier: request.identifier,
          method: request.method,
          type: request.type,
          sentAt: Date.now(),
          expiresAt: Date.now() + 10 * 60 * 1000
        }

        this.state = AuthStateEnum.SUCCESS
        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '发送验证码失败'
        this.setError(errorMessage)
        console.error('发送验证码失败:', error)
        return false
      }
    },

    async verifyIdentity(request: VerifyIdentityRequest): Promise<boolean> {
      this.state = AuthStateEnum.LOADING

      try {
        // 检查验证码是否有效
        if (!this.verification.expiresAt || this.verification.expiresAt < Date.now()) {
          throw new Error('验证码已过期')
        }

        if (this.verification.identifier !== request.identifier) {
          throw new Error('验证码不匹配')
        }

        // 这里应该调用相应的service方法进行验证
        // const result = await this._authService.verifyIdentity(request)

        // 验证成功后清除验证码状态
        this.verification = {
          identifier: null,
          method: null,
          type: null,
          sentAt: null,
          expiresAt: null
        }

        this.state = AuthStateEnum.SUCCESS
        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '验证身份失败'
        this.setError(errorMessage)
        console.error('验证身份失败:', error)
        return false
      }
    },

    // 密码操作
    async resetPassword(request: ResetPasswordRequest): Promise<boolean> {
      this.state = AuthStateEnum.LOADING

      try {
        // 这里应该调用相应的service方法
        // const result = await this._authService.resetPassword(request)

        this.state = AuthStateEnum.SUCCESS
        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '重置密码失败'
        this.setError(errorMessage)
        console.error('重置密码失败:', error)
        return false
      }
    },

    async changePassword(request: ChangePasswordRequest): Promise<boolean> {
      this.state = AuthStateEnum.LOADING

      try {
        // 这里应该调用相应的service方法
        // const result = await this._authService.changePassword(request)

        this.state = AuthStateEnum.SUCCESS
        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '修改密码失败'
        this.setError(errorMessage)
        console.error('修改密码失败:', error)
        return false
      }
    },

    // 社交登录
    async socialLogin(request: SocialLoginRequest): Promise<LoginResponse> {
      this.state = AuthStateEnum.LOADING

      try {
        // 这里应该调用相应的service方法
        // const result = await this._authService.socialLogin(request)

        // 模拟成功登录
        const response: LoginResponse = {
          token: 'social_token_' + Date.now(),
          refreshToken: 'social_refresh_token_' + Date.now(),
          expiresIn: 3600,
          user: {
            id: 'social_user_' + Date.now(),
            username: request.provider + '_user',
            email: request.provider + '@example.com',
            phone: '',
            nickname: request.provider + '用户',
            status: UserStatus.ACTIVE,
            gender: undefined,
            faceImage: undefined,
            faceVideo: undefined,
            roleIds: [],
            roleNames: []
          }
        }

        // 更新认证状态
        this.isAuthenticated = true
        this.token = response.token as any
        this.refreshToken = response.refreshToken as any
        this.session.lastActivity = Date.now()

        // 更新用户状态（通过userStore）
        const userStore = useUserStore()
        userStore.setCurrentUser(response.user)

        this.state = AuthStateEnum.SUCCESS
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '社交登录失败'
        this.setError(errorMessage)
        console.error('社交登录失败:', error)
        throw error
      }
    },

    // 会话管理
    checkSessionTimeout(): boolean {
      const isExpired = this.isSessionExpired
      if (isExpired && this.session.autoLogout) {
        this.logout()
      }
      return isExpired
    },

    // 初始化
    async initialize() {
      if (this.initialized) return

      this.state = AuthStateEnum.LOADING

      try {
        // 尝试恢复会话
        await this.restoreSession()

        this.initialized = true
        this.state = AuthStateEnum.SUCCESS
      } catch (error) {
        this.state = AuthStateEnum.IDLE
        console.warn('认证初始化失败:', error)
      }
    },

    async restoreSession(): Promise<boolean> {
      try {
        // 使用 tokenManager 获取 token
        let token = tokenManager.getAuthToken()
        let refreshToken = tokenManager.getRefreshToken()

        if (token && refreshToken) {
          this.token = token
          this.refreshToken = refreshToken
          this.isAuthenticated = true

          // 验证token是否有效
          // 这里可以添加token验证逻辑

          console.info('会话恢复成功')
          return true
        }

        return false
      } catch (error) {
        console.error('会话恢复失败:', error)
        return false
      }
    },

    // 状态清理
    clearState() {
      this.state = AuthStateEnum.IDLE
      this.errorMessage = ''
      this.isAuthenticated = false
      this.token = null
      this.refreshToken = null
      this.tokenExpiry = null
      this.verification = {
        identifier: null,
        method: null,
        type: null,
        sentAt: null,
        expiresAt: null
      }
    },

    // 绑定手机号操作
    async bindMobile(request: BindMobileRequest): Promise<BindMobileResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 参数验证
        if (!request.phone || !request.verificationCode) {
          throw new Error('手机号和验证码不能为空')
        }

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/
        if (!phoneRegex.test(request.phone)) {
          throw new Error('请输入有效的手机号')
        }

        // 这里应该调用相应的service方法
        // const result = await this._authService.bindMobile(request)

        // 模拟成功绑定
        const response: BindMobileResponse = {
          success: true,
          message: '手机号绑定成功',
          phone: request.phone
        }

        this.state = AuthStateEnum.SUCCESS
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '绑定手机号失败'
        this.setError(errorMessage)
        console.error('绑定手机号失败:', error)
        throw error
      }
    },

    // 忘记密码操作
    async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 参数验证
        if (!request.identifier) {
          throw new Error('请输入邮箱或手机号')
        }

        // 根据标识符类型验证格式
        if (request.method === 'email') {
          const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
          if (!emailRegex.test(request.identifier)) {
            throw new Error('请输入有效的邮箱地址')
          }
        } else if (request.method === 'phone') {
          const phoneRegex = /^1[3-9]\d{9}$/
          if (!phoneRegex.test(request.identifier)) {
            throw new Error('请输入有效的手机号')
          }
        }

        // 这里应该调用相应的service方法
        // const result = await this._authService.forgotPassword(request)

        // 设置验证码状态
        this.verification = {
          identifier: request.identifier,
          method: request.method,
          type: 'password_reset',
          sentAt: Date.now(),
          expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟有效
        }

        const response: ForgotPasswordResponse = {
          success: true,
          message: '验证码已发送，请查收',
          requiresVerification: true
        }

        this.state = AuthStateEnum.SUCCESS
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '忘记密码操作失败'
        this.setError(errorMessage)
        console.error('忘记密码操作失败:', error)
        throw error
      }
    },

    // 验证验证码操作
    async verifyCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 检查验证码是否有效
        if (!this.verification.expiresAt || this.verification.expiresAt < Date.now()) {
          throw new Error('验证码已过期')
        }

        if (this.verification.identifier !== request.identifier) {
          throw new Error('验证码不匹配')
        }

        if (this.verification.type !== request.type) {
          throw new Error('验证码类型不匹配')
        }

        // 这里应该调用相应的service方法进行验证
        // const result = await this._authService.verifyCode(request)

        // 验证成功后清除验证码状态
        this.verification = {
          identifier: null,
          method: null,
          type: null,
          sentAt: null,
          expiresAt: null
        }

        const response: VerifyCodeResponse = {
          success: true,
          message: '验证码验证成功'
        }

        this.state = AuthStateEnum.SUCCESS
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '验证码验证失败'
        this.setError(errorMessage)
        console.error('验证码验证失败:', error)
        throw error
      }
    },
 

    // ==================== OAuth2 相关方法 ====================

    // 获取OAuth2平台配置
    getOAuthPlatforms(): OAuthPlatformConfig[] {
      // 默认支持的OAuth2平台配置
      const defaultPlatforms: OAuthPlatformConfig[] = [
        {
          provider: 'github',
          enabled: true,
          clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
          scope: 'user:email',
          authorizationEndpoint: 'https://github.com/login/oauth/authorize',
          tokenEndpoint: 'https://github.com/login/oauth/access_token',
          userInfoEndpoint: 'https://api.github.com/user',
          redirectUri: `${window.location.origin}/oauth/callback`,
          displayName: 'GitHub',
          icon: 'i-mdi-github',
          color: '#333333'
        },
        {
          provider: 'google',
          enabled: true,
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          scope: 'openid email profile',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
          userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
          redirectUri: `${window.location.origin}/oauth/callback`,
          displayName: 'Google',
          icon: 'i-mdi-google',
          color: '#4285F4'
        },
        {
          provider: 'wechat',
          enabled: true,
          clientId: import.meta.env.VITE_WECHAT_CLIENT_ID || '',
          scope: 'snsapi_login',
          authorizationEndpoint: 'https://open.weixin.qq.com/connect/qrconnect',
          tokenEndpoint: 'https://api.weixin.qq.com/sns/oauth2/access_token',
          userInfoEndpoint: 'https://api.weixin.qq.com/sns/userinfo',
          redirectUri: `${window.location.origin}/oauth/callback`,
          displayName: '微信',
          icon: 'i-mdi-wechat',
          color: '#07C160'
        },
        {
          provider: 'qq',
          enabled: true,
          clientId: import.meta.env.VITE_QQ_CLIENT_ID || '',
          scope: 'get_user_info',
          authorizationEndpoint: 'https://graph.qq.com/oauth2.0/authorize',
          tokenEndpoint: 'https://graph.qq.com/oauth2.0/token',
          userInfoEndpoint: 'https://graph.qq.com/user/get_user_info',
          redirectUri: `${window.location.origin}/oauth/callback`,
          displayName: 'QQ',
          icon: 'i-mdi-qqchat',
          color: '#12B7F5'
        }
      ]

      // 过滤启用的平台
      return defaultPlatforms.filter(platform => platform.enabled && platform.clientId)
    },

    // 发起OAuth2授权请求
    authorizeOAuth(request: OAuthAuthorizeRequest): void {
      const platforms = this.getOAuthPlatforms()
      const platform = platforms.find(p => p.provider === request.provider)

      if (!platform) {
        throw new Error(`OAuth2平台 ${request.provider} 未配置或未启用`)
      }

      // 生成state参数用于防止CSRF攻击
      const state = request.state || this.generateState()
      
      // 存储state到sessionStorage
      sessionStorage.setItem(`oauth_state_${request.provider}`, state)

      // 构建授权URL
      const authUrl = new URL(platform.authorizationEndpoint)
      authUrl.searchParams.set('client_id', platform.clientId)
      authUrl.searchParams.set('redirect_uri', request.redirectUri || platform.redirectUri)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('scope', platform.scope)
      authUrl.searchParams.set('state', state)

      // 跳转到授权页面
      window.location.href = authUrl.toString()
    },

    // 处理OAuth2回调
    async handleOAuthCallback(params: OAuthCallbackParams, provider: OAuthProvider): Promise<LoginResponse> {
      this.state = AuthStateEnum.LOADING
      this.errorMessage = ''

      try {
        // 检查错误
        if (params.error) {
          throw new Error(params.error_description || `OAuth2授权失败: ${params.error}`)
        }

        // 验证state参数
        const storedState = sessionStorage.getItem(`oauth_state_${provider}`)
        if (!storedState || storedState !== params.state) {
          throw new Error('OAuth2 state验证失败')
        }

        // 清理state
        sessionStorage.removeItem(`oauth_state_${provider}`)

        // 获取平台配置
        const platforms = this.getOAuthPlatforms()
        const platform = platforms.find(p => p.provider === provider)
        if (!platform) {
          throw new Error(`OAuth2平台 ${provider} 未配置`)
        }

        // 使用授权码获取访问令牌
        const tokenResponse = await this.exchangeCodeForToken(params.code, platform)
        
        // 获取用户信息
        const userInfo = await this.getOAuthUserInfo(tokenResponse.access_token, platform)

        // 调用社交登录接口
        const socialLoginRequest: SocialLoginRequest = {
          provider,
          code: params.code,
          state: params.state
        }

        return await this.socialLogin(socialLoginRequest)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'OAuth2回调处理失败'
        this.setError(errorMessage)
        console.error('OAuth2回调处理失败:', error)
        throw error
      }
    },

    // 使用授权码交换访问令牌
    async exchangeCodeForToken(code: string, platform: OAuthPlatformConfig): Promise<OAuthTokenResponse> {
      const response = await fetch(platform.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: platform.clientId,
          client_secret: platform.clientSecret || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: platform.redirectUri,
        }),
      })

      if (!response.ok) {
        throw new Error(`获取访问令牌失败: ${response.statusText}`)
      }

      return await response.json()
    },

    // 获取OAuth2用户信息
    async getOAuthUserInfo(accessToken: string, platform: OAuthPlatformConfig): Promise<OAuthUserInfo> {
      const response = await fetch(platform.userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`获取用户信息失败: ${response.statusText}`)
      }

      const userData = await response.json()

      // 根据不同的平台解析用户信息
      return this.parseUserInfo(userData, platform.provider)
    },

    // 解析不同平台的用户信息
    parseUserInfo(userData: any, provider: OAuthProvider): OAuthUserInfo {
      switch (provider) {
        case 'github':
          return {
            id: userData.id.toString(),
            username: userData.login,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar_url,
            provider
          }
        case 'google':
          return {
            id: userData.sub,
            username: userData.email,
            email: userData.email,
            name: userData.name,
            avatar: userData.picture,
            provider
          }
        case 'wechat':
          return {
            id: userData.openid,
            username: userData.nickname,
            name: userData.nickname,
            avatar: userData.headimgurl,
            provider
          }
        case 'qq':
          return {
            id: userData.openid,
            username: userData.nickname,
            name: userData.nickname,
            avatar: userData.figureurl_qq_2,
            provider
          }
        default:
          return {
            id: userData.id || userData.sub || userData.openid,
            username: userData.username || userData.email || userData.login,
            email: userData.email,
            name: userData.name || userData.nickname,
            avatar: userData.avatar_url || userData.picture || userData.headimgurl,
            provider
          }
      }
    },

    // 生成随机的state参数
    generateState(): string {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15)
    }
  }
})