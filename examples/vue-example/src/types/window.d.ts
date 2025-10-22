/**
 * Window对象类型扩展
 */

import type fileChooser from '@/core/files'
import type chatMessageProcessor from '@/core/chat'

declare global {
  interface Window {
    /** 文件选择工具 */
    $files: typeof fileChooser
    /** 加载条工具 */
    $loadingBar: {
      start: () => void
      finish: () => void
      error: () => void
    }
    /** 路由工具 */
    $router: any
    /** 对话框工具 */
    $dialog: {
      info: (options: any) => void
      success: (options: any) => void
      warning: (options: any) => void
      error: (options: any) => void
      confirm: (options: any) => void
    }
    /** 消息工具 */
    $message: {
      info: (content: string) => void
      success: (content: string) => void
      warning: (content: string) => void
      error: (content: string) => void
    }
    /** 通知工具 */
    $notification: {
      info: (options: any) => void
      success: (options: any) => void
      warning: (options: any) => void
      error: (options: any) => void
    }
    /** UUID工具 */
    $uuid: () => string
    /** 参数获取工具 */
    $getParameter: (name: string | string[]) => string | null
    /** 复制工具 */
    $copy: (text: string, showMessage?: boolean) => Promise<void>
    /** 日期工具 */
    $date: {
      format: (date: Date | string | number, format?: string) => string
      parse: (dateString: string, format?: string) => Date
    }
    /** 国际化工具 */
    $i18n: {
      t: (key: string) => string
    }
    /** 事件发射器 */
    $emit: (event: string, ...args: any[]) => void
    $on: (event: string, callback: (...args: any[]) => void) => void
    $off: (event: string, callback?: (...args: any[]) => void) => void
    /** 上传工具 */
    $uploader: any
    /** Chat消息处理工具 */
    $chat: typeof chatMessageProcessor
  }
}

export {}