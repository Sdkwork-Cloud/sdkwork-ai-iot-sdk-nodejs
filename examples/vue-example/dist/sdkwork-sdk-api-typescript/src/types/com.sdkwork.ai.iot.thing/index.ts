import { TransportType } from '../../enums/enums';
import { BaseObject } from '../../types/base';
import { MqttInfo, WebsocketInfo } from '../../types/com.sdkwork.ai.iot.thing.ota';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotThingMetadata
 */
export interface IotThingMetadata extends BaseObject {
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: NetworkConfig
 */
export interface NetworkConfig extends BaseObject {
    /**
     * transport字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.TransportType
     */
    transport?: TransportType;
    /**
     * mqtt字段
     * Java类型: com.sdkwork.ai.iot.thing.ota.MqttInfo
     */
    mqtt?: MqttInfo;
    /**
     * websocket字段
     * Java类型: com.sdkwork.ai.iot.thing.ota.WebsocketInfo
     */
    websocket?: WebsocketInfo;
}
