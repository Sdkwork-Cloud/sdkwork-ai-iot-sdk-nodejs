/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  OrderParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  OrderResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  OrderCancelResponse,
  OrderCompleteResponse,
  OrderCloseResponse,
  OrderShipResponse,
  OrderConfirmResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * TradeOrder API接口实现
 */
export class TradeOrderManager extends BaseManager<SdkClient, OrderParam, OrderResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'trade.order' || '';
      super(client, path);
   }

  /**
   * Cancel an order
   */
  async cancelOrder(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<OrderCancelResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.order.cancelOrder(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<OrderCancelResponse>;
  } catch (error) {
    // 错误处理
    console.error('cancelOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('cancelOrder 请求发生错误');
  }
}

  /**
   * Confirm an order
   */
  async confirmOrder(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<OrderConfirmResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.order.confirmOrder(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<OrderConfirmResponse>;
  } catch (error) {
    // 错误处理
    console.error('confirmOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('confirmOrder 请求发生错误');
  }
}

  /**
   * Complete an order
   */
  async completeOrder(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<OrderCompleteResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.order.completeOrder(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<OrderCompleteResponse>;
  } catch (error) {
    // 错误处理
    console.error('completeOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('completeOrder 请求发生错误');
  }
}

  /**
   * Close an order
   */
  async closeOrder(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<OrderCloseResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.order.closeOrder(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<OrderCloseResponse>;
  } catch (error) {
    // 错误处理
    console.error('closeOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('closeOrder 请求发生错误');
  }
}

  /**
   * Ship an order
   */
  async shipOrder(data: any, id: number|string, options?: SdkRequestOptions): Promise<ApiResult<OrderShipResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.trade.order.shipOrder(data, id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<OrderShipResponse>;
  } catch (error) {
    // 错误处理
    console.error('shipOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('shipOrder 请求发生错误');
  }
}
}
