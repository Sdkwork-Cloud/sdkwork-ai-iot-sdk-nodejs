/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UserRoleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserRoleKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { RbacUserRoleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserRoleVO } from './types';
/**
 * RbacUserRole API接口实现
 */
export class RbacUserRoleService {
   rbacUserRoleManager: RbacUserRoleManager;
   constructor() {
      this.rbacUserRoleManager = ManagerFactory.create( RbacUserRoleManager );
   }

  /**
   * Create user-role relationship
   */
  async create(data: UserRoleParam, options?: SdkRequestOptions): Promise<UserRoleVO> {
    const response = await this.rbacUserRoleManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserRoleVO;
  }


  /**
   * Update user-role relationship
   */
  async update(data: UserRoleParam, options?: SdkRequestOptions): Promise<UserRoleVO> {
    const response = await this.rbacUserRoleManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserRoleVO;
  }


  /**
   * Get user-role relationship by ID
   */
  async retrieve(id: any, options?: SdkRequestOptions): Promise<UserRoleVO> {
    const response = await this.rbacUserRoleManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserRoleVO;
  }


  /**
   * Delete user-role relationship
   */
  async delete(id: any, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.rbacUserRoleManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get user-role relationships by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UserRoleVO>> {
    const response = await this.rbacUserRoleManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UserRoleVO>;
  }


  /**
   * Get all user-role relationships
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UserRoleVO[]> {
    const response = await this.rbacUserRoleManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserRoleVO[];
  }

}
