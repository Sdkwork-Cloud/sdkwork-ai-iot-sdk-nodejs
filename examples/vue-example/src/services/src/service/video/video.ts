/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VideoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VideoManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VideoVO } from './types';
/**
 * Video API接口实现
 */
export class VideoService {
   videoManager: VideoManager;
   constructor() {
      this.videoManager = ManagerFactory.create( VideoManager );
   }

  /**
   * Create a new video
   */
  async create(data: VideoParam, options?: SdkRequestOptions): Promise<VideoVO> {
    const response = await this.videoManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VideoVO;
  }


  /**
   * Update an existing video
   */
  async update(data: VideoParam, options?: SdkRequestOptions): Promise<VideoVO> {
    const response = await this.videoManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VideoVO;
  }


  /**
   * Get a video by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VideoVO> {
    const response = await this.videoManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VideoVO;
  }


  /**
   * Delete a video
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.videoManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get videos by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VideoVO>> {
    const response = await this.videoManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VideoVO>;
  }


  /**
   * Get all videos
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VideoVO[]> {
    const response = await this.videoManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VideoVO[];
  }

}
