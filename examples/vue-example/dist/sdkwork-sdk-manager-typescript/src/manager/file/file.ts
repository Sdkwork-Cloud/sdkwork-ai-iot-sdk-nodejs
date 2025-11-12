/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  FileParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  FileResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TreeNode
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * File API接口实现
 */
export class FileManager extends BaseManager<SdkClient, FileParam, FileResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'file' || '';
      super(client, path);
   }

  /**
   * Get Tree
   */
  async getTree(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<ApiResult<TreeNode<FileResponse>[]>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.file.getTree(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<TreeNode<FileResponse>[]>;
  } catch (error) {
    // 错误处理
    console.error('getTree 请求失败:', error);
    throw error instanceof Error ? error : new Error('getTree 请求发生错误');
  }
}
}
