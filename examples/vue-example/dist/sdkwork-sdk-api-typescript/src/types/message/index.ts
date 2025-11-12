import { MessageRole, MessageStatus } from '../../enums/ai';
import { AgentType, AgentBizType } from '../../enums/agent';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { ChatCompletionRole } from '../../enums/chat';
import { MessageType } from '../../enums/im.type';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { ConversationType } from '../../enums/conversation';
import { BaseParam } from '../../types/base';
import { QueryListParam } from '../../types/common';
import { MessageBody, ChatOptions } from '../../types/chat';
import { BaseResponse } from '../../types/base';
import { FeedbackMetadata } from '../../types/data.meta';
import { Participant } from '../../types/im';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatMessageContentParam
 * 描述: 聊天消息内容Form，用于AI对话消息详情的参数传递
 */
export interface ChatMessageContentParam extends BaseParam {
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID（关联plus_ai_agent.id）
     * 示例: 456
     */
    agentId?: string|number;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 消息元数据（JSON格式，存储额外信息）
     * 示例: {"source":"web","device":"desktop"}
     */
    metadata?: Map<string, Object>;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageRole
     * 描述: 消息角色（用户/助手/系统/函数）
     * 示例: USER
     */
    role?: MessageRole;
    /**
     * agentType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent类型（1:聊天/2:工具/3:自定义）
     * 示例: CHAT
     */
    agentType?: AgentType;
    /**
     * conversationUuid字段
     * Java类型: java.lang.String
     * 描述: 会话UUID（关联plus_ai_conversation.uuid）
     * 示例: 550e8400-e29b-41d4-a716-446655440000
     */
    conversationUuid?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 会话ID（关联plus_ai_conversation.id）
     * 示例: 123
     */
    conversationId?: string|number;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.MessageBody
     * 描述: 消息内容（文本）
     * 示例: Hello, how can I help you?
     */
    content?: MessageBody;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageStatus
     * 描述: 消息状态（已发送/已送达/已读/失败）
     * 示例: SENT
     */
    status?: MessageStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.im.type.MessageType
     * 描述: 消息类型（文本/图片/文件）
     * 示例: TEXT
     */
    type?: MessageType;
    /**
     * agentBizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent业务类型（如翻译/客服/写作等）
     * 示例: TRANSLATION
     */
    agentBizType?: AgentBizType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatMessageQueryListParam
 */
export interface ChatMessageQueryListParam extends QueryListParam {
    /**
     * conversationUuid字段
     * Java类型: java.lang.String
     * 描述: Conversation Uuid (foreign key to plus_ai_conversation.uuid)
     */
    conversationUuid?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: Conversation ID (foreign key to plus_ai_conversation.id)
     */
    conversationId?: string|number;
    /**
     * lastSyncMessageId字段
     * Java类型: java.lang.String
     * 描述: Last Sync Message ID
     */
    lastSyncMessageId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatMessageParam
 * 描述: Chat Message Form - for creating or updating AI conversation messages
 */
export interface ChatMessageParam extends BaseParam {
    /**
     * tokenCount字段
     * Java类型: java.lang.Integer
     * 描述: Token count (for billing/usage tracking)
     */
    tokenCount?: number;
    /**
     * errorCode字段
     * Java类型: java.lang.String
     * 描述: Error code (if message represents an error)
     */
    errorCode?: string;
    /**
     * errorMessage字段
     * Java类型: java.lang.String
     * 描述: Error message (if message represents an error)
     */
    errorMessage?: string;
    /**
     * usedRag字段
     * Java类型: java.lang.Boolean
     * 描述: Flag indicating if this message was generated with RAG (Retrieval Augmented Generation)
     */
    usedRag?: boolean;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.MessageBody
     * 描述: Message content (text of the message)
     */
    content?: MessageBody;
    /**
     * processingTime字段
     * Java类型: java.lang.Long
     * 描述: Processing time in milliseconds (for performance tracking)
     */
    processingTime?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User identifier (foreign key to plus_user.id)
     */
    userId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.im.type.MessageType
     * 描述: Message type (text, image, file, etc.)
     */
    type?: MessageType;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageRole
     * 描述: Message role (user, assistant, system, function)
     */
    role?: MessageRole;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: Message metadata (JSON format, can store additional information)
     */
    metadata?: Map<string, Object>;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: Conversation ID (foreign key to plus_ai_conversation.id)
     */
    conversationId?: string|number;
    /**
     * modelId字段
     * Java类型: java.lang.Long
     * 描述: Model ID (foreign key to plus_ai_model_info.id)
     */
    modelId?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Specific model name/identifier (e.g., "gpt-4", "claude-3-opus")
     */
    model?: string;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: Chat options (temperature, top_p, etc.) stored as JSON
     */
    chatOptions?: ChatOptions;
    /**
     * parentMessageId字段
     * Java类型: java.lang.Long
     * 描述: Parent message ID (for threaded conversations)
     */
    parentMessageId?: string|number;
    /**
     * temperature字段
     * Java类型: java.lang.Float
     * 描述: Temperature setting used for this message
     */
    temperature?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageStatus
     * 描述: Message status (sent, delivered, read, failed)
     */
    status?: MessageStatus;
    /**
     * isError字段
     * Java类型: java.lang.Boolean
     * 描述: Error flag (true if message represents an error)
     */
    isError?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatMessageResponse
 * 描述: Chat Message Value Object - Represents a message in an AI conversation (user input or AI response)
 */
export interface ChatMessageResponse extends BaseResponse {
    /**
     * body字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.MessageBody
     * 描述: Message body (text of the message)
     */
    body?: MessageBody;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.im.type.MessageType
     * 描述: Message type (text, image, file, etc.)
     */
    type?: MessageType;
    /**
     * agentBizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent business type (e.g., TRANSLATION, CUSTOMER_SERVICE, WRITER, etc.)
     */
    agentBizType?: AgentBizType;
    /**
     * errorCode字段
     * Java类型: java.lang.String
     * 描述: Error code (if message represents an error)
     */
    errorCode?: string;
    /**
     * groupId字段
     * Java类型: java.lang.Long
     * 描述: Group ID (for group chats)
     */
    groupId?: string|number;
    /**
     * receiveAt字段
     * Java类型: java.time.Instant
     * 描述: Message receive time
     */
    receiveAt?: string;
    /**
     * modelId字段
     * Java类型: java.lang.Long
     * 描述: Model ID (foreign key to plus_ai_model_info.id)
     */
    modelId?: string|number;
    /**
     * feedbackMetadata字段
     * Java类型: com.sdkwork.spring.ai.plus.data.meta.FeedbackMetadata
     * 描述: Feedback metadata
     */
    feedbackMetadata?: FeedbackMetadata;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageRole
     * 描述: Message role (user, assistant, system, function)
     */
    role?: MessageRole;
    /**
     * agentType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent type (1: Chat, 2: Tool, 3: Custom)
     */
    agentType?: AgentType;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: Message metadata (JSON format, can store additional information)
     */
    metadata?: Map<string, Object>;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID (foreign key to plus_ai_agent.id)
     */
    agentId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Update time
     */
    updatedAt?: string;
    /**
     * channelId字段
     * Java类型: java.lang.String
     * 描述: Channel ID
     */
    channelId?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Message ID
     */
    id?: string|number;
    /**
     * sendAt字段
     * Java类型: java.time.Instant
     * 描述: Message send time
     */
    sendAt?: string;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: Knowledge base ID (foreign key to plus_ai_knowledge_base.id)
     */
    knowledgeBaseId?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Specific model name/identifier (e.g., "gpt-4", "claude-3-opus")
     */
    model?: string;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: Chat options (temperature, top_p, etc.) stored as JSON
     */
    chatOptions?: ChatOptions;
    /**
     * parentMessageId字段
     * Java类型: java.lang.Long
     * 描述: Parent message ID (for threaded conversations)
     */
    parentMessageId?: string|number;
    /**
     * temperature字段
     * Java类型: java.lang.Float
     * 描述: Temperature setting used for this message
     */
    temperature?: string|number;
    /**
     * datasourceId字段
     * Java类型: java.lang.Long
     * 描述: Datasource ID
     */
    datasourceId?: string|number;
    /**
     * channelMsgSeq字段
     * Java类型: java.lang.Long
     * 描述: Channel message sequence
     */
    channelMsgSeq?: string|number;
    /**
     * children字段
     * Java类型: java.util.List
     * 描述: Child messages (replies to this message)
     */
    children?: Array<ChatMessageResponse>;
    /**
     * channelMsgId字段
     * Java类型: java.lang.String
     * 描述: Channel message ID
     */
    channelMsgId?: string;
    /**
     * channelClientMsgId字段
     * Java类型: java.lang.String
     * 描述: Channel client message ID
     */
    channelClientMsgId?: string;
    /**
     * receiverId字段
     * Java类型: java.lang.Long
     * 描述: Receiver ID
     */
    receiverId?: string|number;
    /**
     * isError字段
     * Java类型: java.lang.Boolean
     * 描述: Error flag (true if message represents an error)
     */
    isError?: boolean;
    /**
     * senderId字段
     * Java类型: java.lang.Long
     * 描述: Sender ID
     */
    senderId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation time
     */
    createdAt?: string;
    /**
     * usedRag字段
     * Java类型: java.lang.Boolean
     * 描述: Flag indicating if this message was generated with RAG (Retrieval Augmented Generation)
     */
    usedRag?: boolean;
    /**
     * processingTime字段
     * Java类型: java.lang.Long
     * 描述: Processing time in milliseconds (for performance tracking)
     */
    processingTime?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User identifier (foreign key to plus_user.id)
     */
    userId?: string|number;
    /**
     * readAt字段
     * Java类型: java.time.Instant
     * 描述: Message read time
     */
    readAt?: string;
    /**
     * tokenCount字段
     * Java类型: java.lang.Integer
     * 描述: Token count (for billing/usage tracking)
     */
    tokenCount?: number;
    /**
     * errorMessage字段
     * Java类型: java.lang.String
     * 描述: Error message (if message represents an error)
     */
    errorMessage?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: Conversation ID (foreign key to plus_ai_conversation.id)
     */
    conversationId?: string|number;
    /**
     * receiver字段
     * Java类型: com.sdkwork.spring.ai.plus.im.Participant
     * 描述: Receiver participant information
     */
    receiver?: Participant;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageStatus
     * 描述: Message status (sent, delivered, read, failed)
     */
    status?: MessageStatus;
    /**
     * sender字段
     * Java类型: com.sdkwork.spring.ai.plus.im.Participant
     * 描述: Sender participant information
     */
    sender?: Participant;
    /**
     * conversationUuid字段
     * Java类型: java.lang.String
     * 描述: Conversation UUID (foreign key to plus_ai_conversation.uuid)
     */
    conversationUuid?: string;
    /**
     * conversationType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.PlusConversationType
     * 描述: Conversation type
     */
    conversationType?: ConversationType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatMessageContentResponse
 * 描述: 聊天消息内容VO
 */
export interface ChatMessageContentResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     * 示例: 1
     */
    id?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     * 示例: 2024-05-20T15:00:00
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageStatus
     * 描述: 消息状态（已发送/已送达/已读/失败）
     * 示例: SENT
     */
    status?: MessageStatus;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     * 示例: 2024-05-20T14:30:00
     */
    createdAt?: string;
    /**
     * conversationUuid字段
     * Java类型: java.lang.String
     * 描述: 会话UUID（关联plus_ai_conversation.uuid）
     * 示例: 550e8400-e29b-41d4-a716-446655440000
     */
    conversationUuid?: string;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.MessageBody
     * 描述: 消息内容（文本）
     * 示例: Hello, how can I help you?
     */
    content?: MessageBody;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     * 示例: 550e8400-e29b-41d4-a716-446655440000
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.Long
     * 描述: 版本号（用于乐观锁控制）
     * 示例: 0
     */
    version?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.im.type.MessageType
     * 描述: 消息类型（文本/图片/文件）
     * 示例: TEXT
     */
    type?: MessageType;
    /**
     * agentBizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent业务类型（如翻译/客服/写作等）
     * 示例: TRANSLATION
     */
    agentBizType?: AgentBizType;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.MessageRole
     * 描述: 消息角色（用户/助手/系统/函数）
     * 示例: USER
     */
    role?: MessageRole;
    /**
     * agentType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent类型（1:聊天/2:工具/3:自定义）
     * 示例: CHAT
     */
    agentType?: AgentType;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID（关联plus_ai_agent.id）
     * 示例: 456
     */
    agentId?: string|number;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 消息元数据（JSON格式，存储额外信息）
     * 示例: {"source":"web","device":"desktop"}
     */
    metadata?: Map<string, Object>;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 会话ID（关联plus_ai_conversation.id）
     * 示例: 123
     */
    conversationId?: string|number;
}
