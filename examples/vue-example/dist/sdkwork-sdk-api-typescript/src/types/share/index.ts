import { ShareType, ShareStatus } from '../../enums/share';
import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { TagsContent } from '../../types/tags';
import { BaseResponse, BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareVisitRecordParam
 * 描述: 分享访问记录Form
 */
export interface ShareVisitRecordParam extends BaseParam {
    /**
     * shareId字段
     * Java类型: java.lang.Long
     * 描述: 关联的分享ID
     */
    shareId?: string|number;
    /**
     * userAgent字段
     * Java类型: java.lang.String
     * 描述: 访问者User-Agent
     */
    userAgent?: string;
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: 访问者IP地址
     */
    ipAddress?: string;
    /**
     * success字段
     * Java类型: java.lang.Boolean
     * 描述: 是否成功访问（输入密码正确等）
     */
    success?: boolean;
    /**
     * accessedAt字段
     * Java类型: java.time.Instant
     * 描述: 访问时间
     */
    accessedAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareParam
 * 描述: 分享Form
 */
export interface ShareParam extends BaseParam {
    /**
     * shareCode字段
     * Java类型: java.lang.String
     * 描述: 分享码（用于生成短链接，唯一）
     */
    shareCode?: string;
    /**
     * clickCount字段
     * Java类型: java.lang.Integer
     * 描述: 点击次数
     */
    clickCount?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 分享描述
     */
    description?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 分享标题
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.share.ShareType
     * 描述: 分享类型（链接、商品、文件等）
     */
    type?: ShareType;
    /**
     * expireAt字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expireAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 分享标签
     */
    tags?: TagsContent;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: 分享密码（可选）
     */
    password?: string;
    /**
     * contents字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.share.ShareContents
     * 描述: 分享内容
     */
    contents?: ShareContents;
    /**
     * shareUrl字段
     * Java类型: java.lang.String
     * 描述: 分享链接（当type为LINK时使用）
     */
    shareUrl?: string;
    /**
     * contentIds字段
     * Java类型: java.util.List
     * 描述: 关联内容ID列表（JSON格式存储，当分享多个商品或文件时使用）
     */
    contentIds?: Array<string>;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.share.ShareStatus
     * 描述: 分享状态（有效、无效、已删除等）
     */
    status?: ShareStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareVisitRecordResponse
 * 描述: 分享访问记录Value Object
 */
export interface ShareVisitRecordResponse extends BaseResponse {
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: 访问者IP地址
     */
    ipAddress?: string;
    /**
     * shareId字段
     * Java类型: java.lang.Long
     * 描述: 关联的分享ID
     */
    shareId?: string|number;
    /**
     * userAgent字段
     * Java类型: java.lang.String
     * 描述: 访问者User-Agent
     */
    userAgent?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 记录ID
     */
    id?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
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
     * accessedAt字段
     * Java类型: java.time.Instant
     * 描述: 访问时间
     */
    accessedAt?: string;
    /**
     * success字段
     * Java类型: java.lang.Boolean
     * 描述: 是否成功访问
     */
    success?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareContents
 */
export interface ShareContents extends BaseObject {
    /**
     * items字段
     * Java类型: java.util.List
     */
    items?: Array<ShareItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareResponse
 * 描述: 分享VO
 */
export interface ShareResponse extends BaseResponse {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 分享描述
     */
    description?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 分享UUID
     */
    uuid?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 分享标题
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.share.ShareType
     * 描述: 分享类型
     */
    type?: ShareType;
    /**
     * expireAt字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expireAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 分享标签
     */
    tags?: TagsContent;
    /**
     * shareCode字段
     * Java类型: java.lang.String
     * 描述: 分享码
     */
    shareCode?: string;
    /**
     * clickCount字段
     * Java类型: java.lang.Integer
     * 描述: 点击次数
     */
    clickCount?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 分享ID
     */
    id?: string|number;
    /**
     * contentIds字段
     * Java类型: java.util.List
     * 描述: 关联内容ID列表
     */
    contentIds?: Array<string>;
    /**
     * shareUrl字段
     * Java类型: java.lang.String
     * 描述: 分享链接
     */
    shareUrl?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.share.ShareStatus
     * 描述: 分享状态
     */
    status?: ShareStatus;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: 分享密码
     */
    password?: string;
    /**
     * contents字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.share.ShareContents
     * 描述: 分享内容
     */
    contents?: ShareContents;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShareItem
 */
export interface ShareItem extends BaseObject {
}
