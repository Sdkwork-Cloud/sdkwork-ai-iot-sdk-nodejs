import { BaseParam } from '../../types/base';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: NewsParam
 * 描述: 新闻资讯表单
 */
export interface NewsParam extends BaseParam {
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: 新闻摘要
     * 示例: 本文探讨了人工智能技术在各行业的最新应用及未来发展方向...
     */
    summary?: string;
    /**
     * publishTime字段
     * Java类型: java.lang.String
     * 描述: 新闻发布时间
     * 示例: 2023-11-15T08:30:00
     */
    publishTime?: string;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 新闻内容URL
     * 示例: https://example.com/news/ai-development-trends.html
     */
    url?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 新闻标签
     * 示例: 人工智能,科技,发展趋势
     */
    tags?: TagsContent;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 新闻标题
     * 示例: 人工智能技术最新发展趋势
     */
    title?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 新闻来源
     * 示例: 科技日报
     */
    source?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: NewsResponse
 * 描述: 新闻资讯VO对象
 */
export interface NewsResponse extends BaseResponse {
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
     * title字段
     * Java类型: java.lang.String
     * 描述: 新闻标题
     * 示例: 人工智能技术最新发展趋势
     */
    title?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 新闻标签
     * 示例: 人工智能,科技,发展趋势
     */
    tags?: TagsContent;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 新闻内容URL
     * 示例: https://example.com/news/ai-development-trends.html
     */
    url?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 新闻来源
     * 示例: 科技日报
     */
    source?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * publishTime字段
     * Java类型: java.lang.String
     * 描述: 新闻发布时间
     * 示例: 2023-11-15T08:30:00
     */
    publishTime?: string;
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: 新闻摘要
     * 示例: 本文探讨了人工智能技术在各行业的最新应用及未来发展方向...
     */
    summary?: string;
}
