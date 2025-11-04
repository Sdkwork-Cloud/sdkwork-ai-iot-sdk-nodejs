// ==================== Share Store 实现 ====================

import { defineStore } from 'pinia'
import {
  ShareState,
  ShareStoreActions,
  ShareStoreGetters,
  SharePlatform,
  ShareContentType,
  ShareResult,
  ShareConfig,
  SharePlatformConfig,
  ShareAnalytics,
  ShareConfigOptions
} from './types'
import { GlobalTools, safeWx } from '@/core/global'

// 默认配置
const DEFAULT_CONFIG: ShareConfigOptions = {
  defaultConfig: {
    title: 'SDKWork AIoT 平台',
    description: '智能物联网平台，提供AI语音交互、设备管理等功能',
    url: window.location.href.split('#')[0],
    imageUrl: 'https://api.sdkwork.com/static/logo.png',
    type: ShareContentType.LINK,
    enableAnalytics: true,
    tags: ['AIoT', '物联网', '智能设备']
  },
  enabledPlatforms: [
    SharePlatform.WECHAT,
    SharePlatform.WECHAT_MOMENTS,
    SharePlatform.QQ,
    SharePlatform.QZONE,
    SharePlatform.WEIBO,
    SharePlatform.SYSTEM,
    SharePlatform.COPY_LINK
  ],
  enableAnalytics: true,
  maxRecords: 100
}

// 平台配置映射
const PLATFORM_CONFIGS: Record<SharePlatform, SharePlatformConfig> = {
  [SharePlatform.WECHAT]: {
    name: '微信好友',
    icon: 'wechat',
    enabled: true
  },
  [SharePlatform.WECHAT_MOMENTS]: {
    name: '朋友圈',
    icon: 'wechat-moments',
    enabled: true
  },
  [SharePlatform.QQ]: {
    name: 'QQ好友',
    icon: 'qq',
    enabled: true
  },
  [SharePlatform.QZONE]: {
    name: 'QQ空间',
    icon: 'qzone',
    enabled: true
  },
  [SharePlatform.WEIBO]: {
    name: '微博',
    icon: 'weibo',
    enabled: true
  },
  [SharePlatform.SYSTEM]: {
    name: '系统分享',
    icon: 'share',
    enabled: true
  },
  [SharePlatform.COPY_LINK]: {
    name: '复制链接',
    icon: 'link',
    enabled: true
  }
}

export const useShareStore = defineStore('share', {
  // ==================== State ====================
  state: (): ShareState => ({
    sharing: false,
    currentConfig: null,
    result: null, 
    error: null,
    availablePlatforms: [],
    analytics: {
      shareCount: 0,
      successCount: 0,
      failedCount: 0,
      lastShareTime: null,
      platformStats: {
        [SharePlatform.WECHAT]: 0,
        [SharePlatform.WECHAT_MOMENTS]: 0,
        [SharePlatform.QQ]: 0,
        [SharePlatform.QZONE]: 0,
        [SharePlatform.WEIBO]: 0,
        [SharePlatform.SYSTEM]: 0,
        [SharePlatform.COPY_LINK]: 0
      }
    },
    recentShares: []
  }),

  // ==================== Getters ====================
  getters: {
    // 状态相关
    isSharing: (state): boolean => state.sharing,
    
    hasError: (state): boolean => state.error !== null,
    
    currentResult: (state): ShareResult | null => state.result,
    
    // 平台相关
    enabledPlatforms: (state): SharePlatformConfig[] => 
      state.availablePlatforms.filter(platform => platform.enabled),
    
    platformCount: (state): number => state.availablePlatforms.filter(platform => platform.enabled).length,
    
    wechatEnabled: (state): boolean => 
      state.availablePlatforms.some(platform => 
        platform.name === '微信好友' && platform.enabled
      ),
    
    qqEnabled: (state): boolean => 
      state.availablePlatforms.some(platform => 
        platform.name === 'QQ好友' && platform.enabled
      ),
    
    weiboEnabled: (state): boolean => 
      state.availablePlatforms.some(platform => 
        platform.name === '微博' && platform.enabled
      ),
    
    // 统计相关
    totalShares: (state): number => state.analytics.shareCount,
    
    successRate: (state): number => {
      if (state.analytics.shareCount === 0) return 0
      return Math.round((state.analytics.successCount / state.analytics.shareCount) * 100)
    },
    
    recentShareCount: (state): number => state.recentShares.length,
    
    // 工具方法
    defaultShareConfig: (): ShareConfig => ({
      title: DEFAULT_CONFIG.defaultConfig?.title || 'SDKWork AIoT 平台',
      description: DEFAULT_CONFIG.defaultConfig?.description || '智能物联网平台',
      url: DEFAULT_CONFIG.defaultConfig?.url || window.location.href.split('#')[0],
      imageUrl: DEFAULT_CONFIG.defaultConfig?.imageUrl || 'https://api.sdkwork.com/static/logo.png',
      type: ShareContentType.LINK,
      enableAnalytics: DEFAULT_CONFIG.defaultConfig?.enableAnalytics ?? true,
      tags: DEFAULT_CONFIG.defaultConfig?.tags || ['AIoT', '物联网']
    })
  },

  // ==================== Actions ====================
  actions: {
    // 分享配置管理
    setShareConfig(config: Partial<ShareConfig>) {
      if (!this.currentConfig) {
        this.currentConfig = this.defaultShareConfig
      }
      this.currentConfig = { ...this.currentConfig, ...config }
    },
    
    clearShareConfig() {
      this.currentConfig = null
    },
    
    // 平台管理
    async detectAvailablePlatforms() {
      const globalTools = new GlobalTools()
      
      this.availablePlatforms = Object.values(SharePlatform).map(platform => {
        const baseConfig = PLATFORM_CONFIGS[platform]
        let enabled = baseConfig.enabled
        
        // 根据环境检测可用性
        switch (platform) {
          case SharePlatform.WECHAT:
          case SharePlatform.WECHAT_MOMENTS:
            enabled = enabled && globalTools.isWechatOfficialAccount()
            break
          case SharePlatform.QQ:
          case SharePlatform.QZONE:
            enabled = enabled && globalTools.isQQ()
            break
          case SharePlatform.WEIBO:
            enabled = enabled && globalTools.isWeibo()
            break
          case SharePlatform.SYSTEM:
            enabled = enabled && this.isSystemShareSupported()
            break
          case SharePlatform.COPY_LINK:
            enabled = enabled && this.isCopySupported()
            break
        }
        
        return {
          ...baseConfig,
          enabled
        }
      })
    },
    
    enablePlatform(platform: SharePlatform, enabled: boolean) {
      const platformConfig = this.availablePlatforms.find(p => 
        PLATFORM_CONFIGS[platform].name === p.name
      )
      if (platformConfig) {
        platformConfig.enabled = enabled
      }
    },
    
    getPlatformConfig(platform: SharePlatform): SharePlatformConfig | null {
      return this.availablePlatforms.find(p => 
        PLATFORM_CONFIGS[platform].name === p.name
      ) || null
    },
    
    // 分享操作
    async share(platform: SharePlatform, config?: Partial<ShareConfig>): Promise<ShareResult> {
      this.sharing = true
      this.error = null
      
      try {
        // 合并配置
        const shareConfig = {
          ...this.defaultShareConfig,
          ...(this.currentConfig || {}),
          ...(config || {})
        }
        
        // 验证配置
        if (!this.validateShareConfig(shareConfig)) {
          throw new Error('分享配置无效')
        }
        
        let result: ShareResult
        
        switch (platform) {
          case SharePlatform.WECHAT:
            result = await this.shareToWechat(shareConfig)
            break
          case SharePlatform.WECHAT_MOMENTS:
            result = await this.shareToWechatMoments(shareConfig)
            break
          case SharePlatform.QQ:
            result = await this.shareToQQ(shareConfig)
            break
          case SharePlatform.QZONE:
            result = await this.shareToQzone(shareConfig)
            break
          case SharePlatform.WEIBO:
            result = await this.shareToWeibo(shareConfig)
            break
          case SharePlatform.SYSTEM:
            result = await this.shareToSystem(shareConfig)
            break
          case SharePlatform.COPY_LINK:
            result = await this.copyLink(shareConfig)
            break
          default:
            result = ShareResult.UNSUPPORTED
        }
        
        // 记录分享结果
        this.recordShare(platform, result)
        this.result = result
        
        return result
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : '分享失败'
        this.recordShare(platform, ShareResult.FAILED, this.error)
        return ShareResult.FAILED
      } finally {
        this.sharing = false
      }
    },
    
    async shareToWechat(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      
      const wxObj = safeWx.getWx();
      if (wxObj && wxObj.ready) {
        return new Promise((resolve) => {
          wxObj?.updateAppMessageShareData({
            title: shareConfig.title,
            desc: shareConfig.description,
            link: shareConfig.url,
            imgUrl: shareConfig.imageUrl,
            success: () => {
              console.info('微信好友分享成功')
              resolve(ShareResult.SUCCESS)
            },
            fail: (err: any) => {
              console.info('微信好友分享失败:', err)
              resolve(ShareResult.FAILED)
            }
          })
        })
      }
      
      return ShareResult.UNSUPPORTED
    },
    
    async shareToWechatMoments(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      
      const wxObj = safeWx.getWx();
      if (wxObj && wxObj.ready) {
        return new Promise((resolve) => {
          wxObj?.updateTimelineShareData({
            title: shareConfig.title,
            link: shareConfig.url,
            imgUrl: shareConfig.imageUrl,
            success: () => {
              console.info('朋友圈分享成功')
              resolve(ShareResult.SUCCESS)
            },
            fail: (err: any) => {
              console.info('朋友圈分享失败:', err)
              resolve(ShareResult.FAILED)
            }
          })
        })
      }
      
      return ShareResult.UNSUPPORTED
    },
    
    async shareToQQ(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      const url = this.generateQQShareUrl(shareConfig)
      
      return this.openShareWindow(url)
    },
    
    async shareToQzone(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      const url = this.generateQzoneShareUrl(shareConfig)
      
      return this.openShareWindow(url)
    },
    
    async shareToWeibo(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      const url = this.generateWeiboShareUrl(shareConfig)
      
      return this.openShareWindow(url)
    },
    
    async shareToSystem(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareConfig.title,
            text: shareConfig.description,
            url: shareConfig.url
          })
          return ShareResult.SUCCESS
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            return ShareResult.CANCELLED
          }
          return ShareResult.FAILED
        }
      }
      
      return ShareResult.UNSUPPORTED
    },
    
    async copyLink(config?: Partial<ShareConfig>): Promise<ShareResult> {
      const shareConfig = this.getMergedConfig(config)
      
      try {
        await navigator.clipboard.writeText(shareConfig.url)
        console.info('链接复制成功')
        return ShareResult.SUCCESS
      } catch (error) {
        console.error('链接复制失败:', error)
        return ShareResult.FAILED
      }
    },
    
    // 批量分享
    async shareToMultiple(platforms: SharePlatform[], config?: Partial<ShareConfig>): Promise<Record<SharePlatform, ShareResult>> {
      const results: Record<SharePlatform, ShareResult> = {} as Record<SharePlatform, ShareResult>
      
      for (const platform of platforms) {
        results[platform] = await this.share(platform, config)
      }
      
      return results
    },
    
    // 分享统计
    recordShare(platform: SharePlatform, result: ShareResult, error?: string) {
      const shareRecord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        platform,
        config: this.currentConfig || this.defaultShareConfig,
        result,
        timestamp: Date.now(),
        error
      }
      
      // 添加到最近分享记录
      this.recentShares.unshift(shareRecord)
      
      // 限制记录数量
      if (this.recentShares.length > (DEFAULT_CONFIG.maxRecords || 100)) {
        this.recentShares = this.recentShares.slice(0, DEFAULT_CONFIG.maxRecords || 100)
      }
      
      // 更新统计信息
      this.analytics.shareCount++
      
      if (result === ShareResult.SUCCESS) {
        this.analytics.successCount++
      } else if (result === ShareResult.FAILED) {
        this.analytics.failedCount++
      }
      
      this.analytics.lastShareTime = Date.now()
      this.analytics.platformStats[platform] = (this.analytics.platformStats[platform] || 0) + 1
    },
    
    getShareStats(): ShareAnalytics {
      return { ...this.analytics }
    },
    
    clearShareStats() {
      this.analytics = {
        shareCount: 0,
        successCount: 0,
        failedCount: 0,
        lastShareTime: null,
        platformStats: {
          [SharePlatform.WECHAT]: 0,
          [SharePlatform.WECHAT_MOMENTS]: 0,
          [SharePlatform.QQ]: 0,
          [SharePlatform.QZONE]: 0,
          [SharePlatform.WEIBO]: 0,
          [SharePlatform.SYSTEM]: 0,
          [SharePlatform.COPY_LINK]: 0
        }
      }
      this.recentShares = []
    },
    
    // 工具方法
    generateShareUrl(baseUrl: string, params?: Record<string, any>): string {
      const url = new URL(baseUrl)
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, String(value))
        })
      }
      
      return url.toString()
    },
    
    validateShareConfig(config: ShareConfig): boolean {
      if (!config.title || config.title.trim() === '') {
        return false
      }
      
      if (!config.url || !this.isValidUrl(config.url)) {
        return false
      }
      
      return true
    },
    
    // 内部工具方法
    getMergedConfig(config?: Partial<ShareConfig>): ShareConfig {
      return {
        ...this.defaultShareConfig,
        ...(this.currentConfig || {}),
        ...(config || {})
      }
    },
    
    generateQQShareUrl(config: ShareConfig): string {
      return `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}&summary=${encodeURIComponent(config.description)}`
    },
    
    generateQzoneShareUrl(config: ShareConfig): string {
      return `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}&summary=${encodeURIComponent(config.description)}&pics=${encodeURIComponent(config.imageUrl)}`
    },
    
    generateWeiboShareUrl(config: ShareConfig): string {
      return `http://service.weibo.com/share/share.php?url=${encodeURIComponent(config.url)}&title=${encodeURIComponent(config.title)}&pic=${encodeURIComponent(config.imageUrl)}`
    },
    
    async openShareWindow(url: string): Promise<ShareResult> {
      return new Promise((resolve) => {
        const windowFeatures = 'width=600,height=400,menubar=no,toolbar=no,location=no,status=no'
        const shareWindow = window.open(url, '_blank', windowFeatures)
        
        if (shareWindow) {
          // 监听窗口关闭
          const checkWindow = setInterval(() => {
            if (shareWindow.closed) {
              clearInterval(checkWindow)
              resolve(ShareResult.SUCCESS)
            }
          }, 500)
          
          // 超时处理
          setTimeout(() => {
            clearInterval(checkWindow)
            if (!shareWindow.closed) {
              shareWindow.close()
            }
            resolve(ShareResult.SUCCESS)
          }, 10000)
        } else {
          resolve(ShareResult.FAILED)
        }
      })
    },
    
    isValidUrl(url: string): boolean {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },
    
    isSystemShareSupported(): boolean {
      return !!navigator.share
    },
    
    isCopySupported(): boolean {
      return !!navigator.clipboard && !!navigator.clipboard.writeText
    },
    
    // 初始化
    async initialize() {
      try {
        await this.detectAvailablePlatforms()
        console.info('Share store 初始化完成')
      } catch (error) {
        console.error('Share store 初始化失败:', error)
      }
    }
  }
})