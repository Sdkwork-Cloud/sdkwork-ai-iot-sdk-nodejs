import { MediaResourceType } from '../../enums/resource';
import { BaseObject } from '../../types/base';
import { ImageMediaResource } from '../../types/resource';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AuthorInfo
 */
export interface AuthorInfo extends BaseObject {
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * bio字段
     * Java类型: java.lang.String
     */
    bio?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     */
    faceImage?: ImageMediaResource;
    /**
     * email字段
     * Java类型: java.lang.String
     */
    email?: string;
    /**
     * website字段
     * Java类型: java.lang.String
     */
    website?: string;
}
