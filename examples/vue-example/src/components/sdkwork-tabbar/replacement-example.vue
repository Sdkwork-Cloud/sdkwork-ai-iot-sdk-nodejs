<template>
  <div class="app-bottom-tabbar">
    <!-- 替换 van-tabbar 为 sdkwork-tabbar -->
    <sdkwork-tabbar v-model="activeTab" fixed @change="(tabName: any) => {
      handleTabChange(tabName)
    }">
      <!-- 对话选项卡 -->
      <sdkwork-tabbar-item name="home">
        <template #icon="{ active }">
          <Icon :icon="active ? 'mingcute:message-3-fill' : 'mingcute:message-3-line'" width="24" height="24"
            :class="{ 'active-icon': active }" />
        </template>
        对话
        <template #badge>
          <div v-if="unreadChatCount > 0" class="sdkwork-badge">
            {{ unreadChatCount }}
          </div>
        </template>
      </sdkwork-tabbar-item>

      <!-- 智能体选项卡 -->
      <sdkwork-tabbar-item name="agents">
        <template #icon="{ active }">
          <Icon :icon="active ? 'mdi:robot' : 'mdi:robot-outline'" width="24" height="24"
            :class="{ 'active-icon': active }" />
        </template>
        智能体
      </sdkwork-tabbar-item>

      <!-- 硬件选项卡 -->
      <sdkwork-tabbar-item name="devices">
        <template #icon="{ active }">
          <Icon :icon="active ? 'mingcute:device-fill' : 'mingcute:device-line'" width="24" height="24"
            :class="{ 'active-icon': active }" />
        </template>
        硬件
        <template #badge>
          <div v-if="offlineDeviceCount > 0" class="sdkwork-badge sdkwork-badge--dot"></div>
        </template>
      </sdkwork-tabbar-item>

      <!-- 通知选项卡 -->
      <sdkwork-tabbar-item name="notifications">
        <template #icon="{ active }">
          <Icon :icon="active ? 'mdi:bell' : 'mdi:bell-outline'" width="24" height="24"
            :class="{ 'active-icon': active }" />
        </template>
        通知
        <template #badge>
          <div v-if="unreadNotificationCount > 0" class="sdkwork-badge">
            {{ unreadNotificationCount }}
          </div>
        </template>
      </sdkwork-tabbar-item>

      <!-- 我的选项卡 -->
      <sdkwork-tabbar-item name="profile">
        <template #icon="{ active }">
          <Icon :icon="active ? 'mdi:account' : 'mdi:account-outline'" width="24" height="24"
            :class="{ 'active-icon': active }" />
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

const router = useRouter()
const activeTab = ref('home')

// 模拟数据
const unreadChatCount = computed(() => 5)
const offlineDeviceCount = computed(() => 1)
const unreadNotificationCount = computed(() => 12)

// 监听路由变化，同步底部导航状态
watch(() => router.currentRoute.value.path, (newPath) => {
  if (newPath === '/home') activeTab.value = 'home'
  else if (newPath === '/agents') activeTab.value = 'agents'
  else if (newPath === '/devices') activeTab.value = 'devices'
  else if (newPath === '/notifications') activeTab.value = 'notifications'
  else if (newPath === '/profile') activeTab.value = 'profile'
}, { immediate: true })

// 处理选项卡切换
const handleTabChange = (tabName: string) => {
  switch (tabName) {
    case 'home':
      router.push('/home')
      break
    case 'agents':
      router.push('/agents')
      break
    case 'devices':
      router.push('/devices')
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