/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VoiceSpeakerParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VoiceSpeakerManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VoiceSpeakerVO } from './types';
/**
 * VoiceSpeakerVO API接口实现
 */
export class VoiceSpeakerService {
   voiceSpeakerManager: VoiceSpeakerManager;
   constructor() {
      this.voiceSpeakerManager = ManagerFactory.create( VoiceSpeakerManager );
   }

  /**
   * Create a new voice speaker
   */
  async create(data: VoiceSpeakerParam, options?: SdkRequestOptions): Promise<VoiceSpeakerVO> {
    const response = await this.voiceSpeakerManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VoiceSpeakerVO;
  }


  /**
   * Update an existing voice speaker
   */
  async update(data: VoiceSpeakerParam, options?: SdkRequestOptions): Promise<VoiceSpeakerVO> {
    const response = await this.voiceSpeakerManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VoiceSpeakerVO;
  }


  /**
   * Get a voice speaker by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VoiceSpeakerVO> {
    const response = await this.voiceSpeakerManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VoiceSpeakerVO;
  }


  /**
   * Delete a voice speaker
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.voiceSpeakerManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get voice speakers by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VoiceSpeakerVO>> {
    const response = await this.voiceSpeakerManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VoiceSpeakerVO>;
  }


  /**
   * Get all voice speakers
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VoiceSpeakerVO[]> {
    const response = await this.voiceSpeakerManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VoiceSpeakerVO[];
  }

}
