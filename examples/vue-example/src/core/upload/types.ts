import { BucketObject,OssProvider } from "sdkwork-sdk-api-typescript";

 

/**
 * 上传操作配置参数
 */
export interface UploadOperationConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
  timeout?: number;
  retryCount?: number;
  chunkSize?: number;
  progressCallback?: (progress: UploadProgress) => void;
}

/**
 * 上传请求参数
 */
export interface UploadRequestParam {
  file: File | Blob;
  bucket?: BucketObject;
  name?: string;
  scene?: string;
  metadata?: Record<string, string>;
  contentType?: string;
  acl?: 'private' | 'public-read' | 'public-read-write';
  config?: UploadOperationConfig;
  provider?: OssProvider;
}

/**
 * 上传进度信息
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
  elapsedTime: number;
}

/**
 * 上传响应结果
 */
export interface UploadResponse {
  url: string;
  size: number;
  bucket: BucketObject;
  objectKey: string;
  etag?: string;
  versionId?: string;
  uploadTime: number;
  metadata?: Record<string, string>;
}

/**
 * 上传错误信息
 */
export interface UploadError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

/**
 * 分片上传配置
 */
export interface MultipartUploadConfig {
  partSize: number;
  concurrentUploads: number;
  abortSignal?: AbortSignal;
}

/**
 * 分片上传结果
 */
export interface MultipartUploadResult {
  uploadId: string;
  parts: Array<{
    partNumber: number;
    etag: string;
    size: number;
  }>;
  completed: boolean;
}

/**
 * 上传状态枚举
 */
export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * 上传任务信息
 */
export interface UploadTask {
  id: string;
  param: UploadRequestParam;
  fileName: string;
  fileSize: number;
  objectKey: string;
  bucket: BucketObject;
  status: UploadStatus;
  progress: UploadProgress;
  startTime?: number;
  endTime?: number;
  error?: UploadError;
  uploadResponse?: UploadResponse;
}

/**
 * 多文件上传配置
 */
export interface MultipleUploadConfig {
  concurrentUploads?: number;
  onProgress?: (progress: MultipleUploadProgress) => void;
  onComplete?: (results: MultipleUploadResult[]) => void;
  onError?: (errors: MultipleUploadError[]) => void;
  cancellationToken?: CancellationToken;
}

/**
 * 多文件上传进度
 */
export interface MultipleUploadProgress {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalBytes: number;
  uploadedBytes: number;
  overallPercentage: number;
  individualProgress: Map<string, UploadProgress>;
}

/**
 * 多文件上传结果
 */
export interface MultipleUploadResult {
  taskId: string;
  fileName: string;
  success: boolean;
  response?: UploadResponse;
  error?: UploadError;
}

/**
 * 多文件上传错误
 */
export interface MultipleUploadError {
  taskId: string;
  fileName: string;
  error: UploadError;
}

/**
 * 取消令牌
 */
export interface CancellationToken {
  isCancelled: boolean;
  cancel: () => void;
}

/**
 * 精简的上传参数（移除了重复的file字段）
 */
export interface SimplifiedUploadParam extends Omit<UploadRequestParam, 'file'> {
  // 移除了file字段，避免重复
}

/**
 * 多文件上传参数
 */
export interface MultipleFilesUploadParam extends Omit<UploadRequestParam, 'file'> {
  files: File[];
}