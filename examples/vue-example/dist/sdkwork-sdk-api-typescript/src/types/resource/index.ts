import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { TagsContent } from '../../types/tags';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AudioMediaResource
 * 描述: 音频媒体资源
 */
export interface AudioMediaResource extends MediaResource {
    /**
     * sampleRate字段
     * Java类型: java.lang.Integer
     * 描述: 采样率
     * 示例: 44100
     */
    sampleRate?: number;
    /**
     * format字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.AudioFormat
     * 描述: 音频格式
     * 示例: MP3
     */
    format?: AudioFormat;
    /**
     * channels字段
     * Java类型: java.lang.Integer
     * 描述: 声道数
     * 示例: 2
     */
    channels?: number;
    /**
     * bitRate字段
     * Java类型: java.lang.Integer
     * 描述: 比特率
     * 示例: 320
     */
    bitRate?: number;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 音频时长(秒)
     * 示例: 180
     */
    duration?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MediaResource
 * 描述: 媒体资源基类
 */
export interface MediaResource extends BaseObject {
    /**
     * bytes字段
     * Java类型: [B
     * 描述: 资源字节数据
     * 示例: [...]
     */
    bytes?: number[];
    /**
     * localFile字段
     * Java类型: java.lang.Object
     */
    localFile?: Object;
    /**
     * size字段
     * Java类型: java.lang.Long
     * 描述: 资源大小(字节)
     * 示例: 1024
     */
    size?: string|number;
    /**
     * extension字段
     * Java类型: java.lang.String
     * 描述: 资源扩展名
     * 示例: mp4
     */
    extension?: string;
    /**
     * metadata字段
     * Java类型: java.util.Map
     * 描述: 资源元数据
     */
    metadata?: Map<string, Object>;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 资源标签
     */
    tags?: TagsContent;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 资源URL
     * 示例: https://example.com/resource.mp4
     */
    url?: string;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: AI生成提示词
     * 示例: 一只猫
     */
    prompt?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceType
     * 描述: 资源类型
     * 示例: IMAGE
     */
    type?: MediaResourceType;
    /**
     * mimeType字段
     * Java类型: java.lang.String
     * 描述: 资源MIME类型
     * 示例: image/png
     */
    mimeType?: string;
    /**
     * base64字段
     * Java类型: java.lang.String
     * 描述: 资源Base64编码
     * 示例: data:image/png;base64,...
     */
    base64?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 资源名称
     * 示例: resource.mp4
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VideoMediaResource
 * 描述: 视频媒体资源
 */
export interface VideoMediaResource extends MediaResource {
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 视频高度(像素)
     * 示例: 1080
     */
    height?: number;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 视频宽度(像素)
     * 示例: 1920
     */
    width?: number;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 视频时长(秒)
     * 示例: 300
     */
    duration?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MusicMediaResource
 * 描述: 音乐媒体资源
 */
export interface MusicMediaResource extends MediaResource {
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 音乐时长(秒)
     * 示例: 180
     */
    duration?: number;
    /**
     * format字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.AudioFormat
     * 描述: 音频格式
     * 示例: MP3
     */
    format?: AudioFormat;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VideoMediaResourceList
 * 描述: 视频媒体资源列表
 */
export interface VideoMediaResourceList extends BaseObject {
    /**
     * videos字段
     * Java类型: java.util.List
     * 描述: 视频资源列表
     * 示例: [{"url":"https://example.com/video1.mp4","duration":300,"width":1920,"height":1080}]
     */
    videos?: Array<VideoMediaResource>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AudioMediaResourceList
 * 描述: 音频媒体资源列表
 */
export interface AudioMediaResourceList extends BaseObject {
    /**
     * audios字段
     * Java类型: java.util.List
     * 描述: 音频资源列表
     * 示例: [{"url":"https://example.com/audio1.mp3","format":"MP3","duration":180}]
     */
    audios?: Array<AudioMediaResource>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileMediaResource
 * 描述: 文件媒体资源
 */
export interface FileMediaResource extends MediaResource {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 文件名
     * 示例: document.pdf
     */
    name?: string;
    /**
     * mime_type字段
     * Java类型: java.lang.String
     * 描述: MIME类型
     * 示例: application/pdf
     */
    mime_type?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MediaResourceList
 * 描述: 媒体资源列表
 */
export interface MediaResourceList extends BaseObject {
    /**
     * images字段
     * Java类型: java.util.List
     * 描述: 图片资源列表
     * 示例: [{"url":"https://example.com/image1.jpg","width":1920,"height":1080}]
     */
    images?: Array<ImageMediaResource>;
    /**
     * videos字段
     * Java类型: java.util.List
     * 描述: 视频资源列表
     * 示例: [{"url":"https://example.com/video1.mp4","duration":300,"width":1920,"height":1080}]
     */
    videos?: Array<VideoMediaResource>;
    /**
     * audios字段
     * Java类型: java.util.List
     * 描述: 音频资源列表
     * 示例: [{"url":"https://example.com/audio1.mp3","format":"MP3","duration":180}]
     */
    audios?: Array<AudioMediaResource>;
    /**
     * musics字段
     * Java类型: java.util.List
     * 描述: 音乐资源列表
     * 示例: [{"url":"https://example.com/music1.mp3","format":"MP3","duration":180}]
     */
    musics?: Array<MusicMediaResource>;
    /**
     * files字段
     * Java类型: java.util.List
     * 描述: 文件资源列表
     * 示例: [{"url":"https://example.com/file1.pdf","name":"document.pdf"}]
     */
    files?: Array<FileMediaResource>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImageMediaResource
 * 描述: 图片媒体资源
 */
export interface ImageMediaResource extends MediaResource {
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 图片宽度(像素)
     * 示例: 1920
     */
    width?: number;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 图片高度(像素)
     * 示例: 1080
     */
    height?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ImageMediaResourceList
 * 描述: 图片媒体资源列表
 */
export interface ImageMediaResourceList extends BaseObject {
    /**
     * images字段
     * Java类型: java.util.List
     * 描述: 图片资源列表
     * 示例: [{"url":"https://example.com/image1.jpg","width":1920,"height":1080}]
     */
    images?: Array<ImageMediaResource>;
}
