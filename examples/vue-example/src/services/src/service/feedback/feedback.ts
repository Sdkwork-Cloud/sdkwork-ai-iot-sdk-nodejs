/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  FeedbackParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { FeedbackManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FeedbackVO } from './types';
/**
 * Feedback API接口实现
 */
export class FeedbackService {
   feedbackManager: FeedbackManager;
   constructor() {
      this.feedbackManager = ManagerFactory.create( FeedbackManager );
   }

  /**
   * Create new feedback
   */
  async create(data: FeedbackParam, options?: SdkRequestOptions): Promise<FeedbackVO> {
    const response = await this.feedbackManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedbackVO;
  }


  /**
   * Update feedback
   */
  async update(data: FeedbackParam, options?: SdkRequestOptions): Promise<FeedbackVO> {
    const response = await this.feedbackManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedbackVO;
  }


  /**
   * Get feedback by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<FeedbackVO> {
    const response = await this.feedbackManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedbackVO;
  }


  /**
   * Delete feedback
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.feedbackManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get feedback by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<FeedbackVO>> {
    const response = await this.feedbackManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<FeedbackVO>;
  }


  /**
   * Get all feedback records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<FeedbackVO[]> {
    const response = await this.feedbackManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedbackVO[];
  }

}
