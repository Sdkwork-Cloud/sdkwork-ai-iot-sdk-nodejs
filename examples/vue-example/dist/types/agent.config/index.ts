import { MemoryProfileType } from '../../enums/memory';
import { AgentType, AgentBizType } from '../../enums/agent';
import { BaseObject } from '../../types/base';
import { MemoryProfile } from '../../types/memory';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UseTool
 */
export interface UseTool {
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * enable字段
     * Java类型: boolean
     */
    enable?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentToolConfig
 */
export interface AgentToolConfig extends BaseObject {
    /**
     * tools字段
     * Java类型: java.util.List
     */
    tools?: Array<UseTool>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentMemoryConfig
 */
export interface AgentMemoryConfig extends BaseObject {
    /**
     * profile字段
     * Java类型: com.sdkwork.spring.ai.plus.memory.MemoryProfile
     */
    profile?: MemoryProfile;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentKnowledgeItem
 */
export interface AgentKnowledgeItem extends BaseObject {
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentKnowledgeConfig
 */
export interface AgentKnowledgeConfig extends BaseObject {
    /**
     * list字段
     * Java类型: java.util.List
     */
    list?: Array<AgentKnowledgeItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AgentBaseConfig
 * 描述: Configuration for AI agent behavior and settings
 */
export interface AgentBaseConfig {
    /**
     * questions字段
     * Java类型: java.util.List
     * 描述: List of suggested questions that users can ask the agent
     */
    questions?: Array<string>;
    /**
     * enableMemory字段
     * Java类型: java.lang.Boolean
     * 描述: Enable conversation memory functionality
     */
    enableMemory?: boolean;
    /**
     * saveFiles字段
     * Java类型: java.lang.Boolean
     * 描述: Enable conversation memory functionality
     */
    saveFiles?: boolean;
    /**
     * properties字段
     * Java类型: java.util.Map
     * 描述: properties as key-value pairs
     */
    properties?: Map<string, Object>;
    /**
     * useKnowledgeBase字段
     * Java类型: java.lang.Boolean
     * 描述: Whether to use knowledge base for answering questions
     */
    useKnowledgeBase?: boolean;
    /**
     * welcome字段
     * Java类型: java.lang.String
     * 描述: Welcome message displayed when a user starts a conversation
     * 示例: Hello! How can I assist you today?
     */
    welcome?: string;
    /**
     * maxHistoryMessages字段
     * Java类型: java.lang.Integer
     * 描述: Maximum number of messages to keep in conversation history
     * 示例: 10
     */
    maxHistoryMessages?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TeamAgentMembers
 */
export interface TeamAgentMembers extends BaseObject {
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentType
     */
    type?: AgentType;
    /**
     * agents字段
     * Java类型: [Lcom.sdkwork.spring.ai.plus.agent.config.TeamAgentMembers;
     */
    agents?: TeamAgentMembers[];
    /**
     * bizType字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.AgentBizType
     */
    bizType?: AgentBizType;
}
