import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出所有store模块
export * from './modules/agent'
export * from './modules/auth'
export * from './modules/chat'
export * from './modules/device'
export * from './modules/notification'