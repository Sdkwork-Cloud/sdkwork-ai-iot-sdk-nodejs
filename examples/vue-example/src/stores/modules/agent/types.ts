import { AiAgentVO } from "@/services"

export interface AgentStoreState {
  // Agent management
  agents: AiAgentVO[]
  selectedAgentId: string | null
  // UI/Filter states
  ui: {
    searchQuery: string
    isLoading: boolean
  }
}