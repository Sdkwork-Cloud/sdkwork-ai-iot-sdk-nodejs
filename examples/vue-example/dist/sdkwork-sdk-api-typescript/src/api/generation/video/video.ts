/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  GenerateVideoParam
} from '../../../types/generation';

import type {
  GenerateVideoResponse
} from '../../../types/generation';

/**
 * Video API接口实现
 */
export class VideoApi extends BaseSdkApi {

  /**
   * Create video generation task
   */
  async create(data: GenerateVideoParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<GenerateVideoResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/generation/video/create`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/generation/video/create`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<GenerateVideoResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}
}
