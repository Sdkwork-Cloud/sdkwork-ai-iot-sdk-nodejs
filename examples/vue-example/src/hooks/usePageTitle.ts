import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 页面标题管理 Hook
 * 提供统一的页面标题设置逻辑，支持多级优先级
 */
export const usePageTitle = (defaultTitle = 'SDKWork AI IoT SDK') => {
  const route = useRoute()
  
  // 计算页面标题
  const pageTitle = computed(() => {
    const routeTitle = route.meta.title as string
    const paramsTitle = route.params.title as string
    const queryTitle = route.query.title as string
    
    // 优先级：route.meta.title > params.title > query.title > 默认标题
    return routeTitle || paramsTitle || queryTitle || defaultTitle
  })
  
  // 设置页面标题
  const setPageTitle = (customTitle?: string) => {
    const title = customTitle || pageTitle.value
    document.title = title
  }
  
  // 监听路由变化，自动更新标题
  watch(() => route, () => {
    setPageTitle()
  }, { deep: true })
  
  // 组件挂载时设置标题
  onMounted(() => {
    setPageTitle()
  })
  
  return {
    pageTitle,
    setPageTitle
  }
}