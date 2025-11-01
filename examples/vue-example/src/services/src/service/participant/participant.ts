/**
 * 自动生成的API接口实现
 * 生成时间: Sat Nov 01 17:03:44 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ParticipantParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ParticipantResponse
} from 'sdkwork-sdk-api-typescript';

import { ParticipantManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ParticipantVO } from './types';
/**
 * Participant API接口实现
 */
export class ParticipantService extends BaseService<ParticipantManager, ParticipantParam, ParticipantVO> {

   constructor() {
      const manager = ManagerFactory.create(ParticipantManager);
      super(manager);
   }
}
