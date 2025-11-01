import { TransportType } from '../../enums/com.sdkwork.ai.iot.type';
import { ThingType, ThingStatus, ConnectStatus } from '../../enums/com.sdkwork.ai.iot.thing';
import { IotTransportProtocolType } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { NetworkConfig } from '../../types/com.sdkwork.ai.iot.thing';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotDeviceParam
 * 描述: 物理IoT设备Form，包含设备连接信息、能力配置等核心属性
 */
export interface IotDeviceParam extends BaseParam {
    /**
     * networkConfig字段
     * Java类型: com.sdkwork.ai.iot.thing.NetworkConfig
     * 描述: 网络配置信息（JSON格式）
     */
    networkConfig?: NetworkConfig;
    /**
     * activationCode字段
     * Java类型: java.lang.String
     * 描述: 设备激活码
     * 示例: ACT-789012
     */
    activationCode?: string;
    /**
     * clientDeviceId字段
     * Java类型: java.lang.String
     * 描述: 客户端设备唯一标识
     * 示例: device-123456
     */
    clientDeviceId?: string;
    /**
     * capabilities字段
     * Java类型: java.lang.String
     * 描述: 设备支持的能力列表（逗号分隔）
     * 示例: temperature,sensor,wifi
     */
    capabilities?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotThingParam
 * 描述: IoT Thing Value Object
 */
export interface IotThingParam extends BaseParam {
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingType
     */
    type?: ThingType;
    /**
     * manufacturer字段
     * Java类型: java.lang.String
     */
    manufacturer?: string;
    /**
     * serialNumber字段
     * Java类型: java.lang.String
     */
    serialNumber?: string;
    /**
     * metadata字段
     * Java类型: java.lang.String
     */
    metadata?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * location字段
     * Java类型: java.lang.String
     */
    location?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     */
    model?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.LocalDateTime
     */
    updatedAt?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingStatus
     */
    status?: ThingStatus;
    /**
     * createdAt字段
     * Java类型: java.time.LocalDateTime
     */
    createdAt?: string;
    /**
     * protocol字段
     * Java类型: com.sdkwork.ai.iot.entity.enums.IotTransportProtocolType
     */
    protocol?: IotTransportProtocolType;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotThingResponse
 * 描述: IoT Thing Value Object
 */
export interface IotThingResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier
     */
    uuid?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp
     */
    updatedAt?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Thing ID
     */
    id?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotDeviceResponse
 * 描述: IoT设备值对象
 */
export interface IotDeviceResponse extends BaseResponse {
    /**
     * capabilities字段
     * Java类型: java.lang.String
     * 描述: 设备能力（逗号分隔列表）
     */
    capabilities?: string;
    /**
     * connectStatus字段
     * Java类型: com.sdkwork.ai.iot.thing.ConnectStatus
     * 描述: 连接状态
     */
    connectStatus?: ConnectStatus;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * clientDeviceId字段
     * Java类型: java.lang.String
     * 描述: 客户端设备ID
     */
    clientDeviceId?: string;
    /**
     * isOTASupported字段
     * Java类型: java.lang.Boolean
     * 描述: 是否支持OTA升级
     */
    isOTASupported?: boolean;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 设备ID
     */
    id?: string|number;
    /**
     * activationCode字段
     * Java类型: java.lang.String
     * 描述: 激活码
     */
    activationCode?: string;
    /**
     * networkConfig字段
     * Java类型: com.sdkwork.ai.iot.thing.NetworkConfig
     * 描述: 网络配置（JSON格式）
     */
    networkConfig?: NetworkConfig;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符
     */
    uuid?: string;
}
