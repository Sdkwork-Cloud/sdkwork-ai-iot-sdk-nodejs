import { RoleStatus, PermissionStatus } from '../../enums/rbac';
import { CommonStatus } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserRoleParam
 * 描述: 用户角色关联Form
 */
export interface UserRoleParam extends BaseParam {
    /**
     * roleId字段
     * Java类型: java.lang.Long
     * 描述: 角色ID(复合主键之一)
     */
    roleId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(复合主键之一)
     */
    userId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RoleParam
 * 描述: 系统角色Form类
 */
export interface RoleParam extends BaseParam {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.rbac.RoleStatus
     * 描述: 角色状态(ACTIVE:活跃,INACTIVE:未激活,LOCKED:锁定)
     */
    status?: RoleStatus;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 角色描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 角色名称
     */
    name?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 角色编码(唯一)
     */
    code?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserRoleKeyParam
 */
export interface UserRoleKeyParam {
    /**
     * roleId字段
     * Java类型: java.lang.Long
     */
    roleId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RolePermissionParam
 * 描述: Role-Permission association Form (stores many-to-many relationship between roles and permissions)
 */
export interface RolePermissionParam extends BaseParam {
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: Permission assignment status (1=Enabled, 0=Disabled)
     */
    enabled?: boolean;
    /**
     * roleUuid字段
     * Java类型: java.lang.String
     * 描述: Role UUID (unique identifier for distributed system references)
     */
    roleUuid?: string;
    /**
     * operatorId字段
     * Java类型: java.lang.Long
     * 描述: Assigner user ID (operator who assigned the permission)
     */
    operatorId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Permission assignment description (business context and purpose)
     */
    description?: string;
    /**
     * roleId字段
     * Java类型: java.lang.Long
     * 描述: Role ID (foreign key reference to plus_role.id)
     */
    roleId?: string|number;
    /**
     * permissionUuid字段
     * Java类型: java.lang.String
     * 描述: Permission UUID (unique identifier for distributed system references)
     */
    permissionUuid?: string;
    /**
     * permissionId字段
     * Java类型: java.lang.Long
     * 描述: Permission ID (foreign key reference to plus_permission.id)
     */
    permissionId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Permission
 */
export interface Permission {
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.rbac.PermissionStatus
     */
    status?: PermissionStatus;
    /**
     * httpMethod字段
     * Java类型: java.lang.String
     */
    httpMethod?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
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
     * sortOrder字段
     * Java类型: java.lang.Integer
     */
    sortOrder?: number;
    /**
     * resourceUrl字段
     * Java类型: java.lang.String
     */
    resourceUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Role
 */
export interface Role {
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * permissions字段
     * Java类型: java.util.List
     */
    permissions?: Array<Permission>;
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
     * code字段
     * Java类型: java.lang.String
     */
    code?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.rbac.RoleStatus
     */
    status?: RoleStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RoleResponse
 * 描述: 系统角色VO类
 */
export interface RoleResponse extends BaseResponse {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 角色编码(唯一)
     */
    code?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.rbac.RoleStatus
     * 描述: 角色状态(ACTIVE:活跃,INACTIVE:未激活,LOCKED:锁定)
     */
    status?: RoleStatus;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 角色ID
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 角色描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 角色名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RolePermissionResponse
 * 描述: Role-Permission association VO (stores many-to-many relationship between roles and permissions)
 */
export interface RolePermissionResponse extends BaseResponse {
    /**
     * roleId字段
     * Java类型: java.lang.Long
     * 描述: Role ID (foreign key reference to plus_role.id)
     */
    roleId?: string|number;
    /**
     * permissionUuid字段
     * Java类型: java.lang.String
     * 描述: Permission UUID (unique identifier for distributed system references)
     */
    permissionUuid?: string;
    /**
     * permissionId字段
     * Java类型: java.lang.Long
     * 描述: Permission ID (foreign key reference to plus_permission.id)
     */
    permissionId?: string|number;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: Permission assignment status (true=Enabled, false=Disabled)
     */
    enabled?: boolean;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: Permission assignment status (ACTIVE: available, INACTIVE: disabled, EXPIRED: expired)
     */
    status?: CommonStatus;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * roleUuid字段
     * Java类型: java.lang.String
     * 描述: Role UUID (unique identifier for distributed system references)
     */
    roleUuid?: string;
    /**
     * operatorId字段
     * Java类型: java.lang.Long
     * 描述: Assigner user ID (operator who assigned the permission)
     */
    operatorId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID, auto-generated by database
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Permission assignment description (business context and purpose)
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserRoleResponse
 * 描述: 用户角色关联关系VO
 */
export interface UserRoleResponse extends BaseResponse {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(复合主键之一)
     */
    userId?: string|number;
    /**
     * roleId字段
     * Java类型: java.lang.Long
     * 描述: 角色ID(复合主键之一)
     */
    roleId?: string|number;
}
