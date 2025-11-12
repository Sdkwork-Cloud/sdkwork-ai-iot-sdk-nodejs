import { ModelLimitItemType, ModelTokenUnit, ModelPriceUnit, ModelPriceItemType } from '../../enums/models';
import { CurrencyCode, ChannelProviderEnum } from '../../enums/core.type';
import { BaseObject } from '../../types/base';
import { TagsContent } from '../../types/tags';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceStyle
 */
export interface VoiceStyle extends BaseObject {
    /**
     * styles字段
     * Java类型: [Ljava.lang.String;
     */
    styles?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelLimitInfo
 * 描述: AI模型服务令牌使用限制配置信息
 */
export interface ModelLimitInfo extends BaseObject {
    /**
     * items字段
     * Java类型: java.util.List
     * 描述: 模型限制项列表（包含输入/输出/TPM/RPM等具体限制配置）
     */
    items?: Array<ModelLimitItem>;
    /**
     * unit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelTokenUnit
     * 描述: 令牌计量单位（用于指定后续数值的计量单位基准）
     */
    unit?: ModelTokenUnit;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelPrice
 * 描述: AI模型服务价格配置信息
 */
export interface ModelPrice extends BaseObject {
    /**
     * unit字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPriceUnit
     * 描述: 价格计量单位（用于指定价格项的计量基准）
     */
    unit?: ModelPriceUnit;
    /**
     * items字段
     * Java类型: java.util.List
     * 描述: 价格项列表（包含输入/输出/批量处理等价格类型）
     */
    items?: Array<ModelPriceItem>;
    /**
     * currency字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.CurrencyCode
     * 描述: 货币代码（指定价格使用的货币类型，如USD、CNY等）
     */
    currency?: CurrencyCode;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChannelVoiceSpeakerModel
 * 描述: 文本转语音模型配置信息
 */
export interface ChannelVoiceSpeakerModel extends BaseObject {
    /**
     * motion字段
     * Java类型: com.sdkwork.spring.ai.plus.models.VoiceMotion
     * 描述: 语音情感
     */
    motion?: VoiceMotion;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 语音服务提供商
     */
    provider?: ChannelProviderEnum;
    /**
     * displayName字段
     * Java类型: java.lang.String
     * 描述: 显示的语音名称
     */
    displayName?: string;
    /**
     * voice字段
     * Java类型: java.lang.String
     * 描述: 发音人
     */
    voice?: string;
    /**
     * models字段
     * Java类型: [Ljava.lang.String;
     * 描述: 语音模型配置信息
     */
    models?: string[];
    /**
     * product字段
     * Java类型: java.lang.String
     * 描述: 语音模型产品名称
     */
    product?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 语音标签
     */
    tags?: TagsContent;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 语音描述信息
     */
    description?: string;
    /**
     * style字段
     * Java类型: com.sdkwork.spring.ai.plus.models.VoiceStyle
     * 描述: 语音风格
     */
    style?: VoiceStyle;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 模型唯一标识符（由AI服务提供商提供）
     */
    id?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AspectRatio
 * 描述: 视频/图像生成的宽高比例配置
 */
export interface AspectRatio extends BaseObject {
    /**
     * width字段
     * Java类型: java.lang.Float
     * 描述: 宽度比例值（用于计算具体分辨率）
     */
    width?: string|number;
    /**
     * ratio字段
     * Java类型: java.lang.String
     * 描述: 宽高比字符串表示（如16:9、4:3等）
     */
    ratio?: string;
    /**
     * height字段
     * Java类型: java.lang.Float
     * 描述: 高度比例值（用于计算具体分辨率）
     */
    height?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelPriceItem
 * 描述: 模型定价具体条目（包含价格类型和对应价格数值）
 */
export interface ModelPriceItem extends BaseObject {
    /**
     * price字段
     * Java类型: java.lang.Double
     * 描述: 价格数值（单位由价格计量单位决定）
     */
    price?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelPriceItemType
     * 描述: 价格类型（输入/输出/批量处理等）
     */
    type?: ModelPriceItemType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelMetadata
 * 描述: 模型附加技术特性信息（包含多模态支持、生成能力等）
 */
export interface ModelMetadata extends BaseObject {
    /**
     * is_multimodal字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为多模态模型（支持文字、图片、语音、视频输入输出）
     */
    is_multimodal?: boolean;
    /**
     * is_reasoning字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为思考模型（支持思维链处理能力）
     */
    is_reasoning?: boolean;
    /**
     * is_tool_call字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持工具调用（Function Call功能）
     */
    is_tool_call?: boolean;
    /**
     * ratios字段
     * Java类型: java.util.List
     * 描述: 支持的宽高比配置（21:9/16:9/4:3/1:1/keep_ratio/adaptive等）
     */
    ratios?: Array<AspectRatio>;
    /**
     * durations字段
     * Java类型: java.util.Set
     * 描述: 支持的视频持续时间范围（单位：秒）
     */
    durations?: Array<string|number>;
    /**
     * resolutions字段
     * Java类型: java.util.Set
     * 描述: 支持的分辨率配置（可选值：480p/720p/1080p/4K）
     */
    resolutions?: Array<string>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceMotion
 */
export interface VoiceMotion extends BaseObject {
    /**
     * motions字段
     * Java类型: [Ljava.lang.String;
     */
    motions?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ModelLimitItem
 * 描述: 模型服务限制配置项（包含限制类型和具体数值）
 */
export interface ModelLimitItem extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.models.ModelLimitItemType
     * 描述: 限制项类型（如上下文长度、TPM等）
     */
    type?: ModelLimitItemType;
    /**
     * value字段
     * Java类型: java.lang.Double
     * 描述: 限制值（具体数值，单位由模型配置的计量单位决定）
     */
    value?: string|number;
}
