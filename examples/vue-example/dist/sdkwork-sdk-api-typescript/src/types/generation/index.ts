import { ContentType } from '../../enums/content';
import { ChannelProviderEnum } from '../../enums/core.type';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { GenerationStatus, GenerationType } from '../../enums/ai';
import { ChannelTaskStatus } from '../../enums/core.task';
import { Emotion } from '../../enums/video';
import { BaseParam } from '../../types/base';
import { ImageMediaResourceList, MediaResourceList, VideoMediaResourceList, AudioMediaResourceList } from '../../types/resource';
import { AuthorInfo } from '../../types/author';
import { TagsContent } from '../../types/tags';
import { VideoStoryboard } from '../../types/video';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GenerateImageParam
 * 描述: Image generation request form
 */
export interface GenerateImageParam extends BaseParam {
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Image generation model to use
     * 示例: stable-diffusion-v1.5
     */
    model?: string;
    /**
     * responseFormat字段
     * Java类型: java.lang.String
     * 描述: Format of the response
     * 示例: url
     */
    responseFormat?: string;
    /**
     * style字段
     * Java类型: java.lang.String
     * 描述: Style of the generated image
     * 示例: vivid
     */
    style?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: Aspect ratio of the generated image
     * 示例: 1:1
     */
    aspectRatio?: string;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: Width of the generated image in pixels
     * 示例: 1024
     */
    width?: number;
    /**
     * negativePrompt字段
     * Java类型: java.lang.String
     * 描述: Negative prompt to exclude certain elements
     * 示例: blurry, low quality, watermark
     */
    negativePrompt?: string;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: Height of the generated image in pixels
     * 示例: 1024
     */
    height?: number;
    /**
     * n字段
     * Java类型: java.lang.Integer
     * 描述: Number of images to generate
     * 示例: 1
     */
    n?: number;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: Prompt text for image generation
     * 示例: A beautiful sunset over the mountains
     */
    prompt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GenerateMusicParam
 * 描述: Music generation request form
 */
export interface GenerateMusicParam extends BaseParam {
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: Prompt text for music generation
     * 示例: A calm and peaceful piano melody
     */
    prompt?: string;
    /**
     * lyrics字段
     * Java类型: java.lang.String
     * 描述: Lyrics for the music generation
     * 示例: Amazing grace, how sweet the sound that saved a wretch like me
     */
    lyrics?: string;
    /**
     * n字段
     * Java类型: java.lang.Integer
     * 描述: Number of music pieces to generate
     * 示例: 1
     */
    n?: number;
    /**
     * tempo字段
     * Java类型: java.lang.Integer
     * 描述: Tempo of the generated music in BPM
     * 示例: 120
     */
    tempo?: number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Music generation model to use
     * 示例: music-gen
     */
    model?: string;
    /**
     * style字段
     * Java类型: java.lang.String
     * 描述: Style of the generated music
     * 示例: classical
     */
    style?: string;
    /**
     * instrument字段
     * Java类型: java.lang.String
     * 描述: Primary instrument for the generated music
     * 示例: piano
     */
    instrument?: string;
}
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
 * 对应Java类: GenerateVideoParam
 * 描述: Video generation request form
 */
export interface GenerateVideoParam extends BaseParam {
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: Width of the generated video in pixels
     * 示例: 1920
     */
    width?: number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Video generation model to use
     * 示例: stable-video-diffusion
     */
    model?: string;
    /**
     * responseFormat字段
     * Java类型: java.lang.String
     * 描述: Format of the response
     * 示例: url
     */
    responseFormat?: string;
    /**
     * style字段
     * Java类型: java.lang.String
     * 描述: Style of the generated video
     * 示例: vivid
     */
    style?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: Aspect ratio of the generated video
     * 示例: 16:9
     */
    aspectRatio?: string;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: Prompt text for video generation
     * 示例: A beautiful sunset over the mountains with birds flying
     */
    prompt?: string;
    /**
     * n字段
     * Java类型: java.lang.Integer
     * 描述: Number of videos to generate
     * 示例: 1
     */
    n?: number;
    /**
     * negativePrompt字段
     * Java类型: java.lang.String
     * 描述: Negative prompt to exclude certain elements
     * 示例: blurry, low quality, watermark
     */
    negativePrompt?: string;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: Height of the generated video in pixels
     * 示例: 1080
     */
    height?: number;
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
     * promptId字段
     * Java类型: java.lang.Long
     * 描述: 提示词ID
     */
    promptId?: string|number;
    /**
     * taskCreatedTime字段
     * Java类型: java.time.Instant
     * 描述: 任务创建时间
     */
    taskCreatedTime?: string;
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
     * channelTaskId字段
     * Java类型: java.lang.String
     * 描述: 第三方通道任务ID
     * 示例: task_987654321
     */
    channelTaskId?: string;
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     * 示例: 2023-05-15T10:30:00
     */
    requestTime?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 封面图片URL列表
     */
    coverImages?: ImageMediaResourceList;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 媒体资源列表
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
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     * 示例: stable-diffusion-v1.5
     */
    model?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * taskUpdatedTime字段
     * Java类型: java.time.Instant
     * 描述: 任务更新时间
     */
    taskUpdatedTime?: string;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     * 示例: 2023-05-15T10:30:45
     */
    responseTime?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 关联的会话ID
     * 示例: 12345
     */
    conversationId?: string|number;
    /**
     * channelTaskStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.core.task.ChannelTaskStatus
     * 描述: 通道任务状态
     */
    channelTaskStatus?: ChannelTaskStatus;
    /**
     * cost字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际费用
     * 示例: 0.0025
     */
    cost?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签内容
     */
    tags?: TagsContent;
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
     * storyboard字段
     * Java类型: com.sdkwork.spring.ai.plus.video.VideoStoryboard
     * 描述: 视频故事板
     */
    storyboard?: VideoStoryboard;
    /**
     * messageId字段
     * Java类型: java.lang.Long
     * 描述: 关联的消息ID
     * 示例: 54321
     */
    messageId?: string|number;
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
     * messageId字段
     * Java类型: java.lang.Long
     * 描述: 关联的消息ID
     * 示例: 54321
     */
    messageId?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签内容
     */
    tags?: TagsContent;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 12345
     */
    userId?: string|number;
    /**
     * storyboard字段
     * Java类型: com.sdkwork.spring.ai.plus.video.VideoStoryboard
     * 描述: 视频故事板
     */
    storyboard?: VideoStoryboard;
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
     * channelTaskStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.core.task.ChannelTaskStatus
     * 描述: 通道任务状态
     */
    channelTaskStatus?: ChannelTaskStatus;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * taskUpdatedTime字段
     * Java类型: java.time.Instant
     * 描述: 任务更新时间
     */
    taskUpdatedTime?: string;
    /**
     * responseTime字段
     * Java类型: java.time.Instant
     * 描述: 响应时间
     * 示例: 2023-05-15T10:30:45
     */
    responseTime?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     * 描述: 关联的会话ID
     * 示例: 12345
     */
    conversationId?: string|number;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: 模型名称
     * 示例: stable-diffusion-v1.5
     */
    model?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 封面图片URL列表
     */
    coverImages?: ImageMediaResourceList;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 媒体资源列表
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
     * channelTaskId字段
     * Java类型: java.lang.String
     * 描述: 第三方通道任务ID
     * 示例: task_987654321
     */
    channelTaskId?: string;
    /**
     * requestTime字段
     * Java类型: java.time.Instant
     * 描述: 请求时间
     * 示例: 2023-05-15T10:30:00
     */
    requestTime?: string;
    /**
     * promptId字段
     * Java类型: java.lang.Long
     * 描述: 提示词ID
     */
    promptId?: string|number;
    /**
     * taskCreatedTime字段
     * Java类型: java.time.Instant
     * 描述: 任务创建时间
     */
    taskCreatedTime?: string;
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
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GenerateImageResponse
 * 描述: Image generation result value object
 */
export interface GenerateImageResponse extends BaseResponse {
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: Request ID for tracking
     * 示例: req_123456789
     */
    requestId?: string;
    /**
     * images字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: Generated image resources
     */
    images?: ImageMediaResourceList;
    /**
     * taskId字段
     * Java类型: java.lang.String
     * 描述: Task ID from the generation service
     * 示例: task_987654321
     */
    taskId?: string;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: Status of the generation task
     * 示例: SUCCEEDED
     */
    status?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GenerateVideoResponse
 * 描述: Video generation result value object
 */
export interface GenerateVideoResponse extends BaseResponse {
    /**
     * taskId字段
     * Java类型: java.lang.String
     * 描述: Task ID from the generation service
     * 示例: task_987654321
     */
    taskId?: string;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: Status of the generation task
     * 示例: SUCCEEDED
     */
    status?: string;
    /**
     * videos字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResourceList
     * 描述: Generated video resources
     */
    videos?: VideoMediaResourceList;
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: Request ID for tracking
     * 示例: req_123456789
     */
    requestId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GenerateMusicResponse
 * 描述: Music generation result value object
 */
export interface GenerateMusicResponse extends BaseResponse {
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: Request ID for tracking
     * 示例: req_123456789
     */
    requestId?: string;
    /**
     * audios字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.AudioMediaResourceList
     * 描述: Generated audio resources
     */
    audios?: AudioMediaResourceList;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: Status of the generation task
     * 示例: SUCCEEDED
     */
    status?: string;
    /**
     * taskId字段
     * Java类型: java.lang.String
     * 描述: Task ID from the generation service
     * 示例: task_987654321
     */
    taskId?: string;
    /**
     * lyrics字段
     * Java类型: java.lang.String
     * 描述: Generated lyrics for the music
     */
    lyrics?: string;
}
