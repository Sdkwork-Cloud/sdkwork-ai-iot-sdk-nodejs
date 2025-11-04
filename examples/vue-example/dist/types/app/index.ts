import { ProjectType } from '../../enums/code.objects';
import { OAuthProvider, ChannelProviderEnum, ResourceFunctionType } from '../../enums/core.type';
import { MediaResourceType } from '../../enums/resource';
import { AudioFormat } from '../../enums/audio';
import { CommonStatus, Platform } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { AppConfig } from '../../types/config';
import { MediaResourceList, ImageMediaResource } from '../../types/resource';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppParam
 * 描述: 应用信息表单
 */
export interface AppParam extends BaseParam {
    /**
     * appType字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.PlusProjectType
     * 描述: 应用类型
     * 示例: APP_HTML
     */
    appType?: ProjectType;
    /**
     * storeUrl字段
     * Java类型: java.lang.String
     * 描述: 应用商店URL
     * 示例: https://play.google.com/store/apps/details?id=com.example.myapp
     */
    storeUrl?: string;
    /**
     * projectId字段
     * Java类型: java.lang.Long
     * 描述: 项目ID
     * 示例: 1001
     */
    projectId?: string|number;
    /**
     * config字段
     * Java类型: com.sdkwork.spring.ai.plus.config.AppConfig
     * 描述: 应用配置
     */
    config?: AppConfig;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 应用资源列表
     */
    resourceList?: MediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 应用状态
     * 示例: ACTIVE
     */
    status?: CommonStatus;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 应用名称
     * 示例: My AI Assistant
     */
    name?: string;
    /**
     * iconUrl字段
     * Java类型: java.lang.String
     * 描述: 应用图标URL
     * 示例: https://example.com/icon.png
     */
    iconUrl?: string;
    /**
     * packageName字段
     * Java类型: java.lang.String
     * 描述: 应用包名
     * 示例: com.example.myapp
     */
    packageName?: string;
    /**
     * accessUrl字段
     * Java类型: java.lang.String
     * 描述: 应用访问URL
     * 示例: https://app.example.com
     */
    accessUrl?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 应用版本
     * 示例: 1.0.0
     */
    version?: string;
    /**
     * platforms字段
     * Java类型: java.util.Set
     * 描述: 支持平台
     */
    platforms?: Array<Platform>;
    /**
     * icon字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 应用图标
     */
    icon?: ImageMediaResource;
    /**
     * bundleId字段
     * Java类型: java.lang.String
     * 描述: 应用Bundle ID
     * 示例: com.example.myapp.ios
     */
    bundleId?: string;
    /**
     * downloadUrl字段
     * Java类型: java.lang.String
     * 描述: 应用下载URL
     * 示例: https://example.com/download/myapp.apk
     */
    downloadUrl?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 应用描述
     * 示例: 用于客户服务的AI助手应用
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CreateJsapiSignatureParam
 * 描述: 创建JSAPI签名表单
 */
export interface CreateJsapiSignatureParam extends BaseParam {
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: URL地址
     * 示例: https://example.com
     */
    url?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MiniProgramSdkConfigResponse
 * 描述: 微信小程序SDK配置
 */
export interface MiniProgramSdkConfigResponse {
    /**
     * jsApiList字段
     * Java类型: java.util.List
     * 描述: 需要使用的JS接口列表
     */
    jsApiList?: Array<string>;
    /**
     * signature字段
     * Java类型: java.lang.String
     * 描述: 签名
     * 示例: 5c458d24077921c053034514221a42a93a1c6d7e
     */
    signature?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     * 描述: 小程序的AppID
     * 示例: wx8888888888888888
     */
    appId?: string;
    /**
     * nonceStr字段
     * Java类型: java.lang.String
     * 描述: 生成签名的随机串
     * 示例: Wm3WZYTPz0wzccnW
     */
    nonceStr?: string;
    /**
     * timestamp字段
     * Java类型: java.lang.Long
     * 描述: 生成签名的时间戳
     * 示例: 1634567890
     */
    timestamp?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppResponse
 * 描述: Application Value Object
 */
export interface AppResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Application ID
     */
    id?: string|number;
    /**
     * iconUrl字段
     * Java类型: java.lang.String
     * 描述: Application icon URL
     * 示例: https://example.com/icon.png
     */
    iconUrl?: string;
    /**
     * packageName字段
     * Java类型: java.lang.String
     * 描述: Application package name
     * 示例: com.example.myapp
     */
    packageName?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Application name
     * 示例: My AI Assistant
     */
    name?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: Last update timestamp
     */
    updatedAt?: string;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: Application resource list
     */
    resourceList?: MediaResourceList;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: Application status
     * 示例: ACTIVE
     */
    status?: CommonStatus;
    /**
     * projectId字段
     * Java类型: java.lang.Long
     * 描述: Project ID
     * 示例: 1001
     */
    projectId?: string|number;
    /**
     * config字段
     * Java类型: com.sdkwork.spring.ai.plus.config.AppConfig
     * 描述: Application configuration
     */
    config?: AppConfig;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: Creation timestamp
     */
    createdAt?: string;
    /**
     * storeUrl字段
     * Java类型: java.lang.String
     * 描述: Application store URL
     * 示例: https://play.google.com/store/apps/details?id=com.example.myapp
     */
    storeUrl?: string;
    /**
     * appType字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.PlusProjectType
     * 描述: Application type
     * 示例: APP_HTML
     */
    appType?: ProjectType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Application description
     * 示例: An AI assistant application for customer service
     */
    description?: string;
    /**
     * icon字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: Application icon
     */
    icon?: ImageMediaResource;
    /**
     * bundleId字段
     * Java类型: java.lang.String
     * 描述: Application bundle ID
     * 示例: com.example.myapp.ios
     */
    bundleId?: string;
    /**
     * downloadUrl字段
     * Java类型: java.lang.String
     * 描述: Application download URL
     * 示例: https://example.com/download/myapp.apk
     */
    downloadUrl?: string;
    /**
     * platforms字段
     * Java类型: java.util.Set
     * 描述: Supported platforms
     */
    platforms?: Array<Platform>;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: Application version
     * 示例: 1.0.0
     */
    version?: string;
    /**
     * accessUrl字段
     * Java类型: java.lang.String
     * 描述: Application access URL
     * 示例: https://app.example.com
     */
    accessUrl?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OfficialAccountSdkConfigResponse
 * 描述: 微信公众号JS-SDK配置
 */
export interface OfficialAccountSdkConfigResponse {
    /**
     * signature字段
     * Java类型: java.lang.String
     * 描述: 签名
     * 示例: 5c458d24077921c053034514221a42a93a1c6d7e
     */
    signature?: string;
    /**
     * appId字段
     * Java类型: java.lang.String
     * 描述: 服务号的唯一标识
     * 示例: wx8888888888888888
     */
    appId?: string;
    /**
     * debug字段
     * Java类型: java.lang.Boolean
     * 描述: 开启调试模式
     * 示例: false
     */
    debug?: boolean;
    /**
     * jsApiList字段
     * Java类型: java.util.List
     * 描述: 需要使用的JS接口列表
     */
    jsApiList?: Array<string>;
    /**
     * timestamp字段
     * Java类型: java.lang.String
     * 描述: 生成签名的时间戳
     * 示例: 1634567890
     */
    timestamp?: string;
    /**
     * nonceStr字段
     * Java类型: java.lang.String
     * 描述: 生成签名的随机串
     * 示例: Wm3WZYTPz0wzccnW
     */
    nonceStr?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppSdkConfigResponse
 * 描述: App SDK配置
 */
export interface AppSdkConfigResponse extends BaseResponse {
    /**
     * platform字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatform
     * 描述: 平台
     */
    platform?: Platform;
    /**
     * officialAccount字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.app.OfficialAccountSdkConfigVO
     * 描述: 微信公众号配置
     */
    officialAccount?: OfficialAccountSdkConfigResponse;
    /**
     * miniProgram字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.app.MiniProgramSdkConfigVO
     * 描述: 微信小程序配置
     */
    miniProgram?: MiniProgramSdkConfigResponse;
    /**
     * app字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.app.MobileAppSdkConfigVO
     * 描述: 应用配置
     */
    app?: MobileAppSdkConfigResponse;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MobileAppSdkConfigResponse
 * 描述: 移动应用SDK配置
 */
export interface MobileAppSdkConfigResponse {
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 应用版本
     * 示例: 1.0.0
     */
    version?: string;
    /**
     * pushToken字段
     * Java类型: java.lang.String
     * 描述: 推送令牌
     * 示例: device-push-token
     */
    pushToken?: string;
    /**
     * appKey字段
     * Java类型: java.lang.String
     * 描述: 应用密钥
     * 示例: your-app-key
     */
    appKey?: string;
    /**
     * packageName字段
     * Java类型: java.lang.String
     * 描述: 应用包名
     * 示例: com.example.app
     */
    packageName?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AppInfoResponse
 * 描述: 应用信息视图对象
 */
export interface AppInfoResponse extends BaseResponse {
    /**
     * appType字段
     * Java类型: com.sdkwork.spring.ai.plus.code.objects.PlusProjectType
     * 描述: 应用类型
     * 示例: APP_HTML
     */
    appType?: ProjectType;
    /**
     * storeUrl字段
     * Java类型: java.lang.String
     * 描述: 应用商店URL
     * 示例: https://play.google.com/store/apps/details?id=com.example.myapp
     */
    storeUrl?: string;
    /**
     * environment字段
     * Java类型: java.lang.String
     * 描述: 运行环境
     * 示例: production
     */
    environment?: string;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 更新时间
     */
    updatedAt?: string;
    /**
     * resourceList字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.MediaResourceList
     * 描述: 应用资源列表
     */
    resourceList?: MediaResourceList;
    /**
     * status字段
     * Java类型: java.lang.String
     * 描述: 应用状态
     * 示例: ACTIVE
     */
    status?: string;
    /**
     * projectId字段
     * Java类型: java.lang.Long
     * 描述: 项目ID
     * 示例: 1001
     */
    projectId?: string|number;
    /**
     * startTime字段
     * Java类型: java.time.Instant
     * 描述: 启动时间
     */
    startTime?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 应用ID
     * 示例: 1001
     */
    id?: string|number;
    /**
     * iconUrl字段
     * Java类型: java.lang.String
     * 描述: 应用图标URL
     * 示例: https://example.com/icon.png
     */
    iconUrl?: string;
    /**
     * packageName字段
     * Java类型: java.lang.String
     * 描述: 应用包名
     * 示例: com.example.myapp
     */
    packageName?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 应用名称
     * 示例: My AI Assistant
     */
    name?: string;
    /**
     * accessUrl字段
     * Java类型: java.lang.String
     * 描述: 应用访问URL
     * 示例: https://app.example.com
     */
    accessUrl?: string;
    /**
     * buildTime字段
     * Java类型: java.time.Instant
     * 描述: 构建时间
     */
    buildTime?: string;
    /**
     * platforms字段
     * Java类型: java.util.Set
     * 描述: 支持的平台
     */
    platforms?: Array<Platform>;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 应用版本
     * 示例: 1.0.0
     */
    version?: string;
    /**
     * icon字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 应用图标
     */
    icon?: ImageMediaResource;
    /**
     * bundleId字段
     * Java类型: java.lang.String
     * 描述: 应用Bundle ID
     * 示例: com.example.myapp.ios
     */
    bundleId?: string;
    /**
     * downloadUrl字段
     * Java类型: java.lang.String
     * 描述: 应用下载URL
     * 示例: https://example.com/download/myapp.apk
     */
    downloadUrl?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 应用描述
     * 示例: An AI assistant application for customer service
     */
    description?: string;
}
