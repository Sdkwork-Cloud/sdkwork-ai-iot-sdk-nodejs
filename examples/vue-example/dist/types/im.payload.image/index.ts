import { MediaResourceType } from '../../enums/resource';
import { BaseMsgContent } from '../../types/im.payload';
import { ImageMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgImageContent
 * 描述: IM图片消息内容类
 */
export interface MsgImageContent extends BaseMsgContent {
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 图片资源
     * 示例: {"url":"https://example.com/image.jpg","width":1920,"height":1080}
     */
    resource?: ImageMediaResource;
}
