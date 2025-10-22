import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access image configuration from the config store
 * @returns Image configuration from the config store
 */
export function useImageConfig(): Sdkwork.SdkworkImageConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.image;
}