import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GetUrlResult
 * 描述: URL Generation Result
 */
export interface GetUrlResult extends BaseObject {
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: Direct access URL
     */
    url?: string;
    /**
     * objectKey字段
     * Java类型: java.lang.String
     * 描述: Object key for the file
     */
    objectKey?: string;
    /**
     * previewUrl字段
     * Java类型: java.lang.String
     * 描述: Preview URL for the file
     */
    previewUrl?: string;
}
