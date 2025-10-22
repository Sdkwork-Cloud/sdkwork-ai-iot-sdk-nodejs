/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CategoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
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
export class CategoryService {
   categoryManager: CategoryManager;
   constructor() {
      this.categoryManager = ManagerFactory.create( CategoryManager );
   }

  /**
   * Create a new category
   */
  async create(data: CategoryParam, options?: SdkRequestOptions): Promise<CategoryVO> {
    const response = await this.categoryManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CategoryVO;
  }


  /**
   * Update an existing category
   */
  async update(data: CategoryParam, options?: SdkRequestOptions): Promise<CategoryVO> {
    const response = await this.categoryManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CategoryVO;
  }


  /**
   * Get a category by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CategoryVO> {
    const response = await this.categoryManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CategoryVO;
  }


  /**
   * Delete a category
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.categoryManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get Tree
   */
  async getTree(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<TreeNode<CategoryVO>[]> {
    const response = await this.categoryManager.getTree(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TreeNode<CategoryVO>[];
  }


  /**
   * Get categories by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CategoryVO>> {
    const response = await this.categoryManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CategoryVO>;
  }


  /**
   * Get all categories
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CategoryVO[]> {
    const response = await this.categoryManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CategoryVO[];
  }

}
