import { IUploader } from './uploader';
import { createS3Uploader } from './s3/s3-uploader';
import { OssFilesService } from '@/services';

// 导出类型定义
export type * from './types';

// 导出基础接口和类
export * from './uploader';

// 导出S3上传器实现
export { S3Uploader, createS3Uploader, defaultS3Uploader } from './s3/s3-uploader';

// 导出服务
export { OssFilesService } from '@/services';
 

/**
 * 创建上传器实例的快捷方法
 */
export function createUploader(ossFilesService?: OssFilesService): IUploader {
  return createS3Uploader(ossFilesService);
}