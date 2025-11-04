import { ChannelProviderEnum } from '../../enums/core.type';
import { VoiceModelStatus, VoiceGender, VoiceAgeType, VoiceSpeakerType } from '../../enums/voice';
import { DataScope } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { QueryListParam } from '../../types/common';
import { TagsContent } from '../../types/tags';
import { ChannelVoiceSpeakerModel, VoiceMotion, VoiceStyle } from '../../types/models';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceSpeakerParam
 * 描述: 语音发音人Form
 */
export interface VoiceSpeakerParam extends BaseParam {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 发音人代码
     */
    code?: string;
    /**
     * voice字段
     * Java类型: java.lang.String
     * 描述: 语音
     */
    voice?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * gender字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceGender
     * 描述: 性别：1-男，2-女，3-中性
     */
    gender?: VoiceGender;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 关联的模型ID
     */
    model?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 发音人描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 发音人名称
     */
    name?: string;
    /**
     * channelSpeakerId字段
     * Java类型: java.lang.String
     * 描述: 关联的模型ID
     */
    channelSpeakerId?: string;
    /**
     * ageType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceAgeType
     * 描述: 年龄类型：1-老人，2-成年，3-儿童
     */
    ageType?: VoiceAgeType;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签
     */
    tags?: TagsContent;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceModelStatus
     * 描述: 状态：1-激活，2-未激活，3-弃用
     */
    status?: VoiceModelStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceSpeakerType
     * 描述: 发音人类型：1-普通发音人，2-AI发音人
     */
    type?: VoiceSpeakerType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceSpeakerQueryParam
 */
export interface VoiceSpeakerQueryParam extends QueryListParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
    /**
     * keyword字段
     * Java类型: java.lang.String
     */
    keyword?: string;
    /**
     * dataScope字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataScope
     */
    dataScope?: DataScope;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceModelStatus
     */
    status?: VoiceModelStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceSpeakerInfo
 * 描述: 文本转语音模型配置信息
 */
export interface VoiceSpeakerInfo extends ChannelVoiceSpeakerModel {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VoiceSpeakerResponse
 * 描述: 语音发音人VO
 */
export interface VoiceSpeakerResponse extends BaseResponse {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 发音人名称
     */
    name?: string;
    /**
     * channelSpeakerId字段
     * Java类型: java.lang.String
     * 描述: 关联的模型ID
     */
    channelSpeakerId?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 关联的模型ID
     */
    model?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     */
    id?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceModelStatus
     * 描述: 状态：1-激活，2-未激活，3-弃用
     */
    status?: VoiceModelStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 发音人描述
     */
    description?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceSpeakerType
     * 描述: 发音人类型：1-普通发音人，2-AI发音人
     */
    type?: VoiceSpeakerType;
    /**
     * ageType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceAgeType
     * 描述: 年龄类型：1-老人，2-成年，3-儿童
     */
    ageType?: VoiceAgeType;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签列表
     */
    tags?: TagsContent;
    /**
     * voice字段
     * Java类型: java.lang.String
     * 描述: 语音
     */
    voice?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 发音人代码
     */
    code?: string;
    /**
     * gender字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.voice.VoiceGender
     * 描述: 性别：1-男，2-女，3-中性
     */
    gender?: VoiceGender;
}
