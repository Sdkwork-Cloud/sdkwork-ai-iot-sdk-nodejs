/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  GenerateImageParam
} from '../../../types/generation';

import type {
  GenerateImageResponse
} from '../../../types/generation';

/**
 * Image API接口实现
 */
export class ImageApi extends BaseSdkApi {

  /**
   * Create image generation task
   */
  async create(data: GenerateImageParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<GenerateImageResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/generation/image/create`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/generation/image/create`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<GenerateImageResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}
}
