// ==================== App Store 实现 ====================

import { defineStore } from 'pinia'
import {
  AppState,
  AppStoreActions,
  AppStoreGetters,
  ThemeMode,
  Language,
  LayoutMode,
  AnimationConfig,
  NotificationConfig,
  StorageConfig,
  AppConfigOptions
} from './types'

// 默认配置
const DEFAULT_CONFIG: AppConfigOptions = {
  defaultTheme: ThemeMode.AUTO,
  defaultLanguage: Language.ZH_CN,
  availableLanguages: [Language.ZH_CN, Language.EN_US],
  enableSystemTheme: true,
  storage: {
    type: 'localStorage',
    prefix: 'sdkwork_app_',
    encryption: false
  },
  animation: {
    enabled: true,
    duration: 300,
    type: 'fade'
  },
  notification: {
    sound: true,
    desktop: false,
    position: 'top-right',
    duration: 5000
  },
  performance: {
    monitoring: true,
    lazyLoading: true,
    imageQuality: 80
  },
  features: {
    offlineMode: false,
    pwa: false,
    debugMode: import.meta.env.DEV,
    analytics: true
  }
}

export const useAppStore = defineStore('app', {
  // ==================== State ====================
  state: (): AppState => ({
    // 主题配置
    theme: DEFAULT_CONFIG.defaultTheme || ThemeMode.AUTO,
    systemTheme: ThemeMode.LIGHT,
    
    // 语言配置
    language: DEFAULT_CONFIG.defaultLanguage || Language.ZH_CN,
    availableLanguages: DEFAULT_CONFIG.availableLanguages || [Language.ZH_CN, Language.EN_US],
    
    // 布局配置
    layout: LayoutMode.DEFAULT,
    sidebarCollapsed: false,
    
    // 动画配置
    animation: {
      enabled: DEFAULT_CONFIG.animation?.enabled ?? true,
      duration: DEFAULT_CONFIG.animation?.duration ?? 300,
      type: DEFAULT_CONFIG.animation?.type ?? 'fade'
    },
    
    // 通知配置
    notification: {
      sound: DEFAULT_CONFIG.notification?.sound ?? true,
      desktop: DEFAULT_CONFIG.notification?.desktop ?? false,
      position: DEFAULT_CONFIG.notification?.position ?? 'top-right',
      duration: DEFAULT_CONFIG.notification?.duration ?? 5000
    },
    
    // 存储配置
    storage: {
      type: DEFAULT_CONFIG.storage?.type ?? 'localStorage',
      prefix: DEFAULT_CONFIG.storage?.prefix ?? 'sdkwork_app_',
      encryption: DEFAULT_CONFIG.storage?.encryption ?? false
    },
    
    // 应用状态
    initialized: false,
    loading: false,
    error: null,
    
    // 设备信息
    device: {
      type: 'desktop',
      os: '',
      browser: '',
      screenWidth: 0,
      screenHeight: 0
    },
    
    // 性能配置
    performance: {
      monitoring: DEFAULT_CONFIG.performance?.monitoring ?? true,
      lazyLoading: DEFAULT_CONFIG.performance?.lazyLoading ?? true,
      imageQuality: DEFAULT_CONFIG.performance?.imageQuality ?? 80
    },
    
    // 功能开关
    features: {
      offlineMode: DEFAULT_CONFIG.features?.offlineMode ?? false,
      pwa: DEFAULT_CONFIG.features?.pwa ?? false,
      debugMode: DEFAULT_CONFIG.features?.debugMode ?? import.meta.env.DEV,
      analytics: DEFAULT_CONFIG.features?.analytics ?? true
    },
    
    // 应用信息
    appInfo: {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      buildNumber: import.meta.env.VITE_APP_BUILD_NUMBER || '1',
      lastUpdate: Date.now(),
      environment: import.meta.env.MODE as 'development' | 'staging' | 'production' || 'development'
    }
  }),

  // ==================== Getters ====================
  getters: {
    // 主题相关
    isDarkMode: (state): boolean => {
      if (state.theme === ThemeMode.AUTO) {
        return state.systemTheme === ThemeMode.DARK
      }
      return state.theme === ThemeMode.DARK
    },
    
    isLightMode: (state): boolean => {
      if (state.theme === ThemeMode.AUTO) {
        return state.systemTheme === ThemeMode.LIGHT
      }
      return state.theme === ThemeMode.LIGHT
    },
    
    effectiveTheme: (state): ThemeMode => {
      if (state.theme === ThemeMode.AUTO) {
        return state.systemTheme
      }
      return state.theme
    },
    
    // 语言相关
    currentLanguage: (state): Language => state.language,
    
    languageText: (state): string => {
      const languageMap = {
        [Language.ZH_CN]: '简体中文',
        [Language.EN_US]: 'English',
        [Language.JA_JP]: '日本語',
        [Language.KO_KR]: '한국어'
      }
      return languageMap[state.language] || '简体中文'
    },
    
    // 布局相关
    isMobile: (state): boolean => state.device.type === 'mobile',
    
    isDesktop: (state): boolean => state.device.type === 'desktop',
    
    isSidebarVisible: (state): boolean => !state.sidebarCollapsed,
    
    // 应用状态
    isLoading: (state): boolean => state.loading,
    
    hasError: (state): boolean => state.error !== null,
    
    // 功能状态
    isDebugMode: (state): boolean => state.features.debugMode,
    
    isProduction: (state): boolean => state.appInfo.environment === 'production',
    
    // 应用信息
    appVersion: (state): string => state.appInfo.version,
    
    appEnvironment: (state): string => state.appInfo.environment
  },

  // ==================== Actions ====================
  actions: {
    // 主题相关
    setTheme(theme: ThemeMode) {
      this.theme = theme
      this.saveToStorage()
      
      // 应用主题到DOM
      this.applyThemeToDOM()
    },
    
    toggleTheme() {
      const newTheme = this.isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK
      this.setTheme(newTheme)
    },
    
    detectSystemTheme() {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.systemTheme = isDark ? ThemeMode.DARK : ThemeMode.LIGHT
      
      // 如果当前主题是AUTO，应用系统主题
      if (this.theme === ThemeMode.AUTO) {
        this.applyThemeToDOM()
      }
    },
    
    applyThemeToDOM() {
      const theme = this.effectiveTheme
      const html = document.documentElement
      
      // 移除现有主题类
      html.classList.remove('theme-light', 'theme-dark')
      
      // 添加新主题类
      if (theme === ThemeMode.DARK) {
        html.classList.add('theme-dark')
      } else {
        html.classList.add('theme-light')
      }
      
      // 设置data-theme属性
      html.setAttribute('data-theme', theme)
    },
    
    // 语言相关
    setLanguage(language: Language) {
      if (this.availableLanguages.includes(language)) {
        this.language = language
        this.saveToStorage()
        
        // 触发语言变更事件
        window.dispatchEvent(new CustomEvent('app:language-changed', { 
          detail: { language } 
        }))
      }
    },
    
    getCurrentLanguage(): Language {
      return this.language
    },
    
    // 布局相关
    setLayout(layout: LayoutMode) {
      this.layout = layout
      this.saveToStorage()
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      this.saveToStorage()
    },
    
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
      this.saveToStorage()
    },
    
    // 动画相关
    setAnimationConfig(config: Partial<AnimationConfig>) {
      this.animation = { ...this.animation, ...config }
      this.saveToStorage()
    },
    
    // 通知相关
    setNotificationConfig(config: Partial<NotificationConfig>) {
      this.notification = { ...this.notification, ...config }
      this.saveToStorage()
    },
    
    // 存储相关
    setStorageConfig(config: Partial<StorageConfig>) {
      this.storage = { ...this.storage, ...config }
      this.saveToStorage()
    },
    
    // 应用状态管理
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    setError(error: string | null) {
      this.error = error
      
      // 如果有错误，自动清除（可选）
      if (error) {
        setTimeout(() => {
          this.clearError()
        }, 5000)
      }
    },
    
    clearError() {
      this.error = null
    },
    
    // 设备检测
    detectDevice() {
      const userAgent = navigator.userAgent.toLowerCase()
      const screenWidth = window.screen.width
      
      // 检测设备类型
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (screenWidth < 768) {
        deviceType = 'mobile'
      } else if (screenWidth < 1024) {
        deviceType = 'tablet'
      }
      
      // 检测操作系统
      let os = 'unknown'
      if (userAgent.includes('win')) os = 'windows'
      else if (userAgent.includes('mac')) os = 'macos'
      else if (userAgent.includes('linux')) os = 'linux'
      else if (userAgent.includes('android')) os = 'android'
      else if (userAgent.includes('ios') || userAgent.includes('iphone')) os = 'ios'
      
      // 检测浏览器
      let browser = 'unknown'
      if (userAgent.includes('chrome')) browser = 'chrome'
      else if (userAgent.includes('firefox')) browser = 'firefox'
      else if (userAgent.includes('safari')) browser = 'safari'
      else if (userAgent.includes('edge')) browser = 'edge'
      
      this.device = {
        type: deviceType,
        os,
        browser,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      }
    },
    
    // 性能配置
    setPerformanceConfig(config: Partial<AppState['performance']>) {
      this.performance = { ...this.performance, ...config }
      this.saveToStorage()
    },
    
    // 功能开关
    setFeatureFlag(feature: keyof AppState['features'], enabled: boolean) {
      this.features[feature] = enabled
      this.saveToStorage()
    },
    
    // 应用信息
    setAppInfo(info: Partial<AppState['appInfo']>) {
      this.appInfo = { ...this.appInfo, ...info }
      this.saveToStorage()
    },
    
    // 初始化
    async initialize() {
      if (this.initialized) return
      
      this.setLoading(true)
      
      try {
        // 加载存储的配置
        this.loadFromStorage()
        
        // 检测设备和系统主题
        this.detectDevice()
        this.detectSystemTheme()
        
        // 应用主题到DOM
        this.applyThemeToDOM()
        
        // 监听系统主题变化
        if (DEFAULT_CONFIG.enableSystemTheme) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            this.detectSystemTheme()
          })
        }
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
          this.detectDevice()
        })
        
        this.initialized = true
        this.setLoading(false)
        
        console.info('App store 初始化完成')
      } catch (error) {
        this.setError('应用初始化失败')
        this.setLoading(false)
        console.error('App store 初始化失败:', error)
      }
    },
    
    // 持久化
    saveToStorage() {
      try {
        const storageKey = `${this.storage.prefix}config`
        const data = {
          theme: this.theme,
          language: this.language,
          layout: this.layout,
          sidebarCollapsed: this.sidebarCollapsed,
          animation: this.animation,
          notification: this.notification,
          performance: this.performance,
          features: this.features
        }
        
        const storage = this.storage.type === 'sessionStorage' ? sessionStorage : localStorage
        storage.setItem(storageKey, JSON.stringify(data))
      } catch (error) {
        console.warn('保存应用配置到存储失败:', error)
      }
    },
    
    loadFromStorage() {
      try {
        const storageKey = `${this.storage.prefix}config`
        const storage = this.storage.type === 'sessionStorage' ? sessionStorage : localStorage
        const stored = storage.getItem(storageKey)
        
        if (stored) {
          const data = JSON.parse(stored)
          
          // 安全地恢复配置
          if (data.theme) this.theme = data.theme
          if (data.language) this.language = data.language
          if (data.layout) this.layout = data.layout
          if (typeof data.sidebarCollapsed === 'boolean') this.sidebarCollapsed = data.sidebarCollapsed
          if (data.animation) this.animation = { ...this.animation, ...data.animation }
          if (data.notification) this.notification = { ...this.notification, ...data.notification }
          if (data.performance) this.performance = { ...this.performance, ...data.performance }
          if (data.features) this.features = { ...this.features, ...data.features }
        }
      } catch (error) {
        console.warn('从存储加载应用配置失败:', error)
      }
    },
    
    clearStorage() {
      try {
        const storageKey = `${this.storage.prefix}config`
        const storage = this.storage.type === 'sessionStorage' ? sessionStorage : localStorage
        storage.removeItem(storageKey)
      } catch (error) {
        console.warn('清除应用存储失败:', error)
      }
    }
  }
})