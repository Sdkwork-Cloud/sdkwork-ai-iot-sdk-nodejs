import { useAgentStore } from '@/stores/modules/agent'

export const useAgent = () => {
  const agentStore = useAgentStore()

  return {
    agentStore
  }
}