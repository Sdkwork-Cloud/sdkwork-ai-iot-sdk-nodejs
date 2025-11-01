import { CouponStatus, CouponType } from '../../enums/coupon';
import { ValidityType } from '../../enums/card';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserCouponParam
 * 描述: 用户优惠券Form对象
 */
export interface UserCouponParam extends BaseParam {
    /**
     * acquireAt字段
     * Java类型: java.time.Instant
     * 描述: 领取时间
     */
    acquireAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: 使用状态：未使用/已使用/已过期等
     */
    status?: CouponStatus;
    /**
     * couponId字段
     * Java类型: java.lang.Long
     * 描述: 优惠券模板ID
     */
    couponId?: string|number;
    /**
     * useAt字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    useAt?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * couponCode字段
     * Java类型: java.lang.String
     * 描述: 用户优惠券的唯一编码
     */
    couponCode?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CouponParam
 * 描述: 优惠券Form
 */
export interface CouponParam extends BaseParam {
    /**
     * amount字段
     * Java类型: java.lang.Integer
     * 描述: 抵扣金额（单位：分），若是折扣券可为0
     */
    amount?: number;
    /**
     * total字段
     * Java类型: java.lang.Integer
     * 描述: 发放总量
     */
    total?: number;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每人领取上限
     */
    getLimit?: number;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 生效开始时间
     */
    startTime?: string;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 生效结束时间
     */
    endTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 优惠券名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 优惠券描述
     */
    description?: string;
    /**
     * discount字段
     * Java类型: java.lang.Double
     * 描述: 折扣率（如 0.8 表示8折）
     */
    discount?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: 优惠券状态：可用/过期/撤销等
     */
    status?: CouponStatus;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponType
     * 描述: 优惠券类型：满减/折扣/礼品等
     */
    type?: CouponType;
    /**
     * minConsume字段
     * Java类型: java.lang.Integer
     * 描述: 满减券使用门槛金额（单位：分）
     */
    minConsume?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CouponTemplateParam
 * 描述: Coupon Template Form
 */
export interface CouponTemplateParam extends BaseParam {
    /**
     * total字段
     * Java类型: java.lang.Integer
     * 描述: Total quantity
     */
    total?: number;
    /**
     * validityType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.ValidityType
     * 描述: Validity type
     */
    validityType?: ValidityType;
    /**
     * scopeType字段
     * Java类型: java.lang.Integer
     * 描述: Scope type
     */
    scopeType?: number;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: End time
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: Start time
     */
    startTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Template name
     */
    name?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: Coupon status
     */
    status?: CouponStatus;
    /**
     * validityDays字段
     * Java类型: java.lang.Integer
     * 描述: Validity days
     */
    validityDays?: number;
    /**
     * amount字段
     * Java类型: java.lang.Integer
     * 描述: Discount amount (in cents)
     */
    amount?: number;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: Can share
     */
    canShare?: boolean;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: Get limit per user
     */
    getLimit?: number;
    /**
     * templateCode字段
     * Java类型: java.lang.String
     * 描述: Template code
     */
    templateCode?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Description
     */
    description?: string;
    /**
     * discount字段
     * Java类型: java.lang.Double
     * 描述: Discount rate
     */
    discount?: string|number;
    /**
     * scopeValue字段
     * Java类型: java.lang.String
     * 描述: Scope value
     */
    scopeValue?: string;
    /**
     * minConsume字段
     * Java类型: java.lang.Integer
     * 描述: Minimum consume amount (in cents)
     */
    minConsume?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponType
     * 描述: Coupon type (enum)
     */
    type?: CouponType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CouponTemplateResponse
 * 描述: Coupon Template Value Object
 */
export interface CouponTemplateResponse extends BaseResponse {
    /**
     * total字段
     * Java类型: java.lang.Integer
     * 描述: Total quantity
     */
    total?: number;
    /**
     * validityType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.ValidityType
     * 描述: Validity type
     */
    validityType?: ValidityType;
    /**
     * scopeType字段
     * Java类型: java.lang.Integer
     * 描述: Scope type
     */
    scopeType?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Template ID
     */
    id?: string|number;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: End time
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: Start time
     */
    startTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Template name
     */
    name?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: Coupon status
     */
    status?: CouponStatus;
    /**
     * validityDays字段
     * Java类型: java.lang.Integer
     * 描述: Validity days
     */
    validityDays?: number;
    /**
     * amount字段
     * Java类型: java.lang.Integer
     * 描述: Discount amount (in cents)
     */
    amount?: number;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: Can share
     */
    canShare?: boolean;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: Get limit per user
     */
    getLimit?: number;
    /**
     * templateCode字段
     * Java类型: java.lang.String
     * 描述: Template code
     */
    templateCode?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Description
     */
    description?: string;
    /**
     * discount字段
     * Java类型: java.lang.Double
     * 描述: Discount rate
     */
    discount?: string|number;
    /**
     * scopeValue字段
     * Java类型: java.lang.String
     * 描述: Scope value
     */
    scopeValue?: string;
    /**
     * minConsume字段
     * Java类型: java.lang.Integer
     * 描述: Minimum consume amount (in cents)
     */
    minConsume?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponType
     * 描述: Coupon type (enum)
     */
    type?: CouponType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserCouponResponse
 * 描述: 用户优惠券VO，记录用户持有的优惠券信息
 */
export interface UserCouponResponse extends BaseResponse {
    /**
     * acquireTime字段
     * Java类型: java.time.Instant
     * 描述: 领取时间
     */
    acquireTime?: string;
    /**
     * useTime字段
     * Java类型: java.time.Instant
     * 描述: 使用时间
     */
    useTime?: string;
    /**
     * couponId字段
     * Java类型: java.lang.Long
     * 描述: 优惠券模板ID
     */
    couponId?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * couponCode字段
     * Java类型: java.lang.String
     * 描述: 用户优惠券的唯一编码
     */
    couponCode?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: 使用状态：未使用/已使用/已过期等
     */
    status?: CouponStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CouponResponse
 * 描述: 优惠券模板VO，定义优惠券属性
 */
export interface CouponResponse extends BaseResponse {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 优惠券描述
     */
    description?: string;
    /**
     * discount字段
     * Java类型: java.lang.Double
     * 描述: 折扣率（如 0.8 表示8折）
     */
    discount?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 优惠券名称
     */
    name?: string;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 生效结束时间
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 生效开始时间
     */
    startTime?: string;
    /**
     * minConsume字段
     * Java类型: java.lang.Integer
     * 描述: 满减券使用门槛金额（单位：分）
     */
    minConsume?: number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponType
     * 描述: 优惠券类型：满减/折扣/礼品等
     */
    type?: CouponType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CouponStatus
     * 描述: 优惠券状态：可用/过期/撤销等
     */
    status?: CouponStatus;
    /**
     * amount字段
     * Java类型: java.lang.Integer
     * 描述: 抵扣金额（单位：分），若是折扣券可为0
     */
    amount?: number;
    /**
     * total字段
     * Java类型: java.lang.Integer
     * 描述: 发放总量
     */
    total?: number;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每人领取上限
     */
    getLimit?: number;
}
