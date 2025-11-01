import { computed, type ComputedRef } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 实际应用的主题类型
 */
export type Theme = 'light' | 'dark'

/**
 * 主题 hook 返回值接口
 */
export interface UseThemeReturn {
  /** 当前主题模式 */
  themeMode: ComputedRef<ThemeMode>
  /** 实际应用的主题 */
  currentTheme: ComputedRef<Theme>
  /** 是否是暗色模式 */
  isDarkMode: ComputedRef<boolean>
  /** 是否是浅色模式 */
  isLightMode: ComputedRef<boolean>
  /** 是否是自动模式 */
  isAutoMode: ComputedRef<boolean>
  /** 系统是否偏好暗色 */
  systemPrefersDark: ComputedRef<boolean>
  /** 设置主题模式 */
  setTheme: (mode: ThemeMode) => void
  /** 切换主题 */
  toggleTheme: () => void
}

/**
 * 主题存储键
 */
const THEME_STORAGE_KEY = 'sdkwork-theme-mode'

/**
 * 主题 hook
 * 完全基于 VueUse 的 useDark 和 useToggle 实现
 */
export function useTheme(): UseThemeReturn {
  // 使用 VueUse 的 useDark 作为基础
  const isDark = useDark({
    storageKey: THEME_STORAGE_KEY,
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light'
  })
  
  // 使用 VueUse 的 useToggle 进行主题切换
  const toggleDark = useToggle(isDark)
  
  // 系统偏好暗色检测
  const systemPrefersDark = computed(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  
  // 当前主题模式（基于存储）
  const themeMode = computed<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'true' || stored === 'false') {
      // VueUse 存储的是布尔值，转换为主题模式
      return stored === 'true' ? 'dark' : 'light'
    }
    return (stored as ThemeMode) || 'auto'
  })
  
  // 实际应用的主题
  const currentTheme = computed<Theme>(() => {
    if (themeMode.value === 'auto') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return themeMode.value as Theme
  })
  
  // 同步 VueUse 的暗色模式状态
  const isDarkMode = computed(() => isDark.value)
  
  // 是否是浅色模式
  const isLightMode = computed(() => !isDark.value)
  
  // 是否是自动模式
  const isAutoMode = computed(() => themeMode.value === 'auto')
  
  // 设置主题模式
  const setTheme = (mode: ThemeMode) => {
    if (mode === 'auto') {
      localStorage.setItem(THEME_STORAGE_KEY, 'auto')
      // 在自动模式下，使用系统偏好
      isDark.value = systemPrefersDark.value
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
      isDark.value = mode === 'dark'
    }
  }
  
  // 切换主题
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex])
  }
  
  return {
    themeMode,
    currentTheme,
    isDarkMode,
    isLightMode,
    isAutoMode,
    systemPrefersDark,
    setTheme,
    toggleTheme
  }
}

/**
 * 简化的主题判断 hook
 * 仅用于判断当前是否是暗色模式
 */
export function useDarkMode() {
  const { isDarkMode } = useTheme()
  return isDarkMode
}

/**
 * 简化的主题判断 hook
 * 仅用于判断当前是否是浅色模式
 */
export function useLightMode() {
  const { isLightMode } = useTheme()
  return isLightMode
}

/**
 * 简化的主题判断 hook
 * 仅用于获取当前主题
 */
export function useCurrentTheme() {
  const { currentTheme } = useTheme()
  return currentTheme
}