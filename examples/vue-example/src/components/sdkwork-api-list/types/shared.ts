/**
 * SDKWork API 组件统一类型定义
 */

import { CategoryVO } from '@/services'
import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 基础组件属性接口
 */
export interface BaseApiComponentProps<T = any> {
    /** API请求方法（与service互斥，优先使用service） */
    api?: (params: Record<string, any>, pageableParams?: Pageable) => Promise<Page<T>>
    /** CRUD服务实例（与api互斥，优先使用service） */
    service?: CURDService<any, any, any>
    /** 查询参数（业务查询条件） */
    params?: Record<string, any>
    /** 分页排序参数（Spring Boot标准分页排序参数） */
    pageableParams?: Pageable
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
    /** 顶部间距，支持CSS单位（如px, rem, vh等） */
    topSpacing?: string | number
    /** 左侧间距，支持CSS单位（如px, rem, vh等） */
    leftSpacing?: string | number
    /** 右侧间距，支持CSS单位（如px, rem, vh等） */
    rightSpacing?: string | number
}

/**
 * 基础组件事件接口
 */
export interface BaseApiComponentEmits<T = any> {
    /** 项选择事件 */
    (e: 'select', item: T): void
    /** 项删除事件 */
    (e: 'delete', item: T): void
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
    (e: 'load', pageData: Page<T> | any): void
}

/**
 * 基础组件插槽接口
 */
export interface BaseApiComponentSlots<T = any> {
    /** 默认插槽 - 自定义项内容，作用域参数为 { item, index, selected } */
    default(props: { item: T; index: number; selected: boolean }): any
    /** 头部插槽 - 顶部区域 */
    header?: () => any
    /** 底部插槽 - 底部区域 */
    footer?: () => any
    /** 顶部悬浮插槽 - 悬浮在顶部 */
    'sticky-header'?: () => any
    /** 底部悬浮插槽 - 悬浮在底部 */
    'sticky-footer'?: () => any
    /** 空状态插槽 - 接收 empty 参数 */
    empty?: (props: { empty: boolean }) => any
    /** 加载状态插槽 - 接收 loading 参数 */
    loading?: (props: { loading: boolean }) => any
}

/**
 * 基础组件实例方法接口
 */
export interface BaseApiComponentInstance<T = any> {
    /** 刷新数据 */
    refresh(): void
    /** 加载更多数据 */
    loadMore(): void
    /** 获取当前数据 */
    getData(): T[]
    /** 获取选中项 */
    getSelectedItems(): T[]
    /** 清空选中项 */
    clearSelected(): void
    /** 设置选中项 */
    setSelectedItems(items: T[]): void
}

/**
 * 列表组件特定属性
 */
export interface ListSpecificProps {
    /** 是否显示底部边框 */
    showBorderBottom?: boolean
    /** 底部边框距离左边的偏移量（像素） */
    borderBottomLeftOffset?: number
    /** 是否显示"没有更多数据了"的提示 */
    showNoMoreData?: boolean
    /** 主题模式 */
    themeMode?: 'dark' | 'light' | 'auto'
    
    /** vue-virt-list 虚拟滚动参数 */
    /** 最小尺寸，会根据这个尺寸来计算可视区域内个数 */
    minSize?: number
    /** 元素之间的间距 (元素尺寸包含itemGap) */
    itemGap?: number
    /** 是否为固定高度，可以提升性能 */
    fixed?: boolean
    /** 当渲染量大，滚动白屏严重时，可以给定数值，bufferTop 和 bufferBottom 会等于 buffer */
    buffer?: number
    /** 顶部 buffer 个数 */
    bufferTop?: number
    /** 底部 buffer 个数 */
    bufferBottom?: number
    /** 是否水平滚动 */
    horizontal?: boolean
    /** 滚动阈值（提前触发toTop或toBottom）单位：px */
    scrollDistance?: number
    /** 是否需要修复滚动丢失selection问题(仅vue2下需要和生效) */
    fixSelection?: boolean
    /** 起始渲染下标 */
    start?: number
    /** 起始渲染顶部高度 */
    offset?: number
    /** 列表容器样式 */
    listStyle?: string | Array<string | { [key: string]: any }> | { [key: string]: any }
    /** 列表容器类名 */
    listClass?: string | Array<string> | { [key: string]: boolean }
    /** item容器样式 */
    itemStyle?: string | Array<string | { [key: string]: any }> | { [key: string]: any }
    /** item容器类名 */
    itemClass?: string | Array<string> | { [key: string]: boolean }
    /** 渲染控制器 */
    renderControl?: (begin: number, end: number) => { begin: number; end: number }
}

/**
 * 网格组件特定属性
 */
export interface GridSpecificProps {
    /** 网格列数 */
    columns?: number
    /** 网格间距 */
    gap?: number
}

/**
 * 分类组件特定属性
 */
export interface CategorySpecificProps extends ListSpecificProps {
    /** 分类数据类型 */
    categorys?: CategoryVO[]
    /** 分类数据API方法 */
    categoryApi?: () => Promise<CategoryVO[]>
    /** 分类项唯一键字段名 */
    categoryKey?: string
    /** 分类项名称字段名 */
    categoryNameField?: string
    /** 分类项数量字段名 */
    categoryCountField?: string
    /** 默认选中的分类ID */
    defaultCategoryId?: string | number
    /** 选择模式 */
    selectionMode?: 'single' | 'multiple'
}

/**
 * Tab组件特定属性
 */
export interface TabSpecificProps extends ListSpecificProps {
    /** Tabs数据数组 */
    tabs?: TabItem[]
    /** Tabs API方法 */
    tabsApi?: () => Promise<TabItem[]>
    /** Tabs是否粘性定位 */
    tabsSticky?: boolean
    /** Tabs是否支持滑动切换 */
    tabsSwipeable?: boolean
    /** 默认激活的Tab */
    defaultActiveTab?: string | number
}
 
/**
 * Tab项数据类型
 */
export interface TabItem {
    value: string | number
    title: string
    params?: Record<string, any>
    [key: string]: any
}

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG = {
    // 基础配置
    selectable: false,
    deletable: false,
    searchable: false,
    pageSize: 10,
    itemKey: 'id',
    itemTitleField: 'name',
    itemDescriptionField: 'description',

    // 列表配置
    showBorderBottom: true,
    borderBottomLeftOffset: 0,
    showNoMoreData: false,
    themeMode: 'auto',

    // vue-virt-list 虚拟滚动配置
    minSize: 92,
    itemGap: 0,
    fixed: true,
    buffer: 5,
    bufferTop: undefined,
    bufferBottom: undefined,
    horizontal: false,
    scrollDistance: 200,
    fixSelection: false,
    start: 0,
    offset: 0,
    listStyle: '',
    listClass: '',
    itemStyle: '',
    itemClass: '',
    renderControl: undefined,

    // 网格配置
    columns: 2,
    gap: 16,

    // 分类配置
    categoryKey: 'id',
    categoryNameField: 'name',
    categoryCountField: 'count',
    selectionMode: 'single',

    // Tab配置
    tabsSticky: true,
    tabsSwipeable: true,

    // 间距配置
    topSpacing: '6px',
    leftSpacing: '8px',
    rightSpacing: '8px'
} as const

/**
 * 工具类型
 */
export type SpacingStyle = {
    'padding-top': string
    'padding-left': string
    'padding-right': string
}

/**
 * 构建间距样式函数
 */
export const buildSpacingStyle = (
    topSpacing?: string | number,
    leftSpacing?: string | number,
    rightSpacing?: string | number
): SpacingStyle => {
    const top = topSpacing ?? DEFAULT_CONFIG.topSpacing
    const left = leftSpacing ?? DEFAULT_CONFIG.leftSpacing
    const right = rightSpacing ?? DEFAULT_CONFIG.rightSpacing

    return {
        'padding-top': typeof top === 'number' ? `${top}px` : top,
        'padding-left': typeof left === 'number' ? `${left}px` : left,
        'padding-right': typeof right === 'number' ? `${right}px` : right
    }
}