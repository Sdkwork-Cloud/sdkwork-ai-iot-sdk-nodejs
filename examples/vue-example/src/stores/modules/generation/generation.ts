import { defineStore } from 'pinia'
import type { GenerationStoreState, GenerationItem } from './types'
import { GenerationService } from '@/services'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

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
    async generateImage(params: any) {
      try {
        this.setCurrentTask({
          type: 'image',
          status: 'generating',
          progress: 0
        })
        
        const service = new GenerationService()
        const result = await service.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 添加到生成记录列表
        this.generations.unshift(result)
        
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
     * 生成视频
     */
    async generateVideo(params: any) {
      try {
        this.setCurrentTask({
          type: 'video',
          status: 'generating',
          progress: 0
        })
        
        const service = new GenerationService()
        const result = await service.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 添加到生成记录列表
        this.generations.unshift(result)
        
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
     * 生成音乐
     */
    async generateMusic(params: any) {
      try {
        this.setCurrentTask({
          type: 'music',
          status: 'generating',
          progress: 0
        })
        
        const service = new GenerationService()
        const result = await service.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 添加到生成记录列表
        this.generations.unshift(result)
        
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
     * 生成语音
     */
    async generateVoice(params: any) {
      try {
        this.setCurrentTask({
          type: 'voice',
          status: 'generating',
          progress: 0
        })
        
        const service = new GenerationService()
        const result = await service.create(params)
        
        this.setCurrentTask({
          status: 'completed',
          progress: 100,
          result
        })
        
        // 添加到生成记录列表
        this.generations.unshift(result)
        
        return result
      } catch (error) {
        this.setCurrentTask({
          status: 'failed',
          progress: 0
        })
        console.error('生成语音失败:', error)
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