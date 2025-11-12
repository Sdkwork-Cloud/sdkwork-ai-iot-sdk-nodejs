import { DataOwner } from '../../enums/enums';
import { RequestMethod } from '../../enums/org.springframework.web.bind.annotation';
import { OssProvider, ChannelProviderEnum } from '../../enums/core.type';
import { DiskMemberPermission, FileType } from '../../enums/io';
import { FileCategory, FileStorageClass, FileStatus } from '../../enums/files';
import { ContentType, ContentFormat } from '../../enums/content';
import { MediaResourceType } from '../../enums/resource';
import { FilePermissionType } from '../../enums/io.types';
import { BaseParam } from '../../types/base';
import { DiskPermission, FilePermission } from '../../types/io';
import { FileMediaResource } from '../../types/resource';
import { TagsContent } from '../../types/tags';
import { FileContentObject } from '../../types/file';
import { BaseResponse } from '../../types/base';
import { TreeParentMetadata } from '../../types/tree';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DiskParam
 * 描述: 文件存储盘Form
 */
export interface DiskParam extends BaseParam {
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 存储盘所有者类型
     * 示例: USER
     */
    owner?: DataOwner;
    /**
     * diskSize字段
     * Java类型: java.lang.Long
     * 描述: 总容量（字节）
     * 示例: 10737418240
     */
    diskSize?: string|number;
    /**
     * usedSize字段
     * Java类型: java.lang.Long
     * 描述: 已使用容量（字节）
     * 示例: 2147483648
     */
    usedSize?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 存储盘名称
     * 示例: 个人文档存储盘
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 存储盘描述
     * 示例: 用户个人文档专用存储盘，包含PDF、Word等文件
     */
    description?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 所有者ID
     * 示例: 10001
     */
    ownerId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GetTempSessionParam
 * 描述: Get Temporary Session Form
 */
export interface GetTempSessionParam extends BaseParam {
    /**
     * scene字段
     * Java类型: java.lang.String
     * 描述: Scene identifier
     */
    scene?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: File name
     */
    name?: string;
    /**
     * expirationSeconds字段
     * Java类型: long
     * 描述: Expiration time in seconds, default is 3600 seconds
     */
    expirationSeconds?: string|number;
    /**
     * method字段
     * Java类型: org.springframework.web.bind.annotation.RequestMethod
     * 描述: HTTP request method
     */
    method?: RequestMethod;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OssProvider
     * 描述: OSS provider type
     */
    provider?: OssProvider;
    /**
     * bucket字段
     * Java类型: com.sdkwork.spring.ai.plus.files.BucketObject
     * 描述: Bucket object
     */
    bucket?: BucketObject;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DiskMemberParam
 * 描述: 磁盘成员Form，用于提交磁盘成员的创建/修改请求
 */
export interface DiskMemberParam extends BaseParam {
    /**
     * diskId字段
     * Java类型: java.lang.Long
     * 描述: 关联的磁盘ID
     * 示例: 1
     */
    diskId?: string|number;
    /**
     * permission字段
     * Java类型: com.sdkwork.spring.ai.plus.io.DiskPermission
     * 描述: 成员权限集合（位运算表示）
     */
    permission?: DiskPermission;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 成员备注信息
     * 示例: 项目核心成员
     */
    remark?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 1001
     */
    userId?: string|number;
    /**
     * isOwner字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为磁盘所有者
     * 示例: false
     */
    isOwner?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UploadParam
 */
export interface UploadParam extends BaseParam {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OssBucketParam
 * 描述: OSS存储桶Form
 */
export interface OssBucketParam extends BaseParam {
    /**
     * creationDate字段
     * Java类型: java.time.Instant
     * 描述: 存储桶创建时间
     */
    creationDate?: string;
    /**
     * encryptionType字段
     * Java类型: java.lang.String
     * 描述: 加密类型
     */
    encryptionType?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 存储桶描述信息
     */
    description?: string;
    /**
     * acl字段
     * Java类型: java.lang.String
     * 描述: 访问控制列表
     */
    acl?: string;
    /**
     * region字段
     * Java类型: java.lang.String
     * 描述: 存储桶所在区域
     */
    region?: string;
    /**
     * arn字段
     * Java类型: java.lang.String
     * 描述: 存储桶ARN
     */
    arn?: string;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: 存储桶状态
     */
    status?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 存储桶名称
     */
    name?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * versioningEnabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用版本控制
     */
    versioningEnabled?: boolean;
    /**
     * channelConfigId字段
     * Java类型: java.lang.Long
     * 描述: 渠道配置ID
     */
    channelConfigId?: string|number;
    /**
     * endpoint字段
     * Java类型: java.lang.String
     * 描述: 存储桶访问域名
     */
    endpoint?: string;
    /**
     * storageClass字段
     * Java类型: java.lang.String
     * 描述: 存储类型
     */
    storageClass?: string;
    /**
     * encryptionEnabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否加密
     */
    encryptionEnabled?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileParam
 * 描述: 文件Form类，用于文件元数据信息的接收和验证
 */
export interface FileParam extends BaseParam {
    /**
     * size字段
     * Java类型: java.lang.Long
     * 描述: 文件大小（字节）
     * 示例: 1048576
     */
    size?: string|number;
    /**
     * fileCategory字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileCategory
     * 描述: 文件分类
     * 示例: DOCUMENT
     */
    fileCategory?: FileCategory;
    /**
     * objectKey字段
     * Java类型: java.lang.String
     * 描述: 存储键（对象存储中的唯一标识符）
     * 示例: tenant123/documents/reports/report-2023.pdf
     */
    objectKey?: string;
    /**
     * path字段
     * Java类型: java.lang.String
     * 描述: 文件路径
     * 示例: documents/reports/
     */
    path?: string;
    /**
     * storageClass字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileStorageClass
     * 描述: 文件的存储类别
     * 示例: STANDARD
     */
    storageClass?: FileStorageClass;
    /**
     * versionId字段
     * Java类型: java.lang.String
     * 描述: 文件的版本ID
     * 示例: v1.0.0
     */
    versionId?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 文件内容类型
     * 示例: APPLICATION_PDF
     */
    contentType?: ContentType;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileStatus
     * 描述: 文件状态
     * 示例: NORMAL
     */
    status?: FileStatus;
    /**
     * fileType字段
     * Java类型: com.sdkwork.spring.ai.plus.io.PlusFileType
     * 描述: 文件类型
     * 示例: FILE
     */
    fileType?: FileType;
    /**
     * isPublic字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为公开访问
     * 示例: false
     */
    isPublic?: boolean;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 文件名称
     * 示例: report-2023.pdf
     */
    name?: string;
    /**
     * eTag字段
     * Java类型: java.lang.String
     * 描述: 文件的ETag
     * 示例: d41d8cd98f00b204e9800998ecf8427e
     */
    eTag?: string;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.FileMediaResource
     * 描述: File resource
     * 示例: {"url":"https://storage.example.com/bucket/projects/123456/report-2023.pdf"}
     */
    resource?: FileMediaResource;
    /**
     * lastAccessTime字段
     * Java类型: java.time.Instant
     * 描述: 文件最后访问时间
     * 示例: 2023-01-20T15:45:30Z
     */
    lastAccessTime?: string;
    /**
     * extension字段
     * Java类型: java.lang.String
     * 描述: 文件扩展名
     * 示例: pdf
     */
    extension?: string;
    /**
     * uploadTime字段
     * Java类型: java.time.Instant
     * 描述: 文件上传时间
     * 示例: 2023-01-15T10:30:00Z
     */
    uploadTime?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 文件标签
     * 示例: ["category:financial", "year:2023"]
     */
    tags?: TagsContent;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父节点ID
     */
    parentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 文件描述
     * 示例: 2023年财务报告
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileContentParam
 * 描述: File content Form object
 */
export interface FileContentParam extends BaseParam {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation time
     */
    createdAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Primary key ID
     */
    id?: string|number;
    /**
     * fileId字段
     * Java类型: java.lang.Long
     * 描述: Associated file ID (foreign key to plus_file.id)
     */
    fileId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update time
     */
    updatedAt?: string;
    /**
     * fileUuid字段
     * Java类型: java.lang.String
     * 描述: Associated file UUID (foreign key to plus_file.uuid)
     */
    fileUuid?: string;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.file.FileContentObject
     * 描述: File text content
     */
    content?: FileContentObject;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier UUID
     */
    uuid?: string;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: Prompt text
     */
    prompt?: string;
    /**
     * encoding字段
     * Java类型: java.lang.String
     * 描述: File encoding format (e.g., UTF-8, GBK, ISO-8859-1)
     */
    encoding?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: GetPresignedUrlParam
 * 描述: Get Presigned URL Form
 */
export interface GetPresignedUrlParam extends BaseParam {
    /**
     * bucket字段
     * Java类型: com.sdkwork.spring.ai.plus.files.BucketObject
     * 描述: Bucket object
     */
    bucket?: BucketObject;
    /**
     * expirationSeconds字段
     * Java类型: long
     * 描述: Expiration time in seconds, default is 3600 seconds
     */
    expirationSeconds?: string|number;
    /**
     * method字段
     * Java类型: org.springframework.web.bind.annotation.RequestMethod
     * 描述: HTTP request method
     */
    method?: RequestMethod;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OssProvider
     * 描述: OSS provider type
     */
    provider?: OssProvider;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: File name
     */
    name?: string;
    /**
     * scene字段
     * Java类型: java.lang.String
     * 描述: Scene identifier
     */
    scene?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FilePartParam
 * 描述: File part Form for chunked uploads
 */
export interface FilePartParam extends BaseParam {
    /**
     * totalSize字段
     * Java类型: java.lang.Long
     * 描述: Total file size in bytes
     */
    totalSize?: string|number;
    /**
     * chunkSize字段
     * Java类型: java.lang.Long
     * 描述: Chunk size in bytes
     */
    chunkSize?: string|number;
    /**
     * checksum字段
     * Java类型: java.lang.String
     * 描述: Chunk content checksum
     */
    checksum?: string;
    /**
     * storagePath字段
     * Java类型: java.lang.String
     * 描述: Storage path of this chunk
     */
    storagePath?: string;
    /**
     * chunkIndex字段
     * Java类型: java.lang.Integer
     * 描述: Chunk index (0-based)
     */
    chunkIndex?: number;
    /**
     * fileId字段
     * Java类型: java.lang.Long
     * 描述: Associated file ID
     */
    fileId?: string|number;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: Upload status: 1-uploading, 2-uploaded, 3-failed
     */
    status?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: BucketObject
 * 描述: 存储桶对象，包含名称和区域信息
 */
export interface BucketObject {
    /**
     * region字段
     * Java类型: java.lang.String
     * 描述: 存储桶所在区域
     * 示例: us-east-1
     */
    region?: string;
    /**
     * creationDate字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    creationDate?: string;
    /**
     * arn字段
     * Java类型: java.lang.String
     * 描述: ARN
     */
    arn?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 存储桶名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileContentResponse
 * 描述: 文件内容VO（与PlusFile一对一对应，存储文件的文本内容和编码信息）
 */
export interface FileContentResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * fileId字段
     * Java类型: java.lang.Long
     * 描述: 关联文件ID(外键关联plus_file.id)
     */
    fileId?: string|number;
    /**
     * fileUuid字段
     * Java类型: java.lang.String
     * 描述: 关联文件UUID(外键关联plus_file.uuid)
     */
    fileUuid?: string;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.file.FileContentObject
     * 描述: 文件文本内容
     */
    content?: FileContentObject;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: 提示词
     */
    prompt?: string;
    /**
     * encoding字段
     * Java类型: java.lang.String
     * 描述: 文件编码格式(如UTF-8、GBK、ISO-8859-1等)
     */
    encoding?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileItemResponse
 * 描述: 文件视图对象
 */
export interface FileItemResponse {
    /**
     * object字段
     * Java类型: java.lang.String
     * 描述: 对象类型
     * 示例: file
     */
    object?: string;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: 文件状态
     * 示例: processed
     */
    status?: string;
    /**
     * expiresAt字段
     * Java类型: java.lang.Long
     * 描述: 过期时间（Unix时间戳，秒）
     * 示例: 1677610602
     */
    expiresAt?: string|number;
    /**
     * statusDetails字段
     * Java类型: java.lang.String
     * 描述: 状态详情
     */
    statusDetails?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 文件ID
     * 示例: file-abc123
     */
    id?: string;
    /**
     * purpose字段
     * Java类型: java.lang.String
     * 描述: 文件用途
     * 示例: fine-tune
     */
    purpose?: string;
    /**
     * bytes字段
     * Java类型: java.lang.Long
     * 描述: 文件大小（字节）
     * 示例: 120000
     */
    bytes?: string|number;
    /**
     * createdAt字段
     * Java类型: java.lang.Long
     * 描述: 创建时间（Unix时间戳，秒）
     * 示例: 1677610602
     */
    createdAt?: string|number;
    /**
     * filename字段
     * Java类型: java.lang.String
     * 描述: 文件名
     * 示例: mydata.jsonl
     */
    filename?: string;
    /**
     * deleted字段
     * Java类型: java.lang.Boolean
     * 描述: 是否已删除
     * 示例: false
     */
    deleted?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DiskMemberResponse
 * 描述: 磁盘成员VO，封装磁盘成员的核心信息
 */
export interface DiskMemberResponse extends BaseResponse {
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 1001
     */
    userId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * diskId字段
     * Java类型: java.lang.Long
     * 描述: 关联磁盘ID
     * 示例: 1
     */
    diskId?: string|number;
    /**
     * permission字段
     * Java类型: com.sdkwork.spring.ai.plus.io.DiskPermission
     * 描述: 成员权限集合（位运算表示）
     */
    permission?: DiskPermission;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 成员备注信息
     * 示例: 项目核心成员
     */
    remark?: string;
    /**
     * isOwner字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为磁盘所有者
     * 示例: false
     */
    isOwner?: boolean;
    /**
     * v字段
     * Java类型: java.lang.Long
     * 描述: 版本号（乐观锁控制）
     */
    v?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OssBucketResponse
 * 描述: OSS存储桶值对象
 */
export interface OssBucketResponse extends BaseResponse {
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * creationDate字段
     * Java类型: java.time.Instant
     * 描述: 存储桶创建时间
     */
    creationDate?: string;
    /**
     * acl字段
     * Java类型: java.lang.String
     * 描述: 访问控制列表
     */
    acl?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 存储桶描述信息
     */
    description?: string;
    /**
     * encryptionType字段
     * Java类型: java.lang.String
     * 描述: 加密类型
     */
    encryptionType?: string;
    /**
     * v字段
     * Java类型: java.lang.Long
     * 描述: 版本号
     */
    v?: string|number;
    /**
     * versioningEnabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否启用版本控制
     */
    versioningEnabled?: boolean;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.ChannelProviderEnum
     * 描述: 模型提供商(如"OpenAI","Anthropic","Hugging Face")
     */
    provider?: ChannelProviderEnum;
    /**
     * endpoint字段
     * Java类型: java.lang.String
     * 描述: 存储桶访问域名
     */
    endpoint?: string;
    /**
     * storageClass字段
     * Java类型: java.lang.String
     * 描述: 存储类型
     */
    storageClass?: string;
    /**
     * encryptionEnabled字段
     * Java类型: java.lang.Boolean
     * 描述: 是否加密
     */
    encryptionEnabled?: boolean;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * channelConfigId字段
     * Java类型: java.lang.Long
     * 描述: 渠道配置ID
     */
    channelConfigId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: 存储桶状态
     */
    status?: string;
    /**
     * region字段
     * Java类型: java.lang.String
     * 描述: 存储桶所在区域
     */
    region?: string;
    /**
     * arn字段
     * Java类型: java.lang.String
     * 描述: 存储桶ARN
     */
    arn?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 存储桶ID
     */
    id?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 存储桶名称
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DiskResponse
 * 描述: 文件存储盘信息VO
 */
export interface DiskResponse extends BaseResponse {
    /**
     * usedSize字段
     * Java类型: java.lang.Long
     * 描述: 已使用容量（字节）
     * 示例: 2147483648
     */
    usedSize?: string|number;
    /**
     * diskSize字段
     * Java类型: java.lang.Long
     * 描述: 总容量（字节）
     * 示例: 10737418240
     */
    diskSize?: string|number;
    /**
     * usageRate字段
     * Java类型: java.lang.Double
     * 描述: 存储盘使用率（百分比）
     * 示例: 20
     */
    usageRate?: string|number;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 存储盘所有者类型
     * 示例: USER
     */
    owner?: DataOwner;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     * 示例: 2023-11-15T08:30:45
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     * 示例: 2023-11-15T14:20:30
     */
    updatedAt?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 所有者ID
     * 示例: 10001
     */
    ownerId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     * 示例: f47ac10b-58cc-4372-a567-0e02b2c3d479
     */
    uuid?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     * 示例: 10001
     */
    id?: string|number;
    /**
     * remainingSize字段
     * Java类型: java.lang.Long
     * 描述: 剩余可用容量（字节）
     * 示例: 8589934592
     */
    remainingSize?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 存储盘名称
     * 示例: 个人文档存储盘
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 存储盘描述
     * 示例: 用户个人文档专用存储盘，包含PDF、Word等文件
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FilePartResponse
 * 描述: 文件分片VO对象
 */
export interface FilePartResponse extends BaseResponse {
    /**
     * totalSize字段
     * Java类型: java.lang.Long
     * 描述: 文件总大小(字节)
     */
    totalSize?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * chunkSize字段
     * Java类型: java.lang.Long
     * 描述: 分片大小(字节)
     */
    chunkSize?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * storagePath字段
     * Java类型: java.lang.String
     * 描述: 分片存储路径
     */
    storagePath?: string;
    /**
     * checksum字段
     * Java类型: java.lang.String
     * 描述: 分片内容校验和
     */
    checksum?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * fileId字段
     * Java类型: java.lang.Long
     * 描述: 关联的文件ID
     */
    fileId?: string|number;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 上传状态: 1-上传中, 2-上传完成, 3-上传失败
     */
    status?: number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * chunkIndex字段
     * Java类型: java.lang.Integer
     * 描述: 分片索引(从0开始)
     */
    chunkIndex?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileListResponse
 * 描述: 文件列表视图对象
 */
export interface FileListResponse {
    /**
     * object字段
     * Java类型: java.lang.String
     * 描述: 对象类型
     * 示例: list
     */
    object?: string;
    /**
     * data字段
     * Java类型: java.util.List
     * 描述: 文件列表
     */
    data?: Array<FileItemResponse>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileResponse
 * 描述: 文件VO类，用于存储文件的元数据信息
 */
export interface FileResponse {
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 文件内容类型
     * 示例: APPLICATION_PDF
     */
    contentType?: ContentType;
    /**
     * isPublic字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为公开访问
     * 示例: false
     */
    isPublic?: boolean;
    /**
     * parentUuid字段
     * Java类型: java.lang.String
     */
    parentUuid?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 文件ID
     */
    id?: string|number;
    /**
     * eTag字段
     * Java类型: java.lang.String
     * 描述: 文件的ETag
     * 示例: d41d8cd98f00b204e9800998ecf8427e
     */
    eTag?: string;
    /**
     * objectKey字段
     * Java类型: java.lang.String
     * 描述: 存储键
     * 示例: tenant123/documents/reports/report-2023.pdf
     */
    objectKey?: string;
    /**
     * path字段
     * Java类型: java.lang.String
     * 描述: 文件路径
     * 示例: documents/reports/
     */
    path?: string;
    /**
     * parentMetadata字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeParentMetadata
     */
    parentMetadata?: TreeParentMetadata;
    /**
     * storageClass字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileStorageClass
     * 描述: 文件的存储类别
     * 示例: STANDARD
     */
    storageClass?: FileStorageClass;
    /**
     * pinnedAt字段
     * Java类型: java.time.Instant
     * 描述: 置顶时间
     */
    pinnedAt?: string;
    /**
     * content字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.file.FileContentObject
     * 描述: 文件文件内容
     * 示例: {"content": "file content"}
     */
    content?: FileContentObject;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 文件描述
     * 示例: 2023年财务报告
     */
    description?: string;
    /**
     * fullPath字段
     * Java类型: java.lang.String
     * 描述: 文件完整路径
     * 示例: documents/reports/report-2023.pdf
     */
    fullPath?: string;
    /**
     * extension字段
     * Java类型: java.lang.String
     * 描述: 文件扩展名
     * 示例: pdf
     */
    extension?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileStatus
     * 描述: 文件状态
     * 示例: NORMAL
     */
    status?: FileStatus;
    /**
     * fileType字段
     * Java类型: com.sdkwork.spring.ai.plus.io.PlusFileType
     * 描述: 文件类型
     * 示例: FILE
     */
    fileType?: FileType;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 文件名称
     * 示例: report-2023.pdf
     */
    name?: string;
    /**
     * size字段
     * Java类型: java.lang.Long
     * 描述: 文件大小（字节）
     * 示例: 1048576
     */
    size?: string|number;
    /**
     * fileCategory字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.files.PlusFileCategory
     * 描述: 文件分类
     * 示例: DOCUMENT
     */
    fileCategory?: FileCategory;
    /**
     * versionId字段
     * Java类型: java.lang.String
     * 描述: 文件的版本ID
     * 示例: v1.0.0
     */
    versionId?: string;
    /**
     * uploadTime字段
     * Java类型: java.time.Instant
     * 描述: 文件上传时间
     * 示例: 2023-01-15T10:30:00Z
     */
    uploadTime?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 文件标签
     * 示例: ["financial","year:2023"]
     */
    tags?: TagsContent;
    /**
     * parentId字段
     * Java类型: java.lang.Long
     * 描述: 父节点ID
     */
    parentId?: string|number;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 文件的访问URL
     * 示例: https://storage.example.com/bucket/documents/report-2023.pdf
     */
    url?: string;
    /**
     * permission字段
     * Java类型: com.sdkwork.spring.ai.plus.io.FilePermission
     * 描述: File permissions
     * 示例: 0644
     */
    permission?: FilePermission;
    /**
     * resource字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.FileMediaResource
     * 描述: File resource
     * 示例: {"url":"https://storage.example.com/bucket/projects/123456/report-2023.pdf"}
     */
    resource?: FileMediaResource;
    /**
     * lastAccessTime字段
     * Java类型: java.time.Instant
     * 描述: 文件最后访问时间
     * 示例: 2023-01-20T15:45:30Z
     */
    lastAccessTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TempSessionResponse
 * 描述: 文件VO类，用于存储文件的元数据信息
 */
export interface TempSessionResponse {
}
