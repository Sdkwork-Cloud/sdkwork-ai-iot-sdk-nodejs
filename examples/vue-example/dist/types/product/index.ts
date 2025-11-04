import { SkuStatus, ProductStatus } from '../../enums/product';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { ProjectStatus } from '../../enums/project';
import { ProjectType } from '../../enums/code.objects';
import { PermissionStatus, RoleStatus } from '../../enums/rbac';
import { GenderType, Platform } from '../../enums/enums';
import { UserStatus } from '../../enums/user';
import { ContentType, ContentFormat } from '../../enums/content';
import { CategoryType, CategoryStatus, AttributeType } from '../../enums/ai';
import { BaseParam } from '../../types/base';
import { BaseObject, BaseResponse } from '../../types/base';
import { MediaResourceList, ImageMediaResourceList } from '../../types/resource';
import { Project } from '../../types/project';
import { DetailContent, Detail } from '../../types/detail';
import { Category } from '../../types/category';
import { TagsContent } from '../../types/tags';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SkuParam
 * 描述: Product SKU Form (stock keeping unit data transfer object)
 */
export interface SkuParam extends BaseParam {
    /**
     * attributes字段
     * Java类型: java.util.List
     * 描述: Sku attribute values
     */
    attributes?: Array<AttributeItem>;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: List of product resources
     */
    resources?: MediaResourceList;
    /**
     * skuCode字段
     * Java类型: java.lang.String
     * 描述: Unique SKU code
     * 示例: IP15P-256-TI
     */
    skuCode?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Associated category ID
     */
    categoryId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.SkuStatus
     * 描述: SKU sales status
     */
    status?: SkuStatus;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: SKU title
     * 示例: iPhone 15 Pro 256GB Natural Titanium
     */
    title?: string;
    /**
     * stock字段
     * Java类型: java.lang.Integer
     * 描述: Current stock quantity
     * 示例: 500
     */
    stock?: number;
    /**
     * images字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: List of product images
     */
    images?: ImageMediaResourceList;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     * 描述: Total sales quantity
     * 示例: 1200
     */
    salesCount?: number;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: SKU selling price
     * 示例: 9999.00
     */
    price?: string|number;
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: Associated product ID
     */
    productId?: string|number;
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: Original price (for discount display)
     * 示例: 10999.00
     */
    originalPrice?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ProductParam
 * 描述: Product Form - Used for product data transfer and validation
 */
export interface ProductParam extends BaseParam {
    /**
     * subtitle字段
     * Java类型: java.lang.String
     * 描述: 产品副标题/简短描述
     */
    subtitle?: string;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: 产品价格
     */
    price?: string|number;
    /**
     * stock字段
     * Java类型: java.lang.Integer
     * 描述: 产品库存数量
     */
    stock?: number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.ProductStatus
     * 描述: 产品状态(1:在售,2:下架,3:已停产)
     */
    status?: ProductStatus;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 所属分类ID
     */
    categoryId?: string|number;
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: 产品属性值
     */
    baseAttributes?: Attributes;
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 产品原价(用于显示折扣)
     */
    originalPrice?: string|number;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 产品编码/SKU
     */
    code?: string;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     * 描述: 产品销售数量
     */
    salesCount?: number;
    /**
     * onSaleAt字段
     * Java类型: java.time.Instant
     * 描述: 产品上架时间
     */
    onSaleAt?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 产品名称
     */
    title?: string;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: List of product resources
     */
    resources?: MediaResourceList;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 产品描述(支持HTML格式)
     */
    description?: string;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: 规格属性值
     */
    specAttributes?: Attributes;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Product
 */
export interface Product {
    /**
     * details字段
     * Java类型: java.util.List
     */
    details?: Array<Detail>;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     */
    baseAttributes?: Attributes;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     */
    categoryId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.ProductStatus
     */
    status?: ProductStatus;
    /**
     * stock字段
     * Java类型: java.lang.Integer
     */
    stock?: number;
    /**
     * category字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.category.PlusCategory
     */
    category?: Category;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     */
    price?: string|number;
    /**
     * subtitle字段
     * Java类型: java.lang.String
     */
    subtitle?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     */
    resources?: MediaResourceList;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     */
    specAttributes?: Attributes;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     */
    tags?: TagsContent;
    /**
     * title字段
     * Java类型: java.lang.String
     */
    title?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     */
    salesCount?: number;
    /**
     * onSaleAt字段
     * Java类型: java.time.Instant
     */
    onSaleAt?: string;
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
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     */
    originalPrice?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Attributes
 */
export interface Attributes extends BaseObject {
    /**
     * items字段
     * Java类型: java.util.List
     */
    items?: Array<AttributeItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AttributeItem
 */
export interface AttributeItem extends BaseObject {
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * values字段
     * Java类型: [Ljava.lang.String;
     */
    values?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Sku
 * 描述: Product SKU entity (stock keeping unit details)
 */
export interface Sku {
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: Associated product ID
     */
    productId?: string|number;
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: Original price (for discount display)
     * 示例: 10999.00
     */
    originalPrice?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * onSaleAt字段
     * Java类型: java.time.Instant
     */
    onSaleAt?: string;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     * 描述: Total sales quantity
     * 示例: 1200
     */
    salesCount?: number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: SKU title
     * 示例: iPhone 15 Pro 256GB Natural Titanium
     */
    title?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     */
    tags?: TagsContent;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     */
    resources?: MediaResourceList;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     */
    specAttributes?: Attributes;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: SKU selling price
     * 示例: 9999.00
     */
    price?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
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
     * stock字段
     * Java类型: java.lang.Integer
     * 描述: Current stock quantity
     * 示例: 500
     */
    stock?: number;
    /**
     * category字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.category.PlusCategory
     */
    category?: Category;
    /**
     * skuCode字段
     * Java类型: java.lang.String
     * 描述: Unique SKU code
     * 示例: IP15P-256-TI
     */
    skuCode?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Associated category ID
     */
    categoryId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.SkuStatus
     * 描述: SKU sales status
     */
    status?: SkuStatus;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * details字段
     * Java类型: java.util.List
     * 描述: List of detailed product information
     */
    details?: Array<Detail>;
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     */
    baseAttributes?: Attributes;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SkuResponse
 * 描述: Product SKU Value Object (stock keeping unit details)
 */
export interface SkuResponse extends BaseResponse {
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: Associated product ID
     */
    productId?: string|number;
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: Original price (for discount display)
     * 示例: 10999.00
     */
    originalPrice?: string|number;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     * 描述: Total sales quantity
     * 示例: 1200
     */
    salesCount?: number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Product tags
     */
    tags?: TagsContent;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User ID (foreign key关联plus_user.id)
     */
    userId?: string|number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: SKU title
     * 示例: iPhone 15 Pro 256GB Natural Titanium
     */
    title?: string;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: List of product resources
     */
    resources?: MediaResourceList;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: SKU selling price
     * 示例: 9999.00
     */
    price?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation time, set when entity is first persisted
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update time, updated when entity is modified
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.SkuStatus
     * 描述: SKU sales status
     */
    status?: SkuStatus;
    /**
     * skuCode字段
     * Java类型: java.lang.String
     * 描述: Unique SKU code
     * 示例: IP15P-256-TI
     */
    skuCode?: string;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Associated category ID
     */
    categoryId?: string|number;
    /**
     * stock字段
     * Java类型: java.lang.Integer
     * 描述: Current stock quantity
     * 示例: 500
     */
    stock?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID, auto-generated by database
     */
    id?: string|number;
    /**
     * attributes字段
     * Java类型: java.util.List
     * 描述: Sku attribute values
     */
    attributes?: Array<AttributeItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ProductResponse
 * 描述: Product Value Object - Represents a product in the system with basic information, pricing, inventory, and relationships
 */
export interface ProductResponse extends BaseResponse {
    /**
     * subtitle字段
     * Java类型: java.lang.String
     * 描述: Product subtitle/brief description
     */
    subtitle?: string;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: Product price
     */
    price?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.ProductStatus
     * 描述: Product status (1:在售,2:下架,3:已停产)
     */
    status?: ProductStatus;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: 所属分类ID
     */
    categoryId?: string|number;
    /**
     * stock字段
     * Java类型: java.lang.Integer
     * 描述: Product stock quantity
     */
    stock?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID
     */
    id?: string|number;
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: 产品属性值
     */
    baseAttributes?: Attributes;
    /**
     * originalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: Product original price (for showing discounts)
     */
    originalPrice?: string|number;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: Product code/SKU
     */
    code?: string;
    /**
     * salesCount字段
     * Java类型: java.lang.Integer
     * 描述: Product sales count
     */
    salesCount?: number;
    /**
     * onSaleAt字段
     * Java类型: java.time.Instant
     * 描述: Product on sale at time
     */
    onSaleAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: Product tags
     */
    tags?: TagsContent;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User ID (foreign key关联plus_user.id)
     */
    userId?: string|number;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: Product name
     */
    title?: string;
    /**
     * resources字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: List of product resources, images，videos etc.
     */
    resources?: MediaResourceList;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Product description (HTML format supported)
     */
    description?: string;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: 规格属性值
     */
    specAttributes?: Attributes;
}
