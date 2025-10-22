import { useAgentStore } from '@/stores/modules/agent'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useAgent = () => {
  const agentStore = useAgentStore()
  const { t } = useI18n()

  const speakState = computed(() => agentStore.speakState)
  
  const speakStateText = computed(() => {
    return t(`agent.speakState.${agentStore.speakState}`)
  })

  const setSpeakState = (state: 'IDLE' | 'LISTENING' | 'SPEAKING') => {
    agentStore.speakState = state
  }

  return {
    speakState,
    speakStateText,
    setSpeakState,
    agentStore
  }
}