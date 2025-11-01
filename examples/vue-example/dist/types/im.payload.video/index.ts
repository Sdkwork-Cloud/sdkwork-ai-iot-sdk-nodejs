import { MediaResourceType } from '../../enums/resource';
import { BaseMsgContent } from '../../types/im.payload';
import { VideoMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgVideoContent
 * 描述: IM视频消息内容类
 */
export interface MsgVideoContent extends BaseMsgContent {
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: 视频资源
     * 示例: {"url":"https://example.com/video.mp4","duration":300,"width":1920,"height":1080}
     */
    resource?: VideoMediaResource;
}
