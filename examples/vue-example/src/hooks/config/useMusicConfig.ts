import { Sdkwork } from "@/types/sdkwork";
import { useConfigStore } from "@/stores/modules/config";

/**
 * Hook to access music configuration from the config store
 * @returns Music configuration from the config store
 */
export function useMusicConfig(): Sdkwork.SdkworkMusicConfig {
  const configStore = useConfigStore();
  
  // Return the configuration object directly
  return configStore.music;
}