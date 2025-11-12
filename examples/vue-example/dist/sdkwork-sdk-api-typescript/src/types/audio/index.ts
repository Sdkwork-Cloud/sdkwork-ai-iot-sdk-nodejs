import { ChannelProviderEnum } from '../../enums/core.type';
import { BaseObject } from '../../types/base';
import { AudioTranscriptionOptions } from '../../types/audio.transcription';
import { VoiceSpeakerInfo } from '../../types/voice';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SpeechTranscriptionConfig
 */
export interface SpeechTranscriptionConfig extends BaseObject {
    /**
     * options字段
     * Java类型: org.springframework.ai.audio.transcription.AudioTranscriptionOptions
     */
    options?: AudioTranscriptionOptions;
    /**
     * product字段
     * Java类型: java.lang.String
     */
    product?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     */
    provider?: ChannelProviderEnum;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SpeechConfig
 */
export interface SpeechConfig extends BaseObject {
    /**
     * speakerConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechSpeakerConfig
     */
    speakerConfig?: SpeechSpeakerConfig;
    /**
     * vadConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.VadConfig
     */
    vadConfig?: VadConfig;
    /**
     * transcriptionConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechTranscriptionConfig
     */
    transcriptionConfig?: SpeechTranscriptionConfig;
    /**
     * aecConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.AecConfig
     */
    aecConfig?: AecConfig;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VadConfig
 */
export interface VadConfig extends BaseObject {
    /**
     * stepSize字段
     * Java类型: java.lang.Integer
     */
    stepSize?: number;
    /**
     * silenceTimeout字段
     * Java类型: long
     */
    silenceTimeout?: string|number;
    /**
     * speechTimeout字段
     * Java类型: long
     */
    speechTimeout?: string|number;
    /**
     * minSilenceDurationMs字段
     * Java类型: java.lang.Long
     */
    minSilenceDurationMs?: string|number;
    /**
     * speechThreshold字段
     * Java类型: java.lang.Double
     */
    speechThreshold?: string|number;
    /**
     * maxSilenceDurationMs字段
     * Java类型: java.lang.Long
     */
    maxSilenceDurationMs?: string|number;
    /**
     * windowSize字段
     * Java类型: java.lang.Integer
     */
    windowSize?: number;
    /**
     * minSpeechDurationMs字段
     * Java类型: java.lang.Long
     */
    minSpeechDurationMs?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AecConfig
 */
export interface AecConfig extends BaseObject {
    /**
     * delayEstimation字段
     * Java类型: java.lang.Integer
     */
    delayEstimation?: number;
    /**
     * sampleRate字段
     * Java类型: java.lang.Integer
     */
    sampleRate?: number;
    /**
     * echoMode字段
     * Java类型: java.lang.Integer
     */
    echoMode?: number;
    /**
     * noiseSuppression字段
     * Java类型: java.lang.Integer
     */
    noiseSuppression?: number;
    /**
     * echoTailMs字段
     * Java类型: java.lang.Integer
     */
    echoTailMs?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SpeechSpeakerConfig
 */
export interface SpeechSpeakerConfig extends BaseObject {
    /**
     * volume字段
     * Java类型: java.lang.Double
     */
    volume?: string|number;
    /**
     * speaker字段
     * Java类型: com.sdkwork.spring.ai.plus.voice.VoiceSpeakerInfo
     */
    speaker?: VoiceSpeakerInfo;
    /**
     * pitch字段
     * Java类型: java.lang.Double
     */
    pitch?: string|number;
    /**
     * speakerId字段
     * Java类型: java.lang.Long
     */
    speakerId?: string|number;
    /**
     * language字段
     * Java类型: java.lang.String
     */
    language?: string;
    /**
     * format字段
     * Java类型: java.lang.String
     */
    format?: string;
    /**
     * speed字段
     * Java类型: java.lang.Double
     */
    speed?: string|number;
}
