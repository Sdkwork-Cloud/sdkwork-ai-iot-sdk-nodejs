<template>
  <div
    class="sdkwork-tabbar-item"
    :class="[
      {
        'sdkwork-tabbar-item--active': isActive,
        'sdkwork-tabbar-item--disabled': disabled
      },
      themeClass
    ]"
    :style="{
      color: isActive ? activeColor : inactiveColor
    }"
    @click="onClick"
  >
    <div class="sdkwork-tabbar-item__icon">
      <!-- 图标插槽 -->
      <slot name="icon" :active="isActive">
        <div v-if="icon" class="sdkwork-tabbar-item__icon-wrapper">
          <img v-if="typeof icon === 'string' && (icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg') || icon.endsWith('.svg') || icon.endsWith('.gif'))" :src="icon" class="sdkwork-tabbar-item__icon-img" />
          <i v-else-if="typeof icon === 'string'" :class="icon" class="sdkwork-tabbar-item__icon-class" />
        </div>
      </slot>
      
      <!-- 徽标 -->
      <div v-if="showBadge" class="sdkwork-tabbar-item__badge-wrapper">
        <slot name="badge">
          <div class="sdkwork-tabbar-item__badge" :class="{ 'sdkwork-tabbar-item__badge--dot': badge === '' || badge === true }">
            <template v-if="badge !== '' && badge !== true">
              {{ badge }}
            </template>
          </div>
        </slot>
      </div>
    </div>
    
    <div v-if="!shouldShowIconOnly" class="sdkwork-tabbar-item__text">
      <!-- 文本插槽 -->
      <slot :active="isActive">
        {{ name }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, getCurrentInstance, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Props
interface Props {
  name?: string | number
  icon?: string
  dot?: boolean
  badge?: string | number | boolean
  url?: string
  to?: string | object
  replace?: boolean
  disabled?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  icon: '',
  dot: false,
  badge: '',
  url: '',
  to: '',
  replace: false,
  disabled: false,
  iconOnly: false
})

// Emits
const emit = defineEmits<{
  click: []
}>()

// Inject tabbar context
const tabbarContext = inject('sdkwork-tabbar', {
  activeName: ref(''),
  setActive: (name: string | number) => {},
  activeColor: '#1989fa',
  inactiveColor: '#7d7e80',
  route: false,
  iconOnly: false,
  isDarkMode: ref(false)
})

const router = useRouter()
const instance = getCurrentInstance()

// Computed properties
const isActive = computed(() => {
  return tabbarContext.activeName.value === props.name
})

const showBadge = computed(() => {
  return props.dot || props.badge !== ''
})

const activeColor = computed(() => tabbarContext.activeColor)
const inactiveColor = computed(() => tabbarContext.inactiveColor)

// 判断是否只显示图标（优先使用组件自身的iconOnly属性，如果没有则使用tabbar的配置）
const shouldShowIconOnly = computed(() => {
  return props.iconOnly !== undefined ? props.iconOnly : tabbarContext.iconOnly
})

// Dark mode support
const isDarkMode = computed(() => {
  return tabbarContext.isDarkMode?.value || false
})

// Theme class for styling
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-tabbar-item--dark' : 'sdkwork-tabbar-item--light'
})

// Methods
const onClick = (event: Event) => {
  if (props.disabled) return
  
  emit('click')
  
  if (!isActive.value && props.name) {
    tabbarContext.setActive(props.name)
  }
  
  // Handle routing
  if (props.to && tabbarContext.route) {
    const route = typeof props.to === 'string' ? { path: props.to } : props.to
    if (props.replace) {
      router.replace(route)
    } else {
      router.push(route)
    }
  } else if (props.url) {
    if (props.replace) {
      window.location.replace(props.url)
    } else {
      window.location.href = props.url
    }
  }
}
</script>

<style scoped>
.sdkwork-tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  color: var(--sdkwork-tabbar-item-color, #7d7e80);
  transition: color 0.3s ease, background-color 0.3s ease;
  user-select: none;
}

.sdkwork-tabbar-item--active {
  color: var(--sdkwork-tabbar-item-active-color, #1989fa);
}

.sdkwork-tabbar-item--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Light theme */
.sdkwork-tabbar-item--light {
  --sdkwork-tabbar-item-color: #7d7e80;
  --sdkwork-tabbar-item-active-color: #1989fa;
  --sdkwork-tabbar-item-badge-background: #ee0a24;
}

/* Dark theme */
.sdkwork-tabbar-item--dark {
  --sdkwork-tabbar-item-color: #999;
  --sdkwork-tabbar-item-active-color: #4a90e2;
  --sdkwork-tabbar-item-badge-background: #ff4757;
}

/* System preference support */
@media (prefers-color-scheme: dark) {
  .sdkwork-tabbar-item:not(.sdkwork-tabbar-item--light):not(.sdkwork-tabbar-item--dark) {
    --sdkwork-tabbar-item-color: #999;
    --sdkwork-tabbar-item-active-color: #4a90e2;
    --sdkwork-tabbar-item-badge-background: #ff4757;
  }
}

.sdkwork-tabbar-item__icon {
  position: relative;
  margin-bottom: 4px;
  font-size: 18px;
}

/* 当只显示图标时，调整图标位置 */
.sdkwork-tabbar-item:has(.sdkwork-tabbar-item__text:not(:empty)) .sdkwork-tabbar-item__icon {
  margin-bottom: 4px;
}

.sdkwork-tabbar-item:not(:has(.sdkwork-tabbar-item__text:not(:empty))) .sdkwork-tabbar-item__icon {
  margin-bottom: 0;
  font-size: 22px;
}

.sdkwork-tabbar-item__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.sdkwork-tabbar-item__icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sdkwork-tabbar-item__icon-class {
  font-size: inherit;
}

.sdkwork-tabbar-item__badge-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.sdkwork-tabbar-item__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 1;
  color: #fff;
  background-color: var(--sdkwork-tabbar-item-badge-background, #ee0a24);
  border-radius: 8px;
  white-space: nowrap;
  transition: background-color 0.3s ease;
}

.sdkwork-tabbar-item__badge--dot {
  width: 8px;
  height: 8px;
  min-width: 8px;
  padding: 0;
  border-radius: 50%;
}

.sdkwork-tabbar-item__text {
  font-size: 12px;
  line-height: 1;
}
</style>