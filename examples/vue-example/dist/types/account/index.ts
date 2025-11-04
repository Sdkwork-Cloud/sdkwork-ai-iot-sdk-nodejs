import { AssetType, PointsSourceType, AccountHistoryTransactionType, AccountStatus } from '../../enums/account';
import { TransactionStatus } from '../../enums/trade';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AccountHistoryParam
 * 描述: 账户流水Form(包含资金和积分)
 */
export interface AccountHistoryParam extends BaseParam {
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 变动金额 (资金专用)
     */
    amount?: string|number;
    /**
     * balanceBefore字段
     * Java类型: java.math.BigDecimal
     * 描述: 交易前账户余额 (资金专用)
     */
    balanceBefore?: string|number;
    /**
     * sourceId字段
     * Java类型: java.lang.String
     * 描述: 来源业务ID (如订单ID、活动ID)
     */
    sourceId?: string;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 外部交易号或业务唯一标识，用于幂等控制
     */
    transactionId?: string;
    /**
     * assetType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AssetType
     * 描述: 资产类型 (BALANCE-资金, POINT-积分)
     */
    assetType?: AssetType;
    /**
     * relatedAccountId字段
     * Java类型: java.lang.Long
     * 描述: 关联账户ID (如转账时的对方账户)
     */
    relatedAccountId?: string|number;
    /**
     * pointsChange字段
     * Java类型: java.lang.Long
     * 描述: 变动积分值 (积分专用)
     */
    pointsChange?: string|number;
    /**
     * pointsAfter字段
     * Java类型: java.lang.Long
     * 描述: 变动后账户积分 (积分专用)
     */
    pointsAfter?: string|number;
    /**
     * sourceType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.PointsSourceType
     * 描述: 来源类型 (1-订单, 2-活动, 3-签到, 4-分享, 5-邀请, 6-系统奖励, 99-其他)
     */
    sourceType?: PointsSourceType;
    /**
     * transactionType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AccountHistoryTransactionType
     * 描述: 交易类型 (1-充值, 2-提现, 3-退款, 4-转账, 5-调账, 6-积分获得, 7-积分使用, 8-积分过期, 9-收益)
     */
    transactionType?: AccountHistoryTransactionType;
    /**
     * accountId字段
     * Java类型: java.lang.Long
     * 描述: 关联的账户ID
     */
    accountId?: string|number;
    /**
     * expiredAt字段
     * Java类型: java.time.Instant
     * 描述: 积分过期时间 (积分专用)
     */
    expiredAt?: string;
    /**
     * remarks字段
     * Java类型: java.lang.String
     * 描述: 备注信息，可存JSON或其他文本
     */
    remarks?: string;
    /**
     * pointsBefore字段
     * Java类型: java.lang.Long
     * 描述: 变动前账户积分 (积分专用)
     */
    pointsBefore?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.TransactionStatus
     * 描述: 交易状态 (1-处理中, 2-成功, 3-失败)
     */
    status?: TransactionStatus;
    /**
     * balanceAfter字段
     * Java类型: java.math.BigDecimal
     * 描述: 交易后账户余额 (资金专用)
     */
    balanceAfter?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AccountParam
 * 描述: 用户账户表单，用于账户信息的创建和更新
 */
export interface AccountParam extends BaseParam {
    /**
     * availablePoints字段
     * Java类型: java.lang.Long
     * 描述: 当前可用积分
     */
    availablePoints?: string|number;
    /**
     * frozenPoints字段
     * Java类型: java.lang.Long
     * 描述: 当前冻结积分
     */
    frozenPoints?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 关联的用户ID，对应 plus_user 表的主键
     */
    userId?: string|number;
    /**
     * availableBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 可用余额
     */
    availableBalance?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AccountStatus
     * 描述: 账户状态 (1-激活, 2-冻结, 3-已注销)
     */
    status?: AccountStatus;
    /**
     * frozenBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 冻结余额，例如提现申请中
     */
    frozenBalance?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AccountHistoryResponse
 * 描述: 账户流水VO(包含资金和积分)
 */
export interface AccountHistoryResponse extends BaseResponse {
    /**
     * balanceAfter字段
     * Java类型: java.math.BigDecimal
     * 描述: 交易后账户余额 (资金专用)
     */
    balanceAfter?: string|number;
    /**
     * pointsBefore字段
     * Java类型: java.lang.Long
     * 描述: 变动前账户积分 (积分专用)
     */
    pointsBefore?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.trade.TransactionStatus
     * 描述: 交易状态 (1-处理中, 2-成功, 3-失败)
     */
    status?: TransactionStatus;
    /**
     * remarks字段
     * Java类型: java.lang.String
     * 描述: 备注信息，可存JSON或其他文本
     */
    remarks?: string;
    /**
     * accountId字段
     * Java类型: java.lang.Long
     * 描述: 关联的账户ID
     */
    accountId?: string|number;
    /**
     * expiredAt字段
     * Java类型: java.time.Instant
     * 描述: 积分过期时间 (积分专用)
     */
    expiredAt?: string;
    /**
     * transactionType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AccountHistoryTransactionType
     * 描述: 交易类型 (1-充值, 2-提现, 3-退款, 4-转账, 5-调账, 6-积分获得, 7-积分使用, 8-积分过期, 9-收益)
     */
    transactionType?: AccountHistoryTransactionType;
    /**
     * sourceType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.PointsSourceType
     * 描述: 来源类型 (1-订单, 2-活动, 3-签到, 4-分享, 5-邀请, 6-系统奖励, 99-其他)
     */
    sourceType?: PointsSourceType;
    /**
     * pointsAfter字段
     * Java类型: java.lang.Long
     * 描述: 变动后账户积分 (积分专用)
     */
    pointsAfter?: string|number;
    /**
     * pointsChange字段
     * Java类型: java.lang.Long
     * 描述: 变动积分值 (积分专用)
     */
    pointsChange?: string|number;
    /**
     * relatedAccountId字段
     * Java类型: java.lang.Long
     * 描述: 关联账户ID (如转账时的对方账户)
     */
    relatedAccountId?: string|number;
    /**
     * assetType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AssetType
     * 描述: 资产类型 (BALANCE-资金, POINT-积分)
     */
    assetType?: AssetType;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 外部交易号或业务唯一标识，用于幂等控制
     */
    transactionId?: string;
    /**
     * sourceId字段
     * Java类型: java.lang.String
     * 描述: 来源业务ID (如订单ID、活动ID)
     */
    sourceId?: string;
    /**
     * balanceBefore字段
     * Java类型: java.math.BigDecimal
     * 描述: 交易前账户余额 (资金专用)
     */
    balanceBefore?: string|number;
    /**
     * amount字段
     * Java类型: java.math.BigDecimal
     * 描述: 变动金额 (资金专用)
     */
    amount?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AccountResponse
 * 描述: 用户账户VO，记录余额和积分信息
 */
export interface AccountResponse extends BaseResponse {
    /**
     * frozenBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 冻结余额，例如提现申请中
     */
    frozenBalance?: string|number;
    /**
     * availablePoints字段
     * Java类型: java.lang.Long
     * 描述: 当前可用积分
     */
    availablePoints?: string|number;
    /**
     * frozenPoints字段
     * Java类型: java.lang.Long
     * 描述: 当前冻结积分
     */
    frozenPoints?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 关联的用户ID，对应 plus_user 表的主键
     */
    userId?: string|number;
    /**
     * availableBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 可用余额
     */
    availableBalance?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.account.AccountStatus
     * 描述: 账户状态 (1-激活, 2-冻结, 3-已注销)
     */
    status?: AccountStatus;
}
