import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access LLM configuration from the config store
 * @returns LLM configuration from the config store
 */
export function useLLMConfig(): Sdkwork.SdkworkLLMConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.llm;
}