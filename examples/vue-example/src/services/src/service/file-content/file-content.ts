/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  FileContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  FileContentResponse
} from 'sdkwork-sdk-api-typescript';

import { File_contentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileContentVO } from './types';
/**
 * File_content API接口实现
 */
export class File_contentService extends BaseService<File_contentManager, FileContentParam, FileContentVO> {

   constructor() {
      super(ManagerFactory.create(File_contentManager));
   }
}
