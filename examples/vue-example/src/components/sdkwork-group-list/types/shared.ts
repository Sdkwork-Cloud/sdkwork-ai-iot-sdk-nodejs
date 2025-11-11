/**
 * SDKWork 群组组件统一类型定义
 */

import type { Group } from './group'

/**
 * 基础群组组件属性接口
 */
export interface BaseGroupComponentProps {
    /** API请求方法（与service互斥，优先使用service） */
    api?: (params: Record<string, any>, pageableParams?: any) => Promise<any>
    /** CRUD服务实例（与api互斥，优先使用service） */
    service?: any
    /** 查询参数（业务查询条件） */
    params?: Record<string, any>
    /** 分页排序参数 */
    pageableParams?: Record<string, any>
    /** 是否支持项选择 */
    selectable?: boolean
    /** 是否支持项删除 */
    deletable?: boolean
    /** 是否支持搜索 */
    searchable?: boolean
    /** 每页显示条数 */
    pageSize?: number
    /** 项唯一键字段名 */
    itemKey?: string
    /** 项标题字段名 */
    itemTitleField?: string
    /** 项描述字段名 */
    itemDescriptionField?: string
    /** 主题模式 */
    themeMode?: 'light' | 'dark' | 'auto'
    /** 是否显示底部边框 */
    showBorderBottom?: boolean
    /** 底部边框左侧偏移 */
    borderBottomLeftOffset?: number
    /** 是否显示没有更多数据提示 */
    showNoMoreData?: boolean
    /** 顶部间距，支持CSS单位（如px, rem, vh等） */
    topSpacing?: string | number
    /** 左侧间距，支持CSS单位（如px, rem, vh等） */
    leftSpacing?: string | number
    /** 右侧间距，支持CSS单位（如px, rem, vh等） */
    rightSpacing?: string | number
}

/**
 * 群组列表特有属性接口
 */
export interface GroupListSpecificProps {
    /** 是否显示筛选功能 */
    showFilter?: boolean
    /** 是否显示排序功能 */
    showSort?: boolean
    /** 是否显示加入按钮 */
    showJoinButton?: boolean
}

/**
 * 基础群组组件事件接口
 */
export interface BaseGroupComponentEmits {
    /** 项选择事件 */
    (e: 'select', item: Group): void
    /** 项删除事件 */
    (e: 'delete', item: Group): void
    /** 搜索事件 */
    (e: 'search', keyword: string): void
    /** 触顶事件 */
    (e: 'reach-top'): void
    /** 触底事件 */
    (e: 'reach-bottom'): void
    /** 滚动事件 */
    (e: 'scroll', event: Event): void
    /** 项尺寸变化事件 */
    (e: 'item-resize', data: { id: string, newSize: number }): void
    /** 可视区范围变更事件 */
    (e: 'range-update', data: { inViewBegin: number, inViewEnd: number }): void
    /** 数据加载完成事件 */
    (e: 'load', data: any): void
    /** 筛选事件 */
    (e: 'filter', value: string): void
    /** 排序事件 */
    (e: 'sort', value: string): void
    /** 群组点击事件 */
    (e: 'group-click', group: Group): void
    /** 加入群组事件 */
    (e: 'join', group: Group): void
}

/**
 * 基础群组组件插槽接口
 */
export interface BaseGroupComponentSlots {
    /** 默认插槽 - 自定义项内容，作用域参数为 { item, index, selected } */
    default(props: { item: Group; index: number; selected: boolean }): any
    /** 头部插槽 - 顶部区域 */
    header?: () => any
    /** 底部插槽 - 底部区域 */
    footer?: () => any
    /** 空状态插槽 - 接收 empty 参数 */
    empty?: (props: { empty: boolean }) => any
}

/**
 * 默认群组配置
 */
export const DEFAULT_GROUP_CONFIG = {
    /** 是否支持项选择 */
    selectable: false,
    /** 是否支持项删除 */
    deletable: false,
    /** 是否支持搜索 */
    searchable: true,
    /** 每页显示条数 */
    pageSize: 20,
    /** 项唯一键字段名 */
    itemKey: 'id',
    /** 项标题字段名 */
    itemTitleField: 'name',
    /** 项描述字段名 */
    itemDescriptionField: 'description',
    /** 主题模式 */
    themeMode: 'auto',
    /** 是否显示底部边框 */
    showBorderBottom: true,
    /** 底部边框左侧偏移 */
    borderBottomLeftOffset: 0,
    /** 是否显示没有更多数据提示 */
    showNoMoreData: true,
    /** 顶部间距 */
    topSpacing: 0,
    /** 左侧间距 */
    leftSpacing: 0,
    /** 右侧间距 */
    rightSpacing: 0,
    /** 是否显示筛选功能 */
    showFilter: true,
    /** 是否显示排序功能 */
    showSort: true,
    /** 是否显示加入按钮 */
    showJoinButton: true,
}