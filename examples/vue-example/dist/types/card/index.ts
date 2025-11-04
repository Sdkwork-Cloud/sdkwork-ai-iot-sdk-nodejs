import { CardType, ValidityType, CardStatus } from '../../enums/card';
import { CodeType } from '../../enums/coupon';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CardTemplateParam
 * 描述: Membership card template Form
 */
export interface CardTemplateParam extends BaseParam {
    /**
     * templateCode字段
     * Java类型: java.lang.String
     * 描述: Template code
     */
    templateCode?: string;
    /**
     * cardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardType
     * 描述: Card type (enum)
     */
    cardType?: CardType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Description
     */
    description?: string;
    /**
     * logoUrl字段
     * Java类型: java.lang.String
     * 描述: Logo URL
     */
    logoUrl?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: Title
     */
    title?: string;
    /**
     * brandName字段
     * Java类型: java.lang.String
     * 描述: Brand name
     */
    brandName?: string;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: Quantity
     */
    quantity?: number;
    /**
     * discountRate字段
     * Java类型: java.math.BigDecimal
     * 描述: Discount rate
     */
    discountRate?: string|number;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: Can share
     */
    canShare?: boolean;
    /**
     * codeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CodeType
     * 描述: Code type (enum)
     */
    codeType?: CodeType;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: Color
     */
    color?: string;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: Get limit
     */
    getLimit?: number;
    /**
     * canGiveFriend字段
     * Java类型: java.lang.Boolean
     * 描述: Can give friend
     */
    canGiveFriend?: boolean;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: Start time
     */
    startTime?: string;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: End time
     */
    endTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Template name
     */
    name?: string;
    /**
     * notice字段
     * Java类型: java.lang.String
     * 描述: Notice
     */
    notice?: string;
    /**
     * validityDays字段
     * Java类型: java.lang.Integer
     * 描述: Validity days
     */
    validityDays?: number;
    /**
     * validityType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.ValidityType
     * 描述: Validity type
     */
    validityType?: ValidityType;
    /**
     * initialBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: Initial balance
     */
    initialBalance?: string|number;
    /**
     * isDeleted字段
     * Java类型: java.lang.Boolean
     * 描述: Is deleted
     */
    isDeleted?: boolean;
    /**
     * minimumBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: Minimum balance
     */
    minimumBalance?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemberLevelParam
 * 描述: 会员等级Form，设置积分达到条件和对应等级
 */
export interface MemberLevelParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 等级特权描述
     */
    description?: string;
    /**
     * levelName字段
     * Java类型: java.lang.String
     * 描述: 等级名称，如“银卡”、“金卡”
     */
    levelName?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardStatus
     * 描述: 等级状态：启用/禁用
     */
    status?: CardStatus;
    /**
     * cardId字段
     * Java类型: java.lang.Long
     * 描述: 所属会员卡ID
     */
    cardId?: string|number;
    /**
     * requiredPoints字段
     * Java类型: java.lang.Long
     * 描述: 升级所需积分阈值
     */
    requiredPoints?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CardParam
 * 描述: Membership Card Form
 */
export interface CardParam extends BaseParam {
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: Expiration time
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: Effective time
     */
    startTime?: string;
    /**
     * notice字段
     * Java类型: java.lang.String
     * 描述: Usage instructions
     */
    notice?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardStatus
     * 描述: Card status: enabled/disabled/deleted
     */
    status?: CardStatus;
    /**
     * cardOrganizationId字段
     * Java类型: java.lang.Long
     * 描述: Card organization ID
     */
    cardOrganizationId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Card details description
     */
    description?: string;
    /**
     * cardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardType
     * 描述: Card type: membership card, gift card, etc.
     */
    cardType?: CardType;
    /**
     * logoUrl字段
     * Java类型: java.lang.String
     * 描述: Card logo image URL
     */
    logoUrl?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: Card title
     */
    title?: string;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: Card inventory/issuance quantity
     */
    quantity?: number;
    /**
     * brandName字段
     * Java类型: java.lang.String
     * 描述: Merchant name
     */
    brandName?: string;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: Whether can be shared
     */
    canShare?: boolean;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: Per person collection limit
     */
    getLimit?: number;
    /**
     * canGiveFriend字段
     * Java类型: java.lang.Boolean
     * 描述: Whether can be given to friends
     */
    canGiveFriend?: boolean;
    /**
     * codeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CodeType
     * 描述: Coupon code type: QR code, barcode, etc.
     */
    codeType?: CodeType;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: Card color
     */
    color?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemberCardParam
 * 描述: 会员卡扩展信息Form
 */
export interface MemberCardParam extends BaseParam {
    /**
     * autoActivate字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自动激活
     */
    autoActivate?: boolean;
    /**
     * wxActivate字段
     * Java类型: java.lang.Boolean
     * 描述: 是否一键激活
     */
    wxActivate?: boolean;
    /**
     * bonusName字段
     * Java类型: java.lang.String
     * 描述: 积分名称（如“积分”）
     */
    bonusName?: string;
    /**
     * supplyBalance字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持储值
     */
    supplyBalance?: boolean;
    /**
     * maxReduceBonus字段
     * Java类型: java.lang.Integer
     * 描述: 每次使用的积分抵扣上限
     */
    maxReduceBonus?: number;
    /**
     * balanceName字段
     * Java类型: java.lang.String
     * 描述: 储值名称
     */
    balanceName?: string;
    /**
     * maxIncreaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 单次最大赠送积分上限
     */
    maxIncreaseBonus?: string|number;
    /**
     * supplyBonus字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持积分
     */
    supplyBonus?: boolean;
    /**
     * card字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.card.PlusCard
     * 描述: 关联的基础卡券记录
     */
    card?: Card;
    /**
     * leastMoneyToUseBonus字段
     * Java类型: java.lang.Integer
     * 描述: 使用积分抵扣时需最低消费金额（单位：分）
     */
    leastMoneyToUseBonus?: number;
    /**
     * increaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 每花费costMoneyUnit所得积分数
     */
    increaseBonus?: string|number;
    /**
     * costBonusUnit字段
     * Java类型: java.lang.Integer
     * 描述: 消耗积分的最小单位
     */
    costBonusUnit?: number;
    /**
     * reduceMoney字段
     * Java类型: java.lang.Integer
     * 描述: 使用积分抵扣金额（单位：分）
     */
    reduceMoney?: number;
    /**
     * prerogative字段
     * Java类型: java.lang.String
     * 描述: 会员特权说明
     */
    prerogative?: string;
    /**
     * costMoneyUnit字段
     * Java类型: java.lang.Integer
     * 描述: 消费金额（单位：分）获取积分
     */
    costMoneyUnit?: number;
    /**
     * initIncreaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 初始赠送积分
     */
    initIncreaseBonus?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserCardParam
 * 描述: User-Card Binding Form
 */
export interface UserCardParam extends BaseParam {
    /**
     * acquireTime字段
     * Java类型: java.time.Instant
     * 描述: Acquisition time
     */
    acquireTime?: string;
    /**
     * activateTime字段
     * Java类型: java.time.Instant
     * 描述: Activation time
     */
    activateTime?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: User ID (reference to plus_user table)
     */
    userId?: string|number;
    /**
     * points字段
     * Java类型: java.lang.Long
     * 描述: Current points balance
     */
    points?: string|number;
    /**
     * balance字段
     * Java类型: java.lang.Long
     * 描述: Current stored value balance
     */
    balance?: string|number;
    /**
     * cancelTime字段
     * Java类型: java.time.Instant
     * 描述: Cancellation/expiration time
     */
    cancelTime?: string;
    /**
     * cardId字段
     * Java类型: java.lang.Long
     * 描述: Card ID (reference to plus_card table)
     */
    cardId?: string|number;
    /**
     * cardCode字段
     * Java类型: java.lang.String
     * 描述: User membership card number/Code
     */
    cardCode?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemberCardResponse
 * 描述: 会员卡扩展表VO，存储会员卡专属属性
 */
export interface MemberCardResponse extends BaseResponse {
    /**
     * initIncreaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 初始赠送积分
     */
    initIncreaseBonus?: string|number;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * reduceMoney字段
     * Java类型: java.lang.Integer
     * 描述: 使用积分抵扣金额（单位：分）
     */
    reduceMoney?: number;
    /**
     * prerogative字段
     * Java类型: java.lang.String
     * 描述: 会员特权说明
     */
    prerogative?: string;
    /**
     * costMoneyUnit字段
     * Java类型: java.lang.Integer
     * 描述: 消费金额（单位：分）获取积分
     */
    costMoneyUnit?: number;
    /**
     * cardId字段
     * Java类型: java.lang.Long
     * 描述: 关联的基础卡券ID
     */
    cardId?: string|number;
    /**
     * costBonusUnit字段
     * Java类型: java.lang.Integer
     * 描述: 消耗积分的最小单位
     */
    costBonusUnit?: number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 会员等级ID
     */
    id?: string|number;
    /**
     * increaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 每花费costMoneyUnit所得积分数
     */
    increaseBonus?: string|number;
    /**
     * leastMoneyToUseBonus字段
     * Java类型: java.lang.Integer
     * 描述: 使用积分抵扣时需最低消费金额（单位：分）
     */
    leastMoneyToUseBonus?: number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * maxIncreaseBonus字段
     * Java类型: java.lang.Long
     * 描述: 单次最大赠送积分上限
     */
    maxIncreaseBonus?: string|number;
    /**
     * supplyBonus字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持积分
     */
    supplyBonus?: boolean;
    /**
     * balanceName字段
     * Java类型: java.lang.String
     * 描述: 储值名称
     */
    balanceName?: string;
    /**
     * supplyBalance字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持储值
     */
    supplyBalance?: boolean;
    /**
     * maxReduceBonus字段
     * Java类型: java.lang.Integer
     * 描述: 每次使用的积分抵扣上限
     */
    maxReduceBonus?: number;
    /**
     * wxActivate字段
     * Java类型: java.lang.Boolean
     * 描述: 是否一键激活
     */
    wxActivate?: boolean;
    /**
     * bonusName字段
     * Java类型: java.lang.String
     * 描述: 积分名称（如“积分”）
     */
    bonusName?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: UUID
     */
    uuid?: string;
    /**
     * autoActivate字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自动激活
     */
    autoActivate?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CardResponse
 * 描述: Membership Card Value Object
 */
export interface CardResponse extends BaseResponse {
    /**
     * brandName字段
     * Java类型: java.lang.String
     * 描述: 商户名称
     */
    brandName?: string;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: 卡券库存/发行量
     */
    quantity?: number;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: 是否可分享
     */
    canShare?: boolean;
    /**
     * codeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CodeType
     * 描述: 券的Code码类型，如二维码、条形码
     */
    codeType?: CodeType;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 卡券颜色
     */
    color?: string;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: 每人领取上限
     */
    getLimit?: number;
    /**
     * canGiveFriend字段
     * Java类型: java.lang.Boolean
     * 描述: 是否可转赠
     */
    canGiveFriend?: boolean;
    /**
     * cardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardType
     * 描述: 卡券类型：会员卡、礼品券等
     */
    cardType?: CardType;
    /**
     * cardOrganizationId字段
     * Java类型: java.lang.Long
     * 描述: 发卡机构ID
     */
    cardOrganizationId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 卡券详情描述
     */
    description?: string;
    /**
     * logoUrl字段
     * Java类型: java.lang.String
     * 描述: 卡券Logo图片URL
     */
    logoUrl?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 卡券标题
     */
    title?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 生效时间
     */
    startTime?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Card ID
     */
    id?: string|number;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 失效时间
     */
    endTime?: string;
    /**
     * notice字段
     * Java类型: java.lang.String
     * 描述: 使用须知
     */
    notice?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardStatus
     * 描述: 卡券状态：启用/禁用/删除
     */
    status?: CardStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserCardResponse
 * 描述: 用户会员卡VO，用于表示用户与会员卡的绑定关系
 */
export interface UserCardResponse extends BaseResponse {
    /**
     * cardId字段
     * Java类型: java.lang.Long
     * 描述: 会员卡模板ID
     */
    cardId?: string|number;
    /**
     * cardCode字段
     * Java类型: java.lang.String
     * 描述: 用户会员卡的卡号/Code
     */
    cardCode?: string;
    /**
     * cancelTime字段
     * Java类型: java.time.Instant
     * 描述: 注销/到期时间
     */
    cancelTime?: string;
    /**
     * balance字段
     * Java类型: java.lang.Long
     * 描述: 当前储值余额
     */
    balance?: string|number;
    /**
     * points字段
     * Java类型: java.lang.Long
     * 描述: 当前积分余额
     */
    points?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID（引用plus_user表）
     */
    userId?: string|number;
    /**
     * acquireTime字段
     * Java类型: java.time.Instant
     * 描述: 领取时间
     */
    acquireTime?: string;
    /**
     * activateTime字段
     * Java类型: java.time.Instant
     * 描述: 激活时间
     */
    activateTime?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MemberLevelResponse
 * 描述: 会员等级VO，包含等级名称、所需积分、特权描述等信息
 */
export interface MemberLevelResponse extends BaseResponse {
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardStatus
     * 描述: 等级状态：启用/禁用
     */
    status?: CardStatus;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 等级特权描述
     */
    description?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 会员等级ID
     */
    id?: string|number;
    /**
     * levelName字段
     * Java类型: java.lang.String
     * 描述: 等级名称，如“银卡”、“金卡”
     */
    levelName?: string;
    /**
     * cardId字段
     * Java类型: java.lang.Long
     * 描述: 所属会员卡ID
     */
    cardId?: string|number;
    /**
     * requiredPoints字段
     * Java类型: java.lang.Long
     * 描述: 升级所需积分阈值
     */
    requiredPoints?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CardTemplateResponse
 * 描述: 会员卡模板Value Object
 */
export interface CardTemplateResponse extends BaseResponse {
    /**
     * discountRate字段
     * Java类型: java.math.BigDecimal
     * 描述: 折扣率
     */
    discountRate?: string|number;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     * 描述: 数量
     */
    quantity?: number;
    /**
     * brandName字段
     * Java类型: java.lang.String
     * 描述: 品牌名称
     */
    brandName?: string;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     * 描述: 获取限制
     */
    getLimit?: number;
    /**
     * canGiveFriend字段
     * Java类型: java.lang.Boolean
     * 描述: 是否可赠友
     */
    canGiveFriend?: boolean;
    /**
     * codeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CodeType
     * 描述: 编码类型(枚举)
     */
    codeType?: CodeType;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: 颜色
     */
    color?: string;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     * 描述: 是否可分享
     */
    canShare?: boolean;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 描述
     */
    description?: string;
    /**
     * cardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardType
     * 描述: 卡片类型(枚举)
     */
    cardType?: CardType;
    /**
     * templateCode字段
     * Java类型: java.lang.String
     * 描述: 模板编码
     */
    templateCode?: string;
    /**
     * title字段
     * Java类型: java.lang.String
     * 描述: 标题
     */
    title?: string;
    /**
     * logoUrl字段
     * Java类型: java.lang.String
     * 描述: Logo URL
     */
    logoUrl?: string;
    /**
     * validityType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.ValidityType
     * 描述: 有效期类型
     */
    validityType?: ValidityType;
    /**
     * minimumBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 最低余额
     */
    minimumBalance?: string|number;
    /**
     * isDeleted字段
     * Java类型: java.lang.Boolean
     * 描述: 是否删除
     */
    isDeleted?: boolean;
    /**
     * initialBalance字段
     * Java类型: java.math.BigDecimal
     * 描述: 初始余额
     */
    initialBalance?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 模板名称
     */
    name?: string;
    /**
     * endTime字段
     * Java类型: java.time.Instant
     * 描述: 结束时间
     */
    endTime?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 开始时间
     */
    startTime?: string;
    /**
     * notice字段
     * Java类型: java.lang.String
     * 描述: 公告
     */
    notice?: string;
    /**
     * validityDays字段
     * Java类型: java.lang.Integer
     * 描述: 有效天数
     */
    validityDays?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: Card
 */
export interface Card {
    /**
     * endTime字段
     * Java类型: java.time.Instant
     */
    endTime?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     */
    startTime?: string;
    /**
     * notice字段
     * Java类型: java.lang.String
     */
    notice?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardStatus
     */
    status?: CardStatus;
    /**
     * cardOrganizationId字段
     * Java类型: java.lang.Long
     */
    cardOrganizationId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * cardType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.card.CardType
     */
    cardType?: CardType;
    /**
     * logoUrl字段
     * Java类型: java.lang.String
     */
    logoUrl?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * title字段
     * Java类型: java.lang.String
     */
    title?: string;
    /**
     * quantity字段
     * Java类型: java.lang.Integer
     */
    quantity?: number;
    /**
     * brandName字段
     * Java类型: java.lang.String
     */
    brandName?: string;
    /**
     * canShare字段
     * Java类型: java.lang.Boolean
     */
    canShare?: boolean;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * getLimit字段
     * Java类型: java.lang.Integer
     */
    getLimit?: number;
    /**
     * canGiveFriend字段
     * Java类型: java.lang.Boolean
     */
    canGiveFriend?: boolean;
    /**
     * codeType字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.coupon.CodeType
     */
    codeType?: CodeType;
    /**
     * color字段
     * Java类型: java.lang.String
     */
    color?: string;
}
