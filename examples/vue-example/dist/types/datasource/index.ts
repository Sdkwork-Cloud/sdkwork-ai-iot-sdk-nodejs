import { DatasourceStatus, DatasourceType } from '../../enums/datasource';
import { BaseParam } from '../../types/base';
import { DatasourceConfig } from '../../types/datasource.config';
import { TagsContent } from '../../types/tags';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ColumnParam
 * 描述: 数据库列定义Form
 */
export interface ColumnParam extends BaseParam {
    /**
     * ordinalPosition字段
     * Java类型: java.lang.Integer
     * 描述: 列在表中的位置顺序
     */
    ordinalPosition?: number;
    /**
     * isPrimaryKey字段
     * Java类型: java.lang.Boolean
     * 描述: 是否主键
     */
    isPrimaryKey?: boolean;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 列描述
     */
    description?: string;
    /**
     * collationRule字段
     * Java类型: java.lang.String
     * 描述: 排序规则
     */
    collationRule?: string;
    /**
     * dataType字段
     * Java类型: java.lang.String
     * 描述: 数据类型(VARCHAR, INT等)
     */
    dataType?: string;
    /**
     * defaultValue字段
     * Java类型: java.lang.String
     * 描述: 默认值
     */
    defaultValue?: string;
    /**
     * characterSet字段
     * Java类型: java.lang.String
     * 描述: 字符集
     */
    characterSet?: string;
    /**
     * comment字段
     * Java类型: java.lang.String
     * 描述: 列注释
     */
    comment?: string;
    /**
     * tableId字段
     * Java类型: java.lang.Long
     * 描述: 所属表ID
     */
    tableId?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 列名称
     */
    name?: string;
    /**
     * isNullable字段
     * Java类型: java.lang.Boolean
     * 描述: 是否允许为空
     */
    isNullable?: boolean;
    /**
     * columnType字段
     * Java类型: java.lang.String
     * 描述: 列类型(包含长度等信息，如VARCHAR(255))
     */
    columnType?: string;
    /**
     * isAutoIncrement字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自增
     */
    isAutoIncrement?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SchemaParam
 * 描述: 数据库Schema定义Form
 */
export interface SchemaParam extends BaseParam {
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 状态(0-禁用,1-启用)
     */
    status?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Schema描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Schema名称
     */
    name?: string;
    /**
     * datasourceId字段
     * Java类型: java.lang.Long
     * 描述: 所属数据源ID
     */
    datasourceId?: string|number;
    /**
     * tableCount字段
     * Java类型: java.lang.Integer
     * 描述: 表数量
     */
    tableCount?: number;
    /**
     * lastSyncTime字段
     * Java类型: java.time.Instant
     * 描述: 最后同步时间
     */
    lastSyncTime?: string;
    /**
     * isDefault字段
     * Java类型: java.lang.Boolean
     * 描述: 是否默认Schema
     */
    isDefault?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TableParam
 * 描述: 数据库表定义Form
 */
export interface TableParam extends BaseParam {
    /**
     * engine字段
     * Java类型: java.lang.String
     * 描述: 存储引擎(如InnoDB, MyISAM等)
     */
    engine?: string;
    /**
     * lastSyncTime字段
     * Java类型: java.time.Instant
     * 描述: 最后同步时间
     */
    lastSyncTime?: string;
    /**
     * primaryKeys字段
     * Java类型: java.lang.String
     * 描述: 主键列(逗号分隔)
     */
    primaryKeys?: string;
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 表类型(TABLE, VIEW等)
     */
    type?: string;
    /**
     * comment字段
     * Java类型: java.lang.String
     * 描述: 表注释
     */
    comment?: string;
    /**
     * columnCount字段
     * Java类型: java.lang.Integer
     * 描述: 列数量
     */
    columnCount?: number;
    /**
     * rowCount字段
     * Java类型: java.lang.Long
     * 描述: 行数量估计
     */
    rowCount?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 表名称
     */
    name?: string;
    /**
     * createSql字段
     * Java类型: java.lang.String
     * 描述: 创建表的SQL语句
     */
    createSql?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 表描述
     */
    description?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DatasourceParam
 * 描述: 数据源信息Form
 */
export interface DatasourceParam extends BaseParam {
    /**
     * securityLevel字段
     * Java类型: java.lang.Integer
     * 描述: 安全级别(0-低,1-中,2-高)
     */
    securityLevel?: number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.datasource.DatasourceStatus
     * 描述: 数据源状态(ACTIVE:活跃,INACTIVE:未激活,ERROR:错误)
     */
    status?: DatasourceStatus;
    /**
     * connectionTimeout字段
     * Java类型: java.lang.Integer
     * 描述: 连接超时时间(秒)
     */
    connectionTimeout?: number;
    /**
     * connectionConfig字段
     * Java类型: com.sdkwork.spring.ai.plus.entity.datasource.config.DatasourceConfig
     * 描述: 连接配置信息(JSON格式)
     */
    connectionConfig?: DatasourceConfig;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 数据源名称
     */
    name?: string;
    /**
     * dbVersion字段
     * Java类型: java.lang.String
     * 描述: 数据库版本
     */
    dbVersion?: string;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: UI显示颜色(HEX)
     */
    color?: string;
    /**
     * accessCount字段
     * Java类型: java.lang.Long
     * 描述: 访问计数
     */
    accessCount?: string|number;
    /**
     * owner字段
     * Java类型: java.lang.String
     * 描述: 数据源创建者/所有者
     */
    owner?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签(逗号分隔)
     */
    tags?: TagsContent;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 数据源URL
     */
    url?: string;
    /**
     * lastConnectedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后成功连接时间
     */
    lastConnectedAt?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.datasource.DatasourceType
     * 描述: 数据源类型(如MySQL, PostgreSQL, MongoDB等)
     */
    type?: DatasourceType;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 数据源描述
     */
    description?: string;
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: UI显示图标
     */
    icon?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ColumnResponse
 * 描述: 数据库列定义VO
 */
export interface ColumnResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: ID
     */
    id?: string|number;
    /**
     * comment字段
     * Java类型: java.lang.String
     * 描述: 列注释
     */
    comment?: string;
    /**
     * tableId字段
     * Java类型: java.lang.Long
     * 描述: 所属表ID
     */
    tableId?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 列名称
     */
    name?: string;
    /**
     * isNullable字段
     * Java类型: java.lang.Boolean
     * 描述: 是否允许为空
     */
    isNullable?: boolean;
    /**
     * columnType字段
     * Java类型: java.lang.String
     * 描述: 列类型(包含长度等信息)
     */
    columnType?: string;
    /**
     * isAutoIncrement字段
     * Java类型: java.lang.Boolean
     * 描述: 是否自增
     */
    isAutoIncrement?: boolean;
    /**
     * ordinalPosition字段
     * Java类型: java.lang.Integer
     * 描述: 列在表中的位置顺序
     */
    ordinalPosition?: number;
    /**
     * isPrimaryKey字段
     * Java类型: java.lang.Boolean
     * 描述: 是否主键
     */
    isPrimaryKey?: boolean;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 列描述
     */
    description?: string;
    /**
     * collationRule字段
     * Java类型: java.lang.String
     * 描述: 排序规则
     */
    collationRule?: string;
    /**
     * dataType字段
     * Java类型: java.lang.String
     * 描述: 数据类型(VARCHAR, INT等)
     */
    dataType?: string;
    /**
     * defaultValue字段
     * Java类型: java.lang.String
     * 描述: 默认值
     */
    defaultValue?: string;
    /**
     * characterSet字段
     * Java类型: java.lang.String
     * 描述: 字符集
     */
    characterSet?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SchemaResponse
 * 描述: 数据库Schema定义VO
 */
export interface SchemaResponse extends BaseResponse {
    /**
     * lastSyncTime字段
     * Java类型: java.time.Instant
     * 描述: 最后同步时间
     */
    lastSyncTime?: string;
    /**
     * isDefault字段
     * Java类型: java.lang.Boolean
     * 描述: 是否默认Schema
     */
    isDefault?: boolean;
    /**
     * tableCount字段
     * Java类型: java.lang.Integer
     * 描述: 表数量
     */
    tableCount?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: Schema描述
     */
    description?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: Schema名称
     */
    name?: string;
    /**
     * datasourceId字段
     * Java类型: java.lang.Long
     * 描述: 所属数据源ID
     */
    datasourceId?: string|number;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: Schema ID
     */
    id?: string|number;
    /**
     * tableIds字段
     * Java类型: java.util.List
     * 描述: 表ID列表
     */
    tableIds?: Array<string|number>;
    /**
     * status字段
     * Java类型: java.lang.Integer
     * 描述: 状态(0-禁用,1-启用)
     */
    status?: number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: DatasourceResponse
 * 描述: 数据源信息VO
 */
export interface DatasourceResponse extends BaseResponse {
    /**
     * securityLevel字段
     * Java类型: java.lang.Integer
     * 描述: 安全级别(0-低,1-中,2-高)
     */
    securityLevel?: number;
    /**
     * schemaIds字段
     * Java类型: java.util.List
     * 描述: 关联Schema ID列表
     */
    schemaIds?: Array<string|number>;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 数据源名称
     */
    name?: string;
    /**
     * connectionConfig字段
     * Java类型: java.lang.Object
     * 描述: 连接配置信息(JSON格式)
     */
    connectionConfig?: Object;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 数据源ID
     */
    id?: string|number;
    /**
     * connectionTimeout字段
     * Java类型: java.lang.Integer
     * 描述: 连接超时时间(秒)
     */
    connectionTimeout?: number;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.datasource.DatasourceStatus
     * 描述: 数据源状态(ACTIVE:活跃,INACTIVE:未激活,ERROR:错误)
     */
    status?: DatasourceStatus;
    /**
     * owner字段
     * Java类型: java.lang.String
     * 描述: 数据源创建者/所有者
     */
    owner?: string;
    /**
     * accessCount字段
     * Java类型: java.lang.Long
     * 描述: 访问计数
     */
    accessCount?: string|number;
    /**
     * color字段
     * Java类型: java.lang.String
     * 描述: UI显示颜色(HEX)
     */
    color?: string;
    /**
     * dbVersion字段
     * Java类型: java.lang.String
     * 描述: 数据库版本
     */
    dbVersion?: string;
    /**
     * icon字段
     * Java类型: java.lang.String
     * 描述: UI显示图标
     */
    icon?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 数据源描述
     */
    description?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.datasource.DatasourceType
     * 描述: 数据源类型(如MySQL, PostgreSQL, MongoDB等)
     */
    type?: DatasourceType;
    /**
     * url字段
     * Java类型: java.lang.String
     * 描述: 数据源URL
     */
    url?: string;
    /**
     * lastConnectedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后成功连接时间
     */
    lastConnectedAt?: string;
    /**
     * tags字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.tags.TagsContent
     * 描述: 标签(逗号分隔)
     */
    tags?: TagsContent;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TableResponse
 * 描述: 数据库表定义VO
 */
export interface TableResponse extends BaseResponse {
    /**
     * columnCount字段
     * Java类型: java.lang.Integer
     * 描述: 列数量
     */
    columnCount?: number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 表描述
     */
    description?: string;
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 表类型(TABLE, VIEW等)
     */
    type?: string;
    /**
     * schemaName字段
     * Java类型: java.lang.String
     * 描述: 所属Schema名称
     */
    schemaName?: string;
    /**
     * lastSyncTime字段
     * Java类型: java.time.Instant
     * 描述: 最后同步时间
     */
    lastSyncTime?: string;
    /**
     * columns字段
     * Java类型: java.util.List
     * 描述: 表列集合
     */
    columns?: Array<ColumnResponse>;
    /**
     * comment字段
     * Java类型: java.lang.String
     * 描述: 表注释
     */
    comment?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 表ID
     */
    id?: string|number;
    /**
     * rowCount字段
     * Java类型: java.lang.Long
     * 描述: 行数量估计
     */
    rowCount?: string|number;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 表名称
     */
    name?: string;
    /**
     * createSql字段
     * Java类型: java.lang.String
     * 描述: 创建表的SQL语句
     */
    createSql?: string;
    /**
     * primaryKeys字段
     * Java类型: java.lang.String
     * 描述: 主键列(逗号分隔)
     */
    primaryKeys?: string;
    /**
     * schemaId字段
     * Java类型: java.lang.Long
     * 描述: 所属SchemaID
     */
    schemaId?: string|number;
    /**
     * engine字段
     * Java类型: java.lang.String
     * 描述: 存储引擎(如InnoDB, MyISAM等)
     */
    engine?: string;
}
