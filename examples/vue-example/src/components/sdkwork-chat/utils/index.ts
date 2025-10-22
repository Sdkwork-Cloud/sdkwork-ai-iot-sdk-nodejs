// 工具函数导出

/**
 * 格式化时间显示
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - timestamp

  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * 获取文件类型图标
 */
export const getFileIcon = (fileName: string, fileType?: string): string => {
  const name = fileName.toLowerCase()
  
  if (fileType?.includes('pdf')) return '📄'
  if (fileType?.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return '📝'
  if (fileType?.includes('excel') || name.endsWith('.xls') || name.endsWith('.xlsx')) return '📊'
  if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦'
  if (fileType?.includes('image')) return '🖼️'
  if (fileType?.includes('audio')) return '🎵'
  if (fileType?.includes('video')) return '🎬'
  return '📎'
}

/**
 * 验证文件类型和大小
 */
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): boolean => {
  // 验证文件大小
  if (file.size > maxSize * 1024 * 1024) {
    return false
  }
  
  // 验证文件类型
  if (allowedTypes.length === 0) return true
  
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const category = type.split('/')[0]
      return file.type.startsWith(category + '/')
    }
    return file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase())
  })
}

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: any
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}