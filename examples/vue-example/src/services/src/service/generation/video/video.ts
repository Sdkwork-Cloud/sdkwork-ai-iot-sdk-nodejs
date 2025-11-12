/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 11 21:45:47 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  GenerateVideoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GenerateVideoResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationVideoManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { GenerateVideoVO } from './types';
/**
 * GenerationVideo API接口实现
 */
export class GenerationVideoService {
   generationVideoManager: GenerationVideoManager;
   constructor() {
      this.generationVideoManager = ManagerFactory.create( GenerationVideoManager );
   }

  /**
   * Create video generation task
   */
  async create(data: GenerateVideoParam, options?: SdkRequestOptions): Promise<GenerateVideoVO> {
    const response = await this.generationVideoManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as GenerateVideoVO;
  }

}
