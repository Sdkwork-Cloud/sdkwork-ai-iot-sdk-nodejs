import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access platform API configuration from the config store
 * @returns Platform configuration from the config store
 */
export function usePlatformConfig(): Sdkwork.SdkworkPlatformConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.platform;
}