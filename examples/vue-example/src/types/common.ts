export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[]
    total: number
    page: number
    pageSize: number
  }
}

export type Theme = 'light' | 'dark'
export type Language = 'zh' | 'en' 