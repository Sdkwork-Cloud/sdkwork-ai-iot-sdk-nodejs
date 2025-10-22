<template>
  <div
    class="sdkwork-section"
    :class="[
      {
        'sdkwork-section--bordered': bordered,
        'sdkwork-section--shadow': shadow,
        'sdkwork-section--round': round,
        'sdkwork-section--full-width': fullWidth,
        'sdkwork-section--center': center,
        'sdkwork-section--collapsed': collapsed
      },
      themeClass
    ]"
    :style="computedStyle"
  >
    <!-- 标题区域 -->
    <div v-if="showTitle" class="sdkwork-section__header">
      <div class="sdkwork-section__title">
        <!-- 标题插槽 -->
        <slot name="title">
          <span class="sdkwork-section__title-text">{{ title }}</span>
        </slot>
        
        <!-- 标题右侧内容插槽 -->
        <slot name="title-extra">
          <span v-if="titleExtra" class="sdkwork-section__title-extra">{{ titleExtra }}</span>
        </slot>
      </div>
      
      <!-- 操作区域 -->
      <div v-if="showActions" class="sdkwork-section__actions">
        <slot name="actions">
          <!-- 折叠/展开按钮 -->
          <button
            v-if="collapsible"
            class="sdkwork-section__collapse-btn"
            :class="{ 'sdkwork-section__collapse-btn--collapsed': collapsed }"
            @click="toggleCollapse"
          >
            <span class="sdkwork-section__collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
          </button>
        </slot>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div
      v-show="!collapsed"
      class="sdkwork-section__content"
      :class="{ 'sdkwork-section__content--padded': contentPadded }"
    >
      <slot />
    </div>
    
    <!-- 底部区域 -->
    <div v-if="showFooter" class="sdkwork-section__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

// Props 定义
interface Props {
  /** 标题文本 */
  title?: string
  /** 标题右侧额外内容 */
  titleExtra?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示阴影 */
  shadow?: boolean
  /** 是否显示圆角 */
  round?: boolean
  /** 是否占满父容器宽度 */
  fullWidth?: boolean
  /** 是否居中显示 */
  center?: boolean
  /** 是否可折叠 */
  collapsible?: boolean
  /** 是否默认折叠 */
  defaultCollapsed?: boolean
  /** 内容区域是否有内边距 */
  contentPadded?: boolean
  /** 内容区域的内边距 */
  contentPadding?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 折叠/展开事件 */
  onCollapse?: (collapsed: boolean) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  titleExtra: '',
  bordered: true,
  shadow: false,
  round: false,
  fullWidth: false,
  center: false,
  collapsible: false,
  defaultCollapsed: false,
  contentPadded: true,
  contentPadding: '12px',
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
  /** 折叠/展开事件 */
  collapse: [collapsed: boolean]
}>()

// 获取 slots
const slots = useSlots()

// 响应式状态
const collapsed = ref(props.defaultCollapsed)

// 计算属性
const showTitle = computed(() => {
  return props.title || !!slots.title || !!slots['title-extra']
})

const showActions = computed(() => {
  return props.collapsible || !!slots.actions
})

const showFooter = computed(() => {
  return !!slots.footer
})

// Dark mode support
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
  return isDarkMode.value ? 'sdkwork-section--dark' : 'sdkwork-section--light'
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = {
    ...props.customStyle
  }

  return style
})

// 切换折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  emit('collapse', collapsed.value)
  props.onCollapse?.(collapsed.value)
}

// 处理点击事件
const handleClick = (event: Event) => {
  emit('click', event)
  props.onClick?.(event)
}

// 暴露方法
const exposeMethods = {
  /** 展开内容 */
  expand: () => {
    collapsed.value = false
    emit('collapse', false)
    props.onCollapse?.(false)
  },
  
  /** 折叠内容 */
  collapse: () => {
    collapsed.value = true
    emit('collapse', true)
    props.onCollapse?.(true)
  },
  
  /** 切换折叠状态 */
  toggle: toggleCollapse,
  
  /** 获取当前状态 */
  getState: () => ({
    collapsed: collapsed.value,
    title: props.title,
    collapsible: props.collapsible
  })
}

defineExpose(exposeMethods)
</script>

<style scoped>
.sdkwork-section {
  box-sizing: border-box;
  background: var(--sdkwork-section-bg-color, #ffffff);
  transition: all 0.3s ease;
}

/* 边框样式 */
.sdkwork-section--bordered {
  border: 1px solid var(--sdkwork-section-border-color, #ebedf0);
}

/* 阴影样式 */
.sdkwork-section--shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 圆角样式 */
.sdkwork-section--round {
  border-radius: 8px;
}

/* 全宽样式 */
.sdkwork-section--full-width {
  width: 100%;
}

/* 居中样式 */
.sdkwork-section--center {
  margin-left: auto;
  margin-right: auto;
}

/* 头部区域 */
.sdkwork-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--sdkwork-section-border-color, #ebedf0);
  min-height: 56px;
  box-sizing: border-box;
}

.sdkwork-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--sdkwork-section-title-color, #323233);
  line-height: 1.5;
}

.sdkwork-section__title-text {
  flex: 1;
}

.sdkwork-section__title-extra {
  font-size: 14px;
  color: var(--sdkwork-section-extra-color, #969799);
  font-weight: normal;
}

/* 操作区域 */
.sdkwork-section__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sdkwork-section__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: var(--sdkwork-section-action-color, #969799);
}

.sdkwork-section__collapse-btn:hover {
  background: var(--sdkwork-section-action-hover-bg, #f2f3f5);
  color: var(--sdkwork-section-action-hover-color, #323233);
}

.sdkwork-section__collapse-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.sdkwork-section__collapse-btn--collapsed .sdkwork-section__collapse-icon {
  transform: rotate(-90deg);
}

/* 内容区域 */
.sdkwork-section__content {
  transition: all 0.3s ease;
}

.sdkwork-section__content--padded {
  padding: v-bind('props.contentPadding');
}

/* 底部区域 */
.sdkwork-section__footer {
  padding: 16px;
  border-top: 1px solid var(--sdkwork-section-border-color, #ebedf0);
  background: var(--sdkwork-section-footer-bg, #fafafa);
}

/* 主题样式 - 浅色模式 */
.sdkwork-section--light {
  --sdkwork-section-bg-color: #ffffff;
  --sdkwork-section-border-color: #ebedf0;
  --sdkwork-section-title-color: #323233;
  --sdkwork-section-extra-color: #969799;
  --sdkwork-section-action-color: #969799;
  --sdkwork-section-action-hover-bg: #f2f3f5;
  --sdkwork-section-action-hover-color: #323233;
  --sdkwork-section-footer-bg: #fafafa;
}

/* 主题样式 - 深色模式 */
.sdkwork-section--dark {
  --sdkwork-section-bg-color: #1a1a1a;
  --sdkwork-section-border-color: #2d2d2d;
  --sdkwork-section-title-color: #e0e0e0;
  --sdkwork-section-extra-color: #8c8c8c;
  --sdkwork-section-action-color: #8c8c8c;
  --sdkwork-section-action-hover-bg: #2d2d2d;
  --sdkwork-section-action-hover-color: #e0e0e0;
  --sdkwork-section-footer-bg: #2d2d2d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-section__header {
    padding: 12px;
    min-height: 48px;
  }
  
  .sdkwork-section__content--padded {
    padding: v-bind('props.contentPadding');
  }
  
  .sdkwork-section__footer {
    padding: 12px;
  }
  
  .sdkwork-section__title {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .sdkwork-section__header {
    padding: 8px 12px;
    min-height: 44px;
  }
  
  .sdkwork-section__content--padded {
    padding: v-bind('props.contentPadding');
  }
  
  .sdkwork-section__footer {
    padding: 8px 12px;
  }
  
  .sdkwork-section__title {
    font-size: 14px;
  }
}
</style>