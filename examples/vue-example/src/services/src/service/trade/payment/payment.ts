/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  PaymentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { TradePaymentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { PaymentVO } from './types';
/**
 * TradePayment API接口实现
 */
export class TradePaymentService {
   tradePaymentManager: TradePaymentManager;
   constructor() {
      this.tradePaymentManager = ManagerFactory.create( TradePaymentManager );
   }

  /**
   * Create a new payment record
   */
  async create(data: PaymentParam, options?: SdkRequestOptions): Promise<PaymentVO> {
    const response = await this.tradePaymentManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PaymentVO;
  }


  /**
   * Update an existing payment record
   */
  async update(data: PaymentParam, options?: SdkRequestOptions): Promise<PaymentVO> {
    const response = await this.tradePaymentManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PaymentVO;
  }


  /**
   * Get a payment record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<PaymentVO> {
    const response = await this.tradePaymentManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PaymentVO;
  }


  /**
   * Delete a payment record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tradePaymentManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get payment records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<PaymentVO>> {
    const response = await this.tradePaymentManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<PaymentVO>;
  }


  /**
   * Get all payment records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<PaymentVO[]> {
    const response = await this.tradePaymentManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PaymentVO[];
  }

}
