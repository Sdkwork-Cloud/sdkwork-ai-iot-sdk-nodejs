import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { ContentVoteMetadata } from '../../types/data.meta';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ContentVoteParam
 * 描述: 内容投票表
 */
export interface ContentVoteParam extends BaseParam {
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.data.meta.ContentVoteMetadata
     * 描述: 元数据(Json格式)
     */
    metadata?: ContentVoteMetadata;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型(如:商品、会员、新闻等)
     */
    contentType?: ContentType;
    /**
     * rating字段
     * Java类型: java.lang.String
     * 描述: 评分(like/ dislike/ neutral)
     */
    rating?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID(外键关联对应实体的ID)
     */
    contentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ContentVoteResponse
 * 描述: 内容投票数据传输对象
 */
export interface ContentVoteResponse extends BaseResponse {
    /**
     * rating字段
     * Java类型: java.lang.String
     * 描述: 评分(like, dislike, neutral)
     */
    rating?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID（外键关联对应实体的ID）
     */
    contentId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID（关联plus_user.id）
     */
    userId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型（如:商品、会员、新闻等）
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
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.data.meta.ContentVoteMetadata
     * 描述: 元数据
     */
    metadata?: ContentVoteMetadata;
    /**
     * v字段
     * Java类型: java.lang.Long
     * 描述: 版本号（乐观锁控制）
     */
    v?: string|number;
}
