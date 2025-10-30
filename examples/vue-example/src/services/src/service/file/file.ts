/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { FileManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileVO } from './types';
/**
 * File API接口实现
 */
export class FileService extends BaseService<FileManager, FileParam, FileVO> {

   constructor() {
      super(ManagerFactory.create(FileManager));
   }

  /**
   * Get Tree
   */
  async getTree(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<TreeNode<FileVO>[]> {
    const response = await this.manager.getTree(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TreeNode<FileVO>[];
  }

}
