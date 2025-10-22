/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  RolePermissionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Role_permissionManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RolePermissionVO } from './types';
/**
 * Role_permission API接口实现
 */
export class Role_permissionService {
   role_permissionManager: Role_permissionManager;
   constructor() {
      this.role_permissionManager = ManagerFactory.create( Role_permissionManager );
   }

  /**
   * Create role-permission association
   */
  async create(data: RolePermissionParam, options?: SdkRequestOptions): Promise<RolePermissionVO> {
    const response = await this.role_permissionManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RolePermissionVO;
  }


  /**
   * Update role-permission association
   */
  async update(data: RolePermissionParam, options?: SdkRequestOptions): Promise<RolePermissionVO> {
    const response = await this.role_permissionManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RolePermissionVO;
  }


  /**
   * Get role-permission association by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<RolePermissionVO> {
    const response = await this.role_permissionManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RolePermissionVO;
  }


  /**
   * Delete role-permission association
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.role_permissionManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get role-permission associations by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<RolePermissionVO>> {
    const response = await this.role_permissionManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<RolePermissionVO>;
  }


  /**
   * Get all role-permission associations
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<RolePermissionVO[]> {
    const response = await this.role_permissionManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RolePermissionVO[];
  }

}
