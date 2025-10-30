 import { ChatContext } from 'sdkwork-sdk-api-typescript'
import { buildUUID } from '../../../utils/uuid'

/**
 * 创建聊天上下文
 * @param options - 可选的上下文配置
 * @returns 完整的聊天上下文对象
 */
export function createChatContext(options?: Partial<ChatContext>): ChatContext {
    // 获取当前用户信息（如果有的话）
    const currentUser = getCurrentUser()
    
    // 基础上下文
    const baseContext: ChatContext = {
        // 生成会话ID和UUID
        conversation_id: options?.conversation_id || generateConversationId(),
        conversation_uuid: options?.conversation_uuid || buildUUID(),
        
        // 用户信息
        user_id: options?.user_id || currentUser?.id,
        
        // 业务相关ID
        knowledge_base_id: options?.knowledge_base_id,
        agent_id: options?.agent_id,
        flow_id: options?.flow_id,
        datasource_id: options?.datasource_id,
        
        // 意图和会话管理
        indent: options?.indent,
        parent_message_id: options?.parent_message_id,
        
        // 音频设置
        save_audio: options?.save_audio !== undefined ? options.save_audio : true
    }
    
    // 合并用户提供的选项
    return {
        ...baseContext,
        ...options
    }
}

/**
 * 生成会话ID
 * @returns 格式化的会话ID
 */
function generateConversationId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `conv_${timestamp}_${random}`
}

/**
 * 获取当前用户信息
 * @returns 当前用户信息或null
 */
function getCurrentUser(): { id?: number } | null {
    try {
        // 尝试从localStorage获取用户信息
        if (typeof window !== 'undefined' && window.localStorage) {
            const userStr = localStorage.getItem('currentUser')
            if (userStr) {
                const user = JSON.parse(userStr)
                return { id: user.id }
            }
        }
        
        // 尝试从Vuex/Pinia store获取
        if (typeof window !== 'undefined' && (window as any).$store) {
            const store = (window as any).$store
            if (store.state?.auth?.currentUser) {
                return { id: store.state.auth.currentUser.id }
            }
        }
    } catch (error) {
        console.warn('获取用户信息失败:', error)
    }
    
    return null
}

/**
 * 创建默认的聊天上下文（用于新会话）
 * @returns 默认的聊天上下文
 */
export function createDefaultChatContext(): ChatContext {
    return createChatContext({
        conversation_id: generateConversationId(),
        conversation_uuid: buildUUID(),
        save_audio: true
    })
}

/**
 * 创建基于现有会话的聊天上下文
 * @param conversationId - 现有会话ID
 * @param parentMessageId - 父消息ID
 * @returns 基于现有会话的聊天上下文
 */
export function createConversationContext(
    conversationId: string,
    parentMessageId?: number
): ChatContext {
    return createChatContext({
        conversation_id: conversationId,
        parent_message_id: parentMessageId
    })
}

/**
 * 创建知识库聊天上下文
 * @param knowledgeBaseId - 知识库ID
 * @param options - 其他选项
 * @returns 知识库聊天上下文
 */
export function createKnowledgeBaseContext(
    knowledgeBaseId: number,
    options?: Partial<ChatContext>
): ChatContext {
    return createChatContext({
        knowledge_base_id: knowledgeBaseId,
        ...options
    })
}

/**
 * 创建AI代理聊天上下文
 * @param agentId - AI代理ID
 * @param options - 其他选项
 * @returns AI代理聊天上下文
 */
export function createAgentContext(
    agentId: number,
    options?: Partial<ChatContext>
): ChatContext {
    return createChatContext({
        agent_id: agentId,
        ...options
    })
}

/**
 * 验证聊天上下文是否有效
 * @param context - 要验证的聊天上下文
 * @returns 验证结果
 */
export function validateChatContext(context: ChatContext): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []
    
    // 检查必需字段
    if (!context.conversation_id && !context.conversation_uuid) {
        errors.push('会话ID或会话UUID必须至少提供一个')
    }
     
    
    // 检查其他ID格式
    const idFields = ['knowledge_base_id', 'agent_id', 'flow_id', 'datasource_id', 'parent_message_id']
    idFields.forEach(field => {
        const value = (context as any)[field]
        if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
            errors.push(`${field}必须是正整数`)
        }
    })
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 合并多个聊天上下文
 * @param contexts - 要合并的上下文数组
 * @returns 合并后的聊天上下文
 */
export function mergeChatContexts(contexts: ChatContext[]): ChatContext {
    if (contexts.length === 0) {
        return createDefaultChatContext()
    }
    
    return contexts.reduce((merged, current) => {
        return {
            ...merged,
            ...current,
            // 对于ID字段，优先使用非空值
            conversation_id: current.conversation_id || merged.conversation_id,
            conversation_uuid: current.conversation_uuid || merged.conversation_uuid,
            user_id: current.user_id || merged.user_id
        }
    }, {} as ChatContext)
}