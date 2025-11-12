import { MusicStatus } from '../../enums/music';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { ImageMediaResourceList, MediaResourceList, MusicMediaResource } from '../../types/resource';
import { AuthorInfo } from '../../types/author';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MusicParam
 * 描述: 音乐信息Form
 */
export interface MusicParam extends BaseParam {
    /**
     * genre字段
     * Java类型: java.lang.String
     * 描述: 音乐流派
     * 示例: Electronic
     */
    genre?: string;
    /**
     * thumbnailUrl字段
     * Java类型: java.lang.String
     * 描述: 音乐缩略图URL
     * 示例: https://storage.example.com/covers/future_city_cover.jpg
     */
    thumbnailUrl?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.music.MusicStatus
     * 描述: 音乐状态
     * 示例: COMPLETED
     */
    status?: MusicStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 音乐存储URL
     * 示例: https://storage.example.com/music/future_city_theme.mp3
     */
    contentUrl?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 音乐时长（秒）
     * 示例: 180
     */
    duration?: number;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 音乐文件大小
     * 示例: 10485760
     */
    fileSize?: string|number;
    /**
     * bitrate字段
     * Java类型: java.lang.Integer
     * 描述: 音频比特率
     * 示例: 320
     */
    bitrate?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 音乐描述信息
     * 示例: 这是一段AI生成的未来城市科幻风格主题曲
     */
    description?: string;
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 音乐格式
     * 示例: mp3
     */
    format?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 音乐标题
     * 示例: 未来城市主题曲
     */
    title?: string;
    /**
     * artist字段
     * Java类型: java.lang.String
     * 描述: 艺术家名称
     * 示例: AI Composer
     */
    artist?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MusicResponse
 * 描述: 音乐信息VO
 */
export interface MusicResponse extends BaseResponse {
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 音乐封面图片列表
     * 示例: {"images":[{"url":"https://example.com/cover1.jpg","width":512,"height":512},{"url":"https://example.com/cover2.jpg","width":256,"height":256}]}
     */
    coverImages?: ImageMediaResourceList;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 音乐资源列表
     * 示例: {"audios":[{"url":"https://example.com/music/future_city_theme.mp3","format":"MP3","duration":180}]}
     */
    resourceList?: MediaResourceList;
    /**
     * thumbnailUrl字段
     * Java类型: java.lang.String
     * 描述: 音乐缩略图URL
     * 示例: https://storage.example.com/covers/future_city_cover.jpg
     */
    thumbnailUrl?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.music.MusicStatus
     * 描述: 音乐状态
     * 示例: COMPLETED
     */
    status?: MusicStatus;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * genre字段
     * Java类型: java.lang.String
     * 描述: 音乐流派
     * 示例: Electronic
     */
    genre?: string;
    /**
     * fileSize字段
     * Java类型: java.lang.Long
     * 描述: 音乐文件大小
     * 示例: 10485760
     */
    fileSize?: string|number;
    /**
     * contentUrl字段
     * Java类型: java.lang.String
     * 描述: 音乐存储URL
     * 示例: https://storage.example.com/music/future_city_theme.mp3
     */
    contentUrl?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 音乐时长（秒）
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
     * title字段
     * Java类型: java.lang.String
     * 描述: 音乐标题
     * 示例: 未来城市主题曲
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
     * bitrate字段
     * Java类型: java.lang.Integer
     * 描述: 音频比特率
     * 示例: 320
     */
    bitrate?: number;
    /**
     * format字段
     * Java类型: java.lang.String
     * 描述: 音乐格式
     * 示例: mp3
     */
    format?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 音乐描述信息
     * 示例: 这是一段AI生成的未来城市科幻风格主题曲
     */
    description?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.author.AuthorInfo
     * 描述: 作者信息
     */
    author?: AuthorInfo;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MusicMediaResource
     * 描述: 资源信息
     * 示例: {"url":"https://example.com/music/future_city_theme.mp3","format":"MP3","duration":180}
     */
    resource?: MusicMediaResource;
    /**
     * artist字段
     * Java类型: java.lang.String
     * 描述: 艺术家名称
     * 示例: AI Composer
     */
    artist?: string;
}
