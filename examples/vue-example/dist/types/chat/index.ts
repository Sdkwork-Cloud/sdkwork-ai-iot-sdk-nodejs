import { MessageChannelProvider } from '../../enums/core.type';
import { Platform, PlatformOwner } from '../../enums/enums';
import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
import { ChatCompletionRole } from '../../enums/chat';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { BaseObject } from '../../types/base';
import { ChatResponseHandler } from '../../types/response';
import { ShardingContext } from '../../types/sharding';
import { Agent } from '../../types/agent';
import { MsgPayload } from '../../types/im.payload';
import { Function, FunctionTool, ResponseFormat, WebSearchOptions, AudioParameters } from '../../types/openai.api';
import { ToolCallback } from '../../types/tool';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionParam
 * 描述: 聊天补全创建请求参数
 */
export interface ChatCompletionParam {
    /**
     * n字段
     * Java类型: java.lang.Integer
     * 描述: 生成的聊天补全选项数量
     * 示例: 1
     */
    n?: number;
    /**
     * tool字段
     * Java类型: java.lang.String
     * 描述: 要使用的工具名称
     */
    tool?: string;
    /**
     * top_p字段
     * Java类型: java.lang.Double
     * 描述: 核采样参数，替代温度采样
     * 示例: 1
     */
    top_p?: string|number;
    /**
     * response_format字段
     * Java类型: java.lang.Boolean
     * 描述: 是否返回JSON格式响应
     * 示例: false
     */
    response_format?: boolean;
    /**
     * stop字段
     * Java类型: java.util.List
     * 描述: 停止序列，最多4个，遇到时停止生成
     */
    stop?: Array<string>;
    /**
     * stream字段
     * Java类型: java.lang.Boolean
     * 描述: 是否流式返回部分进度
     * 示例: false
     */
    stream?: boolean;
    /**
     * presence_penalty字段
     * Java类型: java.lang.Double
     * 描述: 存在惩罚，控制新主题引入
     */
    presence_penalty?: string|number;
    /**
     * frequency_penalty字段
     * Java类型: java.lang.Double
     * 描述: 频率惩罚，减少重复内容
     */
    frequency_penalty?: string|number;
    /**
     * user字段
     * Java类型: java.lang.String
     * 描述: 最终用户的唯一标识符
     * 示例: user-123
     */
    user?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 要使用的模型ID
     * 示例: gpt-4
     */
    model?: string;
    /**
     * logit_bias字段
     * Java类型: java.util.Map
     * 描述: 修改指定token出现的可能性
     */
    logit_bias?: Map<string, number>;
    /**
     * chat_context字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.ChatContext
     * 描述: 聊天上下文
     */
    chat_context?: ChatContext;
    /**
     * temperature字段
     * Java类型: java.lang.Double
     * 描述: 采样温度，控制输出随机性
     * 示例: 1.0
     */
    temperature?: string|number;
    /**
     * max_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 生成的最大token数
     * 示例: 2048
     */
    max_tokens?: number;
    /**
     * messages字段
     * Java类型: java.util.List
     * 描述: 用于生成聊天补全的消息列表
     */
    messages?: Array<ChatCompletionMessage>;
    /**
     * system_fingerprint字段
     * Java类型: java.lang.String
     * 描述: 模型的系统指纹
     */
    system_fingerprint?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionChunkChoice
 * 描述: 流式聊天完成响应中的选项对象，包含模型生成的响应内容块
 */
export interface ChatCompletionChunkChoice extends BaseObject {
    /**
     * index字段
     * Java类型: java.lang.Integer
     * 描述: 选项索引
     */
    index?: number;
    /**
     * delta字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionChunkDelta
     * 描述: 模型生成的消息增量内容，客户端需要将所有chunk的delta拼接起来形成完整消息
     */
    delta?: ChatCompletionChunkDelta;
    /**
     * finish_reason字段
     * Java类型: java.lang.String
     * 描述: 完成原因，可能的值："stop"（正常停止）、"length"（达到长度限制）、"function_call"（需要调用函数）等，在流式响应中只有最后一个chunk会包含非null的完成原因
     */
    finish_reason?: string;
    /**
     * logprobs字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.LogProbInfo
     * 描述: 日志概率信息（仅在请求时指定了logprobs参数时返回）
     */
    logprobs?: LogProbInfo;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatContext
 */
export interface ChatContext extends BaseObject {
    /**
     * indent字段
     * Java类型: java.lang.String
     */
    indent?: string;
    /**
     * conversation_id字段
     * Java类型: java.lang.String
     */
    conversation_id?: string;
    /**
     * agent_id字段
     * Java类型: java.lang.Long
     */
    agent_id?: string|number;
    /**
     * user_id字段
     * Java类型: java.lang.Long
     */
    user_id?: string|number;
    /**
     * save_audio字段
     * Java类型: java.lang.Boolean
     */
    save_audio?: boolean;
    /**
     * conversation_uuid字段
     * Java类型: java.lang.String
     */
    conversation_uuid?: string;
    /**
     * response_channels字段
     * Java类型: [Lcom.sdkwork.spring.ai.plus.core.type.MessageChannelProvider;
     */
    response_channels?: MessageChannelProvider[];
    /**
     * flow_id字段
     * Java类型: java.lang.Long
     */
    flow_id?: string|number;
    /**
     * datasource_id字段
     * Java类型: java.lang.Long
     */
    datasource_id?: string|number;
    /**
     * parent_message_id字段
     * Java类型: java.lang.Long
     */
    parent_message_id?: string|number;
    /**
     * sharding_context字段
     * Java类型: com.sdkwork.spring.ai.plus.sharding.ShardingContext
     */
    sharding_context?: ShardingContext;
    /**
     * chat_options字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions
     */
    chat_options?: ChatOptions;
    /**
     * knowledge_base_id字段
     * Java类型: java.lang.Long
     */
    knowledge_base_id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionChoice
 * 描述: 聊天完成响应中的选项对象
 */
export interface ChatCompletionChoice extends BaseObject {
    /**
     * message字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionMessage
     * 描述: 模型生成的消息
     */
    message?: ChatCompletionMessage;
    /**
     * logprobs字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.LogProbInfo
     * 描述: 日志概率信息（仅在请求时指定了logprobs参数时返回）
     */
    logprobs?: LogProbInfo;
    /**
     * finish_reason字段
     * Java类型: java.lang.String
     * 描述: 完成原因，可能的值："stop"（正常停止）、"length"（达到长度限制）、"function_call"（需要调用函数）等
     */
    finish_reason?: string;
    /**
     * index字段
     * Java类型: java.lang.Integer
     * 描述: 选项索引
     */
    index?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatState
 */
export interface ChatState extends BaseObject {
    /**
     * isThinking字段
     * Java类型: boolean
     */
    isThinking?: boolean;
    /**
     * content字段
     * Java类型: java.lang.String
     */
    content?: string;
    /**
     * reasoningContent字段
     * Java类型: java.lang.String
     */
    reasoningContent?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionChunk
 * 描述: 聊天完成Stream方式的响应对象，用于流式传输的聊天模型响应
 */
export interface ChatCompletionChunk extends BaseObject {
    /**
     * created字段
     * Java类型: java.lang.Long
     * 描述: 响应创建的时间戳（Unix时间，以秒为单位）
     */
    created?: string|number;
    /**
     * usage字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.CompletionUsage
     * 描述: 使用情况统计信息
     */
    usage?: CompletionUsage;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionMetadata
     * 描述: metadata
     */
    metadata?: ChatCompletionMetadata;
    /**
     * object字段
     * Java类型: java.lang.String
     * 描述: 对象类型，流式响应固定为"chat.completion.chunk"
     */
    object?: string;
    /**
     * choices字段
     * Java类型: java.util.List
     * 描述: 响应选项列表，包含当前chunk的增量内容
     */
    choices?: Array<ChatCompletionChunkChoice>;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 用于生成响应的模型名称
     */
    model?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 响应的唯一标识符，同一流式响应的所有chunk共享相同的id
     */
    id?: string;
    /**
     * system_fingerprint字段
     * Java类型: java.lang.String
     * 描述: 系统指纹，用于识别模型版本和配置
     */
    system_fingerprint?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GroupInfo
 */
export interface GroupInfo extends BaseObject {
    /**
     * created字段
     * Java类型: long
     */
    created?: string|number;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionMetadata
     */
    metadata?: ChatCompletionMetadata;
    /**
     * object字段
     * Java类型: java.lang.String
     */
    object?: string;
    /**
     * systemFingerprint字段
     * Java类型: java.lang.String
     */
    systemFingerprint?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     */
    model?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     */
    id?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionMessageToolCall
 * 描述: 工具调用对象，包含工具调用的唯一标识、类型和具体函数调用信息
 */
export interface ChatCompletionMessageToolCall extends BaseObject {
    /**
     * function字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.FunctionCall
     * 描述: 函数调用详情信息
     */
    function?: FunctionCall;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 工具调用的唯一标识符
     */
    id?: string;
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 工具类型，当前仅支持"function"
     */
    type?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CompletionTokensDetails
 */
export interface CompletionTokensDetails {
    /**
     * accepted_prediction_tokens字段
     * Java类型: java.lang.Integer
     */
    accepted_prediction_tokens?: number;
    /**
     * rejected_prediction_tokens字段
     * Java类型: java.lang.Integer
     */
    rejected_prediction_tokens?: number;
    /**
     * reasoning_tokens字段
     * Java类型: java.lang.Integer
     */
    reasoning_tokens?: number;
    /**
     * audio_tokens字段
     * Java类型: java.lang.Integer
     */
    audio_tokens?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PromptTokensDetails
 */
export interface PromptTokensDetails {
    /**
     * audio_tokens字段
     * Java类型: java.lang.Integer
     */
    audio_tokens?: number;
    /**
     * cached_tokens字段
     * Java类型: java.lang.Integer
     */
    cached_tokens?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MessageBody
 */
export interface MessageBody extends BaseObject {
    /**
     * thinkEnd字段
     * Java类型: java.lang.Long
     */
    thinkEnd?: string|number;
    /**
     * payload字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.MsgPayload
     */
    payload?: MsgPayload;
    /**
     * completion字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletion
     */
    completion?: ChatCompletion;
    /**
     * groupInfos字段
     * Java类型: java.util.Map
     */
    groupInfos?: Map<string, GroupInfo>;
    /**
     * id字段
     * Java类型: java.lang.String
     */
    id?: string;
    /**
     * thinkStart字段
     * Java类型: java.lang.Long
     */
    thinkStart?: string|number;
    /**
     * groups字段
     * Java类型: java.util.Map
     */
    groups?: Map<string, Array<ChatCompletionChunk>>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: LogProbInfo
 * 描述: 日志概率信息，包含生成文本的概率分布信息，仅在请求时指定了logprobs参数时返回
 */
export interface LogProbInfo extends BaseObject {
    /**
     * tokens字段
     * Java类型: java.util.List
     * 描述: 生成的token列表
     */
    tokens?: Array<string>;
    /**
     * token_logprobs字段
     * Java类型: java.util.List
     * 描述: 每个token的对数概率
     */
    token_logprobs?: Array<string|number>;
    /**
     * text_offset字段
     * Java类型: java.util.List
     * 描述: 每个token的字节偏移量
     */
    text_offset?: Array<number>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatOptions
 */
export interface ChatOptions {
    /**
     * logprobs字段
     * Java类型: java.lang.Boolean
     */
    logprobs?: boolean;
    /**
     * tools字段
     * Java类型: java.util.List
     */
    tools?: Array<FunctionTool>;
    /**
     * reasoning_effort字段
     * Java类型: java.lang.String
     */
    reasoning_effort?: string;
    /**
     * httpHeaders字段
     * Java类型: java.util.Map
     */
    httpHeaders?: Map<string, string>;
    /**
     * response_format字段
     * Java类型: org.springframework.ai.openai.api.ResponseFormat
     */
    response_format?: ResponseFormat;
    /**
     * modalities字段
     * Java类型: java.util.List
     */
    modalities?: Array<string>;
    /**
     * stream_options字段
     * Java类型: com.sdkwork.spring.ai.plus.chat.PlusChatOptions$StreamOptions
     */
    stream_options?: StreamOptions;
    /**
     * seed字段
     * Java类型: java.lang.Integer
     */
    seed?: number;
    /**
     * metadata字段
     * Java类型: java.util.Map
     */
    metadata?: Map<string, string>;
    /**
     * parallel_tool_calls字段
     * Java类型: java.lang.Boolean
     */
    parallel_tool_calls?: boolean;
    /**
     * web_search_options字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$WebSearchOptions
     */
    web_search_options?: WebSearchOptions;
    /**
     * frequency_penalty字段
     * Java类型: java.lang.Double
     */
    frequency_penalty?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     */
    model?: string;
    /**
     * logit_bias字段
     * Java类型: java.util.Map
     */
    logit_bias?: Map<string, number>;
    /**
     * max_tokens字段
     * Java类型: java.lang.Integer
     */
    max_tokens?: number;
    /**
     * temperature字段
     * Java类型: java.lang.Double
     */
    temperature?: string|number;
    /**
     * top_logprobs字段
     * Java类型: java.lang.Integer
     */
    top_logprobs?: number;
    /**
     * stream字段
     * Java类型: java.lang.Boolean
     */
    stream?: boolean;
    /**
     * toolCallbacks字段
     * Java类型: java.util.List
     */
    toolCallbacks?: Array<ToolCallback>;
    /**
     * presence_penalty字段
     * Java类型: java.lang.Double
     */
    presence_penalty?: string|number;
    /**
     * n字段
     * Java类型: java.lang.Integer
     */
    n?: number;
    /**
     * internalToolExecutionEnabled字段
     * Java类型: java.lang.Boolean
     */
    internalToolExecutionEnabled?: boolean;
    /**
     * top_p字段
     * Java类型: java.lang.Double
     */
    top_p?: string|number;
    /**
     * toolNames字段
     * Java类型: java.util.Set
     */
    toolNames?: Array<string>;
    /**
     * store字段
     * Java类型: java.lang.Boolean
     */
    store?: boolean;
    /**
     * max_completion_tokens字段
     * Java类型: java.lang.Integer
     */
    max_completion_tokens?: number;
    /**
     * toolContext字段
     * Java类型: java.util.Map
     */
    toolContext?: Map<string, Object>;
    /**
     * audio字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$AudioParameters
     */
    audio?: AudioParameters;
    /**
     * tool_choice字段
     * Java类型: java.lang.Object
     */
    tool_choice?: Object;
    /**
     * verbosity字段
     * Java类型: java.lang.String
     */
    verbosity?: string;
    /**
     * user字段
     * Java类型: java.lang.String
     */
    user?: string;
    /**
     * stop字段
     * Java类型: java.util.List
     */
    stop?: Array<string>;
    /**
     * enableSentenceSplitting字段
     * Java类型: java.lang.Boolean
     */
    enableSentenceSplitting?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionMessage
 * 描述: 聊天消息对象，包含消息的角色、内容和工具调用信息
 */
export interface ChatCompletionMessage extends BaseObject {
    /**
     * audio字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionAudio
     * 描述: 音频消息
     */
    audio?: ChatCompletionAudio;
    /**
     * tool_calls字段
     * Java类型: java.util.List
     * 描述: 工具调用列表，仅当role为"assistant"且需要调用工具时存在
     */
    tool_calls?: Array<ChatCompletionMessageToolCall>;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 消息内容，对于工具/函数返回结果消息，content为对应的返回结果
     */
    content?: string;
    /**
     * role字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionRole
     * 描述: 消息发送者角色，可能的值："system"（系统消息）、"user"（用户消息）、"assistant"（助手消息）、"function"（函数返回结果消息）、"tool"（工具返回结果消息）
     */
    role?: ChatCompletionRole;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletion
 * 描述: 大模型的聊天完成响应结果
 */
export interface ChatCompletion extends BaseObject {
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionMetadata
     * 描述: metadata
     */
    metadata?: ChatCompletionMetadata;
    /**
     * created字段
     * Java类型: long
     * 描述: 响应创建的时间戳（Unix时间，以秒为单位）
     */
    created?: string|number;
    /**
     * usage字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.CompletionUsage
     * 描述: 使用统计信息
     */
    usage?: CompletionUsage;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 用于生成响应的模型名称
     */
    model?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 响应的唯一标识符
     */
    id?: string;
    /**
     * system_fingerprint字段
     * Java类型: java.lang.String
     * 描述: 系统指纹，用于识别模型版本和配置
     */
    system_fingerprint?: string;
    /**
     * object字段
     * Java类型: java.lang.String
     * 描述: 对象类型，通常为"chat.completion"
     */
    object?: string;
    /**
     * choices字段
     * Java类型: java.util.List
     * 描述: 响应选项列表
     */
    choices?: Array<ChatCompletionChoice>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: StreamOptions
 */
export interface StreamOptions {
    /**
     * include_usage字段
     * Java类型: java.lang.Boolean
     */
    include_usage?: boolean;
    /**
     * chunk_include_usage 字段
     * Java类型: java.lang.Boolean
     */
    chunk_include_usage ?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionAudio
 */
export interface ChatCompletionAudio extends BaseObject {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FunctionCall
 * 描述: 函数调用信息，当模型决定需要调用工具函数时返回
 */
export interface FunctionCall extends BaseObject {
    /**
     * arguments字段
     * Java类型: java.util.Map
     * 描述: 函数参数，键值对形式
     */
    arguments?: Map<string, Object>;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 要调用的函数名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CompletionUsage
 * 描述: 完成响应的使用统计信息，包含token使用情况
 */
export interface CompletionUsage extends BaseObject {
    /**
     * prompt_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 提示词使用的token数量
     */
    prompt_tokens?: number;
    /**
     * prompt_cache_miss_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 用户 prompt 中，未命中上下文缓存的 token 数
     */
    prompt_cache_miss_tokens?: number;
    /**
     * total_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 总token使用数量
     */
    total_tokens?: number;
    /**
     * completion_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 响应内容使用的token数量
     */
    completion_tokens?: number;
    /**
     * prompt_tokens_details字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.CompletionUsage$PromptTokensDetails
     * 描述: 提示词缓存token详情
     */
    prompt_tokens_details?: PromptTokensDetails;
    /**
     * completion_tokens_details字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.CompletionUsage$CompletionTokensDetails
     * 描述: 响应内容token详情
     */
    completion_tokens_details?: CompletionTokensDetails;
    /**
     * prompt_cache_hit_tokens字段
     * Java类型: java.lang.Integer
     * 描述: 用户 prompt 中，命中上下文缓存的 token 数
     */
    prompt_cache_hit_tokens?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionMetadata
 * 描述: 聊天完成元数据
 */
export interface ChatCompletionMetadata extends BaseObject {
    /**
     * agent字段
     * Java类型: java.util.Map
     * 描述: 代理相关信息
     */
    agent?: Map<string, Object>;
    /**
     * parent_message_uuid字段
     * Java类型: java.lang.String
     * 描述: 父级聊天UUID
     */
    parent_message_uuid?: string;
    /**
     * actions字段
     * Java类型: java.util.Set
     * 描述: 可用操作列表
     */
    actions?: Array<string>;
    /**
     * parent_message_id字段
     * Java类型: java.lang.Long
     * 描述: 父级聊天ID
     */
    parent_message_id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChatCompletionChunkDelta
 * 描述: 聊天消息对象，包含消息的角色、内容和工具调用信息
 */
export interface ChatCompletionChunkDelta extends BaseObject {
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 消息内容，对于工具/函数返回结果消息，content为对应的返回结果
     */
    content?: string;
    /**
     * reasoning_content字段
     * Java类型: java.lang.String
     * 描述: 仅适用于 reasoner 模型。内容为 assistant 消息中在最终答案之前的推理内容
     */
    reasoning_content?: string;
    /**
     * tool_calls字段
     * Java类型: java.util.List
     * 描述: 工具调用列表，仅当role为"assistant"且需要调用工具时存在
     */
    tool_calls?: Array<ChatCompletionMessageToolCall>;
    /**
     * audio字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.chat.ChatCompletionAudio
     * 描述: 音频消息
     */
    audio?: ChatCompletionAudio;
    /**
     * role字段
     * Java类型: java.lang.String
     * 描述: 消息发送者角色，可能的值："system"（系统消息）、"user"（用户消息）、"assistant"（助手消息）、"function"（函数返回结果消息）、"tool"（工具返回结果消息）
     */
    role?: string;
}
