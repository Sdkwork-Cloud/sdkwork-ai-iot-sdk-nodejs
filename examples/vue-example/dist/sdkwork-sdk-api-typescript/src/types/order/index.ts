import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderConfirmResponse
 * 描述: 订单确认操作VO
 */
export interface OrderConfirmResponse extends OrderOperationResponse {
    /**
     * confirmTime字段
     * Java类型: java.time.Instant
     * 描述: 确认时间
     */
    confirmTime?: string;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 被确认的订单ID
     * 示例: 123456789
     */
    orderId?: string|number;
    /**
     * estimatedShipTime字段
     * Java类型: java.time.Instant
     * 描述: 预计发货时间
     */
    estimatedShipTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderOperationResponse
 * 描述: 订单操作基础VO
 */
export interface OrderOperationResponse extends BaseResponse {
    /**
     * operationTime字段
     * Java类型: java.time.Instant
     * 描述: 操作时间
     */
    operationTime?: string;
    /**
     * message字段
     * Java类型: java.lang.String
     * 描述: 操作结果消息
     * 示例: 订单取消成功
     */
    message?: string;
    /**
     * success字段
     * Java类型: java.lang.Boolean
     * 描述: 操作是否成功
     * 示例: true
     */
    success?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderShipResponse
 * 描述: 订单发货操作VO
 */
export interface OrderShipResponse extends OrderOperationResponse {
    /**
     * trackingNumber字段
     * Java类型: java.lang.String
     * 描述: 快递单号
     * 示例: SF1234567890
     */
    trackingNumber?: string;
    /**
     * estimatedArrivalTime字段
     * Java类型: java.time.Instant
     * 描述: 预计到达时间
     */
    estimatedArrivalTime?: string;
    /**
     * shippingCompany字段
     * Java类型: java.lang.String
     * 描述: 快递公司
     * 示例: 顺丰速运
     */
    shippingCompany?: string;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 发货的订单ID
     * 示例: 123456789
     */
    orderId?: string|number;
    /**
     * shipTime字段
     * Java类型: java.time.Instant
     * 描述: 发货时间
     */
    shipTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderCancelResponse
 * 描述: 订单取消操作VO
 */
export interface OrderCancelResponse extends OrderOperationResponse {
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 被取消的订单ID
     * 示例: 123456789
     */
    orderId?: string|number;
    /**
     * cancelTime字段
     * Java类型: java.time.Instant
     * 描述: 取消时间
     */
    cancelTime?: string;
    /**
     * cancelReason字段
     * Java类型: java.lang.String
     * 描述: 取消原因
     * 示例: 用户主动取消
     */
    cancelReason?: string;
    /**
     * refundAmount字段
     * Java类型: java.lang.String
     * 描述: 退款金额（如果支持退款）
     * 示例: 99.99
     */
    refundAmount?: string;
    /**
     * refundable字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持退款
     * 示例: true
     */
    refundable?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderCompleteResponse
 * 描述: 订单完成操作VO
 */
export interface OrderCompleteResponse extends OrderOperationResponse {
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 完成的订单ID
     * 示例: 123456789
     */
    orderId?: string|number;
    /**
     * pointsEarned字段
     * Java类型: java.lang.Integer
     * 描述: 获得积分数量
     * 示例: 100
     */
    pointsEarned?: number;
    /**
     * completeTime字段
     * Java类型: java.time.Instant
     * 描述: 完成时间
     */
    completeTime?: string;
    /**
     * reviewed字段
     * Java类型: java.lang.Boolean
     * 描述: 是否已评价
     * 示例: false
     */
    reviewed?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OrderCloseResponse
 * 描述: 订单关闭操作VO
 */
export interface OrderCloseResponse extends OrderOperationResponse {
    /**
     * closeReason字段
     * Java类型: java.lang.String
     * 描述: 关闭原因
     * 示例: 超时未支付
     */
    closeReason?: string;
    /**
     * closeTime字段
     * Java类型: java.time.Instant
     * 描述: 关闭时间
     */
    closeTime?: string;
    /**
     * orderId字段
     * Java类型: java.lang.Long
     * 描述: 关闭的订单ID
     * 示例: 123456789
     */
    orderId?: string|number;
    /**
     * reopenable字段
     * Java类型: java.lang.Boolean
     * 描述: 是否可重新打开
     * 示例: false
     */
    reopenable?: boolean;
}
