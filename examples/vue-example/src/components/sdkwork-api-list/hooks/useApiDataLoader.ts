import { ref, computed, watch, type Ref } from 'vue'
import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript'

// Spring Boot 标准分页排序参数
const SPRING_PAGEABLE_PARAMS = ['page', 'size', 'sort']

// 数据加载器配置接口
export interface ApiDataLoaderConfig {
  /** API请求方法（与service互斥，优先使用service） */
  api?: (params: Record<string, any>, pageableParams?: Pageable) => Promise<Page<any>>
  /** CRUD服务实例（与api互斥，优先使用service） */
  service?: CURDService<any, any, any>
  /** 查询参数（业务查询条件） */
  params?: Record<string, any>
  /** 分页排序参数（Spring Boot标准分页排序参数） */
  pageableParams?: Pageable
  /** 每页显示条数 */
  pageSize?: number
  /** 是否启用自动加载 */
  autoLoad?: boolean
  /** 列表项唯一键字段名 */
  itemKey?: string
}

// 数据加载器返回接口
export interface ApiDataLoaderReturn {
  // 响应式数据
  dataList: Ref<any[]>
  currentPage: Ref<number>
  totalElements: Ref<number>
  totalPages: Ref<number>
  loading: Ref<boolean>
  loadingMore: Ref<boolean>
  hasMore: Ref<boolean>

  // 计算属性
  isEmpty: Ref<boolean>
  isFirstLoad: Ref<boolean>

  // 方法
  loadData: (page?: number, isLoadMore?: boolean) => Promise<void>
  onRefresh: () => Promise<void>
  validateProps: () => void
  buildRequestParams: (page: number) => { pageableParams: Pageable; queryParams: Record<string, any> }
  handleRequest: (page: number) => Promise<Page<any>>
}

/**
 * 分离分页排序参数和查询参数
 */
const separatePageableParams = (params: Record<string, any> = {}) => {
  const pageableParams: Pageable | any = {}
  const queryParams: Record<string, any> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (SPRING_PAGEABLE_PARAMS.includes(key)) {
      pageableParams[key] = value
    } else {
      queryParams[key] = value
    }
  })

  return { pageableParams, queryParams }
}

/**
 * 通用数据加载器hooks
 */
export function useApiDataLoader(config: ApiDataLoaderConfig): ApiDataLoaderReturn {
  // 响应式数据
  const dataList = ref<any[]>([])
  const currentPage = ref(0)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(true)

  // 计算属性
  const isEmpty = computed(() => !loading.value && dataList.value.length === 0)
  const isFirstLoad = computed(() => currentPage.value === 0 && dataList.value.length === 0)

  /**
   * 验证属性配置
   */
  const validateProps = (): boolean => {
    if (!config.api && !config.service) {
      console.warn('组件必须传入api或service属性之一')
      return false
    }
    if (config.api && config.service) {
      console.warn('组件同时传入了api和service属性，将优先使用service')
    }
    return true
  }

  /**
   * 构建请求参数
   */
  const buildRequestParams = (page: number = 0): { pageableParams: Pageable; queryParams: Record<string, any> } => {
    const { pageableParams: paramsPageable, queryParams: paramsQuery } = separatePageableParams(config.params)

    // 设置基础分页参数
    const basePageableParams: Pageable = {
      size: config.pageSize || 10,
      ...paramsPageable,
      ...config.pageableParams,
      page,
      pageNumber: page
    }
    paramsQuery.page = page
    const result = { pageableParams: basePageableParams, queryParams: paramsQuery }
    console.error('buildRequestParams=============', result)
    return result
  }

  /**
   * 统一请求处理
   */
  const handleRequest = async (page: number = 0): Promise<Page<any>> => {
    const { pageableParams, queryParams } = buildRequestParams(page)

    // 优先使用service
    if (config.service && typeof config.service.listByPage === 'function') {
      return await config.service.listByPage(queryParams, pageableParams)
    }

    // 使用api方法（分离参数）
    if (config.api) {
      return await config.api(queryParams, pageableParams)
    }

    throw new Error('组件没有可用的请求方法')
  }

  /**
   * 加载数据
   */
  const loadData = async (page: number = 0, isLoadMore: boolean = false) => {
    // 防止重复请求：如果已经在加载中，直接返回
    if (loading.value || (isLoadMore && loadingMore.value)) {
      return
    }

    // 如果是加载更多且没有更多数据，直接返回
    if (isLoadMore && !hasMore.value) {
      return
    }

    // 验证属性配置
    if (!validateProps()) {
      // 验证失败，直接返回，但确保加载状态为false
      loading.value = false
      loadingMore.value = false
      return
    }

    try {
      // 设置加载状态
      if (isLoadMore) {
        loadingMore.value = true
      } else {
        loading.value = true
      }

      const response = await handleRequest(page)

      // 处理响应数据
      if (page === 0) {
        dataList.value = response.content || []
      } else {
        // 加载更多时，需要去重处理，避免重复数据
        const existingIds = new Set(dataList.value.map(item => item.id || item[config.itemKey || 'id']))
        const newItems = (response.content || []).filter(item => {
          const itemId = item.id || item[config.itemKey || 'id']
          return !existingIds.has(itemId)
        })
        dataList.value = [...dataList.value, ...newItems]
        
        // 如果过滤后有数据被移除，打印警告
        if (newItems.length !== (response.content || []).length) {
          console.warn('检测到重复数据，已过滤重复项')
        }
      }
      const pageable: Pageable = response.pageable || {}

      currentPage.value = pageable.pageNumber || 0
      totalElements.value = response.total || 0

      // 计算总页数：totalPages = Math.ceil(totalElements / pageSize)
      const pageSize = pageable.pageSize || config.pageSize || 10
      totalPages.value = pageSize > 0 ? Math.ceil(totalElements.value / pageSize) : 0

      hasMore.value = !response.last
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      // 重置加载状态
      loading.value = false
      loadingMore.value = false
    }
  }

  /**
   * 刷新数据
   */
  const onRefresh = async () => {
    loading.value = true
    try {
      console.error('刷新数据=============', loading.value)
      await loadData(0)
      loading.value = false
    } catch (error) {
      console.error('刷新数据失败:', error)
      // 确保加载状态被重置
      loading.value = false
    }
  }

  // 监听参数变化
  watch(() => config.params, () => {
    if (config.autoLoad !== false) {
      loadData(0)
    }
  }, { deep: true })

  // 监听页面大小变化
  watch(() => config.pageSize, () => {
    if (config.autoLoad !== false) {
      loadData(0)
    }
  })

  // 自动加载
  if (config.autoLoad !== false) {
    loadData(0)
  }

  return {
    // 响应式数据
    dataList,
    currentPage,
    totalElements,
    totalPages,
    loading,
    loadingMore,
    hasMore,

    // 计算属性
    isEmpty,
    isFirstLoad,

    // 方法
    loadData,
    onRefresh,
    validateProps,
    buildRequestParams,
    handleRequest
  }
}