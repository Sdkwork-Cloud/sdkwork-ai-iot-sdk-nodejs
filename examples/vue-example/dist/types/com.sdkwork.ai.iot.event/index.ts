import { TtsState, SttState, ListenMode, ListenState, IotEventType } from '../../enums/com.sdkwork.ai.iot.type';
import { MediaResourceType } from '../../enums/resource';
import { MessageType } from '../../enums/im.type';
import { AudioFormat } from '../../enums/audio';
import { ChatCompletionRole } from '../../enums/chat';
import { IotMessage } from '../../types/com.sdkwork.ai.iot.message';
import { EventPayload } from '../../types/com.sdkwork.ai.iot.protocol.event';
import { Participant } from '../../types/im';
import { Protocol } from '../../types/com.sdkwork.ai.iot.protocol';
import { MessageBody } from '../../types/chat';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotEvent
 * 描述: IM消息实体类
 */
export interface IotEvent extends IotMessage {
    /**
     * eventPayload字段
     * Java类型: com.sdkwork.ai.iot.protocol.event.EventPayload
     */
    eventPayload?: EventPayload;
    /**
     * eventType字段
     * Java类型: com.sdkwork.ai.iot.type.IotEventType
     */
    eventType?: IotEventType;
}
