export namespace Sdkwork {
  /**
   * Base configuration interface
   */
  export interface SdkworkConfig {
    /** API key */
    apiKey?: string;
    /** App ID */
    appId?: string;
    /** Access token */
    accessToken?: string;
    /** Organization ID */
    organization?: string;
    /** Base URL for API requests */
    baseURL?: string;
    /** Default headers */
    defaultHeaders?: Record<string, string>;
    /** Timeout in milliseconds */
    timeout?: number;
    /** Environment */
    environment?: "dev" | "test" | "prod";
    /** Debug mode */
    debug?: boolean;
    /** Default model to use */
    model?: string;
  }
  export abstract class BaseSdkworkConfig implements SdkworkConfig {
    apiKey?: string;
    appId?: string;
    accessToken?: string;
    organization?: string;
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    environment?: "dev" | "test" | "prod";
    debug?: boolean;
    /** Default model to use */
    model?: string;

    constructor(config?: Partial<SdkworkLLMConfig>) {
      if (config) {
        Object.assign(this, config);
      }
    }
  }
  /**
   * Configuration class for LLM (Language Learning Model) services
   * Extends base configuration with LLM-specific options
   */
  export class SdkworkLLMConfig extends BaseSdkworkConfig {
    /** Maximum number of tokens to generate */
    maxTokens?: number;
    /** Sampling temperature between 0 and 2 */
    temperature?: number;
    /** Top-p sampling parameter between 0 and 1 */
    topP?: number;
    /** Frequency penalty between -2.0 and 2.0 */
    frequencyPenalty?: number;
    /** Presence penalty between -2.0 and 2.0 */
    presencePenalty?: number;
    /** Stop sequences to end generation */
    stop?: string[];
    /** Whether to stream responses */
    stream?: boolean;

    /**
     * Initialize LLM configuration
     * @param config Partial LLM configuration
     */
    constructor(config?: Partial<SdkworkLLMConfig>) {
      super(config);
      if (config) {
        this.maxTokens = config.maxTokens;
        this.temperature = config.temperature;
        this.topP = config.topP;
        this.frequencyPenalty = config.frequencyPenalty;
        this.presencePenalty = config.presencePenalty;
        this.stop = config.stop;
        this.stream = config.stream;
      }
    }
  }

  /**
   * Configuration class for Audio services
   * Extends base configuration with audio-specific options
   */
  export class SdkworkAudioConfig extends BaseSdkworkConfig {
    /** Audio sample rate in Hz */
    sampleRate?: number;
    /** Audio channels (1 for mono, 2 for stereo) */
    channels?: number;
    /** Audio format (wav, mp3, etc.) */
    format?: string;
    /** Audio quality (0-1) */
    quality?: number;
    /** Maximum audio duration in seconds */
    maxDuration?: number;
    /** Minimum audio duration in seconds */
    minDuration?: number;
    /** Whether to enable noise reduction */
    noiseReduction?: boolean;
    /** Whether to enable echo cancellation */
    echoCancellation?: boolean;

    /**
     * Initialize Audio configuration
     * @param config Partial Audio configuration
     */
    constructor(config?: Partial<SdkworkAudioConfig>) {
      super(config);
      if (config) {
        this.sampleRate = config.sampleRate;
        this.channels = config.channels;
        this.format = config.format;
        this.quality = config.quality;
        this.maxDuration = config.maxDuration;
        this.minDuration = config.minDuration;
        this.noiseReduction = config.noiseReduction;
        this.echoCancellation = config.echoCancellation;
      }
    }
  }

  /**
   * Configuration class for Video services
   * Extends base configuration with video-specific options
   */
  export class SdkworkVideoConfig extends BaseSdkworkConfig {
    /** Video resolution width in pixels */
    width?: number;
    /** Video resolution height in pixels */
    height?: number;
    /** Video frame rate (fps) */
    frameRate?: number;
    /** Video bitrate in kbps */
    bitrate?: number;
    /** Video codec (h264, h265, vp9, etc.) */
    codec?: string;
    /** Video container format (mp4, webm, etc.) */
    container?: string;
    /** Maximum video duration in seconds */
    maxDuration?: number;
    /** Whether to enable hardware acceleration */
    hardwareAcceleration?: boolean;
    /** Video quality preset (fast, medium, slow) */
    preset?: 'fast' | 'medium' | 'slow';
    /** Whether to preserve original audio */
    preserveAudio?: boolean;

    /**
     * Initialize Video configuration
     * @param config Partial Video configuration
     */
    constructor(config?: Partial<SdkworkVideoConfig>) {
      super(config);
      if (config) {
        this.width = config.width;
        this.height = config.height;
        this.frameRate = config.frameRate;
        this.bitrate = config.bitrate;
        this.codec = config.codec;
        this.container = config.container;
        this.maxDuration = config.maxDuration;
        this.hardwareAcceleration = config.hardwareAcceleration;
        this.preset = config.preset;
        this.preserveAudio = config.preserveAudio;
      }
    }
  }

  /**
   * Configuration class for Music services
   * Extends base configuration with music-specific options
   */
  export class SdkworkMusicConfig extends BaseSdkworkConfig {
    /** Music sample rate in Hz */
    sampleRate?: number;
    /** Music bit depth (16, 24, 32) */
    bitDepth?: number;
    /** Music channels (1 for mono, 2 for stereo) */
    channels?: number;
    /** Music format (mp3, wav, flac, etc.) */
    format?: string;
    /** Music bitrate in kbps */
    bitrate?: number;
    /** Whether to enable volume normalization */
    normalizeVolume?: boolean;
    /** Target loudness level in LUFS */
    targetLoudness?: number;
    /** Whether to remove silence */
    removeSilence?: boolean;
    /** Fade in duration in seconds */
    fadeIn?: number;
    /** Fade out duration in seconds */
    fadeOut?: number;

    /**
     * Initialize Music configuration
     * @param config Partial Music configuration
     */
    constructor(config?: Partial<SdkworkMusicConfig>) {
      super(config);
      if (config) {
        this.sampleRate = config.sampleRate;
        this.bitDepth = config.bitDepth;
        this.channels = config.channels;
        this.format = config.format;
        this.bitrate = config.bitrate;
        this.normalizeVolume = config.normalizeVolume;
        this.targetLoudness = config.targetLoudness;
        this.removeSilence = config.removeSilence;
        this.fadeIn = config.fadeIn;
        this.fadeOut = config.fadeOut;
      }
    }
  }

  /**
   * Configuration class for Cloud Storage services
   * Extends base configuration with storage-specific options
   */
  export class SdkworkCloudStorageConfig extends BaseSdkworkConfig {
    /** Storage region */
    region?: string;
    /** Storage bucket name */
    bucket?: string;
    /** Access control level (private, public-read, etc.) */
    acl?: 'private' | 'public-read' | 'public-read-write';
    /** Maximum file size in bytes */
    maxFileSize?: number;
    /** Allowed file types */
    allowedFileTypes?: string[];
    /** Whether to enable encryption */
    encryption?: boolean;
    /** Encryption algorithm */
    encryptionAlgorithm?: string;
    /** Whether to enable versioning */
    versioning?: boolean;
    /** Cache control settings */
    cacheControl?: string;
    /** Content disposition */
    contentDisposition?: string;
    /** Storage class (standard, infrequent-access, etc.) */
    storageClass?: 'standard' | 'infrequent-access' | 'archive';

    /**
     * Initialize Cloud Storage configuration
     * @param config Partial Cloud Storage configuration
     */
    constructor(config?: Partial<SdkworkCloudStorageConfig>) {
      super(config);
      if (config) {
        this.region = config.region;
        this.bucket = config.bucket;
        this.acl = config.acl;
        this.maxFileSize = config.maxFileSize;
        this.allowedFileTypes = config.allowedFileTypes;
        this.encryption = config.encryption;
        this.encryptionAlgorithm = config.encryptionAlgorithm;
        this.versioning = config.versioning;
        this.cacheControl = config.cacheControl;
        this.contentDisposition = config.contentDisposition;
        this.storageClass = config.storageClass;
      }
    }
  }
  /**
   * Base service interface
   */
  export interface Service {}
  /**
   * Base client interface
   */
  export interface Client {
    /** Client configuration */
    readonly config: SdkworkConfig;
    /** Client status */
    readonly status: "initialized" | "connected" | "disconnected" | "error";
    /** Client metadata */
    readonly metadata?: Record<string, any>;

    /**
     * Initialize client
     * @param config Client configuration
     */
    initialize(config: SdkworkConfig): Promise<void>;

    /**
     * Connect to services
     */
    connect(): Promise<void>;

    /**
     * Disconnect from services
     */
    disconnect(): Promise<void>;
  }

  /**
   * Base SDK client class
   */
  export class BaseClient implements Client {
    /** Client configuration */
    readonly config: SdkworkConfig;
    /** Client services */
    readonly services: Record<string, Service>;
    /** Client status */
    readonly status: "initialized" | "connected" | "disconnected" | "error";
    /** Client metadata */
    readonly metadata?: Record<string, any>;

    /**
     * Initialize SDK client
     * @param config Client configuration
     */
    constructor(config: SdkworkConfig) {
      this.config = config;
      this.services = {};
      this.status = "initialized";
    }

    /**
     * Initialize client
     * @param config Client configuration
     */
    initialize(_config: SdkworkConfig): Promise<void> {
      return Promise.resolve();
    }

    /**
     * Connect to services
     */
    connect(): Promise<void> {
      return Promise.resolve();
    }

    /**
     * Disconnect from services
     */
    disconnect(): Promise<void> {
      return Promise.resolve();
    }
  }


  /**
   * Configuration class for Image services
   * Extends base configuration with image-specific options
   */
  export class SdkworkImageConfig extends BaseSdkworkConfig {
    /** Image width in pixels */
    width?: number;
    /** Image height in pixels */
    height?: number;
    /** Image format (jpeg, png, webp, etc.) */
    format?: string;
    /** Image quality (0-100) */
    quality?: number;
    /** Whether to preserve aspect ratio when resizing */
    preserveAspectRatio?: boolean;
    /** Image compression level (0-9) */
    compressionLevel?: number;
    /** Whether to strip metadata (EXIF, etc.) */
    stripMetadata?: boolean;
    /** Whether to optimize image for web */
    optimizeForWeb?: boolean;
    /** Color space (sRGB, Adobe RGB, etc.) */
    colorSpace?: string;
    /** Whether to apply auto-enhancement */
    autoEnhance?: boolean;
    /** Maximum file size in bytes */
    maxFileSize?: number;
    /** Whether to enable progressive loading */
    progressive?: boolean;
    /** Background color (for transparent images) */
    backgroundColor?: string;
    /** Watermark options */
    watermark?: {
      /** Watermark image URL or text */
      content?: string;
      /** Watermark position */
      position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      /** Watermark opacity (0-1) */
      opacity?: number;
    };

    /**
     * Initialize Image configuration
     * @param config Partial Image configuration
     */
    constructor(config?: Partial<SdkworkImageConfig>) {
      super(config);
      if (config) {
        this.width = config.width;
        this.height = config.height;
        this.format = config.format;
        this.quality = config.quality;
        this.preserveAspectRatio = config.preserveAspectRatio;
        this.compressionLevel = config.compressionLevel;
        this.stripMetadata = config.stripMetadata;
        this.optimizeForWeb = config.optimizeForWeb;
        this.colorSpace = config.colorSpace;
        this.autoEnhance = config.autoEnhance;
        this.maxFileSize = config.maxFileSize;
        this.progressive = config.progressive;
        this.backgroundColor = config.backgroundColor;
        this.watermark = config.watermark;
      }
    }
  }

  /**
   * Configuration class for Platform API services
   * Extends base configuration with platform-specific options
   */
  export class SdkworkPlatformConfig extends BaseSdkworkConfig {
    /** Platform API version */
    apiVersion?: string;
    /** Platform tenant ID */
    tenantId?: string;
    /** Platform region */
    region?: string;
    /** Platform service level */
    serviceLevel?: 'basic' | 'standard' | 'premium';
    /** Rate limiting settings */
    rateLimit?: {
      /** Maximum requests per minute */
      requestsPerMinute?: number;
      /** Maximum concurrent requests */
      concurrentRequests?: number;
    };
    /** Authentication method */
    authMethod?: 'api_key' | 'oauth2' | 'jwt';
    /** Webhook configuration */
    webhooks?: {
      /** Webhook endpoint URL */
      endpointUrl?: string;
      /** Events to subscribe to */
      events?: string[];
      /** Secret for webhook signature verification */
      secret?: string;
    };

    /**
     * Initialize Platform configuration
     * @param config Partial Platform configuration
     */
    constructor(config?: Partial<SdkworkPlatformConfig>) {
      super(config);
      if (config) {
        this.apiVersion = config.apiVersion;
        this.tenantId = config.tenantId;
        this.region = config.region;
        this.serviceLevel = config.serviceLevel;
        this.rateLimit = config.rateLimit;
        this.authMethod = config.authMethod;
        this.webhooks = config.webhooks;
      }
    }
  }

  export class BaseService implements Service {}

  /**
   * Common response interface
   */
  export interface BaseResponse<T = any> {
    /** Response data */
    data: T;
    /** Response status */
    status: number;
    /** Response message */
    message?: string;
    /** Response metadata */
    metadata?: Record<string, any>;
  }

  /**
   * Common list response interface
   */
  export interface BaseListResponse<T = any> {
    /** List items */
    items: T[];
    /** Total count */
    total: number;
    /** Page number */
    page: number;
    /** Items per page */
    pageSize: number;
    /** Has next page */
    hasNext: boolean;
    /** Has previous page */
    hasPrevious: boolean;
  }

  /**
   * Common list parameters interface
   */
  export interface BaseListParams {
    /** Page number */
    page?: number;
    /** Items per page */
    pageSize?: number;
    /** Sort field */
    sortBy?: string;
    /** Sort order */
    sortOrder?: "asc" | "desc";
    /** Search query */
    query?: string;
  }

  /**
   * Common error interface
   */
  export interface BaseError extends Error {
    /** Error code */
    code: string;
    /** Error status */
    status: number;
    /** Error details */
    details?: Record<string, any>;
  }
}