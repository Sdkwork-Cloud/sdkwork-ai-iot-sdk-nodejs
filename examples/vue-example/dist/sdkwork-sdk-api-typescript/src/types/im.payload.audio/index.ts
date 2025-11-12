import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { BaseMsgContent } from '../../types/im.payload';
import { AudioMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgAudioContent
 * 描述: IM音频消息内容类
 */
export interface MsgAudioContent extends BaseMsgContent {
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.AudioMediaResource
     * 描述: 音频资源
     * 示例: {"url":"https://example.com/audio.mp3","format":"MP3","duration":180}
     */
    resource?: AudioMediaResource;
}
