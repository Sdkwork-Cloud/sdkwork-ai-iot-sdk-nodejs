/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
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

import { FileContentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileContentVO } from './types';
/**
 * FileContent API接口实现
 */
export class FileContentService extends BaseService<FileContentManager, FileContentParam, FileContentVO> {

   constructor() {
      const manager = ManagerFactory.create(FileContentManager);
      super(manager);
   }
}
