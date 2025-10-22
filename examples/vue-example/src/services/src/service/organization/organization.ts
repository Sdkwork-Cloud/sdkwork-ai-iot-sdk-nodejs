/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  OrganizationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GetAccessTokenParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenResult
} from 'sdkwork-sdk-api-typescript';

import { OrganizationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrganizationVO } from './types';
/**
 * Organization API接口实现
 */
export class OrganizationService {
   organizationManager: OrganizationManager;
   constructor() {
      this.organizationManager = ManagerFactory.create( OrganizationManager );
   }

  /**
   * Create a new organization
   */
  async create(data: OrganizationParam, options?: SdkRequestOptions): Promise<OrganizationVO> {
    const response = await this.organizationManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrganizationVO;
  }


  /**
   * Update an existing organization
   */
  async update(data: OrganizationParam, options?: SdkRequestOptions): Promise<OrganizationVO> {
    const response = await this.organizationManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrganizationVO;
  }


  /**
   * Get an organization by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<OrganizationVO> {
    const response = await this.organizationManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrganizationVO;
  }


  /**
   * Delete an organization
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.organizationManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get organizations by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<OrganizationVO>> {
    const response = await this.organizationManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<OrganizationVO>;
  }


  /**
   * Get all organizations
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<OrganizationVO[]> {
    const response = await this.organizationManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OrganizationVO[];
  }


  /**
   * Get access tokens
   */
  async getAccessTokens(data: GetAccessTokenParam, options?: SdkRequestOptions): Promise<TokenResult[]> {
    const response = await this.organizationManager.getAccessTokens(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TokenResult[];
  }

}
