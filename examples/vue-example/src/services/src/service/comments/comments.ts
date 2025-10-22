/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 13:13:46 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CommentsParam,
  CommentsReplyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CommentsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CommentsVO } from './types';
/**
 * Comments API接口实现
 */
export class CommentsService {
   commentsManager: CommentsManager;
   constructor() {
      this.commentsManager = ManagerFactory.create( CommentsManager );
   }

  /**
   * Create a new comment
   */
  async create(data: CommentsParam, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Update an existing comment
   */
  async update(data: CommentsParam, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Get a comment by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Delete a comment
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.commentsManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get all comments
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CommentsVO[]> {
    const response = await this.commentsManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO[];
  }


  /**
   * Get comments by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CommentsVO>> {
    const response = await this.commentsManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CommentsVO>;
  }


  /**
   * Unlike a comment
   */
  async unlike(id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.unlike(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Like a comment
   */
  async like(id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.like(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Reply to a comment
   */
  async reply(data: CommentsReplyParam, id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.commentsManager.reply(data, id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }

}
