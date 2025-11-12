import { defineStore } from 'pinia'
import type { GenerationStoreState, GenerationItem } from './types'
import { GenerationService } from '@/services'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { GenerateImageParam, GenerateMusicParam, GenerateVideoParam } from 'sdkwork-sdk-api-typescript'
import { GenerationImageService } from '@/services/src/service/generation/image/image'
import { GenerationMusicService } from '@/services/src/service/generation/music/music'
import { GenerationVideoService } from '@/services/src/service/generation/video/video'

export const useGenerationStore = defineStore('generation', {
  state: (): GenerationStoreState => ({
    // Generation management
    generations: [],
    selectedGenerationId: null,
    
    // Generation tasks
    currentTask: {
      type: null,
      status: 'idle',
      progress: 0,
      result: null
    },
    
    // UI/Filter states
    ui: {
      searchQuery: '',
      isLoading: false,
      filterType: 'all'
    }
  }),

  getters: {
    /**
     * 获取选中的生成记录
     */
    selectedGeneration: (state) => {
      if (!state.selectedGenerationId) return null
      return state.generations.find(generation => generation.id === state.selectedGenerationId)
    },

    /**
     * 根据搜索条件和过滤器过滤生成记录
     */
    filteredGenerations: (state) => {
      const query = state.ui.searchQuery.toLowerCase().trim()
      const filterType = state.ui.filterType
      
      let filtered = state.generations
      
      // 按类型过滤
      if (filterType !== 'all') {
        filtered = filtered.filter(generation => generation.type === filterType)
      }
      
      // 按搜索关键词过滤
      if (query) {
        filtered = filtered.filter(generation => 
          generation.title?.toLowerCase().includes(query) ||
          generation.description?.toLowerCase().includes(query)
        )
      }
      
      return filtered
    },

    /**
     * 按类型分组的生成记录
     */
    generationsByType: (state) => {
      const grouped:any = {
        image: [] as GenerationItem[],
        video: [] as GenerationItem[],
        music: [] as GenerationItem[],
        voice: [] as GenerationItem[]
      }
      
      state.generations.forEach(generation => {
        grouped[generation.type].push(generation)
      })
      
      return grouped
    },

    /**
     * 按状态分组的生成记录
     */
    generationsByStatus: (state) => {
      const grouped = {
        pending: [] as GenerationItem[],
        processing: [] as GenerationItem[],
        completed: [] as GenerationItem[],
        failed: [] as GenerationItem[]
      }
      
      state.generations.forEach(generation => {
        grouped[generation.status].push(generation)
      })
      
      return grouped
    }
  },

  actions: {
    /**
     * 设置搜索查询
     */
    setSearchQuery(query: string) {
      this.ui.searchQuery = query
    },

    /**
     * 设置过滤器类型
     */
    setFilterType(type: 'all' | 'image' | 'video' | 'music' | 'voice') {
      this.ui.filterType = type
    },

    /**
     * 设置加载状态
     */
    setLoading(loading: boolean) {
      this.ui.isLoading = loading
    },

    /**
     * 选择生成记录
     */
    selectGeneration(generationId: string | null) {
      this.selectedGenerationId = generationId
    },

    /**
     * 设置当前生成任务
     */
    setCurrentTask(task: Partial<GenerationStoreState['currentTask']>) {
      this.currentTask = { ...this.currentTask, ...task }
    },

    /**
     * 生成图片
     */
    async generateImage(params: GenerateImageParam) {
      try {
        this.setCurrentTask({
          type: 'image',
          status: 'generating',
          progress: 0
        })
        
        // 使用专门的图片生成服务
        const imageService = new GenerationImageService()
        const result = await imageService.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 添加到生成记录列表
        // 从result.images数组中获取第一张图片的URL和信息
        const imageUrl = result.images?.images?.[0]?.url || '';
        const imageWidth = result.images?.images?.[0]?.width || params.width || 1024;
        const imageHeight = result.images?.images?.[0]?.height || params.height || 1024;
        
        this.generations.unshift({
          id: result.taskId || `img-${Date.now()}`,
          type: 'image',
          title: params.prompt || '生成的图片',
          description: `模型: ${params.model || '默认'}, 尺寸: ${imageWidth}x${imageHeight}`,
          status: 'completed',
          createdAt: new Date().toISOString(),
          result: {
            id: result.taskId,
            url: imageUrl,
            width: imageWidth,
            height: imageHeight,
            model: params.model,
            prompt: params.prompt,
            requestId: result.requestId,
            status: result.status
          }
        })
        
        return result
      } catch (error) {
        this.setCurrentTask({
          status: 'failed',
          progress: 0
        })
        console.error('生成图片失败:', error)
        throw error
      }
    },

    /**
     * 生成音乐
     */
    async generateMusic(params: GenerateMusicParam) {
      try {
        this.setCurrentTask({
          type: 'music',
          status: 'generating',
          progress: 0
        })
        
        // 使用专门的音乐生成服务
        const musicService = new GenerationMusicService()
        const result:any = await musicService.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 从result.audios数组中获取第一个音频的URL和信息
        const audioUrl = result.audios?.audios?.[0]?.url || '';
        const audioDuration = result.audios?.audios?.[0]?.duration || 0;
        const audioFormat = result.audios?.audios?.[0]?.format || '';
        
        // 添加到生成记录列表
        this.generations.unshift({
          id: result.taskId || result.id || `music-${Date.now()}`,
          type: 'music',
          title: params.prompt || '生成的音乐',
          description: `模型: ${params.model || '默认'}, 风格: ${params.style || '无'}, 乐器: ${params.instrument || '无'}`,
          status: 'completed',
          createdAt: new Date().toISOString(),
          result: {
            id: result.taskId || result.id,
            url: audioUrl,
            model: params.model,
            style: params.style,
            instrument: params.instrument,
            tempo: params.tempo,
            duration: audioDuration,
            format: audioFormat,
            prompt: params.prompt,
            lyrics: result.lyrics || params.lyrics,
            requestId: result.requestId,
            status: result.status
          }
        })
        
        return result
      } catch (error) {
        this.setCurrentTask({
          status: 'failed',
          progress: 0
        })
        console.error('生成音乐失败:', error)
        throw error
      }
    },

    /**
     * 生成视频
     */
    async generateVideo(params: GenerateVideoParam) {
      try {
        this.setCurrentTask({
          type: 'video',
          status: 'generating',
          progress: 0
        })
        
        // 使用专门的视频生成服务
        const videoService = new GenerationVideoService()
        const result:any = await videoService.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 从result.videos数组中获取第一个视频的URL和信息
        const videoUrl = result.videos?.videos?.[0]?.url || '';
        const videoWidth = result.videos?.videos?.[0]?.width || params.width || 1920;
        const videoHeight = result.videos?.videos?.[0]?.height || params.height || 1080;
        
        // 添加到生成记录列表
        this.generations.unshift({
          id: result.taskId || result.id || `video-${Date.now()}`,
          type: 'video',
          title: params.prompt || '生成的视频',
          description: `模型: ${params.model || '默认'}, 尺寸: ${videoWidth}x${videoHeight}`,
          status: 'completed',
          createdAt: new Date().toISOString(),
          result: {
            id: result.taskId || result.id,
            url: videoUrl,
            width: videoWidth,
            height: videoHeight,
            model: params.model,
            prompt: params.prompt,
            requestId: result.requestId,
            status: result.status
          }
        })
        
        return result
      } catch (error) {
        this.setCurrentTask({
          status: 'failed',
          progress: 0
        })
        console.error('生成视频失败:', error)
        throw error
      }
    },

    /**
     * 获取生成记录列表
     */
    async listGenerations(data: any, pageableParams?: Pageable|any) {
      try {
        this.setLoading(true)
        const service = new GenerationService()
        
        pageableParams = pageableParams || {
          page: 0,
          size: 10
        }
        
        if (pageableParams.page === undefined) {
          pageableParams.page = 0
        }
        if (pageableParams.size === undefined) {
          pageableParams.size = 10
        }
        
        const page = await service.list(data, pageableParams)
        
        // 更新本地列表（替换或合并）
        if (pageableParams?.page === 0) {
          // 第一页，替换整个列表
          this.generations = page.content || []
        } else {
          // 后续页面，合并到现有列表
          const existingIds = new Set(this.generations.map(generation => generation.id))
          const newGenerations = (page.content || []).filter((generation: any) => !existingIds.has(generation.id))
          this.generations.push(...newGenerations)
        }
        
        return page
      } catch (error) {
        console.error('获取生成记录列表失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 获取生成记录详情
     */
    async getGeneration(id: string) {
      try {
        this.setLoading(true)
        const service = new GenerationService()
        const generation = await service.get(id)
        
        // 更新或添加到本地列表
        const index = this.generations.findIndex(g => g.id === generation.id)
        if (index !== -1) {
          this.generations[index] = generation
        } else {
          this.generations.push(generation)
        }
        
        return generation
      } catch (error) {
        console.error('获取生成记录详情失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 删除生成记录
     */
    async deleteGeneration(id: string) {
      try {
        this.setLoading(true)
        const service = new GenerationService()
        const success = await service.delete(id)
        
        if (success) {
          // 从本地列表移除
          this.generations = this.generations.filter(generation => generation.id !== id)
          
          // 如果删除的是当前选中的生成记录，清空选择
          if (this.selectedGenerationId === id) {
            this.selectGeneration(null)
          }
        }
        
        return success
      } catch (error) {
        console.error('删除生成记录失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 清空生成记录列表
     */
    clearGenerations() {
      this.generations = []
      this.selectGeneration(null)
    },

    /**
     * 重置当前任务状态
     */
    resetCurrentTask() {
      this.currentTask = {
        type: null,
        status: 'idle',
        progress: 0,
        result: null
      }
    },

    /**
     * 重置状态
     */
    reset() {
      this.generations = []
      this.selectedGenerationId = null
      this.resetCurrentTask()
      this.ui.searchQuery = ''
      this.ui.isLoading = false
      this.ui.filterType = 'all'
    }
  }
})