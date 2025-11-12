import { CurrencyCode, ModelType, ChannelProviderEnum } from '../../enums/core.type';
import { ModelPriceUnit, ModelLimitItemType, ModelTokenUnit, ModelPriceItemType } from '../../enums/models';
import { CommonStatus } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { ModelLimitInfo, ModelPrice, ModelMetadata } from '../../types/models';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiModelPriceParam
 * 描述: AI模型价格Form
 */
export interface AiModelPriceParam extends BaseParam {
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型标识符(如"gpt-4","claude-3-opus")
     */
    model?: string;
    /**
     * batchCachedInputPrice字段
     * Java类型: java.lang.Double
     * 描述: 批量缓存输入价格
     */
    batchCachedInputPrice?: string|number;
    /**
     * currency字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.CurrencyCode
     * 描述: 货币类型
     */
    currency?: CurrencyCode;
    /**
     * batchOutputPrice字段
     * Java类型: java.lang.Double
     * 描述: 批量输出价格
     */
    batchOutputPrice?: string|number;
    /**
     * inputPrice字段
     * Java类型: java.lang.Double
     * 描述: 输入价格
     */
    inputPrice?: string|number;
    /**
     * cachedInputPrice字段
     * Java类型: java.lang.Double
     * 描述: 缓存输入价格
     */
    cachedInputPrice?: string|number;
    /**
     * objectId字段
     * Java类型: java.lang.String
     * 描述: 模型标ID
     */
    objectId?: string;
    /**
     * batchInputPrice字段
     * Java类型: java.lang.Double
     * 描述: "批量输入价格
     */
    batchInputPrice?: string|number;
    /**
     * outputPrice字段
     * Java类型: java.lang.Double
     * 描述: 输出价格
     */
    outputPrice?: string|number;
    /**
     * unit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPriceUnit
     * 描述: 价格计量单位
     */
    unit?: ModelPriceUnit;
    /**
     * price字段
     * Java类型: java.lang.Double
     * 描述: 基础价格
     */
    price?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiModelInfoParam
 * 描述: Enhanced AI Model Information Form
 */
export interface AiModelInfoParam extends BaseParam {
    /**
     * defaultFrequencyPenalty字段
     * Java类型: java.lang.Float
     * 描述: 默认频率惩罚值
     */
    defaultFrequencyPenalty?: string|number;
    /**
     * apiEndpoint字段
     * Java类型: java.lang.String
     * 描述: 模型API端点URL
     */
    apiEndpoint?: string;
    /**
     * ownedBy字段
     * Java类型: java.lang.String
     * 描述: 模型所有者/组织
     */
    ownedBy?: string;
    /**
     * family字段
     * Java类型: java.lang.String
     * 描述: 模型系列(如"GPT","Claude","Llama")
     */
    family?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 模型状态(active:活跃,deprecated:已弃用)
     */
    status?: CommonStatus;
    /**
     * tokenLimit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelLimitInfo
     * 描述: 模型令牌限制信息
     */
    tokenLimit?: ModelLimitInfo;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 模型显示名称(如"GPT-4","Claude 3 Opus")
     */
    name?: string;
    /**
     * supportedVoices字段
     * Java类型: java.lang.String
     * 描述: 支持的语音列表(用于文本转语音模型)
     */
    supportedVoices?: string;
    /**
     * totalTokens字段
     * Java类型: java.lang.Long
     * 描述: 处理的总令牌数
     */
    totalTokens?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 模型标签(逗号分隔)
     */
    tags?: TagsContent;
    /**
     * usageCount字段
     * Java类型: java.lang.Long
     * 描述: 总使用次数
     */
    usageCount?: string|number;
    /**
     * modelType字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.PlusModelType
     * 描述: 模型类型(TEXT:文本,IMAGE:图像,VIDEO:视频,AUDIO:音频)
     */
    modelType?: ModelType;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * configParams字段
     * Java类型: java.lang.String
     * 描述: 附加配置参数(JSON格式)
     */
    configParams?: string;
    /**
     * createdAt字段
     * Java类型: java.lang.Long
     * 描述: 模型创建时间戳
     */
    createdAt?: string|number;
    /**
     * priceInfo字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPrice
     * 描述: 模型价格信息
     */
    priceInfo?: ModelPrice;
    /**
     * objectId字段
     * Java类型: java.lang.String
     * 描述: 模型标ID
     */
    objectId?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型标识符(如"gpt-4","claude-3-opus")
     */
    model?: string;
    /**
     * modelVersion字段
     * Java类型: java.lang.String
     * 描述: 模型版本(如"1.0","2023-05-15")
     */
    modelVersion?: string;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelMetadata
     * 描述: 模型元数据及能力信息
     */
    metadata?: ModelMetadata;
    /**
     * defaultPresencePenalty字段
     * Java类型: java.lang.Float
     * 描述: 默认存在惩罚值
     */
    defaultPresencePenalty?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 模型描述
     */
    description?: string;
    /**
     * avgResponseTime字段
     * Java类型: java.lang.Long
     * 描述: 平均响应时间(毫秒)
     */
    avgResponseTime?: string|number;
    /**
     * defaultTemperature字段
     * Java类型: java.lang.Float
     * 描述: 默认温度设置
     */
    defaultTemperature?: string|number;
    /**
     * defaultTopP字段
     * Java类型: java.lang.Float
     * 描述: 默认top_p设置
     */
    defaultTopP?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiModelInfoResponse
 * 描述: Enhanced AI Model Information Value Object
 */
export interface AiModelInfoResponse extends BaseResponse {
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型标识符(如"gpt-4","claude-3-opus")
     */
    model?: string;
    /**
     * tokenLimit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelLimitInfo
     * 描述: 模型令牌限制信息
     */
    tokenLimit?: ModelLimitInfo;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 模型显示名称(如"GPT-4","Claude 3 Opus")
     */
    name?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 模型状态(active:活跃,deprecated:已弃用)
     */
    status?: CommonStatus;
    /**
     * objectId字段
     * Java类型: java.lang.String
     * 描述: 模型标ID
     */
    objectId?: string;
    /**
     * ownedBy字段
     * Java类型: java.lang.String
     * 描述: 模型所有者/组织
     */
    ownedBy?: string;
    /**
     * family字段
     * Java类型: java.lang.String
     * 描述: 模型系列(如"GPT","Claude","Llama")
     */
    family?: string;
    /**
     * apiEndpoint字段
     * Java类型: java.lang.String
     * 描述: 模型API端点URL
     */
    apiEndpoint?: string;
    /**
     * priceInfo字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPrice
     * 描述: 模型价格信息
     */
    priceInfo?: ModelPrice;
    /**
     * defaultFrequencyPenalty字段
     * Java类型: java.lang.Float
     * 描述: 默认频率惩罚值
     */
    defaultFrequencyPenalty?: string|number;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * configParams字段
     * Java类型: java.lang.String
     * 描述: 附加配置参数(JSON格式)
     */
    configParams?: string;
    /**
     * modelType字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.PlusModelType
     * 描述: 模型类型(TEXT:文本,IMAGE:图像,VIDEO:视频,AUDIO:音频)
     */
    modelType?: ModelType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 模型描述
     */
    description?: string;
    /**
     * avgResponseTime字段
     * Java类型: java.lang.Long
     * 描述: 平均响应时间(毫秒)
     */
    avgResponseTime?: string|number;
    /**
     * defaultTemperature字段
     * Java类型: java.lang.Float
     * 描述: 默认温度设置
     */
    defaultTemperature?: string|number;
    /**
     * defaultTopP字段
     * Java类型: java.lang.Float
     * 描述: 默认top_p设置
     */
    defaultTopP?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 模型标签(逗号分隔)
     */
    tags?: TagsContent;
    /**
     * usageCount字段
     * Java类型: java.lang.Long
     * 描述: 总使用次数
     */
    usageCount?: string|number;
    /**
     * totalTokens字段
     * Java类型: java.lang.Long
     * 描述: 处理的总令牌数
     */
    totalTokens?: string|number;
    /**
     * defaultPresencePenalty字段
     * Java类型: java.lang.Float
     * 描述: 默认存在惩罚值
     */
    defaultPresencePenalty?: string|number;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelMetadata
     * 描述: 模型元数据及能力信息
     */
    metadata?: ModelMetadata;
    /**
     * supportedVoices字段
     * Java类型: java.lang.String
     * 描述: 支持的语音列表(用于文本转语音模型)
     */
    supportedVoices?: string;
    /**
     * modelVersion字段
     * Java类型: java.lang.String
     * 描述: 模型版本(如"1.0","2023-05-15")
     */
    modelVersion?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiModelPriceResponse
 * 描述: AI模型价格VO
 */
export interface AiModelPriceResponse extends BaseResponse {
    /**
     * objectId字段
     * Java类型: java.lang.String
     * 描述: 模型标ID
     */
    objectId?: string;
    /**
     * batchInputPrice字段
     * Java类型: java.lang.Double
     * 描述: 批量输入价格
     */
    batchInputPrice?: string|number;
    /**
     * inputPrice字段
     * Java类型: java.lang.Double
     * 描述: 输入价格
     */
    inputPrice?: string|number;
    /**
     * cachedInputPrice字段
     * Java类型: java.lang.Double
     * 描述: 缓存输入价格
     */
    cachedInputPrice?: string|number;
    /**
     * batchOutputPrice字段
     * Java类型: java.lang.Double
     * 描述: 批量输出价格
     */
    batchOutputPrice?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型标识符(如"gpt-4","claude-3-opus")
     */
    model?: string;
    /**
     * batchCachedInputPrice字段
     * Java类型: java.lang.Double
     * 描述: 批量缓存输入价格
     */
    batchCachedInputPrice?: string|number;
    /**
     * currency字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.CurrencyCode
     * 描述: 货币类型
     */
    currency?: CurrencyCode;
    /**
     * price字段
     * Java类型: java.lang.Double
     * 描述: 基础价格
     */
    price?: string|number;
    /**
     * unit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPriceUnit
     * 描述: 价格计量单位
     */
    unit?: ModelPriceUnit;
    /**
     * outputPrice字段
     * Java类型: java.lang.Double
     * 描述: 输出价格
     */
    outputPrice?: string|number;
}
