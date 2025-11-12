import { Type, SearchContextSize, AudioResponseFormat, Voice } from '../../enums/openai.api';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ResponseFormat
 */
export interface ResponseFormat {
    /**
     * type字段
     * Java类型: org.springframework.ai.openai.api.ResponseFormat$Type
     */
    type?: Type;
    /**
     * json_schema字段
     * Java类型: org.springframework.ai.openai.api.ResponseFormat$JsonSchema
     */
    json_schema?: JsonSchema;
    /**
     * schema字段
     * Java类型: java.lang.String
     */
    schema?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserLocation
 */
export interface UserLocation {
    /**
     * type字段
     * Java类型: java.lang.String
     */
    type?: string;
    /**
     * approximate字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$WebSearchOptions$UserLocation$Approximate
     */
    approximate?: Approximate;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Function
 */
export interface Function {
    /**
     * jsonSchema字段
     * Java类型: java.lang.String
     */
    jsonSchema?: string;
    /**
     * parameters字段
     * Java类型: java.util.Map
     */
    parameters?: Map<string, Object>;
    /**
     * strict字段
     * Java类型: java.lang.Boolean
     */
    strict?: boolean;
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
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: JsonSchema
 */
export interface JsonSchema {
    /**
     * schema字段
     * Java类型: java.util.Map
     */
    schema?: Map<string, Object>;
    /**
     * strict字段
     * Java类型: java.lang.Boolean
     */
    strict?: boolean;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Approximate
 */
export interface Approximate {
    /**
     * region字段
     * Java类型: java.lang.String
     */
    region?: string;
    /**
     * city字段
     * Java类型: java.lang.String
     */
    city?: string;
    /**
     * timezone字段
     * Java类型: java.lang.String
     */
    timezone?: string;
    /**
     * country字段
     * Java类型: java.lang.String
     */
    country?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: WebSearchOptions
 */
export interface WebSearchOptions {
    /**
     * search_context_size字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$WebSearchOptions$SearchContextSize
     */
    search_context_size?: SearchContextSize;
    /**
     * user_location字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$WebSearchOptions$UserLocation
     */
    user_location?: UserLocation;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AudioParameters
 */
export interface AudioParameters {
    /**
     * format字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$AudioParameters$AudioResponseFormat
     */
    format?: AudioResponseFormat;
    /**
     * voice字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$ChatCompletionRequest$AudioParameters$Voice
     */
    voice?: Voice;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FunctionTool
 */
export interface FunctionTool {
    /**
     * function字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$FunctionTool$Function
     */
    function?: Function;
    /**
     * type字段
     * Java类型: org.springframework.ai.openai.api.OpenAiApi$FunctionTool$Type
     */
    type?: Type;
}
