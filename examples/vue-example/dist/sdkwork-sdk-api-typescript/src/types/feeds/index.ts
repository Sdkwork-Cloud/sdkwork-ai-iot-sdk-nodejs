import { MediaResourceType } from '../../enums/resource';
import { FeedsStatus } from '../../enums/feeds';
import { ContentType } from '../../enums/content';
import { AudioFormat } from '../../enums/audio';
import { BaseParam } from '../../types/base';
import { TagsContent } from '../../types/tags';
import { ImageMediaResourceList, MediaResourceList } from '../../types/resource';
import { BaseResponse } from '../../types/base';
import { AuthorInfo } from '../../types/author';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FeedsParam
 * 描述: Feeds流Form对象
 */
export interface FeedsParam extends BaseParam {
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: Feeds内容摘要
     * 示例: 本文探讨了人工智能技术在各行业的最新应用及未来发展方向...
     */
    summary?: string;
    /**
     * publishTime字段
     * Java类型: java.time.Instant
     * 描述: 发布时间
     * 示例: 2023-11-15T08:30:00
     */
    publishTime?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 封面图片列表
     * 示例: {"images":[{"url":"https://example.com/image1.jpg","width":1920,"height":1080},{"url":"https://example.com/image2.jpg","width":1280,"height":720}]}
     */
    coverImages?: ImageMediaResourceList;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Feeds标签
     * 示例: ["人工智能","科技","发展趋势"]
     */
    tags?: TagsContent;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.feeds.FeedsStatus
     * 描述: Feeds状态
     * 示例: PUBLISHED
     */
    status?: FeedsStatus;
    /**
     * commentCount字段
     * Java类型: java.lang.Long
     * 描述: 评论次数
     * 示例: 50
     */
    commentCount?: string|number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: Feeds标题
     * 示例: 人工智能技术最新发展趋势
     */
    title?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型
     * 示例: NEWS
     */
    contentType?: ContentType;
    /**
     * likeCount字段
     * Java类型: java.lang.Long
     * 描述: 点赞次数
     * 示例: 200
     */
    likeCount?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 内容来源
     * 示例: 科技日报
     */
    source?: string;
    /**
     * viewCount字段
     * Java类型: java.lang.Long
     * 描述: 浏览次数
     * 示例: 1000
     */
    viewCount?: string|number;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     * 示例: 123456
     */
    contentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FeedsResponse
 * 描述: Feeds流VO对象，支持通用内容展示，包括新闻资讯、博客、视频、图片、音频等多种类型
 */
export interface FeedsResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * viewCount字段
     * Java类型: java.lang.Long
     * 描述: 浏览次数
     * 示例: 1000
     */
    viewCount?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型
     * 示例: NEWS
     */
    contentType?: ContentType;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 封面图片URL列表
     * 示例: {"images":[{"url":"https://example.com/image1.jpg","width":1920,"height":1080},{"url":"https://example.com/image2.jpg","width":1280,"height":720}]}
     */
    coverImages?: ImageMediaResourceList;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: resource list
     * 示例: {"images":[{"url":"https://example.com/image1.jpg","width":1920,"height":1080}],"videos":[{"url":"https://example.com/video1.mp4","duration":300,"width":1920,"height":1080}]}
     */
    resourceList?: MediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.feeds.FeedsStatus
     * 描述: Feeds状态
     * 示例: PUBLISHED
     */
    status?: FeedsStatus;
    /**
     * publishTime字段
     * Java类型: java.time.Instant
     * 描述: 发布时间
     * 示例: 2023-11-15T08:30:00
     */
    publishTime?: string;
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: Feeds内容摘要
     * 示例: 本文探讨了人工智能技术在各行业的最新应用及未来发展方向...
     */
    summary?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     * 示例: 123456
     */
    contentId?: string|number;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 内容来源
     * 示例: 科技日报
     */
    source?: string;
    /**
     * likeCount字段
     * Java类型: java.lang.Long
     * 描述: 点赞次数
     * 示例: 200
     */
    likeCount?: string|number;
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
     * 描述: Feeds标题
     * 示例: 人工智能技术最新发展趋势
     */
    title?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Feeds标签
     * 示例: ["人工智能","科技","发展趋势"]
     */
    tags?: TagsContent;
    /**
     * commentCount字段
     * Java类型: java.lang.Long
     * 描述: 评论次数
     * 示例: 50
     */
    commentCount?: string|number;
}
