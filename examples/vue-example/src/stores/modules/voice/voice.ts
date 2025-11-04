/**
 * Voice Store - 发音人管理模块
 * 提供完整的发音人管理功能，包括发音人列表、克隆、搜索筛选等
 */

import { defineStore } from 'pinia'
import {
  VoiceSpeaker,
  SpeakerGender,
  SpeakerLanguage,
  SpeakerStyle,
  SpeakerStatus,
  AudioQuality,
  VoiceParameters,
  CreateSpeakerParams,
  UpdateSpeakerParams,
  CloneSpeakerParams,
  SpeakerQueryParams,
  SpeakerPagination,
  SpeakerStats,
  VoiceState,
  DEFAULT_SPEAKER_QUERY,
  DEFAULT_PAGINATION,
  DEFAULT_STATS
} from './types'

// 默认音频质量配置
const DEFAULT_AUDIO_QUALITY: AudioQuality = {
  sampleRate: 44100,
  bitrate: 128,
  channels: 1,
  format: 'mp3'
}

// 默认语音参数配置
const DEFAULT_VOICE_PARAMETERS: VoiceParameters = {
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0
}

// 模拟数据 - 预置发音人列表
const PRESET_SPEAKERS: VoiceSpeaker[] = [
  {
    id: 'speaker_001',
    name: 'xiaoyun',
    displayName: '小云',
    description: '标准中文女声，声音温暖自然',
    gender: SpeakerGender.FEMALE,
    language: SpeakerLanguage.CHINESE,
    style: SpeakerStyle.WARM,
    status: SpeakerStatus.AVAILABLE,
    audioQuality: DEFAULT_AUDIO_QUALITY,
    voiceParameters: DEFAULT_VOICE_PARAMETERS,
    tags: ['标准', '女声', '中文'],
    category: '标准发音人',
    isFeatured: true,
    isCustom: false,
    usageCount: 1560,
    rating: 4.8,
    popularity: 95,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 3 * 60 * 60 * 1000
  },
  {
    id: 'speaker_002',
    name: 'xiaogang',
    displayName: '小刚',
    description: '标准中文男声，声音沉稳有力',
    gender: SpeakerGender.MALE,
    language: SpeakerLanguage.CHINESE,
    style: SpeakerStyle.STANDARD,
    status: SpeakerStatus.AVAILABLE,
    audioQuality: DEFAULT_AUDIO_QUALITY,
    voiceParameters: DEFAULT_VOICE_PARAMETERS,
    tags: ['标准', '男声', '中文'],
    category: '标准发音人',
    isFeatured: true,
    isCustom: false,
    usageCount: 890,
    rating: 4.6,
    popularity: 88,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 6 * 60 * 60 * 1000
  },
  {
    id: 'speaker_003',
    name: 'emma',
    displayName: 'Emma',
    description: '标准英文女声，发音清晰标准',
    gender: SpeakerGender.FEMALE,
    language: SpeakerLanguage.ENGLISH,
    style: SpeakerStyle.STANDARD,
    status: SpeakerStatus.AVAILABLE,
    audioQuality: DEFAULT_AUDIO_QUALITY,
    voiceParameters: DEFAULT_VOICE_PARAMETERS,
    tags: ['标准', '女声', '英文'],
    category: '英文发音人',
    isFeatured: false,
    isCustom: false,
    usageCount: 450,
    rating: 4.5,
    popularity: 75,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 12 * 60 * 60 * 1000
  },
  {
    id: 'speaker_004',
    name: 'david',
    displayName: 'David',
    description: '标准英文男声，声音富有磁性',
    gender: SpeakerGender.MALE,
    language: SpeakerLanguage.ENGLISH,
    style: SpeakerStyle.AUTHORITATIVE,
    status: SpeakerStatus.AVAILABLE,
    audioQuality: DEFAULT_AUDIO_QUALITY,
    voiceParameters: DEFAULT_VOICE_PARAMETERS,
    tags: ['标准', '男声', '英文'],
    category: '英文发音人',
    isFeatured: false,
    isCustom: false,
    usageCount: 320,
    rating: 4.3,
    popularity: 68,
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    id: 'speaker_005',
    name: 'akari',
    displayName: '明里',
    description: '日文女声，声音甜美可爱',
    gender: SpeakerGender.FEMALE,
    language: SpeakerLanguage.JAPANESE,
    style: SpeakerStyle.CHEERFUL,
    status: SpeakerStatus.AVAILABLE,
    audioQuality: DEFAULT_AUDIO_QUALITY,
    voiceParameters: DEFAULT_VOICE_PARAMETERS,
    tags: ['日文', '女声', '甜美'],
    category: '日文发音人',
    isFeatured: false,
    isCustom: false,
    usageCount: 210,
    rating: 4.2,
    popularity: 55,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 48 * 60 * 60 * 1000
  }
]

export const useVoiceStore = defineStore('voice', {
  // ==================== State ====================
  state: (): VoiceState => ({
    // 发音人列表
    speakers: [...PRESET_SPEAKERS],
    
    // 当前操作的发音人
    currentSpeaker: null,
    
    // 发音人加载状态
    speakersLoading: false,
    
    // 发音人操作错误信息
    speakerError: null,
    
    // 发音人分页信息
    speakerPagination: DEFAULT_PAGINATION,
    
    // 发音人搜索参数
    searchParams: DEFAULT_SPEAKER_QUERY,
    
    // 发音人统计信息
    speakerStats: DEFAULT_STATS,
    
    // 所有分类列表
    categories: ['标准发音人', '英文发音人', '日文发音人', '自定义发音人'],
    
    // 所有标签列表
    allTags: ['标准', '女声', '男声', '中文', '英文', '日文', '甜美', '磁性', '温暖', '沉稳'],
    
    // 最近使用的发音人
    recentSpeakers: []
  }),

  // ==================== Getters ====================
  getters: {
    /**
     * 获取发音人列表
     */
    speakerList: (state): VoiceSpeaker[] => state.speakers,
    
    /**
     * 获取当前发音人
     */
    activeSpeaker: (state): VoiceSpeaker | null => state.currentSpeaker,
    
    /**
     * 检查发音人是否正在加载
     */
    isSpeakersLoading: (state): boolean => state.speakersLoading,
    
    /**
     * 获取发音人错误信息
     */
    speakerErrorMessage: (state): string | null => state.speakerError,
    
    /**
     * 获取发音人分页信息
     */
    paginationInfo: (state): SpeakerPagination => state.speakerPagination,
    
    /**
     * 获取搜索参数
     */
    searchParameters: (state): SpeakerQueryParams => state.searchParams,
    
    /**
     * 获取发音人统计信息
     */
    statistics: (state): SpeakerStats => state.speakerStats,
    
    /**
     * 获取所有分类
     */
    categoryList: (state): string[] => state.categories,
    
    /**
     * 获取所有标签
     */
    tagList: (state): string[] => state.allTags,
    
    /**
     * 获取最近使用的发音人
     */
    recentSpeakerList: (state): VoiceSpeaker[] => state.recentSpeakers,
    
    /**
     * 获取可用发音人
     */
    availableSpeakers: (state): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => speaker.status === SpeakerStatus.AVAILABLE)
    },
    
    /**
     * 获取推荐发音人
     */
    featuredSpeakers: (state): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => 
        speaker.isFeatured && speaker.status === SpeakerStatus.AVAILABLE
      )
    },
    
    /**
     * 获取自定义发音人
     */
    customSpeakers: (state): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => speaker.isCustom)
    },
    
    /**
     * 按语言获取发音人
     */
    speakersByLanguage: (state) => (language: SpeakerLanguage): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => 
        speaker.language === language && speaker.status === SpeakerStatus.AVAILABLE
      )
    },
    
    /**
     * 按性别获取发音人
     */
    speakersByGender: (state) => (gender: SpeakerGender): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => 
        speaker.gender === gender && speaker.status === SpeakerStatus.AVAILABLE
      )
    },
    
    /**
     * 按风格获取发音人
     */
    speakersByStyle: (state) => (style: SpeakerStyle): VoiceSpeaker[] => {
      return state.speakers.filter(speaker => 
        speaker.style === style && speaker.status === SpeakerStatus.AVAILABLE
      )
    },
    
    /**
     * 获取最受欢迎的发音人
     */
    popularSpeakers: (state): VoiceSpeaker[] => {
      return [...state.speakers]
        .filter(speaker => speaker.status === SpeakerStatus.AVAILABLE)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10)
    },
    
    /**
     * 获取使用次数最多的发音人
     */
    mostUsedSpeakers: (state): VoiceSpeaker[] => {
      return [...state.speakers]
        .filter(speaker => speaker.status === SpeakerStatus.AVAILABLE)
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 10)
    }
  },

  // ==================== Actions ====================
  actions: {
    /**
     * 获取发音人列表
     */
    async fetchSpeakers(params?: SpeakerQueryParams): Promise<VoiceSpeaker[]> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 合并搜索参数
        if (params) {
          this.searchParams = { ...this.searchParams, ...params }
        }

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 300))

        // 过滤发音人列表
        let filteredSpeakers = this.speakers.filter(speaker => 
          speaker.status !== SpeakerStatus.DELETED
        )

        // 应用筛选条件
        const {
          gender,
          language,
          style,
          status,
          category,
          tags,
          keyword,
          isFeatured,
          isCustom,
          page = 1,
          pageSize = 20,
          sortBy = 'popularity',
          sortOrder = 'desc'
        } = this.searchParams

        // 性别筛选
        if (gender) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.gender === gender)
        }

        // 语言筛选
        if (language) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.language === language)
        }

        // 风格筛选
        if (style) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.style === style)
        }

        // 状态筛选
        if (status) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.status === status)
        }

        // 分类筛选
        if (category) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.category === category)
        }

        // 标签筛选
        if (tags && tags.length > 0) {
          filteredSpeakers = filteredSpeakers.filter(speaker =>
            tags.some(tag => speaker.tags.includes(tag))
          )
        }

        // 关键词搜索
        if (keyword) {
          const lowerKeyword = keyword.toLowerCase()
          filteredSpeakers = filteredSpeakers.filter(speaker =>
            speaker.name.toLowerCase().includes(lowerKeyword) ||
            speaker.displayName.toLowerCase().includes(lowerKeyword) ||
            (speaker.description && speaker.description.toLowerCase().includes(lowerKeyword))
          )
        }

        // 推荐筛选
        if (isFeatured !== undefined) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.isFeatured === isFeatured)
        }

        // 自定义筛选
        if (isCustom !== undefined) {
          filteredSpeakers = filteredSpeakers.filter(speaker => speaker.isCustom === isCustom)
        }

        // 排序
        filteredSpeakers.sort((a, b) => {
          let aValue: any, bValue: any
          
          switch (sortBy) {
            case 'name':
              aValue = a.name
              bValue = b.name
              break
            case 'createdAt':
              aValue = a.createdAt
              bValue = b.createdAt
              break
            case 'updatedAt':
              aValue = a.updatedAt
              bValue = b.updatedAt
              break
            case 'usageCount':
              aValue = a.usageCount
              bValue = b.usageCount
              break
            case 'rating':
              aValue = a.rating
              bValue = b.rating
              break
            case 'popularity':
            default:
              aValue = a.popularity
              bValue = b.popularity
              break
          }

          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          }
        })

        // 分页处理
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedSpeakers = filteredSpeakers.slice(startIndex, endIndex)

        // 更新分页信息
        this.speakerPagination = {
          page,
          pageSize,
          total: filteredSpeakers.length,
          totalPages: Math.ceil(filteredSpeakers.length / pageSize),
          hasMore: endIndex < filteredSpeakers.length
        }

        // 更新统计信息
        this.updateStats()
        
        console.log(`获取发音人列表成功，总数: ${filteredSpeakers.length}, 当前页: ${paginatedSpeakers.length}`)
        
        return paginatedSpeakers
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '获取发音人列表失败'
        console.error('获取发音人列表失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 获取发音人详情
     */
    async getSpeakerDetail(speakerId: string): Promise<VoiceSpeaker> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 200))

        const speaker = this.speakers.find(s => s.id === speakerId)
        
        if (!speaker) {
          throw new Error(`发音人不存在: ${speakerId}`)
        }

        if (speaker.status === SpeakerStatus.DELETED) {
          throw new Error(`发音人已被删除: ${speakerId}`)
        }

        this.currentSpeaker = speaker
        
        // 增加使用次数
        speaker.usageCount += 1
        speaker.lastUsedAt = Date.now()
        
        // 添加到最近使用列表
        this.addToRecentSpeakers(speaker)
        
        console.log(`获取发音人详情成功: ${speaker.displayName}`)
        
        return speaker
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '获取发音人详情失败'
        console.error('获取发音人详情失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 创建发音人
     */
    async createSpeaker(params: CreateSpeakerParams): Promise<VoiceSpeaker> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        // 验证名称唯一性
        const existingSpeaker = this.speakers.find(s => s.name === params.name)
        if (existingSpeaker) {
          throw new Error(`发音人名称已存在: ${params.name}`)
        }

        // 生成发音人ID
        const speakerId = `speaker_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        
        // 创建发音人对象
        const speaker: VoiceSpeaker = {
          id: speakerId,
          name: params.name,
          displayName: params.displayName,
          description: params.description,
          gender: params.gender,
          language: params.language,
          style: params.style,
          status: SpeakerStatus.AVAILABLE,
          audioQuality: {
            ...DEFAULT_AUDIO_QUALITY,
            ...params.audioQuality
          },
          voiceParameters: {
            ...DEFAULT_VOICE_PARAMETERS,
            ...params.voiceParameters
          },
          tags: params.tags || [],
          category: params.category || '自定义发音人',
          isFeatured: params.isFeatured || false,
          isCustom: true,
          usageCount: 0,
          rating: 0,
          popularity: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          customFields: params.customFields
        }

        // 添加到发音人列表
        this.speakers.unshift(speaker)
        this.currentSpeaker = speaker

        // 更新统计信息
        this.updateStats()
        this.updateCategories()
        this.updateTags()
        
        console.log(`创建发音人成功: ${speaker.displayName} (${speakerId})`)
        
        return speaker
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '创建发音人失败'
        console.error('创建发音人失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 更新发音人
     */
    async updateSpeaker(params: UpdateSpeakerParams): Promise<VoiceSpeaker> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 300))

        const speakerIndex = this.speakers.findIndex(s => s.id === params.id)
        
        if (speakerIndex === -1) {
          throw new Error(`发音人不存在: ${params.id}`)
        }

        const existingSpeaker = this.speakers[speakerIndex]
        
        if (existingSpeaker.status === SpeakerStatus.DELETED) {
          throw new Error(`发音人已被删除: ${params.id}`)
        }

        // 验证名称唯一性（如果修改了名称）
        if (params.name && params.name !== existingSpeaker.name) {
          const nameExists = this.speakers.some(s => 
            s.id !== params.id && s.name === params.name
          )
          if (nameExists) {
            throw new Error(`发音人名称已存在: ${params.name}`)
          }
        }

        // 更新发音人信息
        const updatedSpeaker: VoiceSpeaker = {
          ...existingSpeaker,
          name: params.name || existingSpeaker.name,
          displayName: params.displayName || existingSpeaker.displayName,
          description: params.description !== undefined ? params.description : existingSpeaker.description,
          gender: params.gender || existingSpeaker.gender,
          language: params.language || existingSpeaker.language,
          style: params.style || existingSpeaker.style,
          audioQuality: params.audioQuality ? { ...existingSpeaker.audioQuality, ...params.audioQuality } : existingSpeaker.audioQuality,
          voiceParameters: params.voiceParameters ? { ...existingSpeaker.voiceParameters, ...params.voiceParameters } : existingSpeaker.voiceParameters,
          tags: params.tags || existingSpeaker.tags,
          category: params.category || existingSpeaker.category,
          isFeatured: params.isFeatured !== undefined ? params.isFeatured : existingSpeaker.isFeatured,
          isCustom: params.isCustom !== undefined ? params.isCustom : existingSpeaker.isCustom,
          status: params.status || existingSpeaker.status,
          customFields: params.customFields ? { ...existingSpeaker.customFields, ...params.customFields } : existingSpeaker.customFields,
          updatedAt: Date.now()
        }

        // 替换发音人
        this.speakers[speakerIndex] = updatedSpeaker
        
        if (this.currentSpeaker?.id === params.id) {
          this.currentSpeaker = updatedSpeaker
        }

        // 更新统计信息
        this.updateStats()
        this.updateCategories()
        this.updateTags()
        
        console.log(`更新发音人成功: ${updatedSpeaker.displayName}`)
        
        return updatedSpeaker
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '更新发音人失败'
        console.error('更新发音人失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 克隆发音人
     */
    async cloneSpeaker(params: CloneSpeakerParams): Promise<VoiceSpeaker> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 400))

        // 获取源发音人
        const sourceSpeaker = this.speakers.find(s => s.id === params.sourceSpeakerId)
        
        if (!sourceSpeaker) {
          throw new Error(`源发音人不存在: ${params.sourceSpeakerId}`)
        }

        if (sourceSpeaker.status === SpeakerStatus.DELETED) {
          throw new Error(`源发音人已被删除: ${params.sourceSpeakerId}`)
        }

        // 验证新名称唯一性
        const nameExists = this.speakers.some(s => s.name === params.newName)
        if (nameExists) {
          throw new Error(`发音人名称已存在: ${params.newName}`)
        }

        // 生成新的发音人ID
        const newSpeakerId = `speaker_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        
        // 克隆发音人
        const clonedSpeaker: VoiceSpeaker = {
          ...sourceSpeaker,
          id: newSpeakerId,
          name: params.newName,
          displayName: params.newDisplayName,
          description: params.description || sourceSpeaker.description,
          category: params.category || sourceSpeaker.category,
          tags: params.tags || [...sourceSpeaker.tags],
          isCustom: params.isCustom !== undefined ? params.isCustom : true,
          usageCount: 0,
          rating: 0,
          popularity: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          customFields: {
            ...sourceSpeaker.customFields,
            ...params.customFields,
            clonedFrom: params.sourceSpeakerId,
            clonedAt: Date.now()
          }
        }

        // 添加到发音人列表
        this.speakers.unshift(clonedSpeaker)
        this.currentSpeaker = clonedSpeaker

        // 更新统计信息
        this.updateStats()
        this.updateCategories()
        this.updateTags()
        
        console.log(`克隆发音人成功: ${clonedSpeaker.displayName} (从 ${sourceSpeaker.displayName} 克隆)`)
        
        return clonedSpeaker
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '克隆发音人失败'
        console.error('克隆发音人失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 删除发音人
     */
    async deleteSpeaker(speakerId: string): Promise<void> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 300))

        const speakerIndex = this.speakers.findIndex(s => s.id === speakerId)
        
        if (speakerIndex === -1) {
          throw new Error(`发音人不存在: ${speakerId}`)
        }

        const speaker = this.speakers[speakerIndex]
        
        if (speaker.status === SpeakerStatus.DELETED) {
          throw new Error(`发音人已被删除: ${speakerId}`)
        }

        // 标记为已删除（软删除）
        this.speakers[speakerIndex] = {
          ...speaker,
          status: SpeakerStatus.DELETED,
          updatedAt: Date.now()
        }

        // 清除当前发音人
        if (this.currentSpeaker?.id === speakerId) {
          this.currentSpeaker = null
        }

        // 从最近使用列表中移除
        this.recentSpeakers = this.recentSpeakers.filter(s => s.id !== speakerId)

        // 更新统计信息
        this.updateStats()
        
        console.log(`删除发音人成功: ${speaker.displayName}`)
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '删除发音人失败'
        console.error('删除发音人失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 搜索发音人
     */
    async searchSpeakers(keyword: string, params?: SpeakerQueryParams): Promise<VoiceSpeaker[]> {
      this.speakersLoading = true
      this.speakerError = null

      try {
        // 合并搜索参数
        const searchParams: SpeakerQueryParams = {
          ...this.searchParams,
          ...params,
          keyword
        }

        return await this.fetchSpeakers(searchParams)
      } catch (error) {
        this.speakerError = error instanceof Error ? error.message : '搜索发音人失败'
        console.error('搜索发音人失败:', error)
        throw error
      } finally {
        this.speakersLoading = false
      }
    },

    /**
     * 设置当前发音人
     */
    setCurrentSpeaker(speaker: VoiceSpeaker | null): void {
      this.currentSpeaker = speaker
    },

    /**
     * 清除发音人错误信息
     */
    clearSpeakerError(): void {
      this.speakerError = null
    },

    /**
     * 重置搜索参数
     */
    resetSearchParams(): void {
      this.searchParams = { ...DEFAULT_SPEAKER_QUERY }
    },

    // ==================== 辅助方法 ====================

    /**
     * 更新统计信息
     */
    updateStats(): void {
      const stats: SpeakerStats = { ...DEFAULT_STATS }
      
      this.speakers.forEach(speaker => {
        if (speaker.status !== SpeakerStatus.DELETED) {
          stats.total++
          
          switch (speaker.status) {
            case SpeakerStatus.AVAILABLE:
              stats.available++
              break
            case SpeakerStatus.UNAVAILABLE:
              stats.unavailable++
              break
            case SpeakerStatus.DISABLED:
              stats.disabled++
              break
          }
          
          if (speaker.isCustom) stats.custom++
          if (speaker.isFeatured) stats.featured++
          
          stats.byGender[speaker.gender] = (stats.byGender[speaker.gender] || 0) + 1
          stats.byLanguage[speaker.language] = (stats.byLanguage[speaker.language] || 0) + 1
          stats.byStyle[speaker.style] = (stats.byStyle[speaker.style] || 0) + 1
        }
      })
      
      this.speakerStats = stats
    },

    /**
     * 更新分类列表
     */
    updateCategories(): void {
      const categories = new Set<string>()
      
      this.speakers.forEach(speaker => {
        if (speaker.status !== SpeakerStatus.DELETED && speaker.category) {
          categories.add(speaker.category)
        }
      })
      
      this.categories = Array.from(categories).sort()
    },

    /**
     * 更新标签列表
     */
    updateTags(): void {
      const allTags = new Set<string>()
      
      this.speakers.forEach(speaker => {
        if (speaker.status !== SpeakerStatus.DELETED) {
          speaker.tags.forEach(tag => allTags.add(tag))
        }
      })
      
      this.allTags = Array.from(allTags).sort()
    },

    /**
     * 添加到最近使用列表
     */
    addToRecentSpeakers(speaker: VoiceSpeaker): void {
      // 移除已存在的记录
      this.recentSpeakers = this.recentSpeakers.filter(s => s.id !== speaker.id)
      
      // 添加到开头
      this.recentSpeakers.unshift(speaker)
      
      // 限制最近使用列表长度
      if (this.recentSpeakers.length > 10) {
        this.recentSpeakers = this.recentSpeakers.slice(0, 10)
      }
    }
  }
})