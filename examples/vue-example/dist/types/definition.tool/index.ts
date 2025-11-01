import { AiToolType, AuthType, HttpMethod } from '../../enums/tool';
import { BaseObject } from '../../types/base';
import { HttpApiDefinition } from '../../types/tool';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ToolDefinition
 */
export interface ToolDefinition extends BaseObject {
    /**
     * inputSchema字段
     * Java类型: java.lang.String
     */
    inputSchema?: string;
    /**
     * buildIn字段
     * Java类型: boolean
     */
    buildIn?: boolean;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.PlusAiToolType
     */
    type?: AiToolType;
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
     * httpDefinition字段
     * Java类型: com.sdkwork.spring.ai.plus.tool.HttpApiDefinition
     */
    httpDefinition?: HttpApiDefinition;
}
