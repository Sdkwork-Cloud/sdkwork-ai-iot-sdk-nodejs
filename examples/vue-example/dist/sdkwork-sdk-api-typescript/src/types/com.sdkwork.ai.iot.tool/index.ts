import { AiToolType, AuthType, HttpMethod } from '../../enums/tool';
import { BaseObject } from '../../types/base';
import { ToolDefinition } from '../../types/definition.tool';
import { HttpApiDefinition } from '../../types/tool';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotToolConfig
 */
export interface IotToolConfig extends BaseObject {
    /**
     * tools字段
     * Java类型: java.util.List
     */
    tools?: Array<IotToolDefinition>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotToolDefinition
 */
export interface IotToolDefinition extends ToolDefinition {
}
