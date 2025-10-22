/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  InvitationCodeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { InvitationCodeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvitationCodeVO } from './types';
/**
 * InvitationCode API接口实现
 */
export class InvitationCodeService {
   invitationCodeManager: InvitationCodeManager;
   constructor() {
      this.invitationCodeManager = ManagerFactory.create( InvitationCodeManager );
   }

  /**
   * Create a new invitation code
   */
  async create(data: InvitationCodeParam, options?: SdkRequestOptions): Promise<InvitationCodeVO> {
    const response = await this.invitationCodeManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationCodeVO;
  }


  /**
   * Update an existing invitation code
   */
  async update(data: InvitationCodeParam, options?: SdkRequestOptions): Promise<InvitationCodeVO> {
    const response = await this.invitationCodeManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationCodeVO;
  }


  /**
   * Get an invitation code by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<InvitationCodeVO> {
    const response = await this.invitationCodeManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationCodeVO;
  }


  /**
   * Delete an invitation code
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.invitationCodeManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get invitation codes by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<InvitationCodeVO>> {
    const response = await this.invitationCodeManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<InvitationCodeVO>;
  }


  /**
   * Get all invitation codes
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<InvitationCodeVO[]> {
    const response = await this.invitationCodeManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationCodeVO[];
  }

}
