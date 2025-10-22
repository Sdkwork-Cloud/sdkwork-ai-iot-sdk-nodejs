import { BaseS3PresignedUrlUploader } from '../uploader';
import {
  UploadRequestParam,
  UploadResponse,
  UploadProgress,
  MultipartUploadConfig,
  MultipartUploadResult,
  MultipleFilesUploadParam,
  MultipleUploadConfig,
  MultipleUploadResult,
  SimplifiedUploadParam
} from '../types';
import { OssFilesService } from "@/services";
import { GetUrlResult } from 'sdkwork-sdk-api-typescript';

/**
 * S3标准上传器具体实现类
 * 基于预签名URL的完整S3上传实现
 */
export class S3Uploader extends BaseS3PresignedUrlUploader {

  constructor(ossFilesService?: OssFilesService) {
    super(ossFilesService);
  }

  /**
   * 单文件上传（重写以提供具体实现）
   */
  async upload(param: UploadRequestParam, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    // 使用基类的实现，已经包含了完整的重试机制和错误处理
    return super.upload(param, onProgress);
  }

  /**
   * 多文件上传（重写以提供具体实现）
   */
  async uploadMultiple(param: MultipleFilesUploadParam, config?: MultipleUploadConfig): Promise<MultipleUploadResult[]> {
    // 使用基类的实现，已经包含了并发控制和进度监控
    return super.uploadMultiple(param, config);
  }

  /**
   * 分片上传（具体实现）
   */
  async multipartUpload(
    param: UploadRequestParam,
    config: MultipartUploadConfig,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MultipartUploadResult> {
    // 使用基类的实现，已经包含了分片上传的基本逻辑
    return super.multipartUpload(param, config, onProgress);
  }

  /**
   * 取消上传任务（具体实现）
   */
  cancel(uploadId: string): void {
    super.cancel(uploadId);
  }

  /**
   * 暂停上传任务（具体实现）
   */
  pause(uploadId: string): void {
    super.pause(uploadId);
  }

  /**
   * 恢复上传任务（具体实现）
   */
  resume(uploadId: string): void {
    super.resume(uploadId);
  }

  /**
   * 获取上传任务列表（具体实现）
   */
  getUploadTasks() {
    return super.getUploadTasks();
  }

  /**
   * 获取特定上传任务（具体实现）
   */
  getUploadTask(uploadId: string) {
    return super.getUploadTask(uploadId);
  }

  /**
   * 清理已完成的任务（具体实现）
   */
  cleanupCompletedTasks(): void {
    super.cleanupCompletedTasks();
  }

  /**
   * 初始化分片上传（具体实现）
   */
  protected async initiateMultipartUpload(param: SimplifiedUploadParam): Promise<string> {
    try {
      // 使用getPresignedUrl方法获取初始化分片上传的URL
      const presignedUrlResult = await this.getPresignedUrl({
        bucket: param.bucket,
        name: param.name,
        scene: param.scene,
        method: 'POST',
        contentType: 'application/xml',
        acl: param.acl,
        expiresIn: 3600
      });
      const uploadUrl = presignedUrlResult.url as string;
      // 调用S3的Initiate Multipart Upload API
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
        },
        body: '<?xml version="1.0" encoding="UTF-8"?><InitiateMultipartUpload xmlns="http://s3.amazonaws.com/doc/2006-03-01/"/>'
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate multipart upload: ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      // 解析XML响应获取UploadId
      const uploadIdMatch = xmlResponse.match(/<UploadId>([^<]+)<\/UploadId>/);
      if (!uploadIdMatch) {
        throw new Error('Failed to parse upload ID from S3 response');
      }

      const uploadId = uploadIdMatch[1];
      console.log(`S3 multipart upload initiated: ${uploadId}`);
      return uploadId;
    } catch (error) {
      console.error('S3 multipart upload initiation failed:', error);
      throw new Error(`S3 multipart upload initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 上传分片（具体实现）
   */
  protected async uploadPart(
    param: UploadRequestParam,
    uploadId: string,
    partNumber: number,
    start: number,
    end: number
  ): Promise<{ etag: string; partNumber: number; size: number }> {
    try {
      // 获取分片数据
      const file = param.file;
      const chunk = file.slice(start, end);
      const chunkSize = end - start;

      // 获取分片的预签名URL
      const presignedUrlResult = await this.getPresignedUrl({
        bucket: param.bucket,
        name: param.name,
        scene: param.scene,
        method: 'PUT',
        contentType: param.contentType || 'application/octet-stream',
        acl: param.acl,
        expiresIn: 3600,
        queryParams: {
          partNumber: partNumber.toString(),
          uploadId: uploadId
        }
      });
      const uploadUrl = presignedUrlResult.url as string;
      // 上传分片
      const response = await this.uploadPartWithPresignedUrl(
        uploadUrl,
        chunk,
        param.contentType || 'application/octet-stream',
        param.metadata
      );

      if (!response.ok) {
        throw new Error(`Part ${partNumber} upload failed with status: ${response.status}`);
      }

      const etag = response.headers.get('ETag') || '';

      return {
        etag,
        partNumber,
        size: chunkSize
      };
    } catch (error) {
      console.error(`S3 part ${partNumber} upload failed:`, error);
      throw new Error(`S3 part ${partNumber} upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 使用预签名URL上传分片
   */
  private async uploadPartWithPresignedUrl(
    url: string,
    chunk: Blob,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<Response> {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        ...metadata
      },
      body: chunk
    });
  }

  /**
   * 完成分片上传（具体实现）
   */
  protected async completeMultipartUpload(
    uploadId: string,
    parts: Array<{ partNumber: number; etag: string; size: number }>
  ): Promise<UploadResponse> {
    try {
      // 从multipartUploadIdMap中获取对应的uploadId
      const taskUploadId = this.multipartUploadIdMap.get(uploadId);
      const task = taskUploadId ? this.uploadTasks.get(taskUploadId) : undefined;

      // 从任务中获取bucket和key信息
      const bucket = task?.param.bucket || { name: 'public' };
      const name = task?.param.name || '';
      const scene = task?.param.scene || '';



      // 获取完成分片上传的预签名URL
      const presignedUrlResult = await this.getPresignedUrl({
        bucket: bucket,
        name: name,
        scene: scene,
        method: 'POST',
        contentType: 'application/xml',
        acl: 'private',
        expiresIn: 3600,
        queryParams: {
          uploadId: uploadId
        }
      });

      // 构建完成请求的XML体
      const completeRequest = `<?xml version="1.0" encoding="UTF-8"?>
<CompleteMultipartUpload xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  ${parts.map(part => `
    <Part>
      <PartNumber>${part.partNumber}</PartNumber>
      <ETag>${part.etag}</ETag>
    </Part>
  `).join('')}
</CompleteMultipartUpload>`;
      const uploadUrl = presignedUrlResult.url as string;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: completeRequest,
        headers: {
          'Content-Type': 'application/xml',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to complete multipart upload: ${response.statusText}`);
      }

      const totalSize = parts.reduce((sum, part) => sum + part.size, 0);

      const uploadResponse: UploadResponse = {
        url: uploadUrl.split('?')[0], // 获取基础URL（去掉查询参数）
        size: totalSize,
        bucket: bucket,
        objectKey: presignedUrlResult.objectKey as string,
        uploadTime: Date.now(),
        metadata: {},
        etag: `"${uploadId}"`
      };

      console.log(`S3 multipart upload completed: ${uploadId}`);
      return uploadResponse;
    } catch (error) {
      console.error('S3 multipart upload completion failed:', error);
      throw new Error(`S3 multipart upload completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取预签名URL（具体实现）
   */
  protected async getPresignedUrl(param: any): Promise<GetUrlResult> {
    // 使用基类的实现，已经包含了OssFilesService的调用
    return super.getPresignedUrl(param);
  }

  /**
   * 使用预签名URL上传文件（具体实现）
   */
  protected async uploadWithPresignedUrl(
    param: UploadRequestParam,
    presignedUrlResult: GetUrlResult,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    // 使用基类的实现，已经包含了进度监控和错误处理
    return super.uploadWithPresignedUrl(param, presignedUrlResult, onProgress);
  }
}

/**
 * 创建S3上传器实例的工厂函数
 */
export function createS3Uploader(ossFilesService?: OssFilesService): S3Uploader {
  return new S3Uploader(ossFilesService);
}

/**
 * 默认的S3上传器实例
 */
export const defaultS3Uploader = createS3Uploader();