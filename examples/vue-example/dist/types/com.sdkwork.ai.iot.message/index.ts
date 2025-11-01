import { MediaResourceType } from '../../enums/resource';
import { MessageType } from '../../enums/im.type';
import { AudioFormat } from '../../enums/audio';
import { ChatCompletionRole } from '../../enums/chat';
import { Message, Participant } from '../../types/im';
import { Protocol } from '../../types/com.sdkwork.ai.iot.protocol';
import { MessageBody } from '../../types/chat';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotMessage
 * 描述: IM消息实体类
 */
export interface IotMessage extends Message {
    /**
     * protocol字段
     * Java类型: com.sdkwork.ai.iot.protocol.Protocol
     */
    protocol?: Protocol;
}
