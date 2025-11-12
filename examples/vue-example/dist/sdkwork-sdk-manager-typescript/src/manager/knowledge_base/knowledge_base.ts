/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Knowledge_base API接口实现
 */
export class Knowledge_baseManager extends BaseManager<SdkClient, KnowledgeBaseParam, KnowledgeBaseResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'knowledge_base' || '';
      super(client, path);
   }

  /**
   * Get a knowledge base detail by ID
   */
  async getDetail(queryParams?: { id: number|string }, options?: SdkRequestOptions): Promise<ApiResult<KnowledgeBaseResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.knowledge_base.getDetail(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<KnowledgeBaseResponse>;
  } catch (error) {
    // 错误处理
    console.error('getDetail 请求失败:', error);
    throw error instanceof Error ? error : new Error('getDetail 请求发生错误');
  }
}
}
