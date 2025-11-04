import { MemoryProfileType } from '../../enums/memory';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemoryProfile
 * 描述: AI模型服务令牌使用限制配置信息
 */
export interface MemoryProfile extends BaseObject {
    /**
     * customs字段
     * Java类型: java.util.Map
     */
    customs?: Map<MemoryProfileType, Array<ProfileItem>>;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * items字段
     * Java类型: java.util.List
     */
    items?: Array<ProfileItem>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ProfileItem
 * 描述: Profile Item
 */
export interface ProfileItem extends BaseObject {
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * label字段
     * Java类型: java.lang.String
     */
    label?: string;
    /**
     * samples字段
     * Java类型: [Ljava.lang.String;
     */
    samples?: string[];
    /**
     * updateCount字段
     * Java类型: int
     */
    updateCount?: number;
    /**
     * values字段
     * Java类型: [Ljava.lang.String;
     */
    values?: string[];
    /**
     * custom字段
     * Java类型: boolean
     */
    custom?: boolean;
}
