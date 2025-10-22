/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  GetAccessTokenParam,
  TenantParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenResult
} from 'sdkwork-sdk-api-typescript';

import { TenantManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { TenantVO } from './types';
/**
 * Tenant API接口实现
 */
export class TenantService {
   tenantManager: TenantManager;
   constructor() {
      this.tenantManager = ManagerFactory.create( TenantManager );
   }

  /**
   * Create a new tenant
   */
  async create(data: TenantParam, options?: SdkRequestOptions): Promise<TenantVO> {
    const response = await this.tenantManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TenantVO;
  }


  /**
   * Update an existing tenant
   */
  async update(data: TenantParam, options?: SdkRequestOptions): Promise<TenantVO> {
    const response = await this.tenantManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TenantVO;
  }


  /**
   * Get a tenant by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<TenantVO> {
    const response = await this.tenantManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TenantVO;
  }


  /**
   * Delete a tenant
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tenantManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get tenants by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<TenantVO>> {
    const response = await this.tenantManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<TenantVO>;
  }


  /**
   * Get all tenants
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<TenantVO[]> {
    const response = await this.tenantManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TenantVO[];
  }


  /**
   * Get access tokens
   */
  async getAccessTokens(data: GetAccessTokenParam, options?: SdkRequestOptions): Promise<TokenResult[]> {
    const response = await this.tenantManager.getAccessTokens(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TokenResult[];
  }

}
