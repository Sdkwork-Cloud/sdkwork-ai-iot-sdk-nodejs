/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  PaymentStatusQueryParam,
  PaymentCancelParam,
  PaymentParam,
  RefundParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  PaymentResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * TradePayment API接口实现
 */
export class TradePaymentManager extends BaseManager<SdkClient, PaymentParam, PaymentResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'trade.payment' || '';
      super(client, path);
   }

  /**
   * Cancel payment
   */
  async cancelPayment(data: PaymentCancelParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.payment.cancelPayment(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('cancelPayment 请求失败:', error);
    throw error instanceof Error ? error : new Error('cancelPayment 请求发生错误');
  }
}

  /**
   * Check payment status
   */
  async checkPaymentStatus(data: PaymentStatusQueryParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.payment.checkPaymentStatus(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('checkPaymentStatus 请求失败:', error);
    throw error instanceof Error ? error : new Error('checkPaymentStatus 请求发生错误');
  }
}

  /**
   * Refund payment
   */
  async refundPayment(data: RefundParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.payment.refundPayment(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('refundPayment 请求失败:', error);
    throw error instanceof Error ? error : new Error('refundPayment 请求发生错误');
  }
}
}
