import { Platform, PlatformOwner, CommonStatus } from '../../enums/enums';
import { TenantStatus } from '../../enums/tenant';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GetAccessTokenParam
 * 描述: 获取访问令牌请求表单
 */
export interface GetAccessTokenParam extends BaseParam {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     * 示例: 10001
     */
    id?: string|number;
    /**
     * platforms字段
     * Java类型: java.util.Collection
     * 描述: 平台集合
     * 示例: ["H5", "MP_WEIXIN"]
     */
    platforms?: Array<Platform>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TenantParam
 * 描述: 租户信息Form
 */
export interface TenantParam extends BaseParam {
    /**
     * adminUserId字段
     * Java类型: java.lang.Long
     * 描述: 租户管理员用户ID
     */
    adminUserId?: string|number;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 租户唯一编码
     */
    code?: string;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 租户过期时间
     */
    expireTime?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.tenant.TenantStatus
     * 描述: 租户状态
     */
    status?: TenantStatus;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 租户描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 租户名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShardingKeyParam
 * 描述: 分片键Form，用于分片键数据的传输与校验
 */
export interface ShardingKeyParam extends BaseParam {
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     * 描述: 数据拥有者
     */
    owner?: PlatformOwner;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 数据拥有者ID
     */
    ownerId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 数据状态
     */
    status?: CommonStatus;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 描述
     */
    description?: string;
    /**
     * tenantId字段
     * Java类型: java.lang.Long
     * 描述: 租户ID
     */
    tenantId?: string|number;
    /**
     * shardingKey字段
     * Java类型: java.lang.String
     * 描述: 分片Key
     */
    shardingKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShardingKeyResponse
 * 描述: 分片键值对象
 */
export interface ShardingKeyResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     * 描述: 数据拥有者
     */
    owner?: PlatformOwner;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 数据状态
     */
    status?: CommonStatus;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 数据拥有者ID
     */
    ownerId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * shardingKey字段
     * Java类型: java.lang.String
     * 描述: 分片Key
     */
    shardingKey?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 描述
     */
    description?: string;
    /**
     * tenantId字段
     * Java类型: java.lang.Long
     * 描述: 租户ID
     */
    tenantId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TenantResponse
 * 描述: 租户Value Object
 */
export interface TenantResponse extends BaseResponse {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.tenant.TenantStatus
     * 描述: 租户状态
     */
    status?: TenantStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 租户描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 租户名称
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 租户ID
     */
    id?: string|number;
    /**
     * adminUserId字段
     * Java类型: java.lang.Long
     * 描述: 租户管理员用户ID
     */
    adminUserId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 租户唯一编码
     */
    code?: string;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 租户过期时间
     */
    expireTime?: string;
}
