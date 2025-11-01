import { defineStore } from 'pinia'
import type { AgentStoreState } from './types'
import { AgentService } from '@/services'
import type { AiAgentParam, QueryListParam } from 'sdkwork-sdk-api-typescript'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

export const useAgentStore = defineStore('agent', {
  state: (): AgentStoreState => ({
    // Agent management
    agents: [],
    selectedAgentId: null,
    // UI/Filter states
    ui: {
      searchQuery: '',
      isLoading: false
    }
  }),

  getters: {
    /**
     * 获取选中的智能体
     */
    selectedAgent: (state) => {
      if (!state.selectedAgentId) return null
      return state.agents.find(agent => agent.id === state.selectedAgentId)
    },

    /**
     * 根据搜索条件过滤智能体
     */
    filteredAgents: (state) => {
      const query = state.ui.searchQuery.toLowerCase().trim()
      if (!query) return state.agents
      
      return state.agents.filter(agent => 
        agent.name?.toLowerCase().includes(query) ||
        agent.description?.toLowerCase().includes(query) ||
        agent.tags?.tags?.some((tag:any) => tag.toLowerCase().includes(query))
      )
    },

    /**
     * 按状态分组的智能体
     */
    agentsByStatus: (state) => {
      const grouped = {
        active: [] as typeof state.agents,
        inactive: [] as typeof state.agents,
        draft: [] as typeof state.agents
      }
      
      state.agents.forEach(agent => {
        switch (agent.status) {
          case 'ACTIVE':
            grouped.active.push(agent)
            break
          case 'INACTIVE':
            grouped.inactive.push(agent)
            break
          case 'DRAFT':
            grouped.draft.push(agent)
            break
          default:
            grouped.inactive.push(agent)
        }
      })
      
      return grouped
    },


  },

  actions: {
    /**
     * 设置搜索查询
     */
    setSearchQuery(query: string) {
      this.ui.searchQuery = query
    },

    /**
     * 设置加载状态
     */
    setLoading(loading: boolean) {
      this.ui.isLoading = loading
    },



    /**
     * 选择智能体
     */
    selectAgent(agentId: string | null) {
      this.selectedAgentId = agentId
    },

    /**
     * 创建智能体
     */
    async createAgent(data: AiAgentParam) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        const newAgent = await service.create(data)
        
        // 添加到本地列表
        this.agents.push(newAgent)
        
        // 自动选择新创建的智能体
        this.selectAgent(newAgent.id?.toString() || null)
        
        return newAgent
      } catch (error) {
        console.error('创建智能体失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 更新智能体
     */
    async updateAgent(data: AiAgentParam) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        const updatedAgent = await service.update(data)
        
        // 更新本地列表
        const index = this.agents.findIndex(agent => agent.id === updatedAgent.id)
        if (index !== -1) {
          this.agents[index] = updatedAgent
        }
        
        return updatedAgent
      } catch (error) {
        console.error('更新智能体失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 获取智能体详情
     */
    async retrieveAgent(id: string | number) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        const agent = await service.retrieve(id)
        
        // 更新或添加到本地列表
        const index = this.agents.findIndex(a => a.id === agent.id)
        if (index !== -1) {
          this.agents[index] = agent
        } else {
          this.agents.push(agent)
        }
        
        return agent
      } catch (error) {
        console.error('获取智能体详情失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 删除智能体
     */
    async deleteAgent(id: string | number) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        const success = await service.delete(id)
        
        if (success) {
          // 从本地列表移除
          this.agents = this.agents.filter(agent => agent.id !== id)
          
          // 如果删除的是当前选中的智能体，清空选择
          if (this.selectedAgentId === id.toString()) {
            this.selectAgent(null)
          }
        }
        
        return success
      } catch (error) {
        console.error('删除智能体失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * 分页获取智能体列表
     */
    async list(data: QueryListParam, pageableParams?: Pageable|any) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        pageableParams=pageableParams||{
          page:0,
          size:10
        }
        if(pageableParams.page==undefined){
          pageableParams.page=0
        }
        if(pageableParams.size==undefined){
          pageableParams.size=10
        } 
        const page = await service.listByPage(data, pageableParams)
        
        // 更新本地列表（替换或合并）
        if (pageableParams?.page === 0) {
          // 第一页，替换整个列表
          this.agents = page.content || []
        } else {
          // 后续页面，合并到现有列表
          const existingIds = new Set(this.agents.map(agent => agent.id))
          const newAgents = (page.content || []).filter((agent:any) => !existingIds.has(agent.id))
          this.agents.push(...newAgents)
        }
        
        return page
      } catch (error) {
        console.error('获取智能体列表失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
  
async listPublic(data: QueryListParam, pageableParams?: Pageable|any) {
      try {
        this.setLoading(true)
        const service = new AgentService()
        pageableParams=pageableParams||{
          page:0,
          size:10
        }
        if(pageableParams.page==undefined){
          pageableParams.page=0
        }
        if(pageableParams.size==undefined){
          pageableParams.size=10
        } 
        const page = await service.listPublic(data, pageableParams)
        
        // 更新本地列表（替换或合并）
        if (pageableParams?.page === 0) {
          // 第一页，替换整个列表
          this.agents = page.content || []
        } else {
          // 后续页面，合并到现有列表
          const existingIds = new Set(this.agents.map(agent => agent.id))
          const newAgents = (page.content || []).filter((agent:any) => !existingIds.has(agent.id))
          this.agents.push(...newAgents)
        }
        
        return page
      } catch (error) {
        console.error('获取智能体列表失败:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },


    /**
     * 切换智能体状态
     */
    async toggleAgentStatus(agentId: string | number) {
      try {
        const agent = this.agents.find(a => a.id === agentId)
        if (!agent) throw new Error('智能体不存在')
        
        const newStatus = agent.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        const updateData: AiAgentParam = {
          ...agent,
          status: newStatus as any
        }
        
        return await this.updateAgent(updateData)
      } catch (error) {
        console.error('切换智能体状态失败:', error)
        throw error
      }
    },

    /**
     * 根据分类获取智能体
     */
    getAgentsByCategory(categoryId: string | number) {
      return this.agents.filter(agent => agent.categoryId === categoryId)
    },

    /**
     * 根据类型获取智能体
     */
    getAgentsByType(type: string) {
      return this.agents.filter(agent => agent.type === type)
    },

    /**
     * 清空智能体列表
     */
    clearAgents() {
      this.agents = []
      this.selectAgent(null)
    },

    /**
     * 重置状态
     */
    reset() {
      this.agents = []
      this.selectedAgentId = null
      this.ui.searchQuery = ''
      this.ui.isLoading = false
    }
  }
})