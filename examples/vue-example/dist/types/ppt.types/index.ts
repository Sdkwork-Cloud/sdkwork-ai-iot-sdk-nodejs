import { PPTElementLinkType, PPTSlideType, PPTTurningMode, PPTSlideBackgroundType, PPTGradientType, PPTAnimationTrigger, PPTAnimationType } from '../../enums/ppt.types.enums';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTSectionTag
 * 描述: 章节标签
 */
export interface PPTSectionTag extends BaseObject {
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 标签ID
     */
    id?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 标签标题
     */
    title?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTGradientColor
 * 描述: 渐变颜色
 */
export interface PPTGradientColor extends BaseObject {
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 颜色
     */
    color?: string;
    /**
     * pos字段
     * Java类型: java.lang.Integer
     * 描述: 百分比位置
     */
    pos?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTElementLink
 * 描述: 元素超链接
 */
export interface PPTElementLink extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTElementLinkType
     * 描述: 链接类型（网页、幻灯片页面）
     */
    type?: PPTElementLinkType;
    /**
     * target字段
     * Java类型: java.lang.String
     * 描述: 目标地址（网页链接、幻灯片页面ID）
     */
    target?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTSlideBackgroundImage
 * 描述: 幻灯片背景图片
 */
export interface PPTSlideBackgroundImage extends BaseObject {
    /**
     * src字段
     * Java类型: java.lang.String
     * 描述: 图片地址
     */
    src?: string;
    /**
     * size字段
     * Java类型: java.lang.String
     * 描述: 图片大小
     */
    size?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTBaseElement
 * 描述: 元素通用属性
 */
export interface PPTBaseElement extends BaseObject {
    /**
     * rotate字段
     * Java类型: java.lang.Integer
     * 描述: 旋转角度
     */
    rotate?: number;
    /**
     * groupId字段
     * Java类型: java.lang.String
     * 描述: 组合ID（拥有相同组合ID的元素即为同一组合元素成员）
     */
    groupId?: string;
    /**
     * left字段
     * Java类型: java.lang.Integer
     * 描述: 元素水平方向位置（距离画布左侧）
     */
    left?: number;
    /**
     * top字段
     * Java类型: java.lang.Integer
     * 描述: 元素垂直方向位置（距离画布顶部）
     */
    top?: number;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 元素ID
     */
    id?: string;
    /**
     * lock字段
     * Java类型: java.lang.Boolean
     * 描述: 锁定元素
     */
    lock?: boolean;
    /**
     * width字段
     * Java类型: java.lang.Integer
     * 描述: 元素宽度
     */
    width?: number;
    /**
     * link字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.PPTElementLink
     * 描述: 超链接
     */
    link?: PPTElementLink;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 元素名
     */
    name?: string;
    /**
     * height字段
     * Java类型: java.lang.Integer
     * 描述: 元素高度
     */
    height?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTSlide
 * 描述: 幻灯片页面
 */
export interface PPTSlide extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTSlideType
     * 描述: 页面类型
     */
    type?: PPTSlideType;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注
     */
    remark?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 页面ID
     */
    id?: string;
    /**
     * background字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.PPTSlideBackground
     * 描述: 页面背景
     */
    background?: PPTSlideBackground;
    /**
     * elements字段
     * Java类型: java.util.List
     * 描述: 元素集合
     */
    elements?: Array<PPTBaseElement>;
    /**
     * animations字段
     * Java类型: java.util.List
     * 描述: 元素动画集合
     */
    animations?: Array<PPTAnimation>;
    /**
     * turningMode字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTTurningMode
     * 描述: 翻页方式
     */
    turningMode?: PPTTurningMode;
    /**
     * sectionTag字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.PPTSectionTag
     * 描述: 章节标签
     */
    sectionTag?: PPTSectionTag;
    /**
     * notes字段
     * Java类型: java.util.List
     * 描述: 批注
     */
    notes?: Array<PPTNote>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTNote
 * 描述: 批注
 */
export interface PPTNote extends BaseObject {
    /**
     * replies字段
     * Java类型: java.util.List
     * 描述: 回复列表
     */
    replies?: Array<PPTNoteReply>;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 批注内容
     */
    content?: string;
    /**
     * user字段
     * Java类型: java.lang.String
     * 描述: 批注用户
     */
    user?: string;
    /**
     * elId字段
     * Java类型: java.lang.String
     * 描述: 元素ID
     */
    elId?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 批注ID
     */
    id?: string;
    /**
     * time字段
     * Java类型: java.lang.Long
     * 描述: 批注时间
     */
    time?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTSlideBackground
 * 描述: 幻灯片背景
 */
export interface PPTSlideBackground extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTSlideBackgroundType
     * 描述: 背景类型（纯色、图片、渐变）
     */
    type?: PPTSlideBackgroundType;
    /**
     * image字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.PPTSlideBackgroundImage
     * 描述: 图片背景
     */
    image?: PPTSlideBackgroundImage;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 背景颜色（纯色）
     */
    color?: string;
    /**
     * PPTGradient字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.PPTGradient
     * 描述: 渐变背景
     */
    PPTGradient?: PPTGradient;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTNoteReply
 * 描述: 批注回复
 */
export interface PPTNoteReply extends BaseObject {
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 回复ID
     */
    id?: string;
    /**
     * time字段
     * Java类型: java.lang.Long
     * 描述: 回复时间
     */
    time?: string|number;
    /**
     * user字段
     * Java类型: java.lang.String
     * 描述: 回复用户
     */
    user?: string;
    /**
     * content字段
     * Java类型: java.lang.String
     * 描述: 回复内容
     */
    content?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTGradient
 * 描述: 渐变
 */
export interface PPTGradient extends BaseObject {
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTGradientType
     * 描述: 渐变类型（径向、线性）
     */
    type?: PPTGradientType;
    /**
     * colors字段
     * Java类型: java.util.List
     * 描述: 渐变颜色列表
     */
    colors?: Array<PPTGradientColor>;
    /**
     * rotate字段
     * Java类型: java.lang.Integer
     * 描述: 渐变角度（线性渐变）
     */
    rotate?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PPTAnimation
 * 描述: 元素动画
 */
export interface PPTAnimation extends BaseObject {
    /**
     * duration字段
     * Java类型: java.lang.Integer
     * 描述: 动画持续时间
     */
    duration?: number;
    /**
     * effect字段
     * Java类型: java.lang.String
     * 描述: 动画效果
     */
    effect?: string;
    /**
     * id字段
     * Java类型: java.lang.String
     * 描述: 动画id
     */
    id?: string;
    /**
     * trigger字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTAnimationTrigger
     * 描述: 动画触发方式
     */
    trigger?: PPTAnimationTrigger;
    /**
     * elId字段
     * Java类型: java.lang.String
     * 描述: 元素ID
     */
    elId?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.ppt.types.enums.PPTAnimationType
     * 描述: 动画类型（入场、退场、强调）
     */
    type?: PPTAnimationType;
}
