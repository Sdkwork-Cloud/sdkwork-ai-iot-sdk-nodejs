import SdkworkSection from './sdkwork-section.vue'
import type { App } from 'vue'

export { SdkworkSection }
export * from './types'

/**
 * 安装组件
 */
SdkworkSection.install = (app: App) => {
  app.component(SdkworkSection.name || 'SdkworkSection', SdkworkSection)
}

export default SdkworkSection