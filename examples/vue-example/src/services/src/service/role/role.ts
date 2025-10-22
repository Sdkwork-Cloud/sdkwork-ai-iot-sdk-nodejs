/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  RoleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { RoleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RoleVO } from './types';
/**
 * Role API接口实现
 */
export class RoleService {
   roleManager: RoleManager;
   constructor() {
      this.roleManager = ManagerFactory.create( RoleManager );
   }

  /**
   * Create a new system role
   */
  async create(data: RoleParam, options?: SdkRequestOptions): Promise<RoleVO> {
    const response = await this.roleManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RoleVO;
  }


  /**
   * Update an existing system role
   */
  async update(data: RoleParam, options?: SdkRequestOptions): Promise<RoleVO> {
    const response = await this.roleManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RoleVO;
  }


  /**
   * Get a system role by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<RoleVO> {
    const response = await this.roleManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RoleVO;
  }


  /**
   * Delete a system role
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.roleManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get system roles by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<RoleVO>> {
    const response = await this.roleManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<RoleVO>;
  }


  /**
   * Get all system roles
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<RoleVO[]> {
    const response = await this.roleManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RoleVO[];
  }

}
