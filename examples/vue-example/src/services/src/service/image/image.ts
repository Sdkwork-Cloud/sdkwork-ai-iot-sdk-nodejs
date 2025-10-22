/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ImageParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ImageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ImageVO } from './types';
/**
 * Image API接口实现
 */
export class ImageService {
   imageManager: ImageManager;
   constructor() {
      this.imageManager = ManagerFactory.create( ImageManager );
   }

  /**
   * Create a new image
   */
  async create(data: ImageParam, options?: SdkRequestOptions): Promise<ImageVO> {
    const response = await this.imageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ImageVO;
  }


  /**
   * Update an existing image
   */
  async update(data: ImageParam, options?: SdkRequestOptions): Promise<ImageVO> {
    const response = await this.imageManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ImageVO;
  }


  /**
   * Get an image by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ImageVO> {
    const response = await this.imageManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ImageVO;
  }


  /**
   * Delete an image
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.imageManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get images by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ImageVO>> {
    const response = await this.imageManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ImageVO>;
  }


  /**
   * Get all images
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ImageVO[]> {
    const response = await this.imageManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ImageVO[];
  }

}
