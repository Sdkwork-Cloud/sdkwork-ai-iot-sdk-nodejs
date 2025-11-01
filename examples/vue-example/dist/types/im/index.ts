import { MediaResourceType } from '../../enums/resource';
import { MessageType } from '../../enums/im.type';
import { AudioFormat } from '../../enums/audio';
import { ChatCompletionRole } from '../../enums/chat';
import { BaseObject } from '../../types/base';
import { ImageMediaResource } from '../../types/resource';
import { MessageBody } from '../../types/chat';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Participant
 * 描述: 消息参与者实体类
 */
export interface Participant extends BaseObject {
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 参与者UUID
     * 示例: 550e8400-e29b-41d4-a716-446655440000
     */
    uuid?: string;
    /**
     * deviceId字段
     * Java类型: java.lang.Long
     * 描述: 设备ID
     * 示例: 2001
     */
    deviceId?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 参与者名称
     * 示例: 张三
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 参与者ID
     * 示例: 1001
     */
    id?: string|number;
    /**
     * openId字段
     * Java类型: java.lang.String
     * 描述: 开放平台OpenID
     */
    openId?: string;
    /**
     * deviceUuid字段
     * Java类型: java.lang.String
     * 描述: 设备UUID
     * 示例: 650e8400-e29b-41d4-a716-446655440000
     */
    deviceUuid?: string;
    /**
     * unionId字段
     * Java类型: java.lang.String
     * 描述: 开放平台UnionID
     */
    unionId?: string;
    /**
     * face字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 参与者头像
     * 示例: {"url":"https://example.com/avatar.jpg","width":100,"height":100}
     */
    face?: ImageMediaResource;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Message
 * 描述: IM消息实体类
 */
export interface Message extends BaseObject {
    /**
     * clientMsgId字段
     * Java类型: java.lang.String
     * 描述: 客户端消息ID（客户端生成）
     * 示例: CLI20231201120000001
     */
    clientMsgId?: string;
    /**
     * sender字段
     * Java类型: com.sdkwork.spring.ai.plus.im.Participant
     * 描述: 发送者
     * 示例: {"id":1001,"name":"张三","uuid":"550e8400-e29b-41d4-a716-446655440000"}
     */
    sender?: Participant;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 消息创建时间
     * 示例: 2023-12-01T12:00:00Z
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 消息最后更新时间
     * 示例: 2023-12-01T12:05:00Z
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 消息在数据库中的唯一标识符
     * 示例: 10001
     */
    id?: string|number;
    /**
     * sendAt字段
     * Java类型: java.time.Instant
     * 描述: 消息发送时间
     * 示例: 2023-12-01T12:05:00Z
     */
    sendAt?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 会话ID
     * 示例: 20001
     */
    conversationId?: string|number;
    /**
     * groupId字段
     * Java类型: java.lang.Long
     * 描述: 群组ID（用于群聊消息）
     * 示例: 30001
     */
    groupId?: string|number;
    /**
     * receiver字段
     * Java类型: com.sdkwork.spring.ai.plus.im.Participant
     * 描述: 接收者
     * 示例: {"id":1002,"name":"李四","uuid":"650e8400-e29b-41d4-a716-446655440000"}
     */
    receiver?: Participant;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 消息元数据
     */
    metadata?: Map<string, Object>;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.im.type.MessageType
     * 描述: 消息类型
     * 示例: TEXT
     */
    type?: MessageType;
    /**
     * body字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.MessageBody
     * 描述: 消息数据内容
     * 示例: {"text":{"content":"你好，这是一条文本消息"}}
     */
    body?: MessageBody;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 消息的UUID，用于唯一标识一条消息
     * 示例: 550e8400-e29b-41d4-a716-446655440000
     */
    uuid?: string;
    /**
     * msgId字段
     * Java类型: java.lang.String
     * 描述: 消息ID（服务端生成）
     * 示例: MSG20231201120000001
     */
    msgId?: string;
}
