/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  MemberCardParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Member_cardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberCardVO } from './types';
/**
 * Member_card API接口实现
 */
export class Member_cardService {
   member_cardManager: Member_cardManager;
   constructor() {
      this.member_cardManager = ManagerFactory.create( Member_cardManager );
   }

  /**
   * Create a new member card
   */
  async create(data: MemberCardParam, options?: SdkRequestOptions): Promise<MemberCardVO> {
    const response = await this.member_cardManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberCardVO;
  }


  /**
   * Update an existing member card
   */
  async update(data: MemberCardParam, options?: SdkRequestOptions): Promise<MemberCardVO> {
    const response = await this.member_cardManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberCardVO;
  }


  /**
   * Get a member card by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<MemberCardVO> {
    const response = await this.member_cardManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberCardVO;
  }


  /**
   * Delete a member card
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.member_cardManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get member cards by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<MemberCardVO>> {
    const response = await this.member_cardManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<MemberCardVO>;
  }


  /**
   * Get all member cards
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<MemberCardVO[]> {
    const response = await this.member_cardManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MemberCardVO[];
  }

}
