import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { ConversationStatus } from '../../enums/ai';
import { ConversationType } from '../../enums/conversation';
import { AgentBizType, AgentType } from '../../enums/agent';
import { BaseParam } from '../../types/base';
import { QueryListParam } from '../../types/common';
import { ChatOptions } from '../../types/chat';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MessageFeedbackParam
 * 描述: AI Conversation Form - 用于创建或更新用户与AI代理之间的对话会话
 */
export interface MessageFeedbackParam extends BaseParam {
    /**
     * rating字段
     * Java类型: java.lang.String
     * 描述: 反馈内容
     * 示例: values:up,down
     */
    rating?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 消息ID
     */
    id?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.String
     * 描述: 会话ID
     */
    conversationId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ConversationOpenParam
 * 描述: AI Conversation Form - 用于创建或更新用户与AI代理之间的对话会话
 */
export interface ConversationOpenParam extends BaseParam {
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID(外键关联plus_ai_agent.id)
     */
    agentId?: string|number;
    /**
     * dataSourceId字段
     * Java类型: java.lang.Long
     * 描述: 数据源ID(外键关联plus_data_source_info.id)
     */
    dataSourceId?: string|number;
    /**
     * conversationId字段
     * Java类型: java.lang.String
     */
    conversationId?: string;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: 聊天选项(temperature, top_p等)
     */
    chatOptions?: ChatOptions;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: 知识库ID(外键关联plus_knowledge_base_info.id)
     */
    knowledgeBaseId?: string|number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 会话标题
     */
    title?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 会话UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ConversationQueryListParam
 * 描述: AI Conversation Query List Form - 用于查询用户与AI代理之间的对话会话列表
 */
export interface ConversationQueryListParam extends QueryListParam {
    /**
     * initDefaults字段
     * Java类型: java.lang.Boolean
     * 描述: 是否初始化默认对话（当查询结果为空时，是否自动创建默认对话会话）
     * 示例: false
     */
    initDefaults?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ConversationParam
 * 描述: AI Conversation Form - 用于创建或更新用户与AI代理之间的对话会话
 */
export interface ConversationParam extends BaseParam {
    /**
     * modelId字段
     * Java类型: java.lang.Long
     * 描述: 模型ID(外键关联plus_ai_model_info.id)
     */
    modelId?: string|number;
    /**
     * systemContext字段
     * Java类型: java.lang.String
     * 描述: 系统上下文/参数(JSON格式)
     */
    systemContext?: string;
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: 内容摘要(会话的简要概述)
     */
    summary?: string;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID(外键关联plus_ai_agent.id)
     */
    agentId?: string|number;
    /**
     * pinned字段
     * Java类型: java.lang.Boolean
     * 描述: 是否置顶会话
     */
    pinned?: boolean;
    /**
     * messageCount字段
     * Java类型: java.lang.Integer
     * 描述: 消息数量
     */
    messageCount?: number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 会话标题
     */
    title?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 会话UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 会话标签(逗号分隔，如"重要,工作,项目")
     */
    tags?: TagsContent;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 会话描述(可选)
     */
    description?: string;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 会话的排序顺序，值越大越靠前
     */
    sortOrder?: number;
    /**
     * lastInteractionTime字段
     * Java类型: java.time.Instant
     * 描述: 最后交互时间
     */
    lastInteractionTime?: string;
    /**
     * dataSourceId字段
     * Java类型: java.lang.Long
     * 描述: 数据源ID(外键关联plus_data_source_info.id)
     */
    dataSourceId?: string|number;
    /**
     * userContext字段
     * Java类型: java.lang.String
     * 描述: 用户上下文/参数(JSON格式)
     */
    userContext?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.ConversationStatus
     * 描述: 会话状态(1:活跃,2:已完成,3:已归档,4:已删除)
     */
    status?: ConversationStatus;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 具体模型名称/标识(如"gpt-4","claude-3-opus")
     */
    model?: string;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: 聊天选项(temperature, top_p等)
     */
    chatOptions?: ChatOptions;
    /**
     * lastMessageId字段
     * Java类型: java.lang.Long
     * 描述: 最后一条消息ID(外键关联plus_chat_message.id)
     */
    lastMessageId?: string|number;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: 知识库ID(外键关联plus_knowledge_base_info.id)
     */
    knowledgeBaseId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ConversationResponse
 * 描述: AI Conversation Value Object - Represents a conversation session between a user and an AI agent
 */
export interface ConversationResponse extends BaseResponse {
    /**
     * scene字段
     * Java类型: java.lang.String
     * 描述: Chat scene
     */
    scene?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: Conversation title
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.conversation.PlusConversationType
     * 描述: Conversation type (1: Chat, 2: C2C, 3: Group, 99: KF)
     */
    type?: ConversationType;
    /**
     * agentBizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent business type (e.g., TRANSLATION, CUSTOMER_SERVICE, WRITER, etc.)
     */
    agentBizType?: AgentBizType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Conversation UUID
     */
    uuid?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Conversation description (optional)
     */
    description?: string;
    /**
     * unreadCount字段
     * Java类型: java.lang.Integer
     * 描述: Unread message count
     */
    unreadCount?: number;
    /**
     * modelId字段
     * Java类型: java.lang.Long
     * 描述: Model ID (foreign key to plus_ai_model_info.id)
     */
    modelId?: string|number;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID (foreign key to plus_ai_agent.id)
     */
    agentId?: string|number;
    /**
     * pinned字段
     * Java类型: java.lang.Boolean
     * 描述: Whether the conversation is pinned to the top of the conversation list
     */
    pinned?: boolean;
    /**
     * agentType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent type (1: Chat, 2: Tool, 3: Custom)
     */
    agentType?: AgentType;
    /**
     * messageCount字段
     * Java类型: java.lang.Integer
     * 描述: Message count in this conversation
     */
    messageCount?: number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * userContext字段
     * Java类型: java.lang.String
     * 描述: User context/parameters for the conversation (JSON format)
     */
    userContext?: string;
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
     * id字段
     * Java类型: java.lang.Long
     * 描述: Conversation ID
     */
    id?: string|number;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: Knowledge base ID (foreign key to plus_knowledge_base_info.id)
     */
    knowledgeBaseId?: string|number;
    /**
     * lastInteractionTime字段
     * Java类型: java.time.Instant
     * 描述: Last interaction time
     */
    lastInteractionTime?: string;
    /**
     * dataSourceId字段
     * Java类型: java.lang.Long
     * 描述: Data source ID (foreign key to plus_data_source_info.id)
     */
    dataSourceId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Conversation tags (comma-separated, e.g., "important,work,project")
     */
    tags?: TagsContent;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User identifier (foreign key to plus_user.id)
     */
    userId?: string|number;
    /**
     * systemContext字段
     * Java类型: java.lang.String
     * 描述: System context/parameters for the conversation (JSON format)
     */
    systemContext?: string;
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: Content summary (brief overview of the conversation)
     */
    summary?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.ConversationStatus
     * 描述: Conversation status (1: Active, 2: Completed, 3: Archived, 4: Deleted)
     */
    status?: ConversationStatus;
    /**
     * lastMessageId字段
     * Java类型: java.lang.Long
     * 描述: Last message ID (foreign key to plus_chat_message.id)
     */
    lastMessageId?: string|number;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: The order of conversations, higher values appear first
     */
    sortOrder?: number;
}
