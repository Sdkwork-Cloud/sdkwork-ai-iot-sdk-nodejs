import { ContentType } from '../../enums/content';
import { ChannelProviderEnum } from '../../enums/core.type';
import { GenerationStatus, GenerationType } from '../../enums/ai';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { AuthorInfo } from '../../types/author';
import { MediaResourceList } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiGenerationContentParam
 * 描述: AI生成内容详情Form
 */
export interface AiGenerationContentParam extends BaseParam {
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 生成内容的标题
     * 示例: 未来城市概念图
     */
    title?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     * 示例: IMAGE
     */
    contentType?: ContentType;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     * 示例: 123456
     */
    contentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 生成内容的描述信息
     * 示例: 这是一张描绘2050年未来城市的概念图
     */
    description?: string;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 生成内容的文件大小
     * 示例: 2048000
     */
    fileSize?: string|number;
    /**
     * contentFormat字段
     * Java类型: java.lang.String
     * 描述: 生成内容的格式
     * 示例: image/jpeg
     */
    contentFormat?: string;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 内容元数据
     * 示例: {"resolution":"1024x768","style":"futuristic"}
     */
    metadata?: Map<string, Object>;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 生成内容的存储URL
     * 示例: https://storage.example.com/generations/img_12345.jpg
     */
    contentUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiGenerationParam
 * 描述: AI生成内容请求Form
 */
export interface AiGenerationParam extends BaseParam {
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: 请求ID(用于跟踪和关联请求)
     * 示例: req_123456789
     */
    requestId?: string;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     * 示例: 2023-05-15T10:30:45
     */
    responseTime?: string;
    /**
     * usageRecordId字段
     * Java类型: java.lang.Long
     * 描述: 关联的使用记录ID
     * 示例: 67890
     */
    usageRecordId?: string|number;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 服务提供商
     * 示例: OPENAI
     */
    provider?: ChannelProviderEnum;
    /**
     * cost字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际费用
     * 示例: 0.0025
     */
    cost?: string|number;
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     * 示例: 2023-05-15T10:30:00
     */
    requestTime?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.GenerationStatus
     * 描述: 任务状态
     * 示例: 3
     */
    status?: GenerationStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.GenerationType
     * 描述: 生成类型
     * 示例: IMAGE
     */
    type?: GenerationType;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 12345
     */
    userId?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     * 示例: stable-diffusion-v1.5
     */
    model?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiGenerationContentResponse
 * 描述: AI生成内容详情VO
 */
export interface AiGenerationContentResponse extends BaseResponse {
    /**
     * contentFormat字段
     * Java类型: java.lang.String
     * 描述: 生成内容的格式
     * 示例: image/jpeg
     */
    contentFormat?: string;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 内容元数据
     * 示例: {"resolution":"1024x768","style":"futuristic"}
     */
    metadata?: Map<string, Object>;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 生成内容的标题
     * 示例: 未来城市概念图
     */
    title?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.Long
     * 描述: 版本号，用于乐观锁控制
     */
    version?: string|number;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     * 示例: 123456
     */
    contentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 生成内容的描述信息
     * 示例: 这是一张描绘2050年未来城市的概念图
     */
    description?: string;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 生成内容的文件大小
     * 示例: 2048000
     */
    fileSize?: string|number;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 生成内容的存储URL
     * 示例: https://storage.example.com/generations/img_12345.jpg
     */
    contentUrl?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     * 示例: IMAGE
     */
    contentType?: ContentType;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AiGenerationResponse
 * 描述: AI生成内容记录VO
 */
export interface AiGenerationResponse extends BaseResponse {
    /**
     * detailId字段
     * Java类型: java.lang.Long
     * 描述: 关联的生成详情记录ID
     */
    detailId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 12345
     */
    userId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.GenerationType
     * 描述: 生成类型
     * 示例: IMAGE
     */
    type?: GenerationType;
    /**
     * cost字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际费用
     * 示例: 0.0025
     */
    cost?: string|number;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     * 示例: 2023-05-15T10:30:45
     */
    responseTime?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     * 示例: stable-diffusion-v1.5
     */
    model?: string;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 关联的媒体资源列表
     * 示例: {"images":[{"url":"https://example.com/generated/image1.jpg","width":1024,"height":1024}]}
     */
    resourceList?: MediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.GenerationStatus
     * 描述: 任务状态
     * 示例: 3
     */
    status?: GenerationStatus;
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     * 示例: 2023-05-15T10:30:00
     */
    requestTime?: string;
    /**
     * usageRecordId字段
     * Java类型: java.lang.Long
     * 描述: 关联的使用记录ID
     * 示例: 67890
     */
    usageRecordId?: string|number;
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: 请求ID(用于跟踪和关联请求)
     * 示例: req_123456789
     */
    requestId?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 服务提供商
     * 示例: OPENAI
     */
    provider?: ChannelProviderEnum;
}
