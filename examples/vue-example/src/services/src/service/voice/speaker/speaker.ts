/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VoiceSpeakerParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VoiceSpeakerResponse
} from 'sdkwork-sdk-api-typescript';

import { VoiceSpeakerManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VoiceSpeakerVO } from './types';
/**
 * VoiceSpeaker API接口实现
 */
export class VoiceSpeakerService extends BaseService<VoiceSpeakerManager, VoiceSpeakerParam, VoiceSpeakerVO> {

   constructor() {
      super(ManagerFactory.create(VoiceSpeakerManager));
   }
}
