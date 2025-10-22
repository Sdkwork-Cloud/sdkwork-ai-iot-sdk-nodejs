/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  OrderItemParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { TradeOrderItemManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrderItemVO } from './types';
/**
 * TradeOrderItem API接口实现
 */
export class TradeOrderItemService {
   tradeOrderItemManager: TradeOrderItemManager;
   constructor() {
      this.tradeOrderItemManager = ManagerFactory.create( TradeOrderItemManager );
   }

  /**
   * Create a new order item
   */
  async create(data: OrderItemParam, options?: SdkRequestOptions): Promise<OrderItemVO> {
    const response = await this.tradeOrderItemManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderItemVO;
  }


  /**
   * Update an existing order item
   */
  async update(data: OrderItemParam, options?: SdkRequestOptions): Promise<OrderItemVO> {
    const response = await this.tradeOrderItemManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderItemVO;
  }


  /**
   * Get an order item by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<OrderItemVO> {
    const response = await this.tradeOrderItemManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderItemVO;
  }


  /**
   * Delete an order item
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tradeOrderItemManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get order items by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<OrderItemVO>> {
    const response = await this.tradeOrderItemManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<OrderItemVO>;
  }


  /**
   * Get all order items
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<OrderItemVO[]> {
    const response = await this.tradeOrderItemManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrderItemVO[];
  }

}
