/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  AiAgentParam,
  AiAgentQueryListParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiAgentResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Agent API接口实现
 */
export class AgentManager extends BaseManager<SdkClient, AiAgentParam, AiAgentResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'agent' || '';
      super(client, path);
   }

  /**
   * Get public AI agents by page
   */
  async listPublic(data: AiAgentQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<ApiResult<Page<AiAgentResponse>>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.agent.listPublic(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Page<AiAgentResponse>>;
  } catch (error) {
    // 错误处理
    console.error('listPublic 请求失败:', error);
    throw error instanceof Error ? error : new Error('listPublic 请求发生错误');
  }
}
}
