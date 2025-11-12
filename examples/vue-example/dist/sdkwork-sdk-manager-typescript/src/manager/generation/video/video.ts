/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  GenerateVideoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GenerateVideoResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * GenerationVideo API接口实现
 */
export class GenerationVideoManager extends BaseSdkManager<SdkClient> {

  /**
   * Create video generation task
   */
  async create(data: GenerateVideoParam, options?: SdkRequestOptions): Promise<ApiResult<GenerateVideoResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.generation.video.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<GenerateVideoResponse>;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}
}
