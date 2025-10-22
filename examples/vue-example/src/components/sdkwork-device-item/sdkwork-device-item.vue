<template>
  <div
    class="sdkwork-device-item"
    :class="[
      {
        'sdkwork-device-item--selected': isSelected,
        'sdkwork-device-item--clickable': clickable,
        'sdkwork-device-item--bordered': showBorderBottom
      },
      themeClass
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 设备头像区域 -->
    <div class="sdkwork-device-item__avatar">
      <van-image
        :src="device.avatar"
        width="48"
        height="48"
        radius="8"
        fit="cover"
      >
        <template v-slot:error>
          <div class="sdkwork-device-item__avatar-placeholder">
            <van-icon :name="getDeviceTypeIcon(device.type)" size="20" />
          </div>
        </template>
      </van-image>
      
      <!-- 设备状态指示器 -->
      <div class="sdkwork-device-item__status" :class="device.status"></div>
    </div>
    
    <!-- 设备内容区域 -->
    <div class="sdkwork-device-item__content">
      <div class="sdkwork-device-item__header">
        <div class="sdkwork-device-item__name">
          {{ device.name }}
        </div>
        <div class="sdkwork-device-item__time">
          {{ device.lastUpdate }}
        </div>
      </div>
      
      <div class="sdkwork-device-item__info">
        <div class="sdkwork-device-item__location">
          <van-icon name="location-o" size="12" />
          <span>{{ device.location || '未知位置' }}</span>
        </div>
        
        <div v-if="device.temperature !== undefined" class="sdkwork-device-item__sensor">
          <van-icon name="fire-o" size="12" />
          <span>{{ device.temperature }}°C</span>
        </div>
        
        <div v-if="device.humidity !== undefined" class="sdkwork-device-item__sensor">
          <van-icon name="water-o" size="12" />
          <span>{{ device.humidity }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 设备操作区域 -->
    <div class="sdkwork-device-item__actions">
      <van-button
        
        :type="getActionType(device.status)"
        @click.stop="handleQuickAction"
      >
        {{ getActionLabel(device.status) }}
      </van-button>
    </div>

    <!-- 选中状态指示器 -->
    <div v-if="isSelected" class="sdkwork-device-item__selected-indicator">
      <van-icon name="success" size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 设备接口定义
export interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  avatar: string
  lastUpdate: string
  location?: string
  temperature?: number
  humidity?: number
  description?: string
  tags?: string[]
  createdTime?: string
  updatedTime?: string
  isActive?: boolean
  owner?: string
}

// 组件属性定义
interface Props {
  /** 设备数据 */
  device: Device
  /** 是否选中 */
  isSelected?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  clickable: true,
  showBorderBottom: true,
  themeMode: 'auto'
})

// 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  "click-item": [device: Device]
  /** 选择事件 */
  "select-item": [device: Device]
}>()

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
  return isDarkMode.value ? 'sdkwork-device-item--dark' : 'sdkwork-device-item--light'
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  cursor: props.clickable ? 'pointer' : 'default'
}))

// 设备类型图标映射
const getDeviceTypeIcon = (type: string) => {
  const icons = {
    'air-conditioner': 'air-conditioner',
    'door-lock': 'lock',
    'light': 'bulb-o',
    'sensor': 'bar-chart-o',
    'camera': 'video-o',
    'default': 'setting-o'
  }
  return icons[type as keyof typeof icons] || 'setting-o'
}

// 操作按钮类型
const getActionType = (status: string): any => {
  const types = {
    'online': 'success',
    'offline': 'warning',
    'error': 'danger'
  }
  return types[status as keyof typeof types] || 'default'
}

// 操作按钮标签
const getActionLabel = (status: string) => {
  const labels = {
    'online': '控制',
    'offline': '重连',
    'error': '修复'
  }
  return labels[status as keyof typeof labels] || '查看'
}

// 处理点击事件
const handleClick = (event: Event) => {
  if (props.clickable) {
    emit('click-item', props.device)
    emit('select-item', props.device) 
  }
}

// 快速操作
const handleQuickAction = () => {
  console.log('执行快速操作', props.device)
}

// 暴露方法
defineExpose({
  /** 获取设备信息 */
  getDevice: () => props.device,
  /** 是否选中 */
  isSelected: () => props.isSelected
})
</script>

<style scoped lang="scss">
.sdkwork-device-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 88px;
  box-shadow: 0 1px 3px var(--sdkwork-device-item-shadow-color, rgba(0, 0, 0, 0.05));

  // 点击效果
  &--clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--sdkwork-device-item-shadow-color, rgba(0, 0, 0, 0.15));
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px var(--sdkwork-device-item-shadow-color, rgba(0, 0, 0, 0.1));
    }
  }

  // 选中状态
  &--selected {
    background-color: var(--sdkwork-device-item-selected-bg, #f0f8ff);
    border: 2px solid var(--sdkwork-device-item-selected-border, #1890ff);
    box-shadow: 0 2px 8px var(--sdkwork-device-item-selected-shadow, rgba(24, 144, 255, 0.2));
  }

  // 底部边框
  &--bordered {
    border-bottom: 1px solid var(--sdkwork-device-item-border-color, #f0f0f0);
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: none;
    
    &:last-child {
      border-bottom: none;
    }
  }

  // 头像区域
  &__avatar {
    position: relative;
    margin-right: 16px;
    flex-shrink: 0;
    
    &-placeholder {
      width: 52px;
      height: 52px;
      background: var(--sdkwork-device-item-avatar-bg, #f0f2f5);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--sdkwork-device-item-avatar-color, #999);
      transition: all 0.3s ease;
    }
  }

  // 状态指示器
  &__status {
    position: absolute;
    bottom: -3px;
    right: -3px;
    width: 14px;
    height: 14px;
    border: 2px solid var(--sdkwork-device-item-status-border, #fff);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &.online {
      background: var(--van-success-color);
      animation: pulse 2s infinite;
    }
    
    &.offline {
      background: var(--van-warning-color);
    }
    
    &.error {
      background: var(--van-danger-color);
      animation: blink 1.5s infinite;
    }
  }

  // 内容区域
  &__content {
    flex: 1;
    min-width: 0;
    
    // 头部
    .sdkwork-device-item__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      gap: 8px;
      
      .sdkwork-device-item__name {
        font-size: 17px;
        font-weight: 600;
        color: var(--sdkwork-device-item-name-color, #333);
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
      }
      
      .sdkwork-device-item__time {
        font-size: 12px;
        color: var(--sdkwork-device-item-time-color, #999);
        flex-shrink: 0;
        padding: 2px 6px;
        background: var(--sdkwork-device-item-time-bg, #f5f5f5);
        border-radius: 4px;
        font-weight: 400;
      }
    }

    // 信息区域
    .sdkwork-device-item__info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      
      .sdkwork-device-item__location,
      .sdkwork-device-item__sensor {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--sdkwork-device-item-info-color, #666);
        padding: 4px 8px;
        background: var(--sdkwork-device-item-info-bg, #f8f9fa);
        border-radius: 6px;
        transition: all 0.2s ease;
        
        .van-icon {
          color: var(--sdkwork-device-item-icon-color, #999);
          transition: color 0.2s ease;
        }
        
        &:hover {
          background: var(--sdkwork-device-item-info-hover-bg, #e9ecef);
          
          .van-icon {
            color: var(--sdkwork-device-item-icon-hover-color, #666);
          }
        }
      }
    }
  }

  // 操作区域
  &__actions {
    margin-left: 16px;
    flex-shrink: 0;
    
    .van-button {
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:hover {
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }

  // 选中指示器
  &__selected-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
    color: var(--van-success-color);
    background: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

// 浅色主题
.sdkwork-device-item--light {
  --sdkwork-device-item-bg: #fff;
  --sdkwork-device-item-shadow-color: rgba(0, 0, 0, 0.1);
  --sdkwork-device-item-selected-bg: #f0f8ff;
  --sdkwork-device-item-selected-border: #1890ff;
  --sdkwork-device-item-selected-shadow: rgba(24, 144, 255, 0.2);
  --sdkwork-device-item-border-color: #f0f0f0;
  --sdkwork-device-item-avatar-bg: #f0f2f5;
  --sdkwork-device-item-avatar-color: #999;
  --sdkwork-device-item-status-border: #fff;
  --sdkwork-device-item-name-color: #333;
  --sdkwork-device-item-time-color: #999;
  --sdkwork-device-item-time-bg: #f5f5f5;
  --sdkwork-device-item-info-color: #666;
  --sdkwork-device-item-info-bg: #f8f9fa;
  --sdkwork-device-item-info-hover-bg: #e9ecef;
  --sdkwork-device-item-icon-color: #999;
  --sdkwork-device-item-icon-hover-color: #666;

  background-color: var(--sdkwork-device-item-bg);
}

// 深色主题
.sdkwork-device-item--dark {
  --sdkwork-device-item-bg: #1a1a1a;
  --sdkwork-device-item-shadow-color: rgba(0, 0, 0, 0.3);
  --sdkwork-device-item-selected-bg: #1a3a5a;
  --sdkwork-device-item-selected-border: #1890ff;
  --sdkwork-device-item-selected-shadow: rgba(24, 144, 255, 0.3);
  --sdkwork-device-item-border-color: #3a3a3a;
  --sdkwork-device-item-avatar-bg: #2a2a2a;
  --sdkwork-device-item-avatar-color: #888;
  --sdkwork-device-item-status-border: #1a1a1a;
  --sdkwork-device-item-name-color: #e0e0e0;
  --sdkwork-device-item-time-color: #888;
  --sdkwork-device-item-time-bg: #2a2a2a;
  --sdkwork-device-item-info-color: #aaa;
  --sdkwork-device-item-info-bg: #2a2a2a;
  --sdkwork-device-item-info-hover-bg: #3a3a3a;
  --sdkwork-device-item-icon-color: #888;
  --sdkwork-device-item-icon-hover-color: #aaa;

  background-color: var(--sdkwork-device-item-bg);
}

// 动画定义
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-device-item {
    padding: 14px 12px;
    min-height: 80px;
    border-radius: 10px;
    
    &__avatar {
      margin-right: 12px;
      
      &-placeholder {
        width: 48px;
        height: 48px;
      }
    }
    
    &__status {
      width: 12px;
      height: 12px;
      bottom: -2px;
      right: -2px;
    }
    
    &__actions {
      margin-left: 12px;
      
      .van-button {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
    
    .sdkwork-device-item__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      margin-bottom: 6px;
      
      .sdkwork-device-item__name {
        font-size: 16px;
      }
      
      .sdkwork-device-item__time {
        font-size: 11px;
        padding: 1px 4px;
      }
    }
    
    .sdkwork-device-item__info {
      gap: 8px;
      
      .sdkwork-device-item__location,
      .sdkwork-device-item__sensor {
        font-size: 12px;
        padding: 3px 6px;
        gap: 4px;
      }
    }
    
    &__selected-indicator {
      top: 14px;
      right: 14px;
      width: 18px;
      height: 18px;
    }
  }
}

// 超小屏幕优化
@media (max-width: 480px) {
  .sdkwork-device-item {
    padding: 12px 10px;
    
    &__avatar {
      margin-right: 10px;
      
      &-placeholder {
        width: 44px;
        height: 44px;
      }
    }
    
    .sdkwork-device-item__header {
      .sdkwork-device-item__name {
        font-size: 15px;
      }
    }
    
    .sdkwork-device-item__info {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      
      .sdkwork-device-item__location,
      .sdkwork-device-item__sensor {
        width: 100%;
        justify-content: flex-start;
      }
    }
    
    &__actions {
      .van-button {
        font-size: 11px;
        padding: 3px 6px;
      }
    }
  }
}
</style>