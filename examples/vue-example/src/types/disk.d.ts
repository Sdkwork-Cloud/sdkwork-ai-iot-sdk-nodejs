// 网盘组件类型定义
export namespace Disk {
  export interface FileItem {
    id: string
    name: string
    type: 'file' | 'folder'
    size?: number
    modified: Date
    icon: string
    category: string
    path: string
  }

  export interface Category {
    id: string
    name: string
    icon: string
    count: number
    parentId?: string
    level?: number
    children?: Category[]
    expanded?: boolean
  }

  export interface FileDetailItem {
    id: string
    name: string
    size: number
    type: 'file' | 'folder'
    modifiedTime: Date
    createdTime: Date
    path?: string
    shared?: boolean
    extension?: string
  }

  export interface ToolbarProps {
    selectedCount: number
    viewMode?: ViewMode
    fileCount?: number
    sort?: SortType
  }

  export interface SidebarProps {
    title?: string
    defaultCategory?: string
  }

  export interface FileListProps {
    files: FileItem[]
    loading: boolean
    viewMode: ViewMode
    selectedFiles?: FileItem[]
    isCreatingFolder?: boolean
  }

  export interface FileDetailProps {
    visible: boolean
    file?: any
  }

  export interface UploadFile {
    id: string
    file: File
    name: string
    size: number
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'error'
    error?: string
  }
}