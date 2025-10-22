<template>
  <div class="app-bottom-tabbar">
    <!-- 替换 van-tabbar 为 sdkwork-tabbar -->
    <sdkwork-tabbar 
      v-model="activeTab" 
      :fixed="props.fixed" 
      :border="props.border" 
      :z-index="props.zIndex"
      :active-color="props.activeColor"
      :inactive-color="props.inactiveColor"
      :route="props.route"
      :placeholder="props.placeholder"
      :safe-area-inset-bottom="props.safeAreaInsetBottom"
      :icon-only="props.iconOnly"
      @change="handleTabChange"
    >
      <!-- 对话选项卡 -->
      <sdkwork-tabbar-item name="home" :icon-only="props.iconOnly">
        <template #icon="{ active }">
          <Icon 
            :icon="active ? 'mingcute:message-3-fill' : 'mingcute:message-3-line'" 
            width="24" 
            height="24"
            :class="{ 'active-icon': active }"
          />
        </template>
        对话
        <template #badge>
          <div v-if="unreadChatCount > 0" class="sdkwork-badge">
            {{ unreadChatCount }}
          </div>
        </template>
      </sdkwork-tabbar-item>
      
      <!-- 智能体选项卡 -->
      <sdkwork-tabbar-item name="agents" :icon-only="props.iconOnly">
        <template #icon="{ active }">
          <Icon 
            :icon="active ? 'mdi:robot' : 'mdi:robot-outline'" 
            width="24" 
            height="24"
            :class="{ 'active-icon': active }"
          />
        </template>
        智能体
      </sdkwork-tabbar-item>
       
      
      <!-- 商城选项卡 -->
      <sdkwork-tabbar-item name="mall" :icon-only="props.iconOnly">
        <template #icon="{ active }">
          <Icon 
            :icon="active ? 'mdi:shopping' : 'mdi:shopping-outline'" 
            width="24" 
            height="24"
            :class="{ 'active-icon': active }"
          />
        </template>
        商城
        <template #badge>
          <div v-if="newProductCount > 0" class="sdkwork-badge">
            {{ newProductCount }}
          </div>
        </template>
      </sdkwork-tabbar-item>
      
      <!-- 通知选项卡 -->
      <sdkwork-tabbar-item name="notifications" :icon-only="props.iconOnly">
        <template #icon="{ active }">
          <Icon 
            :icon="active ? 'mdi:bell' : 'mdi:bell-outline'" 
            width="24" 
            height="24"
            :class="{ 'active-icon': active }"
          />
        </template>
        通知
        <template #badge>
          <div v-if="unreadNotificationCount > 0" class="sdkwork-badge">
            {{ unreadNotificationCount }}
          </div>
        </template>
      </sdkwork-tabbar-item>
      
      <!-- 我的选项卡 -->
      <sdkwork-tabbar-item name="profile" :icon-only="props.iconOnly">
        <template #icon="{ active }">
          <Icon 
            :icon="active ? 'mdi:account' : 'mdi:account-outline'" 
            width="24" 
            height="24"
            :class="{ 'active-icon': active }"
          />
        </template>
        我的
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

// 计算属性
const unreadChatCount = computed(() => chatStore.unreadCount)
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

// 监听路由变化，同步底部导航状态
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath === '/home') activeTab.value = 'home'
  else if (newPath === '/agents') activeTab.value = 'agents'
  else if (newPath === '/devices') activeTab.value = 'devices'
  else if (newPath === '/mall') activeTab.value = 'mall'
  else if (newPath === '/notifications') activeTab.value = 'notifications'
  else if (newPath === '/profile') activeTab.value = 'profile'
}, { immediate: true })

// 处理选项卡切换
const handleTabChange = (tabName: string | number) => {
  const tabNameStr = String(tabName)
  switch (tabNameStr) {
    case 'home':
      router.push('/home')
      break
    case 'agents':
      router.push('/agents')
      break
    case 'devices':
      router.push('/devices')
      break
    case 'mall':
      router.push('/mall')
      break
    case 'notifications':
      router.push('/notifications')
      break
    case 'profile':
      router.push('/profile')
      break
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