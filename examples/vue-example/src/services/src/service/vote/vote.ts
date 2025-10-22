/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ContentVoteParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VoteManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ContentVoteVO } from './types';
/**
 * Vote API接口实现
 */
export class VoteService {
   voteManager: VoteManager;
   constructor() {
      this.voteManager = ManagerFactory.create( VoteManager );
   }

  /**
   * Create a new content vote
   */
  async create(data: ContentVoteParam, options?: SdkRequestOptions): Promise<ContentVoteVO> {
    const response = await this.voteManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ContentVoteVO;
  }


  /**
   * Update an existing content vote
   */
  async update(data: ContentVoteParam, options?: SdkRequestOptions): Promise<ContentVoteVO> {
    const response = await this.voteManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ContentVoteVO;
  }


  /**
   * Get a content vote by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ContentVoteVO> {
    const response = await this.voteManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ContentVoteVO;
  }


  /**
   * Delete a content vote
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.voteManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get content votes by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ContentVoteVO>> {
    const response = await this.voteManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ContentVoteVO>;
  }


  /**
   * Get all content votes
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ContentVoteVO[]> {
    const response = await this.voteManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ContentVoteVO[];
  }

}
