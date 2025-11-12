import { ShortUrlStatus } from '../../enums/url';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShortUrlParam
 * 描述: Short URL Form (data transfer object for short URL creation and update)
 */
export interface ShortUrlParam extends BaseParam {
    /**
     * createdBy字段
     * Java类型: java.lang.Long
     * 描述: Creator user ID (null for system-generated URLs)
     */
    createdBy?: string|number;
    /**
     * originalUrl字段
     * Java类型: java.lang.String
     * 描述: Original long URL (full target address)
     */
    originalUrl?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Short URL description (supplementary notes)
     */
    description?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.url.ShortUrlStatus
     * 描述: Short URL status (operational state control)
     */
    status?: ShortUrlStatus;
    /**
     * shortCode字段
     * Java类型: java.lang.String
     * 描述: Short URL code (unique access identifier)
     */
    shortCode?: string;
    /**
     * expiresAt字段
     * Java类型: java.time.Instant
     * 描述: Short URL expiration time (null indicates permanent validity)
     */
    expiresAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShortUrlResponse
 * 描述: Short URL VO (stores short URL metadata and access statistics)
 */
export interface ShortUrlResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID
     */
    id?: string|number;
    /**
     * originalUrl字段
     * Java类型: java.lang.String
     * 描述: Original long URL (full target address)
     */
    originalUrl?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Short URL description (supplementary notes)
     */
    description?: string;
    /**
     * shortCode字段
     * Java类型: java.lang.String
     * 描述: Short URL code (unique access identifier)
     */
    shortCode?: string;
    /**
     * expiresAt字段
     * Java类型: java.time.Instant
     * 描述: Short URL expiration time (null indicates permanent validity)
     */
    expiresAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update time
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.url.ShortUrlStatus
     * 描述: Short URL status (active/inactive/expired)
     */
    status?: ShortUrlStatus;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * clickCount字段
     * Java类型: java.lang.Integer
     * 描述: Total click count of the short URL
     */
    clickCount?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation time
     */
    createdAt?: string;
    /**
     * createdBy字段
     * Java类型: java.lang.Long
     * 描述: Creator user ID (null for system-generated URLs)
     */
    createdBy?: string|number;
}
