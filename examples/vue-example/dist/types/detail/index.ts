import { ContentType, ContentFormat } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { BaseObject, BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DetailParam
 * 描述: Detail Form (Generic detailed content for various entities)
 */
export interface DetailParam extends BaseParam {
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: Associated content ID (foreign key to the corresponding entity's ID)
     */
    contentId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: Content type (e.g., PRODUCT, VIP, NEWS)
     */
    contentType?: ContentType;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.detail.DetailContent
     * 描述: Detailed content (HTML or rich text)
     */
    content?: DetailContent;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DetailContent
 */
export interface DetailContent extends BaseObject {
    /**
     * contents字段
     * Java类型: java.util.Map
     */
    contents?: Map<ContentFormat, string>;
    /**
     * text字段
     * Java类型: java.lang.String
     */
    text?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DetailResponse
 * 描述: Detail Value Object (Generic detailed content for various entities)
 */
export interface DetailResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: 关联产品ID(仅内容类型为商品时有效)
     */
    productId?: string|number;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID(外键关联对应实体的ID)
     */
    contentId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型(如:商品、会员、新闻等)
     */
    contentType?: ContentType;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.detail.DetailContent
     * 描述: 详细内容(HTML或富文本)
     */
    content?: DetailContent;
    /**
     * skuId字段
     * Java类型: java.lang.Long
     * 描述: 关联SkuID(仅内容类型为商品时有效)
     */
    skuId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
}
