/**
 * 文件选择工具类 - 实现类似小程序的接口
 * 提供统一的文件选择API，支持图片、视频、音频、文件和多媒体选择
 */

import { useFileDialog } from '@vueuse/core'
import { watch } from 'vue'

export interface ChooseFileOptions {
  /** 最多可以选择的文件个数 */
  count?: number
  /** 文件类型 */
  type?: 'image' | 'video' | 'audio' | 'file'
  /** 所选的文件的临时文件路径列表 */
  tempFilePaths?: string[]
  /** 回调函数，成功则返回选择的临时文件路径列表 */
  success?: (res: { tempFilePaths: string[]; tempFiles: File[] }) => void
  /** 回调函数，失败则返回错误信息 */
  fail?: (error: any) => void
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: () => void
}

export interface ChooseImageOptions extends Omit<ChooseFileOptions, 'type'> {
  /** 图片类型 */
  sizeType?: ('original' | 'compressed')[]
  /** 图片类型 */
  sourceType?: ('album' | 'camera')[]
}

export interface ChooseVideoOptions extends Omit<ChooseFileOptions, 'type'> {
  /** 视频来源 */
  sourceType?: ('album' | 'camera')[]
  /** 是否压缩所选的视频源文件 */
  compressed?: boolean
  /** 拍摄视频最长拍摄时间，单位秒 */
  maxDuration?: number
  /** 默认拉起的是前置或者后置摄像头 */
  camera?: 'front' | 'back'
}

export interface ChooseMediaOptions extends Omit<ChooseFileOptions, 'type'> {
  /** 文件类型 */
  mediaType?: ('image' | 'video')[]
  /** 图片和视频选择的来源 */
  sourceType?: ('album' | 'camera')[]
  /** 是否压缩所选文件 */
  compressed?: boolean
  /** 拍摄视频最长拍摄时间，单位秒 */
  maxDuration?: number
  /** 仅对 mediaType 为 image 时有效，是否显示拍照界面 */
  camera?: 'front' | 'back'
  /** 最大可选文件数 */
  maxCount?: number
}

class FileChooser {
  /**
   * 选择图片
   */
  async chooseImage(options: ChooseImageOptions = {}): Promise<{ tempFilePaths: string[]; tempFiles: File[] }> {
    const { count = 9, sizeType, sourceType, success, fail, complete } = options
    
    try {
      const { files, open } = useFileDialog({
        accept: 'image/*',
        multiple: count > 1
      })
      
      open()
      
      return new Promise((resolve, reject) => {
        const unwatch = watch(files, (selectedFiles) => {
          if (selectedFiles && selectedFiles.length > 0) {
            const tempFiles = Array.from(selectedFiles)
            const tempFilePaths = tempFiles.map(file => URL.createObjectURL(file))
            
            const result = { tempFilePaths, tempFiles }
            
            // 调用成功回调
            success?.(result)
            resolve(result)
            
            // 清理监听
            unwatch()
            complete?.()
          }
        }, { once: true })
        
        // 设置超时处理
        setTimeout(() => {
          const error = new Error('选择图片超时')
          fail?.(error)
          reject(error)
          complete?.()
        }, 30000) // 30秒超时
      })
    } catch (error) {
      fail?.(error)
      complete?.()
      throw error
    }
  }

  /**
   * 选择视频
   */
  async chooseVideo(options: ChooseVideoOptions = {}): Promise<{ tempFilePaths: string[]; tempFiles: File[] }> {
    const { count = 1, sourceType, compressed, maxDuration, camera, success, fail, complete } = options
    
    try {
      const { files, open } = useFileDialog({
        accept: 'video/*',
        multiple: count > 1
      })
      
      open()
      
      return new Promise((resolve, reject) => {
        const unwatch = watch(files, (selectedFiles) => {
          if (selectedFiles && selectedFiles.length > 0) {
            const tempFiles = Array.from(selectedFiles)
            const tempFilePaths = tempFiles.map(file => URL.createObjectURL(file))
            
            const result = { tempFilePaths, tempFiles }
            
            // 调用成功回调
            success?.(result)
            resolve(result)
            
            // 清理监听
            unwatch()
            complete?.()
          }
        }, { once: true })
        
        // 设置超时处理
        setTimeout(() => {
          const error = new Error('选择视频超时')
          fail?.(error)
          reject(error)
          complete?.()
        }, 30000)
      })
    } catch (error) {
      fail?.(error)
      complete?.()
      throw error
    }
  }

  /**
   * 选择音频
   */
  async chooseAudio(options: ChooseFileOptions = {}): Promise<{ tempFilePaths: string[]; tempFiles: File[] }> {
    const { count = 1, success, fail, complete } = options
    
    try {
      const { files, open } = useFileDialog({
        accept: 'audio/*',
        multiple: count > 1
      })
      
      open()
      
      return new Promise((resolve, reject) => {
        const unwatch = watch(files, (selectedFiles) => {
          if (selectedFiles && selectedFiles.length > 0) {
            const tempFiles = Array.from(selectedFiles)
            const tempFilePaths = tempFiles.map(file => URL.createObjectURL(file))
            
            const result = { tempFilePaths, tempFiles }
            
            // 调用成功回调
            success?.(result)
            resolve(result)
            
            // 清理监听
            unwatch()
            complete?.()
          }
        }, { once: true })
        
        // 设置超时处理
        setTimeout(() => {
          const error = new Error('选择音频超时')
          fail?.(error)
          reject(error)
          complete?.()
        }, 30000)
      })
    } catch (error) {
      fail?.(error)
      complete?.()
      throw error
    }
  }

  /**
   * 选择文件
   */
  async chooseFile(options: ChooseFileOptions = {}): Promise<{ tempFilePaths: string[]; tempFiles: File[] }> {
    const { count = 1, success, fail, complete } = options
    
    try {
      const { files, open } = useFileDialog({
        accept: '*/*',
        multiple: count > 1
      })
      
      open()
      
      return new Promise((resolve, reject) => {
        const unwatch = watch(files, (selectedFiles) => {
          if (selectedFiles && selectedFiles.length > 0) {
            const tempFiles = Array.from(selectedFiles)
            const tempFilePaths = tempFiles.map(file => URL.createObjectURL(file))
            
            const result = { tempFilePaths, tempFiles }
            
            // 调用成功回调
            success?.(result)
            resolve(result)
            
            // 清理监听
            unwatch()
            complete?.()
          }
        }, { once: true })
        
        // 设置超时处理
        setTimeout(() => {
          const error = new Error('选择文件超时')
          fail?.(error)
          reject(error)
          complete?.()
        }, 30000)
      })
    } catch (error) {
      fail?.(error)
      complete?.()
      throw error
    }
  }

  /**
   * 选择多媒体（图片和视频）
   */
  async chooseMedia(options: ChooseMediaOptions = {}): Promise<{ tempFilePaths: string[]; tempFiles: File[] }> {
    const { count = 9, mediaType = ['image', 'video'], sourceType, compressed, maxDuration, camera, maxCount, success, fail, complete } = options
    
    try {
      const accept = mediaType.map(type => {
        switch (type) {
          case 'image': return 'image/*'
          case 'video': return 'video/*'
          default: return '*/*'
        }
      }).join(',')
      
      const { files, open } = useFileDialog({
        accept,
        multiple: count > 1
      })
      
      open()
      
      return new Promise((resolve, reject) => {
        const unwatch = watch(files, (selectedFiles) => {
          if (selectedFiles && selectedFiles.length > 0) {
            const tempFiles = Array.from(selectedFiles)
            const tempFilePaths = tempFiles.map(file => URL.createObjectURL(file))
            
            const result = { tempFilePaths, tempFiles }
            
            // 调用成功回调
            success?.(result)
            resolve(result)
            
            // 清理监听
            unwatch()
            complete?.()
          }
        }, { once: true })
        
        // 设置超时处理
        setTimeout(() => {
          const error = new Error('选择多媒体超时')
          fail?.(error)
          reject(error)
          complete?.()
        }, 30000)
      })
    } catch (error) {
      fail?.(error)
      complete?.()
      throw error
    }
  }

  /**
   * 预览图片
   */
  previewImage(options: {
    /** 需要预览的图片链接列表 */
    urls: string[]
    /** 当前显示图片的链接 */
    current?: string
    /** 接口调用成功的回调函数 */
    success?: () => void
    /** 接口调用失败的回调函数 */
    fail?: (error: any) => void
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: () => void
  }) {
    try {
      // 这里可以实现图片预览功能
      console.log('预览图片:', options)
      options.success?.()
      options.complete?.()
    } catch (error) {
      options.fail?.(error)
      options.complete?.()
    }
  }

  /**
   * 保存图片到系统相册
   */
  saveImageToPhotosAlbum(options: {
    /** 图片文件路径，可以是临时文件路径或永久文件路径 */
    filePath: string
    /** 接口调用成功的回调函数 */
    success?: () => void
    /** 接口调用失败的回调函数 */
    fail?: (error: any) => void
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: () => void
  }) {
    try {
      // 这里可以实现保存图片到相册功能
      console.log('保存图片到相册:', options)
      options.success?.()
      options.complete?.()
    } catch (error) {
      options.fail?.(error)
      options.complete?.()
    }
  }
}

// 创建单例实例
const fileChooser = new FileChooser()

export default fileChooser