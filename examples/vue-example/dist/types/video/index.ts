import { VideoStatus } from '../../enums/video';
import { MediaResourceType } from '../../enums/resource';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { VideoMediaResource } from '../../types/resource';
import { AuthorInfo } from '../../types/author';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VideoParam
 * 描述: 视频信息Form
 */
export interface VideoParam extends BaseParam {
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 视频格式
     * 示例: mp4
     */
    format?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 视频描述信息
     * 示例: 这是一段AI生成的未来城市科幻宣传视频
     */
    description?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: 视频比例
     * 示例: 16:9
     */
    aspectRatio?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 视频标题
     * 示例: 未来城市宣传视频
     */
    title?: string;
    /**
     * resolution字段
     * Java类型: java.lang.String
     * 描述: 视频分辨率
     * 示例: 1920x1080
     */
    resolution?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 视频时长（秒）
     * 示例: 180
     */
    duration?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 视频存储URL
     * 示例: https://storage.example.com/videos/future_city.mp4
     */
    contentUrl?: string;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 视频文件大小
     * 示例: 52428800
     */
    fileSize?: string|number;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 图片宽度（像素）
     * 示例: 1920
     */
    width?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 图片高度（像素）
     * 示例: 1080
     */
    height?: number;
    /**
     * thumbnailUrl字段
     * Java类型: java.lang.String
     * 描述: 视频缩略图URL
     * 示例: https://storage.example.com/thumbnails/future_city_thumb.jpg
     */
    thumbnailUrl?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.video.VideoStatus
     * 描述: 视频状态
     * 示例: COMPLETED
     */
    status?: VideoStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VideoResponse
 * 描述: 视频信息VO
 */
export interface VideoResponse extends BaseResponse {
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 视频格式
     * 示例: mp4
     */
    format?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 视频描述信息
     * 示例: 这是一段AI生成的未来城市科幻宣传视频
     */
    description?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: 视频比例
     * 示例: 16:9
     */
    aspectRatio?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 视频标题
     * 示例: 未来城市宣传视频
     */
    title?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     * 示例: f47ac10b-58cc-4372-a567-0e02b2c3d479
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.Long
     * 描述: 版本号，用于乐观锁控制
     * 示例: 1
     */
    version?: string|number;
    /**
     * resolution字段
     * Java类型: java.lang.String
     * 描述: 视频分辨率
     * 示例: 1920x1080
     */
    resolution?: string;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: 视频资源信息
     */
    resource?: VideoMediaResource;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 图片宽度（像素）
     * 示例: 1920
     */
    width?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     * 示例: 123456789
     */
    id?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 图片高度（像素）
     * 示例: 1080
     */
    height?: number;
    /**
     * thumbnailUrl字段
     * Java类型: java.lang.String
     * 描述: 视频缩略图URL
     * 示例: https://storage.example.com/thumbnails/future_city_thumb.jpg
     */
    thumbnailUrl?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.video.VideoStatus
     * 描述: 视频状态
     * 示例: COMPLETED
     */
    status?: VideoStatus;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 视频时长（秒）
     * 示例: 180
     */
    duration?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 视频存储URL
     * 示例: https://storage.example.com/videos/future_city.mp4
     */
    contentUrl?: string;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 视频文件大小
     * 示例: 52428800
     */
    fileSize?: string|number;
}
