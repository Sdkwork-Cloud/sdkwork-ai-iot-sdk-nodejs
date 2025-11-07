import { Sdkwork } from "@/types/sdkwork";

interface ImportMetaEnv {
  readonly VITE_GLOB_ACCESS_TOKEN: string;
  readonly VITE_GLOB_API_BASE_URL: string;
  readonly VITE_GLOB_OPEN_API_BASE_URL: string;
  readonly VITE_GLOB_H5_URL: string;
  readonly VITE_GLOB_WAP_HOST: string;
  readonly VITE_SERVICE_BASE_URL: string;
  readonly VITE_OTHER_SERVICE_BASE_URL: string;
  readonly VITE_SOURCE_MAP: string;
  readonly VITE_HTTP_PROXY: string;
  readonly MODE: string;
  readonly VITE_GLOB_LAUNCH_MODE: string;
  // LLM相关环境变量
  readonly VITE_GLOB_LLM_API_KEY: string;
  readonly VITE_GLOB_LLM_BASE_URL: string;
  readonly VITE_GLOB_LLM_MODEL: string;
  // Websocket配置
  readonly VITE_GLOB_WS_BASE_URL: string;
}

// 应用配置接口
export interface AppConfig {
  // 环境模式
  mode: "dev" | "test" | "prod";

  // 认证令牌
  accessToken: string;

  // API基础URL
  apiBaseURL: string;
  // Open API基础URL
  openApiBaseURL: string;
  // H5 URL
  h5URL: string;

  // WAP主机
  wapHost: string;

  // 服务基础URL
  serviceBaseURL: string;
  // Websocket基础URL
  websocketBaseURL: string;
  // 其他服务URL配置
  otherServiceURLs: Record<string, string>;

  // 是否启用源码映射
  sourceMap: boolean;

  // 是否启用HTTP代理
  httpProxy: boolean;
  // 运行模式，Local版本所有数据都在本地，Server版本所有数据都从服务器获取
  launchMode: "local" | "server";
  // LLM配置
  llm: Sdkwork.SdkworkLLMConfig;
}

/**
 * 解析JSON字符串
 * @param jsonString JSON字符串
 * @param defaultValue 默认值
 */
function parseJSON<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 创建应用配置
 */
function createAppConfig(): AppConfig {
  const env: ImportMetaEnv | any = import.meta.env;

  return {
    // 环境模式
    mode: env.MODE as "dev" | "test" | "prod",

    // 认证令牌
    accessToken: env.VITE_GLOB_ACCESS_TOKEN || "",

    // API基础URL
    apiBaseURL: env.VITE_GLOB_API_BASE_URL || "",
    // Open API基础URL
    openApiBaseURL: env.VITE_GLOB_OPEN_API_BASE_URL || "",

    // H5 URL
    h5URL: env.VITE_GLOB_H5_URL || "",

    // WAP主机
    wapHost: env.VITE_GLOB_WAP_HOST || "",

    // 服务基础URL
    serviceBaseURL: env.VITE_SERVICE_BASE_URL || "",
    // Websocket基础URL
    websocketBaseURL: env.VITE_GLOB_WS_BASE_URL || "wss://api.sdkwork.com/iot/ws/v1/sdkwork/1hSZfTnIbg5WCPFlSTv8kFW2pa",
    // 其他服务URL配置
    otherServiceURLs: parseJSON(env.VITE_OTHER_SERVICE_BASE_URL || "{}", {}),

    // 是否启用源码映射
    sourceMap: env.VITE_SOURCE_MAP === "Y",

    // 是否启用HTTP代理
    httpProxy: env.VITE_HTTP_PROXY === "Y",
    // 启动版本
    launchMode: (env.VITE_GLOB_LAUNCH_MODE || "server") as "local" | "server",

    // LLM配置
    llm: {
      apiKey: env.VITE_GLOB_LLM_API_KEY || "",
      baseURL: env.VITE_GLOB_LLM_BASE_URL || "",
      model: env.VITE_GLOB_LLM_MODEL || "",
    },
  };
}

// 创建配置实例
export const appConfig = createAppConfig();

// 导出配置获取方法
/**
 * Retrieves the application configuration object.
 * @returns The app configuration object of type AppConfig
 */
export function useAppConfig(): AppConfig {
  return appConfig;
}

// 导出常用配置获取方法
export function getAccessToken(): string {
  return appConfig.accessToken;
}

export function getApiBaseURL(): string {
  return appConfig.apiBaseURL;
}

export function getOpenApiBaseURL(): string {
  return appConfig.openApiBaseURL;
}

export function getH5URL(): string {
  return appConfig.h5URL;
}

export function getWapHost(): string {
  return appConfig.wapHost;
}

export function getServiceBaseURL(): string {
  return appConfig.serviceBaseURL;
}

export function getOtherServiceURL(serviceName: string): string {
  return appConfig.otherServiceURLs[serviceName] || "";
}

export function isSourceMapEnabled(): boolean {
  return appConfig.sourceMap;
}

export function isHttpProxyEnabled(): boolean {
  return appConfig.httpProxy;
}

export function getEnvMode(): "dev" | "test" | "prod" {
  return appConfig.mode;
}

// 导出 LLM 配置获取方法
export function getLLMConfig(): Sdkwork.SdkworkLLMConfig {
  return appConfig.llm;
}

export function getLaunchMode(): "local" | "server" {
  return appConfig.launchMode;
}
