<template>
  <!-- 使用Vant的Collapse组件作为基础 -->
  <van-collapse
    v-model:modelValue="activeNames"
    :accordion="accordion"
    :border="border"
    @change="handleChange"
    :class="['sdkwork-collapse', themeClass]"
  >
    <slot />
  </van-collapse>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Props定义 - 兼容Vant Collapse组件
interface Props {
  // 当前展开面板的name - 使用modelValue与Vant保持一致
  modelValue?: string | number | Array<string | number>
  // 是否开启手风琴模式
  accordion?: boolean
  // 是否显示外边框
  border?: boolean
  // 主题模式
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  accordion: false,
  border: true,
  themeMode: 'auto'
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: string | number | Array<string | number>]
  'change': [value: string | number | Array<string | number>]
}>()

// 主题检测逻辑
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-collapse--dark' : 'sdkwork-collapse--light'
})

// 内部状态管理 - 根据Vant标准，手风琴模式为string，非手风琴模式为string[]
const activeNames = ref<string | string[]>(props.accordion ? 
  (typeof props.modelValue === 'string' || typeof props.modelValue === 'number' ? String(props.modelValue) : '') : 
  (Array.isArray(props.modelValue) ? props.modelValue.map(String) : []))

// 监听props.modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (props.accordion) {
    // 手风琴模式：确保返回string类型
    activeNames.value = typeof newValue === 'string' || typeof newValue === 'number' ? String(newValue) : ''
  } else {
    // 非手风琴模式：确保返回string[]类型
    activeNames.value = Array.isArray(newValue) ? newValue.map(String) : []
  }
})

// 监听内部状态变化 - 避免无限循环
watch(activeNames, (newValue, oldValue) => {
  // 只有当值真正发生变化时才触发emit
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    emit('update:modelValue', newValue)
  }
}, { deep: true })

// 处理change事件
const handleChange = (value: string | string[]) => {
  emit('change', value)
}

// 暴露方法 - 兼容Vant Collapse的方法
defineExpose({
  /**
   * 切换面板展开状态
   * @param name 面板name
   * @param expanded 是否展开
   */
  toggle: (name: string, expanded?: boolean) => {
    if (props.accordion) {
      // 手风琴模式：确保类型为string
      const currentName = typeof activeNames.value === 'string' ? activeNames.value : ''
      if (expanded === undefined) {
        // 切换状态
        activeNames.value = currentName === name ? '' : name
      } else {
        // 设置指定状态
        activeNames.value = expanded ? name : ''
      }
    } else {
      // 非手风琴模式：确保类型为string[]
      const currentNames = Array.isArray(activeNames.value) ? activeNames.value : []
      
      if (expanded === undefined) {
        // 切换状态
        const index = currentNames.indexOf(name)
        if (index > -1) {
          currentNames.splice(index, 1)
        } else {
          currentNames.push(name)
        }
        activeNames.value = currentNames
      } else {
        // 设置指定状态
        const index = currentNames.indexOf(name)
        if (expanded && index === -1) {
          currentNames.push(name)
        } else if (!expanded && index > -1) {
          currentNames.splice(index, 1)
        }
        activeNames.value = currentNames
      }
    }
  }
})
</script>

<style scoped lang="scss">
.sdkwork-collapse {
  // 基础样式 - 设置默认的CSS变量值
  :deep(.van-collapse-item) {
    // 定义默认的CSS变量值
    --sdkwork-collapse-background: #fff;
    --sdkwork-collapse-border-color: #ebedf0;
    --sdkwork-collapse-title-background: #fff;
    --sdkwork-collapse-title-color: #323233;
    --sdkwork-collapse-title-disabled-color: #c8c9cc;
    --sdkwork-collapse-content-background: #fff;
    --sdkwork-collapse-content-color: #333;
    --sdkwork-collapse-icon-color: #969799;
    
    // 应用Vant主题变量
    --van-collapse-item-content-background: var(--sdkwork-collapse-content-background);
    --van-collapse-item-content-text-color: var(--sdkwork-collapse-content-color);
    --van-collapse-item-title-disabled-color: var(--sdkwork-collapse-title-disabled-color);
    --van-collapse-item-title-text-color: var(--sdkwork-collapse-title-color);
    --van-collapse-item-title-background: var(--sdkwork-collapse-title-background);
    --van-collapse-item-border-color: var(--sdkwork-collapse-border-color);
    --van-collapse-item-arrow-color: var(--sdkwork-collapse-icon-color);
  }
}

// 浅色主题
.sdkwork-collapse--light {
  :deep(.van-collapse-item) {
    --sdkwork-collapse-background: #fff;
    --sdkwork-collapse-border-color: #ebedf0;
    --sdkwork-collapse-title-background: #fff;
    --sdkwork-collapse-title-color: #323233;
    --sdkwork-collapse-title-disabled-color: #c8c9cc;
    --sdkwork-collapse-content-background: #fff;
    --sdkwork-collapse-content-color: #333;
    --sdkwork-collapse-icon-color: #969799;
  }
}

// 深色主题
.sdkwork-collapse--dark {
  :deep(.van-collapse-item) {
    --sdkwork-collapse-background: #1a1a1a;
    --sdkwork-collapse-border-color: #3a3a3a;
    --sdkwork-collapse-title-background: #2d2d2d;
    --sdkwork-collapse-title-color: #fff;
    --sdkwork-collapse-title-disabled-color: #555;
    --sdkwork-collapse-content-background: #1a1a1a;
    --sdkwork-collapse-content-color: #fff;
    --sdkwork-collapse-icon-color: #888;
  }
}

// 响应式主题切换支持 - 修复选择器问题
@media (prefers-color-scheme: dark) {
  .sdkwork-collapse:not(.sdkwork-collapse--light):not(.sdkwork-collapse--dark) {
    :deep(.van-collapse-item) {
      --sdkwork-collapse-background: #1a1a1a;
      --sdkwork-collapse-border-color: #3a3a3a;
      --sdkwork-collapse-title-background: #2d2d2d;
      --sdkwork-collapse-title-color: #fff;
      --sdkwork-collapse-title-disabled-color: #555;
      --sdkwork-collapse-content-background: #1a1a1a;
      --sdkwork-collapse-content-color: #fff;
      --sdkwork-collapse-icon-color: #888;
    }
  }
}

@media (prefers-color-scheme: light) {
  .sdkwork-collapse:not(.sdkwork-collapse--light):not(.sdkwork-collapse--dark) {
    :deep(.van-collapse-item) {
      --sdkwork-collapse-background: #fff;
      --sdkwork-collapse-border-color: #ebedf0;
      --sdkwork-collapse-title-background: #fff;
      --sdkwork-collapse-title-color: #323233;
      --sdkwork-collapse-title-disabled-color: #c8c9cc;
      --sdkwork-collapse-content-background: #fff;
      --sdkwork-collapse-content-color: #333;
      --sdkwork-collapse-icon-color: #969799;
    }
  }
}
</style>