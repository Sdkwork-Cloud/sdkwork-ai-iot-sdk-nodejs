import { defineStore } from "pinia";
import { Sdkwork } from "@/types/sdkwork";
import { getAccessToken, getApiBaseURL, useAppConfig } from "@/config/app";

interface ConfigState {
  llm: Sdkwork.SdkworkLLMConfig;
  audio: Sdkwork.SdkworkAudioConfig;
  video: Sdkwork.SdkworkVideoConfig;
  music: Sdkwork.SdkworkMusicConfig;
  cloudStorage: Sdkwork.SdkworkCloudStorageConfig;
  image: Sdkwork.SdkworkImageConfig;
  platform: Sdkwork.SdkworkPlatformConfig;
}
const appConfig = useAppConfig();
// 默认配置
const defaultLLMConfig: Sdkwork.SdkworkLLMConfig = {
  apiKey: appConfig.llm.apiKey,
  baseURL: appConfig.llm.baseURL,
  model: appConfig.llm.model,
};

const defaultAudioConfig: Sdkwork.SdkworkAudioConfig = {
  apiKey: "audio-api-key-abcde",
  baseURL: "https://api.sdkwork.com/audio/v1",
  sampleRate: 44100,
  channels: 2,
  format: "mp3",
  quality: 0.8,
};

const defaultVideoConfig: Sdkwork.SdkworkVideoConfig = {
  apiKey: "video-api-key-fghij",
  baseURL: "https://api.sdkwork.com/video/v1",
  width: 1920,
  height: 1080,
  frameRate: 30,
  codec: "h264",
  container: "mp4",
};

const defaultMusicConfig: Sdkwork.SdkworkMusicConfig = {
  apiKey: "music-api-key-klmno",
  baseURL: "https://api.sdkwork.com/music/v1",
  sampleRate: 48000,
  bitDepth: 24,
  channels: 2,
  format: "wav",
};

const defaultCloudStorageConfig: Sdkwork.SdkworkCloudStorageConfig = {
  apiKey: "storage-api-key-uvwxy",
  baseURL: "https://api.sdkwork.com/storage/v1",
  region: "us-east-1",
  bucket: "sdkwork-default",
  acl: "private",
  encryption: true,
  versioning: true,
};

const defaultImageConfig: Sdkwork.SdkworkImageConfig = {
  apiKey: "image-api-key-pqrst",
  baseURL: "https://api.sdkwork.com/image/v1",
  width: 1024,
  height: 1024,
  format: "webp",
  quality: 85,
  preserveAspectRatio: true,
  optimizeForWeb: true,
};

const defaultPlatformConfig: Sdkwork.SdkworkPlatformConfig = {
  apiKey: "platform-api-key-pqrst",
  accessToken: getAccessToken(),
  baseURL: getApiBaseURL(),
  apiVersion: "2023-09-01",
  tenantId: "default-tenant",
  region: "global",
  serviceLevel: "standard",
  timeout: 30000, 
  rateLimit: {
    requestsPerMinute: 100,
    concurrentRequests: 10,
  },
  authMethod: "api_key",
  webhooks: {
    endpointUrl: "",
    events: ["user.created", "user.updated", "content.published"],
    secret: "",
  },
};

export const useConfigStore = defineStore("config", {
  state: (): ConfigState => ({
    llm: new Sdkwork.SdkworkLLMConfig(defaultLLMConfig),
    audio: new Sdkwork.SdkworkAudioConfig(defaultAudioConfig),
    video: new Sdkwork.SdkworkVideoConfig(defaultVideoConfig),
    music: new Sdkwork.SdkworkMusicConfig(defaultMusicConfig),
    cloudStorage: new Sdkwork.SdkworkCloudStorageConfig(
      defaultCloudStorageConfig
    ),
    image: new Sdkwork.SdkworkImageConfig(defaultImageConfig),
    platform: new Sdkwork.SdkworkPlatformConfig(defaultPlatformConfig),
  }),

  getters: {
    // 获取所有配置
    getAllConfigs(): ConfigState {
      return {
        llm: this.llm,
        audio: this.audio,
        video: this.video,
        music: this.music,
        cloudStorage: this.cloudStorage,
        image: this.image,
        platform: this.platform,
      };
    },

    // 获取特定服务的API密钥
    getApiKey:
      (state) =>
      (service: keyof ConfigState): string | undefined => {
        return state[service].apiKey;
      },

    // 获取特定服务的基础URL
    getBaseURL:
      (state) =>
      (service: keyof ConfigState): string | undefined => {
        return state[service].baseURL;
      },

    // 检查是否所有必需的API密钥都已配置
    areApiKeysConfigured(): boolean {
      return Boolean(
        this.llm.apiKey &&
          this.audio.apiKey &&
          this.video.apiKey &&
          this.music.apiKey &&
          this.cloudStorage.apiKey &&
          this.image.apiKey &&
          this.platform.apiKey
      );
    },

    // 获取平台API版本
    getPlatformApiVersion(): string | undefined {
      return this.platform.apiVersion;
    },

    // 获取平台服务级别
    getPlatformServiceLevel(): "basic" | "standard" | "premium" | undefined {
      return this.platform.serviceLevel;
    },

    // 获取平台速率限制设置
    getPlatformRateLimit():
      | Sdkwork.SdkworkPlatformConfig["rateLimit"]
      | undefined {
      return this.platform.rateLimit;
    },

    // 检查是否所有必需的Webhook配置都已设置
    areWebhooksConfigured(): boolean {
      return Boolean(
        this.platform.webhooks?.endpointUrl &&
          this.platform.webhooks?.secret &&
          this.platform.webhooks?.events?.length
      );
    },
  },

  actions: {
    // 更新LLM配置
    updateLLMConfig(config: Partial<Sdkwork.SdkworkLLMConfig>): void {
      this.llm = { ...this.llm, ...config };
    },

    // 更新音频配置
    updateAudioConfig(config: Partial<Sdkwork.SdkworkAudioConfig>): void {
      this.audio = { ...this.audio, ...config };
    },

    // 更新视频配置
    updateVideoConfig(config: Partial<Sdkwork.SdkworkVideoConfig>): void {
      this.video = { ...this.video, ...config };
    },

    // 更新音乐配置
    updateMusicConfig(config: Partial<Sdkwork.SdkworkMusicConfig>): void {
      this.music = { ...this.music, ...config };
    },

    // 更新云存储配置
    updateCloudStorageConfig(
      config: Partial<Sdkwork.SdkworkCloudStorageConfig>
    ): void {
      this.cloudStorage = { ...this.cloudStorage, ...config };
    },

    // 更新图像配置
    updateImageConfig(config: Partial<Sdkwork.SdkworkImageConfig>): void {
      this.image = { ...this.image, ...config };
    },

    // 更新平台配置
    updatePlatformConfig(config: Partial<Sdkwork.SdkworkPlatformConfig>): void {
      this.platform = { ...this.platform, ...config };
    },

    // 更新特定服务的API密钥
    updateApiKey(service: keyof ConfigState, apiKey: string): void {
      this[service].apiKey = apiKey;
    },

    // 更新平台API版本
    updatePlatformApiVersion(apiVersion: string): void {
      this.platform.apiVersion = apiVersion;
    },

    // 更新平台服务级别
    updatePlatformServiceLevel(
      serviceLevel: "basic" | "standard" | "premium"
    ): void {
      this.platform.serviceLevel = serviceLevel;
    },

    // 更新平台速率限制
    updatePlatformRateLimit(
      rateLimit: Partial<
        NonNullable<Sdkwork.SdkworkPlatformConfig["rateLimit"]>
      >
    ): void {
      if (!this.platform.rateLimit) {
        this.platform.rateLimit = {};
      }
      this.platform.rateLimit = { ...this.platform.rateLimit, ...rateLimit };
    },

    // 配置Webhook
    configureWebhook(
      config: Partial<NonNullable<Sdkwork.SdkworkPlatformConfig["webhooks"]>>
    ): void {
      if (!this.platform.webhooks) {
        this.platform.webhooks = {};
      }
      this.platform.webhooks = { ...this.platform.webhooks, ...config };
    },

    // 移除Webhook事件订阅
    unsubscribeFromWebhookEvent(event: string): void {
      if (this.platform.webhooks?.events) {
        this.platform.webhooks.events = this.platform.webhooks.events.filter(
          (e) => e !== event
        );
      }
    },

    // 重置所有配置到默认值
    resetAllConfigs(): void {
      this.llm = new Sdkwork.SdkworkLLMConfig(defaultLLMConfig);
      this.audio = new Sdkwork.SdkworkAudioConfig(defaultAudioConfig);
      this.video = new Sdkwork.SdkworkVideoConfig(defaultVideoConfig);
      this.music = new Sdkwork.SdkworkMusicConfig(defaultMusicConfig);
      this.cloudStorage = new Sdkwork.SdkworkCloudStorageConfig(
        defaultCloudStorageConfig
      );
      this.image = new Sdkwork.SdkworkImageConfig(defaultImageConfig);
      this.platform = new Sdkwork.SdkworkPlatformConfig(defaultPlatformConfig);
    },

    // 注意：不再需要手动的localStorage方法，因为使用了pinia-plugin-persistedstate插件
    // 该插件会自动处理状态的持久化和恢复
  },
});
