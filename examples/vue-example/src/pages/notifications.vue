<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 通知列表 -->
    <sdkwork-notification-list
      :api="notificationApi"
      :searchable="false"
      :deletable="true"
      @select="handleNotificationSelect"
      @delete="handleNotificationDelete"
      @read="handleNotificationRead"
      @action="handleNotificationAction"
      @click="handleNotificationClick"
      @search="handleNotificationSearch"
      @load="handleNotificationLoad"
      ref="notificationListRef"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkNotificationList from '@/components/sdkwork-notification-list/sdkwork-notification-list.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import type { Notification, NotificationPage, NotificationPageable, NotificationQueryParams } from '@/components/sdkwork-notification-list/types'

definePage({
    meta: {
        title: '通知'
    }
})

// API引用
const notificationListRef = ref<InstanceType<typeof SdkworkNotificationList>>()

// 页面加载处理
const handlePageLoad = () => {
  console.log('通知页面已加载')
}

// 模拟通知API
const notificationApi = async (params: NotificationPageable): Promise<NotificationPage|any >=> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟通知数据
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: '系统通知',
      content: '您的账户已成功创建，欢迎使用我们的服务',
      type: 'info',
      status: 'unread',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'medium'
    },
    {
      id: '2',
      title: '订单状态更新',
      content: '您的订单 #12345 已发货，预计明天送达',
      type: 'success',
      status: 'read',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      priority: 'high'
    },
    {
      id: '3',
      title: '安全提醒',
      content: '检测到异常登录活动，请及时检查账户安全',
      type: 'warning',
      status: 'unread',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      priority: 'high'
    },
    {
      id: '4',
      title: '版本更新',
      content: '新版本 v2.1.0 已发布，包含多项功能优化',
      type: 'info',
      status: 'read',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      priority: 'low'
    },
    {
      id: '5',
      title: '支付成功',
      content: '您的支付已成功处理，金额：¥199.00',
      type: 'success',
      status: 'read',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      priority: 'medium'
    }
  ]

  // 模拟分页逻辑
  const page = params.page || 0
  const size = params.size || 10
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = mockNotifications.slice(startIndex, endIndex)

  return {
    content,
    totalElements: mockNotifications.length,
    totalPages: Math.ceil(mockNotifications.length / size),
    size,
    number: page,
    first: page === 0,
    last: endIndex >= mockNotifications.length,
    numberOfElements: content.length,
    empty: content.length === 0
  }
}

// 事件处理
const handleNotificationSelect = (notification: Notification) => {
  console.log('选择通知:', notification)
}

const handleNotificationDelete = (notification: Notification) => {
  console.log('删除通知:', notification)
  // 在实际应用中，这里应该调用API删除通知
}

const handleNotificationRead = (notification: Notification) => {
  console.log('标记为已读:', notification)
  // 在实际应用中，这里应该调用API标记通知为已读
}

const handleNotificationAction = (notification: Notification) => {
  console.log('执行通知动作:', notification)
  // 处理通知的特定动作
}

const handleNotificationClick = (notification: Notification) => {
  console.log('点击通知:', notification)
  // 标记为已读
  handleNotificationRead(notification)
}

const handleNotificationSearch = (keyword: string) => {
  console.log('搜索通知:', keyword)
}

const handleNotificationLoad = (pageData: NotificationPage) => {
  console.log('加载通知数据:', pageData)
}

// 操作栏功能
const handleMarkAllAsRead = () => {
  console.log('标记全部已读')
  // 在实际应用中，这里应该调用API标记所有通知为已读
}

const handleClearAll = () => {
  console.log('清空所有通知')
  // 在实际应用中，这里应该调用API删除所有通知
}
</script>

<style scoped lang="scss">
.notifications-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .notifications-container {
    
    .actions-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      
      .van-button {
        flex: 1;
      }
    }
    
    .notifications-list {
      .loading-section {
        .van-skeleton {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '通知'
  }
}
</route>