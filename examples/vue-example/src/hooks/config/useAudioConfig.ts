import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access audio configuration from the config store
 * @returns Audio configuration from the config store
 */
export function useAudioConfig(): Sdkwork.SdkworkAudioConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.audio;
}