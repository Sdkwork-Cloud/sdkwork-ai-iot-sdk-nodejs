import { InvitationCodeStatus, RewardType, RewardStatus } from '../../enums/invitation';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvitationCodeParam
 * 描述: 邀请码Form
 */
export interface InvitationCodeParam extends BaseParam {
    /**
     * usageLimit字段
     * Java类型: java.lang.Integer
     * 描述: 使用限制次数
     */
    usageLimit?: number;
    /**
     * creatorUserId字段
     * Java类型: java.lang.Long
     * 描述: 创建者ID
     */
    creatorUserId?: string|number;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 邀请码值
     */
    code?: string;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expireTime?: string;
    /**
     * usedCount字段
     * Java类型: java.lang.Integer
     * 描述: 已使用次数
     */
    usedCount?: number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.InvitationCodeStatus
     * 描述: 邀请码状态
     */
    status?: InvitationCodeStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvitationRelationParam
 * 描述: 邀请关系Form
 */
export interface InvitationRelationParam extends BaseParam {
    /**
     * inviteCode字段
     * Java类型: java.lang.String
     * 描述: 邀请码
     */
    inviteCode?: string;
    /**
     * rewardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.RewardType
     * 描述: 奖励类型
     */
    rewardType?: RewardType;
    /**
     * inviterUserId字段
     * Java类型: java.lang.Long
     * 描述: 邀请人ID
     */
    inviterUserId?: string|number;
    /**
     * usedTime字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    usedTime?: string;
    /**
     * rewardStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.RewardStatus
     * 描述: 奖励状态
     */
    rewardStatus?: RewardStatus;
    /**
     * inviteeUserId字段
     * Java类型: java.lang.Long
     * 描述: 被邀请人ID
     */
    inviteeUserId?: string|number;
    /**
     * relationLevel字段
     * Java类型: java.lang.Integer
     * 描述: 关系级别（1=直接，2=二级等）
     */
    relationLevel?: number;
    /**
     * rewardAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 奖励金额
     */
    rewardAmount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvitationCodeResponse
 * 描述: 邀请码VO对象
 */
export interface InvitationCodeResponse extends BaseResponse {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.InvitationCodeStatus
     * 描述: 邀请码状态
     */
    status?: InvitationCodeStatus;
    /**
     * usedCount字段
     * Java类型: java.lang.Integer
     * 描述: 已使用次数
     */
    usedCount?: number;
    /**
     * usageLimit字段
     * Java类型: java.lang.Integer
     * 描述: 使用限制次数
     */
    usageLimit?: number;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 邀请码值
     */
    code?: string;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expireTime?: string;
    /**
     * creatorUserId字段
     * Java类型: java.lang.Long
     * 描述: 创建者ID
     */
    creatorUserId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InvitationRelationResponse
 * 描述: 邀请关系VO
 */
export interface InvitationRelationResponse extends BaseResponse {
    /**
     * rewardStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.RewardStatus
     * 描述: 奖励状态
     */
    rewardStatus?: RewardStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: UUID
     */
    uuid?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     */
    id?: string|number;
    /**
     * relationLevel字段
     * Java类型: java.lang.Integer
     * 描述: 关系等级（1=直接，2=二级等）
     */
    relationLevel?: number;
    /**
     * rewardAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 奖励金额
     */
    rewardAmount?: string|number;
    /**
     * inviteeUserId字段
     * Java类型: java.lang.Long
     * 描述: 被邀请人用户ID
     */
    inviteeUserId?: string|number;
    /**
     * inviteCode字段
     * Java类型: java.lang.String
     * 描述: 邀请码
     */
    inviteCode?: string;
    /**
     * rewardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.invitation.RewardType
     * 描述: 奖励类型
     */
    rewardType?: RewardType;
    /**
     * usedTime字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    usedTime?: string;
    /**
     * inviterUserId字段
     * Java类型: java.lang.Long
     * 描述: 邀请人用户ID
     */
    inviterUserId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
}
