import { createApp } from 'vue' 
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue' 
import pinia from './stores'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from "virtual:meta-layouts"; 
import 'virtual:uno.css'
import 'vant/lib/index.css';
// 引入全局样式
import './assets/styles/main.scss'

// 导入 i18n 实例
import i18n from '@/i18n' 
import { appConfig } from './config/app'

// 创建路由实例（使用unplugin-vue-router自动生成的路由）
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 根路径重定向到首页
    { path: '/', redirect: '/home' },
    ...setupLayouts(routes)
  ],
})
// 创建Vue应用
const app = createApp(App)

// 使用路由
app.use(router) 
app.use(i18n)
// 使用状态管理
app.use(pinia)

// 挂载应用
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('🚀 Vue3 SPA应用已启动')
  console.log('📱 环境:', import.meta.env.MODE)
  console.log('🌐 API地址:', appConfig.apiBaseURL)
  console.log('🔗 WebSocket地址:', appConfig.websocketBaseURL)
}