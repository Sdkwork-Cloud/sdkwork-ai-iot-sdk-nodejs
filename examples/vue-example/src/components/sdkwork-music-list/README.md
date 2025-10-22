实现视频列表组件
1. 定义子组件video-list-item,在当前文件中的components中，video-list-item 以卡片方式展示，展示封面，标题，作者，时长等信息。参考传统的Video视频软件，要做的专业一些。
2. sdkwork-video-list组件要使用sdkwork-api-list进行展示列表。参考sdkwork-product-list的实现。
3. 要严格定义标准的props、emit、slot和expose方法。api要支持springboot的标准分页接口。
4. 视频要采用VO模型，VO模型已经定义完毕，不需要重新定义。
5. 视频项目支持onItemClick事件，点击视频卡片，跳转到视频播放页面(/video/{id})。
数据结构如下：
/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type {
  VideoResponse
} from 'sdkwork-sdk-api-typescript';
export declare enum VideoStatus {
    DEFAULT = "DEFAULT",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DELETED = "DELETED"
}

export interface VideoResponse extends BaseResponse {
    format?: string;
    description?: string;
    aspectRatio?: string;
    title?: string;
    uuid?: string;
    version?: string | number;
    resolution?: string;
    width?: number;
    id?: string | number;
    updatedAt?: string;
    height?: number;
    thumbnailUrl?: string;
    status?: VideoStatus;
    duration?: number;
    createdAt?: string;
    contentUrl?: string;
    fileSize?: string | number;
}

export interface VideoVO extends VideoResponse {
}

Service如下：
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
