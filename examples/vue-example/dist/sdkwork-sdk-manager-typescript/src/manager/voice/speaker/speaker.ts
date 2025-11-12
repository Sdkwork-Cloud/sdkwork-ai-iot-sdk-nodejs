/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  VoiceSpeakerQueryParam,
  VoiceSpeakerParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VoiceSpeakerResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * VoiceSpeaker API接口实现
 */
export class VoiceSpeakerManager extends BaseManager<SdkClient, VoiceSpeakerParam, VoiceSpeakerResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'voice.speaker' || '';
      super(client, path);
   }

  /**
   * Get voice speakers by page
   */
  async listPublic(data: VoiceSpeakerQueryParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<ApiResult<Page<VoiceSpeakerResponse>>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.voice.speaker.listPublic(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Page<VoiceSpeakerResponse>>;
  } catch (error) {
    // 错误处理
    console.error('listPublic 请求失败:', error);
    throw error instanceof Error ? error : new Error('listPublic 请求发生错误');
  }
}
}
