import { VipLevelBenefitStatus, VipStatus, VipBenefitType } from '../../enums/vip';
import { PointChangeType, RechargeType } from '../../enums/account';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipRechargePackageParam
 * 描述: VIP充值套餐Form
 */
export interface VipRechargePackageParam extends BaseParam {
    /**
     * pointAmount字段
     * Java类型: java.lang.Long
     * 描述: 赠送灵点数量
     */
    pointAmount?: string|number;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: 套餐价格(元)
     */
    price?: string|number;
    /**
     * validFrom字段
     * Java类型: java.time.Instant
     * 描述: 套餐有效期开始时间
     */
    validFrom?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 套餐描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 套餐名称
     */
    name?: string;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 套餐状态(1-上架 2-下架)
     */
    status?: number;
    /**
     * validTo字段
     * Java类型: java.time.Instant
     * 描述: 套餐有效期结束时间
     */
    validTo?: string;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重
     */
    sortWeight?: number;
    /**
     * vipDurationDays字段
     * Java类型: java.lang.Integer
     * 描述: VIP时长(天)
     */
    vipDurationDays?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipLevelBenefitParam
 * 描述: VIP等级权益关联表Form
 */
export interface VipLevelBenefitParam extends BaseParam {
    /**
     * monthlyLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每月使用限制次数
     */
    monthlyLimit?: number;
    /**
     * benefitId字段
     * Java类型: java.lang.Long
     * 描述: 权益ID，关联plus_vip_benefit表
     */
    benefitId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipLevelBenefitStatus
     * 描述: 是否启用(1-启用 0-禁用)
     */
    status?: VipLevelBenefitStatus;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * specialConfig字段
     * Java类型: java.lang.String
     * 描述: 特殊配置(JSON格式)
     */
    specialConfig?: string;
    /**
     * totalLimit字段
     * Java类型: java.lang.Integer
     * 描述: 总使用限制次数
     */
    totalLimit?: number;
    /**
     * dailyLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每日使用限制次数
     */
    dailyLimit?: number;
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: VIP等级ID，关联plus_vip_level表
     */
    vipLevelId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipPointChangeParam
 * 描述: VIP积分变动记录Form
 */
export interface VipPointChangeParam extends BaseParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * changeAmount字段
     * Java类型: java.lang.Long
     * 描述: 变动数量(正数为增加，负数为减少)
     */
    changeAmount?: string|number;
    /**
     * afterBalance字段
     * Java类型: java.lang.Long
     * 描述: 变动后余额
     */
    afterBalance?: string|number;
    /**
     * beforeBalance字段
     * Java类型: java.lang.Long
     * 描述: 变动前余额
     */
    beforeBalance?: string|number;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * sourceType字段
     * Java类型: java.lang.String
     * 描述: 业务来源类型
     */
    sourceType?: string;
    /**
     * changeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.PointChangeType
     * 描述: 变动类型
     */
    changeType?: PointChangeType;
    /**
     * sourceId字段
     * Java类型: java.lang.Long
     * 描述: 业务来源ID(如充值记录ID、订单ID等)
     */
    sourceId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipUserParam
 * 描述: VIP会员用户信息Form
 */
export interface VipUserParam extends BaseParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * totalRechargedPoints字段
     * Java类型: java.lang.Long
     * 描述: 累计充值灵点(积分)
     */
    totalRechargedPoints?: string|number;
    /**
     * pointBalance字段
     * Java类型: java.lang.Long
     * 描述: 当前灵点(积分)余额
     */
    pointBalance?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipStatus
     * 描述: 会员状态
     */
    status?: VipStatus;
    /**
     * validTo字段
     * Java类型: java.time.Instant
     * 描述: 会员有效期结束时间
     */
    validTo?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * validFrom字段
     * Java类型: java.time.Instant
     * 描述: 会员有效期开始时间
     */
    validFrom?: string;
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: 当前VIP等级ID
     */
    vipLevelId?: string|number;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: 最后活跃时间
     */
    lastActiveTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipLevelParam
 * 描述: VIP等级Form对象
 */
export interface VipLevelParam extends BaseParam {
    /**
     * requiredPoints字段
     * Java类型: java.lang.Long
     * 描述: 晋升到此等级所需的累计灵点数
     */
    requiredPoints?: string|number;
    /**
     * levelValue字段
     * Java类型: java.lang.Integer
     * 描述: 等级值，用于排序和内部逻辑判断, e.g., 1 for Gold, 2 for Platinum
     */
    levelValue?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 等级描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 等级名称, e.g., 黄金会员, 铂金会员
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipRechargeParam
 * 描述: VIP充值记录Form
 */
export interface VipRechargeParam extends BaseParam {
    /**
     * pointAmount字段
     * Java类型: java.lang.Long
     * 描述: 充值获得的灵点数量
     */
    pointAmount?: string|number;
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: VIP等级ID，关联plus_vip_level表
     */
    vipLevelId?: string|number;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 充值金额(元)
     */
    amount?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * rechargeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.RechargeType
     * 描述: 充值类型
     */
    rechargeType?: RechargeType;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 充值状态(1-成功 2-失败 3-处理中)
     */
    status?: number;
    /**
     * rechargeTime字段
     * Java类型: java.time.Instant
     * 描述: 充值时间
     */
    rechargeTime?: string;
    /**
     * transactionNo字段
     * Java类型: java.lang.String
     * 描述: 交易流水号
     */
    transactionNo?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipBenefitUsageParam
 * 描述: VIP权益使用记录Form
 */
export interface VipBenefitUsageParam extends BaseParam {
    /**
     * benefitType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipBenefitType
     * 描述: 权益类型
     */
    benefitType?: VipBenefitType;
    /**
     * sourceType字段
     * Java类型: java.lang.String
     * 描述: 业务来源类型
     */
    sourceType?: string;
    /**
     * sourceId字段
     * Java类型: java.lang.Long
     * 描述: 业务来源ID(如订单ID等)
     */
    sourceId?: string|number;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 状态(1-成功 2-失败)
     */
    status?: number;
    /**
     * usageCount字段
     * Java类型: java.lang.Integer
     * 描述: 使用数量
     */
    usageCount?: number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * usageTime字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    usageTime?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipBenefitParam
 * 描述: VIP权益定义表单
 */
export interface VipBenefitParam extends BaseParam {
    /**
     * benefitKey字段
     * Java类型: java.lang.String
     * 描述: 权益标识符，用于程序内部识别
     */
    benefitKey?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipBenefitType
     * 描述: 权益类型，用于程序内部处理
     */
    type?: VipBenefitType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 权益的详细描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 权益名称, e.g., '每月免费灵点', '专属客服'
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipBenefitResponse
 * 描述: VIP权益定义VO
 */
export interface VipBenefitResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 权益ID
     */
    id?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 权益名称, e.g., '每月免费灵点', '专属客服'
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 权益的详细描述
     */
    description?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipBenefitType
     * 描述: 权益类型，用于程序内部处理
     */
    type?: VipBenefitType;
    /**
     * benefitKey字段
     * Java类型: java.lang.String
     * 描述: 权益标识符，用于程序内部识别
     */
    benefitKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipRechargeResponse
 * 描述: VIP充值记录Value Object
 */
export interface VipRechargeResponse extends BaseResponse {
    /**
     * rechargeTime字段
     * Java类型: java.time.Instant
     * 描述: 充值时间
     */
    rechargeTime?: string;
    /**
     * transactionNo字段
     * Java类型: java.lang.String
     * 描述: 交易流水号
     */
    transactionNo?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * pointAmount字段
     * Java类型: java.lang.Long
     * 描述: 充值获得的灵点数量
     */
    pointAmount?: string|number;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 充值金额(元)
     */
    amount?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 会员等级ID
     */
    id?: string|number;
    /**
     * rechargeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.RechargeType
     * 描述: 充值类型
     */
    rechargeType?: RechargeType;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 充值状态(1-成功 2-失败 3-处理中)
     */
    status?: number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: VIP等级ID，关联plus_vip_level表
     */
    vipLevelId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipRechargePackageResponse
 * 描述: VIP充值套餐VO对象
 */
export interface VipRechargePackageResponse extends BaseResponse {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 套餐名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 套餐描述
     */
    description?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 套餐ID
     */
    id?: string|number;
    /**
     * validFrom字段
     * Java类型: java.time.Instant
     * 描述: 套餐有效期开始时间
     */
    validFrom?: string;
    /**
     * vipDurationDays字段
     * Java类型: java.lang.Integer
     * 描述: VIP时长(天)
     */
    vipDurationDays?: number;
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重
     */
    sortWeight?: number;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 套餐状态(1-上架 2-下架)
     */
    status?: number;
    /**
     * validTo字段
     * Java类型: java.time.Instant
     * 描述: 套餐有效期结束时间
     */
    validTo?: string;
    /**
     * pointAmount字段
     * Java类型: java.lang.Long
     * 描述: 赠送灵点数量
     */
    pointAmount?: string|number;
    /**
     * price字段
     * Java类型: java.math.BigDecimal
     * 描述: 套餐价格(元)
     */
    price?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipBenefitUsageResponse
 * 描述: VIP权益使用记录VO
 */
export interface VipBenefitUsageResponse extends BaseResponse {
    /**
     * sourceType字段
     * Java类型: java.lang.String
     * 描述: 业务来源类型
     */
    sourceType?: string;
    /**
     * benefitType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipBenefitType
     * 描述: 权益类型
     */
    benefitType?: VipBenefitType;
    /**
     * sourceId字段
     * Java类型: java.lang.Long
     * 描述: 业务来源ID(如订单ID等)
     */
    sourceId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * usageCount字段
     * Java类型: java.lang.Integer
     * 描述: 使用数量
     */
    usageCount?: number;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 状态(1-成功 2-失败)
     */
    status?: number;
    /**
     * usageTime字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    usageTime?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipLevelResponse
 * 描述: VIP等级VO，包含VIP等级的基本信息及权益ID集合
 */
export interface VipLevelResponse extends BaseResponse {
    /**
     * requiredPoints字段
     * Java类型: java.lang.Long
     * 描述: 晋升到此等级所需的累计灵点数
     */
    requiredPoints?: string|number;
    /**
     * benefitIds字段
     * Java类型: java.util.Set
     * 描述: 该等级拥有的权益ID集合
     */
    benefitIds?: Array<string|number>;
    /**
     * levelValue字段
     * Java类型: java.lang.Integer
     * 描述: 等级值，用于排序和内部逻辑判断, e.g., 1 for Gold, 2 for Platinum
     */
    levelValue?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: VIP等级ID
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 等级描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 等级名称, e.g., 黄金会员, 铂金会员
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipUserResponse
 * 描述: VIP会员用户信息VO
 */
export interface VipUserResponse extends BaseResponse {
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: 当前VIP等级ID
     */
    vipLevelId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     */
    id?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipStatus
     * 描述: 会员状态
     */
    status?: VipStatus;
    /**
     * validTo字段
     * Java类型: java.time.Instant
     * 描述: 会员有效期结束时间
     */
    validTo?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * pointBalance字段
     * Java类型: java.lang.Long
     * 描述: 当前灵点(积分)余额
     */
    pointBalance?: string|number;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: 最后活跃时间
     */
    lastActiveTime?: string;
    /**
     * validFrom字段
     * Java类型: java.time.Instant
     * 描述: 会员有效期开始时间
     */
    validFrom?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * totalRechargedPoints字段
     * Java类型: java.lang.Long
     * 描述: 累计充值灵点(积分)
     */
    totalRechargedPoints?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipPointChangeResponse
 * 描述: VIP积分变动记录VO
 */
export interface VipPointChangeResponse extends BaseResponse {
    /**
     * sourceType字段
     * Java类型: java.lang.String
     * 描述: 业务来源类型
     */
    sourceType?: string;
    /**
     * changeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.PointChangeType
     * 描述: 变动类型
     */
    changeType?: PointChangeType;
    /**
     * sourceId字段
     * Java类型: java.lang.Long
     * 描述: 业务来源ID(如充值记录ID、订单ID等)
     */
    sourceId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID，关联plus_user表
     */
    userId?: string|number;
    /**
     * changeAmount字段
     * Java类型: java.lang.Long
     * 描述: 变动数量(正数为增加，负数为减少)
     */
    changeAmount?: string|number;
    /**
     * afterBalance字段
     * Java类型: java.lang.Long
     * 描述: 变动后余额
     */
    afterBalance?: string|number;
    /**
     * beforeBalance字段
     * Java类型: java.lang.Long
     * 描述: 变动前余额
     */
    beforeBalance?: string|number;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VipLevelBenefitResponse
 * 描述: VIP等级权益关联VO
 */
export interface VipLevelBenefitResponse extends BaseResponse {
    /**
     * vipLevelId字段
     * Java类型: java.lang.Long
     * 描述: VIP等级ID，关联plus_vip_level表
     */
    vipLevelId?: string|number;
    /**
     * dailyLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每日使用限制次数
     */
    dailyLimit?: number;
    /**
     * specialConfig字段
     * Java类型: java.lang.String
     * 描述: 特殊配置(JSON格式)
     */
    specialConfig?: string;
    /**
     * totalLimit字段
     * Java类型: java.lang.Integer
     * 描述: 总使用限制次数
     */
    totalLimit?: number;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.vip.VipLevelBenefitStatus
     * 描述: 是否启用(1-启用 0-禁用)
     */
    status?: VipLevelBenefitStatus;
    /**
     * monthlyLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每月使用限制次数
     */
    monthlyLimit?: number;
    /**
     * benefitId字段
     * Java类型: java.lang.Long
     * 描述: 权益ID，关联plus_vip_benefit表
     */
    benefitId?: string|number;
}
