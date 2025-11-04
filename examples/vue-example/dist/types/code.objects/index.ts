import { DataOwner } from '../../enums/enums';
import { ProjectType, ScreenType } from '../../enums/code.objects';
import { FileType } from '../../enums/io';
import { FilePermissionType } from '../../enums/io.types';
import { BaseObject } from '../../types/base';
import { TagsContent } from '../../types/tags';
import { FileObject } from '../../types/io';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: BaseProject
 */
export interface BaseProject extends BaseObject {
    /**
     * lastModifiedTime字段
     * Java类型: java.time.Instant
     * 描述: 最后修改时间
     * 示例: 2023-11-05T14:20:00
     */
    lastModifiedTime?: string;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusDataOwner
     * 描述: 项目所有者类型
     * 示例: USER
     */
    owner?: DataOwner;
    /**
     * author字段
     * Java类型: java.lang.String
     * 描述: 作者
     * 示例: 张小明
     */
    author?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 项目描述
     * 示例: 这是一份用于产品发布会的演示文稿，包含产品介绍、功能演示和市场分析等内容。
     */
    description?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签列表
     * 示例: {"tags": ["产品", "发布会", "2023"]}
     */
    tags?: TagsContent;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.PlusProjectType
     * 描述: Project Type
     * 示例: PPT
     */
    type?: ProjectType;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 项目标题
     * 示例: 产品发布会演示文稿
     */
    title?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 项目所有者ID
     * 示例: 12345678
     */
    ownerId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Project UUID
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 版本号
     * 示例: 1.0.1
     */
    version?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     * 示例: 2023-11-01T09:30:00
     */
    createdAt?: string;
    /**
     * diskId字段
     * Java类型: java.lang.Long
     * 描述: 网盘ID
     * 示例: 12345678
     */
    diskId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: Project ID
     */
    id?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Sdk项目名称
     * 示例: 我的测试Sdk
     */
    name?: string;
    /**
     * screenType字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ScreenType
     * 描述: 屏幕类型
     * 示例: DESKTOP
     */
    screenType?: ScreenType;
    /**
     * files字段
     * Java类型: java.util.Collection
     * 描述: Sdk文件列表
     */
    files?: Array<FileObject>;
    /**
     * prompt字段
     * Java类型: java.lang.String
     * 描述: AI输入的需求提示词
     * 示例: 创建一个现代化的企业官网，包含产品展示和联系表单
     */
    prompt?: string;
}
