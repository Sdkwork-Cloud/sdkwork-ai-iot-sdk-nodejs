import { BaseParam } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: QueryParam
 */
export interface QueryParam extends BaseParam {
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: QueryListParam
 */
export interface QueryListParam extends QueryParam {
    /**
     * createdAtTo字段
     * Java类型: java.util.Date
     */
    createdAtTo?: string;
    /**
     * createdAtFrom字段
     * Java类型: java.util.Date
     */
    createdAtFrom?: string;
}
