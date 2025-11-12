/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  CommentsParam,
  CommentsReplyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CommentsResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Comments API接口实现
 */
export class CommentsManager extends BaseManager<SdkClient, CommentsParam, CommentsResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'comments' || '';
      super(client, path);
   }

  /**
   * Reply to a comment
   */
  async reply(data: CommentsReplyParam, id: number|string, options?: SdkRequestOptions): Promise<ApiResult<CommentsResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.comments.reply(data, id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<CommentsResponse>;
  } catch (error) {
    // 错误处理
    console.error('reply 请求失败:', error);
    throw error instanceof Error ? error : new Error('reply 请求发生错误');
  }
}

  /**
   * Unlike a comment
   */
  async unlike(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<CommentsResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.comments.unlike(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<CommentsResponse>;
  } catch (error) {
    // 错误处理
    console.error('unlike 请求失败:', error);
    throw error instanceof Error ? error : new Error('unlike 请求发生错误');
  }
}

  /**
   * Like a comment
   */
  async like(id: number|string, options?: SdkRequestOptions): Promise<ApiResult<CommentsResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.comments.like(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<CommentsResponse>;
  } catch (error) {
    // 错误处理
    console.error('like 请求失败:', error);
    throw error instanceof Error ? error : new Error('like 请求发生错误');
  }
}
}
