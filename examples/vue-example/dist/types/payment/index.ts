import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: WechatPayObject
 * 描述: 微信支付创建订单返回对象
 */
export interface WechatPayObject extends PayObject {
    /**
     * nonceStr字段
     * Java类型: java.lang.String
     * 描述: 随机字符串，用于签名
     * 示例: nonce_str
     */
    nonceStr?: string;
    /**
     * tradeType字段
     * Java类型: java.lang.String
     * 描述: 交易类型，小程序取值为JSAPI，扫码支付取值为NATIVE，H5支付取值为MWEB
     * 示例: JSAPI
     */
    tradeType?: string;
    /**
     * mwebUrl字段
     * Java类型: java.lang.String
     * 描述: 支付跳转链接，用于H5支付
     * 示例: https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx2016121516420242444321a769057895&package=1037687096
     */
    mwebUrl?: string;
    /**
     * prepayId字段
     * Java类型: java.lang.String
     * 描述: 预支付交易会话标识，用于小程序端发起支付
     * 示例: wx201410272009395522657a690389285100
     */
    prepayId?: string;
    /**
     * signType字段
     * Java类型: java.lang.String
     * 描述: 签名类型，默认为MD5，支持HMAC-SHA256
     * 示例: MD5
     */
    signType?: string;
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号
     * 示例: 20150806125346
     */
    outTradeNo?: string;
    /**
     * paySign字段
     * Java类型: java.lang.String
     * 描述: 签名，用于客户端验证
     * 示例: sign
     */
    paySign?: string;
    /**
     * timeStamp字段
     * Java类型: java.lang.String
     * 描述: 时间戳，用于签名
     * 示例: 1414561699
     */
    timeStamp?: string;
    /**
     * codeUrl字段
     * Java类型: java.lang.String
     * 描述: 二维码链接，用于扫码支付
     * 示例: weixin://wxpay/bizpayurl?pr=BGHp2zDzz
     */
    codeUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PayObject
 */
export interface PayObject extends BaseObject {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: StripeObject
 * 描述: Stripe支付创建订单返回对象
 */
export interface StripeObject extends PayObject {
    /**
     * sessionId字段
     * Java类型: java.lang.String
     * 描述: 支付会话ID
     * 示例: cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
     */
    sessionId?: string;
    /**
     * paymentUrl字段
     * Java类型: java.lang.String
     * 描述: 支付链接，用于H5跳转支付
     * 示例: https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
     */
    paymentUrl?: string;
    /**
     * clientSecret字段
     * Java类型: java.lang.String
     * 描述: 客户端密钥，用于前端初始化支付
     * 示例: pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
     */
    clientSecret?: string;
    /**
     * currency字段
     * Java类型: java.lang.String
     * 描述: 货币代码
     * 示例: usd
     */
    currency?: string;
    /**
     * returnUrl字段
     * Java类型: java.lang.String
     * 描述: 回调URL，用于支付完成后返回
     * 示例: https://yoursite.com/stripe/callback
     */
    returnUrl?: string;
    /**
     * amount字段
     * Java类型: java.lang.String
     * 描述: 交易金额
     * 示例: 100.00
     */
    amount?: string;
    /**
     * paymentIntentId字段
     * Java类型: java.lang.String
     * 描述: 支付意图ID
     * 示例: pi_1GtW3r2eZvKYlo2C3a4b5c6d
     */
    paymentIntentId?: string;
    /**
     * publishableKey字段
     * Java类型: java.lang.String
     * 描述: 发布密钥
     * 示例: pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
     */
    publishableKey?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AlipayObject
 * 描述: 支付宝支付创建订单返回对象
 */
export interface AlipayObject extends PayObject {
    /**
     * outTradeNo字段
     * Java类型: java.lang.String
     * 描述: 商户订单号
     * 示例: 20150320010101001
     */
    outTradeNo?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     * 描述: 商户APPID
     * 示例: 2014072300007148
     */
    appId?: string;
    /**
     * tradeNo字段
     * Java类型: java.lang.String
     * 描述: 支付宝交易号
     * 示例: 2013112011001004330000121536
     */
    tradeNo?: string;
    /**
     * method字段
     * Java类型: java.lang.String
     * 描述: 接口名称
     * 示例: alipay.trade.app.pay
     */
    method?: string;
    /**
     * qrCode字段
     * Java类型: java.lang.String
     * 描述: 仅用于二维码支付，二维码地址
     * 示例: https://qr.alipay.com/bax03431ljhokirwl35aa
     */
    qrCode?: string;
    /**
     * payUrl字段
     * Java类型: java.lang.String
     * 描述: 支付链接，用于扫码支付和跳转支付
     * 示例: https://openapi.alipay.com/gateway.do
     */
    payUrl?: string;
    /**
     * sign字段
     * Java类型: java.lang.String
     * 描述: 签名字符串，用于APP支付
     * 示例: app_id=2017060101317939&biz_content=...
     */
    sign?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApplePayObject
 * 描述: Apple Pay支付创建订单返回对象
 */
export interface ApplePayObject extends PayObject {
    /**
     * network字段
     * Java类型: java.lang.String
     * 描述: 支付网络
     * 示例: Visa
     */
    network?: string;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 交易标识符
     * 示例: CD80B9FC31C9A850C14C697BD4C258AA51E63BF72BBA46394EEBBC3FAE1B58E4
     */
    transactionId?: string;
    /**
     * currencyCode字段
     * Java类型: java.lang.String
     * 描述: 货币代码
     * 示例: CNY
     */
    currencyCode?: string;
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 支付类型
     * 示例: debit
     */
    type?: string;
    /**
     * paymentData字段
     * Java类型: java.lang.String
     * 描述: 支付数据，包含加密的支付信息
     * 示例: {
  "version": "EC_v1",
  "data": "...",
  "signature": "...",
  "header": {
    "ephemeralPublicKey": "...",
    "publicKeyHash": "...",
    "transactionId": "..."
  }
}
     */
    paymentData?: string;
    /**
     * displayName字段
     * Java类型: java.lang.String
     * 描述: 支付方式显示名称
     * 示例: Visa 1234
     */
    displayName?: string;
    /**
     * merchantId字段
     * Java类型: java.lang.String
     * 描述: 商户标识
     * 示例: merchant.com.yourappname
     */
    merchantId?: string;
    /**
     * amount字段
     * Java类型: java.lang.String
     * 描述: 支付金额
     * 示例: 100.00
     */
    amount?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PaypalObject
 * 描述: PayPal支付创建订单返回对象
 */
export interface PaypalObject extends PayObject {
    /**
     * amount字段
     * Java类型: java.lang.String
     * 描述: 支付金额
     * 示例: 100.00
     */
    amount?: string;
    /**
     * cancelUrl字段
     * Java类型: java.lang.String
     * 描述: 取消URL
     * 示例: https://yoursite.com/cancel
     */
    cancelUrl?: string;
    /**
     * payerId字段
     * Java类型: java.lang.String
     * 描述: 支付人ID
     * 示例: 12345678901234567
     */
    payerId?: string;
    /**
     * currency字段
     * Java类型: java.lang.String
     * 描述: 货币代码
     * 示例: USD
     */
    currency?: string;
    /**
     * paymentUrl字段
     * Java类型: java.lang.String
     * 描述: 支付链接，用于跳转到PayPal支付页面
     * 示例: https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-8P797793UC426902P
     */
    paymentUrl?: string;
    /**
     * invoice字段
     * Java类型: java.lang.String
     * 描述: 商户订单号
     * 示例: ORDER-123456789
     */
    invoice?: string;
    /**
     * returnUrl字段
     * Java类型: java.lang.String
     * 描述: 返回URL
     * 示例: https://yoursite.com/return
     */
    returnUrl?: string;
    /**
     * paymentStatus字段
     * Java类型: java.lang.String
     * 描述: 支付状态
     * 示例: Completed
     */
    paymentStatus?: string;
    /**
     * transactionId字段
     * Java类型: java.lang.String
     * 描述: 交易号
     * 示例: 12345678901234567
     */
    transactionId?: string;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 支付令牌，用于后续支付操作
     * 示例: EC-8P797793UC426902P
     */
    token?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UnionPayObject
 * 描述: 银联支付创建订单返回对象
 */
export interface UnionPayObject extends PayObject {
    /**
     * merOrderId字段
     * Java类型: java.lang.String
     * 描述: 商户订单号
     * 示例: 101720191001121212
     */
    merOrderId?: string;
    /**
     * schemeStr字段
     * Java类型: java.lang.String
     * 描述: 商户自定义协议，用于APP支付后返回
     * 示例: your-app://unionpay
     */
    schemeStr?: string;
    /**
     * payUrl字段
     * Java类型: java.lang.String
     * 描述: 支付跳转链接，用于H5支付
     * 示例: https://api-mop.chinaums.com/v1/netpay/uac/order?authorization=OPEN-FORM-PARAM&appId=123456&timestamp=20191001121212&nonce=123456&content=content&signature=signature
     */
    payUrl?: string;
    /**
     * tn字段
     * Java类型: java.lang.String
     * 描述: 交易流水号，用于APP支付
     * 示例: 562616342321571143110
     */
    tn?: string;
    /**
     * merId字段
     * Java类型: java.lang.String
     * 描述: 商户代码
     * 示例: 898111111111111
     */
    merId?: string;
    /**
     * signature字段
     * Java类型: java.lang.String
     * 描述: 签名信息
     * 示例: signature
     */
    signature?: string;
    /**
     * mode字段
     * Java类型: java.lang.String
     * 描述: 环境标识，00表示正式环境，01表示测试环境
     * 示例: 00
     */
    mode?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ClientPayObjects
 */
export interface ClientPayObjects extends BaseObject {
    /**
     * alipay字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.AlipayObject
     */
    alipay?: AlipayObject;
    /**
     * applePay字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.ApplePayObject
     */
    applePay?: ApplePayObject;
    /**
     * unionPay字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.UnionPayObject
     */
    unionPay?: UnionPayObject;
    /**
     * wechat字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.WechatPayObject
     */
    wechat?: WechatPayObject;
    /**
     * stripe字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.StripeObject
     */
    stripe?: StripeObject;
    /**
     * paypal字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.payment.PaypalObject
     */
    paypal?: PaypalObject;
}
