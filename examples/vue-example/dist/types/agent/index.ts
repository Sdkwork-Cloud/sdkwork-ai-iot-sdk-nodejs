import { MemoryProfileType } from '../../enums/memory';
import { AgentType, AgentBizType, AgentStatus } from '../../enums/agent';
import { MediaResourceType } from '../../enums/resource';
import { PlatformOwner, DataScope } from '../../enums/enums';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { ChannelProviderEnum } from '../../enums/core.type';
import { BaseParam } from '../../types/base';
import { QueryListParam } from '../../types/common';
import { AgentMemoryConfig, AgentKnowledgeConfig, AgentToolConfig, AgentBaseConfig, TeamAgentMembers } from '../../types/agent.config';
import { ImageMediaResource, VideoMediaResource } from '../../types/resource';
import { TagsContent } from '../../types/tags';
import { ChatOptions } from '../../types/chat';
import { SpeechConfig } from '../../types/audio';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiAgentParam
 * 描述: AI Agent Form (Represents an AI model agent with configuration and associations)
 */
export interface AiAgentParam extends BaseParam {
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: Agent icon URL/path (e.g., "https://example.com/icon.png")
     */
    icon?: string;
    /**
     * memoryConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentMemoryConfig
     * 描述: Memory Config
     */
    memoryConfig?: AgentMemoryConfig;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Agent description (detailed functionality explanation)
     */
    description?: string;
    /**
     * knowledgeConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentKnowledgeConfig
     * 描述: Knowledge Config
     */
    knowledgeConfig?: AgentKnowledgeConfig;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: Owner ID
     */
    ownerId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent type (1: Chat, 2: Tool, 3: Custom)
     */
    type?: AgentType;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: Agent face image
     */
    faceImage?: ImageMediaResource;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Agent tags (comma-separated, e.g., "chat,tool,ai")
     */
    tags?: TagsContent;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     * 描述: Owner type
     */
    owner?: PlatformOwner;
    /**
     * toolConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentToolConfig
     * 描述: Tool Config
     */
    toolConfig?: AgentToolConfig;
    /**
     * bizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent business type (e.g., TRANSLATION, CUSTOMER_SERVICE, WRITER, etc.)
     */
    bizType?: AgentBizType;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Agent name (unique identifier)
     */
    name?: string;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: Chat options (temperature, top_p, etc.) stored as JSON
     */
    chatOptions?: ChatOptions;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: Agent face video
     */
    faceVideo?: VideoMediaResource;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: Knowledge base ID (foreign key to plus_knowledge_base_info.id)
     */
    knowledgeBaseId?: string|number;
    /**
     * config字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentBaseConfig
     * 描述: Agent configuration (welcome message, suggested questions, etc.) stored as JSON
     */
    config?: AgentBaseConfig;
    /**
     * channelId字段
     * Java类型: java.lang.String
     * 描述: External channel ID
     */
    channelId?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.agent.AgentStatus
     * 描述: Agent status (1: Enabled, 2: Disabled, 3: Deleted)
     */
    status?: AgentStatus;
    /**
     * baseConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentBaseConfig
     * 描述: Base Config
     */
    baseConfig?: AgentBaseConfig;
    /**
     * speechConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechConfig
     * 描述: Speech Config
     */
    speechConfig?: SpeechConfig;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: Service provider
     */
    provider?: ChannelProviderEnum;
    /**
     * members字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.TeamAgentMembers
     * 描述: Team members config
     */
    members?: TeamAgentMembers;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiAgentQueryListParam
 */
export interface AiAgentQueryListParam extends QueryListParam {
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
     * Java类型: com.sdkwork.spring.ai.plus.enums.agent.AgentStatus
     */
    status?: AgentStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiAgentToolParam
 * 描述: PlusAiAgent 和 PlusAiTool 关联表Form类，用于维护AI智能体与工具之间的多对多关联关系
 */
export interface AiAgentToolParam extends BaseParam {
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI智能体ID
     */
    agentId?: string|number;
    /**
     * toolId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI工具ID
     */
    toolId?: string|number;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 工具在智能体中的排序序号
     */
    sortOrder?: number;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 工具是否默认启用(true:启用,false:禁用)
     */
    enabled?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Agent
 */
export interface Agent {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiAgentToolResponse
 * 描述: AI智能体与工具关联关系VO类，用于维护AI智能体与工具之间的多对多关联关系
 */
export interface AiAgentToolResponse extends BaseResponse {
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * toolName字段
     * Java类型: java.lang.String
     * 描述: AI工具名称
     */
    toolName?: string;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 工具是否默认启用(true:启用,false:禁用)
     */
    enabled?: boolean;
    /**
     * agentName字段
     * Java类型: java.lang.String
     * 描述: AI智能体名称
     */
    agentName?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 工具在智能体中的排序序号
     */
    sortOrder?: number;
    /**
     * toolId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI工具ID
     */
    toolId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI智能体ID
     */
    agentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiAgentResponse
 * 描述: AI Agent Value Object (Represents an AI model agent with configuration and associations)
 */
export interface AiAgentResponse extends BaseResponse {
    /**
     * usageCount字段
     * Java类型: java.lang.Integer
     * 描述: Usage count
     */
    usageCount?: number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Agent tags (comma-separated, e.g., "chat,tool,ai")
     */
    tags?: TagsContent;
    /**
     * memoryConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentMemoryConfig
     * 描述: Memory Config
     */
    memoryConfig?: AgentMemoryConfig;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     * 描述: Owner type
     */
    owner?: PlatformOwner;
    /**
     * toolConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentToolConfig
     * 描述: Tool Config
     */
    toolConfig?: AgentToolConfig;
    /**
     * config字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentBaseConfig
     * 描述: Agent configuration (welcome message, suggested questions, etc.)
     */
    config?: AgentBaseConfig;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Category ID (foreign key to plus_ai_agent_category.id)
     */
    categoryId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.agent.AgentStatus
     * 描述: Agent status (1: Enabled, 2: Disabled, 3: Deleted)
     */
    status?: AgentStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Agent name (unique identifier)
     */
    name?: string;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: Agent face video
     */
    faceVideo?: VideoMediaResource;
    /**
     * promptId字段
     * Java类型: java.lang.Long
     * 描述: Prompt ID (foreign key to plus_ai_prompt.id)
     */
    promptId?: string|number;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: Owner ID
     */
    ownerId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     * 描述: Agent type (1: Chat, 2: Tool, 3: Custom)
     */
    type?: AgentType;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: Agent face image
     */
    faceImage?: ImageMediaResource;
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: Agent icon URL/path (e.g., "https://example.com/icon.png")
     */
    icon?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Agent description (detailed functionality explanation)
     */
    description?: string;
    /**
     * knowledgeConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentKnowledgeConfig
     * 描述: Knowledge Config
     */
    knowledgeConfig?: AgentKnowledgeConfig;
    /**
     * bizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     * 描述: Agent business type (e.g., TRANSLATION, CUSTOMER_SERVICE, WRITER, etc.)
     */
    bizType?: AgentBizType;
    /**
     * channelId字段
     * Java类型: java.lang.String
     * 描述: External channel ID
     */
    channelId?: string;
    /**
     * baseConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentBaseConfig
     * 描述: Base Config
     */
    baseConfig?: AgentBaseConfig;
    /**
     * chatOptions字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     * 描述: Chat options (temperature, top_p, etc.)
     */
    chatOptions?: ChatOptions;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Agent ID
     */
    id?: string|number;
    /**
     * knowledgeBaseId字段
     * Java类型: java.lang.Long
     * 描述: Knowledge base ID (foreign key to plus_knowledge_base_info.id)
     */
    knowledgeBaseId?: string|number;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: Service provider
     */
    provider?: ChannelProviderEnum;
    /**
     * members字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.TeamAgentMembers
     * 描述: Team members config
     */
    members?: TeamAgentMembers;
    /**
     * speechConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechConfig
     * 描述: Speech Config
     */
    speechConfig?: SpeechConfig;
}
