import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DeviceDescriptor
 */
export interface DeviceDescriptor extends BaseObject {
    /**
     * properties字段
     * Java类型: java.util.Map
     */
    properties?: Map<string, IotProperty>;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * methods字段
     * Java类型: java.util.Map
     */
    methods?: Map<string, IotMethod>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ClientDeviceInfo
 */
export interface ClientDeviceInfo extends BaseObject {
    /**
     * descriptors字段
     * Java类型: java.util.List
     */
    descriptors?: Array<DeviceDescriptor>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotMethod
 */
export interface IotMethod extends BaseObject {
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * parameters字段
     * Java类型: java.util.Map
     */
    parameters?: Map<string, IotMethodParameter>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotMethodParameter
 */
export interface IotMethodParameter extends BaseObject {
    /**
     * type字段
     * Java类型: java.lang.String
     */
    type?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: IotProperty
 */
export interface IotProperty extends BaseObject {
    /**
     * description字段
     * Java类型: java.lang.String
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
    /**
     * value字段
     * Java类型: java.lang.Object
     */
    value?: Object;
    /**
     * type字段
     * Java类型: java.lang.String
     */
    type?: string;
}
