import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VisitHistoryParam
 * 描述: 访问历史Form
 */
export interface VisitHistoryParam extends BaseParam {
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * lastVisitedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后访问时间
     */
    lastVisitedAt?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的内容ID
     */
    contentId?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 访问来源
     */
    source?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 访问时长（秒）
     */
    duration?: number;
    /**
     * visitCount字段
     * Java类型: java.lang.Integer
     * 描述: 访问次数
     */
    visitCount?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VisitHistoryResponse
 * 描述: 访问历史VO
 */
export interface VisitHistoryResponse extends BaseResponse {
    /**
     * lastVisitedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后访问时间
     */
    lastVisitedAt?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的内容ID
     */
    contentId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 访问来源
     */
    source?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 访问时长（秒）
     */
    duration?: number;
    /**
     * visitCount字段
     * Java类型: java.lang.Integer
     * 描述: 访问次数
     */
    visitCount?: number;
}
