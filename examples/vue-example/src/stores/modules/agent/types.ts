export interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  lastActive: Date
  capabilities: string[]
  rating: number
  conversationCount: number
}

export type SpeakState = 'IDLE' | 'LISTENING' | 'SPEAKING'

export interface AgentStoreState {
  // Agent management
  agents: Agent[]
  selectedAgentId: string | null
  speakState: SpeakState
  // UI/Filter states
  ui: {
    searchQuery: string
    isLoading: boolean
  }
}