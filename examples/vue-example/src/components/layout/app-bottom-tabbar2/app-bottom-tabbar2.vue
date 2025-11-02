<template>
  <div class="app-bottom-tabbar">
    <!-- 替换 van-tabbar 为 sdkwork-tabbar -->
    <sdkwork-tabbar v-model="activeTab" :fixed="fixed" :border="border" :z-index="zIndex"
      :active-color="activeColor" :inactive-color="inactiveColor" :route="route"
      :placeholder="placeholder" :safe-area-inset-bottom="safeAreaInsetBottom" :icon-only="iconOnly"
      @change="handleTabChange">
      <!-- 动态渲染选项卡 -->
      <sdkwork-tabbar-item v-for="tab in tabs.list" :key="tab.name" :name="tab.name" :icon-only="iconOnly">
        <template #icon="{ active }">
          <Icon :icon="active ? tab.activeIcon : tab.inactiveIcon" width="24" height="24"
            :class="{ 'active-icon': active }" />
        </template>
        {{ tab.label }}
        <template #badge>
          <div v-if="getBadgeCount(tab.name) > 0" class="sdkwork-badge">
            {{ getBadgeCount(tab.name) }}
          </div>
        </template>
      </sdkwork-tabbar-item>
    </sdkwork-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useChatStore } from '@/stores/modules/chat'
import { useDeviceStore } from '@/stores/modules/device'
import { useNotificationStore } from '@/stores/modules/notification'

// Props
interface Props {
  modelValue?: string | number
  fixed?: boolean
  border?: boolean
  zIndex?: number
  activeColor?: string
  inactiveColor?: string
  route?: boolean
  placeholder?: boolean
  safeAreaInsetBottom?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'home',
  fixed: true,
  border: true,
  zIndex: 1,
  activeColor: '#1989fa',
  inactiveColor: '#7d7e80',
  route: true,
  placeholder: false,
  safeAreaInsetBottom: true,
  iconOnly: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

// Expose methods
const setActive = (name: string | number) => {
  activeTab.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

const getActiveTab = () => {
  return activeTab.value
}

// Expose component methods
defineExpose({
  setActive,
  getActiveTab
})

const router = useRouter()
const activeTab = ref(props.modelValue)

const chatStore = useChatStore()
const deviceStore = useDeviceStore()
const notificationStore = useNotificationStore()

// Watch modelValue changes from parent
watch(() => props.modelValue, (newValue) => {
  if (newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})

// Watch activeTab changes and emit events
watch(activeTab, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
})

// 选项卡配置
const tabs = {
  list: [
    {
      name: 'home',
      label: '对话',
      activeIcon: 'mingcute:message-3-fill',
      inactiveIcon: 'mingcute:message-3-line',
      route: '/home'
    },
    {
      name: 'agents',
      label: '智能体',
      activeIcon: 'mdi:robot',
      inactiveIcon: 'mdi:robot-outline',
      route: '/agents'
    },
    {
      name: 'mall',
      label: '商城',
      activeIcon: 'mdi:shopping',
      inactiveIcon: 'mdi:shopping-outline',
      route: '/mall'
    },
    {
      name: 'notifications',
      label: '通知',
      activeIcon: 'mdi:bell',
      inactiveIcon: 'mdi:bell-outline',
      route: '/notifications'
    },
    {
      name: 'profile',
      label: '我的',
      activeIcon: 'mdi:account',
      inactiveIcon: 'mdi:account-outline',
      route: '/profile'
    }
  ]
} 

// 计算属性
const unreadChatCount = computed(() => {
  return 0
})
const offlineDeviceCount = computed(() => {
  return deviceStore.deviceList.filter(device => device.status === 'offline').length
})
const unreadNotificationCount = computed(() => {
  return notificationStore.notifications.filter(notification => !notification.read).length
})
const newProductCount = computed(() => {
  // 模拟新商品数量，实际项目中可以从商城store获取
  return 3
})

// 获取徽章数量
const getBadgeCount = (tabName: string) => {
  switch (tabName) {
    case 'home':
      return unreadChatCount.value
    case 'mall':
      return newProductCount.value
    case 'notifications':
      return unreadNotificationCount.value
    default:
      return 0
  }
} 

// 监听路由变化，同步底部导航状态
watch(() => router.currentRoute.value.path, (newPath) => {
  const matchedTab = tabs.list.find(tab => tab.route === newPath)
  if (matchedTab) {
    activeTab.value = matchedTab.name
  }
}, { immediate: true })

// 处理选项卡切换
const handleTabChange = (tabName: string | number) => {
  const tabNameStr = String(tabName)
  const matchedTab = tabs.list.find(tab => tab.name === tabNameStr)
  if (matchedTab) {
    router.replace(matchedTab.route)
  }
}
</script>

<style scoped lang="scss">
.app-bottom-tabbar {
  :deep(.sdkwork-tabbar) {
    height: 60px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

    .sdkwork-tabbar-item {
      font-size: 12px;

      &--active {
        color: var(--van-primary-color);

        .active-icon {
          color: var(--van-primary-color);
        }
      }

      .iconify {
        transition: color 0.3s ease;

        &.active-icon {
          color: var(--van-primary-color);
        }
      }
    }
  }
}

.sdkwork-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 1;
  color: #fff;
  background-color: #ee0a24;
  border-radius: 8px;
  white-space: nowrap;
}

.sdkwork-badge--dot {
  width: 8px;
  height: 8px;
  min-width: 8px;
  padding: 0;
  border-radius: 50%;
}
</style>