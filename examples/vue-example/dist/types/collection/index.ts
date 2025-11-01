import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { TreeParentMetadata } from '../../types/tree';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CollectionParam
 * 描述: 分类表单
 */
export interface CollectionParam extends BaseParam {
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型
     */
    contentType?: ContentType;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 上级ID
     */
    parentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 分类描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 分类名称
     */
    name?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     */
    contentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CollectionResponse
 * 描述: Collection Category Value Object
 */
export interface CollectionResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Category ID
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Category description
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Category name
     */
    name?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: Associated content ID
     */
    contentId?: string|number;
    /**
     * childrenIds字段
     * Java类型: java.util.List
     * 描述: Child category IDs
     */
    childrenIds?: Array<string|number>;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: Parent category ID
     */
    parentId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: Associated content type
     */
    contentType?: ContentType;
    /**
     * children字段
     * Java类型: java.util.List
     * 描述: Children of Collection
     */
    children?: Array<Collection>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Collection
 */
export interface Collection {
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     */
    contentType?: ContentType;
    /**
     * parentMetadata字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeParentMetadata
     */
    parentMetadata?: TreeParentMetadata;
    /**
     * children字段
     * Java类型: java.util.List
     */
    children?: Array<Collection>;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     */
    parentId?: string|number;
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     */
    parentUuid?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     */
    contentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * parent字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.collection.PlusCollection
     */
    parent?: Collection;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
}
