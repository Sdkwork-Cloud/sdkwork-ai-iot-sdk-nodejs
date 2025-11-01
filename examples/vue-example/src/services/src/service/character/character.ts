/**
 * 自动生成的API接口实现
 * 生成时间: Sat Nov 01 17:03:44 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CharacterParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CharacterResponse
} from 'sdkwork-sdk-api-typescript';

import { CharacterManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CharacterVO } from './types';
/**
 * Character API接口实现
 */
export class CharacterService extends BaseService<CharacterManager, CharacterParam, CharacterVO> {

   constructor() {
      const manager = ManagerFactory.create(CharacterManager);
      super(manager);
   }
}
