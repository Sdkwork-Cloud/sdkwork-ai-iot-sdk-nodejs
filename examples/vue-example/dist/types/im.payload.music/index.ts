import { AudioFormat } from '../../enums/audio';
import { MediaResourceType } from '../../enums/resource';
import { BaseMsgContent } from '../../types/im.payload';
import { MusicMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgMusicContent
 * 描述: IM音乐消息内容类
 */
export interface MsgMusicContent extends BaseMsgContent {
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 音乐标题
     * 示例: 春天的故事
     */
    title?: string;
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 音乐时长(秒)
     * 示例: 300
     */
    duration?: number;
    /**
     * album字段
     * Java类型: java.lang.String
     * 描述: 音乐专辑名称
     * 示例: 经典老歌
     */
    album?: string;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MusicMediaResource
     * 描述: 音频资源
     * 示例: {"url":"https://example.com/music.mp3","format":"MP3","duration":180}
     */
    resource?: MusicMediaResource;
    /**
     * artist字段
     * Java类型: java.lang.String
     * 描述: 音乐艺术家或歌手
     * 示例: 某某歌手
     */
    artist?: string;
}
