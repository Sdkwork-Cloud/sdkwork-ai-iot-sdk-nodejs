import { defineStore } from 'pinia'
import type { Agent, AgentStoreState } from './types'

export const useAgentStore = defineStore('agent', {
  state: (): AgentStoreState => ({
    // Agent management
    agents: [],
    selectedAgentId: null,
    speakState: 'IDLE',
    // UI/Filter states
    ui: {
      searchQuery: '',
      isLoading: false
    }
  }),

  getters: {
    filteredAgents: (state) => {
      if (!state.ui.searchQuery.trim()) {
        return state.agents
      }
      
      const query = state.ui.searchQuery.toLowerCase()
      return state.agents.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(query))
      )
    },
    
    onlineAgents: (state) => {
      return state.agents.filter(agent => agent.status === 'online')
    },
    
    getAgentById: (state) => (id: string) => {
      return state.agents.find(agent => agent.id === id)
    },
    
    popularAgents: (state) => {
      return [...state.agents]
        .sort((a, b) => b.conversationCount - a.conversationCount)
        .slice(0, 5)
    }
  },

  actions: {
    async fetchAgents() {
      this.ui.isLoading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟智能体数据
        this.agents = [
          {
            id: '1',
            name: 'AI助手',
            description: '通用人工智能助手，可以回答各种问题',
            avatar: '🤖',
            status: 'online',
            lastActive: new Date(),
            capabilities: ['问答', '翻译', '编程'],
            rating: 4.8,
            conversationCount: 1250
          },
          {
            id: '2',
            name: '设备专家',
            description: '智能设备管理和故障诊断专家',
            avatar: '🔧',
            status: 'online',
            lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
            capabilities: ['设备诊断', '固件更新', '故障排除'],
            rating: 4.6,
            conversationCount: 890
          },
          {
            id: '3',
            name: '数据分析师',
            description: '数据分析和可视化专家',
            avatar: '📊',
            status: 'busy',
            lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2分钟前
            capabilities: ['数据分析', '图表生成', '趋势预测'],
            rating: 4.7,
            conversationCount: 670
          },
          {
            id: '4',
            name: '安全顾问',
            description: '网络安全和设备安全专家',
            avatar: '🛡️',
            status: 'offline',
            lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
            capabilities: ['安全检测', '漏洞扫描', '风险评估'],
            rating: 4.9,
            conversationCount: 420
          }
        ]
      } catch (error) {
        console.error('Failed to fetch agents:', error)
      } finally {
        this.ui.isLoading = false
      }
    },
    
    selectAgent(agentId: string) {
      this.selectedAgentId = agentId
    },
    
    updateAgentStatus(agentId: string, status: Agent['status']) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.status = status
        agent.lastActive = new Date()
      }
    },
    
    incrementConversationCount(agentId: string) {
      const agent = this.agents.find(a => a.id === agentId)
      if (agent) {
        agent.conversationCount++
      }
    },
    
    setSearchQuery(query: string) {
      this.ui.searchQuery = query
    },
    
    addAgent(agent: Omit<Agent, 'id'>) {
      const newAgent: Agent = {
        ...agent,
        id: Date.now().toString()
      }
      this.agents.push(newAgent)
    }
  }
})