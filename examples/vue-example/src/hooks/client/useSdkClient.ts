import { useAppConfig } from "@/config/app";
import { DefaultExceptionResponseHandler } from "@/core/framework/exception";
import { tokenManager } from "@/core/framework/token";
import { SdkClient } from "sdkwork-sdk-api-typescript";
import type { SdkClientOptions } from "sdkwork-commons-typescript";

let sdkClient: SdkClient | null = null;

export function useSdkClient(): SdkClient {
  if (sdkClient) {
    return sdkClient;
  }

  const appConfig = useAppConfig();
  const options: SdkClientOptions = {
    accessToken: appConfig.accessToken,
    baseUrl: appConfig.apiBaseURL || "http://127.0.0.1:8000",
    exceptionHandler: new DefaultExceptionResponseHandler(),
    tokenManager: tokenManager,
  };
  
  sdkClient = new SdkClient(options);
  return sdkClient;
}