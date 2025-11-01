import { TtsState, SttState, ListenMode, ListenState } from '../../enums/com.sdkwork.ai.iot.type';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TtsEventData
 */
export interface TtsEventData extends BaseObject {
    /**
     * state字段
     * Java类型: com.sdkwork.ai.iot.type.TtsState
     */
    state?: TtsState;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SttEventData
 */
export interface SttEventData extends BaseObject {
    /**
     * state字段
     * Java类型: com.sdkwork.ai.iot.type.SttState
     */
    state?: SttState;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ListenEventData
 */
export interface ListenEventData extends BaseObject {
    /**
     * mode字段
     * Java类型: com.sdkwork.ai.iot.type.ListenMode
     */
    mode?: ListenMode;
    /**
     * state字段
     * Java类型: com.sdkwork.ai.iot.type.ListenState
     */
    state?: ListenState;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AbortEventData
 */
export interface AbortEventData extends BaseObject {
    /**
     * reason字段
     * Java类型: java.lang.String
     */
    reason?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ConnectRegisterEventData
 */
export interface ConnectRegisterEventData extends BaseObject {
    /**
     * device_id字段
     * Java类型: java.lang.String
     */
    device_id?: string;
    /**
     * mac_address字段
     * Java类型: java.lang.String
     */
    mac_address?: string;
    /**
     * client_id字段
     * Java类型: java.lang.String
     */
    client_id?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: EventPayload
 */
export interface EventPayload extends BaseObject {
    /**
     * tts字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.TtsEventData
     */
    tts?: TtsEventData;
    /**
     * stt字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.SttEventData
     */
    stt?: SttEventData;
    /**
     * abort字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.AbortEventData
     */
    abort?: AbortEventData;
    /**
     * data字段
     * Java类型: java.util.Map
     */
    data?: Map<string, Object>;
    /**
     * text字段
     * Java类型: java.lang.String
     */
    text?: string;
    /**
     * connect_register字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.ConnectRegisterEventData
     */
    connect_register?: ConnectRegisterEventData;
    /**
     * listen字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.ListenEventData
     */
    listen?: ListenEventData;
}
