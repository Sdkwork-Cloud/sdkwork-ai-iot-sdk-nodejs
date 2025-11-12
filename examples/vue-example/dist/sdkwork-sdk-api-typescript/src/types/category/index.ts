import { CategoryStatus, AttributeType, CategoryType } from '../../enums/ai';
import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { TreeParentMetadata } from '../../types/tree';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AttributeParam
 * 描述: 商品分类属性Form类，支持商品属性、SKU属性、SKU属性值等定义
 */
export interface AttributeParam extends BaseParam {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 属性编码（唯一标识）
     */
    code?: string;
    /**
     * attributeValue字段
     * Java类型: java.lang.String
     * 描述: 属性值（如颜色：红色、蓝色）
     */
    attributeValue?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 属性描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 属性名称
     */
    name?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID(外键关联对应实体的ID)
     */
    contentId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     * 描述: 属性状态(1:启用,2:禁用,3:删除)
     */
    status?: CategoryStatus;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 所属分类ID
     */
    categoryId?: string|number;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重（值越大排序越靠前）
     */
    sortWeight?: number;
    /**
     * required字段
     * Java类型: java.lang.Integer
     * 描述: 是否必填(0:否,1:是)
     */
    required?: number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型(如:商品、会员、新闻等)
     */
    contentType?: ContentType;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.AttributeType
     * 描述: 属性类型(PROPERTY:商品属性,SKU_ATTRIBUTE:SKU属性,SKU_VALUE:SKU属性值,SPECIFICATION:规格参数)
     */
    type?: AttributeType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CategoryParam
 * 描述: AI分类表单
 */
export interface CategoryParam extends BaseParam {
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重(值越大排序越靠前)
     */
    sortWeight?: number;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父分类ID
     */
    parentId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     * 描述: 分类状态(1:启用,2:禁用,3:删除)
     */
    status?: CategoryStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryType
     * 描述: 分类类型(AGENT:1, TOOL:2, PROMPT:3, OTHER:4)
     */
    type?: CategoryType;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 分类名称
     */
    name?: string;
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: 分类图标URL/路径
     */
    icon?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 分类描述
     */
    description?: string;
    /**
     * visible字段
     * Java类型: java.lang.Integer
     * 描述: 可见性标志(0:隐藏,1:可见)
     */
    visible?: number;
    /**
     * path字段
     * Java类型: [Ljava.lang.String;
     * 描述: 分类路径(格式:1,2,3表示从根分类到当前分类的ID路径)
     */
    path?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CategoryResponse
 * 描述: AI分类VO，用于管理不同内容类型(如Agent、Tool、Prompt等)的分类
 */
export interface CategoryResponse {
    /**
     * attributeIds字段
     * Java类型: java.util.List
     * 描述: 分类属性ID列表
     */
    attributeIds?: Array<string|number>;
    /**
     * children字段
     * Java类型: java.util.List
     * 描述: 子分类列表
     */
    children?: Array<CategoryResponse>;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * path字段
     * Java类型: [Ljava.lang.String;
     * 描述: 分类路径(格式:1,2,3表示从根分类到当前分类的ID路径)
     */
    path?: string[];
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     */
    parentUuid?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     * 描述: 分类状态(1:启用,2:禁用,3:删除)
     */
    status?: CategoryStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 分类名称
     */
    name?: string;
    /**
     * parentMetadata字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeParentMetadata
     */
    parentMetadata?: TreeParentMetadata;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * visible字段
     * Java类型: java.lang.Integer
     * 描述: 可见性标志(0:隐藏,1:可见)
     */
    visible?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryType
     * 描述: 分类类型(1:Agent分类,2:Tool分类,3:Prompt分类,4:其他分类)
     */
    type?: CategoryType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重(值越大排序越靠前)
     */
    sortWeight?: number;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父分类ID
     */
    parentId?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签
     */
    tags?: TagsContent;
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: 分类图标URL/路径
     */
    icon?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 分类描述
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Category
 */
export interface Category {
    /**
     * icon字段
     * Java类型: java.lang.String
     */
    icon?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryType
     */
    type?: CategoryType;
    /**
     * parentMetadata字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeParentMetadata
     */
    parentMetadata?: TreeParentMetadata;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     */
    sortWeight?: number;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     */
    parentId?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     */
    tags?: TagsContent;
    /**
     * parent字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.category.PlusCategory
     */
    parent?: Category;
    /**
     * code字段
     * Java类型: java.lang.String
     */
    code?: string;
    /**
     * visible字段
     * Java类型: java.lang.Integer
     */
    visible?: number;
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     */
    parentUuid?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * attributes字段
     * Java类型: java.util.List
     */
    attributes?: Array<Attribute>;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     */
    status?: CategoryStatus;
    /**
     * path字段
     * Java类型: [Ljava.lang.String;
     */
    path?: string[];
    /**
     * groupName字段
     * Java类型: java.lang.String
     */
    groupName?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * children字段
     * Java类型: java.util.List
     */
    children?: Array<Category>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AttributeResponse
 * 描述: 商品分类属性VO
 */
export interface AttributeResponse extends BaseResponse {
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重
     */
    sortWeight?: number;
    /**
     * required字段
     * Java类型: java.lang.Integer
     * 描述: 是否必填(0:否,1:是)
     */
    required?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.AttributeType
     * 描述: 属性类型(1:商品属性,2:SKU属性,3:SKU属性值,4:规格参数)
     */
    type?: AttributeType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.Long
     * 描述: 版本号，用于乐观锁控制
     */
    version?: string|number;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID(外键关联对应实体的ID)
     */
    contentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 属性描述
     */
    description?: string;
    /**
     * attributeValue字段
     * Java类型: java.lang.String
     * 描述: 属性值
     */
    attributeValue?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 属性编码
     */
    code?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 所属分类ID
     */
    categoryId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     * 描述: 属性状态(1:启用,2:禁用,3:删除)
     */
    status?: CategoryStatus;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型(如:商品、会员、新闻等)
     */
    contentType?: ContentType;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 属性名称
     */
    name?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Attribute
 */
export interface Attribute {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.CategoryStatus
     */
    status?: CategoryStatus;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     */
    categoryId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     */
    contentType?: ContentType;
    /**
     * category字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.category.PlusCategory
     */
    category?: Category;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     */
    sortWeight?: number;
    /**
     * required字段
     * Java类型: java.lang.Integer
     */
    required?: number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ai.AttributeType
     */
    type?: AttributeType;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     */
    contentId?: string|number;
    /**
     * attributeValue字段
     * Java类型: java.lang.String
     */
    attributeValue?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     */
    code?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
}
