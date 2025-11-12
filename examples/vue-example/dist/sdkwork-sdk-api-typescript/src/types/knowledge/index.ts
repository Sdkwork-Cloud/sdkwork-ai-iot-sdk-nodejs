import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: KnowledgeBaseParam
 * 描述: 知识库Form对象
 */
export interface KnowledgeBaseParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 知识库描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 知识库名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: KnowledgeBaseResponse
 * 描述: 知识库 Value Object
 */
export interface KnowledgeBaseResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 知识库名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 知识库描述
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     */
    id?: string|number;
}
