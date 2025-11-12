import { ContentType } from '../../enums/content';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FavoriteParam
 * 描述: 收藏Form
 */
export interface FavoriteParam extends BaseParam {
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重
     */
    sortWeight?: number;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * folderName字段
     * Java类型: java.lang.String
     * 描述: 收藏夹名称
     */
    folderName?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 收藏备注
     */
    remark?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的内容ID
     */
    contentId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FavoriteResponse
 * 描述: 收藏VO
 */
export interface FavoriteResponse extends BaseResponse {
    /**
     * sortWeight字段
     * Java类型: java.lang.Integer
     * 描述: 排序权重
     */
    sortWeight?: number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 收藏UUID
     */
    uuid?: string;
    /**
     * contentType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.content.PlusContentType
     * 描述: 内容类型
     */
    contentType?: ContentType;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * folderName字段
     * Java类型: java.lang.String
     * 描述: 收藏夹名称
     */
    folderName?: string;
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 收藏备注
     */
    remark?: string;
    /**
     * contentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的内容ID
     */
    contentId?: string|number;
}
