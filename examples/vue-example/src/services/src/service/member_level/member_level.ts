/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  MemberLevelParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Member_levelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberLevelVO } from './types';
/**
 * Member_level API接口实现
 */
export class Member_levelService {
   member_levelManager: Member_levelManager;
   constructor() {
      this.member_levelManager = ManagerFactory.create( Member_levelManager );
   }

  /**
   * Create a new member level
   */
  async create(data: MemberLevelParam, options?: SdkRequestOptions): Promise<MemberLevelVO> {
    const response = await this.member_levelManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberLevelVO;
  }


  /**
   * Update an existing member level
   */
  async update(data: MemberLevelParam, options?: SdkRequestOptions): Promise<MemberLevelVO> {
    const response = await this.member_levelManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberLevelVO;
  }


  /**
   * Get a member level by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<MemberLevelVO> {
    const response = await this.member_levelManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberLevelVO;
  }


  /**
   * Delete a member level
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.member_levelManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get member levels by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<MemberLevelVO>> {
    const response = await this.member_levelManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<MemberLevelVO>;
  }


  /**
   * Get all member levels
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<MemberLevelVO[]> {
    const response = await this.member_levelManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberLevelVO[];
  }

}
