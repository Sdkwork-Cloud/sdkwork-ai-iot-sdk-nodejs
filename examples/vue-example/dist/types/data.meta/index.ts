import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FeedbackMetadata
 */
export interface FeedbackMetadata extends BaseObject {
    /**
     * rating字段
     * Java类型: java.lang.String
     */
    rating?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CommonMetadata
 */
export interface CommonMetadata extends BaseMetadata {
    /**
     * agentId字段
     * Java类型: java.lang.Long
     */
    agentId?: string|number;
    /**
     * partnerId字段
     * Java类型: java.lang.Long
     */
    partnerId?: string|number;
    /**
     * shopId字段
     * Java类型: java.lang.Long
     */
    shopId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: BaseMetadata
 */
export interface BaseMetadata extends BaseObject {
    /**
     * spMchId字段
     * Java类型: java.lang.Long
     */
    spMchId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ContentVoteMetadata
 */
export interface ContentVoteMetadata extends BaseObject {
    /**
     * rating字段
     * Java类型: java.lang.String
     */
    rating?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserMetadata
 */
export interface UserMetadata extends CommonMetadata {
    /**
     * fromUserId字段
     * Java类型: java.lang.Long
     */
    fromUserId?: string|number;
}
