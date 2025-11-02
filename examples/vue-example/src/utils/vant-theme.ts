// Vant 主题初始化工具
// 确保 Vant 组件能够正确响应主题变化

import { watch } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'

/**
 * 初始化 Vant 主题系统
 * 监听主题变化并应用到 Vant 组件
 */
export function initVantTheme() {
  const { currentTheme, isDarkMode } = useTheme()
  
  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    console.log('Vant 主题切换:', newTheme)
    
    // 更新 HTML 根元素的主题属性
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', newTheme)
    
    // 强制更新 Vant 组件的样式
    updateVantStyles(newTheme)
  }, { immediate: true })
  
  // 初始设置
  const htmlElement = document.documentElement
  htmlElement.setAttribute('data-theme', currentTheme.value)
  updateVantStyles(currentTheme.value)
}

/**
 * 更新 Vant 组件样式
 * @param theme 当前主题
 */
function updateVantStyles(theme: 'light' | 'dark') {
  // 这里可以添加特定组件的样式更新逻辑
  // 由于我们已经配置了 CSS 变量，大部分样式会自动更新
  
  // 强制刷新某些可能需要手动更新的组件
  const vantComponents = document.querySelectorAll('.van-tabs, .van-button, .van-cell')
  vantComponents.forEach(component => {
    // 触发重绘
    component.classList.remove('van-theme-changed')
    setTimeout(() => {
      component.classList.add('van-theme-changed')
    }, 10)
  })
}

/**
 * 获取 Vant 主题配置
 */
export function getVantThemeConfig() {
  return {
    // Vant 主题变量映射
    light: {
      '--van-primary-color': '#1989fa',
      '--van-success-color': '#07c160',
      '--van-danger-color': '#ee0a24',
      '--van-warning-color': '#ff976a',
      '--van-text-color': '#323233',
      '--van-text-color-2': '#969799',
      '--van-background-color': '#ffffff',
      '--van-background-color-2': '#f7f8fa',
      '--van-border-color': '#ebedf0',
      '--van-tabs-nav-background': '#ffffff',
    },
    dark: {
      '--van-primary-color': '#1989fa',
      '--van-success-color': '#07c160',
      '--van-danger-color': '#ee0a24',
      '--van-warning-color': '#ff976a',
      '--van-text-color': '#ffffff',
      '--van-text-color-2': '#a0a0a0',
      '--van-background-color': '#1a1a1a',
      '--van-background-color-2': '#2d2d2d',
      '--van-border-color': '#404040',
      '--van-tabs-nav-background': '#2d2d2d',
    }
  }
}