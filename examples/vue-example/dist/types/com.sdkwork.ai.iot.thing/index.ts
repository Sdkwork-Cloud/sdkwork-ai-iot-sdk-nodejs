import { TransportType } from '../../enums/com.sdkwork.ai.iot.type';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: NetworkConfig
 */
export interface NetworkConfig {
    /**
     * host字段
     * Java类型: java.lang.String
     */
    host?: string;
    /**
     * transport字段
     * Java类型: com.sdkwork.ai.iot.type.TransportType
     */
    transport?: TransportType;
    /**
     * secure字段
     * Java类型: java.lang.Boolean
     */
    secure?: boolean;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * timeout字段
     * Java类型: java.lang.Integer
     */
    timeout?: number;
    /**
     * path字段
     * Java类型: java.lang.String
     */
    path?: string;
    /**
     * clientId字段
     * Java类型: java.lang.String
     */
    clientId?: string;
    /**
     * password字段
     * Java类型: java.lang.String
     */
    password?: string;
    /**
     * port字段
     * Java类型: java.lang.Integer
     */
    port?: number;
    /**
     * qos字段
     * Java类型: java.lang.Integer
     */
    qos?: number;
}
