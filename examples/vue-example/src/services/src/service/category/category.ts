/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CategoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CategoryResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TreeNode
} from 'sdkwork-sdk-api-typescript';

import { CategoryManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CategoryVO } from './types';
/**
 * Category API接口实现
 */
export class CategoryService extends BaseService<CategoryManager, CategoryParam, CategoryVO> {

   constructor() {
      super(ManagerFactory.create(CategoryManager));
   }

  /**
   * Get Tree
   */
  async getTree(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<TreeNode<CategoryVO>[]> {
    const response = await this.manager.getTree(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TreeNode<CategoryVO>[];
  }

}
