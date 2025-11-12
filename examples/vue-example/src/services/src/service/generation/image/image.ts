/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 11 21:45:47 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  GenerateImageParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GenerateImageResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationImageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { GenerateImageVO } from './types';
/**
 * GenerationImage API接口实现
 */
export class GenerationImageService {
   generationImageManager: GenerationImageManager;
   constructor() {
      this.generationImageManager = ManagerFactory.create( GenerationImageManager );
   }

  /**
   * Create image generation task
   */
  async create(data: GenerateImageParam, options?: SdkRequestOptions): Promise<GenerateImageVO> {
    const response = await this.generationImageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as GenerateImageVO;
  }

}
