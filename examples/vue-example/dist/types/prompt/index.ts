import { BaseParam } from '../../types/base';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiPromptParam
 * 描述: AI提示语Form
 */
export interface AiPromptParam extends BaseParam {
    /**
     * sort字段
     * Java类型: java.lang.Integer
     * 描述: 排序顺序
     */
    sort?: number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 适用的AI模型
     */
    model?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 提示语描述
     */
    description?: string;
    /**
     * avgResponseTime字段
     * Java类型: java.lang.Long
     * 描述: 平均响应时间(毫秒)
     */
    avgResponseTime?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签(逗号分隔)
     */
    tags?: TagsContent;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 提示语内容
     */
    content?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 关联分类ID
     */
    categoryId?: string|number;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用(true:启用,false:禁用)
     */
    enabled?: boolean;
    /**
     * usageCount字段
     * Java类型: java.lang.Long
     * 描述: 使用次数
     */
    usageCount?: string|number;
    /**
     * parameters字段
     * Java类型: java.util.Map
     * 描述: 参数定义(JSON格式)
     */
    parameters?: Map<string, Object>;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 提示语标题
     */
    title?: string;
    /**
     * creator字段
     * Java类型: java.lang.String
     * 描述: 创建者
     */
    creator?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiPromptResponse
 * 描述: AI提示语Value Object
 */
export interface AiPromptResponse extends BaseResponse {
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 适用的AI模型
     */
    model?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 关联分类ID
     */
    categoryId?: string|number;
    /**
     * parameters字段
     * Java类型: java.util.Map
     * 描述: 参数定义(JSON格式)
     */
    parameters?: Map<string, Object>;
    /**
     * sort字段
     * Java类型: java.lang.Integer
     * 描述: 排序顺序
     */
    sort?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 提示语描述
     */
    description?: string;
    /**
     * avgResponseTime字段
     * Java类型: java.lang.Long
     * 描述: 平均响应时间(毫秒)
     */
    avgResponseTime?: string|number;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 提示语内容
     */
    content?: string;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用(true:启用,false:禁用)
     */
    enabled?: boolean;
    /**
     * usageCount字段
     * Java类型: java.lang.Long
     * 描述: 使用次数
     */
    usageCount?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签(逗号分隔)
     */
    tags?: TagsContent;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 提示语标题
     */
    title?: string;
    /**
     * creator字段
     * Java类型: java.lang.String
     * 描述: 创建者
     */
    creator?: string;
}
