// 通用类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  registerTime: string
}

// 设备相关类型
export interface Device {
  id: string
  name: string
  description: string
  status: 'online' | 'offline'
  type: string
  lastSeen: string
}

export interface DeviceCreateData {
  name: string
  description: string
  type: string
}

// 认证相关类型
export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}