<template>
  <div class="profile-page">
    <!-- 顶部header cell -->
    <sdkwork-header-cell
      :user-info="userInfo"
      :avatar-size="80"
      :show-online-status="true"
      :show-user-id="true"
      :layout="'horizontal'"
      :bordered="false"
      class="profile-header"
      @click="handleHeaderClick"
    >
      <!-- 操作区域插槽 -->
      <template #actions>
        <van-button type="primary" size="small" @click="handleEditProfile">
          编辑资料
        </van-button>
      </template>
      
      <!-- 标签区域插槽 -->
      <template #tags>
        <van-tag type="primary" size="medium">VIP会员</van-tag>
        <van-tag type="success" size="medium">认证用户</van-tag>
      </template>
    </sdkwork-header-cell>

    <!-- 网格区域 -->
    <sdkwork-profile-grid-section 
      :items="gridItems"
      @item-click="handleGridItemClick"
    />

    <!-- Tab区域 -->
    <div class="profile-tabs-section" :class="themeClass">
      <van-tabs 
        v-model:active="activeTab" 
        sticky 
        animated 
        swipeable
        :class="themeClass"
      >
        <van-tab title="作品" name="generations">
          <generations-tab-content ref="generationsTab" />
        </van-tab>
        <van-tab title="智能体" name="agents">
          <agents-tab-content ref="agentsTab" />
        </van-tab>
        <van-tab title="声音" name="voices">
          <voices-tab-content ref="voicesTab" />
        </van-tab>
        <van-tab title="角色" name="cameos">
          <cameos-tab-content ref="cameosTab" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { showToast } from 'vant'

// 导入子组件
import GenerationsTabContent from './components/generations-tab-content.vue'
import AgentsTabContent from './components/agents-tab-content.vue'
import VoicesTabContent from './components/voices-tab-content.vue'
import CameosTabContent from './components/cameos-tab-content.vue'

// 导入路由
import { useRouter } from 'vue-router'

// 导入user store
import { useUserStore } from '@/stores/modules/user'

// 路由实例
const router = useRouter()

// user store实例
const userStore = useUserStore()

// 用户信息（直接使用标准的User结构）
const userInfo = computed<any>(() => {
  if (!userStore.currentUser) {
    return null
  }
  
  return userStore.currentUser
})

// 主题模式配置
const themeMode = ref<'light' | 'dark' | 'auto'>('auto')

// 深色模式检测
const isDarkMode = ref(false)

// 检测系统深色模式偏好
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 更新主题
const updateTheme = () => {
  if (themeMode.value === 'dark') {
    isDarkMode.value = true
  } else if (themeMode.value === 'light') {
    isDarkMode.value = false
  } else if (themeMode.value === 'auto') {
    isDarkMode.value = detectSystemDarkMode()
  }
}

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'profile-tabs--dark' : 'profile-tabs--light'
})

// 网格项配置
const gridItems = ref([
   { id: 1, text: '订单', icon: 'mdi:shopping', badge: '5', route: '/trade/order/list' },
  { id: 2, text: '账户', icon: 'mdi:account-balance-wallet', badge: '', route: '/user/wallet' },
  { id: 3, text: '收藏', icon: 'mdi:heart', badge: '12', route: '/user/favorites' },
  { id: 4, text: '浏览记录', icon: 'mdi:history', badge: '', route: '/user/history' },
  { id: 5, text: '预约', icon: 'mdi:calendar-clock', badge: '', route: '/appointment/list' },
  { id: 6, text: '消息通知', icon: 'mdi:bell', badge: '3', route: '/notifications' }
])

// 当前激活的tab
const activeTab = ref('generations')

// 子组件引用
const generationsTab = ref<InstanceType<typeof GenerationsTabContent>>()
const agentsTab = ref<InstanceType<typeof AgentsTabContent>>()
const voicesTab = ref<InstanceType<typeof VoicesTabContent>>()
const cameosTab = ref<InstanceType<typeof CameosTabContent>>()

// 处理header cell点击
const handleHeaderClick = () => {
  router.push('/user/profile')
}

// 处理网格项点击
const handleGridItemClick = (item: any) => {
  showToast(`点击了：${item.text}`)
  
  // 根据不同的网格项执行路由跳转
  if (item.route) {
    router.push(item.route)
  }
}

// 处理编辑资料
const handleEditProfile = async () => { 
  
  try {
    // 这里可以跳转到编辑页面，或者打开编辑弹窗
    // 暂时模拟编辑操作
    showToast('跳转到编辑资料页面...')
    
    // 模拟更新用户信息
    // await userStore.updateCurrentUser({
    //   nickname: '新昵称',
    //   avatar: 'new-avatar.jpg'
    // })
    
  } catch (error) {
    showToast('编辑资料失败')
  }
}

// 监听主题模式变化
watch(() => themeMode.value, updateTheme)

// 监听系统主题变化
let mediaQuery: MediaQueryList | null = null

// 页面加载时初始化数据
onMounted(() => {
  updateTheme()
  
  // 监听系统主题变化（仅在auto模式下）
  if (themeMode.value === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (themeMode.value === 'auto') {
        isDarkMode.value = mediaQuery?.matches || false
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
  
  // 可以在这里加载用户数据
  console.log('Profile页面已加载')
})

// 暴露方法给父组件
defineExpose({
  refreshData: () => {
    // 根据当前激活的tab刷新对应数据
    switch (activeTab.value) {
      case 'generations':
        generationsTab.value?.refreshData()
        break
      case 'agents':
        agentsTab.value?.refreshData()
        break
      case 'voices':
        voicesTab.value?.refreshData()
        break
      case 'cameos':
        cameosTab.value?.refreshData()
        break
    }
  },
  
  getUserInfo: () => userInfo.value,
  
  // 主题相关方法
  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    themeMode.value = theme
    updateTheme()
  },
  
  getTheme: () => themeMode.value,
  
  isDarkMode: () => isDarkMode.value
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100dvh; 
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.profile-grid-section {   
    margin-top: 10px; 
    margin-bottom: 10px;
} 

// Tab区域样式
.profile-tabs-section { 
  
  // 浅色主题
  &.profile-tabs--light {
    :deep(.van-tabs) {
      --van-tabs-nav-background: #ffffff;
      --van-tab-active-color: #1989fa;
      --van-tab-text-color: #323233;
      --van-tab-disabled-text-color: #c8c9cc;
      --van-tabs-bottom-bar-color: #1989fa;
      --van-tabs-nav-background-color: #ffffff;
      --van-tab-background-color: #ffffff;
    }
    
    :deep(.van-tab) {
      background-color: #ffffff;
      color: #323233;
      
      &.van-tab--active {
        color: #1989fa;
      }
    }
    
    :deep(.van-tabs__nav) {
      background-color: #ffffff;
    }
    
    :deep(.van-tabs__line) {
      background-color: #1989fa;
    }
  }
  
  // 深色主题
  &.profile-tabs--dark {
    :deep(.van-tabs) {
      --van-tabs-nav-background: #1a1a1a;
      --van-tab-active-color: #409eff;
      --van-tab-text-color: #e0e0e0;
      --van-tab-disabled-text-color: #666;
      --van-tabs-bottom-bar-color: #409eff;
      --van-tabs-nav-background-color: #1a1a1a;
      --van-tab-background-color: #1a1a1a;
    }
    
    :deep(.van-tab) {
      background-color: #1a1a1a;
      color: #e0e0e0;
      
      &.van-tab--active {
        color: #409eff;
      }
    }
    
    :deep(.van-tabs__nav) {
      background-color: #1a1a1a;
    }
    
    :deep(.van-tabs__line) {
      background-color: #409eff;
    }
    
    :deep(.van-tabs__content) {
      background-color: #1a1a1a;
      color: #e0e0e0;
    }
  }
}

// 响应式主题切换支持
@media (prefers-color-scheme: dark) {
  .profile-tabs-section:not(.profile-tabs--light):not(.profile-tabs--dark) {
    :deep(.van-tabs) {
      --van-tabs-nav-background: #1a1a1a;
      --van-tab-active-color: #409eff;
      --van-tab-text-color: #e0e0e0;
      --van-tab-disabled-text-color: #666;
      --van-tabs-bottom-bar-color: #409eff;
      --van-tabs-nav-background-color: #1a1a1a;
      --van-tab-background-color: #1a1a1a;
    }
    
    :deep(.van-tab) {
      background-color: #1a1a1a;
      color: #e0e0e0;
      
      &.van-tab--active {
        color: #409eff;
      }
    }
    
    :deep(.van-tabs__nav) {
      background-color: #1a1a1a;
    }
    
    :deep(.van-tabs__line) {
      background-color: #409eff;
    }
    
    :deep(.van-tabs__content) {
      background-color: #1a1a1a;
      color: #e0e0e0;
    }
  }
}

@media (prefers-color-scheme: light) {
  .profile-tabs-section:not(.profile-tabs--light):not(.profile-tabs--dark) {
    :deep(.van-tabs) {
      --van-tabs-nav-background: #ffffff;
      --van-tab-active-color: #1989fa;
      --van-tab-text-color: #323233;
      --van-tab-disabled-text-color: #c8c9cc;
      --van-tabs-bottom-bar-color: #1989fa;
      --van-tabs-nav-background-color: #ffffff;
      --van-tab-background-color: #ffffff;
    }
    
    :deep(.van-tab) {
      background-color: #ffffff;
      color: #323233;
      
      &.van-tab--active {
        color: #1989fa;
      }
    }
    
    :deep(.van-tabs__nav) {
      background-color: #ffffff;
    }
    
    :deep(.van-tabs__line) {
      background-color: #1989fa;
    }
  }
}
</style>