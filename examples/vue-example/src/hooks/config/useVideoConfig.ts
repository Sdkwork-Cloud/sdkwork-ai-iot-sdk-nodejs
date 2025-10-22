import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access video configuration from the config store
 * @returns Video configuration from the config store
 */
export function useVideoConfig(): Sdkwork.SdkworkVideoConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.video;
}