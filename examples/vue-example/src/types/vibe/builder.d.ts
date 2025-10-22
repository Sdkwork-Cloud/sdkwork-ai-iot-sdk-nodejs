/**
 * Vibe Builder 类型定义
 * 遵循技术规范，统一管理类型定义
 */

export interface SiteNode {
  id?: string
  label: string
  children?: SiteNode[]
  type: 'FILE' | 'DIRECTORY'
  path?: string
  content?: string
  extension?: string
  parent?: SiteNode | null
}

export interface FileInfo {
  path: string
  content: string
  type: string
}

export interface Template {
  id: number | string
  name: string
  description: string
  thumbnail: string
  tags: string[]
  category: string
  pro?: boolean
  updatedAt: string
  downloads: number
  difficulty?: string
  estimatedTime?: string
}