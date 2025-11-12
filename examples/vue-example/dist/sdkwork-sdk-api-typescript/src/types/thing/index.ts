import { TransportType, IotTransportProtocolType } from '../../enums/enums';
import { ThingType, ThingStatus, ConnectStatus } from '../../enums/com.sdkwork.ai.iot.thing';
import { IotProvider } from '../../enums/com.sdkwork.ai.iot.provider';
import { ChannelProviderEnum } from '../../enums/core.type';
import { AiToolType, AuthType, HttpMethod } from '../../enums/tool';
import { MemoryProfileType } from '../../enums/memory';
import { BaseParam } from '../../types/base';
import { NetworkConfig, IotThingMetadata } from '../../types/com.sdkwork.ai.iot.thing';
import { BaseResponse } from '../../types/base';
import { SpeechConfig } from '../../types/audio';
import { Attributes } from '../../types/product';
import { FirmwareInfo } from '../../types/com.sdkwork.ai.iot.thing.ota';
import { GeoPoint } from '../../types/data.pojo.entity';
import { ClientDeviceInfo } from '../../types/com.sdkwork.ai.iot.thing.client';
import { IotToolConfig } from '../../types/com.sdkwork.ai.iot.tool';
import { AgentMemoryConfig } from '../../types/agent.config';
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
     * provider字段
     * Java类型: com.sdkwork.ai.iot.provider.IotProvider
     * 描述: Provider
     */
    provider?: IotProvider;
    /**
     * lastConnectionTime字段
     * Java类型: java.time.Instant
     * 描述: Last connection time
     */
    lastConnectionTime?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * speechConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechConfig
     * 描述: Speech configuration
     */
    speechConfig?: SpeechConfig;
    /**
     * protocol字段
     * Java类型: com.sdkwork.ai.iot.entity.enums.IotTransportProtocolType
     * 描述: Core communication protocol used by the thing
     */
    protocol?: IotTransportProtocolType;
    /**
     * operatorId字段
     * Java类型: java.lang.Long
     * 描述: Operator ID
     */
    operatorId?: string|number;
    /**
     * voiceSpeakerId字段
     * Java类型: java.lang.Long
     * 描述: Voice speaker ID
     */
    voiceSpeakerId?: string|number;
    /**
     * firmwareVersion字段
     * Java类型: java.lang.String
     * 描述: Current firmware version
     */
    firmwareVersion?: string;
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
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: Base attributes
     */
    baseAttributes?: Attributes;
    /**
     * hardwareVersion字段
     * Java类型: java.lang.String
     * 描述: Hardware version
     */
    hardwareVersion?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Model of the thing
     */
    model?: string;
    /**
     * firmwareInfo字段
     * Java类型: com.sdkwork.ai.iot.thing.ota.FirmwareInfo
     * 描述: Firmware information
     */
    firmwareInfo?: FirmwareInfo;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID
     */
    agentId?: string|number;
    /**
     * metadata字段
     * Java类型: com.sdkwork.ai.iot.thing.IotThingMetadata
     * 描述: Metadata in JSON format for extended properties
     */
    metadata?: IotThingMetadata;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier
     */
    uuid?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingType
     * 描述: Type/category of the thing
     */
    type?: ThingType;
    /**
     * manufacturer字段
     * Java类型: java.lang.String
     * 描述: Manufacturer of the device
     */
    manufacturer?: string;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: Specification attributes
     */
    specAttributes?: Attributes;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Description of the thing
     */
    description?: string;
    /**
     * macAddress字段
     * Java类型: java.lang.String
     * 描述: MAC address of the device
     */
    macAddress?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingStatus
     * 描述: Current status of the thing
     */
    status?: ThingStatus;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Category ID
     */
    categoryId?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Human-readable name of the thing
     */
    name?: string;
    /**
     * deviceUserId字段
     * Java类型: java.lang.Long
     * 描述: Device user ID
     */
    deviceUserId?: string|number;
    /**
     * location字段
     * Java类型: com.sdkwork.spring.ai.plus.data.pojo.entity.GeoPoint
     * 描述: Geographic location
     */
    location?: GeoPoint;
    /**
     * clientDeviceInfo字段
     * Java类型: com.sdkwork.ai.iot.thing.client.ClientDeviceInfo
     * 描述: Client device information
     */
    clientDeviceInfo?: ClientDeviceInfo;
    /**
     * isOTASupported字段
     * Java类型: java.lang.Boolean
     * 描述: Whether OTA update is supported
     */
    isOTASupported?: boolean;
    /**
     * toolConfig字段
     * Java类型: com.sdkwork.ai.iot.tool.IotToolConfig
     * 描述: Tool configuration
     */
    toolConfig?: IotToolConfig;
    /**
     * serialNumber字段
     * Java类型: java.lang.String
     * 描述: Serial number
     */
    serialNumber?: string;
    /**
     * connectStatus字段
     * Java类型: com.sdkwork.ai.iot.thing.ConnectStatus
     * 描述: Detailed connection status of the device
     */
    connectStatus?: ConnectStatus;
    /**
     * clientId字段
     * Java类型: java.lang.String
     * 描述: Client ID of the device
     */
    clientId?: string;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: Last active time
     */
    lastActiveTime?: string;
    /**
     * activateTime字段
     * Java类型: java.time.Instant
     * 描述: Activation time
     */
    activateTime?: string;
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: IP address of the device
     */
    ipAddress?: string;
    /**
     * memoryConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentMemoryConfig
     * 描述: Memory configuration
     */
    memoryConfig?: AgentMemoryConfig;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotDeviceActivateResponse
 * 描述: IoT设备激活响应VO
 */
export interface IotDeviceActivateResponse extends BaseResponse {
    /**
     * activateTime字段
     * Java类型: java.time.Instant
     * 描述: 激活时间
     */
    activateTime?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 设备名称
     */
    name?: string;
    /**
     * deviceId字段
     * Java类型: java.lang.Long
     * 描述: 设备ID
     */
    deviceId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingStatus
     * 描述: 激活状态
     */
    status?: ThingStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotDeviceResponse
 * 描述: IoT Device Value Object
 */
export interface IotDeviceResponse extends BaseResponse {
    /**
     * macAddress字段
     * Java类型: java.lang.String
     * 描述: MAC address of the device
     */
    macAddress?: string;
    /**
     * activationCode字段
     * Java类型: java.lang.String
     * 描述: Activation code
     */
    activationCode?: string;
    /**
     * location字段
     * Java类型: com.sdkwork.spring.ai.plus.data.pojo.entity.GeoPoint
     * 描述: Geographic location
     */
    location?: GeoPoint;
    /**
     * clientDeviceInfo字段
     * Java类型: com.sdkwork.ai.iot.thing.client.ClientDeviceInfo
     * 描述: Client device information
     */
    clientDeviceInfo?: ClientDeviceInfo;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Human-readable name of the device
     */
    name?: string;
    /**
     * deviceUserId字段
     * Java类型: java.lang.Long
     * 描述: Device user ID
     */
    deviceUserId?: string|number;
    /**
     * status字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingStatus
     * 描述: Current status of the device
     */
    status?: ThingStatus;
    /**
     * categoryId字段
     * Java类型: java.lang.Long
     * 描述: Category ID
     */
    categoryId?: string|number;
    /**
     * capabilities字段
     * Java类型: java.lang.String
     * 描述: Device capabilities (comma-separated list)
     */
    capabilities?: string;
    /**
     * connectStatus字段
     * Java类型: com.sdkwork.ai.iot.thing.ConnectStatus
     * 描述: Connection status
     */
    connectStatus?: ConnectStatus;
    /**
     * serialNumber字段
     * Java类型: java.lang.String
     * 描述: Serial number
     */
    serialNumber?: string;
    /**
     * clientId字段
     * Java类型: java.lang.String
     * 描述: Client ID of the device
     */
    clientId?: string;
    /**
     * lastActiveTime字段
     * Java类型: java.time.Instant
     * 描述: Last active time
     */
    lastActiveTime?: string;
    /**
     * toolConfig字段
     * Java类型: com.sdkwork.ai.iot.tool.IotToolConfig
     * 描述: Tool configuration
     */
    toolConfig?: IotToolConfig;
    /**
     * isOTASupported字段
     * Java类型: java.lang.Boolean
     * 描述: Whether OTA update is supported
     */
    isOTASupported?: boolean;
    /**
     * activateTime字段
     * Java类型: java.time.Instant
     * 描述: Activation time
     */
    activateTime?: string;
    /**
     * networkConfig字段
     * Java类型: com.sdkwork.ai.iot.thing.NetworkConfig
     * 描述: Network protocol configuration
     */
    networkConfig?: NetworkConfig;
    /**
     * ipAddress字段
     * Java类型: java.lang.String
     * 描述: IP address of the device
     */
    ipAddress?: string;
    /**
     * memoryConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.agent.config.AgentMemoryConfig
     * 描述: Memory configuration
     */
    memoryConfig?: AgentMemoryConfig;
    /**
     * protocol字段
     * Java类型: com.sdkwork.ai.iot.entity.enums.IotTransportProtocolType
     * 描述: Core communication protocol used by the device
     */
    protocol?: IotTransportProtocolType;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * speechConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.audio.SpeechConfig
     * 描述: Speech configuration
     */
    speechConfig?: SpeechConfig;
    /**
     * clientDeviceId字段
     * Java类型: java.lang.String
     * 描述: Client device ID
     */
    clientDeviceId?: string;
    /**
     * lastConnectionTime字段
     * Java类型: java.time.Instant
     * 描述: Last connection time
     */
    lastConnectionTime?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.ai.iot.provider.IotProvider
     * 描述: Provider
     */
    provider?: IotProvider;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Device ID
     */
    id?: string|number;
    /**
     * baseAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: Base attributes
     */
    baseAttributes?: Attributes;
    /**
     * hardwareVersion字段
     * Java类型: java.lang.String
     * 描述: Hardware version
     */
    hardwareVersion?: string;
    /**
     * model字段
     * Java类型: java.lang.String
     * 描述: Model of the device
     */
    model?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp
     */
    updatedAt?: string;
    /**
     * operatorId字段
     * Java类型: java.lang.Long
     * 描述: Operator ID
     */
    operatorId?: string|number;
    /**
     * voiceSpeakerId字段
     * Java类型: java.lang.Long
     * 描述: Voice speaker ID
     */
    voiceSpeakerId?: string|number;
    /**
     * firmwareVersion字段
     * Java类型: java.lang.String
     * 描述: Current firmware version
     */
    firmwareVersion?: string;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: Agent ID
     */
    agentId?: string|number;
    /**
     * metadata字段
     * Java类型: com.sdkwork.ai.iot.thing.IotThingMetadata
     * 描述: Metadata in JSON format for extended properties
     */
    metadata?: IotThingMetadata;
    /**
     * firmwareInfo字段
     * Java类型: com.sdkwork.ai.iot.thing.ota.FirmwareInfo
     * 描述: Firmware information
     */
    firmwareInfo?: FirmwareInfo;
    /**
     * specAttributes字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.product.Attributes
     * 描述: Specification attributes
     */
    specAttributes?: Attributes;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Description of the device
     */
    description?: string;
    /**
     * manufacturer字段
     * Java类型: java.lang.String
     * 描述: Manufacturer of the device
     */
    manufacturer?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: Universally unique identifier
     */
    uuid?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.ai.iot.thing.ThingType
     * 描述: Type/category of the device
     */
    type?: ThingType;
}
