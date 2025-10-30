/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  KnowledgeBaseParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  KnowledgeBaseResponse
} from 'sdkwork-sdk-api-typescript';

import { Knowledge_baseManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { KnowledgeBaseVO } from './types';
/**
 * Knowledge_base API接口实现
 */
export class Knowledge_baseService extends BaseService<Knowledge_baseManager, KnowledgeBaseParam, KnowledgeBaseVO> {

   constructor() {
      super(ManagerFactory.create(Knowledge_baseManager));
   }

  /**
   * Get a knowledge base detail by ID
   */
  async getDetail(queryParams?: { id: number|string }, options?: SdkRequestOptions): Promise<KnowledgeBaseVO> {
    const response = await this.manager.getDetail(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO;
  }

}
