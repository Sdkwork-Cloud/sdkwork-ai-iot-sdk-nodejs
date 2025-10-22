/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  RefundParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { TradeRefundManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RefundVO } from './types';
/**
 * TradeRefund API接口实现
 */
export class TradeRefundService {
   tradeRefundManager: TradeRefundManager;
   constructor() {
      this.tradeRefundManager = ManagerFactory.create( TradeRefundManager );
   }

  /**
   * Create a new refund record
   */
  async create(data: RefundParam, options?: SdkRequestOptions): Promise<RefundVO> {
    const response = await this.tradeRefundManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RefundVO;
  }


  /**
   * Update an existing refund record
   */
  async update(data: RefundParam, options?: SdkRequestOptions): Promise<RefundVO> {
    const response = await this.tradeRefundManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RefundVO;
  }


  /**
   * Get a refund record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<RefundVO> {
    const response = await this.tradeRefundManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RefundVO;
  }


  /**
   * Delete a refund record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tradeRefundManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get refund records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<RefundVO>> {
    const response = await this.tradeRefundManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<RefundVO>;
  }


  /**
   * Get all refund records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<RefundVO[]> {
    const response = await this.tradeRefundManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RefundVO[];
  }

}
