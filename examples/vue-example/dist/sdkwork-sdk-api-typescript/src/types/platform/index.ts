import { ApiKeyStatus, ApiKeyType } from '../../enums/platform';
import { ChannelResourceType, ChannelProviderEnum, ResourceFunctionType, OAuthProvider } from '../../enums/core.type';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { VectorIndexType } from '../../enums/vectorstore';
import { TransportType, CommonStatus } from '../../enums/enums';
import { PayType } from '../../enums/config.resource';
import { BaseParam } from '../../types/base';
import { ChannelConfigInfo } from '../../types/config';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApiKeyParam
 * 描述: API密钥Form类，用于API密钥相关的请求数据绑定和校验
 */
export interface ApiKeyParam extends BaseParam {
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: API密钥过期时间，过期后自动失效
     */
    expireTime?: string;
    /**
     * keyValue字段
     * Java类型: java.lang.String
     * 描述: API密钥值，存储加密后的密钥字符串
     */
    keyValue?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: API密钥名称，用于标识不同用途的密钥
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: API密钥描述信息，说明密钥用途和权限范围
     */
    description?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.platform.ApiKeyStatus
     * 描述: API密钥状态，控制密钥是否可用
     */
    status?: ApiKeyStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.platform.ApiKeyType
     * 描述: API密钥类型，区分不同类型的API访问凭证
     */
    type?: ApiKeyType;
    /**
     * lastUsedTime字段
     * Java类型: java.time.Instant
     * 描述: 最后使用时间，记录密钥最近一次使用时间
     */
    lastUsedTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelResourceParam
 * 描述: Channel Resource Form (Manages resources associated with communication channels, including type and provider mappings)
 */
export interface ChannelResourceParam extends BaseParam {
    /**
     * channelAccountId字段
     * Java类型: java.lang.Long
     * 描述: Associated channel account ID (foreign key linking to the channel account entity)
     */
    channelAccountId?: string|number;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelResourceType
     * 描述: Channel resource type (categorizes the specific resource type, e.g., IMAGE, DOCUMENT, VIDEO)
     */
    resource?: ChannelResourceType;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: Channel service provider (entity that offers the channel service, e.g., WECHAT, SLACK, DINGTALK)
     */
    provider?: ChannelProviderEnum;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelAccountParam
 * 描述: Channel Account Form (represents third-party channel connection accounts, e.g., WeChat official account, DingTalk robot, etc.)
 */
export interface ChannelAccountParam extends BaseParam {
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: Channel provider (e.g., WECHAT, DINGTALK, ALIPAY, FEISHU)
     */
    provider?: ChannelProviderEnum;
    /**
     * configs字段
     * Java类型: com.sdkwork.spring.ai.plus.config.ChannelConfigInfo
     * 描述: Model configuration parameters (JSON structure with model type, API key, etc.)
     */
    configs?: ChannelConfigInfo;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: Account status (ACTIVE: available, DISABLED: disabled, EXPIRED: expired)
     */
    status?: CommonStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Channel account name (displayed in management interface)
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Channel account description (usage scenarios, precautions, etc.)
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelResourceResponse
 * 描述: Channel Resource VO (Manages resources associated with communication channels, including type and provider mappings)
 */
export interface ChannelResourceResponse extends BaseResponse {
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelResourceType
     * 描述: Channel resource type (specific category of resource handled by the channel, e.g., IMAGE, DOCUMENT, VIDEO)
     */
    resource?: ChannelResourceType;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: Channel service provider (organization/entity providing the channel infrastructure, e.g., WECHAT, SLACK, DINGTALK)
     */
    provider?: ChannelProviderEnum;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp, set when entity is first persisted
     */
    createdAt?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * channelAccountId字段
     * Java类型: java.lang.Long
     * 描述: Associated channel account ID (links to the specific channel account owning this resource)
     */
    channelAccountId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp, updated when entity is modified
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelAccountResponse
 * 描述: 渠道账户VO，用于展示第三方渠道连接账户信息，如微信公众号、钉钉机器人等
 */
export interface ChannelAccountResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 渠道账户描述(使用场景、注意事项等)
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 渠道账户名称(管理界面显示用)
     */
    name?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 账户状态(ACTIVE:可用, DISABLED:禁用, EXPIRED:过期)
     */
    status?: CommonStatus;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * configs字段
     * Java类型: com.sdkwork.spring.ai.plus.config.ChannelConfigInfo
     * 描述: 模型配置参数(JSON结构，包含模型类型、API密钥等)
     */
    configs?: ChannelConfigInfo;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 渠道提供商(如WECHAT, DINGTALK, ALIPAY, FEISHU)
     */
    provider?: ChannelProviderEnum;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApiKeyResponse
 * 描述: API密钥VO类，用于传输系统中API访问凭证信息
 */
export interface ApiKeyResponse extends BaseResponse {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: API密钥名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: API密钥描述
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.platform.ApiKeyType
     * 描述: API密钥类型
     */
    type?: ApiKeyType;
    /**
     * lastUsedTime字段
     * Java类型: java.time.Instant
     * 描述: 最后使用时间
     */
    lastUsedTime?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.platform.ApiKeyStatus
     * 描述: API密钥状态
     */
    status?: ApiKeyStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: API密钥过期时间
     */
    expireTime?: string;
    /**
     * keyValue字段
     * Java类型: java.lang.String
     * 描述: API密钥值
     */
    keyValue?: string;
}
