import { MediaResourceType } from '../../enums/resource';
import { BaseMsgContent } from '../../types/im.payload';
import { FileMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgFileContent
 * 描述: IM文件消息内容类
 */
export interface MsgFileContent extends BaseMsgContent {
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.FileMediaResource
     * 描述: 文件资源
     * 示例: {"url":"https://example.com/file.pdf","name":"document.pdf"}
     */
    resource?: FileMediaResource;
}
