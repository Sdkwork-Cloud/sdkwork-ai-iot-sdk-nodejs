import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

// 导出所有store模块
export * from './modules/agent'
export * from './modules/app'
export * from './modules/auth'
export * from './modules/chat'
export * from './modules/device'
export * from './modules/generation'
export * from './modules/notification'
export * from './modules/user'