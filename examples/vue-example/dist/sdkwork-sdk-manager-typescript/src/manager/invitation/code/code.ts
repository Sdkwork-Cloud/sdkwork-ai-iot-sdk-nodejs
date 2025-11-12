/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * InvitationCode API接口实现
 */
export class InvitationCodeManager extends BaseManager<SdkClient, InvitationCodeParam, InvitationCodeResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'invitation.code' || '';
      super(client, path);
   }
}
