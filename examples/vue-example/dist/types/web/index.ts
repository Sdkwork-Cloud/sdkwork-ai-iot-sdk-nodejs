/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ApiResult
 * 描述: API调用结果
 */
export interface ApiResult {
    /**
     * sign字段
     * Java类型: java.lang.String
     * 描述: Signature string
     * 示例: a1b2c3d4e5f67890
     */
    sign?: string;
    /**
     * errorMsg字段
     * Java类型: java.lang.String
     * 描述: Business error message
     */
    errorMsg?: string;
    /**
     * channelErrorCode字段
     * Java类型: java.lang.String
     * 描述: Channel error code
     * 示例: CHANNEL_ERROR_001
     */
    channelErrorCode?: string;
    /**
     * encryptedText字段
     * Java类型: java.lang.String
     * 描述: Encrypted content
     * 示例: encrypted_data_here
     */
    encryptedText?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: Response code: 2000=success, 4xxx=business failure, 5xxx=server error
     * 示例: 2000
     */
    code?: string;
    /**
     * msg字段
     * Java类型: java.lang.String
     * 描述: Business message
     * 示例: SUCCESS
     */
    msg?: string;
    /**
     * channelErrorMsg字段
     * Java类型: java.lang.String
     * 描述: Channel error message
     * 示例: Third-party service unavailable
     */
    channelErrorMsg?: string;
    /**
     * ip字段
     * Java类型: java.lang.String
     * 描述: Client IP address
     * 示例: 192.168.1.100
     */
    ip?: string;
    /**
     * data字段
     * Java类型: java.lang.Object
     * 描述: Response data
     */
    data?: any;
    /**
     * signType字段
     * Java类型: java.lang.String
     * 描述: Signature type
     * 示例: MD5
     */
    signType?: string;
    /**
     * encryptType字段
     * Java类型: java.lang.String
     * 描述: Encryption type
     * 示例: RSA
     */
    encryptType?: string;
    /**
     * hostname字段
     * Java类型: java.lang.String
     * 描述: Server hostname
     * 示例: server-node-01
     */
    hostname?: string;
    /**
     * errorName字段
     * Java类型: java.lang.String
     * 描述: Business error name
     * 示例: SUCCESS
     */
    errorName?: string;
    /**
     * requestId字段
     * Java类型: java.lang.String
     * 描述: Request identifier
     * 示例: REQ_20251003123456789_12345
     */
    requestId?: string;
}
