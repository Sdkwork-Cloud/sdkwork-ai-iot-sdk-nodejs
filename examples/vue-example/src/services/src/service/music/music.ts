/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  MusicParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { MusicManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MusicVO } from './types';
/**
 * Music API接口实现
 */
export class MusicService {
   musicManager: MusicManager;
   constructor() {
      this.musicManager = ManagerFactory.create( MusicManager );
   }

  /**
   * Create new music
   */
  async create(data: MusicParam, options?: SdkRequestOptions): Promise<MusicVO> {
    const response = await this.musicManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MusicVO;
  }


  /**
   * Update music
   */
  async update(data: MusicParam, options?: SdkRequestOptions): Promise<MusicVO> {
    const response = await this.musicManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MusicVO;
  }


  /**
   * Get music by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<MusicVO> {
    const response = await this.musicManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MusicVO;
  }


  /**
   * Delete music
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.musicManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get music records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<MusicVO>> {
    const response = await this.musicManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<MusicVO>;
  }


  /**
   * Get all music records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<MusicVO[]> {
    const response = await this.musicManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as MusicVO[];
  }

}
