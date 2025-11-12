import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TokenResult
 * 描述: 令牌结果信息
 */
export interface TokenResult extends BaseObject {
    /**
     * createdAt字段
     * Java类型: java.lang.Long
     * 描述: 令牌创建时间（毫秒时间戳）
     */
    createdAt?: string|number;
    /**
     * expiresInMs字段
     * Java类型: java.lang.Long
     * 描述: 令牌过期时间（毫秒）
     */
    expiresInMs?: string|number;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 令牌字符串
     */
    token?: string;
}
