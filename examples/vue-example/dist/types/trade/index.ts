import { PaymentStatus, PaymentPurpose, RefundStatus, RefundType, OrderType, OrderStatus } from '../../enums/trade';
import { ContentType, ContentFormat } from '../../enums/content';
import { ChannelProviderEnum, PaymentProvider } from '../../enums/core.type';
import { ProductType, SkuStatus, ProductStatus } from '../../enums/product';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { CategoryType, CategoryStatus, AttributeType } from '../../enums/ai';
import { ProjectStatus } from '../../enums/project';
import { ProjectType } from '../../enums/code.objects';
import { PermissionStatus, RoleStatus } from '../../enums/rbac';
import { GenderType, Platform, CommonStatus, DataOwner } from '../../enums/enums';
import { UserStatus } from '../../enums/user';
import { BaseParam } from '../../types/base';
import { BaseResponse, BaseObject } from '../../types/base';
import { Sku } from '../../types/product';
import { ClientPayObjects } from '../../types/payment';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PaymentParam
 * 描述: 支付记录Form
 */
export interface PaymentParam extends BaseParam {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.PaymentStatus
     * 描述: 支付状态: PENDING-待支付, SUCCESS-支付成功, FAILED-支付失败, REFUNDED-已退款
     */
    status?: PaymentStatus;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 第三方支付交易ID(如支付宝、微信支付的交易号)
     */
    transactionId?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型
     */
    contentType?: ContentType;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 支付备注信息
     */
    remark?: string;
    /**
     * channel字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 支付渠道: ALIPAY-支付宝, WECHAT-微信支付, UNIONPAY-银联支付, BALANCE-余额支付
     */
    channel?: ChannelProviderEnum;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID
     */
    contentId?: string|number;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号
     */
    outTradeNo?: string;
    /**
     * successTime字段
     * Java类型: java.time.Instant
     * 描述: 支付成功时间
     */
    successTime?: string;
    /**
     * purpose字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.PaymentPurpose
     * 描述: 支付用途: ORDER-商品订单, MEMBER-会员服务, POINTS-积分充值, OTHER-其他业务
     */
    purpose?: PaymentPurpose;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 支付金额
     */
    amount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PaymentStatusQueryParam
 * 描述: 支付状态查询Form
 */
export interface PaymentStatusQueryParam extends BaseParam {
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号
     */
    outTradeNo?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.PaymentProvider
     * 描述: 支付渠道: ALIPAY-支付宝, WECHAT-微信支付, UNIONPAY-银联支付, BALANCE-余额支付
     */
    provider?: PaymentProvider;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 支付金额
     */
    amount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderItemParam
 * 描述: 订单项Form
 */
export interface OrderItemParam extends BaseParam {
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识订单项关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * productType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.ProductType
     * 描述: 商品类型: PHYSICAL-实物商品, VIRTUAL-虚拟商品, MEMBER-会员服务
     */
    productType?: ProductType;
    /**
     * skuId字段
     * Java类型: java.lang.Long
     * 描述: 商品SKU ID
     */
    skuId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识订单项关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: 购买数量
     */
    quantity?: number;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 虚拟商品有效期(仅当productType=VIRTUAL时有效)
     */
    expireTime?: string;
    /**
     * totalAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品总价
     */
    totalAmount?: string|number;
    /**
     * unitPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品单价
     */
    unitPrice?: string|number;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: 商品ID
     */
    productId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PaymentCancelParam
 * 描述: 支付取消Form类，用于接收和验证支付取消相关表单数据
 */
export interface PaymentCancelParam extends BaseParam {
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号
     */
    outTradeNo?: string;
    /**
     * paymentId字段
     * Java类型: java.lang.Long
     * 描述: 支付记录ID
     */
    paymentId?: string|number;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 支付金额
     */
    amount?: string|number;
    /**
     * reason字段
     * Java类型: java.lang.String
     * 描述: 取消原因
     */
    reason?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RefundParam
 * 描述: 退款记录Form类，用于接收和验证退款相关表单数据
 */
export interface RefundParam extends BaseParam {
    /**
     * applyTime字段
     * Java类型: java.time.Instant
     * 描述: 退款申请时间
     */
    applyTime?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识退款记录关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * refundId字段
     * Java类型: java.lang.String
     * 描述: 支付渠道退款流水号，支付渠道返回的退款交易号
     */
    refundId?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.RefundStatus
     * 描述: 退款状态：PENDING-待处理，PROCESSING-处理中，SUCCESS-退款成功，FAILED-退款失败
     */
    status?: RefundStatus;
    /**
     * paymentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的支付记录ID，用于追溯原始支付交易
     */
    paymentId?: string|number;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号，遵循支付通道标准命名(out_trade_no)
     */
    outTradeNo?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识退款记录关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * completeTime字段
     * Java类型: java.time.Instant
     * 描述: 退款完成时间
     */
    completeTime?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 退款备注信息
     */
    remark?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.RefundType
     * 描述: 退款类型：RETURN-退货退款，CANCEL-订单取消，OVERPAY-多付款项，OTHER-其他原因
     */
    type?: RefundType;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 退款金额
     */
    amount?: string|number;
    /**
     * outRefundNo字段
     * Java类型: java.lang.String
     * 描述: 商户退款单号(out_refund_no)，系统生成的唯一退款单号，用于业务展示
     */
    outRefundNo?: string;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShoppingCartParam
 * 描述: 购物车Form
 */
export interface ShoppingCartParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 购物车描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 购物车名称
     */
    name?: string;
    /**
     * groupList字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.trade.CartGroupList
     * 描述: 购物车项目列表（JSON格式）
     */
    groupList?: CartGroupList;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 购物车所有者ID（关联用户/平台ID）
     */
    ownerId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 购物车状态（枚举值：ACTIVE/INACTIVE等）
     */
    status?: CommonStatus;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 购物车所有者（枚举值：USER/PLATFORM等）
     */
    owner?: DataOwner;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderParam
 * 描述: 订单主表Form
 */
export interface OrderParam extends BaseParam {
    /**
     * paidPointsAmount字段
     * Java类型: java.lang.Integer
     * 描述: 订单使用积分数
     */
    paidPointsAmount?: number;
    /**
     * orderSn字段
     * Java类型: java.lang.String
     * 描述: 订单编号，系统生成的唯一订单号，用于业务展示
     */
    orderSn?: string;
    /**
     * payTime字段
     * Java类型: java.time.Instant
     * 描述: 支付时间
     */
    payTime?: string;
    /**
     * orderType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.OrderType
     * 描述: 订单类型，PHYSICAL-实物商品，VIRTUAL-虚拟商品，MEMBER-会员购买，POINTS-积分充值
     */
    orderType?: OrderType;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 第三方支付交易ID，如支付宝、微信支付的交易号
     */
    transactionId?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识订单关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号，遵循支付通道标准命名(out_trade_no)
     */
    outTradeNo?: string;
    /**
     * totalAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 订单总金额
     */
    totalAmount?: string|number;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 虚拟商品/会员到期时间，仅当orderType为VIRTUAL或MEMBER时有效
     */
    expireTime?: string;
    /**
     * paidAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际支付金额
     */
    paidAmount?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识订单关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.OrderStatus
     * 描述: 订单状态
     */
    status?: OrderStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PaymentResponse
 * 描述: 支付记录VO，记录所有支付交易信息
 */
export interface PaymentResponse extends BaseResponse {
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识支付记录关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.PaymentStatus
     * 描述: 支付状态 PENDING-待支付 SUCCESS-支付成功 FAILED-支付失败 REFUNDED-已退款
     */
    status?: PaymentStatus;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 第三方支付交易ID，如支付宝、微信支付的交易号
     */
    transactionId?: string;
    /**
     * channel字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 支付渠道 ALIPAY-支付宝 WECHAT-微信支付 UNIONPAY-银联支付 BALANCE-余额支付
     */
    channel?: ChannelProviderEnum;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识支付记录关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 支付备注信息
     */
    remark?: string;
    /**
     * purpose字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.PaymentPurpose
     * 描述: 支付用途 ORDER-商品订单 MEMBER-会员服务 POINTS-积分充值 OTHER-其他业务
     */
    purpose?: PaymentPurpose;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号，遵循支付通道标准命名(out_trade_no)
     */
    outTradeNo?: string;
    /**
     * successTime字段
     * Java类型: java.time.Instant
     * 描述: 支付成功时间
     */
    successTime?: string;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 支付金额
     */
    amount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CartItem
 * 描述: 购物车项目信息
 */
export interface CartItem extends BaseObject {
    /**
     * unitPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品单价
     */
    unitPrice?: string|number;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: 商品数量
     */
    quantity?: number;
    /**
     * totalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品总价
     */
    totalPrice?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 购物车项目ID
     */
    id?: string|number;
    /**
     * sku字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.product.PlusSku
     * 描述: 关联的SKU信息
     */
    sku?: Sku;
    /**
     * selected字段
     * Java类型: java.lang.Boolean
     * 描述: 是否选中
     */
    selected?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RefundResponse
 * 描述: 退款记录VO，记录所有退款交易信息，支持多种退款场景
 */
export interface RefundResponse extends BaseResponse {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.RefundStatus
     * 描述: 退款状态，PENDING-待处理，PROCESSING-处理中，SUCCESS-退款成功，FAILED-退款失败
     */
    status?: RefundStatus;
    /**
     * refundId字段
     * Java类型: java.lang.String
     * 描述: 支付渠道退款流水号，支付渠道返回的退款交易号
     */
    refundId?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识退款记录关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * applyTime字段
     * Java类型: java.time.Instant
     * 描述: 退款申请时间
     */
    applyTime?: string;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号，遵循支付通道标准命名(out_trade_no)
     */
    outTradeNo?: string;
    /**
     * paymentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的支付记录ID，用于追溯原始支付交易
     */
    paymentId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.RefundType
     * 描述: 退款类型，RETURN-退货退款，CANCEL-订单取消，OVERPAY-多付款项，OTHER-其他原因
     */
    type?: RefundType;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 退款备注信息
     */
    remark?: string;
    /**
     * completeTime字段
     * Java类型: java.time.Instant
     * 描述: 退款完成时间
     */
    completeTime?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识退款记录关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
    /**
     * outRefundNo字段
     * Java类型: java.lang.String
     * 描述: 商户退款单号(out_refund_no)，系统生成的唯一退款单号，用于业务展示
     */
    outRefundNo?: string;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 退款金额
     */
    amount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CartGroup
 * 描述: 购物车分组信息
 */
export interface CartGroup extends BaseObject {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 分组名称
     */
    name?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 分组UUID
     */
    uuid?: string;
    /**
     * items字段
     * Java类型: java.util.List
     * 描述: 购物车项目列表
     */
    items?: Array<CartItem>;
    /**
     * totalQuantity字段
     * Java类型: java.lang.Integer
     * 描述: 分组内商品总数量
     */
    totalQuantity?: number;
    /**
     * totalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 分组内商品总价格
     */
    totalPrice?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderResponse
 * 描述: 订单主表VO
 */
export interface OrderResponse extends BaseResponse {
    /**
     * orderSn字段
     * Java类型: java.lang.String
     * 描述: 订单编号,系统生成的唯一订单号，用于业务展示
     */
    orderSn?: string;
    /**
     * payTime字段
     * Java类型: java.time.Instant
     * 描述: 支付时间
     */
    payTime?: string;
    /**
     * paidPointsAmount字段
     * Java类型: java.lang.Integer
     * 描述: 订单使用积分数
     */
    paidPointsAmount?: number;
    /**
     * payObjects字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.ClientPayObjects
     * 描述: 支付对象
     */
    payObjects?: ClientPayObjects;
    /**
     * orderType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.OrderType
     * 描述: 订单类型: PHYSICAL-实物商品, VIRTUAL-虚拟商品, MEMBER-会员购买, POINTS-积分充值
     */
    orderType?: OrderType;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 第三方支付交易ID,如支付宝、微信支付的交易号
     */
    transactionId?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID,标识订单关联的具体业务内容
     */
    contentId?: string|number;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号/支付渠道订单号,遵循支付通道标准命名(out_trade_no)
     */
    outTradeNo?: string;
    /**
     * totalAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 订单总金额
     */
    totalAmount?: string|number;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 虚拟商品/会员到期时间,仅当orderType为VIRTUAL或MEMBER时有效
     */
    expireTime?: string;
    /**
     * paidAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 实际支付金额
     */
    paidAmount?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型,标识订单关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.OrderStatus
     * 描述: 订单状态
     */
    status?: OrderStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CartGroupList
 * 描述: 购物车分组列表
 */
export interface CartGroupList extends BaseObject {
    /**
     * groups字段
     * Java类型: java.util.List
     * 描述: 购物车分组列表
     */
    groups?: Array<CartGroup>;
    /**
     * totalQuantity字段
     * Java类型: java.lang.Integer
     * 描述: 购物车商品总数量
     */
    totalQuantity?: number;
    /**
     * selectedQuantity字段
     * Java类型: java.lang.Integer
     * 描述: 选中商品总数量
     */
    selectedQuantity?: number;
    /**
     * selectedPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 选中商品总价格
     */
    selectedPrice?: string|number;
    /**
     * totalPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 购物车商品总价格
     */
    totalPrice?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderItemResponse
 * 描述: 订单项Value Object，支持多种商品类型：1.实物商品 2.虚拟商品(如电子书、课程等) 3.会员服务
 */
export interface OrderItemResponse extends BaseResponse {
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关联的订单ID
     */
    orderId?: string|number;
    /**
     * productId字段
     * Java类型: java.lang.Long
     * 描述: 商品ID
     */
    productId?: string|number;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: 购买数量
     */
    quantity?: number;
    /**
     * expireTime字段
     * Java类型: java.time.Instant
     * 描述: 虚拟商品有效期(仅当productType=VIRTUAL时有效)，如电子书、课程等的使用期限
     */
    expireTime?: string;
    /**
     * totalAmount字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品总价
     */
    totalAmount?: string|number;
    /**
     * unitPrice字段
     * Java类型: java.math.BigDecimal
     * 描述: 商品单价
     */
    unitPrice?: string|number;
    /**
     * productType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.product.ProductType
     * 描述: 商品类型：PHYSICAL-实物商品，VIRTUAL-虚拟商品，MEMBER-会员服务
     */
    productType?: ProductType;
    /**
     * skuId字段
     * Java类型: java.lang.Long
     * 描述: 商品SKU ID
     */
    skuId?: string|number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 关联内容类型，标识订单项关联的业务内容类型
     */
    contentType?: ContentType;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联内容ID，标识订单项关联的具体业务内容
     */
    contentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShoppingCartResponse
 * 描述: 购物车VO
 */
export interface ShoppingCartResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 购物车所有者
     */
    owner?: DataOwner;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 购物车描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 购物车名称
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 购物车ID
     */
    id?: string|number;
    /**
     * groupList字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.trade.CartGroupList
     * 描述: 购物车项目列表
     */
    groupList?: CartGroupList;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 购物车所有者ID
     */
    ownerId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 购物车状态
     */
    status?: CommonStatus;
}
