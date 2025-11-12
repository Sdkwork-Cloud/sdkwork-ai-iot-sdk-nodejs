import { DomainStatus, DnsServerType, ResolutionStatus, DnsRecordType } from '../../enums/net.enums';
import { BaseParam } from '../../types/base';
import { DnsServers } from '../../types/net.objects';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: HostDomainParam
 * 描述: 域名管理Form，用于域名信息的提交与校验
 */
export interface HostDomainParam extends BaseParam {
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * registeredAt字段
     * Java类型: java.time.Instant
     * 描述: 注册时间
     */
    registeredAt?: string;
    /**
     * autoRenew字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自动续费
     */
    autoRenew?: boolean;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.DomainStatus
     * 描述: 域名状态
     */
    status?: DomainStatus;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 所属用户ID
     */
    ownerId?: string|number;
    /**
     * dnsServers字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.objects.DnsServers
     * 描述: DNS服务器列表（JSON格式）
     * 示例: {"servers": ["8.8.8.8", "8.8.4.4"]}
     */
    dnsServers?: DnsServers;
    /**
     * tld字段
     * Java类型: java.lang.String
     * 描述: 顶级域名（例如：com、cn、net）
     */
    tld?: string;
    /**
     * expiredAt字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expiredAt?: string;
    /**
     * domainName字段
     * Java类型: java.lang.String
     * 描述: 域名（例如：example.com）
     */
    domainName?: string;
    /**
     * registrar字段
     * Java类型: java.lang.String
     * 描述: 域名注册商
     */
    registrar?: string;
    /**
     * resolutionStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.ResolutionStatus
     * 描述: 解析状态
     */
    resolutionStatus?: ResolutionStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DnsRecordParam
 * 描述: DNS解析记录Form
 */
export interface DnsRecordParam extends BaseParam {
    /**
     * recordValue字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.DnsRecordValue
     * 描述: 记录值（如IP地址、别名等）
     */
    recordValue?: DnsRecordValue;
    /**
     * domainId字段
     * Java类型: java.lang.Long
     * 描述: 关联的域名ID
     */
    domainId?: string|number;
    /**
     * fileContent字段
     * Java类型: java.lang.String
     * 描述: 文件内容（用于域名验证文件内容）
     */
    fileContent?: string;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 记录状态（启用/禁用）
     */
    enabled?: boolean;
    /**
     * ttl字段
     * Java类型: java.lang.Integer
     * 描述: TTL（生存时间，单位秒）
     */
    ttl?: number;
    /**
     * priority字段
     * Java类型: java.lang.Integer
     * 描述: 优先级（用于MX记录等）
     */
    priority?: number;
    /**
     * recordName字段
     * Java类型: java.lang.String
     * 描述: 记录名称（如 www, @, ftp 等）
     */
    recordName?: string;
    /**
     * recordType字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.DnsRecordType
     * 描述: DNS记录类型（A, AAAA, CNAME, MX, TXT等）
     */
    recordType?: DnsRecordType;
    /**
     * fileName字段
     * Java类型: java.lang.String
     * 描述: 文件名（用于域名验证文件等场景）
     */
    fileName?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DnsRecordValue
 */
export interface DnsRecordValue {
    /**
     * values字段
     * Java类型: java.util.List
     */
    values?: Array<string>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: HostDomainResponse
 * 描述: 域名管理VO
 */
export interface HostDomainResponse extends BaseResponse {
    /**
     * remark字段
     * Java类型: java.lang.String
     * 描述: 备注信息
     */
    remark?: string;
    /**
     * registeredAt字段
     * Java类型: java.time.Instant
     * 描述: 注册时间
     */
    registeredAt?: string;
    /**
     * ownerId字段
     * Java类型: java.lang.Long
     * 描述: 所属用户ID
     */
    ownerId?: string|number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * tld字段
     * Java类型: java.lang.String
     * 描述: 顶级域名（例如：com, cn, net）
     */
    tld?: string;
    /**
     * dnsRecords字段
     * Java类型: java.util.List
     * 描述: 关联的DNS解析记录列表
     */
    dnsRecords?: Array<DnsRecordResponse>;
    /**
     * registrar字段
     * Java类型: java.lang.String
     * 描述: 注册商
     */
    registrar?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * autoRenew字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自动续费
     */
    autoRenew?: boolean;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.DomainStatus
     * 描述: 域名状态（ACTIVE-正常, EXPIRED-过期, PENDING- pending, SUSPENDED- suspended 等）
     */
    status?: DomainStatus;
    /**
     * dnsServers字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.objects.DnsServers
     * 描述: DNS服务器列表
     */
    dnsServers?: DnsServers;
    /**
     * expiredAt字段
     * Java类型: java.time.Instant
     * 描述: 过期时间
     */
    expiredAt?: string;
    /**
     * domainName字段
     * Java类型: java.lang.String
     * 描述: 域名（例如：example.com）
     */
    domainName?: string;
    /**
     * resolutionStatus字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.ResolutionStatus
     * 描述: 解析状态（NORMAL-正常 / ABnormal-异常）
     */
    resolutionStatus?: ResolutionStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DnsRecordResponse
 * 描述: DNS解析记录VO
 */
export interface DnsRecordResponse extends BaseResponse {
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 记录创建时间
     */
    createdAt?: string;
    /**
     * recordName字段
     * Java类型: java.lang.String
     * 描述: 记录名称（如 www, @, ftp 等）
     */
    recordName?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID，由数据库自动生成
     */
    id?: string|number;
    /**
     * fileContent字段
     * Java类型: java.lang.String
     * 描述: 文件内容（用于域名验证文件内容）
     */
    fileContent?: string;
    /**
     * recordValue字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.DnsRecordValue
     * 描述: 记录值（如IP地址、别名等）
     */
    recordValue?: DnsRecordValue;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 记录更新时间
     */
    updatedAt?: string;
    /**
     * fileName字段
     * Java类型: java.lang.String
     * 描述: 文件名（用于域名验证文件等场景）
     */
    fileName?: string;
    /**
     * recordType字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.DnsRecordType
     * 描述: DNS记录类型（A, AAAA, CNAME, MX, TXT等）
     */
    recordType?: DnsRecordType;
    /**
     * domainId字段
     * Java类型: java.lang.Long
     * 描述: 关联的域名ID
     */
    domainId?: string|number;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     * 描述: 记录状态（启用/禁用）
     */
    enabled?: boolean;
    /**
     * priority字段
     * Java类型: java.lang.Integer
     * 描述: 优先级（用于MX记录等）
     */
    priority?: number;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * ttl字段
     * Java类型: java.lang.Integer
     * 描述: TTL（生存时间，单位秒）
     */
    ttl?: number;
}
