import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access cloud storage configuration from the config store
 * @returns Cloud storage configuration from the config store
 */
export function useCloudStorageConfig(): Sdkwork.SdkworkCloudStorageConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.cloudStorage;
}