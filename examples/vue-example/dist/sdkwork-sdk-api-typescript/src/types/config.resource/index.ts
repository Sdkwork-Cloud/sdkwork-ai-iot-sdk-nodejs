import { ChannelProviderEnum, ResourceFunctionType, OAuthProvider } from '../../enums/core.type';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { TransportType } from '../../enums/enums';
import { VectorIndexType } from '../../enums/vectorstore';
import { PayType } from '../../enums/config.resource';
import { ChatOptions } from '../../types/chat';
import { AccountConfigMetadata, BaseAccountConfig } from '../../types/config';
import { BaseObject } from '../../types/base';
import { BucketObject } from '../../types/files';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: EmbeddingAccountConfig
 */
export interface EmbeddingAccountConfig extends ApiKeyAccountConfig {
    /**
     * options字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     */
    options?: ChatOptions;
    /**
     * dimension字段
     * Java类型: java.lang.Integer
     */
    dimension?: number;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApiKeyAccountConfig
 */
export interface ApiKeyAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RtcAccountConfig
 */
export interface RtcAccountConfig extends CloudAccountConfig {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CloudAccountConfig
 */
export interface CloudAccountConfig extends BaseAccountConfig {
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     */
    appId?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OAuthAccountConfig
 * 描述: OAuth第三方登录账户配置
 */
export interface OAuthAccountConfig extends BaseAccountConfig {
    /**
     * appId字段
     * Java类型: java.lang.String
     * 描述: 客户端ID（AppID）
     */
    appId?: string;
    /**
     * scope字段
     * Java类型: java.lang.String
     * 描述: 授权范围
     */
    scope?: string;
    /**
     * authProvider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     * 描述: OAuth提供商类型
     */
    authProvider?: OAuthProvider;
    /**
     * EncodingAESKey字段
     * Java类型: java.lang.String
     * 描述: aes key
     */
    EncodingAESKey?: string;
    /**
     * redirectUri字段
     * Java类型: java.lang.String
     * 描述: 回调URL
     */
    redirectUri?: string;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 令牌
     */
    token?: string;
    /**
     * appSecret字段
     * Java类型: java.lang.String
     * 描述: 客户端密钥（AppSecret）
     */
    appSecret?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: NewsAccountConfig
 */
export interface NewsAccountConfig extends BaseAccountConfig {
    /**
     * language字段
     * Java类型: java.lang.String
     */
    language?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * newsSource字段
     * Java类型: java.lang.String
     */
    newsSource?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OcrAccountConfig
 */
export interface OcrAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * ocrEngine字段
     * Java类型: java.lang.String
     */
    ocrEngine?: string;
    /**
     * language字段
     * Java类型: java.lang.String
     */
    language?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DatasourceAccountConfig
 */
export interface DatasourceAccountConfig extends BaseAccountConfig {
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotAccountConfig
 * 描述: IoT account configuration
 */
export interface IotAccountConfig extends BaseAccountConfig {
    /**
     * retryInterval字段
     * Java类型: java.lang.Integer
     * 描述: Retry interval in milliseconds between retry attempts
     * 示例: 5000
     */
    retryInterval?: number;
    /**
     * caCertificatePath字段
     * Java类型: java.lang.String
     * 描述: CA certificate file path for server verification
     * 示例: /path/to/ca-certificate.crt
     */
    caCertificatePath?: string;
    /**
     * deviceRegistryUrl字段
     * Java类型: java.lang.String
     * 描述: Device registry URL for device management
     * 示例: https://example.com/registry
     */
    deviceRegistryUrl?: string;
    /**
     * maxRetryAttempts字段
     * Java类型: java.lang.Integer
     * 描述: Maximum number of retry attempts for failed operations
     * 示例: 3
     */
    maxRetryAttempts?: number;
    /**
     * otaUpgradeUrl字段
     * Java类型: java.lang.String
     * 描述: OTA upgrade URL for over-the-air device updates
     * 示例: https://example.com/ota/latest
     */
    otaUpgradeUrl?: string;
    /**
     * certificatePath字段
     * Java类型: java.lang.String
     * 描述: Certificate file path for device authentication
     * 示例: /path/to/certificate.crt
     */
    certificatePath?: string;
    /**
     * transports字段
     * Java类型: java.util.List
     * 描述: List of transport configurations
     */
    transports?: Array<IotTransportConfig>;
    /**
     * privateKeyPath字段
     * Java类型: java.lang.String
     * 描述: Private key file path for device authentication
     * 示例: /path/to/private.key
     */
    privateKeyPath?: string;
    /**
     * reportingInterval字段
     * Java类型: java.lang.Integer
     * 描述: Device data reporting interval in seconds
     * 示例: 60
     */
    reportingInterval?: number;
    /**
     * firmwareDownloadUrl字段
     * Java类型: java.lang.String
     * 描述: Firmware download URL for device updates
     * 示例: https://example.com/firmware/latest.bin
     */
    firmwareDownloadUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: KnowledgeAccountConfig
 */
export interface KnowledgeAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VectorAccountConfig
 */
export interface VectorAccountConfig extends BaseAccountConfig {
    /**
     * embeddingConfigId字段
     * Java类型: java.lang.Long
     */
    embeddingConfigId?: string|number;
    /**
     * collectionName字段
     * Java类型: java.lang.String
     */
    collectionName?: string;
    /**
     * dimension字段
     * Java类型: java.lang.Integer
     */
    dimension?: number;
    /**
     * indexType字段
     * Java类型: com.sdkwork.spring.ai.plus.vectorstore.VectorIndexType
     */
    indexType?: VectorIndexType;
    /**
     * indexName字段
     * Java类型: java.lang.String
     */
    indexName?: string;
    /**
     * databaseName字段
     * Java类型: java.lang.String
     */
    databaseName?: string;
    /**
     * embeddingConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.EmbeddingAccountConfig
     */
    embeddingConfig?: EmbeddingAccountConfig;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: LlmAccountConfig
 */
export interface LlmAccountConfig extends ApiKeyAccountConfig {
    /**
     * multimodal字段
     * Java类型: java.lang.Boolean
     */
    multimodal?: boolean;
    /**
     * maxTokens字段
     * Java类型: java.lang.Integer
     */
    maxTokens?: number;
    /**
     * options字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     */
    options?: ChatOptions;
    /**
     * toolCall字段
     * Java类型: java.lang.Boolean
     */
    toolCall?: boolean;
    /**
     * bucket字段
     * Java类型: com.sdkwork.spring.ai.plus.files.BucketObject
     */
    bucket?: BucketObject;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PayAccountConfig
 */
export interface PayAccountConfig extends BaseAccountConfig {
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * merchantId字段
     * Java类型: java.lang.String
     */
    merchantId?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     */
    appId?: string;
    /**
     * privateKey字段
     * Java类型: java.lang.String
     */
    privateKey?: string;
    /**
     * gatewayUrl字段
     * Java类型: java.lang.String
     */
    gatewayUrl?: string;
    /**
     * payType字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.PayAccountConfig$PayType
     */
    payType?: PayType;
    /**
     * returnUrl字段
     * Java类型: java.lang.String
     */
    returnUrl?: string;
    /**
     * notifyUrl字段
     * Java类型: java.lang.String
     */
    notifyUrl?: string;
    /**
     * publicKey字段
     * Java类型: java.lang.String
     */
    publicKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImageAccountConfig
 */
export interface ImageAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentAccountConfig
 */
export interface AgentAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * agentType字段
     * Java类型: java.lang.String
     */
    agentType?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     */
    version?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MiniProgramAccountConfig
 */
export interface MiniProgramAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     */
    appId?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * secret字段
     * Java类型: java.lang.String
     */
    secret?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AudioAccountConfig
 */
export interface AudioAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * defaultVoice字段
     * Java类型: java.lang.String
     */
    defaultVoice?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VideoAccountConfig
 */
export interface VideoAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotTransportConfig
 * 描述: IoT transport configuration
 */
export interface IotTransportConfig extends BaseObject {
    /**
     * willMessage字段
     * Java类型: java.lang.String
     * 描述: Last will message
     * 示例: Device offline
     */
    willMessage?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: Username for authentication
     * 示例: username
     */
    username?: string;
    /**
     * connectionTimeout字段
     * Java类型: java.lang.Integer
     * 描述: Connection timeout in milliseconds
     * 示例: 30000
     */
    connectionTimeout?: number;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: Password for authentication
     * 示例: password
     */
    password?: string;
    /**
     * keepAliveInterval字段
     * Java类型: java.lang.Integer
     * 描述: Keep alive interval in seconds
     * 示例: 60
     */
    keepAliveInterval?: number;
    /**
     * willRetain字段
     * Java类型: java.lang.Boolean
     * 描述: Retain last will message
     * 示例: false
     */
    willRetain?: boolean;
    /**
     * willTopic字段
     * Java类型: java.lang.String
     * 描述: Last will topic
     * 示例: device/status
     */
    willTopic?: string;
    /**
     * sslEnabled字段
     * Java类型: java.lang.Boolean
     * 描述: SSL/TLS enabled flag
     * 示例: true
     */
    sslEnabled?: boolean;
    /**
     * qos字段
     * Java类型: java.lang.Integer
     * 描述: Quality of Service level (0, 1, or 2 for MQTT)
     * 示例: 1
     */
    qos?: number;
    /**
     * willQos字段
     * Java类型: java.lang.Integer
     * 描述: Last will QoS
     * 示例: 1
     */
    willQos?: number;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: Transport URL
     * 示例: mqtt://example.com:1883
     */
    url?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.TransportType
     * 描述: Transport type (e.g., MQTT, HTTP, CoAP)
     */
    type?: TransportType;
    /**
     * cleanSession字段
     * Java类型: java.lang.Boolean
     * 描述: Clean session flag
     * 示例: true
     */
    cleanSession?: boolean;
    /**
     * clientId字段
     * Java类型: java.lang.String
     * 描述: Client ID for the connection
     * 示例: device001
     */
    clientId?: string;
    /**
     * authToken字段
     * Java类型: java.lang.String
     * 描述: Authentication token for the connection
     * 示例: token123456
     */
    authToken?: string;
    /**
     * publishTopics字段
     * Java类型: java.util.List
     * 描述: MQTT publish topics
     */
    publishTopics?: Array<string>;
    /**
     * subscribeTopics字段
     * Java类型: java.util.List
     * 描述: MQTT subscribe topics
     */
    subscribeTopics?: Array<string>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FilesAccountConfig
 */
export interface FilesAccountConfig extends BaseAccountConfig {
    /**
     * region字段
     * Java类型: java.lang.String
     */
    region?: string;
    /**
     * bucketName字段
     * Java类型: java.lang.String
     */
    bucketName?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SearchAccountConfig
 */
export interface SearchAccountConfig extends BaseAccountConfig {
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ToolAccountConfig
 */
export interface ToolAccountConfig extends BaseAccountConfig {
    /**
     * toolType字段
     * Java类型: java.lang.String
     */
    toolType?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     */
    version?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemoryAccountConfig
 */
export interface MemoryAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OssAccountConfig
 */
export interface OssAccountConfig extends CloudAccountConfig {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SmsAccountConfig
 */
export interface SmsAccountConfig extends CloudAccountConfig {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppStoreAccountConfig
 */
export interface AppStoreAccountConfig extends BaseAccountConfig {
    /**
     * developerId字段
     * Java类型: java.lang.String
     */
    developerId?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * storeType字段
     * Java类型: java.lang.String
     */
    storeType?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImAccountConfig
 */
export interface ImAccountConfig extends CloudAccountConfig {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModerationAccountConfig
 */
export interface ModerationAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * severityLevel字段
     * Java类型: java.lang.String
     */
    severityLevel?: string;
    /**
     * moderationType字段
     * Java类型: java.lang.String
     */
    moderationType?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OfficialAccountConfig
 * 描述: OAuth第三方登录账户配置
 */
export interface OfficialAccountConfig extends OAuthAccountConfig {
    /**
     * securityModeEnabled字段
     * Java类型: java.lang.Boolean
     */
    securityModeEnabled?: boolean;
    /**
     * accessToken字段
     * Java类型: java.lang.String
     */
    accessToken?: string;
    /**
     * token字段
     * Java类型: java.lang.String
     */
    token?: string;
    /**
     * jsApiDomain字段
     * Java类型: java.lang.String
     */
    jsApiDomain?: string;
    /**
     * secret字段
     * Java类型: java.lang.String
     */
    secret?: string;
    /**
     * jsSdkEnabled字段
     * Java类型: java.lang.Boolean
     */
    jsSdkEnabled?: boolean;
    /**
     * accessTokenFetchTime字段
     * Java类型: java.lang.Long
     */
    accessTokenFetchTime?: string|number;
    /**
     * notifyUrl字段
     * Java类型: java.lang.String
     */
    notifyUrl?: string;
    /**
     * aesKey字段
     * Java类型: java.lang.String
     */
    aesKey?: string;
    /**
     * originalId字段
     * Java类型: java.lang.String
     */
    originalId?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     */
    appId?: string;
    /**
     * qrCodeUrl字段
     * Java类型: java.lang.String
     */
    qrCodeUrl?: string;
    /**
     * accessTokenExpiresIn字段
     * Java类型: java.lang.Long
     */
    accessTokenExpiresIn?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MusicAccountConfig
 */
export interface MusicAccountConfig extends BaseAccountConfig {
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * apiKey字段
     * Java类型: java.lang.String
     */
    apiKey?: string;
    /**
     * secretKey字段
     * Java类型: java.lang.String
     */
    secretKey?: string;
    /**
     * accessKey字段
     * Java类型: java.lang.String
     */
    accessKey?: string;
    /**
     * defaultModel字段
     * Java类型: java.lang.String
     */
    defaultModel?: string;
}
