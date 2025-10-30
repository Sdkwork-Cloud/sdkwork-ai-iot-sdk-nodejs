/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  InvitationRelationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  InvitationRelationResponse
} from 'sdkwork-sdk-api-typescript';

import { InvitationRelationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvitationRelationVO } from './types';
/**
 * InvitationRelation API接口实现
 */
export class InvitationRelationService extends BaseService<InvitationRelationManager, InvitationRelationParam, InvitationRelationVO> {

   constructor() {
      super(ManagerFactory.create(InvitationRelationManager));
   }
}
