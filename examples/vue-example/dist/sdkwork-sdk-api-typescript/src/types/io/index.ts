import { DiskMemberPermission, FileType } from '../../enums/io';
import { FilePermissionType } from '../../enums/io.types';
import { DataOwner } from '../../enums/enums';
import { BaseObject } from '../../types/base';
import { TagsContent } from '../../types/tags';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DiskPermission
 */
export interface DiskPermission extends BaseObject {
    /**
     * permissions字段
     * Java类型: java.util.Set
     */
    permissions?: Array<DiskMemberPermission>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FileObject
 * 描述: 文件对象DTO
 */
export interface FileObject extends BaseObject {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 文件ID
     * 示例: 12345678
     */
    id?: string|number;
    /**
     * readonly字段
     * Java类型: java.lang.Boolean
     * 描述: 是否只读
     */
    readonly?: boolean;
    /**
     * children字段
     * Java类型: java.util.List
     * 描述: 子文件列表
     */
    children?: Array<FileObject>;
    /**
     * relativePath字段
     * Java类型: java.lang.String
     * 描述: 相对路径
     * 示例: report.txt
     */
    relativePath?: string;
    /**
     * path字段
     * Java类型: java.lang.String
     * 描述: 文件路径
     * 示例: /projects/report.txt
     */
    path?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.io.PlusFileType
     * 描述: 文件类型
     */
    type?: FileType;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 文件所有者ID
     */
    ownerId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 文件UUID
     * 示例: 12345678-1234-1234-1234-123456789012
     */
    uuid?: string;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 文件内容
     */
    content?: string;
    /**
     * projectUuid字段
     * Java类型: java.lang.String
     * 描述: 项目UUID
     */
    projectUuid?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 文件描述
     * 示例: 项目报告文件
     */
    description?: string;
    /**
     * extension字段
     * Java类型: java.lang.String
     * 描述: 文件扩展名
     * 示例: txt
     */
    extension?: string;
    /**
     * lastModifiedTime字段
     * Java类型: java.time.Instant
     * 描述: 最后修改时间
     */
    lastModifiedTime?: string;
    /**
     * projectId字段
     * Java类型: java.lang.Long
     * 描述: 项目ID
     */
    projectId?: string|number;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: 提示词内容
     */
    prompt?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 文件名
     * 示例: report.txt
     */
    name?: string;
    /**
     * diskId字段
     * Java类型: java.lang.Long
     * 描述: 网盘ID
     */
    diskId?: string|number;
    /**
     * size字段
     * Java类型: java.lang.Long
     * 描述: 文件大小（字节）
     * 示例: 1024
     */
    size?: string|number;
    /**
     * versionId字段
     * Java类型: java.lang.String
     * 描述: 文件版本
     * 示例: v1.0
     */
    versionId?: string;
    /**
     * referenceFileId字段
     * Java类型: java.lang.Long
     * 描述: 引用文件ID
     */
    referenceFileId?: string|number;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 文件标签
     */
    tags?: TagsContent;
    /**
     * permission字段
     * Java类型: java.util.Set
     * 描述: 文件权限
     */
    permission?: Array<FilePermissionType>;
    /**
     * author字段
     * Java类型: java.lang.String
     * 描述: 文件作者
     */
    author?: string;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 文件所有者类型
     */
    owner?: DataOwner;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FilePermission
 */
export interface FilePermission extends BaseObject {
    /**
     * permissions字段
     * Java类型: java.util.List
     */
    permissions?: Array<FilePermissionType>;
}
