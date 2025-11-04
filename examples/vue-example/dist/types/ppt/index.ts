import { MediaResourceType } from '../../enums/resource';
import { TemplateStatus, TemplateType, LayoutType } from '../../enums/ppt';
import { PPTSlideType, PPTSlideBackgroundType, PPTGradientType, PPTElementLinkType, PPTAnimationTrigger, PPTAnimationType, PPTTurningMode } from '../../enums/ppt.types.enums';
import { PermissionStatus, RoleStatus } from '../../enums/rbac';
import { GenderType, Platform, DataOwner } from '../../enums/enums';
import { UserStatus } from '../../enums/user';
import { ProjectType, ScreenType } from '../../enums/code.objects';
import { FileType } from '../../enums/io';
import { FilePermissionType } from '../../enums/io.types';
import { BaseParam } from '../../types/base';
import { ImageMediaResourceList } from '../../types/resource';
import { PptPayload } from '../../types/ppt.data';
import { BaseObject, BaseResponse } from '../../types/base';
import { PPTSlide, PPTSlideBackground, PPTElementLink, PPTBaseElement, PPTAnimation, PPTSectionTag, PPTNoteReply, PPTNote } from '../../types/ppt.types';
import { User } from '../../types/user';
import { BaseProject } from '../../types/code.objects';
import { TagsContent } from '../../types/tags';
import { FileObject } from '../../types/io';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateRenderParam
 * 描述: 根据PPT模版生成PPT内容
 */
export interface PptTemplateRenderParam extends BaseParam {
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * prompt字段
     * Java类型: java.lang.String
     */
    prompt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateParam
 * 描述: PPT模板Form类，用于接收和验证PPT模板相关的表单数据
 */
export interface PptTemplateParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 模板描述信息
     */
    description?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 模板封面图URL/路径
     */
    coverImages?: ImageMediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateStatus
     * 描述: 模板状态（启用/禁用/草稿）
     */
    status?: TemplateStatus;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateTags
     * 描述: PPT tags信息(JSON格式)
     */
    tags?: PptTemplateTags;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 模板名称（唯一标识）
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateType
     * 描述: 模板类型（如商业、教育、汇报等）
     */
    type?: TemplateType;
    /**
     * authorId字段
     * Java类型: java.lang.Long
     * 描述: 模板作者ID（关联用户表）
     */
    authorId?: string|number;
    /**
     * slides字段
     * Java类型: java.util.List
     * 描述: PPT slides列表
     */
    slides?: Array<PptTemplateSlide>;
    /**
     * authorName字段
     * Java类型: java.lang.String
     * 描述: 模板作者名称
     */
    authorName?: string;
    /**
     * meta字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateMeta
     * 描述: PPT meta信息(JSON格式)
     */
    meta?: PptTemplateMeta;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateSlideParam
 * 描述: PPT模板详情配置Form
 */
export interface PptTemplateSlideParam extends BaseParam {
    /**
     * pageNumber字段
     * Java类型: java.lang.Integer
     * 描述: 页码（模板中的页面序号）
     */
    pageNumber?: number;
    /**
     * isRequired字段
     * Java类型: java.lang.Boolean
     * 描述: 是否为必填section（true-必填，生成PPT时不可删除；false-可选，可删除）
     */
    isRequired?: boolean;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * sectionContent字段
     * Java类型: java.lang.String
     * 描述: 模板section内容描述（可包含占位符说明，如'此处填写公司名称'）
     */
    sectionContent?: string;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 排序序号（用于调整section在模板中的展示顺序）
     */
    sortOrder?: number;
    /**
     * backgroundImage字段
     * Java类型: java.lang.String
     * 描述: 背景图片URL/路径（如'https://example.com/bg/title.jpg'）
     */
    backgroundImage?: string;
    /**
     * sectionTitle字段
     * Java类型: java.lang.String
     * 描述: 模板section标题（如'封面页'、'目录页'、'内容页1'等）
     */
    sectionTitle?: string;
    /**
     * layoutType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.LayoutType
     * 描述: 页面布局类型（标题页/内容页/标题+内容/分栏内容等）
     */
    layoutType?: LayoutType;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * templateId字段
     * Java类型: java.lang.Long
     * 描述: 关联的PPT模板ID
     */
    templateId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTheme
 * 描述: PPT主题样式定义
 */
export interface PptTheme extends BaseObject {
    /**
     * fontName字段
     * Java类型: java.lang.String
     * 描述: 字体名称，为空时使用默认字体
     * 示例: 微软雅黑
     */
    fontName?: string;
    /**
     * backgroundColor字段
     * Java类型: java.lang.String
     * 描述: 幻灯片背景颜色
     * 示例: #FFFFFF
     */
    backgroundColor?: string;
    /**
     * outline字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTheme$Outline
     * 描述: 元素轮廓效果设置
     */
    outline?: Outline;
    /**
     * shadow字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTheme$Shadow
     * 描述: 元素阴影效果设置
     */
    shadow?: Shadow;
    /**
     * themeColors字段
     * Java类型: java.util.List
     * 描述: 主题主要颜色方案
     */
    themeColors?: Array<string>;
    /**
     * exportThemeColors字段
     * Java类型: java.util.List
     * 描述: 导出用主题颜色集合
     */
    exportThemeColors?: Array<string>;
    /**
     * subColors字段
     * Java类型: java.util.List
     * 描述: 次要颜色方案
     */
    subColors?: Array<string>;
    /**
     * fontColor字段
     * Java类型: java.lang.String
     * 描述: 默认字体颜色
     * 示例: #000000
     */
    fontColor?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateTags
 * 描述: PPT模板标签信息
 */
export interface PptTemplateTags extends BaseObject {
    /**
     * theme字段
     * Java类型: [Ljava.lang.String;
     * 描述: PPT主题标签集合
     */
    theme?: string[];
    /**
     * style字段
     * Java类型: [Ljava.lang.String;
     * 描述: PPT样式标签集合
     */
    style?: string[];
    /**
     * scene字段
     * Java类型: [Ljava.lang.String;
     * 描述: PPT使用场景标签集合
     */
    scene?: string[];
    /**
     * design字段
     * Java类型: [Ljava.lang.String;
     * 描述: PPT设计风格标签集合
     */
    design?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateSlide
 * 描述: PPT模板幻灯片配置，存储模板中单个幻灯片的结构和属性
 */
export interface PptTemplateSlide {
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * layoutType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.LayoutType
     * 描述: 幻灯片内容布局样式
     * 示例: TITLE_CONTENT_IMAGE
     */
    layoutType?: LayoutType;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 幻灯片在模板中的显示顺序，值越小越靠前
     * 示例: 3
     */
    sortOrder?: number;
    /**
     * payload字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.data.PlusPptPayload
     * 描述: 幻灯片详细内容定义，JSON格式存储
     * 示例: {"title":"产品特点","content":"1. 智能分析\n2. 实时协作\n3. 多端同步","imageUrl":"https://example.com/slides/features.png"}
     */
    payload?: PptPayload;
    /**
     * slideConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptSlide
     * 描述: 幻灯片详细配置信息，包含结构定义和内容属性
     */
    slideConfig?: PptSlide;
    /**
     * pptTemplate字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.ppt.PlusPptTemplate
     * 描述: 所属PPT模板详细信息
     */
    pptTemplate?: PptTemplate;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 幻灯片内容说明或备注
     * 示例: 展示核心功能模块及使用场景
     */
    description?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * templateId字段
     * Java类型: java.lang.Long
     * 描述: 所属PPT模板ID
     * 示例: 10001
     */
    templateId?: string|number;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTSlideType
     * 描述: 幻灯片功能类型
     * 示例: content
     */
    type?: PPTSlideType;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 幻灯片显示标题
     * 示例: 产品功能介绍
     */
    title?: string;
    /**
     * PPTTurningMode字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTTurningMode
     * 描述: 幻灯片切换动画效果
     * 示例: fade
     */
    PPTTurningMode?: PPTTurningMode;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptSlide
 * 描述: PPT幻灯片信息
 */
export interface PptSlide extends PPTSlide {
    /**
     * payload字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.data.PlusPptPayload
     * 描述: 幻灯片内容载荷
     */
    payload?: PptPayload;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Outline
 * 描述: 轮廓效果设置
 */
export interface Outline {
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 轮廓线颜色
     * 示例: #0E2841
     */
    color?: string;
    /**
     * style字段
     * Java类型: java.lang.String
     * 描述: 轮廓线样式
     * 示例: solid
     */
    style?: string;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 轮廓线宽度(像素)
     * 示例: 2
     */
    width?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateResponse
 * 描述: PPT模板VO对象，存储PPT模板的基本信息及关联关系
 */
export interface PptTemplateResponse extends BaseResponse {
    /**
     * slides字段
     * Java类型: java.util.List
     * 描述: PPT模板详情列表
     */
    slides?: Array<PptTemplateSlideResponse>;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 模板描述
     */
    description?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateTags
     * 描述: PPT tags信息
     */
    tags?: PptTemplateTags;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 模板名称
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateType
     * 描述: 模板类型（1-商业/2-教育/3-汇报/4-其他）
     */
    type?: TemplateType;
    /**
     * authorId字段
     * Java类型: java.lang.Long
     * 描述: 模板作者ID
     */
    authorId?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * authorName字段
     * Java类型: java.lang.String
     * 描述: 模板作者名称
     */
    authorName?: string;
    /**
     * meta字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateMeta
     * 描述: PPT meta信息
     */
    meta?: PptTemplateMeta;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 模板封面图URL
     * 示例: {"images":[{"url":"https://example.com/ppt-cover1.jpg","width":800,"height":600},{"url":"https://example.com/ppt-cover2.jpg","width":1024,"height":768}]}
     */
    coverImages?: ImageMediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateStatus
     * 描述: 模板状态（1-启用/2-禁用/3-草稿）
     */
    status?: TemplateStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateMeta
 */
export interface PptTemplateMeta {
    /**
     * payloadUrl字段
     * Java类型: java.lang.String
     */
    payloadUrl?: string;
    /**
     * previewUrls字段
     * Java类型: [Ljava.lang.String;
     */
    previewUrls?: string[];
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplate
 * 描述: PPT模板实体，存储模板基本信息、结构定义及关联关系
 */
export interface PptTemplate {
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * authorName字段
     * Java类型: java.lang.String
     * 描述: 模板创建者姓名（冗余字段，优化查询性能）
     * 示例: 张三
     */
    authorName?: string;
    /**
     * meta字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateMeta
     * 描述: 模板元数据，包含宽高、主题等配置
     * 示例: {"width":1366,"height":768,"theme":"modern"}
     */
    meta?: PptTemplateMeta;
    /**
     * coverImages字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResourceList
     * 描述: 封面图片URL列表
     * 示例: ["https://example.com/img1.jpg","https://example.com/img2.jpg"]
     */
    coverImages?: ImageMediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateStatus
     * 描述: 模板使用状态
     * 示例: ACTIVE
     */
    status?: TemplateStatus;
    /**
     * slides字段
     * Java类型: java.util.List
     * 描述: 模板包含的幻灯片页面列表
     */
    slides?: Array<PptTemplateSlide>;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * author字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.user.PlusUser
     * 描述: 模板作者详细信息（关联用户表）
     */
    author?: User;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 模板功能、适用场景等详细说明
     * 示例: 适用于科技产品发布会的专业PPT模板，包含封面页、目录页、产品介绍页等12个标准页面
     */
    description?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTemplateTags
     * 描述: 模板标签集合，JSON格式存储
     * 示例: {"tags":["科技","产品","发布会"],"style":"简约"}
     */
    tags?: PptTemplateTags;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 模板名称，系统内唯一
     * 示例: 产品发布会PPT模板
     */
    title?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.TemplateType
     * 描述: 模板分类类型
     * 示例: BUSINESS
     */
    type?: TemplateType;
    /**
     * authorId字段
     * Java类型: java.lang.Long
     * 描述: 模板创建者ID（关联用户表主键）
     * 示例: 10001
     */
    authorId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Shadow
 * 描述: 阴影效果设置
 */
export interface Shadow {
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 阴影颜色
     * 示例: #808080
     */
    color?: string;
    /**
     * v字段
     * Java类型: java.lang.Integer
     * 描述: 阴影垂直偏移量
     * 示例: 3
     */
    v?: number;
    /**
     * blur字段
     * Java类型: java.lang.Integer
     * 描述: 阴影模糊半径
     * 示例: 2
     */
    blur?: number;
    /**
     * h字段
     * Java类型: java.lang.Integer
     * 描述: 阴影水平偏移量
     * 示例: 3
     */
    h?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptContext
 */
export interface PptContext extends BaseObject {
    /**
     * templateUrl字段
     * Java类型: java.lang.String
     * 描述: PPT模板文件URL
     * 示例: https://example.com/templates/annual_report.pptx
     */
    templateUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptTemplateSlideResponse
 * 描述: PPT模板详情配置VO（存储模板中各页面/section的具体配置）
 */
export interface PptTemplateSlideResponse extends BaseResponse {
    /**
     * templateId字段
     * Java类型: java.lang.Long
     * 描述: 关联的PPT模板ID
     */
    templateId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * layoutType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.ppt.LayoutType
     * 描述: 页面布局类型（1-标题页/2-内容页/3-标题+内容/4-分栏内容）
     */
    layoutType?: LayoutType;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * sectionTitle字段
     * Java类型: java.lang.String
     * 描述: 模板section标题（如'封面页'、'目录页'、'内容页1'等）
     */
    sectionTitle?: string;
    /**
     * backgroundImage字段
     * Java类型: java.lang.String
     * 描述: 背景图片URL
     */
    backgroundImage?: string;
    /**
     * sectionContent字段
     * Java类型: java.lang.String
     * 描述: 模板section内容描述（可包含占位符说明）
     */
    sectionContent?: string;
    /**
     * sortOrder字段
     * Java类型: java.lang.Integer
     * 描述: 排序序号（用于调整section在模板中的展示顺序）
     */
    sortOrder?: number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * isRequired字段
     * Java类型: java.lang.Boolean
     * 描述: 是否必填section（true-必填/false-可选）
     */
    isRequired?: boolean;
    /**
     * pageNumber字段
     * Java类型: java.lang.Integer
     * 描述: 页码（模板中的页面序号）
     */
    pageNumber?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PptProject
 * 描述: PPT项目信息
 */
export interface PptProject extends BaseProject {
    /**
     * height字段
     * Java类型: java.lang.Double
     * 描述: PPT高度(像素)
     * 示例: 768.0
     */
    height?: string|number;
    /**
     * exportFormat字段
     * Java类型: java.lang.String
     * 描述: 导出格式
     * 示例: pptx
     */
    exportFormat?: string;
    /**
     * width字段
     * Java类型: java.lang.Double
     * 描述: PPT宽度(像素)
     * 示例: 1366.0
     */
    width?: string|number;
    /**
     * context字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptContext
     * 描述: PPT上下文信息
     */
    context?: PptContext;
    /**
     * theme字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.PlusPptTheme
     * 描述: PPT主题
     * 示例: 现代简约风格
     */
    theme?: PptTheme;
    /**
     * footerText字段
     * Java类型: java.lang.String
     * 描述: 页脚文本
     * 示例: © 2023 科技有限公司 版权所有
     */
    footerText?: string;
    /**
     * subtitle字段
     * Java类型: java.lang.String
     * 描述: PPT副标题
     * 示例: 2023年度新产品发布
     */
    subtitle?: string;
    /**
     * includePageNumbers字段
     * Java类型: java.lang.Boolean
     * 描述: 是否包含页码
     * 示例: true
     */
    includePageNumbers?: boolean;
    /**
     * includeFooter字段
     * Java类型: java.lang.Boolean
     * 描述: 是否包含页脚
     * 示例: true
     */
    includeFooter?: boolean;
    /**
     * slides字段
     * Java类型: java.util.Collection
     * 描述: 幻灯片数组
     */
    slides?: Array<PptSlide>;
}
