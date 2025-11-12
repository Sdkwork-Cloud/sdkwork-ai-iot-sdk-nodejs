/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 11 21:45:47 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  GenerateMusicParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GenerateMusicResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationMusicManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { GenerateMusicVO } from './types';
/**
 * GenerationMusic API接口实现
 */
export class GenerationMusicService {
   generationMusicManager: GenerationMusicManager;
   constructor() {
      this.generationMusicManager = ManagerFactory.create( GenerationMusicManager );
   }

  /**
   * Create music generation task
   */
  async create(data: GenerateMusicParam, options?: SdkRequestOptions): Promise<GenerateMusicVO> {
    const response = await this.generationMusicManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as GenerateMusicVO;
  }

}
