import { MediaResourceType } from '../../enums/resource';
import { GroupType, GroupStatus, ConversationType, ParticipantContextType, ParticipantRole, ParticipantType } from '../../enums/conversation';
import { MessageType } from '../../enums/im.type';
import { AudioFormat } from '../../enums/audio';
import { ChatCompletionRole } from '../../enums/chat';
import { BaseParam } from '../../types/base';
import { ImageMediaResource } from '../../types/resource';
import { BaseObject, BaseResponse } from '../../types/base';
import { MessageBody } from '../../types/chat';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImGroupParam
 * 描述: 聊天群组信息Form
 */
export interface ImGroupParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 群组描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 群组名称
     */
    name?: string;
    /**
     * creatorId字段
     * Java类型: java.lang.Long
     * 描述: 群组创建者ID
     */
    creatorId?: string|number;
    /**
     * avatar字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 群组头像
     */
    avatar?: ImageMediaResource;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupType
     * 描述: 群组类型
     */
    type?: GroupType;
    /**
     * announcement字段
     * Java类型: java.lang.String
     * 描述: 群组公告
     */
    announcement?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupStatus
     * 描述: 群组状态
     */
    status?: GroupStatus;
    /**
     * allowMemberInvite字段
     * Java类型: java.lang.Boolean
     * 描述: 是否允许成员邀请新成员
     */
    allowMemberInvite?: boolean;
    /**
     * maxMembers字段
     * Java类型: java.lang.Integer
     * 描述: 最大成员数量
     */
    maxMembers?: number;
    /**
     * requireApproval字段
     * Java类型: java.lang.Boolean
     * 描述: 是否需要审批才能加入
     */
    requireApproval?: boolean;
    /**
     * memberCount字段
     * Java类型: java.lang.Integer
     * 描述: 群组成员数量
     */
    memberCount?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ParticipantParam
 * 描述: 聊天参与者Form
 */
export interface ParticipantParam extends BaseParam {
    /**
     * face字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 参与者头像
     */
    face?: ImageMediaResource;
    /**
     * conversationType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.PlusConversationType
     * 描述: 会话类型
     */
    conversationType?: ConversationType;
    /**
     * contextType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantContextType
     * 描述: 上下文类型 (CONVERSATION:会话, GROUP:群组)
     */
    contextType?: ParticipantContextType;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 参与者名称
     */
    name?: string;
    /**
     * isCreator字段
     * Java类型: java.lang.Boolean
     * 描述: 是否是上下文创建者
     */
    isCreator?: boolean;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI助手ID
     */
    agentId?: string|number;
    /**
     * groupType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupType
     * 描述: 群组类型 (使用GroupType枚举)
     */
    groupType?: GroupType;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantRole
     * 描述: 参与者在上下文中的角色 (如: owner, member, guest等)
     */
    role?: ParticipantRole;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: 最后活跃时间
     */
    lastActiveTime?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 会话ID (当contextType为GROUP时，可以将会话ID存储在此字段)
     */
    conversationId?: string|number;
    /**
     * contextId字段
     * Java类型: java.lang.Long
     * 描述: 上下文ID (可以是会话ID或群组ID)
     */
    contextId?: string|number;
    /**
     * isOnline字段
     * Java类型: java.lang.Boolean
     * 描述: 是否在线
     */
    isOnline?: boolean;
    /**
     * isTemporary字段
     * Java类型: java.lang.Boolean
     * 描述: 是否是临时参与者 (用于在群组中选择成员建立临时会话)
     */
    isTemporary?: boolean;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantType
     * 描述: 参与者类型 (用户、AI助手等)
     */
    type?: ParticipantType;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 关联的用户ID
     */
    userId?: string|number;
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
 * 对应Java类: ParticipantResponse
 * 描述: 聊天参与者视图对象
 */
export interface ParticipantResponse extends BaseResponse {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 参与者名称
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 参与者ID
     */
    id?: string|number;
    /**
     * isCreator字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为上下文创建者
     */
    isCreator?: boolean;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * conversationType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.PlusConversationType
     * 描述: 会话类型
     */
    conversationType?: ConversationType;
    /**
     * face字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 参与者头像资源
     */
    face?: ImageMediaResource;
    /**
     * contextType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantContextType
     * 描述: 上下文类型（CONVERSATION-会话、GROUP-群组）
     */
    contextType?: ParticipantContextType;
    /**
     * contextId字段
     * Java类型: java.lang.Long
     * 描述: 上下文ID（会话ID或群组ID）
     */
    contextId?: string|number;
    /**
     * isOnline字段
     * Java类型: java.lang.Boolean
     * 描述: 是否在线
     */
    isOnline?: boolean;
    /**
     * isTemporary字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为临时参与者（用于群组临时会话）
     */
    isTemporary?: boolean;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 关联的用户ID
     */
    userId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantType
     * 描述: 参与者类型（用户、AI助手等）
     */
    type?: ParticipantType;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.ParticipantRole
     * 描述: 参与者角色（如：owner-所有者、member-成员、guest-访客等）
     */
    role?: ParticipantRole;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: 最后活跃时间
     */
    lastActiveTime?: string;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI助手ID
     */
    agentId?: string|number;
    /**
     * groupType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupType
     * 描述: 群组类型
     */
    groupType?: GroupType;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 会话ID（当上下文类型为群组时存储）
     */
    conversationId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImGroupResponse
 * 描述: 聊天群组VO
 */
export interface ImGroupResponse extends BaseResponse {
    /**
     * memberCount字段
     * Java类型: java.lang.Integer
     * 描述: 群组成员数量
     */
    memberCount?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupType
     * 描述: 群组类型
     */
    type?: GroupType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 群组UUID
     */
    uuid?: string;
    /**
     * creatorId字段
     * Java类型: java.lang.Long
     * 描述: 群组创建者ID
     */
    creatorId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 群组描述
     */
    description?: string;
    /**
     * avatar字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 群组头像
     */
    avatar?: ImageMediaResource;
    /**
     * requireApproval字段
     * Java类型: java.lang.Boolean
     * 描述: 是否需要审批才能加入
     */
    requireApproval?: boolean;
    /**
     * maxMembers字段
     * Java类型: java.lang.Integer
     * 描述: 最大成员数量
     */
    maxMembers?: number;
    /**
     * allowMemberInvite字段
     * Java类型: java.lang.Boolean
     * 描述: 是否允许成员邀请新成员
     */
    allowMemberInvite?: boolean;
    /**
     * announcement字段
     * Java类型: java.lang.String
     * 描述: 群组公告
     */
    announcement?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.GroupStatus
     * 描述: 群组状态
     */
    status?: GroupStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 群组名称
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 群组ID
     */
    id?: string|number;
}
