import { defineStore } from 'pinia'
import type { Notification } from './types'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0
  }),

  getters: {
    unreadNotifications: (state) => {
      return state.notifications.filter(notification => !notification.read)
    },
    
    readNotifications: (state) => {
      return state.notifications.filter(notification => notification.read)
    },
    
    getNotificationsByType: (state) => (type: Notification['type']) => {
      return state.notifications.filter(notification => notification.type === type)
    }
  },

  actions: {
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      }
      
      this.notifications.unshift(newNotification)
      this.unreadCount++
    },
    
    markAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--
      }
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        if (!notification.read) {
          notification.read = true
        }
      })
      this.unreadCount = 0
    },
    
    removeNotification(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        this.unreadCount--
      }
      this.notifications = this.notifications.filter(n => n.id !== notificationId)
    },
    
    clearAll() {
      this.notifications = []
      this.unreadCount = 0
    },
    
    // 初始化一些示例通知
    initializeSampleNotifications() {
      this.notifications = [
        {
          id: '1',
          title: '设备离线提醒',
          message: '智能灯泡已离线超过2小时',
          type: 'warning',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
          read: false
        },
        {
          id: '2',
          title: '固件更新可用',
          message: '智能门锁有新版本固件v2.2.0可用',
          type: 'info',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
          read: true
        },
        {
          id: '3',
          title: '温度异常',
          message: '客厅温度超过设定阈值',
          type: 'error',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1小时前
          read: false
        }
      ]
      
      this.unreadCount = this.notifications.filter(n => !n.read).length
    }
  }
})