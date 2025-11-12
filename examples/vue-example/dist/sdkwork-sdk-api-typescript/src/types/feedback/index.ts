import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FeedbackParam
 * 描述: Feedback Form (used for feedback data submission and validation)
 */
export interface FeedbackParam extends BaseParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User ID (foreign key关联plus_user.id)
     */
    userId?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FeedbackResponse
 * 描述: 反馈信息VO
 */
export interface FeedbackResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间，实体首次持久化时设置
     */
    createdAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间，实体修改时更新
     */
    updatedAt?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.Long
     * 描述: 版本号，用于乐观锁控制
     */
    version?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID(外键关联plus_user.id)
     */
    userId?: string|number;
}
