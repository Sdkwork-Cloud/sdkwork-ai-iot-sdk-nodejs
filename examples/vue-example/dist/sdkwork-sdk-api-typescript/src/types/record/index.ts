import { InvokeType, InvokeStatus } from '../../enums/record';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvokeRecordParam
 * 描述: Invocation record Form (records API calls, function calls, and other invocation behaviors)
 */
export interface InvokeRecordParam extends BaseParam {
    /**
     * errorMsg字段
     * Java类型: java.lang.String
     * 描述: Error message (when invocation fails)
     */
    errorMsg?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: Invoker user ID
     */
    userId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.record.InvokeType
     * 描述: Invocation type (API_CALL/FUNCTION_CALL)
     */
    type?: InvokeType;
    /**
     * userAgent字段
     * Java类型: java.lang.String
     * 描述: Client User-Agent information
     */
    userAgent?: string;
    /**
     * requestParams字段
     * Java类型: java.util.Map
     * 描述: Request parameters (JSON format)
     */
    requestParams?: Map<string, Object>;
    /**
     * functionName字段
     * Java类型: java.lang.String
     * 描述: Function name (non-null for FUNCTION_CALL type)
     */
    functionName?: string;
    /**
     * clientId字段
     * Java类型: java.lang.String
     * 描述: Client unique identifier
     */
    clientId?: string;
    /**
     * headers字段
     * Java类型: java.util.Map
     * 描述: Request headers (JSON format)
     */
    headers?: Map<string, Object>;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.record.InvokeStatus
     * 描述: Execution status (SUCCESS/FAILURE/RUNNING)
     */
    status?: InvokeStatus;
    /**
     * browserInfo字段
     * Java类型: java.lang.String
     * 描述: Client browser details
     */
    browserInfo?: string;
    /**
     * clientLocation字段
     * Java类型: java.lang.String
     * 描述: Client geographical location
     */
    clientLocation?: string;
    /**
     * clientIp字段
     * Java类型: java.lang.String
     * 描述: Client IP address (IPv4/IPv6)
     */
    clientIp?: string;
    /**
     * apiEndpoint字段
     * Java类型: java.lang.String
     * 描述: API endpoint path (non-null for API_CALL type)
     */
    apiEndpoint?: string;
    /**
     * duration字段
     * Java类型: java.lang.Long
     * 描述: Execution duration (ms)
     */
    duration?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvokeRecordResponse
 * 描述: Invocation record VO (records API calls, function calls, and other invocation behaviors)
 */
export interface InvokeRecordResponse extends BaseResponse {
    /**
     * clientId字段
     * Java类型: java.lang.String
     * 描述: Client unique identifier
     */
    clientId?: string;
    /**
     * headers字段
     * Java类型: java.util.Map
     * 描述: Request headers (JSON format)
     */
    headers?: Map<string, Object>;
    /**
     * functionName字段
     * Java类型: java.lang.String
     * 描述: Function name (non-null for FUNCTION_CALL type)
     */
    functionName?: string;
    /**
     * userAgent字段
     * Java类型: java.lang.String
     * 描述: Client User-Agent information
     */
    userAgent?: string;
    /**
     * requestParams字段
     * Java类型: java.util.Map
     * 描述: Request parameters (JSON format)
     */
    requestParams?: Map<string, Object>;
    /**
     * errorMsg字段
     * Java类型: java.lang.String
     * 描述: Error message (when invocation fails)
     */
    errorMsg?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.record.InvokeType
     * 描述: Invocation type (API_CALL/FUNCTION_CALL)
     */
    type?: InvokeType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: Invoker user ID
     */
    userId?: string|number;
    /**
     * apiEndpoint字段
     * Java类型: java.lang.String
     * 描述: API endpoint path (non-null for API_CALL type)
     */
    apiEndpoint?: string;
    /**
     * duration字段
     * Java类型: java.lang.Long
     * 描述: Execution duration (ms)
     */
    duration?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * clientIp字段
     * Java类型: java.lang.String
     * 描述: Client IP address (IPv4/IPv6)
     */
    clientIp?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID
     */
    id?: string|number;
    /**
     * browserInfo字段
     * Java类型: java.lang.String
     * 描述: Client browser details
     */
    browserInfo?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.record.InvokeStatus
     * 描述: Execution status (SUCCESS/FAILURE/RUNNING)
     */
    status?: InvokeStatus;
    /**
     * clientLocation字段
     * Java类型: java.lang.String
     * 描述: Client geographical location
     */
    clientLocation?: string;
}
