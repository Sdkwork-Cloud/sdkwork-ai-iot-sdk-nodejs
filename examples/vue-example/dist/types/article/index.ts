import { MediaResourceType } from '../../enums/resource';
import { ArticleStatus } from '../../enums/article';
import { BaseParam } from '../../types/base';
import { AuthorInfo } from '../../types/author';
import { ImageMediaResourceList } from '../../types/resource';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ArticleParam
 * 描述: AI生成文章Form
 */
export interface ArticleParam extends BaseParam {
    /**
     * wordCount字段
     * Java类型: java.lang.Integer
     * 描述: 文章字数统计
     * 示例: 2500
     */
    wordCount?: number;
    /**
     * keywords字段
     * Java类型: [Ljava.lang.String;
     * 描述: 文章关键词
     * 示例: ["人工智能","深度学习","应用场景"]
     */
    keywords?: string[];
    /**
     * subtitle字段
     * Java类型: java.lang.String
     * 描述: 文章副标题
     * 示例: 2024年全球AI技术演进与应用场景分析
     */
    subtitle?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 文章作者信息
     * 示例: {"id":1001,"name":"AI Research Lab","email":"contact@airesearch.com","bio":"专注于人工智能技术研究与应用的权威机构","website":"https://www.airesearch.com"}
     */
    author?: AuthorInfo;
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: 文章摘要
     * 示例: 本文详细分析了2024年人工智能技术的发展趋势及在各行业的应用案例...
     */
    summary?: string;
    /**
     * readingTime字段
     * Java类型: java.lang.Integer
     * 描述: 预计阅读时间
     * 示例: 8
     */
    readingTime?: number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 文章标题
     * 示例: 人工智能发展趋势研究
     */
    title?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 文章封面图URL
     * 示例: https://storage.example.com/articles/ai_trend_cover.jpg
     */
    coverImages?: ImageMediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.article.ArticleStatus
     * 描述: 文章状态
     * 示例: PUBLISHED
     */
    status?: ArticleStatus;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 文章正文内容
     * 示例: 随着深度学习技术的不断突破，人工智能已逐步渗透到医疗、金融、制造业等多个领域...
     */
    content?: string;
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 文章来源
     * 示例: Tech Insights
     */
    source?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ArticleResponse
 * 描述: AI生成文章VO对象
 */
export interface ArticleResponse extends BaseResponse {
    /**
     * summary字段
     * Java类型: java.lang.String
     * 描述: 文章摘要
     * 示例: 本文详细分析了2024年人工智能技术的发展趋势及在各行业的应用案例...
     */
    summary?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 文章作者信息
     * 示例: {"id":1001,"name":"AI Research Lab","email":"contact@airesearch.com","bio":"专注于人工智能技术研究与应用的权威机构","website":"https://www.airesearch.com"}
     */
    author?: AuthorInfo;
    /**
     * wordCount字段
     * Java类型: java.lang.Integer
     * 描述: 文章字数统计
     * 示例: 2500
     */
    wordCount?: number;
    /**
     * keywords字段
     * Java类型: [Ljava.lang.String;
     * 描述: 文章关键词
     * 示例: ["人工智能","深度学习","应用场景"]
     */
    keywords?: string[];
    /**
     * source字段
     * Java类型: java.lang.String
     * 描述: 文章来源
     * 示例: Tech Insights
     */
    source?: string;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 文章正文内容
     * 示例: 随着深度学习技术的不断突破，人工智能已逐步渗透到医疗、金融、制造业等多个领域...
     */
    content?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 文章标题
     * 示例: 人工智能发展趋势研究
     */
    title?: string;
    /**
     * readingTime字段
     * Java类型: java.lang.Integer
     * 描述: 预计阅读时间
     * 示例: 8
     */
    readingTime?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * subtitle字段
     * Java类型: java.lang.String
     * 描述: 文章副标题
     * 示例: 2024年全球AI技术演进与应用场景分析
     */
    subtitle?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 文章封面图URL
     * 示例: {"images":[{"url":"https://example.com/image1.jpg","width":1920,"height":1080},{"url":"https://example.com/image2.jpg","width":1280,"height":720}]}
     */
    coverImages?: ImageMediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.article.ArticleStatus
     * 描述: 文章状态
     * 示例: PUBLISHED
     */
    status?: ArticleStatus;
}
