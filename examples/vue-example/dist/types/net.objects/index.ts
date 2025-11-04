import { DnsServerType } from '../../enums/net.enums';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DnsServers
 */
export interface DnsServers {
    /**
     * servers字段
     * Java类型: java.util.List
     */
    servers?: Array<DnsServer>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DnsServer
 */
export interface DnsServer {
    /**
     * port字段
     * Java类型: java.lang.Integer
     */
    port?: number;
    /**
     * address字段
     * Java类型: java.lang.String
     */
    address?: string;
    /**
     * enabled字段
     * Java类型: java.lang.Boolean
     */
    enabled?: boolean;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.net.enums.DnsServerType
     */
    type?: DnsServerType;
    /**
     * priority字段
     * Java类型: java.lang.Integer
     */
    priority?: number;
}
