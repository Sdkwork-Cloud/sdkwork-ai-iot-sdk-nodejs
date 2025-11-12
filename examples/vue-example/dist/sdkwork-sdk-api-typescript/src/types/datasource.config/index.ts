/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DatasourceConfig
 */
export interface DatasourceConfig {
    /**
     * port字段
     * Java类型: java.lang.Integer
     */
    port?: number;
    /**
     * database字段
     * Java类型: java.lang.String
     */
    database?: string;
    /**
     * password字段
     * Java类型: java.lang.String
     */
    password?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * type字段
     * Java类型: java.lang.String
     */
    type?: string;
    /**
     * params字段
     * Java类型: java.lang.String
     */
    params?: string;
    /**
     * poolConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.datasource.config.PoolConfig
     */
    poolConfig?: PoolConfig;
    /**
     * host字段
     * Java类型: java.lang.String
     */
    host?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PoolConfig
 */
export interface PoolConfig {
    /**
     * autoCommit字段
     * Java类型: java.lang.Boolean
     */
    autoCommit?: boolean;
    /**
     * maxPoolSize字段
     * Java类型: java.lang.Integer
     */
    maxPoolSize?: number;
    /**
     * connectionTimeout字段
     * Java类型: java.lang.Long
     */
    connectionTimeout?: string|number;
    /**
     * maxLifetime字段
     * Java类型: java.lang.Long
     */
    maxLifetime?: string|number;
    /**
     * poolName字段
     * Java类型: java.lang.String
     */
    poolName?: string;
    /**
     * idleTimeout字段
     * Java类型: java.lang.Long
     */
    idleTimeout?: string|number;
    /**
     * connectionTestQuery字段
     * Java类型: java.lang.String
     */
    connectionTestQuery?: string;
    /**
     * minIdle字段
     * Java类型: java.lang.Integer
     */
    minIdle?: number;
}
