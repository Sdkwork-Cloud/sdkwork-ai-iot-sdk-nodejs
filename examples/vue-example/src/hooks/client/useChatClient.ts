 
import { useLLMConfig } from "../config/useLLMConfig"; 
import { useAppConfig } from "@/config/app";

export function useChatClient() {
  const appConfig = useAppConfig();
  const config: any = useLLMConfig(); 
  return {};
}
