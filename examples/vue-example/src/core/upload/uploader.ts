import {
  UploadRequestParam,
  UploadResponse,
  UploadProgress,
  UploadError,
  MultipartUploadConfig,
  MultipartUploadResult,
  UploadStatus,
  UploadTask,
  MultipleUploadConfig,
  MultipleUploadProgress,
  MultipleUploadResult,
  MultipleUploadError,
  CancellationToken,
  SimplifiedUploadParam,
  MultipleFilesUploadParam
} from "./types";
import { OssFilesService } from "@/services";
import { RequestMethod, OssProvider, GetPresignedUrlParam, GetUrlResult } from "sdkwork-sdk-api-typescript";

/**
 * 抽象上传器接口
 */
export interface IUploader {
  /**
   * 单文件上传
   * @param param 上传参数（包含file和其他配置）
   * @param onProgress 进度回调
   * @returns 上传响应
   */
  upload(
    param: UploadRequestParam,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse>;

  /**
   * 多文件上传
   * @param param 多文件上传参数
   * @param config 多文件上传配置
   * @returns 上传结果数组
   */
  uploadMultiple(
    param: MultipleFilesUploadParam,
    config?: MultipleUploadConfig
  ): Promise<MultipleUploadResult[]>;

  /**
   * 分片上传（大文件支持）
   * @param param 上传参数
   * @param config 分片配置
   * @param onProgress 进度回调
   * @returns 分片上传结果
   */
  multipartUpload(
    param: UploadRequestParam,
    config: MultipartUploadConfig,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MultipartUploadResult>;

  /**
   * 取消上传任务
   * @param uploadId 上传任务ID
   */
  cancel(uploadId: string): void;

  /**
   * 暂停上传任务
   * @param uploadId 上传任务ID
   */
  pause(uploadId: string): void;

  /**
   * 恢复上传任务
   * @param uploadId 上传任务ID
   */
  resume(uploadId: string): void;

  /**
   * 获取上传任务列表
   */
  getUploadTasks(): UploadTask[];

  /**
   * 获取特定上传任务
   * @param uploadId 上传任务ID
   */
  getUploadTask(uploadId: string): UploadTask | undefined;

  /**
   * 清理已完成的任务
   */
  cleanupCompletedTasks(): void;
}

/**
 * S3标准上传器基础实现类（基于预签名URL）
 * 提供通用的S3上传功能，可被具体实现类继承和扩展
 */
export class BaseS3PresignedUrlUploader implements IUploader {
  protected ossFilesService: OssFilesService;
  protected uploadTasks: Map<string, UploadTask> = new Map();
  protected cancellationTokens: Map<string, CancellationToken> = new Map();
  protected multipartUploadIdMap: Map<string, string> = new Map(); // multipartUploadId -> uploadId 映射

  constructor(ossFilesService?: OssFilesService) {
    this.ossFilesService = ossFilesService || new OssFilesService();
  }

  async upload(param: UploadRequestParam, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> {
    const maxRetries = param.config?.retryCount || 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 获取预签名URL
        const presignedUrlParam: GetPresignedUrlParam = {
          bucket: param.bucket,
          name: param.name,
          scene: param.scene,
          method: RequestMethod.PUT // 明确指定PUT方法用于上传
        };

        const presignedUrlResult = await this.getPresignedUrl(presignedUrlParam);

        // 使用预签名URL上传文件
        return await this.uploadWithPresignedUrl(param, presignedUrlResult, onProgress);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // 如果是最后一次尝试或者错误不可重试，直接抛出
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          throw lastError;
        }

        // 等待一段时间后重试（指数退避）
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // 最大10秒
        await this.delay(delay);

        console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms:`, error);
      }
    }

    throw lastError || new Error('Upload failed after all retries');
  }

  /**
   * 判断错误是否可重试
   */
  private isRetryableError(error: any): boolean {
    if (error instanceof Error) {
      // 网络错误、超时错误、5xx服务器错误可重试
      const message = error.message.toLowerCase();
      return message.includes('network') ||
        message.includes('timeout') ||
        message.includes('5') ||
        message.includes('retry');
    }
    return false;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadMultiple(param: MultipleFilesUploadParam, config?: MultipleUploadConfig): Promise<MultipleUploadResult[]> {
    // 参数验证
    if (!param.files || param.files.length === 0) {
      throw new Error('No files provided for upload');
    }

    const concurrentUploads = Math.min(config?.concurrentUploads || 3, param.files.length);
    const results: MultipleUploadResult[] = [];
    const individualProgress = new Map<string, UploadProgress>();
    const uploadTasks: UploadTask[] = [];

    // 创建上传任务
    for (const file of param.files) {
      const uploadParam: UploadRequestParam = {
        file,
        bucket: param.bucket,
        name: param.name,
        scene: param.scene,
        metadata: param.metadata,
        contentType: param.contentType,
        acl: param.acl,
        config: param.config
      };

      const task = this.createUploadTask(uploadParam);
      uploadTasks.push(task);
      this.uploadTasks.set(task.id, task);
    }

    // 并发控制上传
    const processBatch = async (batchFiles: File[]): Promise<MultipleUploadResult[]> => {
      const batchResults: MultipleUploadResult[] = [];

      for (const file of batchFiles) {
        const task = uploadTasks.find(t => t.param.file === file);
        if (!task) continue;

        const taskId = task.id;
        const fileName = file.name;

        try {
          const response = await this.upload(task.param, (progress) => {
            individualProgress.set(taskId, progress);

            // 更新任务进度
            this.updateProgress(taskId, progress.loaded, progress.total);

            // 触发整体进度回调
            if (config?.onProgress) {
              // 计算当前批次和已完成批次的总进度
              const totalFiles = param.files.length;
              const completedFiles = results.filter(r => r.success).length +
                batchResults.filter(r => r.success).length;
              const failedFiles = results.filter(r => !r.success).length +
                batchResults.filter(r => !r.success).length;
              const totalBytes = param.files.reduce((sum, f) => sum + f.size, 0);
              const uploadedBytes = Array.from(individualProgress.values())
                .reduce((sum, p) => sum + p.loaded, 0);

              const overallProgress: MultipleUploadProgress = {
                totalFiles,
                completedFiles,
                failedFiles,
                totalBytes,
                uploadedBytes,
                overallPercentage: totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0,
                individualProgress
              };

              config.onProgress(overallProgress);
            }
          });

          this.markTaskCompleted(taskId, response);

          batchResults.push({
            taskId,
            fileName,
            success: true,
            response
          });
        } catch (error) {
          const uploadError: UploadError = {
            code: 'UPLOAD_FAILED',
            message: error instanceof Error ? error.message : 'Upload failed',
            details: error,
            retryable: this.isRetryableError(error)
          };

          this.markTaskFailed(taskId, uploadError);

          batchResults.push({
            taskId,
            fileName,
            success: false,
            error: uploadError
          });
        }
      }

      return batchResults;
    };

    // 分批处理文件
    const batches: File[][] = [];
    for (let i = 0; i < param.files.length; i += concurrentUploads) {
      batches.push(param.files.slice(i, i + concurrentUploads));
    }

    // 按批次执行上传
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await processBatch(batches[i]);
      results.push(...batchResults);

      // 通知批次完成进度
      if (config?.onComplete) {
        config.onComplete(results);
      }

      // 检查是否取消
      if (config?.cancellationToken?.isCancelled) {
        // 取消剩余任务
        for (let j = i + 1; j < batches.length; j++) {
          for (const file of batches[j]) {
            const task = uploadTasks.find(t => t.param.file === file);
            if (task) {
              this.cancel(task.id);
            }
          }
        }
        break;
      }
    }

    // 清理已完成的任务
    this.cleanupCompletedTasks();

    return results;
  }

  async multipartUpload(param: UploadRequestParam, config: MultipartUploadConfig, onProgress?: (progress: UploadProgress) => void): Promise<MultipartUploadResult> {
    const uploadId = this.generateUploadId();
    const task = this.createUploadTask(param);
    this.uploadTasks.set(uploadId, task);

    const cancellationToken = this.createCancellationToken();
    this.cancellationTokens.set(uploadId, cancellationToken);

    try {
      task.status = UploadStatus.UPLOADING;

      // 初始化分片上传
      const multipartInitParam: SimplifiedUploadParam = {
        bucket: param.bucket,
        name: param.name,
        scene: param.scene,
        metadata: param.metadata,
        contentType: param.contentType,
        acl: param.acl,
        config: param.config
      };

      const multipartUploadId = await this.initiateMultipartUpload(multipartInitParam);

      // 存储映射关系
      this.multipartUploadIdMap.set(multipartUploadId, uploadId);

      const file = param.file;
      const partSize = config.partSize || 5 * 1024 * 1024; // 默认5MB
      const totalParts = Math.ceil(file.size / partSize);
      const parts: Array<{ partNumber: number; etag: string; size: number }> = [];

      // 并发上传分片
      const partPromises = [];
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, file.size);

        partPromises.push(this.uploadPart(param, multipartUploadId, partNumber, start, end));
      }

      // 控制并发数
      const concurrentUploads = config.concurrentUploads || 3;
      const chunkedPromises = [];
      for (let i = 0; i < partPromises.length; i += concurrentUploads) {
        const chunk = partPromises.slice(i, i + concurrentUploads);
        chunkedPromises.push(Promise.all(chunk));
      }

      // 按批次上传分片
      for (let i = 0; i < chunkedPromises.length; i++) {
        const chunkResults = await chunkedPromises[i];
        parts.push(...chunkResults);

        // 更新进度
        const uploadedBytes = parts.reduce((sum, part) => sum + part.size, 0);
        this.updateProgress(uploadId, uploadedBytes, file.size);

        if (onProgress) {
          onProgress(task.progress);
        }

        // 检查是否取消
        if (cancellationToken.isCancelled) {
          throw new Error('Upload cancelled');
        }
      }

      // 完成分片上传
      const uploadResponse = await this.completeMultipartUpload(multipartUploadId, parts);

      const result: MultipartUploadResult = {
        uploadId: multipartUploadId,
        parts,
        completed: true
      };

      this.markTaskCompleted(uploadId, uploadResponse);

      // 清理映射关系
      this.multipartUploadIdMap.delete(multipartUploadId);

      return result;

    } catch (error) {
      const uploadError: UploadError = {
        code: 'MULTIPART_UPLOAD_FAILED',
        message: error instanceof Error ? error.message : 'Multipart upload failed',
        details: error,
        retryable: true
      };

      this.markTaskFailed(uploadId, uploadError);
      throw error;
    } finally {
      this.cancellationTokens.delete(uploadId);
      // 确保在异常情况下也清理映射关系
      const multipartUploadId = Array.from(this.multipartUploadIdMap.entries())
        .find(([_, uid]) => uid === uploadId)?.[0];
      if (multipartUploadId) {
        this.multipartUploadIdMap.delete(multipartUploadId);
      }
    }
  }

  cancel(uploadId: string): void {
    const task = this.uploadTasks.get(uploadId);
    if (task && (task.status === UploadStatus.UPLOADING || task.status === UploadStatus.PENDING)) {
      task.status = UploadStatus.CANCELLED;
      task.endTime = Date.now();

      const token = this.cancellationTokens.get(uploadId);
      if (token) {
        token.cancel();
        this.cancellationTokens.delete(uploadId);
      }
    }
  }

  pause(uploadId: string): void {
    const task = this.uploadTasks.get(uploadId);
    if (task && task.status === UploadStatus.UPLOADING) {
      task.status = UploadStatus.PAUSED;

      const token = this.cancellationTokens.get(uploadId);
      if (token) {
        token.cancel();
      }
    }
  }

  resume(uploadId: string): void {
    const task = this.uploadTasks.get(uploadId);
    if (task && task.status === UploadStatus.PAUSED) {
      task.status = UploadStatus.UPLOADING;
      // 具体的恢复逻辑需要在具体实现中处理
    }
  }

  getUploadTasks(): UploadTask[] {
    return Array.from(this.uploadTasks.values());
  }

  getUploadTask(uploadId: string): UploadTask | undefined {
    return this.uploadTasks.get(uploadId);
  }

  cleanupCompletedTasks(): void {
    // 使用Array.from将Map转换为数组进行迭代，避免迭代器兼容性问题
    const entries = Array.from(this.uploadTasks.entries());
    for (const [uploadId, task] of entries) {
      if (task.status === UploadStatus.COMPLETED || task.status === UploadStatus.FAILED || task.status === UploadStatus.CANCELLED) {
        this.uploadTasks.delete(uploadId);
        this.cancellationTokens.delete(uploadId);
      }
    }
  }

  /**
   * 生成唯一上传ID
   */
  protected generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 创建取消令牌
   */
  protected createCancellationToken(): CancellationToken {
    const token: CancellationToken = {
      isCancelled: false,
      cancel: () => {
        token.isCancelled = true;
      }
    };
    return token;
  }

  /**
   * 创建上传任务
   */
  protected createUploadTask(param: UploadRequestParam): UploadTask {
    const file = param.file;
    const fileName = file instanceof File ? file.name : 'blob';
    const fileSize = file.size;

    return {
      id: this.generateUploadId(),
      objectKey: '',//TODO implemenets 
      bucket: param.bucket as any,
      param,
      fileName,
      fileSize,
      status: UploadStatus.PENDING,
      progress: {
        loaded: 0,
        total: fileSize,
        percentage: 0,
        speed: 0,
        elapsedTime: 0
      },
      startTime: Date.now()
    };
  }

  /**
   * 更新上传进度
   */
  protected updateProgress(uploadId: string, loaded: number, total: number): void {
    const task = this.uploadTasks.get(uploadId);
    if (task) {
      const startTime = task.startTime || Date.now();
      const elapsedTime = Date.now() - startTime;
      const speed = elapsedTime > 0 ? (loaded / elapsedTime) * 1000 : 0; // bytes per second

      task.progress = {
        loaded,
        total,
        percentage: total > 0 ? Math.round((loaded / total) * 100) : 0,
        speed,
        elapsedTime
      };
    }
  }

  /**
   * 标记任务完成
   */
  protected markTaskCompleted(uploadId: string, response: UploadResponse): void {
    const task = this.uploadTasks.get(uploadId);
    if (task) {
      task.status = UploadStatus.COMPLETED;
      task.uploadResponse = response;
      task.endTime = Date.now();
      this.updateProgress(uploadId, task.fileSize, task.fileSize);
    }
  }

  /**
   * 标记任务失败
   */
  protected markTaskFailed(uploadId: string, error: UploadError): void {
    const task = this.uploadTasks.get(uploadId);
    if (task) {
      task.status = UploadStatus.FAILED;
      task.error = error;
      task.endTime = Date.now();
    }
  }

  /**
   * 获取预签名URL
   */
  protected async getPresignedUrl(param: GetPresignedUrlParam): Promise<GetUrlResult> {
    try {
      // 确保method属性正确传递（默认为PUT方法用于上传）
      const presignedUrlParam: GetPresignedUrlParam = {
        ...param,
        method: param.method || RequestMethod.PUT // 默认使用PUT方法
      };

      // 调用OssFilesService获取预签名URL
      const result = await this.ossFilesService.getPresignedUrl(presignedUrlParam);

      if (!result.url) {
        throw new Error('Failed to get presigned URL: URL is empty');
      }

      return result;
    } catch (error) {
      console.error('获取预签名URL失败:', error);
      throw error instanceof Error ? error : new Error('获取预签名URL时发生错误');
    }
  }

  /**
   * 使用预签名URL上传文件（带进度监控）
   */
  protected async uploadWithPresignedUrl(
    param: UploadRequestParam,
    presignedUrlResult: GetUrlResult,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    const uploadId = this.generateUploadId();
    const task = this.createUploadTask(param);
    this.uploadTasks.set(uploadId, task);

    const cancellationToken = this.createCancellationToken();
    this.cancellationTokens.set(uploadId, cancellationToken);

    try {
      task.status = UploadStatus.UPLOADING;

      // 验证文件大小
      if (param.file.size === 0) {
        throw new Error('File is empty');
      }
      let uploadUrl = presignedUrlResult.url as string;
      // 创建带进度监控的fetch请求
      const response = await this.fetchWithProgress(
        uploadUrl as string,
        param.file,
        param.contentType || 'application/octet-stream',
        param.metadata,
        (loaded, total) => {
          this.updateProgress(uploadId, loaded, total);
          if (onProgress) {
            onProgress(task.progress);
          }
        },
        cancellationToken
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      const previewUrl = presignedUrlResult.previewUrl || uploadUrl

      const uploadResponse: UploadResponse = {
        url: previewUrl, // 移除查询参数得到纯净的URL
        size: param.file.size,
        bucket: param.bucket as any,
        objectKey: presignedUrlResult.objectKey as string,
        uploadTime: Date.now(),
        metadata: param.metadata,
        etag: response.headers.get('ETag') || undefined
      };

      this.markTaskCompleted(uploadId, uploadResponse);
      return uploadResponse;
    } catch (error) {
      const uploadError: UploadError = {
        code: 'UPLOAD_FAILED',
        message: error instanceof Error ? error.message : 'Upload failed',
        details: error,
        retryable: !cancellationToken.isCancelled // 如果是取消操作，不可重试
      };

      this.markTaskFailed(uploadId, uploadError);
      throw error;
    } finally {
      this.cancellationTokens.delete(uploadId);
    }
  }

  /**
   * 带进度监控的fetch请求
   */
  private async fetchWithProgress(
    url: string,
    body: File | Blob,
    contentType: string,
    metadata?: Record<string, string>,
    onProgress?: (loaded: number, total: number) => void,
    cancellationToken?: CancellationToken
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 监听进度
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress(event.loaded, event.total);
          }
        });
      }

      // 监听完成
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.response, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers({ 'ETag': xhr.getResponseHeader('ETag') || '' })
          }));
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });

      // 监听错误
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      // 监听取消
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // 打开连接
      xhr.open('PUT', url);

      // 设置请求头
      xhr.setRequestHeader('Content-Type', contentType);
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // 发送请求
      xhr.send(body);

      // 监听取消令牌
      if (cancellationToken) {
        const checkCancellation = () => {
          if (cancellationToken.isCancelled) {
            xhr.abort();
          }
        };

        // 定期检查取消状态
        const intervalId = setInterval(checkCancellation, 100);

        // 清理函数
        const cleanup = () => clearInterval(intervalId);
        xhr.addEventListener('load', cleanup);
        xhr.addEventListener('error', cleanup);
        xhr.addEventListener('abort', cleanup);
      }
    });
  }

  /**
   * 初始化分片上传
   */
  protected async initiateMultipartUpload(param: SimplifiedUploadParam): Promise<string> {
    try {
      // 这里需要调用OssFilesService的分片上传初始化方法
      // 暂时返回一个模拟的uploadId
      const uploadId = `multipart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Multipart upload initiated: ${uploadId}`);
      return uploadId;
    } catch (error) {
      console.error('Failed to initiate multipart upload:', error);
      throw new Error(`Multipart upload initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 上传分片
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

      // 为分片生成唯一的key
      const partKey = `${param.name}.part${partNumber}`;

      // 获取分片的预签名URL
      const partParam: GetPresignedUrlParam = {
        bucket: param.bucket,
        name: param.name,
        scene: param.scene,
        method: RequestMethod.PUT // 分片上传使用PUT方法
      };

      const presignedUrlResult = await this.getPresignedUrl(partParam);

      // 上传分片
      const response = await this.fetchWithProgress(
        presignedUrlResult.url as string,
        chunk,
        param.contentType || 'application/octet-stream',
        param.metadata,
        undefined, // 分片上传不需要进度回调
        undefined  // 分片上传不需要取消令牌
      );

      if (!response.ok) {
        throw new Error(`Part upload failed with status: ${response.status}`);
      }

      const etag = response.headers.get('ETag') || '';

      return {
        etag,
        partNumber,
        size: chunkSize
      };
    } catch (error) {
      console.error(`Failed to upload part ${partNumber}:`, error);
      throw new Error(`Part ${partNumber} upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 完成分片上传
   */
  protected async completeMultipartUpload(
    multipartUploadId: string,
    parts: Array<{ partNumber: number; etag: string; size: number }>
  ): Promise<UploadResponse> {
    try {
      // 这里需要调用OssFilesService的分片上传完成方法
      // 暂时返回一个模拟的响应
      console.log(`Completing multipart upload: ${multipartUploadId} with ${parts.length} parts`);

      // 模拟完成操作
      await this.delay(100); // 模拟网络延迟

      // 使用映射关系找到对应的任务
      const uploadId = this.multipartUploadIdMap.get(multipartUploadId);
      const task = uploadId ? this.uploadTasks.get(uploadId) : undefined;

      const bucket = task?.param.bucket || { name: 'default-bucket' };
      const name = task?.param.name || multipartUploadId;
      const metadata = task?.param.metadata || {};

      const uploadResponse: UploadResponse = {
        url: `https://s3.example.com/completed/${multipartUploadId}`,
        size: parts.reduce((sum, part) => sum + part.size, 0),
        bucket: bucket,
        objectKey: task?.objectKey as string,
        uploadTime: Date.now(),
        metadata: metadata,
        etag: `"${multipartUploadId}"`
      };

      return uploadResponse;
    } catch (error) {
      console.error('Failed to complete multipart upload:', error);
      throw new Error(`Multipart upload completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}


