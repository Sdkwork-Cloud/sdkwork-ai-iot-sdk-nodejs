/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ProductParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ProductManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ProductVO } from './types';
/**
 * Product API接口实现
 */
export class ProductService {
   productManager: ProductManager;
   constructor() {
      this.productManager = ManagerFactory.create( ProductManager );
   }

  /**
   * Create a new product
   */
  async create(data: ProductParam, options?: SdkRequestOptions): Promise<ProductVO> {
    const response = await this.productManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProductVO;
  }


  /**
   * Update an existing product
   */
  async update(data: ProductParam, options?: SdkRequestOptions): Promise<ProductVO> {
    const response = await this.productManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProductVO;
  }


  /**
   * Get a product by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ProductVO> {
    const response = await this.productManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProductVO;
  }


  /**
   * Delete a product
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.productManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get products by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ProductVO>> {
    const response = await this.productManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ProductVO>;
  }


  /**
   * Get all products
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ProductVO[]> {
    const response = await this.productManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProductVO[];
  }

}
