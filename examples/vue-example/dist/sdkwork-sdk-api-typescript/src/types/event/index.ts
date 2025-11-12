import { IotEventType, TtsState, SttState, ListenMode, ListenState } from '../../enums/com.sdkwork.ai.iot.type';
import { BaseParam } from '../../types/base';
import { EventPayload } from '../../types/com.sdkwork.ai.iot.protocol.event';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SendEventParam
 */
export interface SendEventParam extends BaseParam {
    /**
     * eventType字段
     * Java类型: com.sdkwork.ai.iot.type.IotEventType
     */
    eventType?: IotEventType;
    /**
     * payload字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.EventPayload
     */
    payload?: EventPayload;
}
