import SdkworkHeaderCell from './sdkwork-header-cell.vue'
import type { App } from 'vue'

export { SdkworkHeaderCell }
export * from './types'

/**
 * 安装组件
 */
SdkworkHeaderCell.install = (app: App) => {
  app.component(SdkworkHeaderCell.name || 'SdkworkHeaderCell', SdkworkHeaderCell)
}

export default SdkworkHeaderCell