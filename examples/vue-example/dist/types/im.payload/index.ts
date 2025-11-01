import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { BaseObject } from '../../types/base';
import { MsgLocationContent } from '../../types/im.payload.location';
import { MsgAudioContent } from '../../types/im.payload.audio';
import { MsgTextContent } from '../../types/im.payload.text';
import { MsgVideoContent } from '../../types/im.payload.video';
import { MsgFileContent } from '../../types/im.payload.file';
import { MsgMusicContent } from '../../types/im.payload.music';
import { MsgImageContent } from '../../types/im.payload.image';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: BaseMsgContent
 * 描述: IM消息内容基类
 */
export interface BaseMsgContent extends BaseObject {
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 消息内容
     * 示例: 你好，这是一条文本消息
     */
    content?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgPayload
 * 描述: IM消息载体类
 */
export interface MsgPayload extends BaseObject {
    /**
     * location字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.location.MsgLocationContent
     * 描述: 位置消息内容
     * 示例: {"location":{"longitude":116.3974,"latitude":39.9087},"address":"北京市朝阳区某某街道","name":"某某大厦","radius":50.0}
     */
    location?: MsgLocationContent;
    /**
     * audio字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.audio.MsgAudioContent
     * 描述: 音频消息内容
     * 示例: {"resource":{"url":"https://example.com/audio.mp3","format":"MP3","duration":180}}
     */
    audio?: MsgAudioContent;
    /**
     * text字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.text.MsgTextContent
     * 描述: 文本消息内容
     * 示例: {"content":"你好，这是一条文本消息"}
     */
    text?: MsgTextContent;
    /**
     * video字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.video.MsgVideoContent
     * 描述: 视频消息内容
     * 示例: {"resource":{"url":"https://example.com/video.mp4","duration":300,"width":1920,"height":1080}}
     */
    video?: MsgVideoContent;
    /**
     * file字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.file.MsgFileContent
     * 描述: 文件消息内容
     * 示例: {"resource":{"url":"https://example.com/file.pdf","name":"document.pdf"}}
     */
    file?: MsgFileContent;
    /**
     * music字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.music.MsgMusicContent
     * 描述: 音乐消息内容
     * 示例: {"resource":{"url":"https://example.com/music.mp3","format":"MP3","duration":180},"title":"春天的故事","artist":"某某歌手","album":"经典老歌","duration":300}
     */
    music?: MsgMusicContent;
    /**
     * image字段
     * Java类型: com.sdkwork.spring.ai.plus.im.payload.image.MsgImageContent
     * 描述: 图片消息内容
     * 示例: {"resource":{"url":"https://example.com/image.jpg","width":1920,"height":1080}}
     */
    image?: MsgImageContent;
}
