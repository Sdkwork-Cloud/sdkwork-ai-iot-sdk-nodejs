import { ProjectStatus } from '../../enums/project';
import { ProjectType } from '../../enums/code.objects';
import { PermissionStatus, RoleStatus } from '../../enums/rbac';
import { GenderType, Platform } from '../../enums/enums';
import { MediaResourceType } from '../../enums/resource';
import { UserStatus } from '../../enums/user';
import { BaseParam } from '../../types/base';
import { User } from '../../types/user';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ProjectParam
 * 描述: 项目信息Form(维护项目基本信息、状态及关联关系)
 */
export interface ProjectParam extends BaseParam {
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 项目编码(业务编码，如PROJ2024001)
     */
    code?: string;
    /**
     * budgetAmount字段
     * Java类型: java.lang.Long
     * 描述: 项目预算金额(单位：分)
     */
    budgetAmount?: string|number;
    /**
     * isDeleted字段
     * Java类型: java.lang.Boolean
     * 描述: 是否删除(true:已删除,false:未删除)
     */
    isDeleted?: boolean;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 项目描述(详细功能说明)
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 项目名称(唯一标识)
     */
    name?: string;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 项目结束时间
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 项目开始时间
     */
    startTime?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.project.ProjectStatus
     * 描述: 项目状态(1:规划中,2:进行中,3:已暂停,4:已完成,5:已取消)
     */
    status?: ProjectStatus;
    /**
     * leaderId字段
     * Java类型: java.lang.Long
     * 描述: 项目负责人ID(关联用户表)
     */
    leaderId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Project
 */
export interface Project {
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
     * endTime字段
     * Java类型: java.time.Instant
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     */
    startTime?: string;
    /**
     * fileId字段
     * Java类型: java.lang.Long
     */
    fileId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.project.ProjectStatus
     */
    status?: ProjectStatus;
    /**
     * sitePath字段
     * Java类型: java.lang.String
     */
    sitePath?: string;
    /**
     * domainPrefix字段
     * Java类型: java.lang.String
     */
    domainPrefix?: string;
    /**
     * budgetAmount字段
     * Java类型: java.lang.Long
     */
    budgetAmount?: string|number;
    /**
     * isDeleted字段
     * Java类型: java.lang.Boolean
     */
    isDeleted?: boolean;
    /**
     * isTemplate字段
     * Java类型: java.lang.Boolean
     */
    isTemplate?: boolean;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
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
     * title字段
     * Java类型: java.lang.String
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.PlusProjectType
     */
    type?: ProjectType;
    /**
     * leaderId字段
     * Java类型: java.lang.Long
     */
    leaderId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * leader字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.user.PlusUser
     */
    leader?: User;
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
     * author字段
     * Java类型: java.lang.String
     */
    author?: string;
    /**
     * conversationId字段
     * Java类型: java.lang.Long
     */
    conversationId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ProjectResponse
 * 描述: 项目信息VO对象(维护项目基本信息、状态及关联关系)
 */
export interface ProjectResponse extends BaseResponse {
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 项目开始时间
     */
    startTime?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 项目结束时间
     */
    endTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 项目名称(唯一标识)
     */
    name?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.project.ProjectStatus
     * 描述: 项目状态(1:规划中,2:进行中,3:已暂停,4:已完成,5:已取消)
     */
    status?: ProjectStatus;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * isDeleted字段
     * Java类型: java.lang.Boolean
     * 描述: 是否删除(true:已删除,false:未删除)
     */
    isDeleted?: boolean;
    /**
     * budgetAmount字段
     * Java类型: java.lang.Long
     * 描述: 项目预算金额(单位：分)
     */
    budgetAmount?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 项目描述(详细功能说明)
     */
    description?: string;
    /**
     * leaderId字段
     * Java类型: java.lang.Long
     * 描述: 项目负责人ID(关联用户表)
     */
    leaderId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 项目编码(业务编码)
     */
    code?: string;
}
