/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VideoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VideoResponse
} from 'sdkwork-sdk-api-typescript';

import { VideoManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VideoVO } from './types';
/**
 * Video API接口实现
 */
export class VideoService extends BaseService<VideoManager, VideoParam, VideoVO> {

   constructor() {
      super(ManagerFactory.create(VideoManager));
   }
}
