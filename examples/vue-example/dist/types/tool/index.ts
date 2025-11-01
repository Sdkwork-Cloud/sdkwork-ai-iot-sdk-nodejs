import { AiToolType, AuthType, HttpMethod } from '../../enums/tool';
import { AiToolStatus } from '../../enums/ai';
import { BaseParam } from '../../types/base';
import { ToolDefinition } from '../../types/definition.tool';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiToolParam
 * 描述: AI工具Form类
 */
export interface AiToolParam extends BaseParam {
    /**
     * toolDefinition字段
     * Java类型: com.sdkwork.spring.ai.plus.definition.tool.PlusToolDefinition
     * 描述: 工具定义(JSON格式)
     */
    toolDefinition?: ToolDefinition;
    /**
     * httpApiDefinition字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.HttpApiDefinition
     * 描述: HTTP API定义(JSON格式)
     */
    httpApiDefinition?: HttpApiDefinition;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.AiToolStatus
     * 描述: 工具状态(DRAFT:草稿,PUBLISHED:已发布,DEPRECATED:已弃用)
     */
    status?: AiToolStatus;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用(true:启用,false:禁用)
     */
    enabled?: boolean;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.PlusAiToolType
     * 描述: 工具类型(HTTP_API:HTTP接口,FUNCTION:函数,PLUGIN:插件)
     */
    type?: AiToolType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 工具描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 工具名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: HttpApiDefinition
 */
export interface HttpApiDefinition {
    /**
     * requestBodyFormat字段
     * Java类型: java.lang.String
     */
    requestBodyFormat?: string;
    /**
     * timeoutMillis字段
     * Java类型: int
     */
    timeoutMillis?: number;
    /**
     * authType字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.HttpApiDefinition$AuthType
     */
    authType?: AuthType;
    /**
     * parameters字段
     * Java类型: java.util.Map
     */
    parameters?: Map<string, Object>;
    /**
     * path字段
     * Java类型: java.lang.String
     */
    path?: string;
    /**
     * baseUrl字段
     * Java类型: java.lang.String
     */
    baseUrl?: string;
    /**
     * authParams字段
     * Java类型: java.util.Map
     */
    authParams?: Map<string, Object>;
    /**
     * requestBody字段
     * Java类型: java.util.Map
     */
    requestBody?: Map<string, Object>;
    /**
     * requestFormat字段
     * Java类型: java.lang.String
     */
    requestFormat?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * responseFormat字段
     * Java类型: java.lang.String
     */
    responseFormat?: string;
    /**
     * headers字段
     * Java类型: java.util.Map
     */
    headers?: Map<string, string>;
    /**
     * authenticated字段
     * Java类型: boolean
     */
    authenticated?: boolean;
    /**
     * apiName字段
     * Java类型: java.lang.String
     */
    apiName?: string;
    /**
     * method字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.HttpApiDefinition$HttpMethod
     */
    method?: HttpMethod;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ToolCallback
 */
export interface ToolCallback {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiToolResponse
 * 描述: AI工具VO类
 */
export interface AiToolResponse extends BaseResponse {
    /**
     * toolDefinition字段
     * Java类型: com.sdkwork.spring.ai.plus.definition.tool.PlusToolDefinition
     * 描述: 工具定义(JSON格式)
     */
    toolDefinition?: ToolDefinition;
    /**
     * httpApiDefinition字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.HttpApiDefinition
     * 描述: HTTP API定义(JSON格式)
     */
    httpApiDefinition?: HttpApiDefinition;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.PlusAiToolType
     * 描述: 工具类型(HTTP_API:HTTP接口,FUNCTION:函数,PLUGIN:插件)
     */
    type?: AiToolType;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用(true:启用,false:禁用)
     */
    enabled?: boolean;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.AiToolStatus
     * 描述: 工具状态(DRAFT:草稿,PUBLISHED:已发布,DEPRECATED:已弃用)
     */
    status?: AiToolStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 工具名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 工具描述
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 工具ID
     */
    id?: string|number;
}
