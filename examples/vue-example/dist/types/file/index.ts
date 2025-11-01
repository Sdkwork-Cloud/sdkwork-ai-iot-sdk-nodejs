import { ContentFormat } from '../../enums/content';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileContentObject
 */
export interface FileContentObject extends BaseObject {
    /**
     * text字段
     * Java类型: java.lang.String
     */
    text?: string;
    /**
     * contents字段
     * Java类型: java.util.Map
     */
    contents?: Map<ContentFormat, string>;
}
