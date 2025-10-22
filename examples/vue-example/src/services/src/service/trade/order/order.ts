/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  OrderParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { TradeOrderManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrderVO } from './types';
/**
 * TradeOrder API接口实现
 */
export class TradeOrderService {
   tradeOrderManager: TradeOrderManager;
   constructor() {
      this.tradeOrderManager = ManagerFactory.create( TradeOrderManager );
   }

  /**
   * Create a new order
   */
  async create(data: OrderParam, options?: SdkRequestOptions): Promise<OrderVO> {
    const response = await this.tradeOrderManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderVO;
  }


  /**
   * Update an existing order
   */
  async update(data: OrderParam, options?: SdkRequestOptions): Promise<OrderVO> {
    const response = await this.tradeOrderManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderVO;
  }


  /**
   * Get an order by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<OrderVO> {
    const response = await this.tradeOrderManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderVO;
  }


  /**
   * Delete an order
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tradeOrderManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get orders by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<OrderVO>> {
    const response = await this.tradeOrderManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<OrderVO>;
  }


  /**
   * Get all orders
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<OrderVO[]> {
    const response = await this.tradeOrderManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderVO[];
  }

}
