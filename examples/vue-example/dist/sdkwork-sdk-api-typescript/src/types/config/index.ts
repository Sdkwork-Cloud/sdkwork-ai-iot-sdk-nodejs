import { ResourceFunctionType, ChannelProviderEnum, OAuthProvider, ChannelResourceType } from '../../enums/core.type';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { VectorIndexType } from '../../enums/vectorstore';
import { TransportType } from '../../enums/enums';
import { PayType } from '../../enums/config.resource';
import { BaseObject } from '../../types/base';
import { OfficialAccountConfig, CloudAccountConfig, MusicAccountConfig, SearchAccountConfig, OAuthAccountConfig, KnowledgeAccountConfig, OcrAccountConfig, SmsAccountConfig, AudioAccountConfig, EmbeddingAccountConfig, VectorAccountConfig, MemoryAccountConfig, AgentAccountConfig, IotAccountConfig, OssAccountConfig, VideoAccountConfig, ModerationAccountConfig, DatasourceAccountConfig, AppStoreAccountConfig, FilesAccountConfig, ApiKeyAccountConfig, ImAccountConfig, MiniProgramAccountConfig, ImageAccountConfig, NewsAccountConfig, RtcAccountConfig, LlmAccountConfig, ToolAccountConfig, PayAccountConfig } from '../../types/config.resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: BaseAccountConfig
 */
export interface BaseAccountConfig extends BaseObject {
    /**
     * functions字段
     * Java类型: java.util.List
     */
    functions?: Array<ResourceFunctionType>;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     */
    provider?: ChannelProviderEnum;
    /**
     * product字段
     * Java类型: java.lang.String
     */
    product?: string;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.config.AccountConfigMetadata
     */
    metadata?: AccountConfigMetadata;
    /**
     * region字段
     * Java类型: java.lang.String
     */
    region?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * properties字段
     * Java类型: java.util.Map
     */
    properties?: Map<string, Object>;
    /**
     * weight字段
     * Java类型: java.lang.Integer
     */
    weight?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppConfig
 */
export interface AppConfig extends BaseObject {
    /**
     * officialAccount字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.OfficialAccountConfig
     */
    officialAccount?: OfficialAccountConfig;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelResourceItem
 */
export interface ChannelResourceItem extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelResourceType
     */
    type?: ChannelResourceType;
    /**
     * functions字段
     * Java类型: java.util.List
     */
    functions?: Array<ResourceFunctionType>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AccountConfigMetadata
 */
export interface AccountConfigMetadata extends BaseObject {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelConfig
 */
export interface ModelConfig extends BaseObject {
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     */
    provider?: ChannelProviderEnum;
    /**
     * cloud字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.CloudAccountConfig
     */
    cloud?: CloudAccountConfig;
    /**
     * music字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.MusicAccountConfig
     */
    music?: MusicAccountConfig;
    /**
     * search字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.SearchAccountConfig
     */
    search?: SearchAccountConfig;
    /**
     * oauth字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.OAuthAccountConfig
     */
    oauth?: OAuthAccountConfig;
    /**
     * knowledge字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.KnowledgeAccountConfig
     */
    knowledge?: KnowledgeAccountConfig;
    /**
     * ocr字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.OcrAccountConfig
     */
    ocr?: OcrAccountConfig;
    /**
     * sms字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.SmsAccountConfig
     */
    sms?: SmsAccountConfig;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * audio字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.AudioAccountConfig
     */
    audio?: AudioAccountConfig;
    /**
     * embedding字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.EmbeddingAccountConfig
     */
    embedding?: EmbeddingAccountConfig;
    /**
     * vector字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.VectorAccountConfig
     */
    vector?: VectorAccountConfig;
    /**
     * voice字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.AudioAccountConfig
     */
    voice?: AudioAccountConfig;
    /**
     * memory字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.MemoryAccountConfig
     */
    memory?: MemoryAccountConfig;
    /**
     * agent字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.AgentAccountConfig
     */
    agent?: AgentAccountConfig;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * iot字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.IotAccountConfig
     */
    iot?: IotAccountConfig;
    /**
     * oss字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.OssAccountConfig
     */
    oss?: OssAccountConfig;
    /**
     * official字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.OfficialAccountConfig
     */
    official?: OfficialAccountConfig;
    /**
     * video字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.VideoAccountConfig
     */
    video?: VideoAccountConfig;
    /**
     * moderation字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.ModerationAccountConfig
     */
    moderation?: ModerationAccountConfig;
    /**
     * datasource字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.DatasourceAccountConfig
     */
    datasource?: DatasourceAccountConfig;
    /**
     * appStore字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.AppStoreAccountConfig
     */
    appStore?: AppStoreAccountConfig;
    /**
     * properties字段
     * Java类型: java.util.Map
     */
    properties?: Map<string, Object>;
    /**
     * files字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.FilesAccountConfig
     */
    files?: FilesAccountConfig;
    /**
     * apikey字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.ApiKeyAccountConfig
     */
    apikey?: ApiKeyAccountConfig;
    /**
     * im字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.ImAccountConfig
     */
    im?: ImAccountConfig;
    /**
     * miniProgram字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.MiniProgramAccountConfig
     */
    miniProgram?: MiniProgramAccountConfig;
    /**
     * image字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.ImageAccountConfig
     */
    image?: ImageAccountConfig;
    /**
     * news字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.NewsAccountConfig
     */
    news?: NewsAccountConfig;
    /**
     * rtc字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.RtcAccountConfig
     */
    rtc?: RtcAccountConfig;
    /**
     * product字段
     * Java类型: java.lang.String
     */
    product?: string;
    /**
     * llm字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.LlmAccountConfig
     */
    llm?: LlmAccountConfig;
    /**
     * tool字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.ToolAccountConfig
     */
    tool?: ToolAccountConfig;
    /**
     * weight字段
     * Java类型: java.lang.Integer
     */
    weight?: number;
    /**
     * pay字段
     * Java类型: com.sdkwork.spring.ai.plus.config.resource.PayAccountConfig
     */
    pay?: PayAccountConfig;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.config.ChannelResourceInfo
     */
    resources?: ChannelResourceInfo;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelResourceInfo
 */
export interface ChannelResourceInfo extends BaseObject {
    /**
     * items字段
     * Java类型: java.util.List
     */
    items?: Array<ChannelResourceItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelConfigInfo
 */
export interface ChannelConfigInfo extends BaseObject {
    /**
     * accounts字段
     * Java类型: java.util.Set
     */
    accounts?: Array<ModelConfig>;
}
