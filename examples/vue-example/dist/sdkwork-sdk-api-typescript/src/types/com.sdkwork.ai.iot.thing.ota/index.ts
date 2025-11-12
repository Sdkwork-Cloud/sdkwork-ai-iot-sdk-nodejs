import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: WebsocketInfo
 * 描述: WebSocket configuration information
 */
export interface WebsocketInfo extends BaseObject {
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: WebSocket connection URL
     */
    url?: string;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: Connection token
     */
    token?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FirmwareInfo
 * 描述: Firmware information
 */
export interface FirmwareInfo extends BaseObject {
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: Firmware version
     */
    version?: string;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: Firmware download URL
     */
    url?: string;
    /**
     * force字段
     * Java类型: java.lang.Integer
     * 描述: Whether to force update
     */
    force?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MqttInfo
 * 描述: MQTT configuration information
 */
export interface MqttInfo extends BaseObject {
    /**
     * client_id字段
     * Java类型: java.lang.String
     * 描述: Client ID
     */
    client_id?: string;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: Password
     */
    password?: string;
    /**
     * port字段
     * Java类型: java.lang.Integer
     * 描述: MQTT server port
     */
    port?: number;
    /**
     * host字段
     * Java类型: java.lang.String
     * 描述: MQTT server address
     */
    host?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: Username
     */
    username?: string;
}
