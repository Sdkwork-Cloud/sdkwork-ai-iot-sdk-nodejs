import { OrganizationStatus } from '../../enums/organization';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrganizationParam
 * 描述: 组织Form类
 */
export interface OrganizationParam extends BaseParam {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 组织编码
     */
    code?: string;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父组织ID
     */
    parentId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.organization.OrganizationStatus
     * 描述: 组织状态：1-活跃, 2-未激活, 3-禁用, 4-已删除
     */
    status?: OrganizationStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 组织名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 组织描述
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrganizationResponse
 * 描述: 组织VO对象
 */
export interface OrganizationResponse extends BaseResponse {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 组织编码
     */
    code?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父组织ID
     */
    parentId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.organization.OrganizationStatus
     * 描述: 组织状态：1-活跃, 2-未激活, 3-禁用, 4-已删除
     */
    status?: OrganizationStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 组织ID
     */
    id?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 组织名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 组织描述
     */
    description?: string;
}
