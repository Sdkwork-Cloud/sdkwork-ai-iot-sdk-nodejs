/**
 * SDKWork AIoT 组件库 - 统一导出
 * 
 * 认证相关组件
 */

// 认证组件
export { default as SdkworkAuthLogin } from './sdkwork-auth-login/sdkwork-auth-login.vue'
export { default as SdkworkAuthRegister } from './sdkwork-auth-register/sdkwork-auth-register.vue'
export { default as SdkworkAuthForgot } from './sdkwork-auth-forgot/sdkwork-auth-forgot.vue'
export { default as SdkworkAuthBindMobile } from './sdkwork-auth-bind-mobile/sdkwork-auth-bind-mobile.vue'
export { default as SdkworkAuthResetPassword } from './sdkwork-auth-reset-password/sdkwork-auth-reset-password.vue' 

// API 相关组件
export { default as SdkworkApiCategoryList } from './sdkwork-api-category-list/sdkwork-api-category-list.vue'
export { default as SdkworkApiGridList } from './sdkwork-api-grid-list/sdkwork-api-grid-list.vue'
export { default as SdkworkApiList } from './sdkwork-api-list/sdkwork-api-list.vue'
export { default as SdkworkApiTabList } from './sdkwork-api-tab-list/sdkwork-api-tab-list.vue'
export { default as SdkworkApiWaterfall } from './sdkwork-api-waterfall/sdkwork-api-waterfall.vue'

// Agent 相关组件
export { default as SdkworkAgentCreate } from './sdkwork-agent-create/sdkwork-agent-create.vue'
export { default as SdkworkAgentList } from './sdkwork-agent-list/sdkwork-agent-list.vue'
export { default as SdkworkAgentProfile } from './sdkwork-agent-profile/sdkwork-agent-profile.vue'
export { default as SdkworkAgentsListItem } from './sdkwork-agents-list-item/sdkwork-agents-list-item.vue'

// 其他组件
export { default as SdkworkAppointmentList } from './sdkwork-appointment-list/sdkwork-appointment-list.vue'
export { default as McpDeviceList } from './mcp-device-list/mcp-device-list.vue'

// 通用组件
export { default as AppProvider } from './common/app-provider.vue'
export { default as MusicPlayerPanel } from './common/music-player-panel.vue'

/**
 * 组件类型定义
 */
export interface AuthComponentProps {
  /** 重定向URL */
  redirectUrl?: string
  /** 是否自动重定向 */
  autoRedirect?: boolean
  /** 强制暗色模式 */
  forceDarkMode?: boolean
  /** 紧凑模式 */
  compactMode?: boolean
}

/**
 * 认证组件事件类型
 */
export interface AuthComponentEmits {
  /** 操作成功事件 */
  (e: 'success', data?: any): void
  /** 操作失败事件 */
  (e: 'failed', error: Error): void
  /** 主题变化事件 */
  (e: 'theme-change', isDark: boolean): void
}

/**
 * 组件安装函数
 */
export const installComponents = (app: any) => {
  // 这里可以添加全局组件注册逻辑
  // 例如：app.component('SdkworkAuthLogin', SdkworkAuthLogin)
}

/**
 * 默认导出所有组件
 */
export default { 
}