import { ContentType } from '../../enums/content';
import { CommentStatus } from '../../enums/comments';
import { MediaResourceType } from '../../enums/resource';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { AuthorInfo } from '../../types/author';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CommentsParam
 * 描述: 用户评论Form，支持新闻、文章、视频、图片、商品、帖子等任何内容类型的评论
 */
export interface CommentsParam extends BaseParam {
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     * 示例: ARTICLE
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.comments.CommentStatus
     * 描述: 评论状态
     * 示例: PUBLISHED
     */
    status?: CommentStatus;
    /**
     * likes字段
     * Java类型: java.lang.Integer
     * 描述: 点赞数量
     */
    likes?: number;
    /**
     * isTop字段
     * Java类型: java.lang.Boolean
     * 描述: 是否置顶
     */
    isTop?: boolean;
    /**
     * replyCount字段
     * Java类型: java.lang.Integer
     * 描述: 回复数量
     */
    replyCount?: number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 评论内容
     */
    content?: string;
    /**
     * deviceInfo字段
     * Java类型: java.lang.String
     * 描述: 设备信息
     */
    deviceInfo?: string;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父节点ID
     */
    parentId?: string|number;
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     * 描述: 父节点UUID
     */
    parentUuid?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 被评论内容ID
     */
    contentId?: string|number;
    /**
     * rating字段
     * Java类型: java.lang.Integer
     * 描述:  (INT): 评分 (1-5星，可选)。
     */
    rating?: number;
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: 评论者IP地址
     */
    ipAddress?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CommentsReplyParam
 * 描述: 评论回复Form
 */
export interface CommentsReplyParam extends BaseParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 回复内容
     */
    content?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CommentsResponse
 * 描述: 用户评论VO，支持新闻、文章、视频、图片、商品、帖子等任何内容类型的评论
 */
export interface CommentsResponse extends BaseResponse {
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 被评论内容ID
     */
    contentId?: string|number;
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: 评论者IP地址
     */
    ipAddress?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父节点ID
     */
    parentId?: string|number;
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     * 描述: 父节点UUID
     */
    parentUuid?: string;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 评论内容
     */
    content?: string;
    /**
     * deviceInfo字段
     * Java类型: java.lang.String
     * 描述: 设备信息
     */
    deviceInfo?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     * 示例: ARTICLE
     */
    contentType?: ContentType;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.comments.CommentStatus
     * 描述: 评论状态
     * 示例: PUBLISHED
     */
    status?: CommentStatus;
    /**
     * likes字段
     * Java类型: java.lang.Integer
     * 描述: 点赞数量
     */
    likes?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * replyCount字段
     * Java类型: java.lang.Integer
     * 描述: 回复数量
     */
    replyCount?: number;
    /**
     * isTop字段
     * Java类型: java.lang.Boolean
     * 描述: 是否置顶
     */
    isTop?: boolean;
}
