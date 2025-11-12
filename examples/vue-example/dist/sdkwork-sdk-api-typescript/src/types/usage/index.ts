import { ChannelProviderEnum, CurrencyCode } from '../../enums/core.type';
import { BillingType } from '../../enums/account';
import { UsageType, UsageStatus } from '../../enums/ai';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UsageRecordParam
 * 描述: AI模型使用记录Form类，用于记录各种AI模型调用的使用情况
 */
export interface UsageRecordParam extends BaseParam {
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     */
    requestTime?: string;
    /**
     * modelName字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     */
    modelName?: string;
    /**
     * toolId字段
     * Java类型: java.lang.Long
     * 描述: 关联的工具ID
     */
    toolId?: string|number;
    /**
     * videoDuration字段
     * Java类型: java.lang.Integer
     * 描述: 视频时长(秒)(VIDEO使用类型适用)
     */
    videoDuration?: number;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 服务提供商(如OpenAI、Azure、Anthropic等)
     */
    provider?: ChannelProviderEnum;
    /**
     * billingType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.BillingType
     * 描述: 计费类型(TOKEN:按token计费,COUNT:按次数计费,TIME:按时间计费)
     */
    billingType?: BillingType;
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: 请求ID(用于跟踪和关联请求)
     */
    requestId?: string;
    /**
     * promptId字段
     * Java类型: java.lang.Long
     * 描述: 关联的提示语ID
     */
    promptId?: string|number;
    /**
     * promptTokens字段
     * Java类型: java.lang.Long
     * 描述: 输入token数量(TOKEN计费类型适用)
     */
    promptTokens?: string|number;
    /**
     * imageSize字段
     * Java类型: java.lang.String
     * 描述: 图片尺寸(如1024x1024)(IMAGE使用类型适用)
     */
    imageSize?: string;
    /**
     * audioDuration字段
     * Java类型: java.lang.Integer
     * 描述: 音频时长(秒)(AUDIO使用类型适用)
     */
    audioDuration?: number;
    /**
     * currencyCode字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.CurrencyCode
     * 描述: 货币单位(如USD、CNY等)
     */
    currencyCode?: CurrencyCode;
    /**
     * completionTokens字段
     * Java类型: java.lang.Long
     * 描述: 输出token数量(TOKEN计费类型适用)
     */
    completionTokens?: string|number;
    /**
     * usageType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.UsageType
     * 描述: 使用类型(TEXT:文本生成,IMAGE:图片生成,VIDEO:视频生成,AUDIO:语音生成,EMBEDDING:嵌入向量)
     */
    usageType?: UsageType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.UsageStatus
     * 描述: 状态(SUCCESS:成功,FAILED:失败)
     */
    status?: UsageStatus;
    /**
     * imageCount字段
     * Java类型: java.lang.Integer
     * 描述: 图片数量(IMAGE使用类型适用)
     */
    imageCount?: number;
    /**
     * cost字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际费用
     */
    cost?: string|number;
    /**
     * cachedTokens字段
     * Java类型: java.lang.Long
     * 描述: 缓存token数量(TOKEN计费类型适用)
     */
    cachedTokens?: string|number;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     */
    responseTime?: string;
    /**
     * callCount字段
     * Java类型: java.lang.Integer
     * 描述: 调用次数(COUNT计费类型适用)
     */
    callCount?: number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * totalTokens字段
     * Java类型: java.lang.Long
     * 描述: 总token数量(TOKEN计费类型适用)
     */
    totalTokens?: string|number;
    /**
     * processingTime字段
     * Java类型: java.lang.Long
     * 描述: 处理时间(毫秒)(TIME计费类型适用)
     */
    processingTime?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UsageRecordResponse
 * 描述: AI模型使用记录VO，用于记录各种AI模型调用的使用情况
 */
export interface UsageRecordResponse extends BaseResponse {
    /**
     * imageSize字段
     * Java类型: java.lang.String
     * 描述: 图片尺寸(如1024x1024)(IMAGE使用类型适用)
     */
    imageSize?: string;
    /**
     * promptTokens字段
     * Java类型: java.lang.Long
     * 描述: 输入token数量(TOKEN计费类型适用)
     */
    promptTokens?: string|number;
    /**
     * usageType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.UsageType
     * 描述: 使用类型(TEXT:文本生成,IMAGE:图片生成,VIDEO:视频生成,AUDIO:语音生成,EMBEDDING:嵌入向量)
     */
    usageType?: UsageType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.UsageStatus
     * 描述: 状态(SUCCESS:成功,FAILED:失败)
     */
    status?: UsageStatus;
    /**
     * completionTokens字段
     * Java类型: java.lang.Long
     * 描述: 输出token数量(TOKEN计费类型适用)
     */
    completionTokens?: string|number;
    /**
     * currencyCode字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.CurrencyCode
     * 描述: 货币单位(如USD、CNY等)
     */
    currencyCode?: CurrencyCode;
    /**
     * audioDuration字段
     * Java类型: java.lang.Integer
     * 描述: 音频时长(秒)(AUDIO使用类型适用)
     */
    audioDuration?: number;
    /**
     * videoDuration字段
     * Java类型: java.lang.Integer
     * 描述: 视频时长(秒)(VIDEO使用类型适用)
     */
    videoDuration?: number;
    /**
     * modelName字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     */
    modelName?: string;
    /**
     * toolId字段
     * Java类型: java.lang.Long
     * 描述: 关联的工具ID
     */
    toolId?: string|number;
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     */
    requestTime?: string;
    /**
     * promptId字段
     * Java类型: java.lang.Long
     * 描述: 关联的提示语ID
     */
    promptId?: string|number;
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: 请求ID(用于跟踪和关联请求)
     */
    requestId?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 服务提供商(如OpenAI、Azure、Anthropic等)
     */
    provider?: ChannelProviderEnum;
    /**
     * billingType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.BillingType
     * 描述: 计费类型(TOKEN:按token计费,COUNT:按次数计费,TIME:按时间计费)
     */
    billingType?: BillingType;
    /**
     * callCount字段
     * Java类型: java.lang.Integer
     * 描述: 调用次数(COUNT计费类型适用)
     */
    callCount?: number;
    /**
     * processingTime字段
     * Java类型: java.lang.Long
     * 描述: 处理时间(毫秒)(TIME计费类型适用)
     */
    processingTime?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * totalTokens字段
     * Java类型: java.lang.Long
     * 描述: 总token数量(TOKEN计费类型适用)
     */
    totalTokens?: string|number;
    /**
     * cost字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际费用
     */
    cost?: string|number;
    /**
     * imageCount字段
     * Java类型: java.lang.Integer
     * 描述: 图片数量(IMAGE使用类型适用)
     */
    imageCount?: number;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     */
    responseTime?: string;
    /**
     * cachedTokens字段
     * Java类型: java.lang.Long
     * 描述: 缓存token数量(TOKEN计费类型适用)
     */
    cachedTokens?: string|number;
}
