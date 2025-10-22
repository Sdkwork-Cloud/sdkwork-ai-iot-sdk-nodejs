/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  DiskMemberParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Disk_memberManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DiskMemberVO } from './types';
/**
 * Disk_member API接口实现
 */
export class Disk_memberService {
   disk_memberManager: Disk_memberManager;
   constructor() {
      this.disk_memberManager = ManagerFactory.create( Disk_memberManager );
   }

  /**
   * Create a new disk member
   */
  async create(data: DiskMemberParam, options?: SdkRequestOptions): Promise<DiskMemberVO> {
    const response = await this.disk_memberManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskMemberVO;
  }


  /**
   * Update an existing disk member
   */
  async update(data: DiskMemberParam, options?: SdkRequestOptions): Promise<DiskMemberVO> {
    const response = await this.disk_memberManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskMemberVO;
  }


  /**
   * Get a disk member by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<DiskMemberVO> {
    const response = await this.disk_memberManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskMemberVO;
  }


  /**
   * Delete a disk member
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.disk_memberManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get disk members by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<DiskMemberVO>> {
    const response = await this.disk_memberManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<DiskMemberVO>;
  }


  /**
   * Get all disk members
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<DiskMemberVO[]> {
    const response = await this.disk_memberManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskMemberVO[];
  }

}
