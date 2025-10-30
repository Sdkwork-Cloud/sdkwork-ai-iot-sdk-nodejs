/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  InvitationCodeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  InvitationCodeResponse
} from 'sdkwork-sdk-api-typescript';

import { InvitationCodeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvitationCodeVO } from './types';
/**
 * InvitationCode API接口实现
 */
export class InvitationCodeService extends BaseService<InvitationCodeManager, InvitationCodeParam, InvitationCodeVO> {

   constructor() {
      super(ManagerFactory.create(InvitationCodeManager));
   }
}
