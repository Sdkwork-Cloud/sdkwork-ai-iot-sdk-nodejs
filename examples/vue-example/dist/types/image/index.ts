import { ImageStatus } from '../../enums/image';
import { MediaResourceType } from '../../enums/resource';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { ImageMediaResource } from '../../types/resource';
import { AuthorInfo } from '../../types/author';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImageParam
 * 描述: 图片信息表单
 */
export interface ImageParam extends BaseParam {
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 图片文件大小
     * 示例: 2097152
     */
    fileSize?: string|number;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 图片高度（像素）
     * 示例: 1080
     */
    height?: number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.image.ImageStatus
     * 描述: 图片状态
     * 示例: COMPLETED
     */
    status?: ImageStatus;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 图片存储URL
     * 示例: https://storage.example.com/images/future_city.jpg
     */
    url?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 图片标题
     * 示例: 未来城市概念图
     */
    title?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: 图片比例
     * 示例: 16:9
     */
    aspectRatio?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 图片描述信息
     * 示例: 这是一张描绘2050年未来城市的概念图
     */
    description?: string;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 图片宽度（像素）
     * 示例: 1920
     */
    width?: number;
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 图片格式
     * 示例: image/jpeg
     */
    format?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImageResponse
 * 描述: 图片信息VO
 */
export interface ImageResponse extends BaseResponse {
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 图片文件大小
     * 示例: 2097152
     */
    fileSize?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
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
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.image.ImageStatus
     * 描述: 图片状态
     * 示例: COMPLETED
     */
    status?: ImageStatus;
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
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 图片资源信息
     */
    resource?: ImageMediaResource;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 图片标题
     * 示例: 未来城市概念图
     */
    title?: string;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 图片存储URL
     * 示例: https://storage.example.com/images/future_city.jpg
     */
    url?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 图片描述信息
     * 示例: 这是一张描绘2050年未来城市的概念图
     */
    description?: string;
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 图片格式
     * 示例: image/jpeg
     */
    format?: string;
    /**
     * aspectRatio字段
     * Java类型: java.lang.String
     * 描述: 图片比例
     * 示例: 16:9
     */
    aspectRatio?: string;
}
