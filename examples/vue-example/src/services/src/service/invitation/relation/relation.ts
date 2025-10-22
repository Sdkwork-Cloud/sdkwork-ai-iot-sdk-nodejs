/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  InvitationRelationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { InvitationRelationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvitationRelationVO } from './types';
/**
 * InvitationRelation API接口实现
 */
export class InvitationRelationService {
   invitationRelationManager: InvitationRelationManager;
   constructor() {
      this.invitationRelationManager = ManagerFactory.create( InvitationRelationManager );
   }

  /**
   * Create a new invitation relation
   */
  async create(data: InvitationRelationParam, options?: SdkRequestOptions): Promise<InvitationRelationVO> {
    const response = await this.invitationRelationManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationRelationVO;
  }


  /**
   * Update an invitation relation
   */
  async update(data: InvitationRelationParam, options?: SdkRequestOptions): Promise<InvitationRelationVO> {
    const response = await this.invitationRelationManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationRelationVO;
  }


  /**
   * Get an invitation relation by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<InvitationRelationVO> {
    const response = await this.invitationRelationManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationRelationVO;
  }


  /**
   * Delete an invitation relation
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.invitationRelationManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get invitation relations by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<InvitationRelationVO>> {
    const response = await this.invitationRelationManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<InvitationRelationVO>;
  }


  /**
   * Get all invitation relations
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<InvitationRelationVO[]> {
    const response = await this.invitationRelationManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvitationRelationVO[];
  }

}
